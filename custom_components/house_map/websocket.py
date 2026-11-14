"""WebSocket API used by the House Map panel.

Reads are open to any authenticated user. Every write requires admin.

house_map/get                 -> {floors, placements, orphans, is_admin}
house_map/floor/create        {name}                         -> {floor}
house_map/floor/update        {floor_id, name?, calibration?} -> {floor}
house_map/floor/reorder       {floor_ids}                    -> {}
house_map/floor/delete        {floor_id, force?}             -> {}
house_map/placement/set       {device_id, floor_id, x, y,
                               directional, rotation_deg?, notes?} -> {placement}
house_map/placement/delete    {device_id}                    -> {}
"""

from __future__ import annotations

from contextlib import suppress
from typing import Any

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr
import voluptuous as vol

from .runtime import get_runtime, refresh_orphans
from .store import HouseMapError

ERR_INVALID = "invalid_request"

_CALIBRATION = vol.Schema(
    {
        vol.Required("units_per_foot"): vol.Coerce(float),
        vol.Optional("origin_x", default=0.0): vol.Coerce(float),
        vol.Optional("origin_y", default=0.0): vol.Coerce(float),
    }
)


@callback
def async_register(hass: HomeAssistant) -> None:
    for command in (
        ws_get,
        ws_floor_create,
        ws_floor_update,
        ws_floor_reorder,
        ws_floor_delete,
        ws_placement_set,
        ws_placement_delete,
    ):
        websocket_api.async_register_command(hass, command)


def _snapshot(hass: HomeAssistant) -> dict[str, Any]:
    runtime = get_runtime(hass)
    return {**runtime.store.as_dict(), "orphans": sorted(runtime.orphans)}


@websocket_api.websocket_command({vol.Required("type"): "house_map/get"})
@callback
def ws_get(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    try:
        result = _snapshot(hass)
    except HouseMapError as err:
        connection.send_error(msg["id"], ERR_INVALID, str(err))
        return
    connection.send_result(msg["id"], {**result, "is_admin": connection.user.is_admin})


async def _run(connection: websocket_api.ActiveConnection, msg: dict, coro) -> None:
    try:
        result = await coro
    except HouseMapError as err:
        connection.send_error(msg["id"], ERR_INVALID, str(err))
        return
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command({vol.Required("type"): "house_map/floor/create", vol.Required("name"): str})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_floor_create(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    async def do() -> dict:
        floor = await get_runtime(hass).store.async_create_floor(msg["name"])
        return {"floor": floor}

    await _run(connection, msg, do())


@websocket_api.websocket_command(
    {
        vol.Required("type"): "house_map/floor/update",
        vol.Required("floor_id"): str,
        vol.Optional("name"): str,
        vol.Optional("calibration"): _CALIBRATION,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_floor_update(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    async def do() -> dict:
        floor = await get_runtime(hass).store.async_update_floor(
            msg["floor_id"], name=msg.get("name"), calibration=msg.get("calibration")
        )
        return {"floor": floor}

    await _run(connection, msg, do())


@websocket_api.websocket_command(
    {vol.Required("type"): "house_map/floor/reorder", vol.Required("floor_ids"): [str]}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_floor_reorder(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    async def do() -> dict:
        await get_runtime(hass).store.async_reorder_floors(msg["floor_ids"])
        return {}

    await _run(connection, msg, do())


@websocket_api.websocket_command(
    {
        vol.Required("type"): "house_map/floor/delete",
        vol.Required("floor_id"): str,
        vol.Optional("force", default=False): bool,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_floor_delete(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    async def do() -> dict:
        runtime = get_runtime(hass)
        floor = await runtime.store.async_delete_floor(msg["floor_id"], force=msg["force"])
        if floor["svg_file"]:
            path = runtime.floors_path / floor["svg_file"]

            def _unlink() -> None:
                with suppress(FileNotFoundError):
                    path.unlink()

            await hass.async_add_executor_job(_unlink)
        refresh_orphans(hass, runtime)
        return {}

    await _run(connection, msg, do())


@websocket_api.websocket_command(
    {
        vol.Required("type"): "house_map/placement/set",
        vol.Required("device_id"): str,
        vol.Required("floor_id"): str,
        vol.Required("x"): vol.Coerce(float),
        vol.Required("y"): vol.Coerce(float),
        vol.Required("directional"): bool,
        vol.Optional("rotation_deg"): vol.Any(None, vol.Coerce(float)),
        vol.Optional("notes", default=""): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_placement_set(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    async def do() -> dict:
        runtime = get_runtime(hass)
        device_id = msg["device_id"]
        if dr.async_get(hass).async_get(device_id) is None:
            raise HouseMapError(f"Unknown device {device_id}")
        placement = await runtime.store.async_set_placement(
            device_id,
            floor_id=msg["floor_id"],
            x=msg["x"],
            y=msg["y"],
            directional=msg["directional"],
            rotation_deg=msg.get("rotation_deg"),
            notes=msg["notes"],
        )
        refresh_orphans(hass, runtime)
        return {"placement": placement}

    await _run(connection, msg, do())


@websocket_api.websocket_command(
    {vol.Required("type"): "house_map/placement/delete", vol.Required("device_id"): str}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_placement_delete(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    async def do() -> dict:
        runtime = get_runtime(hass)
        await runtime.store.async_delete_placement(msg["device_id"])
        refresh_orphans(hass, runtime)
        return {}

    await _run(connection, msg, do())
