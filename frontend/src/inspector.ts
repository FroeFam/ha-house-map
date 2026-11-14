// <hm-inspector> properties:
//   hass, deviceId, placement, floors, orphan, readOnly
// events (use fire() from ./types):
//   placement-change {deviceId, changes: Partial<PlacementInput>}
//       changes may hold any of: directional, rotation_deg, notes, floor_id
//       (unchecking directional sends {directional: false, rotation_deg: null})
//   placement-delete {deviceId}
import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues } from "lit";
import { areaName, deviceName, fire } from "./types";
import type { Floor, HomeAssistant, Placement } from "./types";

const MAX_NOTES = 2000;

export class HmInspector extends LitElement {
  static override properties = {
    hass: { attribute: false },
    deviceId: { attribute: false },
    placement: { attribute: false },
    floors: { attribute: false },
    orphan: { type: Boolean },
    readOnly: { type: Boolean },
    _draft: { state: true },
  };

  hass!: HomeAssistant;
  deviceId: string | null = null;
  placement: Placement | null = null;
  floors: Floor[] = [];
  orphan = false;
  readOnly = false;
  _draft = "";

  protected override willUpdate(changed: PropertyValues): void {
    if (changed.has("deviceId")) this._draft = this.placement?.notes ?? "";
  }

  private _change(changes: Record<string, unknown>): void {
    if (!this.deviceId) return;
    fire(this, "placement-change", { deviceId: this.deviceId, changes });
  }

  private _onDirectional(e: Event): void {
    const on = (e.target as HTMLInputElement).checked;
    if (on) this._change({ directional: true, rotation_deg: this.placement?.rotation_deg ?? 0 });
    else this._change({ directional: false, rotation_deg: null });
  }

  private _onRotation(e: Event): void {
    const el = e.target as HTMLInputElement;
    const n = Number(el.value);
    if (el.value === "" || !Number.isFinite(n)) {
      el.value = String(this.placement?.rotation_deg ?? 0);
      return;
    }
    const deg = ((Math.round(n) % 360) + 360) % 360;
    el.value = String(deg);
    if (deg !== this.placement?.rotation_deg) this._change({ rotation_deg: deg });
  }

  private _onFloor(e: Event): void {
    const id = (e.target as HTMLSelectElement).value;
    if (id !== this.placement?.floor_id) this._change({ floor_id: id });
  }

  private _saveNotes(): void {
    const notes = this._draft.slice(0, MAX_NOTES);
    if (notes !== (this.placement?.notes ?? "")) this._change({ notes });
  }

  private _remove(): void {
    if (!this.deviceId) return;
    if (window.confirm("Remove this device from the map?")) {
      fire(this, "placement-delete", { deviceId: this.deviceId });
    }
  }

  private _feet(v: number, origin: number, upf: number): string {
    return upf ? ((v - origin) / upf).toFixed(2) : "n/a";
  }

