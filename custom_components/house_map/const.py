"""Constants for the House Map integration."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "house_map"

STORAGE_KEY: Final = DOMAIN
STORAGE_VERSION: Final = 1

# Sidebar panel
PANEL_URL_PATH: Final = "house-map"
PANEL_TITLE: Final = "House Map"
PANEL_ICON: Final = "mdi:floor-plan"
PANEL_COMPONENT: Final = "house-map-panel"

# Static frontend bundle
STATIC_URL: Final = "/house_map_static"
FRONTEND_DIR: Final = "frontend"
FRONTEND_FILE: Final = "house-map-panel.js"

# Floor plan files, relative to the HA config directory. Never under www/.
FLOORS_DIR: Final = "house_map/floors"

MAX_SVG_BYTES: Final = 5 * 1024 * 1024
MAX_NOTES_LENGTH: Final = 2000
MAX_NAME_LENGTH: Final = 100
MAX_FLOORS: Final = 20

UPLOAD_MODE_CHECK: Final = "check"
UPLOAD_MODE_KEEP: Final = "keep"
UPLOAD_MODE_RESCALE: Final = "rescale"
UPLOAD_MODES: Final = (UPLOAD_MODE_CHECK, UPLOAD_MODE_KEEP, UPLOAD_MODE_RESCALE)

ISSUE_ORPHANED_DEVICES: Final = "orphaned_devices"

SERVICE_GET_PLACEMENTS: Final = "get_placements"
