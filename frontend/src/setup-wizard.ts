// <hm-setup-wizard>: first-run setup. Properties:
//   hass: HomeAssistant
//   floors: Floor[]   floors that already exist (a resumed, half-done setup)
// It calls the API itself (createFloor, uploadSvg with mode "keep",
// updateFloor for calibration) and then fires:
//   wizard-done {}    the panel reloads all data
import { LitElement, css, html, nothing } from "lit";
import { createFloor, deleteFloor, updateFloor, uploadSvg } from "./api";
import { fire, type Floor, type HomeAssistant, type ViewBox } from "./types";

const ORDINALS = ["First", "Second", "Third"];
const defaultName = (i: number) => (i < ORDINALS.length ? `${ORDINALS[i]} Floor` : `Floor ${i + 1}`);
const MAX_FLOORS = 20;

interface FileCheck {
  file: File | null;
  busy: boolean;
  viewbox: ViewBox | null;
  error: string | null;
}

interface CalibText {
  upf: string;
  ox: string;
  oy: string;
}

const emptyCheck = (): FileCheck => ({ file: null, busy: false, viewbox: null, error: null });

export class HmSetupWizard extends LitElement {
  static override properties = {
    hass: { attribute: false },
    floors: { attribute: false },
    _step: { state: true },
    _count: { state: true },
    _names: { state: true },
    _local: { state: true },
    _checks: { state: true },
    _calib: { state: true },
    _busy: { state: true },
    _error: { state: true },
  };

  hass!: HomeAssistant;
  floors: Floor[] = [];

  private _step = 1;
  private _count: number | null = null;
  private _names: string[] = [];
  // Floors as known after step 2 (kept locally because the parent only
  // reloads when the wizard is done).
  private _local: Floor[] | null = null;
  private _checks: FileCheck[] = [];
  private _calib: CalibText[] = [];
  private _busy = false;
  private _error: string | null = null;

  private get _base(): Floor[] {
    return this._local ?? [...this.floors].sort((a, b) => a.order - b.order);
  }

  private get _countValue(): number {
    return this._count ?? (this._base.length || 2);
  }

  private _countValid(): boolean {
    const n = this._countValue;
    return Number.isInteger(n) && n >= 1 && n <= MAX_FLOORS;
  }

  private _hasSvg(i: number): boolean {
    const f = this._local?.[i];
    return !!f?.svg_file || !!this._checks[i]?.viewbox;
  }

  private _go(step: number) {
    this._error = null;
    this._step = step;
  }

  // ---- step 1 -> 2

  private _toNames() {
    if (!this._countValid()) {
      this._error = `Enter a whole number from 1 to ${MAX_FLOORS}.`;
      return;
    }
    const n = this._countValue;
    const base = this._base;
    const names: string[] = [];
    for (let i = 0; i < n; i++) {
      names.push(this._names[i] ?? base[i]?.name ?? defaultName(i));
    }
    this._names = names;
    this._go(2);
  }

  // ---- step 2 -> 3: create / rename / delete floors

  private async _saveFloors() {
    const names = this._names.map((s) => s.trim());
    if (names.some((s) => !s)) {
      this._error = "Every floor needs a name.";
      return;
    }
    this._busy = true;
    this._error = null;
    const existing = [...this._base];
    const result: Floor[] = [];
    try {
      for (let i = 0; i < names.length; i++) {
        const cur = existing[i];
        if (!cur) {
          const r = await createFloor(this.hass, names[i]);
          result.push(r.floor);
        } else if (cur.name !== names[i]) {
          const r = await updateFloor(this.hass, cur.id, { name: names[i] });
          result.push(r.floor);
        } else {
          result.push(cur);
        }
        this._local = [...result, ...existing.slice(i + 1)];
      }
      for (let i = existing.length - 1; i >= names.length; i--) {
        await deleteFloor(this.hass, existing[i].id);
      }
      this._local = result;
      const old = this._checks;
      this._checks = result.map((_, i) => old[i] ?? emptyCheck());
      this._go(3);
    } catch (err) {
      this._error = (err as Error).message;
    } finally {
      this._busy = false;
    }
  }

  // ---- step 3: uploads

  private async _onFile(i: number, ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    const floor = this._local?.[i];
    if (!floor) return;
    this._setCheck(i, { file, busy: !!file, viewbox: null, error: null });
    if (!file) return;
    try {
      const r = await uploadSvg(this.hass, floor.id, file, "check");
      this._setCheck(i, { file, busy: false, viewbox: r.new_viewbox, error: null });
    } catch (err) {
      this._setCheck(i, { file, busy: false, viewbox: null, error: (err as Error).message });
    }
  }

  private _setCheck(i: number, c: FileCheck) {
    const next = [...this._checks];
    next[i] = c;
    this._checks = next;
  }

  private _uploadReady(): boolean {
    const floors = this._local ?? [];
    if (this._checks.some((c) => c.busy)) return false;
    // A chosen file that failed validation blocks Next until fixed or cleared.
    if (this._checks.some((c) => c.file && c.error)) return false;
    return floors.some((_, i) => this._hasSvg(i));
  }

