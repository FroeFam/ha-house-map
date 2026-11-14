"""HTTP view tests."""

from __future__ import annotations

from pathlib import Path

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr

from ..conftest import SAMPLE_SVG
from ..helpers import get_store, svg_bytes, ws_call


async def _floor(hass: HomeAssistant) -> str:
    return (await get_store(hass).async_create_floor("F"))["id"]


def _svg_path(config_dir: Path, floor_id: str) -> Path:
    return config_dir / "house_map" / "floors" / f"{floor_id}.svg"


async def test_post_as_non_admin_forbidden(
    hass: HomeAssistant,
    setup_integration,
    hass_client,
    hass_read_only_access_token,
    isolated_config_dir: Path,
) -> None:
    floor_id = await _floor(hass)
    client = await hass_client(hass_read_only_access_token)
    resp = await client.post(f"/api/house_map/floors/{floor_id}/svg?mode=keep", data=svg_bytes())
    assert resp.status == 403
    assert not _svg_path(isolated_config_dir, floor_id).exists()
    assert get_store(hass).get_floor(floor_id)["svg_file"] is None


async def test_get_without_auth_unauthorized(
    hass: HomeAssistant, setup_integration, hass_client_no_auth
) -> None:
    floor_id = await _floor(hass)
    client = await hass_client_no_auth()
    resp = await client.get(f"/api/house_map/floors/{floor_id}/svg")
    assert resp.status == 401
    resp = await client.post(f"/api/house_map/floors/{floor_id}/svg?mode=keep", data=svg_bytes())
    assert resp.status == 401


async def test_get_as_non_admin_after_upload(
    hass: HomeAssistant, setup_integration, hass_client, hass_read_only_access_token
) -> None:
    floor_id = await _floor(hass)
    admin = await hass_client()
    assert (
        await admin.post(f"/api/house_map/floors/{floor_id}/svg?mode=keep", data=SAMPLE_SVG)
    ).status == 200

    reader = await hass_client(hass_read_only_access_token)
    resp = await reader.get(f"/api/house_map/floors/{floor_id}/svg")
    assert resp.status == 200
    assert resp.content_type == "image/svg+xml"
    assert resp.headers["X-Content-Type-Options"] == "nosniff"
    assert "default-src 'none'" in resp.headers["Content-Security-Policy"]
    assert b"<svg" in await resp.read()


async def test_get_floor_without_svg_404(hass: HomeAssistant, setup_integration, hass_client) -> None:
    floor_id = await _floor(hass)
    client = await hass_client()
    assert (await client.get(f"/api/house_map/floors/{floor_id}/svg")).status == 404
    assert (await client.get("/api/house_map/floors/missing/svg")).status == 404


async def test_get_missing_file_404(
    hass: HomeAssistant, setup_integration, hass_client, isolated_config_dir: Path
) -> None:
    floor_id = await _floor(hass)
    client = await hass_client()
    await client.post(f"/api/house_map/floors/{floor_id}/svg?mode=keep", data=svg_bytes())
    _svg_path(isolated_config_dir, floor_id).unlink()
    assert (await client.get(f"/api/house_map/floors/{floor_id}/svg")).status == 404


async def test_post_unknown_floor_404(hass: HomeAssistant, setup_integration, hass_client) -> None:
    client = await hass_client()
    resp = await client.post("/api/house_map/floors/missing/svg?mode=keep", data=svg_bytes())
    assert resp.status == 404


async def test_mode_check_writes_nothing(
    hass: HomeAssistant, setup_integration, hass_client, isolated_config_dir: Path
) -> None:
    floor_id = await _floor(hass)
    client = await hass_client()

    # Default mode is check.
    resp = await client.post(f"/api/house_map/floors/{floor_id}/svg", data=svg_bytes("0 0 100 50"))
    assert resp.status == 200
    body = await resp.json()
    assert body == {"old_viewbox": None, "new_viewbox": [0.0, 0.0, 100.0, 50.0], "viewbox_changed": False}
    assert not _svg_path(isolated_config_dir, floor_id).exists()
    assert get_store(hass).get_floor(floor_id)["svg_file"] is None

    # Now with an existing plan: check reports the change but stores nothing.
    await client.post(f"/api/house_map/floors/{floor_id}/svg?mode=keep", data=svg_bytes("0 0 100 50"))
    before = _svg_path(isolated_config_dir, floor_id).read_bytes()
    resp = await client.post(f"/api/house_map/floors/{floor_id}/svg?mode=check", data=svg_bytes("0 0 10 10"))
    body = await resp.json()
    assert body["old_viewbox"] == [0.0, 0.0, 100.0, 50.0]
    assert body["new_viewbox"] == [0.0, 0.0, 10.0, 10.0]
    assert body["viewbox_changed"] is True
    assert "floor" not in body
    assert _svg_path(isolated_config_dir, floor_id).read_bytes() == before
    assert get_store(hass).get_floor(floor_id)["viewbox"] == [0.0, 0.0, 100.0, 50.0]


