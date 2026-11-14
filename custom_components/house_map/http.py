"""Authenticated HTTP views for floor plan SVG upload and download.

GET  /api/house_map/floors/{floor_id}/svg            any authenticated user
POST /api/house_map/floors/{floor_id}/svg?mode=...   admin only
     body: raw SVG bytes
     mode=check    validate only, report old and new viewBox, store nothing
     mode=keep     save; placements keep their raw coordinates
     mode=rescale  save; placements on this floor scale to the new viewBox
"""

from __future__ import annotations

from http import HTTPStatus
import os
from pathlib import Path

from aiohttp import web
from homeassistant.components.http import KEY_HASS, KEY_HASS_USER, HomeAssistantView

from .const import (
    MAX_SVG_BYTES,
    UPLOAD_MODE_CHECK,
    UPLOAD_MODE_RESCALE,
    UPLOAD_MODES,
)
from .runtime import get_runtime, refresh_orphans
from .store import HouseMapError
from .svg import SvgError, sanitize_svg

_SVG_HEADERS = {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; img-src data:",
}


def _write_atomic(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(".tmp")
    tmp.write_bytes(data)
    os.replace(tmp, path)


class FloorSvgView(HomeAssistantView):
    """Serve and accept floor plan SVGs."""

    url = "/api/house_map/floors/{floor_id}/svg"
    name = "api:house_map:floor_svg"
    requires_auth = True

    async def get(self, request: web.Request, floor_id: str) -> web.StreamResponse:
        hass = request.app[KEY_HASS]
        try:
            runtime = get_runtime(hass)
            floor = runtime.store.get_floor(floor_id)
        except HouseMapError as err:
            return self.json_message(str(err), HTTPStatus.NOT_FOUND)
        if not floor["svg_file"]:
            return self.json_message("Floor has no SVG yet", HTTPStatus.NOT_FOUND)
        path = runtime.floors_path / floor["svg_file"]
        try:
            body = await hass.async_add_executor_job(path.read_bytes)
        except FileNotFoundError:
            return self.json_message("SVG file is missing", HTTPStatus.NOT_FOUND)
        return web.Response(body=body, content_type="image/svg+xml", headers=_SVG_HEADERS)

    async def post(self, request: web.Request, floor_id: str) -> web.Response:
        hass = request.app[KEY_HASS]
        if not request[KEY_HASS_USER].is_admin:
            return self.json_message("Admin access required", HTTPStatus.FORBIDDEN)
        mode = request.query.get("mode", UPLOAD_MODE_CHECK)
        if mode not in UPLOAD_MODES:
            return self.json_message(f"mode must be one of {UPLOAD_MODES}", HTTPStatus.BAD_REQUEST)
        try:
            runtime = get_runtime(hass)
            floor = runtime.store.get_floor(floor_id)
        except HouseMapError as err:
            return self.json_message(str(err), HTTPStatus.NOT_FOUND)

        data = await request.content.read(MAX_SVG_BYTES + 1)
        try:
            clean, viewbox = await hass.async_add_executor_job(sanitize_svg, data)
        except SvgError as err:
            return self.json_message(str(err), HTTPStatus.BAD_REQUEST)

        old_viewbox = floor["viewbox"]
        result = {
            "old_viewbox": old_viewbox,
            "new_viewbox": viewbox,
            "viewbox_changed": old_viewbox is not None and old_viewbox != viewbox,
        }
        if mode == UPLOAD_MODE_CHECK:
            return self.json(result)

        svg_file = f"{floor_id}.svg"
        await hass.async_add_executor_job(_write_atomic, runtime.floors_path / svg_file, clean)
        updated = await runtime.store.async_set_floor_svg(
            floor_id, svg_file, viewbox, rescale=mode == UPLOAD_MODE_RESCALE
        )
        refresh_orphans(hass, runtime)
        return self.json({**result, "floor": updated})
