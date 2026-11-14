"""house_map.get_placements: read-only answers for agents and automations."""

from __future__ import annotations

from typing import Any

from homeassistant.core import (
    HomeAssistant,
    ServiceCall,
    ServiceResponse,
    SupportsResponse,
    callback,
)
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import area_registry as ar, device_registry as dr
import voluptuous as vol

from .const import DOMAIN, FLOORS_DIR, SERVICE_GET_PLACEMENTS
from .runtime import get_runtime
from .store import Floor, HouseMapError

SCHEMA = vol.Schema(
    {
        vol.Optional("floor"): str,
        vol.Optional("area"): str,
        vol.Optional("device_id"): str,
    }
)


def _feet(floor: Floor, x: float, y: float) -> tuple[float, float]:
    cal = floor["calibration"]
    return (
        round((x - cal["origin_x"]) / cal["units_per_foot"], 2),
        round((y - cal["origin_y"]) / cal["units_per_foot"], 2),
    )


def build_placements(
    hass: HomeAssistant,
    *,
    floor: str | None = None,
    area: str | None = None,
    device_id: str | None = None,
) -> dict[str, Any]:
    """Join placements with floors and the device and area registries."""
    runtime = get_runtime(hass)
    floors = {f["id"]: f for f in runtime.store.floors}
    devices = dr.async_get(hass)
    areas = ar.async_get(hass)

    floor_filter = floor.casefold() if floor else None
    area_filter = area.casefold() if area else None

    out_floors = [
        {
            "id": f["id"],
            "name": f["name"],
            "order": f["order"],
            "viewbox": f["viewbox"],
            "calibration": f["calibration"],
            "svg_path": f"{FLOORS_DIR}/{f['svg_file']}" if f["svg_file"] else None,
        }
        for f in floors.values()
        if floor_filter is None or floor_filter in (f["id"], f["name"].casefold())
    ]
    allowed_floors = {f["id"] for f in out_floors}

    out: list[dict[str, Any]] = []
    for dev_id, placement in runtime.store.placements.items():
        if device_id is not None and dev_id != device_id:
            continue
        if placement["floor_id"] not in allowed_floors:
            continue
        device = devices.async_get(dev_id)
        area_entry = areas.async_get_area(device.area_id) if device and device.area_id else None
        if area_filter is not None and (
            area_entry is None or area_filter not in (area_entry.id, area_entry.name.casefold())
        ):
            continue
        fl = floors[placement["floor_id"]]
        x_ft, y_ft = _feet(fl, placement["x"], placement["y"])
        out.append(
            {
                "device_id": dev_id,
                "device_name": (device.name_by_user or device.name) if device else None,
                "manufacturer": device.manufacturer if device else None,
                "model": device.model if device else None,
                "area_id": area_entry.id if area_entry else None,
                "area_name": area_entry.name if area_entry else None,
                "floor_id": fl["id"],
                "floor_name": fl["name"],
                "x": placement["x"],
                "y": placement["y"],
                "x_ft": x_ft,
                "y_ft": y_ft,
                "directional": placement["directional"],
                "rotation_deg": placement["rotation_deg"],
                "notes": placement["notes"],
                "updated": placement["updated"],
                "orphan": device is None,
            }
        )
    out.sort(key=lambda p: (floors[p["floor_id"]]["order"], p["area_name"] or "", p["device_name"] or ""))
    return {
        "coordinate_system": (
            "x, y are SVG viewBox units of the floor plan. x_ft, y_ft use the "
            "floor calibration: ft = (unit - origin) / units_per_foot. "
            "rotation_deg is clockwise, 0 = toward the top of the drawing."
        ),
        "floors": out_floors,
        "placements": out,
    }


@callback
def async_register(hass: HomeAssistant) -> None:
    async def handle(call: ServiceCall) -> ServiceResponse:
        try:
            return build_placements(
                hass,
                floor=call.data.get("floor"),
                area=call.data.get("area"),
                device_id=call.data.get("device_id"),
            )
        except HouseMapError as err:
            raise ServiceValidationError(str(err)) from err

    hass.services.async_register(
        DOMAIN,
        SERVICE_GET_PLACEMENTS,
        handle,
        schema=SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )
