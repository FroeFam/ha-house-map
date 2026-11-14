// node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: p, getPrototypeOf: m } = Object, h = globalThis, ee = h.trustedTypes, te = ee ? ee.emptyScript : "", ne = h.reactiveElementPolyfillSupport, g = (e, t) => e, _ = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? te : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, v = (e, t) => !l(e, t), y = {
	attribute: !0,
	type: String,
	converter: _,
	reflect: !1,
	useDefault: !1,
	hasChanged: v
};
Symbol.metadata ??= Symbol("metadata"), h.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var b = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = y) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = d(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? y;
	}
	static _$Ei() {
		if (this.hasOwnProperty(g("elementProperties"))) return;
		let e = m(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(g("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(g("properties"))) {
			let e = this.properties, t = [...f(e), ...p(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(1 / 0).reverse());
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return s(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? _ : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? _ : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? v)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[g("elementProperties")] = /* @__PURE__ */ new Map(), b[g("finalized")] = /* @__PURE__ */ new Map(), ne?.({ ReactiveElement: b }), (h.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
var x = globalThis, S = (e) => e, C = x.trustedTypes, re = C ? C.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ie = "$lit$", w = `lit$${Math.random().toFixed(9).slice(2)}$`, T = "?" + w, ae = `<${T}>`, E = document, D = () => E.createComment(""), O = (e) => e === null || typeof e != "object" && typeof e != "function", k = Array.isArray, oe = (e) => k(e) || typeof e?.[Symbol.iterator] == "function", A = "[ 	\n\f\r]", j = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, se = /-->/g, ce = />/g, M = RegExp(`>|${A}(?:([^\\s"'>=/]+)(${A}*=${A}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), le = /'/g, ue = /"/g, de = /^(?:script|style|textarea|title)$/i, fe = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), N = fe(1), P = fe(2), F = Symbol.for("lit-noChange"), I = Symbol.for("lit-nothing"), L = /* @__PURE__ */ new WeakMap(), R = E.createTreeWalker(E, 129);
function z(e, t) {
	if (!k(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return re === void 0 ? t : re.createHTML(t);
}
var pe = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = j;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === j ? c[1] === "!--" ? o = se : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = M) : (de.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = M) : o = ce : o === M ? c[0] === ">" ? (o = i ?? j, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? M : c[3] === "\"" ? ue : le) : o === ue || o === le ? o = M : o === se || o === ce ? o = j : (o = M, i = void 0);
		let d = o === M && e[t + 1].startsWith("/>") ? " " : "";
		a += o === j ? n + ae : l >= 0 ? (r.push(s), n.slice(0, l) + ie + n.slice(l) + w + d) : n + w + (l === -2 ? t : d);
	}
	return [z(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, B = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = pe(t, n);
		if (this.el = e.createElement(l, r), R.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = R.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ie)) {
					let t = u[o++], n = i.getAttribute(e).split(w), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? he : r[1] === "?" ? ge : r[1] === "@" ? _e : U
					}), i.removeAttribute(e);
				} else e.startsWith(w) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (de.test(i.tagName)) {
					let e = i.textContent.split(w), t = e.length - 1;
					if (t > 0) {
						i.textContent = C ? C.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], D()), R.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], D());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === T) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(w, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += w.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = E.createElement("template");
		return n.innerHTML = e, n;
	}
};
function V(e, t, n = e, r) {
	if (t === F) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = O(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = V(e, i._$AS(e, t.values), i, r)), t;
}
var me = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? E).importNode(t, !0);
		R.currentNode = r;
		let i = R.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new H(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new ve(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = R.nextNode(), a++);
		}
		return R.currentNode = E, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, H = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = I, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = V(this, e, t), O(e) ? e === I || e == null || e === "" ? (this._$AH !== I && this._$AR(), this._$AH = I) : e !== this._$AH && e !== F && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? oe(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== I && O(this._$AH) ? this._$AA.nextSibling.data = e : this.T(E.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = B.createElement(z(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new me(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = L.get(e.strings);
		return t === void 0 && L.set(e.strings, t = new B(e)), t;
	}
	k(t) {
		k(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(D()), this.O(D()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = S(e).nextSibling;
			S(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, U = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = I, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = I;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = V(this, e, t, 0), a = !O(e) || e !== this._$AH && e !== F, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = V(this, r[n + o], t, o), s === F && (s = this._$AH[o]), a ||= !O(s) || s !== this._$AH[o], s === I ? e = I : e !== I && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === I ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, he = class extends U {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === I ? void 0 : e;
	}
}, ge = class extends U {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== I);
	}
}, _e = class extends U {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = V(this, e, t, 0) ?? I) === F) return;
		let n = this._$AH, r = e === I && n !== I || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== I && (n === I || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, ve = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		V(this, e);
	}
}, ye = x.litHtmlPolyfillSupport;
ye?.(B, H), (x.litHtmlVersions ??= []).push("3.3.3");
var be = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new H(t.insertBefore(D(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, W = globalThis, G = class extends b {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = be(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return F;
	}
};
G._$litElement$ = !0, G.finalized = !0, W.litElementHydrateSupport?.({ LitElement: G });
var xe = W.litElementPolyfillSupport;
xe?.({ LitElement: G }), (W.litElementVersions ??= []).push("4.2.2");
// src/api.ts
var Se = (e) => e.callWS({ type: "house_map/get" }), Ce = (e, t, n) => e.callWS({
	type: "house_map/placement/set",
	device_id: t,
	...n
}), we = (e, t) => e.callWS({
	type: "house_map/placement/delete",
	device_id: t
}), Te = (e) => `/api/house_map/floors/${encodeURIComponent(e)}/svg`;
async function Ee(e) {
	try {
		return (await e.json()).message ?? e.statusText;
	} catch {
		return e.statusText;
	}
}
async function De(e, t) {
	let n = await e.fetchWithAuth(Te(t));
	if (!n.ok) throw Error(await Ee(n));
	let r = await n.blob();
	return URL.createObjectURL(new Blob([r], { type: "image/svg+xml" }));
}
// node_modules/@mdi/js/mdi.js
var Oe = "M6.03 12.03L8.03 15.5L5.5 18.68L2 12.62L6.03 12.03M17 18V15.29C17.88 14.9 18.5 14.03 18.5 13C18.5 12.43 18.3 11.9 17.97 11.5L19.94 10.35C20.95 9.76 21.3 8.47 20.71 7.46L19.33 5.06C18.74 4.05 17.45 3.7 16.44 4.28L8.31 9C7.36 9.53 7.03 10.75 7.58 11.71L9.08 14.31C9.63 15.26 10.86 15.59 11.81 15.04L13.69 13.96C13.94 14.55 14.41 15.03 15 15.29V18C15 19.1 15.9 20 17 20H22V18H17Z", ke = "M6,4H18V5H21V7H18V9H21V11H18V13H21V15H18V17H21V19H18V20H6V19H3V17H6V15H3V13H6V11H3V9H6V7H3V5H6V4M11,15V18H12V15H11M13,15V18H14V15H13M15,15V18H16V15H15Z", K = "M8,3C6.89,3 6,3.89 6,5V21H18V5C18,3.89 17.11,3 16,3H8M8,5H16V19H8V5M13,11V13H15V11H13Z", Ae = "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z", je = "M7,2V13H10V22L17,10H13L17,2H7Z", Me = "M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z", Ne = "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z", q = "M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z", Pe = "M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z", Fe = "M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z", Ie = "M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z", Le = "M17,7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7M17,15A3,3 0 0,1 14,12A3,3 0 0,1 17,9A3,3 0 0,1 20,12A3,3 0 0,1 17,15Z", Re = {
	motion: q,
	occupancy: q,
	presence: q,
	door: K,
	garage_door: K,
	opening: K,
	window: "M21 20V2H3V20H1V23H23V20M19 4V11H13V4M5 4H11V11H5M5 20V13H11V20M13 20V13H19V20Z",
	vibration: "M16,19H8V5H16M16.5,3H7.5A1.5,1.5 0 0,0 6,4.5V19.5A1.5,1.5 0 0,0 7.5,21H16.5A1.5,1.5 0 0,0 18,19.5V4.5A1.5,1.5 0 0,0 16.5,3M19,17H21V7H19M22,9V15H24V9M3,17H5V7H3M0,15H2V9H0V15Z",
	temperature: Ie,
	humidity: "M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0,0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97M9.75,10A1.25,1.25 0 0,1 11,11.25A1.25,1.25 0 0,1 9.75,12.5A1.25,1.25 0 0,1 8.5,11.25A1.25,1.25 0 0,1 9.75,10M14.25,14.5A1.25,1.25 0 0,1 15.5,15.75A1.25,1.25 0 0,1 14.25,17A1.25,1.25 0 0,1 13,15.75A1.25,1.25 0 0,1 14.25,14.5Z",
	power: je,
	energy: je,
	weight: "M12,3A4,4 0 0,1 16,7C16,7.73 15.81,8.41 15.46,9H18C18.95,9 19.75,9.67 19.95,10.56C21.96,18.57 22,18.78 22,19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19C2,18.78 2.04,18.57 4.05,10.56C4.25,9.67 5.05,9 6,9H8.54C8.19,8.41 8,7.73 8,7A4,4 0 0,1 12,3M12,5A2,2 0 0,0 10,7A2,2 0 0,0 12,9A2,2 0 0,0 14,7A2,2 0 0,0 12,5Z"
}, ze = {
	light: Me,
	switch: Pe,
	camera: Oe,
	lock: Ne,
	fan: Ae,
	media_player: Fe,
	input_boolean: Le
}, Be = [
	"motion",
	"occupancy",
	"presence",
	"door",
	"garage_door",
	"window",
	"opening",
	"vibration",
	"weight",
	"power",
	"energy",
	"temperature",
	"humidity"
];
function Ve(e, t) {
	let n = Object.values(e.entities).filter((e) => e.device_id === t), r = /* @__PURE__ */ new Set();
	for (let t of n) {
		let n = e.states[t.entity_id]?.attributes?.device_class;
		typeof n == "string" && r.add(n);
	}
	for (let e of Be) if (r.has(e)) return Re[e];
	for (let e of n) {
		let t = ze[e.entity_id.split(".")[0]];
		if (t) return t;
	}
	return ke;
}
// src/types.ts
function J(e, t) {
	let n = e.devices[t];
	return n?.name_by_user || n?.name || "Unknown device";
}
function Y(e, t) {
	let n = e.devices[t]?.area_id;
	return n ? e.areas[n]?.name ?? null : null;
}
function X(e, t, n) {
	e.dispatchEvent(new CustomEvent(t, {
		detail: n,
		bubbles: !0,
		composed: !0
	}));
}
// src/plan-view.ts
var He = 13, Ue = 30, We = 3, Z = 1.2, Q = (e) => e * Math.PI / 180, Ge = (e) => (e % 360 + 360) % 360, Ke = class extends G {
	constructor(...e) {
		super(...e), this.floor = null, this.imageUrl = null, this.markers = [], this.selectedId = null, this.placing = !1, this.readOnly = !1, this._view = null, this._upp = 1, this._dragPos = null, this._rotPreview = null, this._gesture = null, this._viewKey = "", this._resize = new ResizeObserver(() => this._measure());
	}
	static {
		this.properties = {
			floor: { attribute: !1 },
			imageUrl: { attribute: !1 },
			markers: { attribute: !1 },
			selectedId: { attribute: !1 },
			placing: { type: Boolean },
			readOnly: { type: Boolean },
			_view: { state: !0 },
			_upp: { state: !0 },
			_dragPos: { state: !0 },
			_rotPreview: { state: !0 }
		};
	}
	connectedCallback() {
		super.connectedCallback(), this._resize.observe(this);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._resize.disconnect();
	}
	willUpdate() {
		let e = this.floor ? `${this.floor.id}:${this.floor.viewbox?.join(",")}` : "";
		e !== this._viewKey && (this._viewKey = e, this._view = this.floor?.viewbox ? [...this.floor.viewbox] : null);
	}
	updated() {
		this._measure();
	}
	fit() {
		this.floor?.viewbox && (this._view = [...this.floor.viewbox]);
	}
	zoom(e, t, n) {
		let r = this._view, i = this.floor?.viewbox;
		if (!r || !i) return;
		let a = Math.min(Math.max(r[2] * e, i[2] / 25), i[2] * 3) / r[2], o = t ?? r[0] + r[2] / 2, s = n ?? r[1] + r[3] / 2;
		this._view = [
			o - (o - r[0]) * a,
			s - (s - r[1]) * a,
			r[2] * a,
			r[3] * a
		];
	}
	get _svg() {
		return this.renderRoot.querySelector("svg.plan");
	}
	_measure() {
		let e = this._svg, t = this._view;
		if (!e || !t) return;
		let n = e.getBoundingClientRect();
		if (!n.width || !n.height) return;
		let r = Math.max(t[2] / n.width, t[3] / n.height);
		Math.abs(r - this._upp) / r > .001 && (this._upp = r);
	}
	_toPlan(e) {
		let t = this._svg, n = t?.getScreenCTM();
		if (!t || !n) return null;
		let r = new DOMPoint(e.clientX, e.clientY).matrixTransform(n.inverse());
		return {
			x: r.x,
			y: r.y
		};
	}
	_markerPos(e) {
		return this._dragPos?.deviceId === e.deviceId ? this._dragPos : e;
	}
	_markerRot(e) {
		return this._rotPreview?.deviceId === e.deviceId ? this._rotPreview.deg : e.rotation_deg ?? 0;
	}
	_onPointerDown(e) {
		if (e.button !== 0 && e.button !== 1) return;
		let t = e.target, n = t.closest("[data-rotate]"), r = t.closest("[data-marker]"), i = this._svg;
		if (i && this._view) {
			if (n && !this.readOnly) this._gesture = {
				kind: "rotate",
				deviceId: n.getAttribute("data-rotate")
			};
			else if (r && e.button === 0) {
				let t = r.getAttribute("data-marker");
				if (this.readOnly) {
					X(this, "marker-select", { deviceId: t });
					return;
				}
				this._gesture = {
					kind: "drag",
					deviceId: t,
					startX: e.clientX,
					startY: e.clientY,
					moved: !1
				};
			} else this._gesture = {
				kind: "pan",
				startX: e.clientX,
				startY: e.clientY,
				startView: [...this._view],
				moved: !1
			};
			i.setPointerCapture(e.pointerId), e.preventDefault();
		}
	}
	_onPointerMove(e) {
		let t = this._gesture;
		if (t) {
			if (t.kind === "pan") {
				let n = e.clientX - t.startX, r = e.clientY - t.startY;
				if (!t.moved && Math.hypot(n, r) < We) return;
				t.moved = !0;
				let i = t.startView;
				this._view = [
					i[0] - n * this._upp,
					i[1] - r * this._upp,
					i[2],
					i[3]
				];
			} else if (t.kind === "drag") {
				if (!t.moved && Math.hypot(e.clientX - t.startX, e.clientY - t.startY) < We) return;
				t.moved = !0;
				let n = this._toPlan(e);
				n && (this._dragPos = {
					deviceId: t.deviceId,
					...n
				});
			} else {
				let n = this.markers.find((e) => e.deviceId === t.deviceId), r = this._toPlan(e);
				if (!n || !r) return;
				let i = Ge(Math.atan2(r.x - n.x, -(r.y - n.y)) * 180 / Math.PI);
				this._rotPreview = {
					deviceId: t.deviceId,
					deg: Math.round(i)
				};
			}
		}
	}
	_onPointerUp(e) {
		let t = this._gesture;
		if (this._gesture = null, this._svg?.releasePointerCapture(e.pointerId), t) {
			if (t.kind === "pan") {
				if (t.moved) return;
				if (this.placing && !this.readOnly) {
					let t = this._toPlan(e);
					t && X(this, "plan-click", t);
				} else X(this, "marker-select", { deviceId: null });
			} else t.kind === "drag" ? (t.moved && this._dragPos ? X(this, "marker-move", { ...this._dragPos }) : X(this, "marker-select", { deviceId: t.deviceId }), this._dragPos = null) : this._rotPreview &&= (X(this, "marker-rotate", {
				deviceId: this._rotPreview.deviceId,
				rotation_deg: this._rotPreview.deg
			}), null);
		}
	}
	_onWheel(e) {
		e.preventDefault();
		let t = this._toPlan(e);
		this.zoom(e.deltaY > 0 ? Z : 1 / Z, t?.x, t?.y);
	}
	_renderMarker(e) {
		let t = He * this._upp, { x: n, y: r } = this._markerPos(e), i = e.deviceId === this.selectedId, a = this._markerRot(e), o = t * 4, s = (e, t) => `${t * Math.sin(Q(e))} ${-t * Math.cos(Q(e))}`;
		return P`
      <g class=${[
			"marker",
			i ? "selected" : "",
			e.orphan ? "orphan" : ""
		].join(" ")} transform="translate(${n} ${r})" data-marker=${e.deviceId}>
        ${e.directional ? P`<path class="cone"
              d="M0 0 L${s(a - Ue, o)} A${o} ${o} 0 0 1 ${s(a + Ue, o)} Z" />` : I}
        <circle class="dot" r=${t} />
        <svg x=${-t * .7} y=${-t * .7} width=${t * 1.4} height=${t * 1.4} viewBox="0 0 24 24">
          <path class="icon" d=${e.icon} />
        </svg>
        <title>${e.label}</title>
        ${i ? P`<text class="label" y=${t * 2.2} font-size=${12 * this._upp}>${e.label}</text>` : I}
        ${i && e.directional && !this.readOnly ? P`<line class="arm" x1="0" y1="0" x2=${o * Math.sin(Q(a))} y2=${-o * Math.cos(Q(a))} />
                <circle class="handle" data-rotate=${e.deviceId} r=${t * .5}
                  cx=${o * Math.sin(Q(a))} cy=${-o * Math.cos(Q(a))} />` : I}
      </g>`;
	}
	render() {
		let e = this.floor?.viewbox, t = this._view;
		return !this.floor || !e || !t ? N`<div class="empty">This floor has no floor plan yet.</div>` : N`
      <svg
        class="plan ${this.placing ? "placing" : ""}"
        viewBox=${t.join(" ")}
        preserveAspectRatio="xMidYMid meet"
        @pointerdown=${this._onPointerDown}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerUp}
        @wheel=${this._onWheel}
      >
        ${this.imageUrl ? P`<image href=${this.imageUrl} x=${e[0]} y=${e[1]} width=${e[2]} height=${e[3]}
              preserveAspectRatio="none" />` : I}
        ${this.markers.map((e) => this._renderMarker(e))}
      </svg>
      <div class="zoom">
        <button title="Zoom in" @click=${() => this.zoom(1 / Z)}>+</button>
        <button title="Zoom out" @click=${() => this.zoom(Z)}>-</button>
        <button title="Fit" @click=${() => this.fit()}>Fit</button>
      </div>
    `;
	}
	static {
		this.styles = o`
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
};
customElements.get("hm-plan-view") || customElements.define("hm-plan-view", Ke);
// src/device-list.ts
var qe = class extends G {
	constructor(...e) {
		super(...e), this.placements = {}, this.orphans = [], this.floors = [], this.selectedId = null, this.placingId = null, this.readOnly = !1, this._search = "", this._collapsed = {}, this._placedGroups = [], this._placedCount = 0, this._unplacedGroups = [], this._unplacedCount = 0, this._orphanRows = [], this._lastDevices = null, this._lastAreas = null;
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			placements: { attribute: !1 },
			orphans: { attribute: !1 },
			floors: { attribute: !1 },
			selectedId: { attribute: !1 },
			placingId: { attribute: !1 },
			readOnly: { type: Boolean },
			_search: { state: !0 },
			_collapsed: { state: !0 }
		};
	}
	willUpdate(e) {
		let t = this.hass?.devices, n = this.hass?.areas;
		(e.has("placements") || e.has("orphans") || e.has("floors") || e.has("readOnly") || e.has("_search") || t !== this._lastDevices || n !== this._lastAreas) && this.hass && (this._lastDevices = t, this._lastAreas = n, this._recompute());
	}
	_recompute() {
		let e = this.hass, t = this._search.trim().toLowerCase(), n = new Set(this.orphans), r = (e) => this.floors.find((t) => t.id === e)?.name ?? "Unknown floor", i = (e, t) => e.localeCompare(t, void 0, { sensitivity: "base" }), a = (n, r, i) => {
			if (!t) return !0;
			let a = e.devices[n];
			return [
				r,
				i,
				a?.manufacturer ?? "",
				a?.model ?? ""
			].some((e) => e.toLowerCase().includes(t));
		}, o = (t) => ({
			id: t,
			name: J(e, t),
			area: Y(e, t) ?? "",
			icon: Ve(e, t)
		});
		this._orphanRows = this.orphans.filter((e) => this.placements[e]).map((e) => ({
			id: e,
			floor: r(this.placements[e].floor_id),
			notes: this.placements[e].notes ?? ""
		})).filter((e) => !t || "deleted device".includes(t) || e.floor.toLowerCase().includes(t) || e.notes.toLowerCase().includes(t));
		let s = /* @__PURE__ */ new Map(), c = 0;
		for (let e of Object.keys(this.placements)) {
			if (n.has(e)) continue;
			let t = o(e);
			if (!a(e, t.name, t.area)) continue;
			let r = this.placements[e].floor_id;
			s.has(r) || s.set(r, []), s.get(r).push(t), c++;
		}
		let l = [...this.floors].sort((e, t) => e.order - t.order), u = [], d = /* @__PURE__ */ new Set();
		for (let e of l) {
			let t = s.get(e.id);
			d.add(e.id), t?.length && u.push({
				key: "f:" + e.id,
				label: e.name,
				rows: t
			});
		}
		for (let [e, t] of s) !d.has(e) && t.length && u.push({
			key: "f:" + e,
			label: "Unknown floor",
			rows: t
		});
		for (let e of u) e.rows.sort((e, t) => i(e.area, t.area) || i(e.name, t.name));
		this._placedGroups = u, this._placedCount = c;
		let f = /* @__PURE__ */ new Map(), p = 0;
		if (!this.readOnly) for (let [t, n] of Object.entries(e.devices)) {
			if (this.placements[t] || n.disabled_by || n.entry_type === "service") continue;
			let e = o(t);
			if (!a(t, e.name, e.area)) continue;
			let r = e.area || "No area";
			f.has(r) || f.set(r, []), f.get(r).push(e), p++;
		}
		let m = [...f.keys()].sort((e, t) => e === "No area" ? 1 : t === "No area" ? -1 : i(e, t));
		this._unplacedGroups = m.map((e) => {
			let t = f.get(e);
			return t.sort((e, t) => i(e.name, t.name)), {
				key: "a:" + e,
				label: e,
				rows: t
			};
		}), this._unplacedCount = p;
	}
	_toggle(e) {
		this._collapsed = {
			...this._collapsed,
			[e]: !this._collapsed[e]
		};
	}
	_icon(e) {
		return N`<svg viewBox="0 0 24 24" aria-hidden="true"><path d=${e}></path></svg>`;
	}
	_row(e, t) {
		let n = t === "pick" && this.placingId === e.id;
		return N`<button
      class="row ${t === "select" && this.selectedId === e.id || n ? "active" : ""}"
      @click=${() => X(this, t === "pick" ? "device-pick" : "device-select", { deviceId: e.id })}
    >
      ${this._icon(e.icon)}
      <span class="text">
        <span class="name">${e.name}</span>
        ${n ? N`<span class="sub hint">Click the plan...</span>` : t === "select" && e.area ? N`<span class="sub">${e.area}</span>` : I}
      </span>
    </button>`;
	}
	render() {
		let e = this._search.trim();
		return N`
      <input
        class="search"
        type="search"
        placeholder="Search devices"
        .value=${this._search}
        @input=${(e) => this._search = e.target.value}
      />
      ${this._orphanRows.length ? N`<section class="orphans">
            <h3>Deleted devices</h3>
            ${this._orphanRows.map((e) => N`<div class="orphan ${this.selectedId === e.id ? "active" : ""}">
                <div class="text">
                  <span class="name">Deleted device</span>
                  <span class="sub">${e.floor}${e.notes ? " - " + e.notes.slice(0, 60) : ""}</span>
                </div>
                <button class="small" @click=${() => X(this, "device-select", { deviceId: e.id })}>Select</button>
                ${this.readOnly ? I : N`<button class="small danger" @click=${() => X(this, "orphan-remove", { deviceId: e.id })}>
                      Remove
                    </button>`}
              </div>`)}
          </section>` : I}
      <section>
        <h3>Placed (${this._placedCount})</h3>
        ${this._placedGroups.map((e) => N`<div class="group-label">${e.label}</div>${e.rows.map((e) => this._row(e, "select"))}`)}
        ${this._placedCount === 0 ? N`<div class="empty">${e ? "No matches." : "Nothing placed yet."}</div>` : I}
      </section>
      ${this.readOnly ? I : N`<section>
            <h3>Not placed (${this._unplacedCount})</h3>
            ${this._unplacedGroups.map((t) => {
			let n = !this._collapsed[t.key] || !!e;
			return N`<button class="group-label toggle" @click=${() => this._toggle(t.key)}>
                  <span>${n ? "v" : ">"}</span> ${t.label} (${t.rows.length})
                </button>
                ${n ? t.rows.map((e) => this._row(e, "pick")) : I}`;
		})}
            ${this._unplacedCount === 0 ? N`<div class="empty">${e ? "No matches." : "All devices are placed."}</div>` : I}
          </section>`}
    `;
	}
	static {
		this.styles = o`
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
};
customElements.get("hm-device-list") || customElements.define("hm-device-list", qe);
// src/inspector.ts
var $ = 2e3, Je = class extends G {
	constructor(...e) {
		super(...e), this.deviceId = null, this.placement = null, this.floors = [], this.orphan = !1, this.readOnly = !1, this._draft = "";
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			deviceId: { attribute: !1 },
			placement: { attribute: !1 },
			floors: { attribute: !1 },
			orphan: { type: Boolean },
			readOnly: { type: Boolean },
			_draft: { state: !0 }
		};
	}
	willUpdate(e) {
		e.has("deviceId") && (this._draft = this.placement?.notes ?? "");
	}
	_change(e) {
		this.deviceId && X(this, "placement-change", {
			deviceId: this.deviceId,
			changes: e
		});
	}
	_onDirectional(e) {
		e.target.checked ? this._change({
			directional: !0,
			rotation_deg: this.placement?.rotation_deg ?? 0
		}) : this._change({
			directional: !1,
			rotation_deg: null
		});
	}
	_onRotation(e) {
		let t = e.target, n = Number(t.value);
		if (t.value === "" || !Number.isFinite(n)) {
			t.value = String(this.placement?.rotation_deg ?? 0);
			return;
		}
		let r = (Math.round(n) % 360 + 360) % 360;
		t.value = String(r), r !== this.placement?.rotation_deg && this._change({ rotation_deg: r });
	}
	_onFloor(e) {
		let t = e.target.value;
		t !== this.placement?.floor_id && this._change({ floor_id: t });
	}
	_saveNotes() {
		let e = this._draft.slice(0, $);
		e !== (this.placement?.notes ?? "") && this._change({ notes: e });
	}
	_remove() {
		this.deviceId && window.confirm("Remove this device from the map?") && X(this, "placement-delete", { deviceId: this.deviceId });
	}
	_feet(e, t, n) {
		return n ? ((e - t) / n).toFixed(2) : "n/a";
	}
	render() {
		if (!this.deviceId || !this.placement) return N`<p class="hint">Select a device on the plan or in the list.</p>
        <ul class="legend">
          <li><span class="swatch dot"></span> Device</li>
          <li><span class="swatch cone"></span> Direction the device faces</li>
          <li><span class="swatch red"></span> Deleted device</li>
        </ul>`;
		let e = this.placement, t = this.hass?.devices[this.deviceId], n = this.floors.find((t) => t.id === e.floor_id), r = n?.calibration, i = this.readOnly, a = this.orphan ? null : Y(this.hass, this.deviceId), o = [t?.manufacturer, t?.model].filter(Boolean).join(" "), s = e.rotation_deg ?? 0;
		return N`
      <h2 class=${this.orphan ? "deleted" : ""}>${this.orphan ? "Deleted device" : J(this.hass, this.deviceId)}</h2>
      ${!this.orphan && o ? N`<div class="sub">${o}</div>` : I}
      ${a ? N`<div class="sub">Area: ${a}</div>` : I}
      <div class="sub">Floor: ${n?.name ?? "Unknown floor"}</div>

      <label class="field">
        <span>Floor</span>
        <select .value=${e.floor_id} ?disabled=${i} @change=${this._onFloor}>
          ${this.floors.map((t) => N`<option value=${t.id} ?selected=${t.id === e.floor_id}>${t.name}</option>`)}
        </select>
      </label>

      <label class="check">
        <input type="checkbox" .checked=${e.directional} ?disabled=${i} @change=${this._onDirectional} />
        <span>Directional</span>
      </label>
      <div class="help">Check for devices that face a direction, such as motion sensors or cameras.</div>

      ${e.directional ? N`<div class="field">
            <span>Rotation (deg)</span>
            <div class="rot">
              <input type="range" min="0" max="359" step="1" .value=${String(s)} ?disabled=${i} @change=${this._onRotation} />
              <input type="number" min="0" max="359" step="1" .value=${String(s)} ?disabled=${i} @change=${this._onRotation} />
            </div>
            <div class="help">0 is toward the top of the plan, clockwise. You can also drag the handle on the plan.</div>
          </div>` : I}

      <label class="field">
        <span>Notes</span>
        <textarea
          maxlength=${$}
          rows="4"
          .value=${this._draft}
          ?disabled=${i}
          @input=${(e) => this._draft = e.target.value}
          @blur=${this._saveNotes}
        ></textarea>
        <span class="help right">${this._draft.length}/${$}</span>
      </label>

      <div class="field">
        <span>Position</span>
        <div class="sub">Plan units: x ${e.x.toFixed(2)}, y ${e.y.toFixed(2)}</div>
        ${r ? N`<div class="sub">
              Feet: x ${this._feet(e.x, r.origin_x, r.units_per_foot)}, y ${this._feet(e.y, r.origin_y, r.units_per_foot)}
            </div>` : I}
      </div>

      ${i ? I : N`<button class="remove" @click=${this._remove}>Remove from map</button>`}
    `;
	}
	static {
		this.styles = o`
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
};
customElements.get("hm-inspector") || customElements.define("hm-inspector", Je);
// src/setup-wizard.ts
var Ye = class extends G {
	constructor(...e) {
		super(...e), this.floors = [];
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			floors: { attribute: !1 }
		};
	}
	render() {
		return N`<div>Setup wizard</div>`;
	}
};
customElements.get("hm-setup-wizard") || customElements.define("hm-setup-wizard", Ye);
// src/floor-settings.ts
var Xe = class extends G {
	constructor(...e) {
		super(...e), this.floors = [], this.placements = {};
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			floors: { attribute: !1 },
			placements: { attribute: !1 }
		};
	}
	render() {
		return N`<div>Floor settings</div>`;
	}
};
customElements.get("hm-floor-settings") || customElements.define("hm-floor-settings", Xe);
// src/house-map-panel.ts
var Ze = class extends G {
	constructor(...e) {
		super(...e), this.narrow = !1, this._data = null, this._error = null, this._floorId = null, this._images = {}, this._selectedId = null, this._placingId = null, this._settingsOpen = !1, this._loading = !1, this._onKey = (e) => {
			e.key === "Escape" && (this._placingId = null);
		};
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			narrow: { type: Boolean },
			_data: { state: !0 },
			_error: { state: !0 },
			_floorId: { state: !0 },
			_images: { state: !0 },
			_selectedId: { state: !0 },
			_placingId: { state: !0 },
			_settingsOpen: { state: !0 }
		};
	}
	connectedCallback() {
		super.connectedCallback(), window.addEventListener("keydown", this._onKey);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), window.removeEventListener("keydown", this._onKey), this._clearImages();
	}
	updated() {
		this.hass && !this._data && !this._loading && !this._error && this._load();
	}
	_clearImages() {
		for (let e of Object.values(this._images)) URL.revokeObjectURL(e);
		this._images = {};
	}
	async _load(e = !1) {
		this._loading = !0;
		try {
			let t = await Se(this.hass);
			e && this._clearImages(), this._data = t, t.floors.some((e) => e.id === this._floorId) || (this._floorId = t.floors[0]?.id ?? null), this._error = null, await this._loadImages();
		} catch (e) {
			this._error = e instanceof Error ? e.message : String(e);
		} finally {
			this._loading = !1;
		}
	}
	async _loadImages() {
		let e = { ...this._images };
		for (let t of this._data?.floors ?? []) if (t.svg_file && !e[t.id]) try {
			e[t.id] = await De(this.hass, t.id);
		} catch (e) {
			this._error = `Could not load plan for ${t.name}: ${e instanceof Error ? e.message : e}`;
		}
		this._images = e;
	}
	async _write(e, t) {
		let n = this._data?.placements[e], r = {
			floor_id: t.floor_id ?? n?.floor_id ?? this._floorId,
			x: t.x ?? n?.x ?? 0,
			y: t.y ?? n?.y ?? 0,
			directional: t.directional ?? n?.directional ?? !1,
			rotation_deg: t.rotation_deg === void 0 ? n?.rotation_deg ?? null : t.rotation_deg,
			notes: t.notes ?? n?.notes ?? ""
		};
		try {
			let { placement: t } = await Ce(this.hass, e, r);
			this._applyPlacement(e, t);
		} catch (e) {
			this._error = e instanceof Error ? e.message : String(e);
		}
	}
	_applyPlacement(e, t) {
		if (!this._data) return;
		let n = { ...this._data.placements };
		t ? n[e] = t : delete n[e];
		let r = t ? this._data.orphans : this._data.orphans.filter((t) => t !== e);
		this._data = {
			...this._data,
			placements: n,
			orphans: r
		};
	}
	async _remove(e) {
		try {
			await we(this.hass, e), this._applyPlacement(e, null), this._selectedId === e && (this._selectedId = null);
		} catch (e) {
			this._error = e instanceof Error ? e.message : String(e);
		}
	}
	_onDevicePick(e) {
		let t = e.detail.deviceId;
		this._placingId = this._placingId === t ? null : t, this._selectedId = null;
	}
	_onDeviceSelect(e) {
		let t = this._data?.placements[e.detail.deviceId];
		t && (this._floorId = t.floor_id), this._selectedId = e.detail.deviceId, this._placingId = null;
	}
	async _onPlanClick(e) {
		let t = this._placingId;
		t && this._floorId && (this._placingId = null, await this._write(t, {
			floor_id: this._floorId,
			x: e.detail.x,
			y: e.detail.y
		}), this._selectedId = t);
	}
	_onMarkerSelect(e) {
		this._selectedId = e.detail.deviceId;
	}
	_onMarkerMove(e) {
		this._write(e.detail.deviceId, {
			x: e.detail.x,
			y: e.detail.y
		});
	}
	_onMarkerRotate(e) {
		this._write(e.detail.deviceId, {
			directional: !0,
			rotation_deg: e.detail.rotation_deg
		});
	}
	_onPlacementChange(e) {
		let { deviceId: t, changes: n } = e.detail;
		n.floor_id && (this._floorId = n.floor_id), this._write(t, n);
	}
	_markers() {
		if (!this._data) return [];
		let e = new Set(this._data.orphans);
		return Object.entries(this._data.placements).filter(([, e]) => e.floor_id === this._floorId).map(([t, n]) => ({
			deviceId: t,
			x: n.x,
			y: n.y,
			directional: n.directional,
			rotation_deg: n.rotation_deg,
			icon: Ve(this.hass, t),
			label: e.has(t) ? "Deleted device" : J(this.hass, t),
			orphan: e.has(t)
		}));
	}
	render() {
		if (!this.hass) return I;
		if (!this._data) return N`<div class="message">${this._error ?? "Loading..."}</div>`;
		let e = this._data, t = !e.is_admin;
		if (e.floors.length === 0 || e.floors.every((e) => !e.svg_file)) return t ? N`<div class="message">House Map has not been set up yet.</div>` : N`<hm-setup-wizard
            .hass=${this.hass}
            .floors=${e.floors}
            @wizard-done=${() => this._load(!0)}
          ></hm-setup-wizard>`;
		let n = e.floors.find((e) => e.id === this._floorId) ?? null, r = this._selectedId ? e.placements[this._selectedId] ?? null : null;
		return N`
      <header>
        <h1>House Map</h1>
        <nav>
          ${e.floors.map((e) => N`<button
              class=${e.id === this._floorId ? "active" : ""}
              @click=${() => {
			this._floorId = e.id, this._selectedId = null;
		}}
            >
              ${e.name}
            </button>`)}
        </nav>
        ${t ? N`<span class="ro">View only</span>` : N`<button class="settings" @click=${() => this._settingsOpen = !0}>Floors</button>`}
      </header>
      ${this._error ? N`<div class="error" @click=${() => this._error = null}>${this._error}</div>` : I}
      ${this._placingId ? N`<div class="hint">
            Click the plan to place <b>${J(this.hass, this._placingId)}</b>. Esc cancels.
          </div>` : I}
      <main>
        <hm-device-list
          .hass=${this.hass}
          .placements=${e.placements}
          .orphans=${e.orphans}
          .floors=${e.floors}
          .selectedId=${this._selectedId}
          .placingId=${this._placingId}
          .readOnly=${t}
          @device-pick=${this._onDevicePick}
          @device-select=${this._onDeviceSelect}
          @orphan-remove=${(e) => this._remove(e.detail.deviceId)}
        ></hm-device-list>
        <hm-plan-view
          .floor=${n}
          .imageUrl=${n ? this._images[n.id] ?? null : null}
          .markers=${this._markers()}
          .selectedId=${this._selectedId}
          .placing=${!!this._placingId}
          .readOnly=${t}
          @plan-click=${this._onPlanClick}
          @marker-select=${this._onMarkerSelect}
          @marker-move=${this._onMarkerMove}
          @marker-rotate=${this._onMarkerRotate}
        ></hm-plan-view>
        <hm-inspector
          .hass=${this.hass}
          .deviceId=${this._selectedId}
          .placement=${r}
          .floors=${e.floors}
          .orphan=${!!this._selectedId && e.orphans.includes(this._selectedId)}
          .readOnly=${t}
          @placement-change=${this._onPlacementChange}
          @placement-delete=${(e) => this._remove(e.detail.deviceId)}
        ></hm-inspector>
      </main>
      ${this._settingsOpen ? N`<hm-floor-settings
            .hass=${this.hass}
            .floors=${e.floors}
            .placements=${e.placements}
            @floors-changed=${() => this._load(!0)}
            @closed=${() => this._settingsOpen = !1}
          ></hm-floor-settings>` : I}
    `;
	}
	static {
		this.styles = o`
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
};
customElements.get("house-map-panel") || customElements.define("house-map-panel", Ze);
export { Ze as HouseMapPanel };
