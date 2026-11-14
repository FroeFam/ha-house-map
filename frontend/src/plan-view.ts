// Floor plan canvas: renders the floor SVG and device markers in one SVG
// coordinate system (the floor's viewBox units), with zoom, pan, marker drag
// and rotation. It never writes to the backend; it emits events:
//
//   plan-click    {x, y}                     background click while placing
//   marker-select {deviceId | null}          click on a marker / empty space
//   marker-move   {deviceId, x, y}           marker drag finished
//   marker-rotate {deviceId, rotation_deg}   rotation handle drag finished
import { LitElement, css, html, nothing, svg } from "lit";
import { fire, type Floor, type ViewBox } from "./types";

export interface MarkerInfo {
  deviceId: string;
  x: number;
  y: number;
  directional: boolean;
  rotation_deg: number | null;
  icon: string; // MDI path data
  label: string;
  orphan: boolean;
}

const MARKER_PX = 13; // marker radius in screen pixels
const CONE_HALF_ANGLE = 30;
const DRAG_THRESHOLD_PX = 3;
const ZOOM_STEP = 1.2;

type Gesture =
  | { kind: "pan"; startX: number; startY: number; startView: ViewBox; moved: boolean }
  | { kind: "drag"; deviceId: string; startX: number; startY: number; moved: boolean }
  | { kind: "rotate"; deviceId: string };

const rad = (deg: number) => (deg * Math.PI) / 180;
const normDeg = (deg: number) => ((deg % 360) + 360) % 360;

export class HmPlanView extends LitElement {
  static override properties = {
    floor: { attribute: false },
    imageUrl: { attribute: false },
    markers: { attribute: false },
    selectedId: { attribute: false },
    placing: { type: Boolean },
    readOnly: { type: Boolean },
    _view: { state: true },
    _upp: { state: true },
    _dragPos: { state: true },
    _rotPreview: { state: true },
  };

  floor: Floor | null = null;
  imageUrl: string | null = null;
  markers: MarkerInfo[] = [];
  selectedId: string | null = null;
  placing = false;
  readOnly = false;

  private _view: ViewBox | null = null;
  private _upp = 1; // plan units per screen pixel
  private _dragPos: { deviceId: string; x: number; y: number } | null = null;
  private _rotPreview: { deviceId: string; deg: number } | null = null;
  private _gesture: Gesture | null = null;
  private _viewKey = "";
  private _resize = new ResizeObserver(() => this._measure());

  override connectedCallback(): void {
    super.connectedCallback();
    this._resize.observe(this);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._resize.disconnect();
  }

  override willUpdate(): void {
    // Reset zoom when the floor or its viewBox changes.
    const key = this.floor ? `${this.floor.id}:${this.floor.viewbox?.join(",")}` : "";
    if (key !== this._viewKey) {
      this._viewKey = key;
      this._view = this.floor?.viewbox ? [...this.floor.viewbox] as ViewBox : null;
    }
  }

  override updated(): void {
    this._measure();
  }

  /** Reset zoom to show the whole floor. */
  fit(): void {
    if (this.floor?.viewbox) this._view = [...this.floor.viewbox] as ViewBox;
  }

  zoom(factor: number, cx?: number, cy?: number): void {
    const v = this._view;
    const base = this.floor?.viewbox;
    if (!v || !base) return;
    const w = Math.min(Math.max(v[2] * factor, base[2] / 25), base[2] * 3);
    const f = w / v[2];
    const px = cx ?? v[0] + v[2] / 2;
    const py = cy ?? v[1] + v[3] / 2;
    this._view = [px - (px - v[0]) * f, py - (py - v[1]) * f, v[2] * f, v[3] * f];
  }

  private get _svg(): SVGSVGElement | null {
    return this.renderRoot.querySelector("svg.plan");
  }

  private _measure(): void {
    const el = this._svg;
    const v = this._view;
    if (!el || !v) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    // preserveAspectRatio "xMidYMid meet": uniform scale, the larger ratio wins.
    const upp = Math.max(v[2] / rect.width, v[3] / rect.height);
    if (Math.abs(upp - this._upp) / upp > 0.001) this._upp = upp;
  }

  private _toPlan(ev: { clientX: number; clientY: number }): { x: number; y: number } | null {
    const el = this._svg;
    const ctm = el?.getScreenCTM();
    if (!el || !ctm) return null;
    const p = new DOMPoint(ev.clientX, ev.clientY).matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  }

  private _markerPos(m: MarkerInfo): { x: number; y: number } {
    return this._dragPos?.deviceId === m.deviceId ? this._dragPos : m;
  }