async def test_invalid_mode_400(hass: HomeAssistant, setup_integration, hass_client) -> None:
    floor_id = await _floor(hass)
    client = await hass_client()
    resp = await client.post(f"/api/house_map/floors/{floor_id}/svg?mode=bogus", data=svg_bytes())
    assert resp.status == 400


async def test_invalid_svg_400(hass: HomeAssistant, setup_integration, hass_client) -> None:
    floor_id = await _floor(hass)
    client = await hass_client()
    for data in (b"", b"not xml", b"<html/>", b"<svg xmlns='http://www.w3.org/2000/svg'/>"):
        resp = await client.post(f"/api/house_map/floors/{floor_id}/svg?mode=keep", data=data)
        assert resp.status == 400, data


async def test_malicious_svg_sanitized_in_stored_file(
    hass: HomeAssistant, setup_integration, hass_client, isolated_config_dir: Path
) -> None:
    floor_id = await _floor(hass)
    client = await hass_client()
    evil = (
        b'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
        b'viewBox="0 0 10 10" onload="steal()">'
        b"<script>alert(1)</script>"
        b"<foreignObject><div>x</div></foreignObject>"
        b'<a href="javascript:alert(2)"><rect onclick="x()" width="1" height="1" id="keep"/></a>'
        b'<image xlink:href="https://evil.example/x.png"/>'
        b"</svg>"
    )
    resp = await client.post(f"/api/house_map/floors/{floor_id}/svg?mode=keep", data=evil)
    assert resp.status == 200
    stored = _svg_path(isolated_config_dir, floor_id).read_bytes().lower()
    for needle in (b"script", b"foreignobject", b"onload", b"onclick", b"javascript", b"evil", b"steal"):
        assert needle not in stored, needle
    assert b'id="keep"' in stored

    served = (await (await client.get(f"/api/house_map/floors/{floor_id}/svg")).read()).lower()
    assert served == stored


async def test_rescale_moves_placements_and_keep_does_not(
    hass: HomeAssistant, setup_integration, hass_client, hass_ws_client
) -> None:
    floor_id = await _floor(hass)
    device_id = (
        dr.async_get(hass)
        .async_get_or_create(
            config_entry_id=setup_integration.entry_id, identifiers={("test", "d")}, name="d"
        )
        .id
    )
    client = await hass_client()
    ws = await hass_ws_client(hass)
    await client.post(f"/api/house_map/floors/{floor_id}/svg?mode=keep", data=svg_bytes("0 0 100 50"))
    msg = await ws_call(
        ws,
        "house_map/placement/set",
        device_id=device_id,
        floor_id=floor_id,
        x=50,
        y=25,
        directional=False,
    )
    assert msg["success"], msg

    resp = await client.post(
        f"/api/house_map/floors/{floor_id}/svg?mode=keep", data=svg_bytes("10 10 200 100")
    )
    assert (await resp.json())["floor"]["viewbox"] == [10.0, 10.0, 200.0, 100.0]
    placement = (await ws_call(ws, "house_map/get"))["result"]["placements"][device_id]
    assert (placement["x"], placement["y"]) == (50.0, 25.0)

    # Back to the original box with rescale: (50,25) in [10,10,200,100] -> [0,0,100,50].
    resp = await client.post(
        f"/api/house_map/floors/{floor_id}/svg?mode=rescale", data=svg_bytes("0 0 100 50")
    )
    assert resp.status == 200
    placement = (await ws_call(ws, "house_map/get"))["result"]["placements"][device_id]
    assert (placement["x"], placement["y"]) == (0.0 + (50 - 10) / 200 * 100, 0.0 + (25 - 10) / 100 * 50)
    assert (placement["x"], placement["y"]) == (20.0, 7.5)
