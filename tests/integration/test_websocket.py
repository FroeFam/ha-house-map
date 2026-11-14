"""WebSocket API tests."""

from __future__ import annotations

from pathlib import Path

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr

from ..helpers import get_store, svg_bytes, ws_call


def _device(hass: HomeAssistant, entry, key: str = "d1") -> str:
    return (
        dr.async_get(hass)
        .async_get_or_create(config_entry_id=entry.entry_id, identifiers={("test", key)}, name=key)
        .id
    )


async def test_non_admin_cannot_write(
    hass: HomeAssistant, setup_integration, hass_ws_client, hass_read_only_access_token
) -> None:
    store = get_store(hass)
    floor = await store.async_create_floor("F")
    device_id = _device(hass, setup_integration)
    await store.async_set_placement(
        device_id, floor_id=floor["id"], x=1.0, y=1.0, directional=False, rotation_deg=None, notes=""
    )
    ws = await hass_ws_client(hass, access_token=hass_read_only_access_token)

    commands = [
        ("house_map/floor/create", {"name": "X"}),
        ("house_map/floor/update", {"floor_id": floor["id"], "name": "X"}),
        ("house_map/floor/reorder", {"floor_ids": [floor["id"]]}),
        ("house_map/floor/delete", {"floor_id": floor["id"], "force": True}),
        (
            "house_map/placement/set",
            {
                "device_id": device_id,
                "floor_id": floor["id"],
                "x": 2.0,
                "y": 2.0,
                "directional": False,
            },
        ),
        ("house_map/placement/delete", {"device_id": device_id}),
    ]
    for msg_type, fields in commands:
        msg = await ws_call(ws, msg_type, **fields)
        assert msg["success"] is False, msg_type
        assert msg["error"]["code"] == "unauthorized", msg_type

    # Nothing changed.
    assert [f["name"] for f in store.floors] == ["F"]
    assert store.placements[device_id]["x"] == 1.0


async def test_get_for_non_admin_and_admin(
    hass: HomeAssistant, setup_integration, hass_ws_client, hass_read_only_access_token
) -> None:
    await get_store(hass).async_create_floor("F")
    ro = await hass_ws_client(hass, access_token=hass_read_only_access_token)
    msg = await ws_call(ro, "house_map/get")
    assert msg["success"], msg
    assert msg["result"]["is_admin"] is False
    assert [f["name"] for f in msg["result"]["floors"]] == ["F"]
    assert msg["result"]["placements"] == {}
    assert msg["result"]["orphans"] == []

    admin = await hass_ws_client(hass)
    msg = await ws_call(admin, "house_map/get")
    assert msg["result"]["is_admin"] is True


async def test_floor_lifecycle(hass: HomeAssistant, setup_integration, hass_ws_client) -> None:
    ws = await hass_ws_client(hass)
    a = (await ws_call(ws, "house_map/floor/create", name="A"))["result"]["floor"]
    b = (await ws_call(ws, "house_map/floor/create", name="B"))["result"]["floor"]

    msg = await ws_call(
        ws,
        "house_map/floor/update",
        floor_id=a["id"],
        name="Alpha",
        calibration={"units_per_foot": 4, "origin_x": 1, "origin_y": 2},
    )
    assert msg["result"]["floor"]["name"] == "Alpha"
    assert msg["result"]["floor"]["calibration"] == {"units_per_foot": 4.0, "origin_x": 1.0, "origin_y": 2.0}

    msg = await ws_call(ws, "house_map/floor/reorder", floor_ids=[b["id"], a["id"]])
    assert msg["success"], msg
    msg = await ws_call(ws, "house_map/get")
    assert [f["id"] for f in msg["result"]["floors"]] == [b["id"], a["id"]]

    msg = await ws_call(ws, "house_map/floor/reorder", floor_ids=[a["id"]])
    assert msg["success"] is False
    assert msg["error"]["code"] == "invalid_request"

    msg = await ws_call(ws, "house_map/floor/update", floor_id=a["id"], calibration={"units_per_foot": 0})
    assert msg["success"] is False
    assert msg["error"]["code"] == "invalid_request"

    msg = await ws_call(ws, "house_map/floor/create", name="")
    assert msg["success"] is False
    assert msg["error"]["code"] == "invalid_request"


async def test_placement_set_unknown_device_fails(
    hass: HomeAssistant, setup_integration, hass_ws_client
) -> None:
    ws = await hass_ws_client(hass)
    floor = (await ws_call(ws, "house_map/floor/create", name="F"))["result"]["floor"]
    msg = await ws_call(
        ws,
        "house_map/placement/set",
        device_id="no-such-device",
        floor_id=floor["id"],
        x=1.0,
        y=1.0,
        directional=False,
    )
    assert msg["success"] is False
    assert msg["error"]["code"] == "invalid_request"
    assert get_store(hass).placements == {}


async def test_placement_set_and_delete(hass: HomeAssistant, setup_integration, hass_ws_client) -> None:
    ws = await hass_ws_client(hass)
    floor = (await ws_call(ws, "house_map/floor/create", name="F"))["result"]["floor"]
    device_id = _device(hass, setup_integration)

    msg = await ws_call(
        ws,
        "house_map/placement/set",
        device_id=device_id,
        floor_id=floor["id"],
        x=3,
        y=4,
        directional=True,
        rotation_deg=-90,
        notes="n",
    )
    assert msg["success"], msg
    assert msg["result"]["placement"]["rotation_deg"] == 270.0

    msg = await ws_call(ws, "house_map/placement/delete", device_id=device_id)
    assert msg["success"], msg
    msg = await ws_call(ws, "house_map/placement/delete", device_id=device_id)
    assert msg["success"] is False
    assert msg["error"]["code"] == "invalid_request"


async def test_floor_delete_removes_svg_file(
    hass: HomeAssistant, setup_integration, hass_ws_client, hass_client, isolated_config_dir: Path
) -> None:
    ws = await hass_ws_client(hass)
    floor = (await ws_call(ws, "house_map/floor/create", name="F"))["result"]["floor"]
    client = await hass_client()
    resp = await client.post(f"/api/house_map/floors/{floor['id']}/svg?mode=keep", data=svg_bytes())
    assert resp.status == 200
    svg_path = isolated_config_dir / "house_map" / "floors" / f"{floor['id']}.svg"
    assert svg_path.is_file()

    msg = await ws_call(ws, "house_map/floor/delete", floor_id=floor["id"])
    assert msg["success"], msg
    assert not svg_path.exists()
    assert (await ws_call(ws, "house_map/get"))["result"]["floors"] == []


async def test_floor_delete_with_placements_needs_force(
    hass: HomeAssistant, setup_integration, hass_ws_client
) -> None:
    ws = await hass_ws_client(hass)
    floor = (await ws_call(ws, "house_map/floor/create", name="F"))["result"]["floor"]
    device_id = _device(hass, setup_integration)
    await ws_call(
        ws,
        "house_map/placement/set",
        device_id=device_id,
        floor_id=floor["id"],
        x=1.0,
        y=1.0,
        directional=False,
    )

    msg = await ws_call(ws, "house_map/floor/delete", floor_id=floor["id"])
    assert msg["success"] is False
    assert msg["error"]["code"] == "invalid_request"

    msg = await ws_call(ws, "house_map/floor/delete", floor_id=floor["id"], force=True)
    assert msg["success"], msg
    msg = await ws_call(ws, "house_map/get")
    assert msg["result"]["floors"] == []
    assert msg["result"]["placements"] == {}