  private _markerRot(m: MarkerInfo): number {
    return this._rotPreview?.deviceId === m.deviceId ? this._rotPreview.deg : (m.rotation_deg ?? 0);
  }

  // ----- pointer handling ------------------------------------------------

  private _onPointerDown(ev: PointerEvent): void {
    if (ev.button !== 0 && ev.button !== 1) return;
    const target = ev.target as Element;
    const handle = target.closest("[data-rotate]");
    const marker = target.closest("[data-marker]");
    const svgEl = this._svg;
    if (!svgEl || !this._view) return;

    if (handle && !this.readOnly) {
      this._gesture = { kind: "rotate", deviceId: handle.getAttribute("data-rotate")! };
    } else if (marker && ev.button === 0) {
      const deviceId = marker.getAttribute("data-marker")!;
      if (this.readOnly) {
        fire(this, "marker-select", { deviceId });
        return;
      }
      this._gesture = { kind: "drag", deviceId, startX: ev.clientX, startY: ev.clientY, moved: false };
    } else {
      this._gesture = {
        kind: "pan",
        startX: ev.clientX,
        startY: ev.clientY,
        startView: [...this._view] as ViewBox,
        moved: false,
      };
    }
    svgEl.setPointerCapture(ev.pointerId);
    ev.preventDefault();
  }

