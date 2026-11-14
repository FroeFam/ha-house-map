"""End-to-end smoke test: setup, websocket, upload, placement, service."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr

from custom_components.house_map.const import DOMAIN

from ..conftest import SAMPLE_SVG


async def test_full_flow(hass: HomeAssistant, setup_integration, hass_ws_client, hass_client) -> None:
    ws = await hass_ws_client(hass)

    await ws.send_json({"id": 1, "type": "house_map/floor/create", "name": "First Floor"})
    msg = await ws.receive_json()
    assert msg["success"], msg
    floor_id = msg["result"]["floor"]["id"]

    client = await hass_client()
    resp = await client.post(f"/api/house_map/floors/{floor_id}/svg?mode=keep", data=SAMPLE_SVG)
    assert resp.status == 200, await resp.text()
    body = await resp.json()
    assert body["floor"]["viewbox"] == [-13.0, -14.0, 85.0, 70.0]

    resp = await client.get(f"/api/house_map/floors/{floor_id}/svg")
    assert resp.status == 200
    assert resp.content_type == "image/svg+xml"

    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=setup_integration.entry_id,
        identifiers={("test", "motion-1")},
        name="Hall motion",
    )
    await ws.send_json(
        {
            "id": 2,
            "type": "house_map/placement/set",
            "device_id": device.id,
            "floor_id": floor_id,
            "x": 20.0,
            "y": 10.0,
            "directional": True,
            "rotation_deg": 450,
            "notes": "ceiling",
        }
    )
    msg = await ws.receive_json()
    assert msg["success"], msg
    assert msg["result"]["placement"]["rotation_deg"] == 90.0

    result = await hass.services.async_call(DOMAIN, "get_placements", {}, blocking=True, return_response=True)
    [placement] = result["placements"]
    assert placement["device_name"] == "Hall motion"
    assert (placement["x_ft"], placement["y_ft"]) == (20.0, 10.0)
    assert placement["notes"] == "ceiling"
    assert placement["orphan"] is False

    dr.async_get(hass).async_remove_device(device.id)
    await hass.async_block_till_done()
    await ws.send_json({"id": 3, "type": "house_map/get"})
    msg = await ws.receive_json()
    assert msg["result"]["orphans"] == [device.id]
