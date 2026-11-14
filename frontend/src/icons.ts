// Pick an MDI icon path for a device from its entities.
import {
  mdiCctv,
  mdiChip,
  mdiDoor,
  mdiFan,
  mdiFlash,
  mdiLightbulb,
  mdiLock,
  mdiMotionSensor,
  mdiPowerPlug,
  mdiSpeaker,
  mdiThermometer,
  mdiToggleSwitch,
  mdiVibrate,
  mdiWaterPercent,
  mdiWindowClosedVariant,
  mdiWeight,
} from "@mdi/js";
import type { HassEntity, HomeAssistant } from "./types";

const BY_DEVICE_CLASS: Record<string, string> = {
  motion: mdiMotionSensor,
  occupancy: mdiMotionSensor,
  presence: mdiMotionSensor,
  door: mdiDoor,
  garage_door: mdiDoor,
  opening: mdiDoor,
  window: mdiWindowClosedVariant,
  vibration: mdiVibrate,
  temperature: mdiThermometer,
  humidity: mdiWaterPercent,
  power: mdiFlash,
  energy: mdiFlash,
  weight: mdiWeight,
};

const BY_DOMAIN: Record<string, string> = {
  light: mdiLightbulb,
  switch: mdiPowerPlug,
  camera: mdiCctv,
  lock: mdiLock,
  fan: mdiFan,
  media_player: mdiSpeaker,
  input_boolean: mdiToggleSwitch,
};

// Priority so a motion sensor with a temperature entity shows as motion.
const CLASS_PRIORITY = [
  "motion", "occupancy", "presence", "door", "garage_door", "window", "opening",
  "vibration", "weight", "power", "energy", "temperature", "humidity",
];

// device_id -> entities, rebuilt only when hass.entities changes identity.
const entityIndex = new WeakMap<object, Map<string, HassEntity[]>>();

function entitiesOf(hass: HomeAssistant, deviceId: string): HassEntity[] {
  let index = entityIndex.get(hass.entities);
  if (!index) {
    index = new Map();
    for (const e of Object.values(hass.entities)) {
      if (!e.device_id) continue;
      const list = index.get(e.device_id);
      if (list) list.push(e);
      else index.set(e.device_id, [e]);
    }
    entityIndex.set(hass.entities, index);
  }
  return index.get(deviceId) ?? [];
}

export function deviceIcon(hass: HomeAssistant, deviceId: string): string {
  const entities = entitiesOf(hass, deviceId);
  const classes = new Set<string>();
  for (const e of entities) {
    const dc = hass.states[e.entity_id]?.attributes?.device_class;
    if (typeof dc === "string") classes.add(dc);
  }
  for (const dc of CLASS_PRIORITY) if (classes.has(dc)) return BY_DEVICE_CLASS[dc];
  for (const e of entities) {
    const icon = BY_DOMAIN[e.entity_id.split(".")[0]];
    if (icon) return icon;
  }
  return mdiChip;
}
