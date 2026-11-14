// Shared types. Backend contract: custom_components/house_map/websocket.py
// and http.py. Coordinates are SVG viewBox units; rotation is degrees
// clockwise with 0 = toward the top of the drawing.

export type ViewBox = [number, number, number, number]; // min_x, min_y, width, height

export interface Calibration {
  units_per_foot: number;
  origin_x: number;
  origin_y: number;
}

export interface Floor {
  id: string;
  name: string;
  order: number;
  svg_file: string | null;
  viewbox: ViewBox | null;
  calibration: Calibration;
}

export interface Placement {
  floor_id: string;
  x: number;
  y: number;
  directional: boolean;
  rotation_deg: number | null;
  notes: string;
  updated: string;
}

export interface HouseMapData {
  floors: Floor[];
  placements: Record<string, Placement>; // keyed by device_id
  orphans: string[]; // device_ids whose device no longer exists
  is_admin: boolean;
}

export type UploadMode = "check" | "keep" | "rescale";

export interface UploadResult {
  old_viewbox: ViewBox | null;
  new_viewbox: ViewBox;
  viewbox_changed: boolean;
  floor?: Floor;
}

// Subset of the Home Assistant frontend `hass` object that we use.
export interface HassDevice {
  id: string;
  name: string | null;
  name_by_user: string | null;
  area_id: string | null;
  manufacturer: string | null;
  model: string | null;
  disabled_by: string | null;
  entry_type: string | null; // "service" for non-physical devices
}

export interface HassEntity {
  entity_id: string;
  device_id: string | null;
  hidden?: boolean;
  entity_category?: string | null;
}

export interface HassArea {
  area_id: string;
  name: string;
  floor_id?: string | null;
}

export interface HassState {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface HomeAssistant {
  devices: Record<string, HassDevice>;
  entities: Record<string, HassEntity>;
  areas: Record<string, HassArea>;
  states: Record<string, HassState>;
  user?: { is_admin: boolean; name: string };
  themes?: { darkMode: boolean };
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  fetchWithAuth(path: string, init?: RequestInit): Promise<Response>;
}

export function deviceName(hass: HomeAssistant, deviceId: string): string {
  const d = hass.devices[deviceId];
  return d?.name_by_user || d?.name || "Unknown device";
}

export function areaName(hass: HomeAssistant, deviceId: string): string | null {
  const areaId = hass.devices[deviceId]?.area_id;
  return areaId ? (hass.areas[areaId]?.name ?? null) : null;
}

// Fire a composed, bubbling CustomEvent from a component.
export function fire<T>(node: HTMLElement, type: string, detail: T): void {
  node.dispatchEvent(new CustomEvent<T>(type, { detail, bubbles: true, composed: true }));
}
