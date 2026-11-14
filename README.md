# House Map

House Map is a Home Assistant custom integration that adds a **House Map**
item to the sidebar. You upload a floor plan SVG for each floor of your house,
then place your Home Assistant devices on it. Every marker keeps free text
notes and, for directional devices such as motion sensors, a rotation.

The placements are also available to automations, scripts and AI agents
through the `house_map.get_placements` service, so they can answer questions
such as "which motion sensors cover the hallway, and which way do they face?"

## Installation

1. In HACS, open the three dot menu and choose **Custom repositories**.
2. Add `https://github.com/FroeFam/ha-house-map` with the category
   **Integration**.
3. Find **House Map** in HACS and download it.
4. Restart Home Assistant.
5. Go to **Settings, Devices & services, Add integration** and pick
   **House Map**.

Only one House Map can be set up per Home Assistant instance.

## First run

Open **House Map** in the sidebar. With no floors yet, a wizard walks you
through the setup.

1. **How many floors.** Up to 20.
2. **Floor names.** Prefilled as "First Floor", "Second Floor" and so on.
   Names can be up to 100 characters, and you can rename or reorder floors
   later.
3. **Floor plans.** Choose an SVG for each floor. Each file is checked when you
   pick it and the detected plan size is shown. At least one floor needs a
   plan; you can skip the others and upload them later. See
   [SVG requirements](#svg-requirements-and-sanitizing).
4. **Calibration.** Tell House Map how plan units relate to real distance:
   how many SVG units make one foot, and which point is the origin (0 ft, 0 ft).
   If your plan was drawn in feet, keep 1, 0 and 0. See
   [Coordinate system](#coordinate-system).

## Using the editor

The panel has a device list on the left, the plan in the middle, and the
selected device's details on the right. Floor tabs sit at the top.

- **Place a device.** Under **Not placed**, devices are grouped by area. Click
  one, then click the plan where it is installed. Press Esc to cancel.
- **Move it.** Drag a marker to a new position.
- **Select it.** Click a marker, or a device under **Placed**, to show its
  details. Selecting from the list switches to the device's floor.
- **Zoom and pan.** Use the mouse wheel to zoom, drag empty space to pan, and
  **Fit** to show the whole floor.
- **Notes.** Add up to 2000 characters of notes per device, such as mounting
  height, what the sensor covers, or quirks. Notes save when the field loses
  focus.
- **Directional.** Tick **Directional** for devices that face a direction
  (motion sensors, cameras). The marker shows a cone. Set the angle with the
  slider or number box, or drag the round handle on the plan.
- **Other floor.** Use the **Floor** dropdown to move a device to another
  floor.
- **Deleted devices.** If a placed device is removed from Home Assistant, it is
  listed under **Deleted devices**, its marker turns red, and Home Assistant
  raises a repair issue. Remove it from the map; the repair issue clears by
  itself once none remain.

## Managing floors

The **Floors** button opens floor settings, where you can rename, reorder,
add and delete floors, change calibration, and replace a floor plan. Deleting
a floor removes the devices placed on it from the map (you are asked first).

When you replace a plan with one of the same size, placements stay where they
are. When the new plan has a different viewBox, you choose between keeping the
positions as they are or scaling them to the new plan.

## Who can edit

Every logged in Home Assistant user can open the House Map panel and view
floors and placements. Only **administrators** can change anything: creating,
renaming, reordering and deleting floors, uploading plans, and placing, moving
or removing devices. The backend enforces this, so non-admin users get an
`unauthorized` error (WebSocket) or HTTP 403 (upload) even if they call the API
directly.

## Coordinate system

Positions are stored in the **SVG viewBox units** of the floor plan, as `x` and
`y`. `x` grows to the right and `y` grows downward, like the drawing itself.

Each floor has a calibration with three numbers:

- `units_per_foot`: how many SVG units equal one foot. Must be greater than 0.
- `origin_x` and `origin_y`: the SVG point that counts as 0 ft, 0 ft.

Positions in feet are derived from the stored units:

```text
x_ft = (x - origin_x) / units_per_foot
y_ft = (y - origin_y) / units_per_foot
```

For example, with `units_per_foot` 2 and origin (10, 5), a marker at x = 30
is at `x_ft` = (30 - 10) / 2 = 10.0 ft.

**Rotation** is in degrees, clockwise, where 0 points toward the top of the
drawing, 90 points right, 180 down and 270 left. Values are normalized to the
range 0 up to (but not including) 360, so 450 is stored as 90 and -90 as 270.
Non directional devices have a rotation of `null`.

## Where data lives

- **Floors, calibration and placements** are stored by Home Assistant in
  `.storage/house_map`. This file is included in Home Assistant backups.
- **Floor plan SVGs** are stored as `/config/house_map/floors/<floor_id>.svg`.

Plans are never placed under `www/`, so they are not publicly reachable. They
are served only through the authenticated endpoint
`/api/house_map/floors/<floor_id>/svg`, which requires a valid Home Assistant
login or token. Deleting a floor deletes its SVG file.

## SVG requirements and sanitizing

- Maximum file size is 5 MB.
- The root element must be `<svg>`, and the file must be well formed XML.
- The plan needs a `viewBox`, or numeric `width` and `height` (a `px` suffix is
  accepted). Width and height must be greater than 0. If only width and height
  are present, House Map uses `0 0 width height` as the viewBox.
- `DOCTYPE` and `ENTITY` declarations are rejected.

Uploads are sanitized before they are stored. House Map removes:

- `<script>`, `<foreignObject>`, `<iframe>`, `<embed>` and `<object>` elements
  (any letter case or namespace prefix),
- every `on*` event attribute such as `onload` and `onclick`,
- any attribute value containing `javascript:`,
- `href` and `xlink:href` values that point outside the file. Internal
  references such as `#id` and embedded `data:image/png;base64,...` images
  (also JPEG, GIF and WebP) are kept. `data:image/svg+xml` is removed.

The upload endpoint has three modes: `check` validates the file and reports the
old and new viewBox without storing anything, `keep` stores the file and leaves
placements at their raw coordinates, and `rescale` stores the file and scales
placements to the new viewBox.

## Service: house_map.get_placements

Returns every placed device joined with its floor, area and device registry
data. The service is read only and returns a response, so call it with
`return_response`. All fields are optional filters and can be combined.

| Field | Meaning |
| --- | --- |
| `floor` | Only this floor, matched by name (case insensitive) or by id. |
| `area` | Only devices in this area, matched by name (case insensitive) or by id. |
| `device_id` | Only this device. |

The response contains `coordinate_system` (a text description), `floors` and
`placements`. Each placement has:

- `device_id`, `device_name`, `manufacturer`, `model`
- `area_id`, `area_name`
- `floor_id`, `floor_name`
- `x`, `y` (SVG units) and `x_ft`, `y_ft` (feet, rounded to 2 decimals)
- `directional`, `rotation_deg`, `notes`, `updated`
- `orphan`: `true` when the device no longer exists in Home Assistant. In that
  case the device and area fields are `null`.

Each floor entry has `id`, `name`, `order`, `viewbox`, `calibration` and
`svg_path` (relative to the config directory, `null` when no SVG is uploaded).

Example response:

```yaml
coordinate_system: >-
  x, y are SVG viewBox units of the floor plan. x_ft, y_ft use the floor
  calibration: ft = (unit - origin) / units_per_foot. rotation_deg is
  clockwise, 0 = toward the top of the drawing.
floors:
  - id: 01j9z3k8m2q4r5s6t7v8w9x0yz
    name: First Floor
    order: 0
    viewbox: [0.0, 0.0, 100.0, 50.0]
    calibration:
      units_per_foot: 2.0
      origin_x: 10.0
      origin_y: 5.0
    svg_path: house_map/floors/01j9z3k8m2q4r5s6t7v8w9x0yz.svg
placements:
  - device_id: 3f0c1d2e4b5a69788c9d0e1f2a3b4c5d
    device_name: Hall motion
    manufacturer: Aqara
    model: RTCGQ11LM
    area_id: hallway
    area_name: Hallway
    floor_id: 01j9z3k8m2q4r5s6t7v8w9x0yz
    floor_name: First Floor
    x: 30.0
    y: 15.0
    x_ft: 10.0
    y_ft: 5.0
    directional: true
    rotation_deg: 90.0
    notes: Ceiling mount, faces the front door
    updated: "2026-11-14T18:30:00+00:00"
    orphan: false
```

Example call from **Developer Tools, Actions** (YAML mode):

```yaml
action: house_map.get_placements
data:
  floor: First Floor
  area: Hallway
```

## Development

Python tests run in a Linux container, because the Home Assistant test harness
does not run on Windows. With Docker installed:

```powershell
pwsh -NoProfile -File scripts/test.ps1 -q -p no:logging
```

The script runs `ruff check` and then `pytest`. Extra arguments are passed to
pytest. Format code with `uvx ruff@0.17.5 format .`.

The frontend is a Lit and TypeScript panel built with Vite. It needs
Node 20.19 or newer:

```powershell
cd frontend
npm ci
npm run build
```

The built bundle is committed under `custom_components/house_map/frontend/`.
CI rebuilds it and fails when the committed bundle has drifted from the
sources, so rebuild and commit the bundle whenever you change the frontend.

## License

MIT. See [LICENSE](LICENSE).
