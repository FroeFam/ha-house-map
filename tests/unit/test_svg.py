"""Sanitizer tests (more coverage is added by the test suite PR)."""

from __future__ import annotations

import pytest

from custom_components.house_map.svg import SvgError, sanitize_svg


def test_viewbox_and_script_removed() -> None:
    data = (
        b'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-13 -14 85 70" onload="x()">'
        b"<script>alert(1)</script><rect width='1' height='1'/></svg>"
    )
    clean, viewbox = sanitize_svg(data)
    assert viewbox == [-13.0, -14.0, 85.0, 70.0]
    assert b"script" not in clean
    assert b"onload" not in clean


def test_doctype_rejected() -> None:
    with pytest.raises(SvgError):
        sanitize_svg(b'<!DOCTYPE svg [<!ENTITY a "b">]><svg xmlns="http://www.w3.org/2000/svg"/>')
