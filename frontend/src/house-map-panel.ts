// House Map sidebar panel. Owns data loading and every backend write; child
// components only render and emit events.
import { LitElement, css, html, nothing } from "lit";
import { deletePlacement, fetchSvgObjectUrl, getData, setPlacement, type PlacementInput } from "./api";
import { deviceIcon } from "./icons";
import type { MarkerInfo } from "./plan-view";
import { deviceName, type HomeAssistant, type HouseMapData, type Placement } from "./types";
import "./plan-view";
import "./device-list";
import "./inspector";
import "./setup-wizard";
import "./floor-settings";

export class HouseMapPanel extends LitElement {
  static override properties = {
    hass: { attribute: false },
    narrow: { type: Boolean },
    _data: { state: true },
    _error: { state: true },
    _floorId: { state: true },
    _images: { state: true },
    _selectedId: { state: true },
    _placingId: { state: true },
    _settingsOpen: { state: true },
  };

  hass!: HomeAssistant;
  narrow = false;

  private _data: HouseMapData | null = null;
  private _error: string | null = null;
  private _floorId: string | null = null;
  private _images: Record<string, string> = {}; // floor id -> object URL
  private _selectedId: string | null = null;
  private _placingId: string | null = null;
  private _settingsOpen = false;
  private _loading = false;

