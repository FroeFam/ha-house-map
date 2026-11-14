"""Sanitizer and viewBox parsing tests."""

from __future__ import annotations

import pytest

from custom_components.house_map.const import MAX_SVG_BYTES
from custom_components.house_map.svg import SvgError, sanitize_svg

NS = 'xmlns="http://www.w3.org/2000/svg"'
XLINK = 'xmlns:xlink="http://www.w3.org/1999/xlink"'


def _svg(body: str = "", attrs: str = 'viewBox="0 0 100 50"') -> bytes:
    return f"<svg {NS} {XLINK} {attrs}>{body}</svg>".encode()


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


# ----- viewBox ------------------------------------------------------------


def test_viewbox_comma_separated() -> None:
    _, viewbox = sanitize_svg(_svg(attrs='viewBox="0,0,10,20"'))
    assert viewbox == [0.0, 0.0, 10.0, 20.0]


def test_viewbox_mixed_separators() -> None:
    _, viewbox = sanitize_svg(_svg(attrs='viewBox=" 1.5, 2  3 , 4 "'))
    assert viewbox == [1.5, 2.0, 3.0, 4.0]


def test_width_height_fallback_with_px() -> None:
    clean, viewbox = sanitize_svg(_svg(attrs='width="200px" height="100"'))
    assert viewbox == [0.0, 0.0, 200.0, 100.0]
    assert b'viewBox="0 0 200 100"' in clean


def test_viewbox_preferred_over_width_height() -> None:
    _, viewbox = sanitize_svg(_svg(attrs='viewBox="0 0 10 10" width="500" height="500"'))
    assert viewbox == [0.0, 0.0, 10.0, 10.0]


@pytest.mark.parametrize(
    "attrs",
    [
        "",
        'width="100"',
        'height="100"',
        'width="100%" height="100%"',
        'width="10mm" height="10mm"',
        'viewBox="0 0 10"',
        'viewBox="0 0 10 10 10"',
        'viewBox="a b c d"',
    ],
)
def test_bad_viewbox_rejected(attrs: str) -> None:
    with pytest.raises(SvgError):
        sanitize_svg(_svg(attrs=attrs))


@pytest.mark.parametrize(
    "attrs",
    [
        'viewBox="0 0 0 10"',
        'viewBox="0 0 10 0"',
        'viewBox="0 0 -10 10"',
        'viewBox="0 0 10 -10"',
        'width="0" height="10"',
        'width="10" height="0"',
    ],
)
def test_zero_or_negative_size_rejected(attrs: str) -> None:
    with pytest.raises(SvgError):
        sanitize_svg(_svg(attrs=attrs))


@pytest.mark.parametrize("size", ["nan nan", "inf inf", "-inf 5"])
def test_non_finite_viewbox_rejected(size: str) -> None:
    with pytest.raises(SvgError):
        sanitize_svg(_svg(attrs=f'viewBox="0 0 {size}"'))


# ----- blocked elements ---------------------------------------------------


def test_script_removed_with_subtree() -> None:
    clean, _ = sanitize_svg(_svg('<script>alert(1)</script><g><SCRIPT>evil()</SCRIPT></g><rect id="keep"/>'))
    lowered = clean.lower()
    assert b"script" not in lowered
    assert b"alert" not in lowered
    assert b"evil" not in lowered
    assert b'id="keep"' in clean


def test_foreign_object_removed_any_case_and_namespace() -> None:
    body = (
        "<foreignObject><div>x</div></foreignObject>"
        "<FOREIGNOBJECT/>"
        "<foreignobject/>"
        '<s:foreignObject xmlns:s="http://www.w3.org/2000/svg"/>'
        '<h:foreignObject xmlns:h="http://www.w3.org/1999/xhtml"/>'
        '<rect id="keep"/>'
    )
    clean, _ = sanitize_svg(_svg(body))
    assert b"foreign" not in clean.lower()
    assert b'id="keep"' in clean


@pytest.mark.parametrize("tag", ["iframe", "embed", "object"])
def test_other_active_elements_removed(tag: str) -> None:
    clean, _ = sanitize_svg(_svg(f'<{tag} src="x"/><rect id="keep"/>'))
    assert tag.encode() not in clean
    assert b'id="keep"' in clean


