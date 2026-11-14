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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: p, getPrototypeOf: ee } = Object, m = globalThis, te = m.trustedTypes, ne = te ? te.emptyScript : "", re = m.reactiveElementPolyfillSupport, h = (e, t) => e, g = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? ne : null;
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
}, ie = (e, t) => !l(e, t), _ = {
	attribute: !0,
	type: String,
	converter: g,
	reflect: !1,
	useDefault: !1,
	hasChanged: ie
};
Symbol.metadata ??= Symbol("metadata"), m.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var v = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = _) {
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
		return this.elementProperties.get(e) ?? _;
	}
	static _$Ei() {
		if (this.hasOwnProperty(h("elementProperties"))) return;
		let e = ee(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(h("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(h("properties"))) {
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
			let i = (n.converter?.toAttribute === void 0 ? g : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? g : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? ie)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
v.elementStyles = [], v.shadowRootOptions = { mode: "open" }, v[h("elementProperties")] = /* @__PURE__ */ new Map(), v[h("finalized")] = /* @__PURE__ */ new Map(), re?.({ ReactiveElement: v }), (m.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
var y = globalThis, ae = (e) => e, b = y.trustedTypes, oe = b ? b.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, se = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, ce = "?" + x, le = `<${ce}>`, S = document, C = () => S.createComment(""), w = (e) => e === null || typeof e != "object" && typeof e != "function", T = Array.isArray, ue = (e) => T(e) || typeof e?.[Symbol.iterator] == "function", E = "[ 	\n\f\r]", D = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, de = /-->/g, fe = />/g, O = RegExp(`>|${E}(?:([^\\s"'>=/]+)(${E}*=${E}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), pe = /'/g, me = /"/g, he = /^(?:script|style|textarea|title)$/i, ge = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), k = ge(1), A = ge(2), j = Symbol.for("lit-noChange"), M = Symbol.for("lit-nothing"), _e = /* @__PURE__ */ new WeakMap(), N = S.createTreeWalker(S, 129);
function ve(e, t) {
	if (!T(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return oe === void 0 ? t : oe.createHTML(t);
}
var ye = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = D;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === D ? c[1] === "!--" ? o = de : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = O) : (he.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = O) : o = fe : o === O ? c[0] === ">" ? (o = i ?? D, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? O : c[3] === "\"" ? me : pe) : o === me || o === pe ? o = O : o === de || o === fe ? o = D : (o = O, i = void 0);
		let d = o === O && e[t + 1].startsWith("/>") ? " " : "";
		a += o === D ? n + le : l >= 0 ? (r.push(s), n.slice(0, l) + se + n.slice(l) + x + d) : n + x + (l === -2 ? t : d);
	}
	return [ve(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, P = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = ye(t, n);
		if (this.el = e.createElement(l, r), N.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = N.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(se)) {
					let t = u[o++], n = i.getAttribute(e).split(x), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? xe : r[1] === "?" ? Se : r[1] === "@" ? Ce : L
					}), i.removeAttribute(e);
				} else e.startsWith(x) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (he.test(i.tagName)) {
					let e = i.textContent.split(x), t = e.length - 1;
					if (t > 0) {
						i.textContent = b ? b.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], C()), N.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], C());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === ce) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(x, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += x.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = S.createElement("template");
		return n.innerHTML = e, n;
	}
};
function F(e, t, n = e, r) {
	if (t === j) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = w(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = F(e, i._$AS(e, t.values), i, r)), t;
}
var be = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? S).importNode(t, !0);
		N.currentNode = r;
		let i = N.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new I(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new we(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = N.nextNode(), a++);
		}
		return N.currentNode = S, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, I = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = M, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = F(this, e, t), w(e) ? e === M || e == null || e === "" ? (this._$AH !== M && this._$AR(), this._$AH = M) : e !== this._$AH && e !== j && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? ue(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== M && w(this._$AH) ? this._$AA.nextSibling.data = e : this.T(S.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = P.createElement(ve(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new be(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = _e.get(e.strings);
		return t === void 0 && _e.set(e.strings, t = new P(e)), t;
	}
	k(t) {
		T(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(C()), this.O(C()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = ae(e).nextSibling;
			ae(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, L = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = M, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = M;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = F(this, e, t, 0), a = !w(e) || e !== this._$AH && e !== j, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = F(this, r[n + o], t, o), s === j && (s = this._$AH[o]), a ||= !w(s) || s !== this._$AH[o], s === M ? e = M : e !== M && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === M ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, xe = class extends L {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === M ? void 0 : e;
	}
}, Se = class extends L {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== M);
	}
}, Ce = class extends L {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = F(this, e, t, 0) ?? M) === j) return;
		let n = this._$AH, r = e === M && n !== M || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== M && (n === M || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, we = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		F(this, e);
	}
}, Te = y.litHtmlPolyfillSupport;
Te?.(P, I), (y.litHtmlVersions ??= []).push("3.3.3");
var Ee = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new I(t.insertBefore(C(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, R = globalThis, z = class extends v {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ee(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return j;
	}
};
z._$litElement$ = !0, z.finalized = !0, R.litElementHydrateSupport?.({ LitElement: z });
var De = R.litElementPolyfillSupport;
De?.({ LitElement: z }), (R.litElementVersions ??= []).push("4.2.2");
// src/api.ts
var Oe = (e) => e.callWS({ type: "house_map/get" }), ke = (e, t) => e.callWS({
	type: "house_map/floor/create",
	name: t
}), B = (e, t, n) => e.callWS({
	type: "house_map/floor/update",
	floor_id: t,
	...n
}), Ae = (e, t) => e.callWS({
	type: "house_map/floor/reorder",
	floor_ids: t
}), je = (e, t, n = !1) => e.callWS({
	type: "house_map/floor/delete",
	floor_id: t,
	force: n
}), Me = (e, t, n) => e.callWS({
	type: "house_map/placement/set",
	device_id: t,
	...n
}), Ne = (e, t) => e.callWS({
	type: "house_map/placement/delete",
	device_id: t
}), Pe = (e) => `/api/house_map/floors/${encodeURIComponent(e)}/svg`;
async function Fe(e) {
	try {
		return (await e.json()).message ?? e.statusText;
	} catch {
		return e.statusText;
	}
}
async function V(e, t, n, r) {
	let i = await e.fetchWithAuth(`${Pe(t)}?mode=${r}`, {
		method: "POST",
		headers: { "Content-Type": "image/svg+xml" },
		body: n
	});
	if (!i.ok) throw Error(await Fe(i));
	return i.json();
}
async function Ie(e, t) {
	let n = await e.fetchWithAuth(Pe(t));
	if (!n.ok) throw Error(await Fe(n));
	let r = await n.blob();
	return URL.createObjectURL(new Blob([r], { type: "image/svg+xml" }));
}
// node_modules/@mdi/js/mdi.js
var Le = "M6.03 12.03L8.03 15.5L5.5 18.68L2 12.62L6.03 12.03M17 18V15.29C17.88 14.9 18.5 14.03 18.5 13C18.5 12.43 18.3 11.9 17.97 11.5L19.94 10.35C20.95 9.76 21.3 8.47 20.71 7.46L19.33 5.06C18.74 4.05 17.45 3.7 16.44 4.28L8.31 9C7.36 9.53 7.03 10.75 7.58 11.71L9.08 14.31C9.63 15.26 10.86 15.59 11.81 15.04L13.69 13.96C13.94 14.55 14.41 15.03 15 15.29V18C15 19.1 15.9 20 17 20H22V18H17Z", Re = "M6,4H18V5H21V7H18V9H21V11H18V13H21V15H18V17H21V19H18V20H6V19H3V17H6V15H3V13H6V11H3V9H6V7H3V5H6V4M11,15V18H12V15H11M13,15V18H14V15H13M15,15V18H16V15H15Z", H = "M8,3C6.89,3 6,3.89 6,5V21H18V5C18,3.89 17.11,3 16,3H8M8,5H16V19H8V5M13,11V13H15V11H13Z", ze = "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z", Be = "M7,2V13H10V22L17,10H13L17,2H7Z", Ve = "M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z", He = "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z", U = "M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z", Ue = "M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z", We = "M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z", Ge = "M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z", Ke = "M17,7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7M17,15A3,3 0 0,1 14,12A3,3 0 0,1 17,9A3,3 0 0,1 20,12A3,3 0 0,1 17,15Z", qe = {
	motion: U,
	occupancy: U,
	presence: U,
	door: H,
	garage_door: H,
	opening: H,
	window: "M21 20V2H3V20H1V23H23V20M19 4V11H13V4M5 4H11V11H5M5 20V13H11V20M13 20V13H19V20Z",
	vibration: "M16,19H8V5H16M16.5,3H7.5A1.5,1.5 0 0,0 6,4.5V19.5A1.5,1.5 0 0,0 7.5,21H16.5A1.5,1.5 0 0,0 18,19.5V4.5A1.5,1.5 0 0,0 16.5,3M19,17H21V7H19M22,9V15H24V9M3,17H5V7H3M0,15H2V9H0V15Z",
	temperature: Ge,
	humidity: "M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0,0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97M9.75,10A1.25,1.25 0 0,1 11,11.25A1.25,1.25 0 0,1 9.75,12.5A1.25,1.25 0 0,1 8.5,11.25A1.25,1.25 0 0,1 9.75,10M14.25,14.5A1.25,1.25 0 0,1 15.5,15.75A1.25,1.25 0 0,1 14.25,17A1.25,1.25 0 0,1 13,15.75A1.25,1.25 0 0,1 14.25,14.5Z",
	power: Be,
	energy: Be,
	weight: "M12,3A4,4 0 0,1 16,7C16,7.73 15.81,8.41 15.46,9H18C18.95,9 19.75,9.67 19.95,10.56C21.96,18.57 22,18.78 22,19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19C2,18.78 2.04,18.57 4.05,10.56C4.25,9.67 5.05,9 6,9H8.54C8.19,8.41 8,7.73 8,7A4,4 0 0,1 12,3M12,5A2,2 0 0,0 10,7A2,2 0 0,0 12,9A2,2 0 0,0 14,7A2,2 0 0,0 12,5Z"
}, Je = {
	light: Ve,
	switch: Ue,
	camera: Le,
	lock: He,
	fan: ze,
	media_player: We,
	input_boolean: Ke
}, Ye = [
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
], Xe = /* @__PURE__ */ new WeakMap();
function Ze(e, t) {
	let n = Xe.get(e.entities);
	if (!n) {
		n = /* @__PURE__ */ new Map();
		for (let t of Object.values(e.entities)) {
			if (!t.device_id) continue;
			let e = n.get(t.device_id);
			e ? e.push(t) : n.set(t.device_id, [t]);
		}
		Xe.set(e.entities, n);
	}
	return n.get(t) ?? [];
}
function Qe(e, t) {
	let n = Ze(e, t), r = /* @__PURE__ */ new Set();
	for (let t of n) {
		let n = e.states[t.entity_id]?.attributes?.device_class;
		typeof n == "string" && r.add(n);
	}
	for (let e of Ye) if (r.has(e)) return qe[e];
	for (let e of n) {
		let t = Je[e.entity_id.split(".")[0]];
		if (t) return t;
	}
	return Re;
}
// src/types.ts
function W(e, t) {
	let n = e.devices[t];
	return n?.name_by_user || n?.name || "Unknown device";
}
function G(e, t) {
	let n = e.devices[t]?.area_id;
	return n ? e.areas[n]?.name ?? null : null;
}
function K(e, t, n) {
	e.dispatchEvent(new CustomEvent(t, {
		detail: n,
		bubbles: !0,
		composed: !0
	}));
}
// src/plan-view.ts
var $e = 13, et = 30, tt = 3, q = 1.2, J = (e) => e * Math.PI / 180, nt = (e) => (e % 360 + 360) % 360, rt = class extends z {
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
					K(this, "marker-select", { deviceId: t });
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
				if (!t.moved && Math.hypot(n, r) < tt) return;
				t.moved = !0;
				let i = t.startView;
				this._view = [
					i[0] - n * this._upp,
					i[1] - r * this._upp,
					i[2],
					i[3]
				];
			} else if (t.kind === "drag") {
				if (!t.moved && Math.hypot(e.clientX - t.startX, e.clientY - t.startY) < tt) return;
				t.moved = !0;
				let n = this._toPlan(e);
				n && (this._dragPos = {
					deviceId: t.deviceId,
					...n
				});
			} else {
				let n = this.markers.find((e) => e.deviceId === t.deviceId), r = this._toPlan(e);
				if (!n || !r) return;
				let i = nt(Math.atan2(r.x - n.x, -(r.y - n.y)) * 180 / Math.PI);
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
					t && K(this, "plan-click", t);
				} else K(this, "marker-select", { deviceId: null });
			} else t.kind === "drag" ? (t.moved && this._dragPos ? K(this, "marker-move", { ...this._dragPos }) : K(this, "marker-select", { deviceId: t.deviceId }), this._dragPos = null) : this._rotPreview &&= (K(this, "marker-rotate", {
				deviceId: this._rotPreview.deviceId,
				rotation_deg: this._rotPreview.deg
			}), null);
		}
	}
	_onWheel(e) {
		e.preventDefault();
		let t = this._toPlan(e);
		this.zoom(e.deltaY > 0 ? q : 1 / q, t?.x, t?.y);
	}
	_renderMarker(e) {
		let t = $e * this._upp, { x: n, y: r } = this._markerPos(e), i = e.deviceId === this.selectedId, a = this._markerRot(e), o = t * 4, s = (e, t) => `${t * Math.sin(J(e))} ${-t * Math.cos(J(e))}`;
		return A`
      <g class=${[
			"marker",
			i ? "selected" : "",
			e.orphan ? "orphan" : ""
		].join(" ")} transform="translate(${n} ${r})" data-marker=${e.deviceId}>
        ${e.directional ? A`<path class="cone"
              d="M0 0 L${s(a - et, o)} A${o} ${o} 0 0 1 ${s(a + et, o)} Z" />` : M}
        <circle class="dot" r=${t} />
        <svg x=${-t * .7} y=${-t * .7} width=${t * 1.4} height=${t * 1.4} viewBox="0 0 24 24">
          <path class="icon" d=${e.icon} />
        </svg>
        <title>${e.label}</title>
        ${i ? A`<text class="label" y=${t * 2.2} font-size=${12 * this._upp}>${e.label}</text>` : M}
        ${i && e.directional && !this.readOnly ? A`<line class="arm" x1="0" y1="0" x2=${o * Math.sin(J(a))} y2=${-o * Math.cos(J(a))} />
                <circle class="handle" data-rotate=${e.deviceId} r=${t * .5}
                  cx=${o * Math.sin(J(a))} cy=${-o * Math.cos(J(a))} />` : M}
      </g>`;
	}
	render() {
		let e = this.floor?.viewbox, t = this._view;
		return !this.floor || !e || !t ? k`<div class="empty">This floor has no floor plan yet.</div>` : k`
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
        ${this.imageUrl ? A`<image href=${this.imageUrl} x=${e[0]} y=${e[1]} width=${e[2]} height=${e[3]}
              preserveAspectRatio="none" />` : M}
        ${this.markers.map((e) => this._renderMarker(e))}
      </svg>
      <div class="zoom">
        <button title="Zoom in" @click=${() => this.zoom(1 / q)}>+</button>
        <button title="Zoom out" @click=${() => this.zoom(q)}>-</button>
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
customElements.get("hm-plan-view") || customElements.define("hm-plan-view", rt);
// src/device-list.ts
var it = class extends z {
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
			name: W(e, t),
			area: G(e, t) ?? "",
			icon: Qe(e, t)
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
		let ee = [...f.keys()].sort((e, t) => e === "No area" ? 1 : t === "No area" ? -1 : i(e, t));
		this._unplacedGroups = ee.map((e) => {
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
		return k`<svg viewBox="0 0 24 24" aria-hidden="true"><path d=${e}></path></svg>`;
	}
	_row(e, t) {
		let n = t === "pick" && this.placingId === e.id;
		return k`<button
      class="row ${t === "select" && this.selectedId === e.id || n ? "active" : ""}"
      @click=${() => K(this, t === "pick" ? "device-pick" : "device-select", { deviceId: e.id })}
    >
      ${this._icon(e.icon)}
      <span class="text">
        <span class="name">${e.name}</span>
        ${n ? k`<span class="sub hint">Click the plan...</span>` : t === "select" && e.area ? k`<span class="sub">${e.area}</span>` : M}
      </span>
    </button>`;
	}
	render() {
		let e = this._search.trim();
		return k`
      <input
        class="search"
        type="search"
        placeholder="Search devices"
        .value=${this._search}
        @input=${(e) => this._search = e.target.value}
      />
      ${this._orphanRows.length ? k`<section class="orphans">
            <h3>Deleted devices</h3>
            ${this._orphanRows.map((e) => k`<div class="orphan ${this.selectedId === e.id ? "active" : ""}">
                <div class="text">
                  <span class="name">Deleted device</span>
                  <span class="sub">${e.floor}${e.notes ? " - " + e.notes.slice(0, 60) : ""}</span>
                </div>
                <button class="small" @click=${() => K(this, "device-select", { deviceId: e.id })}>Select</button>
                ${this.readOnly ? M : k`<button class="small danger" @click=${() => K(this, "orphan-remove", { deviceId: e.id })}>
                      Remove
                    </button>`}
              </div>`)}
          </section>` : M}
      <section>
        <h3>Placed (${this._placedCount})</h3>
        ${this._placedGroups.map((e) => k`<div class="group-label">${e.label}</div>${e.rows.map((e) => this._row(e, "select"))}`)}
        ${this._placedCount === 0 ? k`<div class="empty">${e ? "No matches." : "Nothing placed yet."}</div>` : M}
      </section>
      ${this.readOnly ? M : k`<section>
            <h3>Not placed (${this._unplacedCount})</h3>
            ${this._unplacedGroups.map((t) => {
			let n = !this._collapsed[t.key] || !!e;
			return k`<button class="group-label toggle" @click=${() => this._toggle(t.key)}>
                  <span>${n ? "v" : ">"}</span> ${t.label} (${t.rows.length})
                </button>
                ${n ? t.rows.map((e) => this._row(e, "pick")) : M}`;
		})}
            ${this._unplacedCount === 0 ? k`<div class="empty">${e ? "No matches." : "All devices are placed."}</div>` : M}
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
customElements.get("hm-device-list") || customElements.define("hm-device-list", it);
// src/inspector.ts
var Y = 2e3, at = class extends z {
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
		this.deviceId && K(this, "placement-change", {
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
		let e = this._draft.slice(0, Y);
		e !== (this.placement?.notes ?? "") && this._change({ notes: e });
	}
	_remove() {
		this.deviceId && window.confirm("Remove this device from the map?") && K(this, "placement-delete", { deviceId: this.deviceId });
	}
	_feet(e, t, n) {
		return n ? ((e - t) / n).toFixed(2) : "n/a";
	}
	render() {
		if (!this.deviceId || !this.placement) return k`<p class="hint">Select a device on the plan or in the list.</p>
        <ul class="legend">
          <li><span class="swatch dot"></span> Device</li>
          <li><span class="swatch cone"></span> Direction the device faces</li>
          <li><span class="swatch red"></span> Deleted device</li>
        </ul>`;
		let e = this.placement, t = this.hass?.devices[this.deviceId], n = this.floors.find((t) => t.id === e.floor_id), r = n?.calibration, i = this.readOnly || this.orphan, a = this.orphan ? null : G(this.hass, this.deviceId), o = [t?.manufacturer, t?.model].filter(Boolean).join(" "), s = e.rotation_deg ?? 0;
		return k`
      <h2 class=${this.orphan ? "deleted" : ""}>${this.orphan ? "Deleted device" : W(this.hass, this.deviceId)}</h2>
      ${!this.orphan && o ? k`<div class="sub">${o}</div>` : M}
      ${a ? k`<div class="sub">Area: ${a}</div>` : M}
      <div class="sub">Floor: ${n?.name ?? "Unknown floor"}</div>

      <label class="field">
        <span>Floor</span>
        <select .value=${e.floor_id} ?disabled=${i} @change=${this._onFloor}>
          ${this.floors.map((t) => k`<option value=${t.id} ?selected=${t.id === e.floor_id}>${t.name}</option>`)}
        </select>
      </label>

      <label class="check">
        <input type="checkbox" .checked=${e.directional} ?disabled=${i} @change=${this._onDirectional} />
        <span>Directional</span>
      </label>
      <div class="help">Check for devices that face a direction, such as motion sensors or cameras.</div>

      ${e.directional ? k`<div class="field">
            <span>Rotation (deg)</span>
            <div class="rot">
              <input type="range" min="0" max="359" step="1" .value=${String(s)} ?disabled=${i} @change=${this._onRotation} />
              <input type="number" min="0" max="359" step="1" .value=${String(s)} ?disabled=${i} @change=${this._onRotation} />
            </div>
            <div class="help">0 is toward the top of the plan, clockwise. You can also drag the handle on the plan.</div>
          </div>` : M}

      <label class="field">
        <span>Notes</span>
        <textarea
          maxlength=${Y}
          rows="4"
          .value=${this._draft}
          ?disabled=${i}
          @input=${(e) => this._draft = e.target.value}
          @blur=${this._saveNotes}
        ></textarea>
        <span class="help right">${this._draft.length}/${Y}</span>
      </label>

      <div class="field">
        <span>Position</span>
        <div class="sub">Plan units: x ${e.x.toFixed(2)}, y ${e.y.toFixed(2)}</div>
        ${r ? k`<div class="sub">
              Feet: x ${this._feet(e.x, r.origin_x, r.units_per_foot)}, y ${this._feet(e.y, r.origin_y, r.units_per_foot)}
            </div>` : M}
      </div>

      ${this.readOnly ? M : k`<button class="remove" @click=${this._remove}>Remove from map</button>`}
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
customElements.get("hm-inspector") || customElements.define("hm-inspector", at);
// src/setup-wizard.ts
var ot = [
	"First",
	"Second",
	"Third"
], st = (e) => e < ot.length ? `${ot[e]} Floor` : `Floor ${e + 1}`, X = 20, Z = () => ({
	file: null,
	busy: !1,
	viewbox: null,
	error: null
}), ct = class extends z {
	constructor(...e) {
		super(...e), this.floors = [], this._step = 1, this._count = null, this._names = [], this._local = null, this._checks = [], this._calib = [], this._busy = !1, this._error = null;
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			floors: { attribute: !1 },
			_step: { state: !0 },
			_count: { state: !0 },
			_names: { state: !0 },
			_local: { state: !0 },
			_checks: { state: !0 },
			_calib: { state: !0 },
			_busy: { state: !0 },
			_error: { state: !0 }
		};
	}
	get _base() {
		return this._local ?? [...this.floors].sort((e, t) => e.order - t.order);
	}
	get _countValue() {
		return this._count ?? (this._base.length || 2);
	}
	_countValid() {
		let e = this._countValue;
		return Number.isInteger(e) && e >= 1 && e <= X;
	}
	_hasSvg(e) {
		return !!this._local?.[e]?.svg_file || !!this._checks[e]?.viewbox;
	}
	_go(e) {
		this._error = null, this._step = e;
	}
	_toNames() {
		if (!this._countValid()) {
			this._error = `Enter a whole number from 1 to ${X}.`;
			return;
		}
		let e = this._countValue, t = this._base, n = [];
		for (let r = 0; r < e; r++) n.push(this._names[r] ?? t[r]?.name ?? st(r));
		this._names = n, this._go(2);
	}
	async _saveFloors() {
		let e = this._names.map((e) => e.trim());
		if (e.some((e) => !e)) {
			this._error = "Every floor needs a name.";
			return;
		}
		this._busy = !0, this._error = null;
		let t = [...this._base], n = [];
		try {
			for (let r = 0; r < e.length; r++) {
				let i = t[r];
				if (!i) {
					let t = await ke(this.hass, e[r]);
					n.push(t.floor);
				} else if (i.name !== e[r]) {
					let t = await B(this.hass, i.id, { name: e[r] });
					n.push(t.floor);
				} else n.push(i);
				this._local = [...n, ...t.slice(r + 1)];
			}
			for (let n = t.length - 1; n >= e.length; n--) await je(this.hass, t[n].id);
			this._local = n;
			let r = this._checks;
			this._checks = n.map((e, t) => r[t] ?? Z()), this._go(3);
		} catch (e) {
			this._error = e.message;
		} finally {
			this._busy = !1;
		}
	}
	async _onFile(e, t) {
		let n = t.target.files?.[0] ?? null, r = this._local?.[e];
		if (r && (this._setCheck(e, {
			file: n,
			busy: !!n,
			viewbox: null,
			error: null
		}), n)) try {
			let t = await V(this.hass, r.id, n, "check");
			this._setCheck(e, {
				file: n,
				busy: !1,
				viewbox: t.new_viewbox,
				error: null
			});
		} catch (t) {
			this._setCheck(e, {
				file: n,
				busy: !1,
				viewbox: null,
				error: t.message
			});
		}
	}
	_setCheck(e, t) {
		let n = [...this._checks];
		n[e] = t, this._checks = n;
	}
	_uploadReady() {
		let e = this._local ?? [];
		return this._checks.some((e) => e.busy) || this._checks.some((e) => e.file && e.error) ? !1 : e.some((e, t) => this._hasSvg(t));
	}
	async _uploadAll() {
		this._busy = !0, this._error = null;
		try {
			for (let e = 0; e < this._checks.length; e++) {
				let t = this._checks[e], n = this._local?.[e];
				if (!t.file || !t.viewbox || !n) continue;
				let r = (await V(this.hass, n.id, t.file, "keep")).floor ?? {
					...n,
					svg_file: "uploaded"
				};
				this._local = (this._local ?? []).map((t, n) => n === e ? r : t), this._setCheck(e, Z());
			}
			this._calib = (this._local ?? []).map((e) => ({
				upf: String(e.calibration?.units_per_foot ?? 1),
				ox: String(e.calibration?.origin_x ?? 0),
				oy: String(e.calibration?.origin_y ?? 0)
			})), this._go(4);
		} catch (e) {
			this._error = e.message;
		} finally {
			this._busy = !1;
		}
	}
	_setCalib(e, t, n) {
		let r = [...this._calib];
		r[e] = {
			...r[e],
			[t]: n
		}, this._calib = r;
	}
	async _finish() {
		let e = [];
		for (let t of this._calib) {
			let n = Number(t.upf), r = Number(t.ox), i = Number(t.oy);
			if (!t.upf.trim() || !Number.isFinite(n) || n <= 0) {
				this._error = "SVG units per foot must be a number greater than 0.";
				return;
			}
			if (!t.ox.trim() || !t.oy.trim() || !Number.isFinite(r) || !Number.isFinite(i)) {
				this._error = "Origin X and Y must be numbers.";
				return;
			}
			e.push({
				upf: n,
				ox: r,
				oy: i
			});
		}
		this._busy = !0, this._error = null;
		try {
			let t = this._local ?? [];
			for (let n = 0; n < t.length; n++) {
				let r = e[n];
				await B(this.hass, t[n].id, { calibration: {
					units_per_foot: r.upf,
					origin_x: r.ox,
					origin_y: r.oy
				} });
			}
			K(this, "wizard-done", {});
		} catch (e) {
			this._error = e.message;
		} finally {
			this._busy = !1;
		}
	}
	render() {
		return k`
      <div class="card">
        <div class="step">Step ${this._step} of 4</div>
        ${this._step === 1 ? this._renderCount() : M}
        ${this._step === 2 ? this._renderNames() : M}
        ${this._step === 3 ? this._renderUpload() : M}
        ${this._step === 4 ? this._renderCalibration() : M}
        ${this._error ? k`<div class="error" role="alert">${this._error}</div>` : M}
      </div>
    `;
	}
	_renderCount() {
		return k`
      <h2>How many floors?</h2>
      <p class="hint">Count every level of the house you want a plan for, including a basement if you have one.</p>
      <label class="field">
        <span>Number of floors</span>
        <input
          type="number"
          min="1"
          max=${X}
          step="1"
          .value=${String(this._countValue)}
          ?disabled=${this._busy}
          @input=${(e) => this._count = e.target.valueAsNumber}
          @keydown=${(e) => e.key === "Enter" && this._toNames()}
        />
      </label>
      <div class="actions">
        <span></span>
        <button class="primary" ?disabled=${this._busy} @click=${() => this._toNames()}>Next</button>
      </div>
    `;
	}
	_renderNames() {
		return k`
      <h2>Name your floors</h2>
      ${this._names.map((e, t) => k`
          <label class="field">
            <span>Floor ${t + 1}</span>
            <input
              type="text"
              .value=${e}
              ?disabled=${this._busy}
              @input=${(e) => {
			let n = [...this._names];
			n[t] = e.target.value, this._names = n;
		}}
            />
          </label>
        `)}
      <div class="actions">
        <button ?disabled=${this._busy} @click=${() => this._go(1)}>Back</button>
        <button class="primary" ?disabled=${this._busy} @click=${() => this._saveFloors()}>
          ${this._busy ? "Saving..." : "Next"}
        </button>
      </div>
    `;
	}
	_renderUpload() {
		return k`
      <h2>Upload floor plans</h2>
      <p class="hint">Choose an SVG file for each floor. At least one floor needs a plan; you can skip the others for now.</p>
      ${(this._local ?? []).map((e, t) => {
			let n = this._checks[t] ?? Z();
			return k`
          <div class="floor-row">
            <div class="floor-name">${e.name}</div>
            <input
              type="file"
              accept=".svg,image/svg+xml"
              ?disabled=${this._busy}
              @change=${(e) => this._onFile(t, e)}
            />
            ${n.file ? k`<div class="meta">${n.file.name}</div>` : M}
            ${n.busy ? k`<div class="meta">Checking...</div>` : M}
            ${n.viewbox ? k`<div class="ok">Valid plan: ${n.viewbox[2]} x ${n.viewbox[3]} units</div>` : M}
            ${n.error ? k`<div class="error">${n.error}</div>` : M}
            ${!n.file && e.svg_file ? k`<div class="ok">A plan is already uploaded for this floor.</div>` : M}
            ${!n.file && !e.svg_file ? k`<div class="meta">No plan yet (skipped).</div>` : M}
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
	_renderCalibration() {
		return k`
      <h2>Calibration</h2>
      <p class="hint">
        Positions are stored in the SVG's own units. To also get real distances, say how many SVG units make one foot
        and where the origin (0, 0 in feet) is.
      </p>
      <p class="hint">If your plan was drawn in feet, keep 1 / 0 / 0.</p>
      ${(this._local ?? []).map((e, t) => {
			let n = this._calib[t] ?? {
				upf: "1",
				ox: "0",
				oy: "0"
			};
			return k`
          <div class="floor-row">
            <div class="floor-name">${e.name}</div>
            <div class="calib">
              ${this._numField("SVG units per foot", n.upf, (e) => this._setCalib(t, "upf", e), "0.0001")}
              ${this._numField("Origin X", n.ox, (e) => this._setCalib(t, "ox", e), "any")}
              ${this._numField("Origin Y", n.oy, (e) => this._setCalib(t, "oy", e), "any")}
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
	_numField(e, t, n, r) {
		return k`
      <label class="field small">
        <span>${e}</span>
        <input
          type="number"
          step=${r}
          .value=${t}
          ?disabled=${this._busy}
          @input=${(e) => n(e.target.value)}
        />
      </label>
    `;
	}
	static {
		this.styles = o`
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
};
customElements.get("hm-setup-wizard") || customElements.define("hm-setup-wizard", ct);
// src/floor-settings.ts
var Q = (e) => e ? `${e[2]} x ${e[3]} units` : "none", lt = class extends z {
	constructor(...e) {
		super(...e), this.floors = [], this.placements = {}, this._busy = !1, this._errors = {}, this._notes = {}, this._nameDrafts = {}, this._calibDrafts = {}, this._pending = {}, this._newName = "", this._onKey = (e) => {
			e.key === "Escape" && this._close();
		};
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			floors: { attribute: !1 },
			placements: { attribute: !1 },
			_busy: { state: !0 },
			_errors: { state: !0 },
			_notes: { state: !0 },
			_nameDrafts: { state: !0 },
			_calibDrafts: { state: !0 },
			_pending: { state: !0 },
			_newName: { state: !0 }
		};
	}
	connectedCallback() {
		super.connectedCallback(), window.addEventListener("keydown", this._onKey);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), window.removeEventListener("keydown", this._onKey);
	}
	_close() {
		K(this, "closed", {});
	}
	get _sorted() {
		return [...this.floors].sort((e, t) => e.order - t.order);
	}
	_deviceCount(e) {
		return Object.values(this.placements ?? {}).filter((t) => t.floor_id === e).length;
	}
	_setMsg(e, t, n = null) {
		let r = { ...this._errors }, i = { ...this._notes };
		t ? r[e] = t : delete r[e], n ? i[e] = n : delete i[e], this._errors = r, this._notes = i;
	}
	async _run(e, t, n = null) {
		this._busy = !0, this._setMsg(e, null);
		try {
			return await t(), this._setMsg(e, null, n), K(this, "floors-changed", {}), !0;
		} catch (t) {
			return this._setMsg(e, t.message), !1;
		} finally {
			this._busy = !1;
		}
	}
	async _saveName(e) {
		let t = this._nameDrafts[e.id];
		if (t === void 0) return;
		let n = t.trim(), r = () => {
			let t = { ...this._nameDrafts };
			delete t[e.id], this._nameDrafts = t;
		};
		!n || n === e.name ? (n || this._setMsg(e.id, "Name cannot be empty."), r()) : await this._run(e.id, async () => {
			await B(this.hass, e.id, { name: n });
		}) && r();
	}
	async _move(e, t) {
		let n = this._sorted.map((e) => e.id), r = e + t;
		r < 0 || r >= n.length || ([n[e], n[r]] = [n[r], n[e]], await this._run(n[r], async () => {
			await Ae(this.hass, n);
		}));
	}
	_calibValue(e, t) {
		let n = this._calibDrafts[e.id]?.[t];
		if (n !== void 0) return n;
		let r = e.calibration;
		return String(t === "upf" ? r.units_per_foot : t === "ox" ? r.origin_x : r.origin_y);
	}
	_setCalibDraft(e, t, n) {
		this._calibDrafts = {
			...this._calibDrafts,
			[e.id]: {
				...this._calibDrafts[e.id],
				[t]: n
			}
		};
	}
	async _saveCalib(e) {
		let t = {
			upf: this._calibValue(e, "upf"),
			ox: this._calibValue(e, "ox"),
			oy: this._calibValue(e, "oy")
		}, n = Number(t.upf), r = Number(t.ox), i = Number(t.oy);
		if (!t.upf.trim() || !Number.isFinite(n) || n <= 0) this._setMsg(e.id, "SVG units per foot must be a number greater than 0.");
		else if (!t.ox.trim() || !t.oy.trim() || !Number.isFinite(r) || !Number.isFinite(i)) this._setMsg(e.id, "Origin X and Y must be numbers.");
		else if (await this._run(e.id, async () => {
			await B(this.hass, e.id, { calibration: {
				units_per_foot: n,
				origin_x: r,
				origin_y: i
			} });
		}, "Calibration saved.")) {
			let t = { ...this._calibDrafts };
			delete t[e.id], this._calibDrafts = t;
		}
	}
	async _delete(e) {
		let t = this._deviceCount(e.id), n = t > 0 ? `Delete "${e.name}"? ${t} device${t === 1 ? "" : "s"} on this floor will be removed from the map.` : `Delete "${e.name}"?`;
		window.confirm(n) && await this._run(e.id, async () => {
			await je(this.hass, e.id, t > 0);
		});
	}
	_clearPending(e) {
		let t = { ...this._pending };
		delete t[e], this._pending = t;
	}
	async _onReplaceFile(e, t) {
		let n = t.target, r = n.files?.[0];
		if (r) {
			this._clearPending(e.id), this._busy = !0, this._setMsg(e.id, null);
			try {
				let t = await V(this.hass, e.id, r, "check");
				t.viewbox_changed ? this._pending = {
					...this._pending,
					[e.id]: {
						file: r,
						oldVb: t.old_viewbox,
						newVb: t.new_viewbox
					}
				} : (await V(this.hass, e.id, r, "keep"), this._setMsg(e.id, null, "Plan replaced."), K(this, "floors-changed", {}));
			} catch (t) {
				this._setMsg(e.id, t.message);
			} finally {
				this._busy = !1, n.value = "";
			}
		}
	}
	async _confirmReplace(e, t) {
		let n = this._pending[e.id];
		n && await this._run(e.id, async () => {
			await V(this.hass, e.id, n.file, t);
		}, "Plan replaced.") && this._clearPending(e.id);
	}
	async _add() {
		let e = this._newName.trim();
		e ? await this._run("_add", async () => {
			await ke(this.hass, e);
		}, "Floor added. Upload its plan in its row below.") && (this._newName = "") : this._setMsg("_add", "Enter a name for the new floor.");
	}
	render() {
		let e = this._sorted;
		return k`
      <div class="backdrop" @click=${(e) => e.target === e.currentTarget && this._close()}>
        <div class="dialog" role="dialog" aria-modal="true" aria-label="Floor settings">
          <div class="header">
            <h2>Floor settings</h2>
            <button @click=${() => this._close()}>Close</button>
          </div>
          <div class="body">
            ${e.length === 0 ? k`<p class="hint">There are no floors yet.</p>` : M}
            ${e.map((t, n) => this._renderFloor(t, n, e.length))}
            <div class="row add">
              <div class="title">Add floor</div>
              <div class="inline">
                <input
                  type="text"
                  placeholder="Floor name"
                  .value=${this._newName}
                  ?disabled=${this._busy}
                  @input=${(e) => this._newName = e.target.value}
                  @keydown=${(e) => e.key === "Enter" && this._add()}
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
	_msg(e) {
		return k`
      ${this._errors[e] ? k`<div class="error" role="alert">${this._errors[e]}</div>` : M}
      ${this._notes[e] ? k`<div class="ok">${this._notes[e]}</div>` : M}
    `;
	}
	_renderFloor(e, t, n) {
		let r = this._deviceCount(e.id), i = this._pending[e.id];
		return k`
      <div class="row">
        <div class="inline">
          <input
            type="text"
            class="name"
            aria-label="Floor name"
            .value=${this._nameDrafts[e.id] ?? e.name}
            ?disabled=${this._busy}
            @input=${(t) => this._nameDrafts = {
			...this._nameDrafts,
			[e.id]: t.target.value
		}}
            @blur=${() => this._saveName(e)}
            @keydown=${(e) => e.key === "Enter" && e.target.blur()}
          />
          <button
            title="Move up"
            aria-label="Move up"
            ?disabled=${this._busy || t === 0}
            @click=${() => this._move(t, -1)}
          >
            Up
          </button>
          <button
            title="Move down"
            aria-label="Move down"
            ?disabled=${this._busy || t === n - 1}
            @click=${() => this._move(t, 1)}
          >
            Down
          </button>
          <button class="danger" ?disabled=${this._busy} @click=${() => this._delete(e)}>Delete</button>
        </div>
        <div class="meta">
          ${r} device${r === 1 ? "" : "s"} on this floor.
          ${e.svg_file ? k`Plan: ${Q(e.viewbox)}.` : k`<strong>No plan uploaded yet.</strong>`}
        </div>

        <div class="section">
          <label class="lbl">${e.svg_file ? "Replace plan" : "Upload plan"}</label>
          <input
            type="file"
            accept=".svg,image/svg+xml"
            ?disabled=${this._busy}
            @change=${(t) => this._onReplaceFile(e, t)}
          />
          ${i ? k`
                <div class="choice">
                  <div>
                    The new plan has a different size. Old: ${Q(i.oldVb)}. New: ${Q(i.newVb)}.
                  </div>
                  <div class="inline wrap">
                    <button ?disabled=${this._busy} @click=${() => this._confirmReplace(e, "keep")}>
                      Keep positions as they are
                    </button>
                    <button class="primary" ?disabled=${this._busy} @click=${() => this._confirmReplace(e, "rescale")}>
                      Scale positions to the new plan
                    </button>
                    <button ?disabled=${this._busy} @click=${() => this._clearPending(e.id)}>Cancel</button>
                  </div>
                </div>
              ` : M}
        </div>

        <div class="section">
          <label class="lbl">Calibration</label>
          <div class="calib">
            ${this._calibField(e, "SVG units per foot", "upf", "0.0001")}
            ${this._calibField(e, "Origin X", "ox", "any")} ${this._calibField(e, "Origin Y", "oy", "any")}
            <button ?disabled=${this._busy} @click=${() => this._saveCalib(e)}>Save</button>
          </div>
        </div>
        ${this._msg(e.id)}
      </div>
    `;
	}
	_calibField(e, t, n, r) {
		return k`
      <label class="field">
        <span>${t}</span>
        <input
          type="number"
          step=${r}
          .value=${this._calibValue(e, n)}
          ?disabled=${this._busy}
          @input=${(t) => this._setCalibDraft(e, n, t.target.value)}
        />
      </label>
    `;
	}
	static {
		this.styles = o`
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
};
customElements.get("hm-floor-settings") || customElements.define("hm-floor-settings", lt);
// src/house-map-panel.ts
var $ = class extends z {
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
			let t = await Oe(this.hass);
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
			e[t.id] = await Ie(this.hass, t.id);
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
			let { placement: t } = await Me(this.hass, e, r);
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
			await Ne(this.hass, e), this._applyPlacement(e, null), this._selectedId === e && (this._selectedId = null);
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
			icon: Qe(this.hass, t),
			label: e.has(t) ? "Deleted device" : W(this.hass, t),
			orphan: e.has(t)
		}));
	}
	render() {
		if (!this.hass) return M;
		if (!this._data) return k`<div class="message">${this._error ?? "Loading..."}</div>`;
		let e = this._data, t = !e.is_admin;
		if (e.floors.length === 0 || e.floors.every((e) => !e.svg_file)) return t ? k`<div class="message">House Map has not been set up yet.</div>` : k`<hm-setup-wizard
            .hass=${this.hass}
            .floors=${e.floors}
            @wizard-done=${() => this._load(!0)}
          ></hm-setup-wizard>`;
		let n = e.floors.find((e) => e.id === this._floorId) ?? null, r = this._selectedId ? e.placements[this._selectedId] ?? null : null;
		return k`
      <header>
        <h1>House Map</h1>
        <nav>
          ${e.floors.map((e) => k`<button
              class=${e.id === this._floorId ? "active" : ""}
              @click=${() => {
			this._floorId = e.id, this._selectedId = null;
		}}
            >
              ${e.name}
            </button>`)}
        </nav>
        ${t ? k`<span class="ro">View only</span>` : k`<button class="settings" @click=${() => this._settingsOpen = !0}>Floors</button>`}
      </header>
      ${this._error ? k`<div class="error" @click=${() => this._error = null}>${this._error}</div>` : M}
      ${this._placingId ? k`<div class="hint">
            Click the plan to place <b>${W(this.hass, this._placingId)}</b>. Esc cancels.
          </div>` : M}
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
      ${this._settingsOpen ? k`<hm-floor-settings
            .hass=${this.hass}
            .floors=${e.floors}
            .placements=${e.placements}
            @floors-changed=${() => this._load(!0)}
            @closed=${() => this._settingsOpen = !1}
          ></hm-floor-settings>` : M}
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
customElements.get("house-map-panel") || customElements.define("house-map-panel", $);
export { $ as HouseMapPanel };
