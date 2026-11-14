// STUB: replaced by the full implementation. Contract:
//
// <hm-floor-settings> modal dialog. Properties:
//   hass: HomeAssistant
//   floors: Floor[]
//   placements: Record<device_id, Placement>   (to count devices per floor)
// It calls the API itself (createFloor, updateFloor, reorderFloors,
// deleteFloor, uploadSvg) and fires:
//   floors-changed {}   after any successful change; the panel reloads data
//   closed {}           user closed the dialog
import { LitElement, html } from "lit";
import type { Floor, HomeAssistant, Placement } from "./types";

export class HmFloorSettings extends LitElement {
  static override properties = {
    hass: { attribute: false },
    floors: { attribute: false },
    placements: { attribute: false },
  };

  hass!: HomeAssistant;
  floors: Floor[] = [];
  placements: Record<string, Placement> = {};

  override render() {
    return html`<div>Floor settings</div>`;
  }
}

if (!customElements.get("hm-floor-settings")) customElements.define("hm-floor-settings", HmFloorSettings);
