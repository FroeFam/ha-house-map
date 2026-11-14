"""HouseMapStore tests."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
import pytest

from custom_components.house_map.const import MAX_FLOORS, MAX_NAME_LENGTH, MAX_NOTES_LENGTH
from custom_components.house_map.store import HouseMapError, HouseMapStore


async def _store(hass: HomeAssistant) -> HouseMapStore:
    store = HouseMapStore(hass)
    await store.async_load()
    return store


async def _place(store: HouseMapStore, floor_id: str, device_id: str = "dev1", **kw) -> dict:
    args = {"x": 1.0, "y": 2.0, "directional": False, "rotation_deg": None, "notes": ""}
    args.update(kw)
    return await store.async_set_placement(device_id, floor_id=floor_id, **args)


# ----- floors -------------------------------------------------------------


async def test_create_update_reorder_delete(hass: HomeAssistant) -> None:
    store = await _store(hass)
    a = await store.async_create_floor("  Ground  ")
    b = await store.async_create_floor("Upstairs")
    assert a["name"] == "Ground"
    assert (a["order"], b["order"]) == (0, 1)
    assert a["svg_file"] is None and a["viewbox"] is None
    assert a["calibration"] == {"units_per_foot": 1.0, "origin_x": 0.0, "origin_y": 0.0}

    updated = await store.async_update_floor(a["id"], name="Main")
    assert updated["name"] == "Main"
    updated = await store.async_update_floor(
        a["id"], calibration={"units_per_foot": 2, "origin_x": 10, "origin_y": 5}
    )
    assert updated["calibration"] == {"units_per_foot": 2.0, "origin_x": 10.0, "origin_y": 5.0}
    # Name is untouched by a calibration-only update.
    assert updated["name"] == "Main"

    await store.async_reorder_floors([b["id"], a["id"]])
    assert [f["id"] for f in store.floors] == [b["id"], a["id"]]
    assert [f["order"] for f in store.floors] == [0, 1]

    removed = await store.async_delete_floor(a["id"], force=False)
    assert removed["id"] == a["id"]
    assert [f["id"] for f in store.floors] == [b["id"]]


async def test_unknown_floor_raises(hass: HomeAssistant) -> None:
    store = await _store(hass)
    with pytest.raises(HouseMapError):
        store.get_floor("nope")
    with pytest.raises(HouseMapError):
        await store.async_update_floor("nope", name="x")
    with pytest.raises(HouseMapError):
        await store.async_delete_floor("nope", force=True)


async def test_reorder_requires_every_floor_once(hass: HomeAssistant) -> None:
    store = await _store(hass)
    a = await store.async_create_floor("A")
    b = await store.async_create_floor("B")
    for bad in ([a["id"]], [a["id"], a["id"]], [a["id"], b["id"], "x"], []):
        with pytest.raises(HouseMapError):
            await store.async_reorder_floors(bad)
    assert [f["id"] for f in store.floors] == [a["id"], b["id"]]


@pytest.mark.parametrize("name", ["", "   ", None, 5])
async def test_invalid_name_rejected(hass: HomeAssistant, name) -> None:
    store = await _store(hass)
    with pytest.raises(HouseMapError):
        await store.async_create_floor(name)
    floor = await store.async_create_floor("ok")
    if name is not None:  # None means "leave the name alone" on update
        with pytest.raises(HouseMapError):
            await store.async_update_floor(floor["id"], name=name)
    assert store.get_floor(floor["id"])["name"] == "ok"


async def test_name_length_limit(hass: HomeAssistant) -> None:
    store = await _store(hass)
    floor = await store.async_create_floor("n" * MAX_NAME_LENGTH)
    assert len(floor["name"]) == MAX_NAME_LENGTH
    with pytest.raises(HouseMapError):
        await store.async_create_floor("n" * (MAX_NAME_LENGTH + 1))
    with pytest.raises(HouseMapError):
        await store.async_update_floor(floor["id"], name="n" * (MAX_NAME_LENGTH + 1))


async def test_max_floors(hass: HomeAssistant) -> None:
    store = await _store(hass)
    for i in range(MAX_FLOORS):
        await store.async_create_floor(f"F{i}")
    with pytest.raises(HouseMapError):
        await store.async_create_floor("one too many")
    assert len(store.floors) == MAX_FLOORS


@pytest.mark.parametrize(
    "calibration",
    [
        {"units_per_foot": 0},
        {"units_per_foot": -1},
        {"units_per_foot": float("nan")},
        {"units_per_foot": float("inf")},
        {"units_per_foot": "abc"},
        {"units_per_foot": None},
        {},
        {"units_per_foot": 1, "origin_x": float("nan")},
        {"units_per_foot": 1, "origin_y": float("inf")},
        {"units_per_foot": 1, "origin_x": "x"},
    ],
)
async def test_invalid_calibration_rejected(hass: HomeAssistant, calibration: dict) -> None:
    store = await _store(hass)
    floor = await store.async_create_floor("F")
    before = store.get_floor(floor["id"])["calibration"]
    with pytest.raises(HouseMapError):
        await store.async_update_floor(floor["id"], calibration=calibration)
    assert store.get_floor(floor["id"])["calibration"] == before


async def test_delete_floor_with_placements(hass: HomeAssistant) -> None:
    store = await _store(hass)
    a = await store.async_create_floor("A")
    b = await store.async_create_floor("B")
    await _place(store, a["id"], "on_a")
    await _place(store, b["id"], "on_b")

    with pytest.raises(HouseMapError):
        await store.async_delete_floor(a["id"], force=False)
    assert "on_a" in store.placements
    assert len(store.floors) == 2

    await store.async_delete_floor(a["id"], force=True)
    assert set(store.placements) == {"on_b"}
    assert [f["id"] for f in store.floors] == [b["id"]]


# ----- placements ---------------------------------------------------------


@pytest.mark.parametrize(
    ("given", "expected"),
    [(450, 90.0), (-90, 270.0), (0, 0.0), (360, 0.0), (720.5, 0.5), (None, 0.0), (359, 359.0)],
)
async def test_rotation_normalized(hass: HomeAssistant, given, expected: float) -> None:
    store = await _store(hass)
    floor = await store.async_create_floor("F")
    placement = await _place(store, floor["id"], directional=True, rotation_deg=given)
    assert placement["rotation_deg"] == expected
    assert placement["directional"] is True


async def test_non_directional_forces_rotation_none(hass: HomeAssistant) -> None:
    store = await _store(hass)
    floor = await store.async_create_floor("F")
    placement = await _place(store, floor["id"], directional=False, rotation_deg=45)
    assert placement["rotation_deg"] is None
    assert store.placements["dev1"]["rotation_deg"] is None


async def test_non_finite_coordinates_and_rotation_rejected(hass: HomeAssistant) -> None:
    store = await _store(hass)
    floor = await store.async_create_floor("F")
    with pytest.raises(HouseMapError):
        await _place(store, floor["id"], x=float("nan"))
    with pytest.raises(HouseMapError):
        await _place(store, floor["id"], y=float("inf"))
    with pytest.raises(HouseMapError):
        await _place(store, floor["id"], directional=True, rotation_deg=float("nan"))
    assert store.placements == {}


async def test_notes_limit(hass: HomeAssistant) -> None:
    store = await _store(hass)
    floor = await store.async_create_floor("F")
    ok = await _place(store, floor["id"], notes="n" * MAX_NOTES_LENGTH)
    assert len(ok["notes"]) == MAX_NOTES_LENGTH
    with pytest.raises(HouseMapError):
        await _place(store, floor["id"], notes="n" * (MAX_NOTES_LENGTH + 1))
    with pytest.raises(HouseMapError):
        await _place(store, floor["id"], notes=123)


async def test_unknown_floor_rejected_for_placement(hass: HomeAssistant) -> None:
    store = await _store(hass)
    with pytest.raises(HouseMapError):
        await _place(store, "missing")
    assert store.placements == {}


async def test_placement_replace_and_delete(hass: HomeAssistant) -> None:
    store = await _store(hass)
    floor = await store.async_create_floor("F")
    await _place(store, floor["id"], x=1.0)
    await _place(store, floor["id"], x=9.0, notes="moved")
    assert store.placements["dev1"]["x"] == 9.0
    assert store.placements["dev1"]["notes"] == "moved"
    await store.async_delete_placement("dev1")
    assert store.placements == {}
    with pytest.raises(HouseMapError):
        await store.async_delete_placement("dev1")


async def test_reads_return_copies(hass: HomeAssistant) -> None:
    store = await _store(hass)
    floor = await store.async_create_floor("F")
    await _place(store, floor["id"])
    store.floors[0]["name"] = "changed"
    store.placements["dev1"]["x"] = 999
    assert store.floors[0]["name"] == "F"
    assert store.placements["dev1"]["x"] == 1.0


# ----- SVG replacement ----------------------------------------------------


async def _floor_with_placement(store: HouseMapStore) -> str:
    floor = await store.async_create_floor("F")
    await store.async_set_floor_svg(floor["id"], "f.svg", [0.0, 0.0, 100.0, 50.0], rescale=False)
    await _place(store, floor["id"], x=50.0, y=25.0)
    return floor["id"]


async def test_set_svg_keep_leaves_coordinates(hass: HomeAssistant) -> None:
    store = await _store(hass)
    floor_id = await _floor_with_placement(store)
    floor = await store.async_set_floor_svg(floor_id, "f.svg", [10.0, 10.0, 200.0, 100.0], rescale=False)
    assert floor["viewbox"] == [10.0, 10.0, 200.0, 100.0]
    assert (store.placements["dev1"]["x"], store.placements["dev1"]["y"]) == (50.0, 25.0)


async def test_set_svg_rescale_exact(hass: HomeAssistant) -> None:
    store = await _store(hass)
    floor_id = await _floor_with_placement(store)
    other = await store.async_create_floor("Other")
    await _place(store, other["id"], "other_dev", x=50.0, y=25.0)

    await store.async_set_floor_svg(floor_id, "f.svg", [10.0, 10.0, 200.0, 100.0], rescale=True)
    moved = store.placements["dev1"]
    # x: 10 + (50 - 0) / 100 * 200 = 110 ; y: 10 + (25 - 0) / 50 * 100 = 60
    assert (moved["x"], moved["y"]) == (110.0, 60.0)
    # Placements on other floors are untouched.
    assert (store.placements["other_dev"]["x"], store.placements["other_dev"]["y"]) == (50.0, 25.0)


async def test_set_svg_rescale_without_old_viewbox_is_noop(hass: HomeAssistant) -> None:
    store = await _store(hass)
    floor = await store.async_create_floor("F")
    await _place(store, floor["id"], x=5.0, y=6.0)
    await store.async_set_floor_svg(floor["id"], "f.svg", [0.0, 0.0, 10.0, 10.0], rescale=True)
    assert (store.placements["dev1"]["x"], store.placements["dev1"]["y"]) == (5.0, 6.0)


# ----- persistence --------------------------------------------------------


async def test_persistence_across_instances(hass: HomeAssistant) -> None:
    store = await _store(hass)
    first = await store.async_create_floor("First")
    second = await store.async_create_floor("Second")
    await store.async_update_floor(
        first["id"], calibration={"units_per_foot": 2, "origin_x": 10, "origin_y": 5}
    )
    await store.async_set_floor_svg(first["id"], "first.svg", [0.0, 0.0, 100.0, 50.0], rescale=False)
    await _place(store, first["id"], "dev1", x=30.0, y=20.0, directional=True, rotation_deg=450, notes="hi")
    await store.async_reorder_floors([second["id"], first["id"]])

    fresh = await _store(hass)
    assert fresh.as_dict() == store.as_dict()
    assert [f["name"] for f in fresh.floors] == ["Second", "First"]
    assert fresh.placements["dev1"]["rotation_deg"] == 90.0
    assert fresh.get_floor(first["id"])["calibration"]["units_per_foot"] == 2.0


async def test_load_empty(hass: HomeAssistant) -> None:
    store = await _store(hass)
    assert store.as_dict() == {"floors": [], "placements": {}}
