// <hm-device-list> properties:
//   hass, placements, orphans, floors, selectedId, placingId, readOnly
// events (use fire() from ./types):
//   device-pick   {deviceId}  user chose an UNPLACED device to place (admin only)
//   device-select {deviceId}  user chose a PLACED device (panel jumps to its floor)
//   orphan-remove {deviceId}  user removes an orphaned placement (admin only)
import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues } from "lit";
import { areaName, deviceName, fire } from "./types";
import type { Floor, HomeAssistant, Placement } from "./types";
import { deviceIcon } from "./icons";

interface Row {
  id: string;
  name: string;
  area: string;
  icon: string;
}
interface Group {
  key: string;
  label: string;
  rows: Row[];
}

export class HmDeviceList extends LitElement {
  static override properties = {
    hass: { attribute: false },
    placements: { attribute: false },
    orphans: { attribute: false },
    floors: { attribute: false },
    selectedId: { attribute: false },
    placingId: { attribute: false },
    readOnly: { type: Boolean },
    _search: { state: true },
    _collapsed: { state: true },
  };

  hass!: HomeAssistant;
  placements: Record<string, Placement> = {};
  orphans: string[] = [];
  floors: Floor[] = [];
  selectedId: string | null = null;
  placingId: string | null = null;
  readOnly = false;
  _search = "";
  _collapsed: Record<string, boolean> = {};

  private _placedGroups: Group[] = [];
  private _placedCount = 0;
  private _unplacedGroups: Group[] = [];
  private _unplacedCount = 0;
  private _orphanRows: { id: string; floor: string; notes: string }[] = [];

  private _lastDevices: unknown = null;
  private _lastAreas: unknown = null;

  override willUpdate(changed: PropertyValues): void {
    const devices = this.hass?.devices;
    const areas = this.hass?.areas;
    const dirty =
      changed.has("placements") ||
      changed.has("orphans") ||
      changed.has("floors") ||
      changed.has("readOnly") ||
      changed.has("_search") ||
      devices !== this._lastDevices ||
      areas !== this._lastAreas;
    if (!dirty || !this.hass) return;
    this._lastDevices = devices;
    this._lastAreas = areas;
    this._recompute();
  }

