// Thin client for the House Map backend. All writes need an admin user.
import type {
  Calibration,
  Floor,
  HomeAssistant,
  HouseMapData,
  Placement,
  UploadMode,
  UploadResult,
} from "./types";

export const getData = (hass: HomeAssistant) =>
  hass.callWS<HouseMapData>({ type: "house_map/get" });

export const createFloor = (hass: HomeAssistant, name: string) =>
  hass.callWS<{ floor: Floor }>({ type: "house_map/floor/create", name });

export const updateFloor = (
  hass: HomeAssistant,
  floorId: string,
  changes: { name?: string; calibration?: Calibration },
) => hass.callWS<{ floor: Floor }>({ type: "house_map/floor/update", floor_id: floorId, ...changes });

export const reorderFloors = (hass: HomeAssistant, floorIds: string[]) =>
  hass.callWS<Record<string, never>>({ type: "house_map/floor/reorder", floor_ids: floorIds });

export const deleteFloor = (hass: HomeAssistant, floorId: string, force = false) =>
  hass.callWS<Record<string, never>>({ type: "house_map/floor/delete", floor_id: floorId, force });

export interface PlacementInput {
  floor_id: string;
  x: number;
  y: number;
  directional: boolean;
  rotation_deg: number | null;
  notes: string;
}

export const setPlacement = (hass: HomeAssistant, deviceId: string, p: PlacementInput) =>
  hass.callWS<{ placement: Placement }>({ type: "house_map/placement/set", device_id: deviceId, ...p });

export const deletePlacement = (hass: HomeAssistant, deviceId: string) =>
  hass.callWS<Record<string, never>>({ type: "house_map/placement/delete", device_id: deviceId });

const svgUrl = (floorId: string) => `/api/house_map/floors/${encodeURIComponent(floorId)}/svg`;

async function errorText(resp: Response): Promise<string> {
  try {
    const body = await resp.json();
    return body.message ?? resp.statusText;
  } catch {
    return resp.statusText;
  }
}

/** Upload an SVG. mode "check" validates and reports the viewBox without saving. */
export async function uploadSvg(
  hass: HomeAssistant,
  floorId: string,
  file: Blob,
  mode: UploadMode,
): Promise<UploadResult> {
  const resp = await hass.fetchWithAuth(`${svgUrl(floorId)}?mode=${mode}`, {
    method: "POST",
    headers: { "Content-Type": "image/svg+xml" },
    body: file,
  });
  if (!resp.ok) throw new Error(await errorText(resp));
  return resp.json();
}

/** Fetch a floor's SVG and return an object URL (caller revokes it). */
export async function fetchSvgObjectUrl(hass: HomeAssistant, floorId: string): Promise<string> {
  const resp = await hass.fetchWithAuth(svgUrl(floorId));
  if (!resp.ok) throw new Error(await errorText(resp));
  const blob = await resp.blob();
  return URL.createObjectURL(new Blob([blob], { type: "image/svg+xml" }));
}