  private async _uploadAll() {
    this._busy = true;
    this._error = null;
    try {
      for (let i = 0; i < this._checks.length; i++) {
        const c = this._checks[i];
        const floor = this._local?.[i];
        if (!c.file || !c.viewbox || !floor) continue;
        const r = await uploadSvg(this.hass, floor.id, c.file, "keep");
        const updated = r.floor ?? { ...floor, svg_file: "uploaded" };
        this._local = (this._local ?? []).map((f, j) => (j === i ? updated : f));
        // Uploaded: clear the pending file but remember it is done.
        this._setCheck(i, emptyCheck());
      }
      this._calib = (this._local ?? []).map((f) => ({
        upf: String(f.calibration?.units_per_foot ?? 1),
        ox: String(f.calibration?.origin_x ?? 0),
        oy: String(f.calibration?.origin_y ?? 0),
      }));
      this._go(4);
    } catch (err) {
      this._error = (err as Error).message;
    } finally {
      this._busy = false;
    }
  }

  // ---- step 4: calibration

  private _setCalib(i: number, key: keyof CalibText, value: string) {
    const next = [...this._calib];
    next[i] = { ...next[i], [key]: value };
    this._calib = next;
  }

  private async _finish() {
    const parsed: { upf: number; ox: number; oy: number }[] = [];
    for (const c of this._calib) {
      const upf = Number(c.upf);
      const ox = Number(c.ox);
      const oy = Number(c.oy);
      if (!c.upf.trim() || !Number.isFinite(upf) || upf <= 0) {
        this._error = "SVG units per foot must be a number greater than 0.";
        return;
      }
      if (!c.ox.trim() || !c.oy.trim() || !Number.isFinite(ox) || !Number.isFinite(oy)) {
        this._error = "Origin X and Y must be numbers.";
        return;
      }
      parsed.push({ upf, ox, oy });
    }
    this._busy = true;
    this._error = null;
    try {
      const floors = this._local ?? [];
      for (let i = 0; i < floors.length; i++) {
        const p = parsed[i];
        await updateFloor(this.hass, floors[i].id, {
          calibration: { units_per_foot: p.upf, origin_x: p.ox, origin_y: p.oy },
        });
      }
      fire(this, "wizard-done", {});
    } catch (err) {
      this._error = (err as Error).message;
    } finally {
      this._busy = false;
    }
  }

  // ---- render

  override render() {
    return html`
      <div class="card">
        <div class="step">Step ${this._step} of 4</div>
        ${this._step === 1 ? this._renderCount() : nothing}
        ${this._step === 2 ? this._renderNames() : nothing}
        ${this._step === 3 ? this._renderUpload() : nothing}
        ${this._step === 4 ? this._renderCalibration() : nothing}
        ${this._error ? html`<div class="error" role="alert">${this._error}</div>` : nothing}
      </div>
    `;
  }

  private _renderCount() {
    return html`
      <h2>How many floors?</h2>
      <p class="hint">Count every level of the house you want a plan for, including a basement if you have one.</p>
      <label class="field">
        <span>Number of floors</span>
        <input
          type="number"
          min="1"
          max=${MAX_FLOORS}
          step="1"
          .value=${String(this._countValue)}
          ?disabled=${this._busy}
          @input=${(e: Event) => (this._count = (e.target as HTMLInputElement).valueAsNumber)}
          @keydown=${(e: KeyboardEvent) => e.key === "Enter" && this._toNames()}
        />
      </label>
      <div class="actions">
        <span></span>
        <button class="primary" ?disabled=${this._busy} @click=${() => this._toNames()}>Next</button>
      </div>
    `;
  }

  private _renderNames() {
    return html`
      <h2>Name your floors</h2>
      ${this._names.map(
        (name, i) => html`
          <label class="field">
            <span>Floor ${i + 1}</span>
            <input
              type="text"
              .value=${name}
              ?disabled=${this._busy}
              @input=${(e: Event) => {
                const next = [...this._names];
                next[i] = (e.target as HTMLInputElement).value;
                this._names = next;
              }}
            />
          </label>
        `,
      )}
      <div class="actions">
        <button ?disabled=${this._busy} @click=${() => this._go(1)}>Back</button>
        <button class="primary" ?disabled=${this._busy} @click=${() => this._saveFloors()}>
          ${this._busy ? "Saving..." : "Next"}
        </button>
      </div>
    `;
  }