  private _onKey = (ev: KeyboardEvent) => {
    if (ev.key === "Escape") this._placingId = null;
  };

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this._onKey);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._onKey);
    this._clearImages();
  }

  override updated(): void {
    if (this.hass && !this._data && !this._loading && !this._error) void this._load();
  }

  private _clearImages(): void {
    for (const url of Object.values(this._images)) URL.revokeObjectURL(url);
    this._images = {};
  }

  private async _load(reloadImages = false): Promise<void> {
    this._loading = true;
    try {
      const data = await getData(this.hass);
      if (reloadImages) this._clearImages();
      this._data = data;
      if (!data.floors.some((f) => f.id === this._floorId)) this._floorId = data.floors[0]?.id ?? null;
      this._error = null;
      await this._loadImages();
    } catch (err) {
      this._error = err instanceof Error ? err.message : String(err);
    } finally {
      this._loading = false;
    }
  }

  private async _loadImages(): Promise<void> {
    const images = { ...this._images };
    for (const floor of this._data?.floors ?? []) {
      if (!floor.svg_file || images[floor.id]) continue;
      try {
        images[floor.id] = await fetchSvgObjectUrl(this.hass, floor.id);
      } catch (err) {
        this._error = `Could not load plan for ${floor.name}: ${err instanceof Error ? err.message : err}`;
      }
    }
    this._images = images;
  }

  // ----- writes ---------------------------------------------------------

  private async _write(deviceId: string, changes: Partial<PlacementInput>): Promise<void> {
    const current = this._data?.placements[deviceId];
    const input: PlacementInput = {
      floor_id: changes.floor_id ?? current?.floor_id ?? this._floorId!,
      x: changes.x ?? current?.x ?? 0,
      y: changes.y ?? current?.y ?? 0,
      directional: changes.directional ?? current?.directional ?? false,
      rotation_deg: changes.rotation_deg !== undefined ? changes.rotation_deg : (current?.rotation_deg ?? null),
      notes: changes.notes ?? current?.notes ?? "",
    };
    try {
      const { placement } = await setPlacement(this.hass, deviceId, input);
      this._applyPlacement(deviceId, placement);
    } catch (err) {
      this._error = err instanceof Error ? err.message : String(err);
    }
  }

  private _applyPlacement(deviceId: string, placement: Placement | null): void {
    if (!this._data) return;
    const placements = { ...this._data.placements };
    if (placement) placements[deviceId] = placement;
    else delete placements[deviceId];
    const orphans = placement ? this._data.orphans : this._data.orphans.filter((d) => d !== deviceId);
    this._data = { ...this._data, placements, orphans };
  }

  private async _remove(deviceId: string): Promise<void> {
    try {
      await deletePlacement(this.hass, deviceId);
      this._applyPlacement(deviceId, null);
      if (this._selectedId === deviceId) this._selectedId = null;
    } catch (err) {
      this._error = err instanceof Error ? err.message : String(err);
    }
  }

  // ----- event handlers -------------------------------------------------

  private _onDevicePick(ev: CustomEvent<{ deviceId: string }>): void {
    const id = ev.detail.deviceId;
    this._placingId = this._placingId === id ? null : id;
    this._selectedId = null;
  }

  private _onDeviceSelect(ev: CustomEvent<{ deviceId: string }>): void {
    const placement = this._data?.placements[ev.detail.deviceId];
    if (placement) this._floorId = placement.floor_id;
    this._selectedId = ev.detail.deviceId;
    this._placingId = null;
  }

  private async _onPlanClick(ev: CustomEvent<{ x: number; y: number }>): Promise<void> {
    const deviceId = this._placingId;
    if (!deviceId || !this._floorId) return;
    this._placingId = null;
    await this._write(deviceId, { floor_id: this._floorId, x: ev.detail.x, y: ev.detail.y });
    this._selectedId = deviceId;
  }

  private _onMarkerSelect(ev: CustomEvent<{ deviceId: string | null }>): void {
    this._selectedId = ev.detail.deviceId;
  }

  private _onMarkerMove(ev: CustomEvent<{ deviceId: string; x: number; y: number }>): void {
    void this._write(ev.detail.deviceId, { x: ev.detail.x, y: ev.detail.y });
  }

  private _onMarkerRotate(ev: CustomEvent<{ deviceId: string; rotation_deg: number }>): void {
    void this._write(ev.detail.deviceId, { directional: true, rotation_deg: ev.detail.rotation_deg });
  }

  private _onPlacementChange(
    ev: CustomEvent<{ deviceId: string; changes: Partial<PlacementInput> }>,
  ): void {
    const { deviceId, changes } = ev.detail;
    if (changes.floor_id) this._floorId = changes.floor_id;
    void this._write(deviceId, changes);
  }

  // ----- rendering ------------------------------------------------------

  private _markers(): MarkerInfo[] {
    if (!this._data) return [];
    const orphans = new Set(this._data.orphans);
    return Object.entries(this._data.placements)
      .filter(([, p]) => p.floor_id === this._floorId)
      .map(([deviceId, p]) => ({
        deviceId,
        x: p.x,
        y: p.y,
        directional: p.directional,
        rotation_deg: p.rotation_deg,
        icon: deviceIcon(this.hass, deviceId),
        label: orphans.has(deviceId) ? "Deleted device" : deviceName(this.hass, deviceId),
        orphan: orphans.has(deviceId),
      }));
  }

  override render() {
    if (!this.hass) return nothing;
    if (!this._data) {
      return html`<div class="message">${this._error ?? "Loading..."}</div>`;
    }
    const data = this._data;
    const readOnly = !data.is_admin;
    const needsSetup = data.floors.length === 0 || data.floors.every((f) => !f.svg_file);
    if (needsSetup) {
      return readOnly
        ? html`<div class="message">House Map has not been set up yet.</div>`
        : html`<hm-setup-wizard
            .hass=${this.hass}
            .floors=${data.floors}
            @wizard-done=${() => this._load(true)}
          ></hm-setup-wizard>`;
    }
    const floor = data.floors.find((f) => f.id === this._floorId) ?? null;
    const selected = this._selectedId ? (data.placements[this._selectedId] ?? null) : null;
    return html`
      <header>
        <h1>House Map</h1>
        <nav>
          ${data.floors.map(
            (f) => html`<button
              class=${f.id === this._floorId ? "active" : ""}
              @click=${() => {
                this._floorId = f.id;
                this._selectedId = null;
              }}
            >
              ${f.name}
            </button>`,
          )}
        </nav>
        ${readOnly
          ? html`<span class="ro">View only</span>`
          : html`<button class="settings" @click=${() => (this._settingsOpen = true)}>Floors</button>`}
      </header>
      ${this._error
        ? html`<div class="error" @click=${() => (this._error = null)}>${this._error}</div>`
        : nothing}
      ${this._placingId
        ? html`<div class="hint">
            Click the plan to place <b>${deviceName(this.hass, this._placingId)}</b>. Esc cancels.
          </div>`
        : nothing}
      <main>
        <hm-device-list
          .hass=${this.hass}
          .placements=${data.placements}
          .orphans=${data.orphans}
          .floors=${data.floors}
          .selectedId=${this._selectedId}
          .placingId=${this._placingId}
          .readOnly=${readOnly}
          @device-pick=${this._onDevicePick}
          @device-select=${this._onDeviceSelect}
          @orphan-remove=${(ev: CustomEvent<{ deviceId: string }>) => this._remove(ev.detail.deviceId)}
        ></hm-device-list>
        <hm-plan-view
          .floor=${floor}
          .imageUrl=${floor ? (this._images[floor.id] ?? null) : null}
          .markers=${this._markers()}
          .selectedId=${this._selectedId}
          .placing=${!!this._placingId}
          .readOnly=${readOnly}
          @plan-click=${this._onPlanClick}
          @marker-select=${this._onMarkerSelect}
          @marker-move=${this._onMarkerMove}
          @marker-rotate=${this._onMarkerRotate}
        ></hm-plan-view>
        <hm-inspector
          .hass=${this.hass}
          .deviceId=${this._selectedId}
          .placement=${selected}
          .floors=${data.floors}
          .orphan=${!!this._selectedId && data.orphans.includes(this._selectedId)}
          .readOnly=${readOnly}
          @placement-change=${this._onPlacementChange}
          @placement-delete=${(ev: CustomEvent<{ deviceId: string }>) => this._remove(ev.detail.deviceId)}
        ></hm-inspector>
      </main>
      ${this._settingsOpen
        ? html`<hm-floor-settings
            .hass=${this.hass}
            .floors=${data.floors}
            .placements=${data.placements}
            @floors-changed=${() => this._load(true)}
            @closed=${() => (this._settingsOpen = false)}
          ></hm-floor-settings>`
        : nothing}
    `;
  }

  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      box-sizing: border-box;
      padding: 12px;
      gap: 8px;
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
    }
    header {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    h1 {
      font-size: 20px;
      font-weight: 500;
      margin: 0 12px 0 0;
    }
    nav {
      display: flex;
      gap: 4px;
      flex: 1;
    }
    header button {
      padding: 6px 14px;
      border-radius: 16px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      cursor: pointer;
    }
    nav button.active {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color);
    }
    .ro {
      color: var(--secondary-text-color);
    }
    main {
      flex: 1;
      min-height: 0;
      display: grid;
      grid-template-columns: 280px 1fr 300px;
      gap: 8px;
    }
    hm-device-list,
    hm-inspector {
      min-height: 0;
      overflow: auto;
    }
    .message {
      padding: 48px;
      text-align: center;
    }
    .error {
      padding: 8px 12px;
      border-radius: 6px;
      background: var(--error-color, #db4437);
      color: #fff;
      cursor: pointer;
    }
    .hint {
      padding: 8px 12px;
      border-radius: 6px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
  `;
}

if (!customElements.get("house-map-panel")) customElements.define("house-map-panel", HouseMapPanel);