  private _recompute(): void {
    const hass = this.hass;
    const q = this._search.trim().toLowerCase();
    const orphanSet = new Set(this.orphans);
    const floorName = (id: string) => this.floors.find((f) => f.id === id)?.name ?? "Unknown floor";
    const cmp = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "base" });

    const match = (id: string, name: string, area: string): boolean => {
      if (!q) return true;
      const d = hass.devices[id];
      return [name, area, d?.manufacturer ?? "", d?.model ?? ""].some((s) => s.toLowerCase().includes(q));
    };
    const mkRow = (id: string): Row => ({
      id,
      name: deviceName(hass, id),
      area: areaName(hass, id) ?? "",
      icon: deviceIcon(hass, id),
    });

    this._orphanRows = this.orphans
      .filter((id) => this.placements[id])
      .map((id) => ({
        id,
        floor: floorName(this.placements[id].floor_id),
        notes: this.placements[id].notes ?? "",
      }))
      .filter((o) => !q || "deleted device".includes(q) || o.floor.toLowerCase().includes(q) || o.notes.toLowerCase().includes(q));

    // Placed, grouped by floor order.
    const byFloor = new Map<string, Row[]>();
    let placedCount = 0;
    for (const id of Object.keys(this.placements)) {
      if (orphanSet.has(id)) continue;
      const row = mkRow(id);
      if (!match(id, row.name, row.area)) continue;
      const fid = this.placements[id].floor_id;
      if (!byFloor.has(fid)) byFloor.set(fid, []);
      byFloor.get(fid)!.push(row);
      placedCount++;
    }
    const sortedFloors = [...this.floors].sort((a, b) => a.order - b.order);
    const placedGroups: Group[] = [];
    const seen = new Set<string>();
    for (const f of sortedFloors) {
      const rows = byFloor.get(f.id);
      seen.add(f.id);
      if (rows?.length) placedGroups.push({ key: "f:" + f.id, label: f.name, rows });
    }
    for (const [fid, rows] of byFloor) {
      if (!seen.has(fid) && rows.length) placedGroups.push({ key: "f:" + fid, label: "Unknown floor", rows });
    }
    for (const g of placedGroups) g.rows.sort((a, b) => cmp(a.area, b.area) || cmp(a.name, b.name));
    this._placedGroups = placedGroups;
    this._placedCount = placedCount;

    // Not placed, grouped by area.
    const byArea = new Map<string, Row[]>();
    let unplacedCount = 0;
    if (!this.readOnly) {
      for (const [id, d] of Object.entries(hass.devices)) {
        if (this.placements[id] || d.disabled_by || d.entry_type === "service") continue;
        const row = mkRow(id);
        if (!match(id, row.name, row.area)) continue;
        const label = row.area || "No area";
        if (!byArea.has(label)) byArea.set(label, []);
        byArea.get(label)!.push(row);
        unplacedCount++;
      }
    }
    const areaLabels = [...byArea.keys()].sort((a, b) => {
      if (a === "No area") return 1;
      if (b === "No area") return -1;
      return cmp(a, b);
    });
    this._unplacedGroups = areaLabels.map((label) => {
      const rows = byArea.get(label)!;
      rows.sort((a, b) => cmp(a.name, b.name));
      return { key: "a:" + label, label, rows };
    });
    this._unplacedCount = unplacedCount;
  }

  private _toggle(key: string): void {
    this._collapsed = { ...this._collapsed, [key]: !this._collapsed[key] };
  }

  private _icon(path: string) {
    return html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d=${path}></path></svg>`;
  }

  private _row(r: Row, kind: "select" | "pick") {
    const placing = kind === "pick" && this.placingId === r.id;
    const selected = kind === "select" && this.selectedId === r.id;
    return html`<button
      class="row ${selected || placing ? "active" : ""}"
      @click=${() => fire(this, kind === "pick" ? "device-pick" : "device-select", { deviceId: r.id })}
    >
      ${this._icon(r.icon)}
      <span class="text">
        <span class="name">${r.name}</span>
        ${placing
          ? html`<span class="sub hint">Click the plan...</span>`
          : kind === "select" && r.area
            ? html`<span class="sub">${r.area}</span>`
            : nothing}
      </span>
    </button>`;
  }

  override render() {
    const q = this._search.trim();
    return html`
      <input
        class="search"
        type="search"
        placeholder="Search devices"
        .value=${this._search}
        @input=${(e: Event) => (this._search = (e.target as HTMLInputElement).value)}
      />
      ${this._orphanRows.length
        ? html`<section class="orphans">
            <h3>Deleted devices</h3>
            ${this._orphanRows.map(
              (o) => html`<div class="orphan ${this.selectedId === o.id ? "active" : ""}">
                <div class="text">
                  <span class="name">Deleted device</span>
                  <span class="sub">${o.floor}${o.notes ? " - " + o.notes.slice(0, 60) : ""}</span>
                </div>
                <button class="small" @click=${() => fire(this, "device-select", { deviceId: o.id })}>Select</button>
                ${this.readOnly
                  ? nothing
                  : html`<button class="small danger" @click=${() => fire(this, "orphan-remove", { deviceId: o.id })}>
                      Remove
                    </button>`}
              </div>`,
            )}
          </section>`
        : nothing}
      <section>
        <h3>Placed (${this._placedCount})</h3>
        ${this._placedGroups.map(
          (g) => html`<div class="group-label">${g.label}</div>${g.rows.map((r) => this._row(r, "select"))}`,
        )}
        ${this._placedCount === 0 ? html`<div class="empty">${q ? "No matches." : "Nothing placed yet."}</div>` : nothing}
      </section>
      ${this.readOnly
        ? nothing
        : html`<section>
            <h3>Not placed (${this._unplacedCount})</h3>
            ${this._unplacedGroups.map((g) => {
              const open = !this._collapsed[g.key] || !!q;
              return html`<button class="group-label toggle" @click=${() => this._toggle(g.key)}>
                  <span>${open ? "v" : ">"}</span> ${g.label} (${g.rows.length})
                </button>
                ${open ? g.rows.map((r) => this._row(r, "pick")) : nothing}`;
            })}
            ${this._unplacedCount === 0 ? html`<div class="empty">${q ? "No matches." : "All devices are placed."}</div>` : nothing}
          </section>`}
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
    .search {
      box-sizing: border-box;
      width: 100%;
      padding: 8px 10px;
      margin-bottom: 8px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 6px;
      background: transparent;
      color: inherit;
      font: inherit;
    }
    h3 {
      margin: 12px 0 4px;
      font-size: 0.95em;
      font-weight: 500;
    }
    .orphans h3 {
      color: var(--error-color, #db4437);
    }
    .group-label {
      margin: 8px 0 2px;
      font-size: 0.8em;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--secondary-text-color);
    }
    button.toggle {
      display: block;
      width: 100%;
      text-align: left;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      font: inherit;
      font-size: 0.8em;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      box-sizing: border-box;
      padding: 6px 8px;
      border: none;
      border-radius: 6px;
      background: none;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
    .row:hover {
      background: var(--divider-color, rgba(127, 127, 127, 0.15));
    }
    .row.active,
    .orphan.active {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 20%, transparent);
    }
    svg {
      flex: none;
      width: 20px;
      height: 20px;
      fill: var(--secondary-text-color);
    }
    .text {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }
    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .sub {
      font-size: 0.8em;
      color: var(--secondary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .sub.hint {
      color: var(--accent-color, var(--primary-color));
    }
    .orphan {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 8px;
      border-left: 3px solid var(--error-color, #db4437);
      border-radius: 4px;
      margin-bottom: 4px;
    }
    button.small {
      padding: 4px 8px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 6px;
      background: none;
      color: inherit;
      font: inherit;
      font-size: 0.85em;
      cursor: pointer;
    }
    button.danger {
      color: var(--error-color, #db4437);
      border-color: var(--error-color, #db4437);
    }
    .empty {
      padding: 6px 8px;
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }
  `;
}

if (!customElements.get("hm-device-list")) customElements.define("hm-device-list", HmDeviceList);