  private _renderUpload() {
    const floors = this._local ?? [];
    return html`
      <h2>Upload floor plans</h2>
      <p class="hint">Choose an SVG file for each floor. At least one floor needs a plan; you can skip the others for now.</p>
      ${floors.map((f, i) => {
        const c = this._checks[i] ?? emptyCheck();
        return html`
          <div class="floor-row">
            <div class="floor-name">${f.name}</div>
            <input
              type="file"
              accept=".svg,image/svg+xml"
              ?disabled=${this._busy}
              @change=${(e: Event) => this._onFile(i, e)}
            />
            ${c.file ? html`<div class="meta">${c.file.name}</div>` : nothing}
            ${c.busy ? html`<div class="meta">Checking...</div>` : nothing}
            ${c.viewbox
              ? html`<div class="ok">Valid plan: ${c.viewbox[2]} x ${c.viewbox[3]} units</div>`
              : nothing}
            ${c.error ? html`<div class="error">${c.error}</div>` : nothing}
            ${!c.file && f.svg_file ? html`<div class="ok">A plan is already uploaded for this floor.</div>` : nothing}
            ${!c.file && !f.svg_file ? html`<div class="meta">No plan yet (skipped).</div>` : nothing}
          </div>
        `;
      })}
      <div class="actions">
        <button ?disabled=${this._busy} @click=${() => this._go(2)}>Back</button>
        <button class="primary" ?disabled=${this._busy || !this._uploadReady()} @click=${() => this._uploadAll()}>
          ${this._busy ? "Uploading..." : "Next"}
        </button>
      </div>
    `;
  }

  private _renderCalibration() {
    const floors = this._local ?? [];
    return html`
      <h2>Calibration</h2>
      <p class="hint">
        Positions are stored in the SVG's own units. To also get real distances, say how many SVG units make one foot
        and where the origin (0, 0 in feet) is.
      </p>
      <p class="hint">If your plan was drawn in feet, keep 1 / 0 / 0.</p>
      ${floors.map((f, i) => {
        const c = this._calib[i] ?? { upf: "1", ox: "0", oy: "0" };
        return html`
          <div class="floor-row">
            <div class="floor-name">${f.name}</div>
            <div class="calib">
              ${this._numField("SVG units per foot", c.upf, (v) => this._setCalib(i, "upf", v), "0.0001")}
              ${this._numField("Origin X", c.ox, (v) => this._setCalib(i, "ox", v), "any")}
              ${this._numField("Origin Y", c.oy, (v) => this._setCalib(i, "oy", v), "any")}
            </div>
          </div>
        `;
      })}
      <div class="actions">
        <button ?disabled=${this._busy} @click=${() => this._go(3)}>Back</button>
        <button class="primary" ?disabled=${this._busy} @click=${() => this._finish()}>
          ${this._busy ? "Saving..." : "Finish"}
        </button>
      </div>
    `;
  }

  private _numField(label: string, value: string, onInput: (v: string) => void, step: string) {
    return html`
      <label class="field small">
        <span>${label}</span>
        <input
          type="number"
          step=${step}
          .value=${value}
          ?disabled=${this._busy}
          @input=${(e: Event) => onInput((e.target as HTMLInputElement).value)}
        />
      </label>
    `;
  }

  static override styles = css`
    :host {
      display: block;
      padding: 16px;
      box-sizing: border-box;
      color: var(--primary-text-color);
    }
    .card {
      max-width: 640px;
      margin: 24px auto;
      padding: 24px;
      background: var(--card-background-color, #fff);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0, 0, 0, 0.2));
    }
    .step {
      font-size: 0.85em;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    h2 {
      margin: 8px 0 12px;
      font-weight: 500;
    }
    .hint {
      color: var(--secondary-text-color);
      margin: 0 0 12px;
      line-height: 1.4;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 12px;
    }
    .field span {
      font-size: 0.85em;
      color: var(--secondary-text-color);
    }
    input[type="text"],
    input[type="number"] {
      font: inherit;
      padding: 8px 10px;
      color: var(--primary-text-color);
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 6px;
      box-sizing: border-box;
      width: 100%;
    }
    input:focus {
      outline: 2px solid var(--primary-color);
      outline-offset: 0;
    }
    input[type="file"] {
      font: inherit;
      color: var(--primary-text-color);
    }
    .floor-row {
      padding: 12px 0;
      border-top: 1px solid var(--divider-color, #ddd);
    }
    .floor-name {
      font-weight: 500;
      margin-bottom: 6px;
    }
    .meta {
      color: var(--secondary-text-color);
      font-size: 0.9em;
      margin-top: 4px;
      word-break: break-all;
    }
    .ok {
      color: var(--success-color, #2e7d32);
      font-size: 0.9em;
      margin-top: 4px;
    }
    .error {
      color: var(--error-color, #db4437);
      font-size: 0.9em;
      margin-top: 8px;
    }
    .calib {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
    .calib .field {
      margin-bottom: 0;
    }
    .actions {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
    button {
      font: inherit;
      padding: 8px 18px;
      border-radius: 6px;
      cursor: pointer;
      color: var(--primary-text-color);
      background: transparent;
      border: 1px solid var(--divider-color, #ccc);
    }
    button.primary {
      color: var(--text-primary-color, #fff);
      background: var(--primary-color);
      border-color: var(--primary-color);
    }
    button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    @media (max-width: 520px) {
      .calib {
        grid-template-columns: 1fr;
      }
    }
  `;
}

if (!customElements.get("hm-setup-wizard")) customElements.define("hm-setup-wizard", HmSetupWizard);
