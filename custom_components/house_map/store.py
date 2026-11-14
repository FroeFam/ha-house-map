"""Persistent storage for floors and device placements.

Schema (version 1), stored by HA in .storage/house_map:

    {
      "floors": [
        {"id": str, "name": str, "order": int,
         "svg_file": str | None,                 # file name in FLOORS_DIR
         "viewbox": [min_x, min_y, width, height] | None,
         "calibration": {"units_per_foot": float,
                         "origin_x": float, "origin_y": float}}
      ],
      "placements": {
        "<device_id>": {"floor_id": str, "x": float, "y": float,
                        "directional": bool, "rotation_deg": float | None,
                        "notes": str, "updated": iso8601 str}
      }
    }

Coordinates x, y are in the floor SVG's viewBox user units. Rotation is
degrees clockwise, 0 = toward the top of the drawing.
"""

from __future__ import annotations

import copy
import math
from typing import Any, TypedDict

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util
from homeassistant.util.ulid import ulid_now

from .const import (
    MAX_FLOORS,
    MAX_NAME_LENGTH,
    MAX_NOTES_LENGTH,
    STORAGE_KEY,
    STORAGE_VERSION,
)


class Calibration(TypedDict):
    units_per_foot: float
    origin_x: float
    origin_y: float


class Floor(TypedDict):
    id: str
    name: str
    order: int
    svg_file: str | None
    viewbox: list[float] | None
    calibration: Calibration


class Placement(TypedDict):
    floor_id: str
    x: float
    y: float
    directional: bool
    rotation_deg: float | None
    notes: str
    updated: str


class HouseMapError(ValueError):
    """Raised for invalid requests against the store."""


def default_calibration() -> Calibration:
    return {"units_per_foot": 1.0, "origin_x": 0.0, "origin_y": 0.0}


def _finite(value: Any, field: str) -> float:
    try:
        number = float(value)
    except (TypeError, ValueError) as err:
        raise HouseMapError(f"{field} must be a number") from err
    if not math.isfinite(number):
        raise HouseMapError(f"{field} must be finite")
    return number


def _clean_name(name: Any) -> str:
    if not isinstance(name, str) or not name.strip():
        raise HouseMapError("name must be a non-empty string")
    name = name.strip()
    if len(name) > MAX_NAME_LENGTH:
        raise HouseMapError(f"name is longer than {MAX_NAME_LENGTH} characters")
    return name


