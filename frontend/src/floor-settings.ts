// <hm-floor-settings> modal dialog. Properties:
//   hass: HomeAssistant
//   floors: Floor[]
//   placements: Record<device_id, Placement>   (to count devices per floor)
// It calls the API itself (createFloor, updateFloor, reorderFloors,
// deleteFloor, uploadSvg) and fires:
//   floors-changed {}   after any successful change; the panel reloads data
//   closed {}           user closed the dialog
import { LitElement, css, html, nothing } from "lit";
import { createFloor, deleteFloor, reorderFloors, updateFloor, uploadSvg } from "./api";
import { fire, type Floor, type HomeAssistant, type Placement, type ViewBox } from "./types";

interface PendingReplace {
  file: File;
  oldVb: ViewBox | null;
  newVb: ViewBox;
}

interface CalibDraft {
  upf?: string;
  ox?: string;
  oy?: string;
}

const vbText = (vb: ViewBox | null) => (vb ? `${vb[2]} x ${vb[3]} units` : "none");

export class HmFloorSettings extends LitElement {
  static override properties = {
    hass: { attribute: false },
    floors: { attribute: false },
    placements: { attribute: false },
    _busy: { state: true },
    _errors: { state: true },
    _notes: { state: true },
    _nameDrafts: { state: true },
    _calibDrafts: { state: true },
    _pending: { state: true },
    _newName: { state: true },
  };

  hass!: HomeAssistant;
  floors: Floor[] = [];
  placements: Record<string, Placement> = {};

  private _busy = false;
  private _errors: Record<string, string> = {}; // key: floor id or "_add"
  private _notes: Record<string, string> = {};
  private _nameDrafts: Record<string, string> = {};
  private _calibDrafts: Record<string, CalibDraft> = {};
  private _pending: Record<string, PendingReplace> = {};
  private _newName = "";

