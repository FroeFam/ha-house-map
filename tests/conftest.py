"""Shared fixtures for House Map tests."""

from __future__ import annotations

from collections.abc import Generator

from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.house_map.const import DOMAIN

pytest_plugins = ["pytest_homeassistant_custom_component"]

SAMPLE_SVG = (
    b'<?xml version="1.0"?>'
    b'<svg xmlns="http://www.w3.org/2000/svg" width="1190" height="980" '
    b'viewBox="-13 -14 85 70"><rect x="0" y="0" width="58" height="42"/></svg>'
)


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations: None) -> Generator[None]:
    yield


@pytest.fixture
async def setup_integration(hass: HomeAssistant) -> MockConfigEntry:
    """Set up House Map with one config entry and return it."""
    assert await async_setup_component(hass, "http", {})
    # The test harness lacks the hass_frontend package; panel registration
    # only needs the frontend component to count as loaded.
    hass.config.components.add("frontend")
    entry = MockConfigEntry(domain=DOMAIN, title="House Map", data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry
