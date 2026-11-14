Repository ha-house-map: a Home Assistant custom integration (Python backend in custom_components/house_map, TypeScript + Lit panel in frontend/ bundled into custom_components/house_map/frontend) that lets an admin place devices on uploaded floor plan SVGs.

Focus on:
- Security: SVG sanitizing (svg.py), admin enforcement on every write (websocket require_admin, upload view is_admin), auth on the SVG download view, no floor plans under www/
- Correctness of coordinate math: viewBox units, calibration to feet, rotation (clockwise, 0 = up), rescale on SVG replacement
- Home Assistant integration practices: no blocking I/O in the event loop, proper unload, stable public contracts
- Frontend: event contracts between components, pointer handling, no writes outside the panel shell
- Test coverage for new backend logic
- Nothing private committed: real floor plans, device ids, LAN addresses
