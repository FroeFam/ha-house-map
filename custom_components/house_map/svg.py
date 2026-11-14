"""Validate and sanitize uploaded SVG floor plans.

The frontend renders plans as <img> from a blob URL, so scripts in an SVG
cannot run there. Sanitizing here is a second layer: the stored file is also
served by an authenticated view and could be opened directly in a browser.
"""

from __future__ import annotations

import re
import xml.etree.ElementTree as ET

from .const import MAX_SVG_BYTES

SVG_NS = "http://www.w3.org/2000/svg"
XLINK_NS = "http://www.w3.org/1999/xlink"

ET.register_namespace("", SVG_NS)
ET.register_namespace("xlink", XLINK_NS)

# Elements removed with their whole subtree, matched on local name.
_BLOCKED_ELEMENTS = frozenset({"script", "foreignobject", "iframe", "embed", "object", "handler", "listener"})
_HREF_ATTRS = frozenset({"href", f"{{{XLINK_NS}}}href"})
_SAFE_DATA_URI = re.compile(r"^data:image/(png|jpeg|jpg|gif|webp);base64,", re.IGNORECASE)
_NUMBER = re.compile(r"^\s*(-?\d+(?:\.\d+)?)\s*(px)?\s*$")


class SvgError(ValueError):
    """Raised when an uploaded file is not an acceptable SVG floor plan."""


def _local(tag: str) -> str:
    return tag.rsplit("}", 1)[-1].lower() if isinstance(tag, str) else ""


def _parse_viewbox(root: ET.Element) -> list[float]:
    raw = root.get("viewBox")
    if raw:
        parts = [p for p in re.split(r"[\s,]+", raw.strip()) if p]
        if len(parts) != 4:
            raise SvgError("viewBox must have four numbers")
        try:
            min_x, min_y, width, height = (float(p) for p in parts)
        except ValueError as err:
            raise SvgError("viewBox must have four numbers") from err
    else:
        width_m = _NUMBER.match(root.get("width") or "")
        height_m = _NUMBER.match(root.get("height") or "")
        if not width_m or not height_m:
            raise SvgError("SVG needs a viewBox, or numeric width and height")
        min_x, min_y = 0.0, 0.0
        width, height = float(width_m.group(1)), float(height_m.group(1))
        root.set("viewBox", f"0 0 {width:g} {height:g}")
    if width <= 0 or height <= 0:
        raise SvgError("viewBox width and height must be positive")
    return [min_x, min_y, width, height]


def _scrub(element: ET.Element) -> None:
    for child in list(element):
        if _local(child.tag) in _BLOCKED_ELEMENTS:
            element.remove(child)
            continue
        _scrub(child)
    for attr in list(element.attrib):
        name = _local(attr)
        value = element.attrib[attr].strip()
        if name.startswith("on"):
            del element.attrib[attr]
        elif attr in _HREF_ATTRS or name == "href":
            if not (value.startswith("#") or _SAFE_DATA_URI.match(value)):
                del element.attrib[attr]
        elif "javascript:" in value.lower():
            del element.attrib[attr]


def sanitize_svg(data: bytes) -> tuple[bytes, list[float]]:
    """Return (sanitized SVG bytes, viewBox) or raise SvgError."""
    if not data:
        raise SvgError("File is empty")
    if len(data) > MAX_SVG_BYTES:
        raise SvgError(f"File is larger than {MAX_SVG_BYTES // (1024 * 1024)} MB")
    lowered = data.lower()
    if b"<!doctype" in lowered or b"<!entity" in lowered:
        raise SvgError("DOCTYPE and ENTITY declarations are not allowed")
    try:
        root = ET.fromstring(data)
    except ET.ParseError as err:
        raise SvgError(f"Not valid XML: {err}") from err
    if _local(root.tag) != "svg":
        raise SvgError("Root element must be <svg>")
    viewbox = _parse_viewbox(root)
    _scrub(root)
    return ET.tostring(root, encoding="utf-8", xml_declaration=True), viewbox
