"""house_map.get_placements service, repair issue and unload tests."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar, device_registry as dr, issue_registry as ir

from custom_components.house_map.const import DOMAIN, ISSUE_ORPHANED_DEVICES

from ..helpers import get_store, ws_call


async def _call(hass: HomeAssistant, **data) -> dict:
    return await hass.services.async_call(DOMAIN, "get_placements", data, blocking=True, return_response=True)


async def _place(
    hass: HomeAssistant, device_id: str, floor_id: str, x: float = 10.0, y: float = 20.0
) -> None:
    await get_store(hass).async_set_placement(
        device_id, floor_id=floor_id, x=x, y=y, directional=False, rotation_deg=None, notes=""
    )


def _device(hass: HomeAssistant, entry, key: str, **kw) -> dr.DeviceEntry:
    return dr.async_get(hass).async_get_or_create(
        config_entry_id=entry.entry_id, identifiers={("test", key)}, name=key, **kw
    )


async def test_floor_filter_by_name_and_id(hass: HomeAssistant, setup_integration) -> None:
    store = get_store(hass)
    ground = await store.async_create_floor("Ground Floor")
    upper = await store.async_create_floor("Upper")
    d1 = _device(hass, setup_integration, "d1")
    d2 = _device(hass, setup_integration, "d2")
    await _place(hass, d1.id, ground["id"])
    await _place(hass, d2.id, upper["id"])

    everything = await _call(hass)
    assert {p["device_id"] for p in everything["placements"]} == {d1.id, d2.id}
    assert [f["name"] for f in everything["floors"]] == ["Ground Floor", "Upper"]
    assert "coordinate_system" in everything

    by_name = await _call(hass, floor="gROUND floor")
    assert [p["device_id"] for p in by_name["placements"]] == [d1.id]
    assert [f["id"] for f in by_name["floors"]] == [ground["id"]]

    by_id = await _call(hass, floor=upper["id"])
    assert [p["device_id"] for p in by_id["placements"]] == [d2.id]

    assert (await _call(hass, floor="nope"))["placements"] == []


async def test_area_filter(hass: HomeAssistant, setup_integration) -> None:
    store = get_store(hass)
    floor = await store.async_create_floor("F")
    area = ar.async_get(hass).async_create("Kitchen")
    in_kitchen = _device(hass, setup_integration, "k")
    elsewhere = _device(hass, setup_integration, "e")
    dr.async_get(hass).async_update_device(in_kitchen.id, area_id=area.id)
    await _place(hass, in_kitchen.id, floor["id"])
    await _place(hass, elsewhere.id, floor["id"])

    for value in ("kitchen", "KITCHEN", area.id):
        result = await _call(hass, area=value)
        [placement] = result["placements"]
        assert placement["device_id"] == in_kitchen.id
        assert placement["area_id"] == area.id
        assert placement["area_name"] == "Kitchen"

    assert (await _call(hass, area="garage"))["placements"] == []


async def test_device_id_filter_and_fields(hass: HomeAssistant, setup_integration) -> None:
    store = get_store(hass)
    floor = await store.async_create_floor("F")
    d1 = _device(hass, setup_integration, "d1", manufacturer="Acme", model="M1")
    d2 = _device(hass, setup_integration, "d2")
    await store.async_set_placement(
        d1.id, floor_id=floor["id"], x=3.0, y=4.0, directional=True, rotation_deg=90, notes="note"
    )
    await _place(hass, d2.id, floor["id"])

    [p] = (await _call(hass, device_id=d1.id))["placements"]
    assert p["device_name"] == "d1"
    assert p["manufacturer"] == "Acme"
    assert p["model"] == "M1"
    assert p["floor_id"] == floor["id"]
    assert p["floor_name"] == "F"
    assert (p["x"], p["y"]) == (3.0, 4.0)
    assert p["directional"] is True
    assert p["rotation_deg"] == 90.0
    assert p["notes"] == "note"
    assert p["orphan"] is False
    assert p["area_id"] is None
    assert "updated" in p

    assert (await _call(hass, device_id="unknown"))["placements"] == []


async def test_name_by_user_wins(hass: HomeAssistant, setup_integration) -> None:
    floor = await get_store(hass).async_create_floor("F")
    device = _device(hass, setup_integration, "d")
    dr.async_get(hass).async_update_device(device.id, name_by_user="Renamed")
    await _place(hass, device.id, floor["id"])
    [p] = (await _call(hass))["placements"]
    assert p["device_name"] == "Renamed"


async def test_feet_with_custom_calibration(hass: HomeAssistant, setup_integration) -> None:
    store = get_store(hass)
    floor = await store.async_create_floor("F")
    await store.async_update_floor(
        floor["id"], calibration={"units_per_foot": 2, "origin_x": 10, "origin_y": 5}
    )
    device = _device(hass, setup_integration, "d")
    await _place(hass, device.id, floor["id"], x=30.0, y=15.0)

    result = await _call(hass)
    [p] = result["placements"]
    assert (p["x"], p["y"]) == (30.0, 15.0)
    assert (p["x_ft"], p["y_ft"]) == (10.0, 5.0)
    assert result["floors"][0]["calibration"] == {"units_per_foot": 2.0, "origin_x": 10.0, "origin_y": 5.0}


async def test_svg_path_in_floors(hass: HomeAssistant, setup_integration) -> None:
    store = get_store(hass)
    with_svg = await store.async_create_floor("A")
    await store.async_create_floor("B")
    await store.async_set_floor_svg(with_svg["id"], "a.svg", [0.0, 0.0, 1.0, 1.0], rescale=False)
    floors = (await _call(hass))["floors"]
    assert floors[0]["svg_path"] == "house_map/floors/a.svg"
    assert floors[1]["svg_path"] is None


async def test_orphan_flag_and_repair_issue(hass: HomeAssistant, setup_integration, hass_ws_client) -> None:
    store = get_store(hass)
    floor = await store.async_create_floor("F")
    device = _device(hass, setup_integration, "d")
    registry = ir.async_get(hass)
    ws = await hass_ws_client(hass)
    msg = await ws_call(
        ws,
        "house_map/placement/set",
        device_id=device.id,
        floor_id=floor["id"],
        x=1.0,
        y=1.0,
        directional=False,
    )
    assert msg["success"], msg
    assert registry.async_get_issue(DOMAIN, ISSUE_ORPHANED_DEVICES) is None

    dr.async_get(hass).async_remove_device(device.id)
    await hass.async_block_till_done()

    [p] = (await _call(hass))["placements"]
    assert p["orphan"] is True
    assert p["device_name"] is None
    assert p["manufacturer"] is None
    issue = registry.async_get_issue(DOMAIN, ISSUE_ORPHANED_DEVICES)
    assert issue is not None
    assert issue.translation_placeholders == {"count": "1"}

    msg = await ws_call(ws, "house_map/placement/delete", device_id=device.id)
    assert msg["success"], msg
    assert registry.async_get_issue(DOMAIN, ISSUE_ORPHANED_DEVICES) is None
    assert (await _call(hass))["placements"] == []


async def test_unload_removes_runtime(hass: HomeAssistant, setup_integration) -> None:
    assert DOMAIN in hass.data
    assert await hass.config_entries.async_unload(setup_integration.entry_id)
    await hass.async_block_till_done()
    assert DOMAIN not in hass.data
