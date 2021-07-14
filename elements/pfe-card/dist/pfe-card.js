// ../pfelement/dist/pfelement.js
var t = window.ShadowRoot && (window.ShadyCSS === void 0 || window.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var e = Symbol();
var s = class {
  constructor(t32, s52) {
    if (s52 !== e)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t32;
  }
  get styleSheet() {
    return t && this.t === void 0 && (this.t = new CSSStyleSheet(), this.t.replaceSync(this.cssText)), this.t;
  }
  toString() {
    return this.cssText;
  }
};
var n = new Map();
var o = (t32) => {
  let o52 = n.get(t32);
  return o52 === void 0 && n.set(t32, o52 = new s(t32, e)), o52;
};
var r = (t32) => o(typeof t32 == "string" ? t32 : t32 + "");
var S = (e42, s52) => {
  t ? e42.adoptedStyleSheets = s52.map((t32) => t32 instanceof CSSStyleSheet ? t32 : t32.styleSheet) : s52.forEach((t32) => {
    const s62 = document.createElement("style");
    s62.textContent = t32.cssText, e42.appendChild(s62);
  });
};
var u = t ? (t32) => t32 : (t32) => t32 instanceof CSSStyleSheet ? ((t42) => {
  let e42 = "";
  for (const s52 of t42.cssRules)
    e42 += s52.cssText;
  return r(e42);
})(t32) : t32;
var s2;
var e2;
var h;
var r2;
var o2 = { toAttribute(t32, i42) {
  switch (i42) {
    case Boolean:
      t32 = t32 ? "" : null;
      break;
    case Object:
    case Array:
      t32 = t32 == null ? t32 : JSON.stringify(t32);
  }
  return t32;
}, fromAttribute(t32, i42) {
  let s52 = t32;
  switch (i42) {
    case Boolean:
      s52 = t32 !== null;
      break;
    case Number:
      s52 = t32 === null ? null : Number(t32);
      break;
    case Object:
    case Array:
      try {
        s52 = JSON.parse(t32);
      } catch (t42) {
        s52 = null;
      }
  }
  return s52;
} };
var n2 = (t32, i42) => i42 !== t32 && (i42 == i42 || t32 == t32);
var l = { attribute: true, type: String, converter: o2, reflect: false, hasChanged: n2 };
var a = class extends HTMLElement {
  constructor() {
    super(), this.\u03A0i = new Map(), this.\u03A0o = void 0, this.\u03A0l = void 0, this.isUpdatePending = false, this.hasUpdated = false, this.\u03A0h = null, this.u();
  }
  static addInitializer(t32) {
    var i42;
    (i42 = this.v) !== null && i42 !== void 0 || (this.v = []), this.v.push(t32);
  }
  static get observedAttributes() {
    this.finalize();
    const t32 = [];
    return this.elementProperties.forEach((i42, s52) => {
      const e42 = this.\u03A0p(s52, i42);
      e42 !== void 0 && (this.\u03A0m.set(e42, s52), t32.push(e42));
    }), t32;
  }
  static createProperty(t32, i42 = l) {
    if (i42.state && (i42.attribute = false), this.finalize(), this.elementProperties.set(t32, i42), !i42.noAccessor && !this.prototype.hasOwnProperty(t32)) {
      const s52 = typeof t32 == "symbol" ? Symbol() : "__" + t32, e42 = this.getPropertyDescriptor(t32, s52, i42);
      e42 !== void 0 && Object.defineProperty(this.prototype, t32, e42);
    }
  }
  static getPropertyDescriptor(t32, i42, s52) {
    return { get() {
      return this[i42];
    }, set(e42) {
      const h42 = this[t32];
      this[i42] = e42, this.requestUpdate(t32, h42, s52);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t32) {
    return this.elementProperties.get(t32) || l;
  }
  static finalize() {
    if (this.hasOwnProperty("finalized"))
      return false;
    this.finalized = true;
    const t32 = Object.getPrototypeOf(this);
    if (t32.finalize(), this.elementProperties = new Map(t32.elementProperties), this.\u03A0m = new Map(), this.hasOwnProperty("properties")) {
      const t42 = this.properties, i42 = [...Object.getOwnPropertyNames(t42), ...Object.getOwnPropertySymbols(t42)];
      for (const s52 of i42)
        this.createProperty(s52, t42[s52]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), true;
  }
  static finalizeStyles(i42) {
    const s52 = [];
    if (Array.isArray(i42)) {
      const e42 = new Set(i42.flat(1 / 0).reverse());
      for (const i52 of e42)
        s52.unshift(u(i52));
    } else
      i42 !== void 0 && s52.push(u(i42));
    return s52;
  }
  static \u03A0p(t32, i42) {
    const s52 = i42.attribute;
    return s52 === false ? void 0 : typeof s52 == "string" ? s52 : typeof t32 == "string" ? t32.toLowerCase() : void 0;
  }
  u() {
    var t32;
    this.\u03A0g = new Promise((t42) => this.enableUpdating = t42), this.L = new Map(), this.\u03A0_(), this.requestUpdate(), (t32 = this.constructor.v) === null || t32 === void 0 || t32.forEach((t42) => t42(this));
  }
  addController(t32) {
    var i42, s52;
    ((i42 = this.\u03A0U) !== null && i42 !== void 0 ? i42 : this.\u03A0U = []).push(t32), this.renderRoot !== void 0 && this.isConnected && ((s52 = t32.hostConnected) === null || s52 === void 0 || s52.call(t32));
  }
  removeController(t32) {
    var i42;
    (i42 = this.\u03A0U) === null || i42 === void 0 || i42.splice(this.\u03A0U.indexOf(t32) >>> 0, 1);
  }
  \u03A0_() {
    this.constructor.elementProperties.forEach((t32, i42) => {
      this.hasOwnProperty(i42) && (this.\u03A0i.set(i42, this[i42]), delete this[i42]);
    });
  }
  createRenderRoot() {
    var t32;
    const s52 = (t32 = this.shadowRoot) !== null && t32 !== void 0 ? t32 : this.attachShadow(this.constructor.shadowRootOptions);
    return S(s52, this.constructor.elementStyles), s52;
  }
  connectedCallback() {
    var t32;
    this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (t32 = this.\u03A0U) === null || t32 === void 0 || t32.forEach((t42) => {
      var i42;
      return (i42 = t42.hostConnected) === null || i42 === void 0 ? void 0 : i42.call(t42);
    }), this.\u03A0l && (this.\u03A0l(), this.\u03A0o = this.\u03A0l = void 0);
  }
  enableUpdating(t32) {
  }
  disconnectedCallback() {
    var t32;
    (t32 = this.\u03A0U) === null || t32 === void 0 || t32.forEach((t42) => {
      var i42;
      return (i42 = t42.hostDisconnected) === null || i42 === void 0 ? void 0 : i42.call(t42);
    }), this.\u03A0o = new Promise((t42) => this.\u03A0l = t42);
  }
  attributeChangedCallback(t32, i42, s52) {
    this.K(t32, s52);
  }
  \u03A0j(t32, i42, s52 = l) {
    var e42, h42;
    const r42 = this.constructor.\u03A0p(t32, s52);
    if (r42 !== void 0 && s52.reflect === true) {
      const n52 = ((h42 = (e42 = s52.converter) === null || e42 === void 0 ? void 0 : e42.toAttribute) !== null && h42 !== void 0 ? h42 : o2.toAttribute)(i42, s52.type);
      this.\u03A0h = t32, n52 == null ? this.removeAttribute(r42) : this.setAttribute(r42, n52), this.\u03A0h = null;
    }
  }
  K(t32, i42) {
    var s52, e42, h42;
    const r42 = this.constructor, n52 = r42.\u03A0m.get(t32);
    if (n52 !== void 0 && this.\u03A0h !== n52) {
      const t42 = r42.getPropertyOptions(n52), l42 = t42.converter, a42 = (h42 = (e42 = (s52 = l42) === null || s52 === void 0 ? void 0 : s52.fromAttribute) !== null && e42 !== void 0 ? e42 : typeof l42 == "function" ? l42 : null) !== null && h42 !== void 0 ? h42 : o2.fromAttribute;
      this.\u03A0h = n52, this[n52] = a42(i42, t42.type), this.\u03A0h = null;
    }
  }
  requestUpdate(t32, i42, s52) {
    let e42 = true;
    t32 !== void 0 && (((s52 = s52 || this.constructor.getPropertyOptions(t32)).hasChanged || n2)(this[t32], i42) ? (this.L.has(t32) || this.L.set(t32, i42), s52.reflect === true && this.\u03A0h !== t32 && (this.\u03A0k === void 0 && (this.\u03A0k = new Map()), this.\u03A0k.set(t32, s52))) : e42 = false), !this.isUpdatePending && e42 && (this.\u03A0g = this.\u03A0q());
  }
  async \u03A0q() {
    this.isUpdatePending = true;
    try {
      for (await this.\u03A0g; this.\u03A0o; )
        await this.\u03A0o;
    } catch (t42) {
      Promise.reject(t42);
    }
    const t32 = this.performUpdate();
    return t32 != null && await t32, !this.isUpdatePending;
  }
  performUpdate() {
    var t32;
    if (!this.isUpdatePending)
      return;
    this.hasUpdated, this.\u03A0i && (this.\u03A0i.forEach((t42, i52) => this[i52] = t42), this.\u03A0i = void 0);
    let i42 = false;
    const s52 = this.L;
    try {
      i42 = this.shouldUpdate(s52), i42 ? (this.willUpdate(s52), (t32 = this.\u03A0U) === null || t32 === void 0 || t32.forEach((t42) => {
        var i52;
        return (i52 = t42.hostUpdate) === null || i52 === void 0 ? void 0 : i52.call(t42);
      }), this.update(s52)) : this.\u03A0$();
    } catch (t42) {
      throw i42 = false, this.\u03A0$(), t42;
    }
    i42 && this.E(s52);
  }
  willUpdate(t32) {
  }
  E(t32) {
    var i42;
    (i42 = this.\u03A0U) === null || i42 === void 0 || i42.forEach((t42) => {
      var i52;
      return (i52 = t42.hostUpdated) === null || i52 === void 0 ? void 0 : i52.call(t42);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t32)), this.updated(t32);
  }
  \u03A0$() {
    this.L = new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this.\u03A0g;
  }
  shouldUpdate(t32) {
    return true;
  }
  update(t32) {
    this.\u03A0k !== void 0 && (this.\u03A0k.forEach((t42, i42) => this.\u03A0j(i42, this[i42], t42)), this.\u03A0k = void 0), this.\u03A0$();
  }
  updated(t32) {
  }
  firstUpdated(t32) {
  }
};
a.finalized = true, a.elementProperties = new Map(), a.elementStyles = [], a.shadowRootOptions = { mode: "open" }, (e2 = (s2 = globalThis).reactiveElementPlatformSupport) === null || e2 === void 0 || e2.call(s2, { ReactiveElement: a }), ((h = (r2 = globalThis).reactiveElementVersions) !== null && h !== void 0 ? h : r2.reactiveElementVersions = []).push("1.0.0-rc.2");
var t2;
var i2;
var s3;
var e3;
var o3 = globalThis.trustedTypes;
var l2 = o3 ? o3.createPolicy("lit-html", { createHTML: (t32) => t32 }) : void 0;
var n3 = `lit$${(Math.random() + "").slice(9)}$`;
var h2 = "?" + n3;
var r3 = `<${h2}>`;
var u2 = document;
var c = (t32 = "") => u2.createComment(t32);
var d = (t32) => t32 === null || typeof t32 != "object" && typeof t32 != "function";
var v = Array.isArray;
var a2 = (t32) => {
  var i42;
  return v(t32) || typeof ((i42 = t32) === null || i42 === void 0 ? void 0 : i42[Symbol.iterator]) == "function";
};
var f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var _ = /-->/g;
var m = />/g;
var p = />|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g;
var $ = /'/g;
var g = /"/g;
var y = /^(?:script|style|textarea)$/i;
var b = (t32) => (i42, ...s52) => ({ _$litType$: t32, strings: i42, values: s52 });
var T = b(1);
var x = b(2);
var w = Symbol.for("lit-noChange");
var A = Symbol.for("lit-nothing");
var P = new WeakMap();
var V = (t32, i42, s52) => {
  var e42, o52;
  const l42 = (e42 = s52 == null ? void 0 : s52.renderBefore) !== null && e42 !== void 0 ? e42 : i42;
  let n52 = l42._$litPart$;
  if (n52 === void 0) {
    const t42 = (o52 = s52 == null ? void 0 : s52.renderBefore) !== null && o52 !== void 0 ? o52 : null;
    l42._$litPart$ = n52 = new C(i42.insertBefore(c(), t42), t42, void 0, s52);
  }
  return n52.I(t32), n52;
};
var E = u2.createTreeWalker(u2, 129, null, false);
var M = (t32, i42) => {
  const s52 = t32.length - 1, e42 = [];
  let o52, h42 = i42 === 2 ? "<svg>" : "", u32 = f;
  for (let i52 = 0; i52 < s52; i52++) {
    const s62 = t32[i52];
    let l42, c32, d22 = -1, v22 = 0;
    for (; v22 < s62.length && (u32.lastIndex = v22, c32 = u32.exec(s62), c32 !== null); )
      v22 = u32.lastIndex, u32 === f ? c32[1] === "!--" ? u32 = _ : c32[1] !== void 0 ? u32 = m : c32[2] !== void 0 ? (y.test(c32[2]) && (o52 = RegExp("</" + c32[2], "g")), u32 = p) : c32[3] !== void 0 && (u32 = p) : u32 === p ? c32[0] === ">" ? (u32 = o52 != null ? o52 : f, d22 = -1) : c32[1] === void 0 ? d22 = -2 : (d22 = u32.lastIndex - c32[2].length, l42 = c32[1], u32 = c32[3] === void 0 ? p : c32[3] === '"' ? g : $) : u32 === g || u32 === $ ? u32 = p : u32 === _ || u32 === m ? u32 = f : (u32 = p, o52 = void 0);
    const a42 = u32 === p && t32[i52 + 1].startsWith("/>") ? " " : "";
    h42 += u32 === f ? s62 + r3 : d22 >= 0 ? (e42.push(l42), s62.slice(0, d22) + "$lit$" + s62.slice(d22) + n3 + a42) : s62 + n3 + (d22 === -2 ? (e42.push(void 0), i52) : a42);
  }
  const c22 = h42 + (t32[s52] || "<?>") + (i42 === 2 ? "</svg>" : "");
  return [l2 !== void 0 ? l2.createHTML(c22) : c22, e42];
};
var N = class {
  constructor({ strings: t32, _$litType$: i42 }, s52) {
    let e42;
    this.parts = [];
    let l42 = 0, r42 = 0;
    const u32 = t32.length - 1, d22 = this.parts, [v22, a42] = M(t32, i42);
    if (this.el = N.createElement(v22, s52), E.currentNode = this.el.content, i42 === 2) {
      const t42 = this.el.content, i52 = t42.firstChild;
      i52.remove(), t42.append(...i52.childNodes);
    }
    for (; (e42 = E.nextNode()) !== null && d22.length < u32; ) {
      if (e42.nodeType === 1) {
        if (e42.hasAttributes()) {
          const t42 = [];
          for (const i52 of e42.getAttributeNames())
            if (i52.endsWith("$lit$") || i52.startsWith(n3)) {
              const s62 = a42[r42++];
              if (t42.push(i52), s62 !== void 0) {
                const t52 = e42.getAttribute(s62.toLowerCase() + "$lit$").split(n3), i6 = /([.?@])?(.*)/.exec(s62);
                d22.push({ type: 1, index: l42, name: i6[2], strings: t52, ctor: i6[1] === "." ? I : i6[1] === "?" ? L : i6[1] === "@" ? R : H });
              } else
                d22.push({ type: 6, index: l42 });
            }
          for (const i52 of t42)
            e42.removeAttribute(i52);
        }
        if (y.test(e42.tagName)) {
          const t42 = e42.textContent.split(n3), i52 = t42.length - 1;
          if (i52 > 0) {
            e42.textContent = o3 ? o3.emptyScript : "";
            for (let s62 = 0; s62 < i52; s62++)
              e42.append(t42[s62], c()), E.nextNode(), d22.push({ type: 2, index: ++l42 });
            e42.append(t42[i52], c());
          }
        }
      } else if (e42.nodeType === 8)
        if (e42.data === h2)
          d22.push({ type: 2, index: l42 });
        else {
          let t42 = -1;
          for (; (t42 = e42.data.indexOf(n3, t42 + 1)) !== -1; )
            d22.push({ type: 7, index: l42 }), t42 += n3.length - 1;
        }
      l42++;
    }
  }
  static createElement(t32, i42) {
    const s52 = u2.createElement("template");
    return s52.innerHTML = t32, s52;
  }
};
function S2(t32, i42, s52 = t32, e42) {
  var o52, l42, n52, h42;
  if (i42 === w)
    return i42;
  let r42 = e42 !== void 0 ? (o52 = s52.\u03A3i) === null || o52 === void 0 ? void 0 : o52[e42] : s52.\u03A3o;
  const u32 = d(i42) ? void 0 : i42._$litDirective$;
  return (r42 == null ? void 0 : r42.constructor) !== u32 && ((l42 = r42 == null ? void 0 : r42.O) === null || l42 === void 0 || l42.call(r42, false), u32 === void 0 ? r42 = void 0 : (r42 = new u32(t32), r42.T(t32, s52, e42)), e42 !== void 0 ? ((n52 = (h42 = s52).\u03A3i) !== null && n52 !== void 0 ? n52 : h42.\u03A3i = [])[e42] = r42 : s52.\u03A3o = r42), r42 !== void 0 && (i42 = S2(t32, r42.S(t32, i42.values), r42, e42)), i42;
}
var k = class {
  constructor(t32, i42) {
    this.l = [], this.N = void 0, this.D = t32, this.M = i42;
  }
  u(t32) {
    var i42;
    const { el: { content: s52 }, parts: e42 } = this.D, o52 = ((i42 = t32 == null ? void 0 : t32.creationScope) !== null && i42 !== void 0 ? i42 : u2).importNode(s52, true);
    E.currentNode = o52;
    let l42 = E.nextNode(), n52 = 0, h42 = 0, r42 = e42[0];
    for (; r42 !== void 0; ) {
      if (n52 === r42.index) {
        let i52;
        r42.type === 2 ? i52 = new C(l42, l42.nextSibling, this, t32) : r42.type === 1 ? i52 = new r42.ctor(l42, r42.name, r42.strings, this, t32) : r42.type === 6 && (i52 = new z(l42, this, t32)), this.l.push(i52), r42 = e42[++h42];
      }
      n52 !== (r42 == null ? void 0 : r42.index) && (l42 = E.nextNode(), n52++);
    }
    return o52;
  }
  v(t32) {
    let i42 = 0;
    for (const s52 of this.l)
      s52 !== void 0 && (s52.strings !== void 0 ? (s52.I(t32, s52, i42), i42 += s52.strings.length - 2) : s52.I(t32[i42])), i42++;
  }
};
var C = class {
  constructor(t32, i42, s52, e42) {
    this.type = 2, this.N = void 0, this.A = t32, this.B = i42, this.M = s52, this.options = e42;
  }
  setConnected(t32) {
    var i42;
    (i42 = this.P) === null || i42 === void 0 || i42.call(this, t32);
  }
  get parentNode() {
    return this.A.parentNode;
  }
  get startNode() {
    return this.A;
  }
  get endNode() {
    return this.B;
  }
  I(t32, i42 = this) {
    t32 = S2(this, t32, i42), d(t32) ? t32 === A || t32 == null || t32 === "" ? (this.H !== A && this.R(), this.H = A) : t32 !== this.H && t32 !== w && this.m(t32) : t32._$litType$ !== void 0 ? this._(t32) : t32.nodeType !== void 0 ? this.$(t32) : a2(t32) ? this.g(t32) : this.m(t32);
  }
  k(t32, i42 = this.B) {
    return this.A.parentNode.insertBefore(t32, i42);
  }
  $(t32) {
    this.H !== t32 && (this.R(), this.H = this.k(t32));
  }
  m(t32) {
    const i42 = this.A.nextSibling;
    i42 !== null && i42.nodeType === 3 && (this.B === null ? i42.nextSibling === null : i42 === this.B.previousSibling) ? i42.data = t32 : this.$(u2.createTextNode(t32)), this.H = t32;
  }
  _(t32) {
    var i42;
    const { values: s52, _$litType$: e42 } = t32, o52 = typeof e42 == "number" ? this.C(t32) : (e42.el === void 0 && (e42.el = N.createElement(e42.h, this.options)), e42);
    if (((i42 = this.H) === null || i42 === void 0 ? void 0 : i42.D) === o52)
      this.H.v(s52);
    else {
      const t42 = new k(o52, this), i52 = t42.u(this.options);
      t42.v(s52), this.$(i52), this.H = t42;
    }
  }
  C(t32) {
    let i42 = P.get(t32.strings);
    return i42 === void 0 && P.set(t32.strings, i42 = new N(t32)), i42;
  }
  g(t32) {
    v(this.H) || (this.H = [], this.R());
    const i42 = this.H;
    let s52, e42 = 0;
    for (const o52 of t32)
      e42 === i42.length ? i42.push(s52 = new C(this.k(c()), this.k(c()), this, this.options)) : s52 = i42[e42], s52.I(o52), e42++;
    e42 < i42.length && (this.R(s52 && s52.B.nextSibling, e42), i42.length = e42);
  }
  R(t32 = this.A.nextSibling, i42) {
    var s52;
    for ((s52 = this.P) === null || s52 === void 0 || s52.call(this, false, true, i42); t32 && t32 !== this.B; ) {
      const i52 = t32.nextSibling;
      t32.remove(), t32 = i52;
    }
  }
};
var H = class {
  constructor(t32, i42, s52, e42, o52) {
    this.type = 1, this.H = A, this.N = void 0, this.V = void 0, this.element = t32, this.name = i42, this.M = e42, this.options = o52, s52.length > 2 || s52[0] !== "" || s52[1] !== "" ? (this.H = Array(s52.length - 1).fill(A), this.strings = s52) : this.H = A;
  }
  get tagName() {
    return this.element.tagName;
  }
  I(t32, i42 = this, s52, e42) {
    const o52 = this.strings;
    let l42 = false;
    if (o52 === void 0)
      t32 = S2(this, t32, i42, 0), l42 = !d(t32) || t32 !== this.H && t32 !== w, l42 && (this.H = t32);
    else {
      const e52 = t32;
      let n52, h42;
      for (t32 = o52[0], n52 = 0; n52 < o52.length - 1; n52++)
        h42 = S2(this, e52[s52 + n52], i42, n52), h42 === w && (h42 = this.H[n52]), l42 || (l42 = !d(h42) || h42 !== this.H[n52]), h42 === A ? t32 = A : t32 !== A && (t32 += (h42 != null ? h42 : "") + o52[n52 + 1]), this.H[n52] = h42;
    }
    l42 && !e42 && this.W(t32);
  }
  W(t32) {
    t32 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t32 != null ? t32 : "");
  }
};
var I = class extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  W(t32) {
    this.element[this.name] = t32 === A ? void 0 : t32;
  }
};
var L = class extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  W(t32) {
    t32 && t32 !== A ? this.element.setAttribute(this.name, "") : this.element.removeAttribute(this.name);
  }
};
var R = class extends H {
  constructor() {
    super(...arguments), this.type = 5;
  }
  I(t32, i42 = this) {
    var s52;
    if ((t32 = (s52 = S2(this, t32, i42, 0)) !== null && s52 !== void 0 ? s52 : A) === w)
      return;
    const e42 = this.H, o52 = t32 === A && e42 !== A || t32.capture !== e42.capture || t32.once !== e42.once || t32.passive !== e42.passive, l42 = t32 !== A && (e42 === A || o52);
    o52 && this.element.removeEventListener(this.name, this, e42), l42 && this.element.addEventListener(this.name, this, t32), this.H = t32;
  }
  handleEvent(t32) {
    var i42, s52;
    typeof this.H == "function" ? this.H.call((s52 = (i42 = this.options) === null || i42 === void 0 ? void 0 : i42.host) !== null && s52 !== void 0 ? s52 : this.element, t32) : this.H.handleEvent(t32);
  }
};
var z = class {
  constructor(t32, i42, s52) {
    this.element = t32, this.type = 6, this.N = void 0, this.V = void 0, this.M = i42, this.options = s52;
  }
  I(t32) {
    S2(this, t32);
  }
};
(i2 = (t2 = globalThis).litHtmlPlatformSupport) === null || i2 === void 0 || i2.call(t2, N, C), ((s3 = (e3 = globalThis).litHtmlVersions) !== null && s3 !== void 0 ? s3 : e3.litHtmlVersions = []).push("2.0.0-rc.3");
var i3;
var l3;
var o4;
var s4;
var n4;
var a3;
((i3 = (a3 = globalThis).litElementVersions) !== null && i3 !== void 0 ? i3 : a3.litElementVersions = []).push("3.0.0-rc.2");
var h3 = class extends a {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this.\u03A6t = void 0;
  }
  createRenderRoot() {
    var t32, e42;
    const r42 = super.createRenderRoot();
    return (t32 = (e42 = this.renderOptions).renderBefore) !== null && t32 !== void 0 || (e42.renderBefore = r42.firstChild), r42;
  }
  update(t32) {
    const r42 = this.render();
    super.update(t32), this.\u03A6t = V(r42, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t32;
    super.connectedCallback(), (t32 = this.\u03A6t) === null || t32 === void 0 || t32.setConnected(true);
  }
  disconnectedCallback() {
    var t32;
    super.disconnectedCallback(), (t32 = this.\u03A6t) === null || t32 === void 0 || t32.setConnected(false);
  }
  render() {
    return w;
  }
};
h3.finalized = true, h3._$litElement$ = true, (o4 = (l3 = globalThis).litElementHydrateSupport) === null || o4 === void 0 || o4.call(l3, { LitElement: h3 }), (n4 = (s4 = globalThis).litElementPlatformSupport) === null || n4 === void 0 || n4.call(s4, { LitElement: h3 });
var PFElement = class extends h3 {
  static debugLog(preference = null) {
    if (preference !== null) {
      try {
        localStorage.pfeLog = !!preference;
      } catch (e42) {
        PFElement._debugLog = !!preference;
        return PFElement._debugLog;
      }
    }
    return localStorage.pfeLog === "true" || PFElement._debugLog;
  }
  static trackPerformance(preference = null) {
    if (preference !== null) {
      PFElement._trackPerformance = !!preference;
    }
    return PFElement._trackPerformance;
  }
  static log(...msgs) {
    if (PFElement.debugLog()) {
      console.log(...msgs);
    }
  }
  log(...msgs) {
    PFElement.log(`[${this.tag}${this.id ? `#${this.id}` : ""}]`, ...msgs);
  }
  static warn(...msgs) {
    console.warn(...msgs);
  }
  warn(...msgs) {
    PFElement.warn(`[${this.tag}${this.id ? `#${this.id}` : ``}]`, ...msgs);
  }
  static error(...msgs) {
    throw new Error([...msgs].join(" "));
  }
  error(...msgs) {
    PFElement.error(`[${this.tag}${this.id ? `#${this.id}` : ``}]`, ...msgs);
  }
  static get PfeTypes() {
    return {
      Container: "container",
      Content: "content",
      Combo: "combo"
    };
  }
  static get version() {
    return "{{version}}";
  }
  static get breakpoint() {
    return {
      xs: "0px",
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      "2xl": "1450px"
    };
  }
  static create(pfe) {
    window.customElements.define(pfe.tag, pfe);
    if (PFElement.trackPerformance()) {
      try {
        performance.mark(`${this._markId}-defined`);
      } catch (err) {
        this.log(`Performance marks are not supported by this browser.`);
      }
    }
  }
  constructor() {
    super();
    this.tag = "";
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("pfelement", "");
  }
};

// node_modules/@lit/reactive-element/css-tag.js
var t3 = window.ShadowRoot && (window.ShadyCSS === void 0 || window.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var e4 = Symbol();
var s5 = class {
  constructor(t6, s9) {
    if (s9 !== e4)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t6;
  }
  get styleSheet() {
    return t3 && this.t === void 0 && (this.t = new CSSStyleSheet(), this.t.replaceSync(this.cssText)), this.t;
  }
  toString() {
    return this.cssText;
  }
};
var n5 = new Map();
var o5 = (t6) => {
  let o10 = n5.get(t6);
  return o10 === void 0 && n5.set(t6, o10 = new s5(t6, e4)), o10;
};
var r4 = (t6) => o5(typeof t6 == "string" ? t6 : t6 + "");
var i = (t6, ...e8) => {
  const n10 = t6.length === 1 ? t6[0] : e8.reduce((e9, n11, o10) => e9 + ((t7) => {
    if (t7 instanceof s5)
      return t7.cssText;
    if (typeof t7 == "number")
      return t7;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t7 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n11) + t6[o10 + 1], t6[0]);
  return o5(n10);
};
var S3 = (e8, s9) => {
  t3 ? e8.adoptedStyleSheets = s9.map((t6) => t6 instanceof CSSStyleSheet ? t6 : t6.styleSheet) : s9.forEach((t6) => {
    const s10 = document.createElement("style");
    s10.textContent = t6.cssText, e8.appendChild(s10);
  });
};
var u3 = t3 ? (t6) => t6 : (t6) => t6 instanceof CSSStyleSheet ? ((t7) => {
  let e8 = "";
  for (const s9 of t7.cssRules)
    e8 += s9.cssText;
  return r4(e8);
})(t6) : t6;

// node_modules/@lit/reactive-element/reactive-element.js
var s6;
var e5;
var h4;
var r5;
var o6 = { toAttribute(t6, i6) {
  switch (i6) {
    case Boolean:
      t6 = t6 ? "" : null;
      break;
    case Object:
    case Array:
      t6 = t6 == null ? t6 : JSON.stringify(t6);
  }
  return t6;
}, fromAttribute(t6, i6) {
  let s9 = t6;
  switch (i6) {
    case Boolean:
      s9 = t6 !== null;
      break;
    case Number:
      s9 = t6 === null ? null : Number(t6);
      break;
    case Object:
    case Array:
      try {
        s9 = JSON.parse(t6);
      } catch (t7) {
        s9 = null;
      }
  }
  return s9;
} };
var n6 = (t6, i6) => i6 !== t6 && (i6 == i6 || t6 == t6);
var l4 = { attribute: true, type: String, converter: o6, reflect: false, hasChanged: n6 };
var a4 = class extends HTMLElement {
  constructor() {
    super(), this.\u03A0i = new Map(), this.\u03A0o = void 0, this.\u03A0l = void 0, this.isUpdatePending = false, this.hasUpdated = false, this.\u03A0h = null, this.u();
  }
  static addInitializer(t6) {
    var i6;
    (i6 = this.v) !== null && i6 !== void 0 || (this.v = []), this.v.push(t6);
  }
  static get observedAttributes() {
    this.finalize();
    const t6 = [];
    return this.elementProperties.forEach((i6, s9) => {
      const e8 = this.\u03A0p(s9, i6);
      e8 !== void 0 && (this.\u03A0m.set(e8, s9), t6.push(e8));
    }), t6;
  }
  static createProperty(t6, i6 = l4) {
    if (i6.state && (i6.attribute = false), this.finalize(), this.elementProperties.set(t6, i6), !i6.noAccessor && !this.prototype.hasOwnProperty(t6)) {
      const s9 = typeof t6 == "symbol" ? Symbol() : "__" + t6, e8 = this.getPropertyDescriptor(t6, s9, i6);
      e8 !== void 0 && Object.defineProperty(this.prototype, t6, e8);
    }
  }
  static getPropertyDescriptor(t6, i6, s9) {
    return { get() {
      return this[i6];
    }, set(e8) {
      const h7 = this[t6];
      this[i6] = e8, this.requestUpdate(t6, h7, s9);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t6) {
    return this.elementProperties.get(t6) || l4;
  }
  static finalize() {
    if (this.hasOwnProperty("finalized"))
      return false;
    this.finalized = true;
    const t6 = Object.getPrototypeOf(this);
    if (t6.finalize(), this.elementProperties = new Map(t6.elementProperties), this.\u03A0m = new Map(), this.hasOwnProperty("properties")) {
      const t7 = this.properties, i6 = [...Object.getOwnPropertyNames(t7), ...Object.getOwnPropertySymbols(t7)];
      for (const s9 of i6)
        this.createProperty(s9, t7[s9]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), true;
  }
  static finalizeStyles(i6) {
    const s9 = [];
    if (Array.isArray(i6)) {
      const e8 = new Set(i6.flat(1 / 0).reverse());
      for (const i7 of e8)
        s9.unshift(u3(i7));
    } else
      i6 !== void 0 && s9.push(u3(i6));
    return s9;
  }
  static \u03A0p(t6, i6) {
    const s9 = i6.attribute;
    return s9 === false ? void 0 : typeof s9 == "string" ? s9 : typeof t6 == "string" ? t6.toLowerCase() : void 0;
  }
  u() {
    var t6;
    this.\u03A0g = new Promise((t7) => this.enableUpdating = t7), this.L = new Map(), this.\u03A0_(), this.requestUpdate(), (t6 = this.constructor.v) === null || t6 === void 0 || t6.forEach((t7) => t7(this));
  }
  addController(t6) {
    var i6, s9;
    ((i6 = this.\u03A0U) !== null && i6 !== void 0 ? i6 : this.\u03A0U = []).push(t6), this.renderRoot !== void 0 && this.isConnected && ((s9 = t6.hostConnected) === null || s9 === void 0 || s9.call(t6));
  }
  removeController(t6) {
    var i6;
    (i6 = this.\u03A0U) === null || i6 === void 0 || i6.splice(this.\u03A0U.indexOf(t6) >>> 0, 1);
  }
  \u03A0_() {
    this.constructor.elementProperties.forEach((t6, i6) => {
      this.hasOwnProperty(i6) && (this.\u03A0i.set(i6, this[i6]), delete this[i6]);
    });
  }
  createRenderRoot() {
    var t6;
    const s9 = (t6 = this.shadowRoot) !== null && t6 !== void 0 ? t6 : this.attachShadow(this.constructor.shadowRootOptions);
    return S3(s9, this.constructor.elementStyles), s9;
  }
  connectedCallback() {
    var t6;
    this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (t6 = this.\u03A0U) === null || t6 === void 0 || t6.forEach((t7) => {
      var i6;
      return (i6 = t7.hostConnected) === null || i6 === void 0 ? void 0 : i6.call(t7);
    }), this.\u03A0l && (this.\u03A0l(), this.\u03A0o = this.\u03A0l = void 0);
  }
  enableUpdating(t6) {
  }
  disconnectedCallback() {
    var t6;
    (t6 = this.\u03A0U) === null || t6 === void 0 || t6.forEach((t7) => {
      var i6;
      return (i6 = t7.hostDisconnected) === null || i6 === void 0 ? void 0 : i6.call(t7);
    }), this.\u03A0o = new Promise((t7) => this.\u03A0l = t7);
  }
  attributeChangedCallback(t6, i6, s9) {
    this.K(t6, s9);
  }
  \u03A0j(t6, i6, s9 = l4) {
    var e8, h7;
    const r7 = this.constructor.\u03A0p(t6, s9);
    if (r7 !== void 0 && s9.reflect === true) {
      const n10 = ((h7 = (e8 = s9.converter) === null || e8 === void 0 ? void 0 : e8.toAttribute) !== null && h7 !== void 0 ? h7 : o6.toAttribute)(i6, s9.type);
      this.\u03A0h = t6, n10 == null ? this.removeAttribute(r7) : this.setAttribute(r7, n10), this.\u03A0h = null;
    }
  }
  K(t6, i6) {
    var s9, e8, h7;
    const r7 = this.constructor, n10 = r7.\u03A0m.get(t6);
    if (n10 !== void 0 && this.\u03A0h !== n10) {
      const t7 = r7.getPropertyOptions(n10), l7 = t7.converter, a7 = (h7 = (e8 = (s9 = l7) === null || s9 === void 0 ? void 0 : s9.fromAttribute) !== null && e8 !== void 0 ? e8 : typeof l7 == "function" ? l7 : null) !== null && h7 !== void 0 ? h7 : o6.fromAttribute;
      this.\u03A0h = n10, this[n10] = a7(i6, t7.type), this.\u03A0h = null;
    }
  }
  requestUpdate(t6, i6, s9) {
    let e8 = true;
    t6 !== void 0 && (((s9 = s9 || this.constructor.getPropertyOptions(t6)).hasChanged || n6)(this[t6], i6) ? (this.L.has(t6) || this.L.set(t6, i6), s9.reflect === true && this.\u03A0h !== t6 && (this.\u03A0k === void 0 && (this.\u03A0k = new Map()), this.\u03A0k.set(t6, s9))) : e8 = false), !this.isUpdatePending && e8 && (this.\u03A0g = this.\u03A0q());
  }
  async \u03A0q() {
    this.isUpdatePending = true;
    try {
      for (await this.\u03A0g; this.\u03A0o; )
        await this.\u03A0o;
    } catch (t7) {
      Promise.reject(t7);
    }
    const t6 = this.performUpdate();
    return t6 != null && await t6, !this.isUpdatePending;
  }
  performUpdate() {
    var t6;
    if (!this.isUpdatePending)
      return;
    this.hasUpdated, this.\u03A0i && (this.\u03A0i.forEach((t7, i7) => this[i7] = t7), this.\u03A0i = void 0);
    let i6 = false;
    const s9 = this.L;
    try {
      i6 = this.shouldUpdate(s9), i6 ? (this.willUpdate(s9), (t6 = this.\u03A0U) === null || t6 === void 0 || t6.forEach((t7) => {
        var i7;
        return (i7 = t7.hostUpdate) === null || i7 === void 0 ? void 0 : i7.call(t7);
      }), this.update(s9)) : this.\u03A0$();
    } catch (t7) {
      throw i6 = false, this.\u03A0$(), t7;
    }
    i6 && this.E(s9);
  }
  willUpdate(t6) {
  }
  E(t6) {
    var i6;
    (i6 = this.\u03A0U) === null || i6 === void 0 || i6.forEach((t7) => {
      var i7;
      return (i7 = t7.hostUpdated) === null || i7 === void 0 ? void 0 : i7.call(t7);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t6)), this.updated(t6);
  }
  \u03A0$() {
    this.L = new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this.\u03A0g;
  }
  shouldUpdate(t6) {
    return true;
  }
  update(t6) {
    this.\u03A0k !== void 0 && (this.\u03A0k.forEach((t7, i6) => this.\u03A0j(i6, this[i6], t7)), this.\u03A0k = void 0), this.\u03A0$();
  }
  updated(t6) {
  }
  firstUpdated(t6) {
  }
};
a4.finalized = true, a4.elementProperties = new Map(), a4.elementStyles = [], a4.shadowRootOptions = { mode: "open" }, (e5 = (s6 = globalThis).reactiveElementPlatformSupport) === null || e5 === void 0 || e5.call(s6, { ReactiveElement: a4 }), ((h4 = (r5 = globalThis).reactiveElementVersions) !== null && h4 !== void 0 ? h4 : r5.reactiveElementVersions = []).push("1.0.0-rc.2");

// node_modules/lit-html/lit-html.js
var t4;
var i4;
var s7;
var e6;
var o7 = globalThis.trustedTypes;
var l5 = o7 ? o7.createPolicy("lit-html", { createHTML: (t6) => t6 }) : void 0;
var n7 = `lit$${(Math.random() + "").slice(9)}$`;
var h5 = "?" + n7;
var r6 = `<${h5}>`;
var u4 = document;
var c2 = (t6 = "") => u4.createComment(t6);
var d2 = (t6) => t6 === null || typeof t6 != "object" && typeof t6 != "function";
var v2 = Array.isArray;
var a5 = (t6) => {
  var i6;
  return v2(t6) || typeof ((i6 = t6) === null || i6 === void 0 ? void 0 : i6[Symbol.iterator]) == "function";
};
var f2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var _2 = /-->/g;
var m2 = />/g;
var p2 = />|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g;
var $2 = /'/g;
var g2 = /"/g;
var y2 = /^(?:script|style|textarea)$/i;
var b2 = (t6) => (i6, ...s9) => ({ _$litType$: t6, strings: i6, values: s9 });
var T2 = b2(1);
var x2 = b2(2);
var w2 = Symbol.for("lit-noChange");
var A2 = Symbol.for("lit-nothing");
var P2 = new WeakMap();
var V2 = (t6, i6, s9) => {
  var e8, o10;
  const l7 = (e8 = s9 == null ? void 0 : s9.renderBefore) !== null && e8 !== void 0 ? e8 : i6;
  let n10 = l7._$litPart$;
  if (n10 === void 0) {
    const t7 = (o10 = s9 == null ? void 0 : s9.renderBefore) !== null && o10 !== void 0 ? o10 : null;
    l7._$litPart$ = n10 = new C2(i6.insertBefore(c2(), t7), t7, void 0, s9);
  }
  return n10.I(t6), n10;
};
var E2 = u4.createTreeWalker(u4, 129, null, false);
var M2 = (t6, i6) => {
  const s9 = t6.length - 1, e8 = [];
  let o10, h7 = i6 === 2 ? "<svg>" : "", u6 = f2;
  for (let i7 = 0; i7 < s9; i7++) {
    const s10 = t6[i7];
    let l7, c5, d3 = -1, v3 = 0;
    for (; v3 < s10.length && (u6.lastIndex = v3, c5 = u6.exec(s10), c5 !== null); )
      v3 = u6.lastIndex, u6 === f2 ? c5[1] === "!--" ? u6 = _2 : c5[1] !== void 0 ? u6 = m2 : c5[2] !== void 0 ? (y2.test(c5[2]) && (o10 = RegExp("</" + c5[2], "g")), u6 = p2) : c5[3] !== void 0 && (u6 = p2) : u6 === p2 ? c5[0] === ">" ? (u6 = o10 != null ? o10 : f2, d3 = -1) : c5[1] === void 0 ? d3 = -2 : (d3 = u6.lastIndex - c5[2].length, l7 = c5[1], u6 = c5[3] === void 0 ? p2 : c5[3] === '"' ? g2 : $2) : u6 === g2 || u6 === $2 ? u6 = p2 : u6 === _2 || u6 === m2 ? u6 = f2 : (u6 = p2, o10 = void 0);
    const a7 = u6 === p2 && t6[i7 + 1].startsWith("/>") ? " " : "";
    h7 += u6 === f2 ? s10 + r6 : d3 >= 0 ? (e8.push(l7), s10.slice(0, d3) + "$lit$" + s10.slice(d3) + n7 + a7) : s10 + n7 + (d3 === -2 ? (e8.push(void 0), i7) : a7);
  }
  const c4 = h7 + (t6[s9] || "<?>") + (i6 === 2 ? "</svg>" : "");
  return [l5 !== void 0 ? l5.createHTML(c4) : c4, e8];
};
var N2 = class {
  constructor({ strings: t6, _$litType$: i6 }, s9) {
    let e8;
    this.parts = [];
    let l7 = 0, r7 = 0;
    const u6 = t6.length - 1, d3 = this.parts, [v3, a7] = M2(t6, i6);
    if (this.el = N2.createElement(v3, s9), E2.currentNode = this.el.content, i6 === 2) {
      const t7 = this.el.content, i7 = t7.firstChild;
      i7.remove(), t7.append(...i7.childNodes);
    }
    for (; (e8 = E2.nextNode()) !== null && d3.length < u6; ) {
      if (e8.nodeType === 1) {
        if (e8.hasAttributes()) {
          const t7 = [];
          for (const i7 of e8.getAttributeNames())
            if (i7.endsWith("$lit$") || i7.startsWith(n7)) {
              const s10 = a7[r7++];
              if (t7.push(i7), s10 !== void 0) {
                const t8 = e8.getAttribute(s10.toLowerCase() + "$lit$").split(n7), i8 = /([.?@])?(.*)/.exec(s10);
                d3.push({ type: 1, index: l7, name: i8[2], strings: t8, ctor: i8[1] === "." ? I2 : i8[1] === "?" ? L2 : i8[1] === "@" ? R2 : H2 });
              } else
                d3.push({ type: 6, index: l7 });
            }
          for (const i7 of t7)
            e8.removeAttribute(i7);
        }
        if (y2.test(e8.tagName)) {
          const t7 = e8.textContent.split(n7), i7 = t7.length - 1;
          if (i7 > 0) {
            e8.textContent = o7 ? o7.emptyScript : "";
            for (let s10 = 0; s10 < i7; s10++)
              e8.append(t7[s10], c2()), E2.nextNode(), d3.push({ type: 2, index: ++l7 });
            e8.append(t7[i7], c2());
          }
        }
      } else if (e8.nodeType === 8)
        if (e8.data === h5)
          d3.push({ type: 2, index: l7 });
        else {
          let t7 = -1;
          for (; (t7 = e8.data.indexOf(n7, t7 + 1)) !== -1; )
            d3.push({ type: 7, index: l7 }), t7 += n7.length - 1;
        }
      l7++;
    }
  }
  static createElement(t6, i6) {
    const s9 = u4.createElement("template");
    return s9.innerHTML = t6, s9;
  }
};
function S4(t6, i6, s9 = t6, e8) {
  var o10, l7, n10, h7;
  if (i6 === w2)
    return i6;
  let r7 = e8 !== void 0 ? (o10 = s9.\u03A3i) === null || o10 === void 0 ? void 0 : o10[e8] : s9.\u03A3o;
  const u6 = d2(i6) ? void 0 : i6._$litDirective$;
  return (r7 == null ? void 0 : r7.constructor) !== u6 && ((l7 = r7 == null ? void 0 : r7.O) === null || l7 === void 0 || l7.call(r7, false), u6 === void 0 ? r7 = void 0 : (r7 = new u6(t6), r7.T(t6, s9, e8)), e8 !== void 0 ? ((n10 = (h7 = s9).\u03A3i) !== null && n10 !== void 0 ? n10 : h7.\u03A3i = [])[e8] = r7 : s9.\u03A3o = r7), r7 !== void 0 && (i6 = S4(t6, r7.S(t6, i6.values), r7, e8)), i6;
}
var k2 = class {
  constructor(t6, i6) {
    this.l = [], this.N = void 0, this.D = t6, this.M = i6;
  }
  u(t6) {
    var i6;
    const { el: { content: s9 }, parts: e8 } = this.D, o10 = ((i6 = t6 == null ? void 0 : t6.creationScope) !== null && i6 !== void 0 ? i6 : u4).importNode(s9, true);
    E2.currentNode = o10;
    let l7 = E2.nextNode(), n10 = 0, h7 = 0, r7 = e8[0];
    for (; r7 !== void 0; ) {
      if (n10 === r7.index) {
        let i7;
        r7.type === 2 ? i7 = new C2(l7, l7.nextSibling, this, t6) : r7.type === 1 ? i7 = new r7.ctor(l7, r7.name, r7.strings, this, t6) : r7.type === 6 && (i7 = new z2(l7, this, t6)), this.l.push(i7), r7 = e8[++h7];
      }
      n10 !== (r7 == null ? void 0 : r7.index) && (l7 = E2.nextNode(), n10++);
    }
    return o10;
  }
  v(t6) {
    let i6 = 0;
    for (const s9 of this.l)
      s9 !== void 0 && (s9.strings !== void 0 ? (s9.I(t6, s9, i6), i6 += s9.strings.length - 2) : s9.I(t6[i6])), i6++;
  }
};
var C2 = class {
  constructor(t6, i6, s9, e8) {
    this.type = 2, this.N = void 0, this.A = t6, this.B = i6, this.M = s9, this.options = e8;
  }
  setConnected(t6) {
    var i6;
    (i6 = this.P) === null || i6 === void 0 || i6.call(this, t6);
  }
  get parentNode() {
    return this.A.parentNode;
  }
  get startNode() {
    return this.A;
  }
  get endNode() {
    return this.B;
  }
  I(t6, i6 = this) {
    t6 = S4(this, t6, i6), d2(t6) ? t6 === A2 || t6 == null || t6 === "" ? (this.H !== A2 && this.R(), this.H = A2) : t6 !== this.H && t6 !== w2 && this.m(t6) : t6._$litType$ !== void 0 ? this._(t6) : t6.nodeType !== void 0 ? this.$(t6) : a5(t6) ? this.g(t6) : this.m(t6);
  }
  k(t6, i6 = this.B) {
    return this.A.parentNode.insertBefore(t6, i6);
  }
  $(t6) {
    this.H !== t6 && (this.R(), this.H = this.k(t6));
  }
  m(t6) {
    const i6 = this.A.nextSibling;
    i6 !== null && i6.nodeType === 3 && (this.B === null ? i6.nextSibling === null : i6 === this.B.previousSibling) ? i6.data = t6 : this.$(u4.createTextNode(t6)), this.H = t6;
  }
  _(t6) {
    var i6;
    const { values: s9, _$litType$: e8 } = t6, o10 = typeof e8 == "number" ? this.C(t6) : (e8.el === void 0 && (e8.el = N2.createElement(e8.h, this.options)), e8);
    if (((i6 = this.H) === null || i6 === void 0 ? void 0 : i6.D) === o10)
      this.H.v(s9);
    else {
      const t7 = new k2(o10, this), i7 = t7.u(this.options);
      t7.v(s9), this.$(i7), this.H = t7;
    }
  }
  C(t6) {
    let i6 = P2.get(t6.strings);
    return i6 === void 0 && P2.set(t6.strings, i6 = new N2(t6)), i6;
  }
  g(t6) {
    v2(this.H) || (this.H = [], this.R());
    const i6 = this.H;
    let s9, e8 = 0;
    for (const o10 of t6)
      e8 === i6.length ? i6.push(s9 = new C2(this.k(c2()), this.k(c2()), this, this.options)) : s9 = i6[e8], s9.I(o10), e8++;
    e8 < i6.length && (this.R(s9 && s9.B.nextSibling, e8), i6.length = e8);
  }
  R(t6 = this.A.nextSibling, i6) {
    var s9;
    for ((s9 = this.P) === null || s9 === void 0 || s9.call(this, false, true, i6); t6 && t6 !== this.B; ) {
      const i7 = t6.nextSibling;
      t6.remove(), t6 = i7;
    }
  }
};
var H2 = class {
  constructor(t6, i6, s9, e8, o10) {
    this.type = 1, this.H = A2, this.N = void 0, this.V = void 0, this.element = t6, this.name = i6, this.M = e8, this.options = o10, s9.length > 2 || s9[0] !== "" || s9[1] !== "" ? (this.H = Array(s9.length - 1).fill(A2), this.strings = s9) : this.H = A2;
  }
  get tagName() {
    return this.element.tagName;
  }
  I(t6, i6 = this, s9, e8) {
    const o10 = this.strings;
    let l7 = false;
    if (o10 === void 0)
      t6 = S4(this, t6, i6, 0), l7 = !d2(t6) || t6 !== this.H && t6 !== w2, l7 && (this.H = t6);
    else {
      const e9 = t6;
      let n10, h7;
      for (t6 = o10[0], n10 = 0; n10 < o10.length - 1; n10++)
        h7 = S4(this, e9[s9 + n10], i6, n10), h7 === w2 && (h7 = this.H[n10]), l7 || (l7 = !d2(h7) || h7 !== this.H[n10]), h7 === A2 ? t6 = A2 : t6 !== A2 && (t6 += (h7 != null ? h7 : "") + o10[n10 + 1]), this.H[n10] = h7;
    }
    l7 && !e8 && this.W(t6);
  }
  W(t6) {
    t6 === A2 ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t6 != null ? t6 : "");
  }
};
var I2 = class extends H2 {
  constructor() {
    super(...arguments), this.type = 3;
  }
  W(t6) {
    this.element[this.name] = t6 === A2 ? void 0 : t6;
  }
};
var L2 = class extends H2 {
  constructor() {
    super(...arguments), this.type = 4;
  }
  W(t6) {
    t6 && t6 !== A2 ? this.element.setAttribute(this.name, "") : this.element.removeAttribute(this.name);
  }
};
var R2 = class extends H2 {
  constructor() {
    super(...arguments), this.type = 5;
  }
  I(t6, i6 = this) {
    var s9;
    if ((t6 = (s9 = S4(this, t6, i6, 0)) !== null && s9 !== void 0 ? s9 : A2) === w2)
      return;
    const e8 = this.H, o10 = t6 === A2 && e8 !== A2 || t6.capture !== e8.capture || t6.once !== e8.once || t6.passive !== e8.passive, l7 = t6 !== A2 && (e8 === A2 || o10);
    o10 && this.element.removeEventListener(this.name, this, e8), l7 && this.element.addEventListener(this.name, this, t6), this.H = t6;
  }
  handleEvent(t6) {
    var i6, s9;
    typeof this.H == "function" ? this.H.call((s9 = (i6 = this.options) === null || i6 === void 0 ? void 0 : i6.host) !== null && s9 !== void 0 ? s9 : this.element, t6) : this.H.handleEvent(t6);
  }
};
var z2 = class {
  constructor(t6, i6, s9) {
    this.element = t6, this.type = 6, this.N = void 0, this.V = void 0, this.M = i6, this.options = s9;
  }
  I(t6) {
    S4(this, t6);
  }
};
(i4 = (t4 = globalThis).litHtmlPlatformSupport) === null || i4 === void 0 || i4.call(t4, N2, C2), ((s7 = (e6 = globalThis).litHtmlVersions) !== null && s7 !== void 0 ? s7 : e6.litHtmlVersions = []).push("2.0.0-rc.3");

// node_modules/lit-element/lit-element.js
var i5;
var l6;
var o8;
var s8;
var n8;
var a6;
((i5 = (a6 = globalThis).litElementVersions) !== null && i5 !== void 0 ? i5 : a6.litElementVersions = []).push("3.0.0-rc.2");
var h6 = class extends a4 {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this.\u03A6t = void 0;
  }
  createRenderRoot() {
    var t6, e8;
    const r7 = super.createRenderRoot();
    return (t6 = (e8 = this.renderOptions).renderBefore) !== null && t6 !== void 0 || (e8.renderBefore = r7.firstChild), r7;
  }
  update(t6) {
    const r7 = this.render();
    super.update(t6), this.\u03A6t = V2(r7, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t6;
    super.connectedCallback(), (t6 = this.\u03A6t) === null || t6 === void 0 || t6.setConnected(true);
  }
  disconnectedCallback() {
    var t6;
    super.disconnectedCallback(), (t6 = this.\u03A6t) === null || t6 === void 0 || t6.setConnected(false);
  }
  render() {
    return w2;
  }
};
h6.finalized = true, h6._$litElement$ = true, (o8 = (l6 = globalThis).litElementHydrateSupport) === null || o8 === void 0 || o8.call(l6, { LitElement: h6 }), (n8 = (s8 = globalThis).litElementPlatformSupport) === null || n8 === void 0 || n8.call(s8, { LitElement: h6 });

// node_modules/@lit/reactive-element/decorators/query-assigned-nodes.js
var t5 = Element.prototype;
var n9 = t5.msMatchesSelector || t5.webkitMatchesSelector;

// node_modules/lit-element/index.js
console.warn("The main 'lit-element' module entrypoint is deprecated. Please update your imports to use the 'lit' package: 'lit' and 'lit/decorators.ts' or import from 'lit-element/lit-element.ts'.");

// sass:/Users/kylebuchanan/Documents/development/patternfly-elements-lit/elements/pfe-card/src/pfe-card.scss
var pfe_card_default = i`
@media screen and (-ms-high-contrast: active), screen and (-ms-high-contrast: none) {
  :host([color=darker]), :host([color=darkest]), :host([color=base]), :host([color=lighter]), :host([color=lightest]), :host([color=accent]), :host([color=complement]) {
    /* IE10+ */
    background-color: #fff !important;
    color: #151515 !important;
  }
}
@media screen and (-ms-high-contrast: active), screen and (-ms-high-contrast: none) {
  :host {
    /* IE10+ */
    color: #151515 !important;
  }
}
:host {
  --context: var(--pfe-card--context, var(--pfe-theme--color--surface--base--context, light));
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  justify-items: flex-start;
  -webkit-align-self: stretch;
  -ms-flex-item-align: stretch;
  -ms-grid-row-align: stretch;
  align-self: stretch;
  padding: calc(1rem * 2) calc(1rem * 2) calc(1rem * 2) calc(1rem * 2);
  padding: var(--pfe-card--Padding, var(--pfe-card--PaddingTop, calc(var(--pfe-theme--container-spacer, 1rem) * 2)) var(--pfe-card--PaddingRight, calc(var(--pfe-theme--container-spacer, 1rem) * 2)) var(--pfe-card--PaddingBottom, calc(var(--pfe-theme--container-spacer, 1rem) * 2)) var(--pfe-card--PaddingLeft, calc(var(--pfe-theme--container-spacer, 1rem) * 2)));
  border: 0 solid #d2d2d2;
  border: var(--pfe-card--Border, var(--pfe-card--BorderWidth, 0) var(--pfe-card--BorderStyle, solid) var(--pfe-card--BorderColor, var(--pfe-theme--color--surface--border, #d2d2d2)));
  border-radius: 3px;
  border-radius: var(--pfe-card--BorderRadius, var(--pfe-theme--surface--border-radius, 3px));
  overflow: hidden;
  background-color: #f0f0f0;
  background-color: var(--pfe-card--BackgroundColor, var(--pfe-theme--color--surface--base, #f0f0f0));
  background-position: center center;
  background-position: var(--pfe-card--BackgroundPosition, center center);
  color: #3c3f42;
  color: var(--pfe-broadcasted--text, #3c3f42);
}

@media print {
  :host {
    background-color: white !important;
    background-image: none !important;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
  }
}
@media print {
  :host {
    border-radius: 3px;
    border: 1px solid #d2d2d2;
  }
}
@media screen and (-ms-high-contrast: active), screen and (-ms-high-contrast: none) {
  :host {
    /* IE10+ */
    background-color: #fff !important;
    background-color: var(--pfe-theme--color--surface--lightest, #fff) !important;
    color: #151515 !important;
    color: var(--pfe-theme--color--text, #151515) !important;
    background-image: none !important;
    border-radius: 3px;
    border: 1px solid #d2d2d2;
    padding: 1rem;
    padding: var(--pfe-theme--container-spacer, 1rem);
  }
}
:host([color=darker]) {
  --pfe-card--BackgroundColor: var(--pfe-theme--color--surface--darker, #3c3f42);
  --pfe-card--context: var(--pfe-theme--color--surface--darker--context, dark);
}

:host([color=darkest]) {
  --pfe-card--BackgroundColor: var(--pfe-theme--color--surface--darkest, #151515);
  --pfe-card--context: var(--pfe-theme--color--surface--darkest--context, dark);
}

:host([color=base]) {
  --pfe-card--BackgroundColor: var(--pfe-theme--color--surface--base, #f0f0f0);
  --pfe-card--context: var(--pfe-theme--color--surface--base--context, light);
}

:host([color=lighter]) {
  --pfe-card--BackgroundColor: var(--pfe-theme--color--surface--lighter, #f0f0f0);
  --pfe-card--context: var(--pfe-theme--color--surface--lighter--context, light);
}

:host([color=lightest]) {
  --pfe-card--BackgroundColor: var(--pfe-theme--color--surface--lightest, #fff);
  --pfe-card--context: var(--pfe-theme--color--surface--lightest--context, light);
}

:host([color=accent]) {
  --pfe-card--BackgroundColor: var(--pfe-theme--color--surface--accent, #004080);
  --pfe-card--context: var(--pfe-theme--color--surface--accent--context, saturated);
}

:host([color=complement]) {
  --pfe-card--BackgroundColor: var(--pfe-theme--color--surface--complement, #002952);
  --pfe-card--context: var(--pfe-theme--color--surface--complement--context, saturated);
}

:host([on=dark]) {
  --pfe-broadcasted--text: var(--pfe-theme--color--text--on-dark, #fff);
  --pfe-broadcasted--link: var(--pfe-theme--color--link--on-dark, #73bcf7);
  --pfe-broadcasted--link--hover: var(--pfe-theme--color--link--hover--on-dark, #bee1f4);
  --pfe-broadcasted--link--focus: var(--pfe-theme--color--link--focus--on-dark, #bee1f4);
  --pfe-broadcasted--link--visited: var(--pfe-theme--color--link--visited--on-dark, #bee1f4);
  --pfe-broadcasted--link-decoration: var(--pfe-theme--link-decoration--on-dark, none);
  --pfe-broadcasted--link-decoration--hover: var(--pfe-theme--link-decoration--hover--on-dark, underline);
  --pfe-broadcasted--link-decoration--focus: var(--pfe-theme--link-decoration--focus--on-dark, underline);
  --pfe-broadcasted--link-decoration--visited: var(--pfe-theme--link-decoration--visited--on-dark, none);
}

:host([on=saturated]) {
  --pfe-broadcasted--text: var(--pfe-theme--color--text--on-saturated, #fff);
  --pfe-broadcasted--link: var(--pfe-theme--color--link--on-saturated, #fff);
  --pfe-broadcasted--link--hover: var(--pfe-theme--color--link--hover--on-saturated, #fafafa);
  --pfe-broadcasted--link--focus: var(--pfe-theme--color--link--focus--on-saturated, #fafafa);
  --pfe-broadcasted--link--visited: var(--pfe-theme--color--link--visited--on-saturated, #d2d2d2);
  --pfe-broadcasted--link-decoration: var(--pfe-theme--link-decoration--on-saturated, underline);
  --pfe-broadcasted--link-decoration--hover: var(--pfe-theme--link-decoration--hover--on-saturated, underline);
  --pfe-broadcasted--link-decoration--focus: var(--pfe-theme--link-decoration--focus--on-saturated, underline);
  --pfe-broadcasted--link-decoration--visited: var(--pfe-theme--link-decoration--visited--on-saturated, underline);
}

:host([on=light]) {
  --pfe-broadcasted--text: var(--pfe-theme--color--text, #151515);
  --pfe-broadcasted--link: var(--pfe-theme--color--link, #06c);
  --pfe-broadcasted--link--hover: var(--pfe-theme--color--link--hover, #004080);
  --pfe-broadcasted--link--focus: var(--pfe-theme--color--link--focus, #004080);
  --pfe-broadcasted--link--visited: var(--pfe-theme--color--link--visited, #6753ac);
  --pfe-broadcasted--link-decoration: var(--pfe-theme--link-decoration, none);
  --pfe-broadcasted--link-decoration--hover: var(--pfe-theme--link-decoration--hover, underline);
  --pfe-broadcasted--link-decoration--focus: var(--pfe-theme--link-decoration--focus, underline);
  --pfe-broadcasted--link-decoration--visited: var(--pfe-theme--link-decoration--visited, none);
}

:host([size=small]) {
  --pfe-card--PaddingTop: var(--pfe-theme--container-spacer, 1rem);
  --pfe-card--PaddingRight: var(--pfe-theme--container-spacer, 1rem);
  --pfe-card--PaddingBottom: var(--pfe-theme--container-spacer, 1rem);
  --pfe-card--PaddingLeft: var(--pfe-theme--container-spacer, 1rem);
}

:host([border]:not([border=false])) {
  --pfe-card--BorderWidth: 1px;
}

.pfe-card__header ::slotted([pfe-overflow~=top]),
.pfe-card__header ::slotted([overflow~=top]), .pfe-card__body ::slotted([pfe-overflow~=top]),
.pfe-card__body ::slotted([overflow~=top]), .pfe-card__footer ::slotted([pfe-overflow~=top]),
.pfe-card__footer ::slotted([overflow~=top]) {
  z-index: 1;
  margin-top: -2rem;
  margin-top: calc(-1 * calc(1rem * 2)) !important;
  margin-top: calc(-1 * var(--pfe-card--PaddingTop, calc(var(--pfe-theme--container-spacer, 1rem) * 2))) !important;
}

:host([has_header]) .pfe-card__header ::slotted([pfe-overflow~=top]), :host([has_header]) .pfe-card__header ::slotted([overflow~=top]),
:host([has_header]) .pfe-card__body ::slotted([pfe-overflow~=top]), :host([has_header]) .pfe-card__body ::slotted([overflow~=top]),
:host([has_header]) .pfe-card__footer ::slotted([pfe-overflow~=top]), :host([has_header]) .pfe-card__footer ::slotted([overflow~=top]) {
  padding-top: 1rem;
  padding-top: var(--pfe-card--spacing, var(--pfe-theme--container-spacer, 1rem));
}

.pfe-card__header ::slotted([pfe-overflow~=right]),
.pfe-card__header ::slotted([overflow~=right]), .pfe-card__body ::slotted([pfe-overflow~=right]),
.pfe-card__body ::slotted([overflow~=right]), .pfe-card__footer ::slotted([pfe-overflow~=right]),
.pfe-card__footer ::slotted([overflow~=right]) {
  margin-right: -2rem;
  margin-right: calc(-1 * calc(1rem * 2));
  margin-right: calc(-1 * var(--pfe-card--PaddingRight, calc(var(--pfe-theme--container-spacer, 1rem) * 2)));
}

.pfe-card__header ::slotted([pfe-overflow~=bottom]),
.pfe-card__header ::slotted([overflow~=bottom]), .pfe-card__body ::slotted([pfe-overflow~=bottom]),
.pfe-card__body ::slotted([overflow~=bottom]), .pfe-card__footer ::slotted([pfe-overflow~=bottom]),
.pfe-card__footer ::slotted([overflow~=bottom]) {
  margin-bottom: -2rem;
  margin-bottom: calc(-1 * calc(calc(1rem * 2) + 3px));
  margin-bottom: calc(-1 * calc(var(--pfe-card--PaddingBottom, calc(var(--pfe-theme--container-spacer, 1rem) * 2)) + var(--pfe-card--BorderRadius, var(--pfe-theme--surface--border-radius, 3px))));
  -webkit-align-self: flex-end;
  -ms-flex-item-align: end;
  align-self: flex-end;
}

.pfe-card__header ::slotted([pfe-overflow~=left]),
.pfe-card__header ::slotted([overflow~=left]), .pfe-card__body ::slotted([pfe-overflow~=left]),
.pfe-card__body ::slotted([overflow~=left]), .pfe-card__footer ::slotted([pfe-overflow~=left]),
.pfe-card__footer ::slotted([overflow~=left]) {
  margin-left: -2rem;
  margin-left: calc(-1 * calc(1rem * 2));
  margin-left: calc(-1 * var(--pfe-card--PaddingLeft, calc(var(--pfe-theme--container-spacer, 1rem) * 2)));
}

.pfe-card__header ::slotted(img), .pfe-card__body ::slotted(img), .pfe-card__footer ::slotted(img) {
  max-width: 100% !important;
  -webkit-align-self: flex-start;
  -ms-flex-item-align: start;
  align-self: flex-start;
  -o-object-fit: cover;
  object-fit: cover;
}

.pfe-card__header ::slotted(img:not[pfe-overflow]),
.pfe-card__header ::slotted(img:not[overflow]), .pfe-card__body ::slotted(img:not[pfe-overflow]),
.pfe-card__body ::slotted(img:not[overflow]), .pfe-card__footer ::slotted(img:not[pfe-overflow]),
.pfe-card__footer ::slotted(img:not[overflow]) {
  -webkit-align-self: flex-start;
  -ms-flex-item-align: start;
  align-self: flex-start;
}

.pfe-card__header ::slotted(img[pfe-overflow]),
.pfe-card__header ::slotted(img[overflow]), .pfe-card__body ::slotted(img[pfe-overflow]),
.pfe-card__body ::slotted(img[overflow]), .pfe-card__footer ::slotted(img[pfe-overflow]),
.pfe-card__footer ::slotted(img[overflow]) {
  max-width: unset !important;
}

.pfe-card__header ::slotted(img[pfe-overflow~=right]),
.pfe-card__header ::slotted(img[overflow~=right]), .pfe-card__body ::slotted(img[pfe-overflow~=right]),
.pfe-card__body ::slotted(img[overflow~=right]), .pfe-card__footer ::slotted(img[pfe-overflow~=right]),
.pfe-card__footer ::slotted(img[overflow~=right]) {
  width: calc(100% + 2rem) !important;
  width: calc(100% + calc(1rem * 2)) !important;
  width: calc(100% + var(--pfe-card--PaddingRight, calc(var(--pfe-theme--container-spacer, 1rem) * 2))) !important;
}

.pfe-card__header ::slotted(img[pfe-overflow~=left]),
.pfe-card__header ::slotted(img[overflow~=left]), .pfe-card__body ::slotted(img[pfe-overflow~=left]),
.pfe-card__body ::slotted(img[overflow~=left]), .pfe-card__footer ::slotted(img[pfe-overflow~=left]),
.pfe-card__footer ::slotted(img[overflow~=left]) {
  width: calc(100% + 2rem) !important;
  width: calc(100% + calc(1rem * 2)) !important;
  width: calc(100% + var(--pfe-card--PaddingLeft, calc(var(--pfe-theme--container-spacer, 1rem) * 2))) !important;
}

.pfe-card__header ::slotted(img[pfe-overflow~=right][pfe-overflow~=left]),
.pfe-card__header ::slotted(img[overflow~=right][overflow~=left]), .pfe-card__body ::slotted(img[pfe-overflow~=right][pfe-overflow~=left]),
.pfe-card__body ::slotted(img[overflow~=right][overflow~=left]), .pfe-card__footer ::slotted(img[pfe-overflow~=right][pfe-overflow~=left]),
.pfe-card__footer ::slotted(img[overflow~=right][overflow~=left]) {
  width: calc(100% + 4rem) !important;
  width: calc(100% + calc(1rem * 2) + calc(1rem * 2)) !important;
  width: calc(100% + var(--pfe-card--PaddingRight, calc(var(--pfe-theme--container-spacer, 1rem) * 2)) + var(--pfe-card--PaddingLeft, calc(var(--pfe-theme--container-spacer, 1rem) * 2))) !important;
}

.pfe-card__header {
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.09);
  background-color: var(--pfe-card__header--BackgroundColor, rgba(0, 0, 0, var(--pfe-theme--opacity, 0.09)));
  color: #3c3f42;
  color: var(--pfe-card__header--Color, var(--pfe-broadcasted--text, #3c3f42));
  margin-top: calc(calc(1rem * 2) * -1) !important;
  margin-top: calc(var(--pfe-card--PaddingTop, calc(var(--pfe-theme--container-spacer, 1rem) * 2)) * -1) !important;
  margin-right: calc(calc(1rem * 2) * -1);
  margin-right: calc(var(--pfe-card--PaddingRight, calc(var(--pfe-theme--container-spacer, 1rem) * 2)) * -1);
  margin-bottom: 1rem;
  margin-bottom: var(--pfe-card--spacing--vertical, var(--pfe-card--spacing, var(--pfe-theme--container-spacer, 1rem)));
  margin-left: calc(calc(1rem * 2) * -1);
  margin-left: calc(var(--pfe-card--PaddingLeft, calc(var(--pfe-theme--container-spacer, 1rem) * 2)) * -1);
  padding-top: 1rem;
  padding-top: var(--pfe-card--spacing--vertical, var(--pfe-card--spacing, var(--pfe-theme--container-spacer, 1rem)));
  padding-right: calc(1rem * 2);
  padding-right: var(--pfe-card--PaddingRight, calc(var(--pfe-theme--container-spacer, 1rem) * 2));
  padding-left: calc(1rem * 2);
  padding-left: var(--pfe-card--PaddingLeft, calc(var(--pfe-theme--container-spacer, 1rem) * 2));
  padding-bottom: 1rem;
  padding-bottom: var(--pfe-card--spacing--vertical, var(--pfe-card--spacing, var(--pfe-theme--container-spacer, 1rem)));
}

:host([on=dark]) .pfe-card__header {
  background-color: rgba(255, 255, 255, 0.09);
  background-color: var(--pfe-card__header--BackgroundColor--dark, rgba(255, 255, 255, var(--pfe-theme--opacity, 0.09)));
}

@media screen and (-ms-high-contrast: active), screen and (-ms-high-contrast: none) {
  .pfe-card__header {
    /* IE10+ */
    background-color: #fff !important;
    color: #151515 !important;
  }
}
:host(:not([has_body]):not([has_footer])) .pfe-card__header {
  margin-bottom: calc(1rem * 2);
  margin-bottom: var(--pfe-card--PaddingBottom, calc(var(--pfe-theme--container-spacer, 1rem) * 2));
}

.pfe-card__header ::slotted([pfe-overflow~=top]),
.pfe-card__header ::slotted([overflow~=top]) {
  --pfe-card__overflow--MarginTop: calc(var(--pfe-card--PaddingTop, calc(var(--pfe-theme--container-spacer, 1rem) * 2)) * -1);
}

:host(:not([has_header])) .pfe-card__header {
  display: none;
}

:host([has_body], [has_footer]) .pfe-card__header ::slotted([pfe-overflow~=bottom]),
:host([has_body], [has_footer]) .pfe-card__header ::slotted([overflow~=bottom]) {
  --pfe-card__overflow--MarginBottom: calc(var(--pfe-card--spacing--vertical, var(--pfe-card--spacing, var(--pfe-theme--container-spacer, 1rem))) * -1);
}

.pfe-card__header ::slotted([pfe-overflow~=bottom]),
.pfe-card__header ::slotted([overflow~=bottom]) {
  --pfe-card__overflow--MarginBottom: calc(var(--pfe-card--PaddingBottom, calc(var(--pfe-theme--container-spacer, 1rem) * 2)) * -1);
}

.pfe-card__header ::slotted(h1) {
  margin-bottom: 0;
}

.pfe-card__header ::slotted(h2) {
  margin-bottom: 0;
}

.pfe-card__header ::slotted(h3) {
  margin-bottom: 0;
}

.pfe-card__header ::slotted(h4) {
  margin-bottom: 0;
}

.pfe-card__header ::slotted(h5) {
  margin-bottom: 0;
}

.pfe-card__header ::slotted(h6) {
  margin-bottom: 0;
}

:host(:not([has_header])) .pfe-card__body ::slotted([pfe-overflow~=top]),
:host(:not([has_header])) .pfe-card__body ::slotted([overflow~=top]) {
  --pfe-card__overflow--MarginTop: calc(var(--pfe-card--PaddingTop, calc(var(--pfe-theme--container-spacer, 1rem) * 2)) * -1);
}

.pfe-card__body ::slotted([pfe-overflow~=top]),
.pfe-card__body ::slotted([overflow~=top]) {
  z-index: 1;
  --pfe-card__overflow--MarginTop: calc(var(--pfe-card--spacing--vertical, var(--pfe-card--spacing, var(--pfe-theme--container-spacer, 1rem))) * -1);
}

.pfe-card__body ::slotted([pfe-overflow~=bottom]),
.pfe-card__body ::slotted([overflow~=bottom]) {
  --pfe-card__overflow--MarginBottom: calc(var(--pfe-card--PaddingBottom, calc(var(--pfe-theme--container-spacer, 1rem) * 2)) * -1);
}

:host([has_footer]) .pfe-card__body ::slotted([pfe-overflow~=bottom]),
:host([has_footer]) .pfe-card__body ::slotted([overflow~=bottom]) {
  --pfe-card__overflow--MarginBottom: calc(var(--pfe-card--spacing--vertical, var(--pfe-card--spacing, var(--pfe-theme--container-spacer, 1rem))) * -1);
}

:host(:not([has_footer])) .pfe-card__body {
  margin-bottom: 0;
}

.pfe-card__footer {
  margin-top: auto;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
  flex-direction: var(--pfe-card__footer--Row, row);
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-flex-wrap: var(--pfe-card__footer--Wrap, wrap);
  -ms-flex-wrap: var(--pfe-card__footer--Wrap, wrap);
  flex-wrap: var(--pfe-card__footer--Wrap, wrap);
  -webkit-box-align: baseline;
  -webkit-align-items: baseline;
  -ms-flex-align: baseline;
  align-items: baseline;
  -webkit-box-align: var(--pfe-card__footer--AlignItems, baseline);
  -webkit-align-items: var(--pfe-card__footer--AlignItems, baseline);
  -ms-flex-align: var(--pfe-card__footer--AlignItems, baseline);
  align-items: var(--pfe-card__footer--AlignItems, baseline);
}

.pfe-card__footer ::slotted([pfe-overflow~=bottom]),
.pfe-card__footer ::slotted([overflow~=bottom]) {
  --pfe-card__overflow--MarginBottom: calc(var(--pfe-card--PaddingBottom, calc(var(--pfe-theme--container-spacer, 1rem) * 2)) * -1);
}

:host(:not([has_footer])) .pfe-card__footer {
  display: none;
}

.pfe-card__header, .pfe-card__body {
  margin-bottom: 1rem;
  margin-bottom: var(--pfe-card--spacing--vertical, var(--pfe-card--spacing, var(--pfe-theme--container-spacer, 1rem)));
}

.pfe-card__header ::slotted(p:first-child), .pfe-card__body ::slotted(p:first-child) {
  margin-top: 0;
}

.pfe-card__header ::slotted(h1:first-child), .pfe-card__body ::slotted(h1:first-child) {
  margin-top: 0;
}

.pfe-card__header ::slotted(h2:first-child), .pfe-card__body ::slotted(h2:first-child) {
  margin-top: 0;
}

.pfe-card__header ::slotted(h3:first-child), .pfe-card__body ::slotted(h3:first-child) {
  margin-top: 0;
}

.pfe-card__header ::slotted(h4:first-child), .pfe-card__body ::slotted(h4:first-child) {
  margin-top: 0;
}

.pfe-card__header ::slotted(h5:first-child), .pfe-card__body ::slotted(h5:first-child) {
  margin-top: 0;
}

.pfe-card__header ::slotted(h6:first-child), .pfe-card__body ::slotted(h6:first-child) {
  margin-top: 0;
}`;

// src/pfe-card.ts
var PfeCard = class extends PFElement {
  static get tag() {
    return "pfe-card";
  }
  static get styles() {
    return i`${pfe_card_default}`;
  }
  static get properties() {
    return {
      imgSrc: {
        type: String,
        attribute: "img-src"
      }
    };
  }
  constructor() {
    super();
    this.imgSrc = "";
  }
  render() {
    return T2`
      <div class="pfe-card__header">
        <slot name="pfe-card--header"></slot>
      </div>
      <div class="pfe-card__body">
        <slot></slot>
      </div>
      <div class="pfe-card__footer">
        <slot name="pfe-card--footer"></slot>
      </div>
    `;
  }
  updated(changedProperties) {
    if (changedProperties.has("imgSrc")) {
      this.style.backgroundImage = `url('${this.imgSrc}')`;
    }
  }
};
PFElement.create(PfeCard);
export {
  PfeCard
};
/*! For license information please see pfe-card.js.LEGAL.txt */