class HouseMapStore:
    """Owns the house map data and its persistence."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY, minor_version=1)
        self._floors: list[Floor] = []
        self._placements: dict[str, Placement] = {}

    async def async_load(self) -> None:
        data = await self._store.async_load() or {}
        self._floors = data.get("floors", [])
        self._placements = data.get("placements", {})
        self._sort_floors()

    async def _async_save(self) -> None:
        await self._store.async_save({"floors": self._floors, "placements": self._placements})

    def _sort_floors(self) -> None:
        self._floors.sort(key=lambda f: f["order"])

    # ----- reads --------------------------------------------------------

    @property
    def floors(self) -> list[Floor]:
        return copy.deepcopy(self._floors)

    @property
    def placements(self) -> dict[str, Placement]:
        return copy.deepcopy(self._placements)

    def get_floor(self, floor_id: str) -> Floor:
        for floor in self._floors:
            if floor["id"] == floor_id:
                return floor
        raise HouseMapError(f"Unknown floor {floor_id}")

    def as_dict(self) -> dict[str, Any]:
        return {"floors": self.floors, "placements": self.placements}

    # ----- floors -------------------------------------------------------

    async def async_create_floor(self, name: str) -> Floor:
        if len(self._floors) >= MAX_FLOORS:
            raise HouseMapError(f"At most {MAX_FLOORS} floors are allowed")
        floor: Floor = {
            "id": ulid_now().lower(),
            "name": _clean_name(name),
            "order": max((f["order"] for f in self._floors), default=-1) + 1,
            "svg_file": None,
            "viewbox": None,
            "calibration": default_calibration(),
        }
        self._floors.append(floor)
        await self._async_save()
        return copy.deepcopy(floor)

    async def async_update_floor(
        self,
        floor_id: str,
        *,
        name: str | None = None,
        calibration: dict[str, Any] | None = None,
    ) -> Floor:
        floor = self.get_floor(floor_id)
        if name is not None:
            floor["name"] = _clean_name(name)
        if calibration is not None:
            units = _finite(calibration.get("units_per_foot"), "units_per_foot")
            if units <= 0:
                raise HouseMapError("units_per_foot must be positive")
            floor["calibration"] = {
                "units_per_foot": units,
                "origin_x": _finite(calibration.get("origin_x", 0), "origin_x"),
                "origin_y": _finite(calibration.get("origin_y", 0), "origin_y"),
            }
        await self._async_save()
        return copy.deepcopy(floor)

    async def async_reorder_floors(self, floor_ids: list[str]) -> None:
        if sorted(floor_ids) != sorted(f["id"] for f in self._floors):
            raise HouseMapError("floor_ids must list every floor exactly once")
        for index, floor_id in enumerate(floor_ids):
            self.get_floor(floor_id)["order"] = index
        self._sort_floors()
        await self._async_save()

    async def async_delete_floor(self, floor_id: str, *, force: bool) -> Floor:
        floor = self.get_floor(floor_id)
        on_floor = [d for d, p in self._placements.items() if p["floor_id"] == floor_id]
        if on_floor and not force:
            raise HouseMapError(f"Floor has {len(on_floor)} placed devices; pass force to delete them")
        for device_id in on_floor:
            del self._placements[device_id]
        self._floors.remove(floor)
        await self._async_save()
        return floor

    async def async_set_floor_svg(
        self, floor_id: str, svg_file: str, viewbox: list[float], *, rescale: bool
    ) -> Floor:
        """Record a new SVG for a floor; optionally rescale its placements."""
        floor = self.get_floor(floor_id)
        old = floor["viewbox"]
        if rescale and old is not None and old != viewbox:
            for placement in self._placements.values():
                if placement["floor_id"] != floor_id:
                    continue
                placement["x"] = viewbox[0] + (placement["x"] - old[0]) / old[2] * viewbox[2]
                placement["y"] = viewbox[1] + (placement["y"] - old[1]) / old[3] * viewbox[3]
        floor["svg_file"] = svg_file
        floor["viewbox"] = viewbox
        await self._async_save()
        return copy.deepcopy(floor)

    # ----- placements ---------------------------------------------------

    async def async_set_placement(
        self,
        device_id: str,
        *,
        floor_id: str,
        x: float,
        y: float,
        directional: bool,
        rotation_deg: float | None,
        notes: str,
    ) -> Placement:
        self.get_floor(floor_id)
        if not isinstance(notes, str):
            raise HouseMapError("notes must be a string")
        if len(notes) > MAX_NOTES_LENGTH:
            raise HouseMapError(f"notes are longer than {MAX_NOTES_LENGTH} characters")
        rotation: float | None = None
        if directional:
            rotation = _finite(rotation_deg if rotation_deg is not None else 0, "rotation_deg") % 360
        placement: Placement = {
            "floor_id": floor_id,
            "x": _finite(x, "x"),
            "y": _finite(y, "y"),
            "directional": bool(directional),
            "rotation_deg": rotation,
            "notes": notes,
            "updated": dt_util.utcnow().isoformat(),
        }
        self._placements[device_id] = placement
        await self._async_save()
        return copy.deepcopy(placement)

    async def async_delete_placement(self, device_id: str) -> None:
        if device_id not in self._placements:
            raise HouseMapError(f"Device {device_id} is not placed")
        del self._placements[device_id]
        await self._async_save()