  private _onPointerMove(ev: PointerEvent): void {
    const g = this._gesture;
    if (!g) return;
    if (g.kind === "pan") {
      const dx = ev.clientX - g.startX;
      const dy = ev.clientY - g.startY;
      if (!g.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
      g.moved = true;
      const v = g.startView;
      this._view = [v[0] - dx * this._upp, v[1] - dy * this._upp, v[2], v[3]];
    } else if (g.kind === "drag") {
      if (!g.moved && Math.hypot(ev.clientX - g.startX, ev.clientY - g.startY) < DRAG_THRESHOLD_PX) return;
      g.moved = true;
      const p = this._toPlan(ev);
      if (p) this._dragPos = { deviceId: g.deviceId, ...p };
    } else {
      const m = this.markers.find((mk) => mk.deviceId === g.deviceId);
      const p = this._toPlan(ev);
      if (!m || !p) return;
      const deg = normDeg((Math.atan2(p.x - m.x, -(p.y - m.y)) * 180) / Math.PI);
      this._rotPreview = { deviceId: g.deviceId, deg: Math.round(deg) };
    }
  }

  private _onPointerUp(ev: PointerEvent): void {
    const g = this._gesture;
    this._gesture = null;
    this._svg?.releasePointerCapture(ev.pointerId);
    if (!g) return;
    if (g.kind === "pan") {
      if (g.moved) return;
      if (this.placing && !this.readOnly) {
        const p = this._toPlan(ev);
        if (p) fire(this, "plan-click", p);
      } else {
        fire(this, "marker-select", { deviceId: null });
      }
    } else if (g.kind === "drag") {
      if (g.moved && this._dragPos) {
        fire(this, "marker-move", { ...this._dragPos });
      } else {
        fire(this, "marker-select", { deviceId: g.deviceId });
      }
      this._dragPos = null;
    } else if (this._rotPreview) {
      fire(this, "marker-rotate", {
        deviceId: this._rotPreview.deviceId,
        rotation_deg: this._rotPreview.deg,
      });
      this._rotPreview = null;
    }
  }

  private _onWheel(ev: WheelEvent): void {
    ev.preventDefault();
    const p = this._toPlan(ev);
    this.zoom(ev.deltaY > 0 ? ZOOM_STEP : 1 / ZOOM_STEP, p?.x, p?.y);
  }

  // ----- rendering -------------------------------------------------------

  private _renderMarker(m: MarkerInfo) {
    const r = MARKER_PX * this._upp;
    const { x, y } = this._markerPos(m);
    const selected = m.deviceId === this.selectedId;
    const rot = this._markerRot(m);
    const len = r * 4;
    const pt = (deg: number, l: number) => `${l * Math.sin(rad(deg))} ${-l * Math.cos(rad(deg))}`;
    const cls = ["marker", selected ? "selected" : "", m.orphan ? "orphan" : ""].join(" ");
    return svg`
      <g class=${cls} transform="translate(${x} ${y})" data-marker=${m.deviceId}>
        ${m.directional
          ? svg`<path class="cone"
              d="M0 0 L${pt(rot - CONE_HALF_ANGLE, len)} A${len} ${len} 0 0 1 ${pt(rot + CONE_HALF_ANGLE, len)} Z" />`
          : nothing}
        <circle class="dot" r=${r} />
        <svg x=${-r * 0.7} y=${-r * 0.7} width=${r * 1.4} height=${r * 1.4} viewBox="0 0 24 24">
          <path class="icon" d=${m.icon} />
        </svg>
        <title>${m.label}</title>
        ${selected
          ? svg`<text class="label" y=${r * 2.2} font-size=${12 * this._upp}>${m.label}</text>`
          : nothing}
        ${selected && m.directional && !this.readOnly
          ? svg`<line class="arm" x1="0" y1="0" x2=${len * Math.sin(rad(rot))} y2=${-len * Math.cos(rad(rot))} />
                <circle class="handle" data-rotate=${m.deviceId} r=${r * 0.5}
                  cx=${len * Math.sin(rad(rot))} cy=${-len * Math.cos(rad(rot))} />`
          : nothing}
      </g>`;
  }

  override render() {
    const vb = this.floor?.viewbox;
    const view = this._view;
    if (!this.floor || !vb || !view) {
      return html`<div class="empty">This floor has no floor plan yet.</div>`;
    }
    return html`
      <svg
        class="plan ${this.placing ? "placing" : ""}"
        viewBox=${view.join(" ")}
        preserveAspectRatio="xMidYMid meet"
        @pointerdown=${this._onPointerDown}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerUp}
        @wheel=${this._onWheel}
      >
        ${this.imageUrl
          ? svg`<image href=${this.imageUrl} x=${vb[0]} y=${vb[1]} width=${vb[2]} height=${vb[3]}
              preserveAspectRatio="none" />`
          : nothing}
        ${this.markers.map((m) => this._renderMarker(m))}
      </svg>
      <div class="zoom">
        <button title="Zoom in" @click=${() => this.zoom(1 / ZOOM_STEP)}>+</button>
        <button title="Zoom out" @click=${() => this.zoom(ZOOM_STEP)}>-</button>
        <button title="Fit" @click=${() => this.fit()}>Fit</button>
      </div>
    `;
  }

  static override styles = css`
    :host {
      display: block;
      position: relative;
      min-height: 300px;
      background: var(--card-background-color, #fff);
      border-radius: 8px;
      overflow: hidden;
    }
    svg.plan {
      width: 100%;
      height: 100%;
      display: block;
      touch-action: none;
      user-select: none;
      cursor: grab;
      background: #fff; /* floor plans are drawn for a white page */
    }
    svg.plan.placing {
      cursor: crosshair;
    }
    .marker {
      cursor: pointer;
    }
    .dot {
      fill: var(--primary-color, #03a9f4);
      stroke: #fff;
      stroke-width: 1.5px;
      vector-effect: non-scaling-stroke;
    }
    .icon {
      fill: #fff;
    }
    .cone {
      fill: var(--primary-color, #03a9f4);
      fill-opacity: 0.18;
      stroke: var(--primary-color, #03a9f4);
      stroke-opacity: 0.6;
      stroke-width: 1px;
      vector-effect: non-scaling-stroke;
    }
    .selected .dot {
      fill: var(--accent-color, #ff9800);
      stroke-width: 3px;
    }
    .selected .cone {
      fill: var(--accent-color, #ff9800);
      stroke: var(--accent-color, #ff9800);
    }
    .orphan .dot {
      fill: var(--error-color, #db4437);
    }
    .arm {
      stroke: var(--accent-color, #ff9800);
      stroke-width: 1.5px;
      stroke-dasharray: 4 3;
      vector-effect: non-scaling-stroke;
    }
    .handle {
      fill: #fff;
      stroke: var(--accent-color, #ff9800);
      stroke-width: 2px;
      vector-effect: non-scaling-stroke;
      cursor: grab;
    }
    .label {
      text-anchor: middle;
      fill: #000;
      paint-order: stroke;
      stroke: #fff;
      stroke-width: 3px;
      vector-effect: non-scaling-stroke;
      pointer-events: none;
    }
    .zoom {
      position: absolute;
      right: 8px;
      bottom: 8px;
      display: flex;
      gap: 4px;
    }
    .zoom button {
      min-width: 32px;
      height: 32px;
      border-radius: 6px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #000);
      cursor: pointer;
    }
    .empty {
      padding: 48px;
      text-align: center;
      color: var(--secondary-text-color, #666);
    }
  `;
}

if (!customElements.get("hm-plan-view")) customElements.define("hm-plan-view", HmPlanView);

declare global {
  interface HTMLElementTagNameMap {
    "hm-plan-view": HmPlanView;
  }
}
