// STUB: replaced by the full implementation. Contract:
//
// <hm-setup-wizard> properties:
//   hass: HomeAssistant
//   floors: Floor[]   floors that already exist (a resumed, half-done setup)
// It calls the API itself (createFloor, uploadSvg with mode "keep",
// updateFloor for calibration) and then fires:
//   wizard-done {}    the panel reloads all data
import { LitElement, html } from "lit";
import type { Floor, HomeAssistant } from "./types";

export class HmSetupWizard extends LitElement {
  static override properties = {
    hass: { attribute: false },
    floors: { attribute: false },
  };

  hass!: HomeAssistant;
  floors: Floor[] = [];

  override render() {
    return html`<div>Setup wizard</div>`;
  }
}

if (!customElements.get("hm-setup-wizard")) customElements.define("hm-setup-wizard", HmSetupWizard);
