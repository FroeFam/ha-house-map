// STUB: replaced by the full implementation. Contract:
//
// <hm-device-list> properties:
//   hass: HomeAssistant
//   placements: Record<device_id, Placement>
//   orphans: string[]            device ids placed but deleted from HA
//   floors: Floor[]
//   selectedId: string | null    currently selected placed device
//   placingId: string | null     device waiting to be placed (click on plan)
//   readOnly: boolean
// events (use fire() from ./types):
//   device-pick   {deviceId}  user chose an UNPLACED device to place (admin only)
//   device-select {deviceId}  user chose a PLACED device (panel jumps to its floor)
//   orphan-remove {deviceId}  user removes an orphaned placement (admin only)
import { LitElement, html } from "lit";
import type { Floor, HomeAssistant, Placement } from "./types";

export class HmDeviceList extends LitElement {
  static override properties = {
    hass: { attribute: false },
    placements: { attribute: false },
    orphans: { attribute: false },
    floors: { attribute: false },
    selectedId: { attribute: false },
    placingId: { attribute: false },
    readOnly: { type: Boolean },
  };

  hass!: HomeAssistant;
  placements: Record<string, Placement> = {};
  orphans: string[] = [];
  floors: Floor[] = [];
  selectedId: string | null = null;
  placingId: string | null = null;
  readOnly = false;

  override render() {
    return html`<div>Device list</div>`;
  }
}

if (!customElements.get("hm-device-list")) customElements.define("hm-device-list", HmDeviceList);
