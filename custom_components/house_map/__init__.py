"""House Map: place Home Assistant devices on floor plan SVGs."""

from __future__ import annotations

from pathlib import Path

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers import config_validation as cv, device_registry as dr
from homeassistant.helpers.typing import ConfigType
from homeassistant.loader import async_get_integration

from . import services, websocket
from .const import (
    DOMAIN,
    FRONTEND_DIR,
    FRONTEND_FILE,
    PANEL_COMPONENT,
    PANEL_ICON,
    PANEL_TITLE,
    PANEL_URL_PATH,
    STATIC_URL,
)
from .http import FloorSvgView
from .runtime import HouseMapRuntime, floors_path, refresh_orphans
from .store import HouseMapStore

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register things that cannot be unregistered: views, static path, API."""
    await hass.http.async_register_static_paths(
        [StaticPathConfig(STATIC_URL, str(Path(__file__).parent / FRONTEND_DIR), cache_headers=False)]
    )
    hass.http.register_view(FloorSvgView())
    websocket.async_register(hass)
    services.async_register(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    store = HouseMapStore(hass)
    await store.async_load()
    runtime = HouseMapRuntime(store=store, floors_path=floors_path(hass))
    hass.data[DOMAIN] = runtime
    refresh_orphans(hass, runtime)

    @callback
    def _device_registry_updated(event: Event) -> None:
        if event.data.get("action") in ("remove", "create"):
            refresh_orphans(hass, runtime)

    entry.async_on_unload(hass.bus.async_listen(dr.EVENT_DEVICE_REGISTRY_UPDATED, _device_registry_updated))

    integration = await async_get_integration(hass, DOMAIN)
    frontend.async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        frontend_url_path=PANEL_URL_PATH,
        require_admin=False,
        config={
            "_panel_custom": {
                "name": PANEL_COMPONENT,
                "embed_iframe": False,
                "trust_external": False,
                "js_url": f"{STATIC_URL}/{FRONTEND_FILE}?v={integration.version}",
            }
        },
    )
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    frontend.async_remove_panel(hass, PANEL_URL_PATH)
    hass.data.pop(DOMAIN, None)
    return True