  private _onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") this._close();
  };

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this._onKey);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._onKey);
  }

  private _close() {
    fire(this, "closed", {});
  }

  private get _sorted(): Floor[] {
    return [...this.floors].sort((a, b) => a.order - b.order);
  }

  private _deviceCount(floorId: string): number {
    return Object.values(this.placements ?? {}).filter((p) => p.floor_id === floorId).length;
  }

  private _setMsg(key: string, error: string | null, note: string | null = null) {
    const errors = { ...this._errors };
    const notes = { ...this._notes };
    if (error) errors[key] = error;
    else delete errors[key];
    if (note) notes[key] = note;
    else delete notes[key];
    this._errors = errors;
    this._notes = notes;
  }

  // Run an API action with busy tracking and inline error display.
  private async _run(key: string, action: () => Promise<void>, note: string | null = null): Promise<boolean> {
    this._busy = true;
    this._setMsg(key, null);
    try {
      await action();
      this._setMsg(key, null, note);
      fire(this, "floors-changed", {});
      return true;
    } catch (err) {
      this._setMsg(key, (err as Error).message);
      return false;
    } finally {
      this._busy = false;
    }
  }

  // ---- name

  private async _saveName(f: Floor) {
    const draft = this._nameDrafts[f.id];
    if (draft === undefined) return;
    const name = draft.trim();
    const drop = () => {
      const d = { ...this._nameDrafts };
      delete d[f.id];
      this._nameDrafts = d;
    };
    if (!name || name === f.name) {
      if (!name) this._setMsg(f.id, "Name cannot be empty.");
      drop();
      return;
    }
    const ok = await this._run(f.id, async () => {
      await updateFloor(this.hass, f.id, { name });
    });
    if (ok) drop();
  }

  // ---- order

  private async _move(index: number, delta: number) {
    const ids = this._sorted.map((f) => f.id);
    const j = index + delta;
    if (j < 0 || j >= ids.length) return;
    [ids[index], ids[j]] = [ids[j], ids[index]];
    await this._run(ids[j], async () => {
      await reorderFloors(this.hass, ids);
    });
  }

  // ---- calibration

  private _calibValue(f: Floor, key: keyof CalibDraft): string {
    const d = this._calibDrafts[f.id]?.[key];
    if (d !== undefined) return d;
    const c = f.calibration;
    return String(key === "upf" ? c.units_per_foot : key === "ox" ? c.origin_x : c.origin_y);
  }

  private _setCalibDraft(f: Floor, key: keyof CalibDraft, value: string) {
    this._calibDrafts = { ...this._calibDrafts, [f.id]: { ...this._calibDrafts[f.id], [key]: value } };
  }

  private async _saveCalib(f: Floor) {
    const raw = {
      upf: this._calibValue(f, "upf"),
      ox: this._calibValue(f, "ox"),
      oy: this._calibValue(f, "oy"),
    };
    const upf = Number(raw.upf);
    const ox = Number(raw.ox);
    const oy = Number(raw.oy);
    if (!raw.upf.trim() || !Number.isFinite(upf) || upf <= 0) {
      this._setMsg(f.id, "SVG units per foot must be a number greater than 0.");
      return;
    }
    if (!raw.ox.trim() || !raw.oy.trim() || !Number.isFinite(ox) || !Number.isFinite(oy)) {
      this._setMsg(f.id, "Origin X and Y must be numbers.");
      return;
    }
    const ok = await this._run(
      f.id,
      async () => {
        await updateFloor(this.hass, f.id, {
          calibration: { units_per_foot: upf, origin_x: ox, origin_y: oy },
        });
      },
      "Calibration saved.",
    );
    if (ok) {
      const d = { ...this._calibDrafts };
      delete d[f.id];
      this._calibDrafts = d;
    }
  }

  // ---- delete

  private async _delete(f: Floor) {
    const n = this._deviceCount(f.id);
    const text =
      n > 0
        ? `Delete "${f.name}"? ${n} device${n === 1 ? "" : "s"} on this floor will be removed from the map.`
        : `Delete "${f.name}"?`;
    if (!window.confirm(text)) return;
    await this._run(f.id, async () => {
      await deleteFloor(this.hass, f.id, n > 0);
    });
  }

  // ---- replace plan

  private _clearPending(floorId: string) {
    const p = { ...this._pending };
    delete p[floorId];
    this._pending = p;
  }

  private async _onReplaceFile(f: Floor, ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this._clearPending(f.id);
    this._busy = true;
    this._setMsg(f.id, null);
    try {
      const r = await uploadSvg(this.hass, f.id, file, "check");
      if (!r.viewbox_changed) {
        await uploadSvg(this.hass, f.id, file, "keep");
        this._setMsg(f.id, null, "Plan replaced.");
        fire(this, "floors-changed", {});
      } else {
        this._pending = { ...this._pending, [f.id]: { file, oldVb: r.old_viewbox, newVb: r.new_viewbox } };
      }
    } catch (err) {
      this._setMsg(f.id, (err as Error).message);
    } finally {
      this._busy = false;
      input.value = "";
    }
  }

  private async _confirmReplace(f: Floor, mode: "keep" | "rescale") {
    const p = this._pending[f.id];
    if (!p) return;
    const ok = await this._run(
      f.id,
      async () => {
        await uploadSvg(this.hass, f.id, p.file, mode);
      },
      "Plan replaced.",
    );
    if (ok) this._clearPending(f.id);
  }

  // ---- add floor

  private async _add() {
    const name = this._newName.trim();
    if (!name) {
      this._setMsg("_add", "Enter a name for the new floor.");
      return;
    }
    const ok = await this._run(
      "_add",
      async () => {
        await createFloor(this.hass, name);
      },
      "Floor added. Upload its plan in its row below.",
    );
    if (ok) this._newName = "";
  }

  // ---- render

  override render() {
    const floors = this._sorted;
    return html`
      <div class="backdrop" @click=${(e: Event) => e.target === e.currentTarget && this._close()}>
        <div class="dialog" role="dialog" aria-modal="true" aria-label="Floor settings">
          <div class="header">
            <h2>Floor settings</h2>
            <button @click=${() => this._close()}>Close</button>
          </div>
          <div class="body">
            ${floors.length === 0 ? html`<p class="hint">There are no floors yet.</p>` : nothing}
            ${floors.map((f, i) => this._renderFloor(f, i, floors.length))}
            <div class="row add">
              <div class="title">Add floor</div>
              <div class="inline">
                <input
                  type="text"
                  placeholder="Floor name"
                  .value=${this._newName}
                  ?disabled=${this._busy}
                  @input=${(e: Event) => (this._newName = (e.target as HTMLInputElement).value)}
                  @keydown=${(e: KeyboardEvent) => e.key === "Enter" && this._add()}
                />
                <button class="primary" ?disabled=${this._busy} @click=${() => this._add()}>Add floor</button>
              </div>
              ${this._msg("_add")}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private _msg(key: string) {
    return html`
      ${this._errors[key] ? html`<div class="error" role="alert">${this._errors[key]}</div>` : nothing}
      ${this._notes[key] ? html`<div class="ok">${this._notes[key]}</div>` : nothing}
    `;
  }

  private _renderFloor(f: Floor, i: number, total: number) {
    const n = this._deviceCount(f.id);
    const pending = this._pending[f.id];
    return html`
      <div class="row">
        <div class="inline">
          <input
            type="text"
            class="name"
            aria-label="Floor name"
            .value=${this._nameDrafts[f.id] ?? f.name}
            ?disabled=${this._busy}
            @input=${(e: Event) =>
              (this._nameDrafts = { ...this._nameDrafts, [f.id]: (e.target as HTMLInputElement).value })}
            @blur=${() => this._saveName(f)}
            @keydown=${(e: KeyboardEvent) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
          />
          <button
            title="Move up"
            aria-label="Move up"
            ?disabled=${this._busy || i === 0}
            @click=${() => this._move(i, -1)}
          >
            Up
          </button>
          <button
            title="Move down"
            aria-label="Move down"
            ?disabled=${this._busy || i === total - 1}
            @click=${() => this._move(i, 1)}
          >
            Down
          </button>
          <button class="danger" ?disabled=${this._busy} @click=${() => this._delete(f)}>Delete</button>
        </div>
        <div class="meta">
          ${n} device${n === 1 ? "" : "s"} on this floor.
          ${f.svg_file ? html`Plan: ${vbText(f.viewbox)}.` : html`<strong>No plan uploaded yet.</strong>`}
        </div>

        <div class="section">
          <label class="lbl">${f.svg_file ? "Replace plan" : "Upload plan"}</label>
          <input
            type="file"
            accept=".svg,image/svg+xml"
            ?disabled=${this._busy}
            @change=${(e: Event) => this._onReplaceFile(f, e)}
          />
          ${pending
            ? html`
                <div class="choice">
                  <div>
                    The new plan has a different size. Old: ${vbText(pending.oldVb)}. New: ${vbText(pending.newVb)}.
                  </div>
                  <div class="inline wrap">
                    <button ?disabled=${this._busy} @click=${() => this._confirmReplace(f, "keep")}>
                      Keep positions as they are
                    </button>
                    <button class="primary" ?disabled=${this._busy} @click=${() => this._confirmReplace(f, "rescale")}>
                      Scale positions to the new plan
                    </button>
                    <button ?disabled=${this._busy} @click=${() => this._clearPending(f.id)}>Cancel</button>
                  </div>
                </div>
              `
            : nothing}
        </div>

        <div class="section">
          <label class="lbl">Calibration</label>
          <div class="calib">
            ${this._calibField(f, "SVG units per foot", "upf", "0.0001")}
            ${this._calibField(f, "Origin X", "ox", "any")} ${this._calibField(f, "Origin Y", "oy", "any")}
            <button ?disabled=${this._busy} @click=${() => this._saveCalib(f)}>Save</button>
          </div>
        </div>
        ${this._msg(f.id)}
      </div>
    `;
  }

  private _calibField(f: Floor, label: string, key: keyof CalibDraft, step: string) {
    return html`
      <label class="field">
        <span>${label}</span>
        <input
          type="number"
          step=${step}
          .value=${this._calibValue(f, key)}
          ?disabled=${this._busy}
          @input=${(e: Event) => this._setCalibDraft(f, key, (e.target as HTMLInputElement).value)}
        />
      </label>
    `;
  }

  static override styles = css`
    :host {
      color: var(--primary-text-color);
    }
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.5);
    }
    .dialog {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 720px;
      max-height: 100%;
      background: var(--card-background-color, #fff);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      overflow: hidden;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      border-bottom: 1px solid var(--divider-color, #ddd);
    }
    h2 {
      margin: 0;
      font-weight: 500;
    }
    .body {
      overflow-y: auto;
      padding: 8px 20px 20px;
    }
    .row {
      padding: 14px 0;
      border-bottom: 1px solid var(--divider-color, #ddd);
    }
    .row:last-child {
      border-bottom: none;
    }
    .title {
      font-weight: 500;
      margin-bottom: 8px;
    }
    .inline {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .inline.wrap {
      flex-wrap: wrap;
      margin-top: 8px;
    }
    .meta,
    .hint {
      color: var(--secondary-text-color);
      font-size: 0.9em;
      margin-top: 6px;
    }
    .section {
      margin-top: 12px;
    }
    .lbl {
      display: block;
      font-size: 0.85em;
      color: var(--secondary-text-color);
      margin-bottom: 4px;
    }
    .calib {
      display: flex;
      gap: 8px;
      align-items: flex-end;
      flex-wrap: wrap;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1 1 120px;
    }
    .field span {
      font-size: 0.8em;
      color: var(--secondary-text-color);
    }
    input[type="text"],
    input[type="number"] {
      font: inherit;
      padding: 7px 10px;
      color: var(--primary-text-color);
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 6px;
      box-sizing: border-box;
      width: 100%;
      min-width: 0;
    }
    input.name {
      flex: 1;
    }
    input:focus {
      outline: 2px solid var(--primary-color);
    }
    input[type="file"] {
      font: inherit;
      color: var(--primary-text-color);
      max-width: 100%;
    }
    button {
      font: inherit;
      padding: 7px 14px;
      border-radius: 6px;
      cursor: pointer;
      white-space: nowrap;
      color: var(--primary-text-color);
      background: transparent;
      border: 1px solid var(--divider-color, #ccc);
    }
    button.primary {
      color: var(--text-primary-color, #fff);
      background: var(--primary-color);
      border-color: var(--primary-color);
    }
    button.danger {
      color: var(--error-color, #db4437);
      border-color: var(--error-color, #db4437);
    }
    button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .choice {
      margin-top: 8px;
      padding: 10px 12px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.1));
    }
    .error {
      color: var(--error-color, #db4437);
      font-size: 0.9em;
      margin-top: 8px;
    }
    .ok {
      color: var(--success-color, #2e7d32);
      font-size: 0.9em;
      margin-top: 8px;
    }
  `;
}

if (!customElements.get("hm-floor-settings")) customElements.define("hm-floor-settings", HmFloorSettings);
