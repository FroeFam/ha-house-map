"""Fixtures for tests that run a Home Assistant instance with House Map."""

from __future__ import annotations

from pathlib import Path

from homeassistant.core import HomeAssistant
import pytest


@pytest.fixture(autouse=True)
def isolated_config_dir(hass: HomeAssistant, tmp_path: Path) -> Path:
    """Point the HA config dir at a temp dir so floor plan files stay isolated."""
    hass.config.config_dir = str(tmp_path)
    return tmp_path