  override render() {
    if (!this.deviceId || !this.placement) {
      return html`<p class="hint">Select a device on the plan or in the list.</p>
        <ul class="legend">
          <li><span class="swatch dot"></span> Device</li>
          <li><span class="swatch cone"></span> Direction the device faces</li>
          <li><span class="swatch red"></span> Deleted device</li>
        </ul>`;
    }
    const p = this.placement;
    const dev = this.hass?.devices[this.deviceId];
    const floor = this.floors.find((f) => f.id === p.floor_id);
    const cal = floor?.calibration;
    // A deleted device can only be removed: the backend rejects edits for it.
    const ro = this.readOnly || this.orphan;
    const area = this.orphan ? null : areaName(this.hass, this.deviceId);
    const mm = [dev?.manufacturer, dev?.model].filter(Boolean).join(" ");
    const rot = p.rotation_deg ?? 0;

    return html`
      <h2 class=${this.orphan ? "deleted" : ""}>${this.orphan ? "Deleted device" : deviceName(this.hass, this.deviceId)}</h2>
      ${!this.orphan && mm ? html`<div class="sub">${mm}</div>` : nothing}
      ${area ? html`<div class="sub">Area: ${area}</div>` : nothing}
      <div class="sub">Floor: ${floor?.name ?? "Unknown floor"}</div>

      <label class="field">
        <span>Floor</span>
        <select .value=${p.floor_id} ?disabled=${ro} @change=${this._onFloor}>
          ${this.floors.map((f) => html`<option value=${f.id} ?selected=${f.id === p.floor_id}>${f.name}</option>`)}
        </select>
      </label>

      <label class="check">
        <input type="checkbox" .checked=${p.directional} ?disabled=${ro} @change=${this._onDirectional} />
        <span>Directional</span>
      </label>
      <div class="help">Check for devices that face a direction, such as motion sensors or cameras.</div>

      ${p.directional
        ? html`<div class="field">
            <span>Rotation (deg)</span>
            <div class="rot">
              <input type="range" min="0" max="359" step="1" .value=${String(rot)} ?disabled=${ro} @change=${this._onRotation} />
              <input type="number" min="0" max="359" step="1" .value=${String(rot)} ?disabled=${ro} @change=${this._onRotation} />
            </div>
            <div class="help">0 is toward the top of the plan, clockwise. You can also drag the handle on the plan.</div>
          </div>`
        : nothing}

      <label class="field">
        <span>Notes</span>
        <textarea
          maxlength=${MAX_NOTES}
          rows="4"
          .value=${this._draft}
          ?disabled=${ro}
          @input=${(e: Event) => (this._draft = (e.target as HTMLTextAreaElement).value)}
          @blur=${this._saveNotes}
        ></textarea>
        <span class="help right">${this._draft.length}/${MAX_NOTES}</span>
      </label>

      <div class="field">
        <span>Position</span>
        <div class="sub">Plan units: x ${p.x.toFixed(2)}, y ${p.y.toFixed(2)}</div>
        ${cal
          ? html`<div class="sub">
              Feet: x ${this._feet(p.x, cal.origin_x, cal.units_per_foot)}, y ${this._feet(p.y, cal.origin_y, cal.units_per_foot)}
            </div>`
          : nothing}
      </div>

      ${this.readOnly ? nothing : html`<button class="remove" @click=${this._remove}>Remove from map</button>`}
    `;
  }

  static override styles = css`
    :host {
      display: block;
      box-sizing: border-box;
      padding: 12px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      border-radius: 8px;
    }
    h2 {
      margin: 0 0 4px;
      font-size: 1.1em;
      font-weight: 500;
    }
    h2.deleted {
      color: var(--error-color, #db4437);
    }
    .sub,
    .help,
    .hint {
      color: var(--secondary-text-color);
      font-size: 0.85em;
    }
    .help {
      margin: 2px 0 6px;
    }
    .help.right {
      text-align: right;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-top: 12px;
    }
    .field > span:first-child {
      font-size: 0.85em;
      color: var(--secondary-text-color);
    }
    select,
    textarea,
    input[type="number"] {
      box-sizing: border-box;
      padding: 6px 8px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 6px;
      background: transparent;
      color: inherit;
      font: inherit;
    }
    textarea {
      width: 100%;
      resize: vertical;
    }
    select option {
      color: initial;
    }
    .check {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
    }
    .rot {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .rot input[type="range"] {
      flex: 1;
    }
    .rot input[type="number"] {
      width: 70px;
    }
    .remove {
      margin-top: 16px;
      padding: 8px 12px;
      border: 1px solid var(--error-color, #db4437);
      border-radius: 6px;
      background: none;
      color: var(--error-color, #db4437);
      font: inherit;
      cursor: pointer;
    }
    .legend {
      list-style: none;
      padding: 0;
      margin: 8px 0 0;
    }
    .legend li {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 4px 0;
      font-size: 0.9em;
    }
    .swatch {
      display: inline-block;
      width: 14px;
      height: 14px;
    }
    .swatch.dot {
      border-radius: 50%;
      background: var(--primary-color, #03a9f4);
    }
    .swatch.cone {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 40%, transparent);
      clip-path: polygon(50% 100%, 0 0, 100% 0);
    }
    .swatch.red {
      border-radius: 50%;
      background: var(--error-color, #db4437);
    }
  `;
}

if (!customElements.get("hm-inspector")) customElements.define("hm-inspector", HmInspector);
