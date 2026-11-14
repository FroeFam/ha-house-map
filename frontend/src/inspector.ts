// STUB: replaced by the full implementation. Contract:
//
// <hm-inspector> properties:
//   hass: HomeAssistant
//   deviceId: string | null        selected device (null = nothing selected)
//   placement: Placement | null    its placement
//   floors: Floor[]
//   orphan: boolean                device no longer exists in HA
//   readOnly: boolean
// events (use fire() from ./types):
//   placement-change {deviceId, changes: Partial<PlacementInput>}
//       changes may hold any of: directional, rotation_deg, notes, floor_id
//       (unchecking directional sends {directional: false, rotation_deg: null})
//   placement-delete {deviceId}
import { LitElement, html } from "lit";
import type { Floor, HomeAssistant, Placement } from "./types";

export class HmInspector extends LitElement {
  static override properties = {
    hass: { attribute: false },
    deviceId: { attribute: false },
    placement: { attribute: false },
    floors: { attribute: false },
    orphan: { type: Boolean },
    readOnly: { type: Boolean },
  };

  hass!: HomeAssistant;
  deviceId: string | null = null;
  placement: Placement | null = null;
  floors: Floor[] = [];
  orphan = false;
  readOnly = false;

  override render() {
    return html`<div>Inspector</div>`;
  }
}

if (!customElements.get("hm-inspector")) customElements.define("hm-inspector", HmInspector);
