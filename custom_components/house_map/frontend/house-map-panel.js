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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: ee, getOwnPropertySymbols: te, getPrototypeOf: ne } = Object, f = globalThis, re = f.trustedTypes, ie = re ? re.emptyScript : "", ae = f.reactiveElementPolyfillSupport, p = (e, t) => e, m = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? ie : null;
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
}, h = (e, t) => !l(e, t), g = {
	attribute: !0,
	type: String,
	converter: m,
	reflect: !1,
	useDefault: !1,
	hasChanged: h
};
Symbol.metadata ??= Symbol("metadata"), f.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var _ = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = g) {
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
		return this.elementProperties.get(e) ?? g;
	}
	static _$Ei() {
		if (this.hasOwnProperty(p("elementProperties"))) return;
		let e = ne(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(p("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(p("properties"))) {
			let e = this.properties, t = [...ee(e), ...te(e)];
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
			let i = (n.converter?.toAttribute === void 0 ? m : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? m : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? h)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
_.elementStyles = [], _.shadowRootOptions = { mode: "open" }, _[p("elementProperties")] = /* @__PURE__ */ new Map(), _[p("finalized")] = /* @__PURE__ */ new Map(), ae?.({ ReactiveElement: _ }), (f.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
var v = globalThis, oe = (e) => e, y = v.trustedTypes, se = y ? y.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ce = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, le = "?" + b, ue = `<${le}>`, x = document, S = () => x.createComment(""), C = (e) => e === null || typeof e != "object" && typeof e != "function", w = Array.isArray, de = (e) => w(e) || typeof e?.[Symbol.iterator] == "function", T = "[ 	\n\f\r]", E = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, fe = /-->/g, pe = />/g, D = RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), me = /'/g, O = /"/g, k = /^(?:script|style|textarea|title)$/i, A = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), j = A(1), M = A(2), N = Symbol.for("lit-noChange"), P = Symbol.for("lit-nothing"), he = /* @__PURE__ */ new WeakMap(), F = x.createTreeWalker(x, 129);
function ge(e, t) {
	if (!w(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return se === void 0 ? t : se.createHTML(t);
}
var _e = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = E;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === E ? c[1] === "!--" ? o = fe : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = D) : (k.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = D) : o = pe : o === D ? c[0] === ">" ? (o = i ?? E, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? D : c[3] === "\"" ? O : me) : o === O || o === me ? o = D : o === fe || o === pe ? o = E : (o = D, i = void 0);
		let d = o === D && e[t + 1].startsWith("/>") ? " " : "";
		a += o === E ? n + ue : l >= 0 ? (r.push(s), n.slice(0, l) + ce + n.slice(l) + b + d) : n + b + (l === -2 ? t : d);
	}
	return [ge(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, I = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = _e(t, n);
		if (this.el = e.createElement(l, r), F.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = F.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ce)) {
					let t = u[o++], n = i.getAttribute(e).split(b), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? ye : r[1] === "?" ? be : r[1] === "@" ? xe : z
					}), i.removeAttribute(e);
				} else e.startsWith(b) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (k.test(i.tagName)) {
					let e = i.textContent.split(b), t = e.length - 1;
					if (t > 0) {
						i.textContent = y ? y.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], S()), F.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], S());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === le) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(b, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += b.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = x.createElement("template");
		return n.innerHTML = e, n;
	}
};
function L(e, t, n = e, r) {
	if (t === N) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = C(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = L(e, i._$AS(e, t.values), i, r)), t;
}
var ve = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? x).importNode(t, !0);
		F.currentNode = r;
		let i = F.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new R(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Se(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = F.nextNode(), a++);
		}
		return F.currentNode = x, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, R = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = P, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = L(this, e, t), C(e) ? e === P || e == null || e === "" ? (this._$AH !== P && this._$AR(), this._$AH = P) : e !== this._$AH && e !== N && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? de(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== P && C(this._$AH) ? this._$AA.nextSibling.data = e : this.T(x.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = I.createElement(ge(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new ve(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = he.get(e.strings);
		return t === void 0 && he.set(e.strings, t = new I(e)), t;
	}
	k(t) {
		w(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(S()), this.O(S()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = oe(e).nextSibling;
			oe(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, z = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = P, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = P;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = L(this, e, t, 0), a = !C(e) || e !== this._$AH && e !== N, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = L(this, r[n + o], t, o), s === N && (s = this._$AH[o]), a ||= !C(s) || s !== this._$AH[o], s === P ? e = P : e !== P && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === P ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, ye = class extends z {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === P ? void 0 : e;
	}
}, be = class extends z {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== P);
	}
}, xe = class extends z {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = L(this, e, t, 0) ?? P) === N) return;
		let n = this._$AH, r = e === P && n !== P || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== P && (n === P || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Se = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		L(this, e);
	}
}, Ce = v.litHtmlPolyfillSupport;
Ce?.(I, R), (v.litHtmlVersions ??= []).push("3.3.3");
var we = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new R(t.insertBefore(S(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, B = globalThis, V = class extends _ {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = we(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return N;
	}
};
V._$litElement$ = !0, V.finalized = !0, B.litElementHydrateSupport?.({ LitElement: V });
var Te = B.litElementPolyfillSupport;
Te?.({ LitElement: V }), (B.litElementVersions ??= []).push("4.2.2");
// src/api.ts
var Ee = (e) => e.callWS({ type: "house_map/get" }), H = (e, t) => e.callWS({
	type: "house_map/floor/create",
	name: t
}), U = (e, t, n) => e.callWS({
	type: "house_map/floor/update",
	floor_id: t,
	...n
}), De = (e, t) => e.callWS({
	type: "house_map/floor/reorder",
	floor_ids: t
}), W = (e, t, n = !1) => e.callWS({
	type: "house_map/floor/delete",
	floor_id: t,
	force: n
}), Oe = (e, t, n) => e.callWS({
	type: "house_map/placement/set",
	device_id: t,
	...n
}), ke = (e, t) => e.callWS({
	type: "house_map/placement/delete",
	device_id: t
}), Ae = (e) => `/api/house_map/floors/${encodeURIComponent(e)}/svg`;
async function je(e) {
	try {
		return (await e.json()).message ?? e.statusText;
	} catch {
		return e.statusText;
	}
}
async function G(e, t, n, r) {
	let i = await e.fetchWithAuth(`${Ae(t)}?mode=${r}`, {
		method: "POST",
		headers: { "Content-Type": "image/svg+xml" },
		body: n
	});
	if (!i.ok) throw Error(await je(i));
	return i.json();
}
async function Me(e, t) {
	let n = await e.fetchWithAuth(Ae(t));
	if (!n.ok) throw Error(await je(n));
	let r = await n.blob();
	return URL.createObjectURL(new Blob([r], { type: "image/svg+xml" }));
}
// node_modules/@mdi/js/mdi.js
var Ne = "M6.03 12.03L8.03 15.5L5.5 18.68L2 12.62L6.03 12.03M17 18V15.29C17.88 14.9 18.5 14.03 18.5 13C18.5 12.43 18.3 11.9 17.97 11.5L19.94 10.35C20.95 9.76 21.3 8.47 20.71 7.46L19.33 5.06C18.74 4.05 17.45 3.7 16.44 4.28L8.31 9C7.36 9.53 7.03 10.75 7.58 11.71L9.08 14.31C9.63 15.26 10.86 15.59 11.81 15.04L13.69 13.96C13.94 14.55 14.41 15.03 15 15.29V18C15 19.1 15.9 20 17 20H22V18H17Z", Pe = "M6,4H18V5H21V7H18V9H21V11H18V13H21V15H18V17H21V19H18V20H6V19H3V17H6V15H3V13H6V11H3V9H6V7H3V5H6V4M11,15V18H12V15H11M13,15V18H14V15H13M15,15V18H16V15H15Z", K = "M8,3C6.89,3 6,3.89 6,5V21H18V5C18,3.89 17.11,3 16,3H8M8,5H16V19H8V5M13,11V13H15V11H13Z", Fe = "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z", Ie = "M7,2V13H10V22L17,10H13L17,2H7Z", Le = "M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z", Re = "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z", q = "M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z", ze = "M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z", Be = "M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z", Ve = "M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z", He = "M17,7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7M17,15A3,3 0 0,1 14,12A3,3 0 0,1 17,9A3,3 0 0,1 20,12A3,3 0 0,1 17,15Z", Ue = {
	motion: q,
	occupancy: q,
	presence: q,
	door: K,
	garage_door: K,
	opening: K,
	window: "M21 20V2H3V20H1V23H23V20M19 4V11H13V4M5 4H11V11H5M5 20V13H11V20M13 20V13H19V20Z",
	vibration: "M16,19H8V5H16M16.5,3H7.5A1.5,1.5 0 0,0 6,4.5V19.5A1.5,1.5 0 0,0 7.5,21H16.5A1.5,1.5 0 0,0 18,19.5V4.5A1.5,1.5 0 0,0 16.5,3M19,17H21V7H19M22,9V15H24V9M3,17H5V7H3M0,15H2V9H0V15Z",
	temperature: Ve,
	humidity: "M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0,0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97M9.75,10A1.25,1.25 0 0,1 11,11.25A1.25,1.25 0 0,1 9.75,12.5A1.25,1.25 0 0,1 8.5,11.25A1.25,1.25 0 0,1 9.75,10M14.25,14.5A1.25,1.25 0 0,1 15.5,15.75A1.25,1.25 0 0,1 14.25,17A1.25,1.25 0 0,1 13,15.75A1.25,1.25 0 0,1 14.25,14.5Z",
	power: Ie,
	energy: Ie,
	weight: "M12,3A4,4 0 0,1 16,7C16,7.73 15.81,8.41 15.46,9H18C18.95,9 19.75,9.67 19.95,10.56C21.96,18.57 22,18.78 22,19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19C2,18.78 2.04,18.57 4.05,10.56C4.25,9.67 5.05,9 6,9H8.54C8.19,8.41 8,7.73 8,7A4,4 0 0,1 12,3M12,5A2,2 0 0,0 10,7A2,2 0 0,0 12,9A2,2 0 0,0 14,7A2,2 0 0,0 12,5Z"
}, We = {
	light: Le,
	switch: ze,
	camera: Ne,
	lock: Re,
	fan: Fe,
	media_player: Be,
	input_boolean: He
}, Ge = [
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
function Ke(e, t) {
	let n = Object.values(e.entities).filter((e) => e.device_id === t), r = /* @__PURE__ */ new Set();
	for (let t of n) {
		let n = e.states[t.entity_id]?.attributes?.device_class;
		typeof n == "string" && r.add(n);
	}
	for (let e of Ge) if (r.has(e)) return Ue[e];
	for (let e of n) {
		let t = We[e.entity_id.split(".")[0]];
		if (t) return t;
	}
	return Pe;
}
// src/types.ts
function qe(e, t) {
	let n = e.devices[t];
	return n?.name_by_user || n?.name || "Unknown device";
}
function J(e, t, n) {
	e.dispatchEvent(new CustomEvent(t, {
		detail: n,
		bubbles: !0,
		composed: !0
	}));
}
// src/plan-view.ts
var Je = 13, Ye = 30, Xe = 3, Y = 1.2, X = (e) => e * Math.PI / 180, Ze = (e) => (e % 360 + 360) % 360, Qe = class extends V {
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
					J(this, "marker-select", { deviceId: t });
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
				if (!t.moved && Math.hypot(n, r) < Xe) return;
				t.moved = !0;
				let i = t.startView;
				this._view = [
					i[0] - n * this._upp,
					i[1] - r * this._upp,
					i[2],
					i[3]
				];
			} else if (t.kind === "drag") {
				if (!t.moved && Math.hypot(e.clientX - t.startX, e.clientY - t.startY) < Xe) return;
				t.moved = !0;
				let n = this._toPlan(e);
				n && (this._dragPos = {
					deviceId: t.deviceId,
					...n
				});
			} else {
				let n = this.markers.find((e) => e.deviceId === t.deviceId), r = this._toPlan(e);
				if (!n || !r) return;
				let i = Ze(Math.atan2(r.x - n.x, -(r.y - n.y)) * 180 / Math.PI);
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
					t && J(this, "plan-click", t);
				} else J(this, "marker-select", { deviceId: null });
			} else t.kind === "drag" ? (t.moved && this._dragPos ? J(this, "marker-move", { ...this._dragPos }) : J(this, "marker-select", { deviceId: t.deviceId }), this._dragPos = null) : this._rotPreview &&= (J(this, "marker-rotate", {
				deviceId: this._rotPreview.deviceId,
				rotation_deg: this._rotPreview.deg
			}), null);
		}
	}
	_onWheel(e) {
		e.preventDefault();
		let t = this._toPlan(e);
		this.zoom(e.deltaY > 0 ? Y : 1 / Y, t?.x, t?.y);
	}
	_renderMarker(e) {
		let t = Je * this._upp, { x: n, y: r } = this._markerPos(e), i = e.deviceId === this.selectedId, a = this._markerRot(e), o = t * 4, s = (e, t) => `${t * Math.sin(X(e))} ${-t * Math.cos(X(e))}`;
		return M`
      <g class=${[
			"marker",
			i ? "selected" : "",
			e.orphan ? "orphan" : ""
		].join(" ")} transform="translate(${n} ${r})" data-marker=${e.deviceId}>
        ${e.directional ? M`<path class="cone"
              d="M0 0 L${s(a - Ye, o)} A${o} ${o} 0 0 1 ${s(a + Ye, o)} Z" />` : P}
        <circle class="dot" r=${t} />
        <svg x=${-t * .7} y=${-t * .7} width=${t * 1.4} height=${t * 1.4} viewBox="0 0 24 24">
          <path class="icon" d=${e.icon} />
        </svg>
        <title>${e.label}</title>
        ${i ? M`<text class="label" y=${t * 2.2} font-size=${12 * this._upp}>${e.label}</text>` : P}
        ${i && e.directional && !this.readOnly ? M`<line class="arm" x1="0" y1="0" x2=${o * Math.sin(X(a))} y2=${-o * Math.cos(X(a))} />
                <circle class="handle" data-rotate=${e.deviceId} r=${t * .5}
                  cx=${o * Math.sin(X(a))} cy=${-o * Math.cos(X(a))} />` : P}
      </g>`;
	}
	render() {
		let e = this.floor?.viewbox, t = this._view;
		return !this.floor || !e || !t ? j`<div class="empty">This floor has no floor plan yet.</div>` : j`
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
        ${this.imageUrl ? M`<image href=${this.imageUrl} x=${e[0]} y=${e[1]} width=${e[2]} height=${e[3]}
              preserveAspectRatio="none" />` : P}
        ${this.markers.map((e) => this._renderMarker(e))}
      </svg>
      <div class="zoom">
        <button title="Zoom in" @click=${() => this.zoom(1 / Y)}>+</button>
        <button title="Zoom out" @click=${() => this.zoom(Y)}>-</button>
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
customElements.get("hm-plan-view") || customElements.define("hm-plan-view", Qe);
// src/device-list.ts
var $e = class extends V {
	constructor(...e) {
		super(...e), this.placements = {}, this.orphans = [], this.floors = [], this.selectedId = null, this.placingId = null, this.readOnly = !1;
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			placements: { attribute: !1 },
			orphans: { attribute: !1 },
			floors: { attribute: !1 },
			selectedId: { attribute: !1 },
			placingId: { attribute: !1 },
			readOnly: { type: Boolean }
		};
	}
	render() {
		return j`<div>Device list</div>`;
	}
};
customElements.get("hm-device-list") || customElements.define("hm-device-list", $e);
// src/inspector.ts
var et = class extends V {
	constructor(...e) {
		super(...e), this.deviceId = null, this.placement = null, this.floors = [], this.orphan = !1, this.readOnly = !1;
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			deviceId: { attribute: !1 },
			placement: { attribute: !1 },
			floors: { attribute: !1 },
			orphan: { type: Boolean },
			readOnly: { type: Boolean }
		};
	}
	render() {
		return j`<div>Inspector</div>`;
	}
};
customElements.get("hm-inspector") || customElements.define("hm-inspector", et);
// src/setup-wizard.ts
var tt = [
	"First",
	"Second",
	"Third"
], nt = (e) => e < tt.length ? `${tt[e]} Floor` : `Floor ${e + 1}`, Z = 20, Q = () => ({
	file: null,
	busy: !1,
	viewbox: null,
	error: null
}), rt = class extends V {
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
		return Number.isInteger(e) && e >= 1 && e <= Z;
	}
	_hasSvg(e) {
		return !!this._local?.[e]?.svg_file || !!this._checks[e]?.viewbox;
	}
	_go(e) {
		this._error = null, this._step = e;
	}
	_toNames() {
		if (!this._countValid()) {
			this._error = `Enter a whole number from 1 to ${Z}.`;
			return;
		}
		let e = this._countValue, t = this._base, n = [];
		for (let r = 0; r < e; r++) n.push(this._names[r] ?? t[r]?.name ?? nt(r));
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
					let t = await H(this.hass, e[r]);
					n.push(t.floor);
				} else if (i.name !== e[r]) {
					let t = await U(this.hass, i.id, { name: e[r] });
					n.push(t.floor);
				} else n.push(i);
				this._local = [...n, ...t.slice(r + 1)];
			}
			for (let n = t.length - 1; n >= e.length; n--) await W(this.hass, t[n].id);
			this._local = n;
			let r = this._checks;
			this._checks = n.map((e, t) => r[t] ?? Q()), this._go(3);
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
			let t = await G(this.hass, r.id, n, "check");
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
				let r = (await G(this.hass, n.id, t.file, "keep")).floor ?? {
					...n,
					svg_file: "uploaded"
				};
				this._local = (this._local ?? []).map((t, n) => n === e ? r : t), this._setCheck(e, Q());
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
				await U(this.hass, t[n].id, { calibration: {
					units_per_foot: r.upf,
					origin_x: r.ox,
					origin_y: r.oy
				} });
			}
			J(this, "wizard-done", {});
		} catch (e) {
			this._error = e.message;
		} finally {
			this._busy = !1;
		}
	}
	render() {
		return j`
      <div class="card">
        <div class="step">Step ${this._step} of 4</div>
        ${this._step === 1 ? this._renderCount() : P}
        ${this._step === 2 ? this._renderNames() : P}
        ${this._step === 3 ? this._renderUpload() : P}
        ${this._step === 4 ? this._renderCalibration() : P}
        ${this._error ? j`<div class="error" role="alert">${this._error}</div>` : P}
      </div>
    `;
	}
	_renderCount() {
		return j`
      <h2>How many floors?</h2>
      <p class="hint">Count every level of the house you want a plan for, including a basement if you have one.</p>
      <label class="field">
        <span>Number of floors</span>
        <input
          type="number"
          min="1"
          max=${Z}
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
		return j`
      <h2>Name your floors</h2>
      ${this._names.map((e, t) => j`
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
		return j`
      <h2>Upload floor plans</h2>
      <p class="hint">Choose an SVG file for each floor. At least one floor needs a plan; you can skip the others for now.</p>
      ${(this._local ?? []).map((e, t) => {
			let n = this._checks[t] ?? Q();
			return j`
          <div class="floor-row">
            <div class="floor-name">${e.name}</div>
            <input
              type="file"
              accept=".svg,image/svg+xml"
              ?disabled=${this._busy}
              @change=${(e) => this._onFile(t, e)}
            />
            ${n.file ? j`<div class="meta">${n.file.name}</div>` : P}
            ${n.busy ? j`<div class="meta">Checking...</div>` : P}
            ${n.viewbox ? j`<div class="ok">Valid plan: ${n.viewbox[2]} x ${n.viewbox[3]} units</div>` : P}
            ${n.error ? j`<div class="error">${n.error}</div>` : P}
            ${!n.file && e.svg_file ? j`<div class="ok">A plan is already uploaded for this floor.</div>` : P}
            ${!n.file && !e.svg_file ? j`<div class="meta">No plan yet (skipped).</div>` : P}
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
		return j`
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
			return j`
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
		return j`
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
customElements.get("hm-setup-wizard") || customElements.define("hm-setup-wizard", rt);
// src/floor-settings.ts
var $ = (e) => e ? `${e[2]} x ${e[3]} units` : "none", it = class extends V {
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
		J(this, "closed", {});
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
			return await t(), this._setMsg(e, null, n), J(this, "floors-changed", {}), !0;
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
			await U(this.hass, e.id, { name: n });
		}) && r();
	}
	async _move(e, t) {
		let n = this._sorted.map((e) => e.id), r = e + t;
		r < 0 || r >= n.length || ([n[e], n[r]] = [n[r], n[e]], await this._run(n[r], async () => {
			await De(this.hass, n);
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
			await U(this.hass, e.id, { calibration: {
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
			await W(this.hass, e.id, t > 0);
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
				let t = await G(this.hass, e.id, r, "check");
				t.viewbox_changed ? this._pending = {
					...this._pending,
					[e.id]: {
						file: r,
						oldVb: t.old_viewbox,
						newVb: t.new_viewbox
					}
				} : (await G(this.hass, e.id, r, "keep"), this._setMsg(e.id, null, "Plan replaced."), J(this, "floors-changed", {}));
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
			await G(this.hass, e.id, n.file, t);
		}, "Plan replaced.") && this._clearPending(e.id);
	}
	async _add() {
		let e = this._newName.trim();
		e ? await this._run("_add", async () => {
			await H(this.hass, e);
		}, "Floor added. Upload its plan in its row below.") && (this._newName = "") : this._setMsg("_add", "Enter a name for the new floor.");
	}
	render() {
		let e = this._sorted;
		return j`
      <div class="backdrop" @click=${(e) => e.target === e.currentTarget && this._close()}>
        <div class="dialog" role="dialog" aria-modal="true" aria-label="Floor settings">
          <div class="header">
            <h2>Floor settings</h2>
            <button @click=${() => this._close()}>Close</button>
          </div>
          <div class="body">
            ${e.length === 0 ? j`<p class="hint">There are no floors yet.</p>` : P}
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
		return j`
      ${this._errors[e] ? j`<div class="error" role="alert">${this._errors[e]}</div>` : P}
      ${this._notes[e] ? j`<div class="ok">${this._notes[e]}</div>` : P}
    `;
	}
	_renderFloor(e, t, n) {
		let r = this._deviceCount(e.id), i = this._pending[e.id];
		return j`
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
          ${e.svg_file ? j`Plan: ${$(e.viewbox)}.` : j`<strong>No plan uploaded yet.</strong>`}
        </div>

        <div class="section">
          <label class="lbl">${e.svg_file ? "Replace plan" : "Upload plan"}</label>
          <input
            type="file"
            accept=".svg,image/svg+xml"
            ?disabled=${this._busy}
            @change=${(t) => this._onReplaceFile(e, t)}
          />
          ${i ? j`
                <div class="choice">
                  <div>
                    The new plan has a different size. Old: ${$(i.oldVb)}. New: ${$(i.newVb)}.
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
              ` : P}
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
		return j`
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
customElements.get("hm-floor-settings") || customElements.define("hm-floor-settings", it);
// src/house-map-panel.ts
var at = class extends V {
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
			let t = await Ee(this.hass);
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
			e[t.id] = await Me(this.hass, t.id);
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
			let { placement: t } = await Oe(this.hass, e, r);
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
			await ke(this.hass, e), this._applyPlacement(e, null), this._selectedId === e && (this._selectedId = null);
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
			icon: Ke(this.hass, t),
			label: e.has(t) ? "Deleted device" : qe(this.hass, t),
			orphan: e.has(t)
		}));
	}
	render() {
		if (!this.hass) return P;
		if (!this._data) return j`<div class="message">${this._error ?? "Loading..."}</div>`;
		let e = this._data, t = !e.is_admin;
		if (e.floors.length === 0 || e.floors.every((e) => !e.svg_file)) return t ? j`<div class="message">House Map has not been set up yet.</div>` : j`<hm-setup-wizard
            .hass=${this.hass}
            .floors=${e.floors}
            @wizard-done=${() => this._load(!0)}
          ></hm-setup-wizard>`;
		let n = e.floors.find((e) => e.id === this._floorId) ?? null, r = this._selectedId ? e.placements[this._selectedId] ?? null : null;
		return j`
      <header>
        <h1>House Map</h1>
        <nav>
          ${e.floors.map((e) => j`<button
              class=${e.id === this._floorId ? "active" : ""}
              @click=${() => {
			this._floorId = e.id, this._selectedId = null;
		}}
            >
              ${e.name}
            </button>`)}
        </nav>
        ${t ? j`<span class="ro">View only</span>` : j`<button class="settings" @click=${() => this._settingsOpen = !0}>Floors</button>`}
      </header>
      ${this._error ? j`<div class="error" @click=${() => this._error = null}>${this._error}</div>` : P}
      ${this._placingId ? j`<div class="hint">
            Click the plan to place <b>${qe(this.hass, this._placingId)}</b>. Esc cancels.
          </div>` : P}
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
      ${this._settingsOpen ? j`<hm-floor-settings
            .hass=${this.hass}
            .floors=${e.floors}
            .placements=${e.placements}
            @floors-changed=${() => this._load(!0)}
            @closed=${() => this._settingsOpen = !1}
          ></hm-floor-settings>` : P}
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
customElements.get("house-map-panel") || customElements.define("house-map-panel", at);
export { at as HouseMapPanel };
