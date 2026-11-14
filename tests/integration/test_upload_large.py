"""Regression: uploads larger than one network chunk must arrive whole."""

from __future__ import annotations

from homeassistant.core import HomeAssistant


def _big_svg(lines: int) -> bytes:
    body = "".join(
        f'<line x1="{i}.123456789" y1="0.22916666666" x2="{i}.5" y2="9.75" stroke="#2b2b2e"/>\n'
        for i in range(lines)
    )
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-13 -14 85 70">\n{body}</svg>\n').encode()


async def test_large_upload_is_read_completely(
    hass: HomeAssistant, setup_integration, hass_ws_client, hass_client
) -> None:
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "house_map/floor/create", "name": "F"})
    floor_id = (await ws.receive_json())["result"]["floor"]["id"]

    data = _big_svg(4000)  # about 350 KB, many chunks
    assert len(data) > 300_000
    client = await hass_client()

    async def chunks():
        for i in range(0, len(data), 8192):
            yield data[i : i + 8192]

    resp = await client.post(f"/api/house_map/floors/{floor_id}/svg?mode=keep", data=chunks())
    assert resp.status == 200, await resp.text()

    resp = await client.get(f"/api/house_map/floors/{floor_id}/svg")
    stored = await resp.read()
    assert stored.count(b"<line") == 4000