# ----- attributes ---------------------------------------------------------


def test_on_attributes_removed() -> None:
    body = '<rect onclick="a()" onLoad="b()" onmouseover="c()" id="keep"/><g ONFOCUS="d()"/>'
    clean, _ = sanitize_svg(_svg(body, attrs='viewBox="0 0 1 1" onload="x()"'))
    for name in (b"onclick", b"onload", b"onmouseover", b"onfocus"):
        assert name not in clean.lower()
    assert b'id="keep"' in clean


def test_javascript_values_removed() -> None:
    body = (
        '<a href="javascript:alert(1)"><rect/></a>'
        '<a xlink:href="  JavaScript:alert(2)"><rect/></a>'
        '<rect style="fill:url(javascript:x)" data-x="JAVASCRIPT:y" id="keep"/>'
    )
    clean, _ = sanitize_svg(_svg(body))
    assert b"javascript" not in clean.lower()
    assert b'id="keep"' in clean


def test_external_hrefs_removed() -> None:
    body = (
        '<image href="https://evil.example/a.png"/>'
        '<image xlink:href="http://evil.example/a.png"/>'
        '<image href="//evil.example/a.png"/>'
        '<image href="file:///etc/passwd"/>'
        '<use href="evil.svg#a"/>'
    )
    clean, _ = sanitize_svg(_svg(body))
    assert b"evil" not in clean
    assert b"passwd" not in clean


def test_internal_and_png_data_hrefs_kept() -> None:
    body = (
        '<defs><g id="a"/></defs>'
        '<use href="#a"/>'
        '<use xlink:href="#a"/>'
        '<image href="data:image/png;base64,AAAA"/>'
    )
    clean, _ = sanitize_svg(_svg(body))
    assert clean.count(b'href="#a"') == 2
    assert b'href="data:image/png;base64,AAAA"' in clean


def test_svg_data_uri_removed() -> None:
    body = (
        '<image href="data:image/svg+xml;base64,PHN2Zy8+"/><image xlink:href="data:text/html;base64,AAAA"/>'
    )
    clean, _ = sanitize_svg(_svg(body))
    assert b"data:" not in clean


# ----- document level -----------------------------------------------------


def test_doctype_and_entity_rejected_any_case() -> None:
    with pytest.raises(SvgError):
        sanitize_svg(b'<!doctype svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"/>')
    with pytest.raises(SvgError):
        sanitize_svg(b'<!ENTITY x "y"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"/>')


def test_entity_expansion_bomb_rejected() -> None:
    bomb = (
        b'<?xml version="1.0"?><!DOCTYPE lolz [<!ENTITY lol "lol">'
        b'<!ENTITY lol2 "&lol;&lol;&lol;&lol;">]>'
        b'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1">&lol2;</svg>'
    )
    with pytest.raises(SvgError):
        sanitize_svg(bomb)


def test_non_svg_root_rejected() -> None:
    with pytest.raises(SvgError):
        sanitize_svg(b"<html><body/></html>")


@pytest.mark.parametrize("data", [b"<svg", b"not xml at all", b"<svg><g></svg>"])
def test_invalid_xml_rejected(data: bytes) -> None:
    with pytest.raises(SvgError):
        sanitize_svg(data)


def test_empty_rejected() -> None:
    with pytest.raises(SvgError):
        sanitize_svg(b"")


def test_oversize_rejected() -> None:
    with pytest.raises(SvgError):
        sanitize_svg(b" " * (MAX_SVG_BYTES + 1))


def test_exactly_max_size_not_rejected_for_size() -> None:
    prefix = _svg()[:-6]
    padding = b" " * (MAX_SVG_BYTES - len(prefix) - 6)
    clean, viewbox = sanitize_svg(prefix + padding + b"</svg>")
    assert viewbox == [0.0, 0.0, 100.0, 50.0]
    assert clean.startswith(b"<?xml")


def test_output_is_parseable_svg_with_declaration() -> None:
    clean, _ = sanitize_svg(_svg('<rect id="r"/>'))
    assert clean.startswith(b"<?xml")
    assert b"http://www.w3.org/2000/svg" in clean
