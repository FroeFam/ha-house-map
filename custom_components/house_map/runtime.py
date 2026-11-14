"""Runtime state shared by the websocket API, HTTP views and service."""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, issue_registry as ir

from .const import DOMAIN, FLOORS_DIR, ISSUE_ORPHANED_DEVICES
from .store import HouseMapError, HouseMapStore


@dataclass
class HouseMapRuntime:
    """Loaded integration state, stored in hass.data[DOMAIN]."""

    store: HouseMapStore
    floors_path: Path
    orphans: set[str] = field(default_factory=set)


def get_runtime(hass: HomeAssistant) -> HouseMapRuntime:
    runtime = hass.data.get(DOMAIN)
    if runtime is None:
        raise HouseMapError("House Map is not set up")
    return runtime


def floors_path(hass: HomeAssistant) -> Path:
    return Path(hass.config.path(FLOORS_DIR))


def refresh_orphans(hass: HomeAssistant, runtime: HouseMapRuntime) -> None:
    """Recompute placements whose device no longer exists; sync the repair issue."""
    registry = dr.async_get(hass)
    runtime.orphans = {
        device_id for device_id in runtime.store.placements if registry.async_get(device_id) is None
    }
    if runtime.orphans:
        ir.async_create_issue(
            hass,
            DOMAIN,
            ISSUE_ORPHANED_DEVICES,
            is_fixable=False,
            is_persistent=False,
            severity=ir.IssueSeverity.WARNING,
            translation_key=ISSUE_ORPHANED_DEVICES,
            translation_placeholders={"count": str(len(runtime.orphans))},
        )
    else:
        ir.async_delete_issue(hass, DOMAIN, ISSUE_ORPHANED_DEVICES)
