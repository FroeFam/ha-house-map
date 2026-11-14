"""Shared helpers for House Map tests."""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant

from custom_components.house_map.const import DOMAIN


def svg_bytes(viewbox: str = "0 0 100 50", body: str = "") -> bytes:
    """Build a small valid SVG document."""
    ns = "http://www.w3.org/2000/svg"
    return f'<svg xmlns="{ns}" viewBox="{viewbox}"><rect width="1" height="1"/>{body}</svg>'.encode()


async def ws_call(ws: Any, msg_type: str, **fields: Any) -> dict[str, Any]:
    """Send one websocket command and return the response message."""
    ws.next_id = getattr(ws, "next_id", 0) + 1
    await ws.send_json({"id": ws.next_id, "type": msg_type, **fields})
    return await ws.receive_json()


def get_store(hass: HomeAssistant) -> Any:
    return hass.data[DOMAIN].store
