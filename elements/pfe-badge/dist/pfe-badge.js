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
    let l42, c3, d22 = -1, v22 = 0;
    for (; v22 < s62.length && (u32.lastIndex = v22, c3 = u32.exec(s62), c3 !== null); )
      v22 = u32.lastIndex, u32 === f ? c3[1] === "!--" ? u32 = _ : c3[1] !== void 0 ? u32 = m : c3[2] !== void 0 ? (y.test(c3[2]) && (o52 = RegExp("</" + c3[2], "g")), u32 = p) : c3[3] !== void 0 && (u32 = p) : u32 === p ? c3[0] === ">" ? (u32 = o52 != null ? o52 : f, d22 = -1) : c3[1] === void 0 ? d22 = -2 : (d22 = u32.lastIndex - c3[2].length, l42 = c3[1], u32 = c3[3] === void 0 ? p : c3[3] === '"' ? g : $) : u32 === g || u32 === $ ? u32 = p : u32 === _ || u32 === m ? u32 = f : (u32 = p, o52 = void 0);
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
                const t5 = e42.getAttribute(s62.toLowerCase() + "$lit$").split(n3), i6 = /([.?@])?(.*)/.exec(s62);
                d22.push({ type: 1, index: l42, name: i6[2], strings: t5, ctor: i6[1] === "." ? I : i6[1] === "?" ? L : i6[1] === "@" ? R : H });
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
  constructor(t5, s9) {
    if (s9 !== e4)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t5;
  }
  get styleSheet() {
    return t3 && this.t === void 0 && (this.t = new CSSStyleSheet(), this.t.replaceSync(this.cssText)), this.t;
  }
  toString() {
    return this.cssText;
  }
};
var n5 = new Map();
var o5 = (t5) => {
  let o9 = n5.get(t5);
  return o9 === void 0 && n5.set(t5, o9 = new s5(t5, e4)), o9;
};
var r4 = (t5) => o5(typeof t5 == "string" ? t5 : t5 + "");
var i = (t5, ...e7) => {
  const n9 = t5.length === 1 ? t5[0] : e7.reduce((e8, n10, o9) => e8 + ((t6) => {
    if (t6 instanceof s5)
      return t6.cssText;
    if (typeof t6 == "number")
      return t6;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t6 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n10) + t5[o9 + 1], t5[0]);
  return o5(n9);
};
var S3 = (e7, s9) => {
  t3 ? e7.adoptedStyleSheets = s9.map((t5) => t5 instanceof CSSStyleSheet ? t5 : t5.styleSheet) : s9.forEach((t5) => {
    const s10 = document.createElement("style");
    s10.textContent = t5.cssText, e7.appendChild(s10);
  });
};
var u3 = t3 ? (t5) => t5 : (t5) => t5 instanceof CSSStyleSheet ? ((t6) => {
  let e7 = "";
  for (const s9 of t6.cssRules)
    e7 += s9.cssText;
  return r4(e7);
})(t5) : t5;

// node_modules/@lit/reactive-element/reactive-element.js
var s6;
var e5;
var h4;
var r5;
var o6 = { toAttribute(t5, i6) {
  switch (i6) {
    case Boolean:
      t5 = t5 ? "" : null;
      break;
    case Object:
    case Array:
      t5 = t5 == null ? t5 : JSON.stringify(t5);
  }
  return t5;
}, fromAttribute(t5, i6) {
  let s9 = t5;
  switch (i6) {
    case Boolean:
      s9 = t5 !== null;
      break;
    case Number:
      s9 = t5 === null ? null : Number(t5);
      break;
    case Object:
    case Array:
      try {
        s9 = JSON.parse(t5);
      } catch (t6) {
        s9 = null;
      }
  }
  return s9;
} };
var n6 = (t5, i6) => i6 !== t5 && (i6 == i6 || t5 == t5);
var l4 = { attribute: true, type: String, converter: o6, reflect: false, hasChanged: n6 };
var a4 = class extends HTMLElement {
  constructor() {
    super(), this.\u03A0i = new Map(), this.\u03A0o = void 0, this.\u03A0l = void 0, this.isUpdatePending = false, this.hasUpdated = false, this.\u03A0h = null, this.u();
  }
  static addInitializer(t5) {
    var i6;
    (i6 = this.v) !== null && i6 !== void 0 || (this.v = []), this.v.push(t5);
  }
  static get observedAttributes() {
    this.finalize();
    const t5 = [];
    return this.elementProperties.forEach((i6, s9) => {
      const e7 = this.\u03A0p(s9, i6);
      e7 !== void 0 && (this.\u03A0m.set(e7, s9), t5.push(e7));
    }), t5;
  }
  static createProperty(t5, i6 = l4) {
    if (i6.state && (i6.attribute = false), this.finalize(), this.elementProperties.set(t5, i6), !i6.noAccessor && !this.prototype.hasOwnProperty(t5)) {
      const s9 = typeof t5 == "symbol" ? Symbol() : "__" + t5, e7 = this.getPropertyDescriptor(t5, s9, i6);
      e7 !== void 0 && Object.defineProperty(this.prototype, t5, e7);
    }
  }
  static getPropertyDescriptor(t5, i6, s9) {
    return { get() {
      return this[i6];
    }, set(e7) {
      const h7 = this[t5];
      this[i6] = e7, this.requestUpdate(t5, h7, s9);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t5) {
    return this.elementProperties.get(t5) || l4;
  }
  static finalize() {
    if (this.hasOwnProperty("finalized"))
      return false;
    this.finalized = true;
    const t5 = Object.getPrototypeOf(this);
    if (t5.finalize(), this.elementProperties = new Map(t5.elementProperties), this.\u03A0m = new Map(), this.hasOwnProperty("properties")) {
      const t6 = this.properties, i6 = [...Object.getOwnPropertyNames(t6), ...Object.getOwnPropertySymbols(t6)];
      for (const s9 of i6)
        this.createProperty(s9, t6[s9]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), true;
  }
  static finalizeStyles(i6) {
    const s9 = [];
    if (Array.isArray(i6)) {
      const e7 = new Set(i6.flat(1 / 0).reverse());
      for (const i7 of e7)
        s9.unshift(u3(i7));
    } else
      i6 !== void 0 && s9.push(u3(i6));
    return s9;
  }
  static \u03A0p(t5, i6) {
    const s9 = i6.attribute;
    return s9 === false ? void 0 : typeof s9 == "string" ? s9 : typeof t5 == "string" ? t5.toLowerCase() : void 0;
  }
  u() {
    var t5;
    this.\u03A0g = new Promise((t6) => this.enableUpdating = t6), this.L = new Map(), this.\u03A0_(), this.requestUpdate(), (t5 = this.constructor.v) === null || t5 === void 0 || t5.forEach((t6) => t6(this));
  }
  addController(t5) {
    var i6, s9;
    ((i6 = this.\u03A0U) !== null && i6 !== void 0 ? i6 : this.\u03A0U = []).push(t5), this.renderRoot !== void 0 && this.isConnected && ((s9 = t5.hostConnected) === null || s9 === void 0 || s9.call(t5));
  }
  removeController(t5) {
    var i6;
    (i6 = this.\u03A0U) === null || i6 === void 0 || i6.splice(this.\u03A0U.indexOf(t5) >>> 0, 1);
  }
  \u03A0_() {
    this.constructor.elementProperties.forEach((t5, i6) => {
      this.hasOwnProperty(i6) && (this.\u03A0i.set(i6, this[i6]), delete this[i6]);
    });
  }
  createRenderRoot() {
    var t5;
    const s9 = (t5 = this.shadowRoot) !== null && t5 !== void 0 ? t5 : this.attachShadow(this.constructor.shadowRootOptions);
    return S3(s9, this.constructor.elementStyles), s9;
  }
  connectedCallback() {
    var t5;
    this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (t5 = this.\u03A0U) === null || t5 === void 0 || t5.forEach((t6) => {
      var i6;
      return (i6 = t6.hostConnected) === null || i6 === void 0 ? void 0 : i6.call(t6);
    }), this.\u03A0l && (this.\u03A0l(), this.\u03A0o = this.\u03A0l = void 0);
  }
  enableUpdating(t5) {
  }
  disconnectedCallback() {
    var t5;
    (t5 = this.\u03A0U) === null || t5 === void 0 || t5.forEach((t6) => {
      var i6;
      return (i6 = t6.hostDisconnected) === null || i6 === void 0 ? void 0 : i6.call(t6);
    }), this.\u03A0o = new Promise((t6) => this.\u03A0l = t6);
  }
  attributeChangedCallback(t5, i6, s9) {
    this.K(t5, s9);
  }
  \u03A0j(t5, i6, s9 = l4) {
    var e7, h7;
    const r7 = this.constructor.\u03A0p(t5, s9);
    if (r7 !== void 0 && s9.reflect === true) {
      const n9 = ((h7 = (e7 = s9.converter) === null || e7 === void 0 ? void 0 : e7.toAttribute) !== null && h7 !== void 0 ? h7 : o6.toAttribute)(i6, s9.type);
      this.\u03A0h = t5, n9 == null ? this.removeAttribute(r7) : this.setAttribute(r7, n9), this.\u03A0h = null;
    }
  }
  K(t5, i6) {
    var s9, e7, h7;
    const r7 = this.constructor, n9 = r7.\u03A0m.get(t5);
    if (n9 !== void 0 && this.\u03A0h !== n9) {
      const t6 = r7.getPropertyOptions(n9), l7 = t6.converter, a7 = (h7 = (e7 = (s9 = l7) === null || s9 === void 0 ? void 0 : s9.fromAttribute) !== null && e7 !== void 0 ? e7 : typeof l7 == "function" ? l7 : null) !== null && h7 !== void 0 ? h7 : o6.fromAttribute;
      this.\u03A0h = n9, this[n9] = a7(i6, t6.type), this.\u03A0h = null;
    }
  }
  requestUpdate(t5, i6, s9) {
    let e7 = true;
    t5 !== void 0 && (((s9 = s9 || this.constructor.getPropertyOptions(t5)).hasChanged || n6)(this[t5], i6) ? (this.L.has(t5) || this.L.set(t5, i6), s9.reflect === true && this.\u03A0h !== t5 && (this.\u03A0k === void 0 && (this.\u03A0k = new Map()), this.\u03A0k.set(t5, s9))) : e7 = false), !this.isUpdatePending && e7 && (this.\u03A0g = this.\u03A0q());
  }
  async \u03A0q() {
    this.isUpdatePending = true;
    try {
      for (await this.\u03A0g; this.\u03A0o; )
        await this.\u03A0o;
    } catch (t6) {
      Promise.reject(t6);
    }
    const t5 = this.performUpdate();
    return t5 != null && await t5, !this.isUpdatePending;
  }
  performUpdate() {
    var t5;
    if (!this.isUpdatePending)
      return;
    this.hasUpdated, this.\u03A0i && (this.\u03A0i.forEach((t6, i7) => this[i7] = t6), this.\u03A0i = void 0);
    let i6 = false;
    const s9 = this.L;
    try {
      i6 = this.shouldUpdate(s9), i6 ? (this.willUpdate(s9), (t5 = this.\u03A0U) === null || t5 === void 0 || t5.forEach((t6) => {
        var i7;
        return (i7 = t6.hostUpdate) === null || i7 === void 0 ? void 0 : i7.call(t6);
      }), this.update(s9)) : this.\u03A0$();
    } catch (t6) {
      throw i6 = false, this.\u03A0$(), t6;
    }
    i6 && this.E(s9);
  }
  willUpdate(t5) {
  }
  E(t5) {
    var i6;
    (i6 = this.\u03A0U) === null || i6 === void 0 || i6.forEach((t6) => {
      var i7;
      return (i7 = t6.hostUpdated) === null || i7 === void 0 ? void 0 : i7.call(t6);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t5)), this.updated(t5);
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
  shouldUpdate(t5) {
    return true;
  }
  update(t5) {
    this.\u03A0k !== void 0 && (this.\u03A0k.forEach((t6, i6) => this.\u03A0j(i6, this[i6], t6)), this.\u03A0k = void 0), this.\u03A0$();
  }
  updated(t5) {
  }
  firstUpdated(t5) {
  }
};
a4.finalized = true, a4.elementProperties = new Map(), a4.elementStyles = [], a4.shadowRootOptions = { mode: "open" }, (e5 = (s6 = globalThis).reactiveElementPlatformSupport) === null || e5 === void 0 || e5.call(s6, { ReactiveElement: a4 }), ((h4 = (r5 = globalThis).reactiveElementVersions) !== null && h4 !== void 0 ? h4 : r5.reactiveElementVersions = []).push("1.0.0-rc.2");

// node_modules/lit-html/lit-html.js
var t4;
var i4;
var s7;
var e6;
var o7 = globalThis.trustedTypes;
var l5 = o7 ? o7.createPolicy("lit-html", { createHTML: (t5) => t5 }) : void 0;
var n7 = `lit$${(Math.random() + "").slice(9)}$`;
var h5 = "?" + n7;
var r6 = `<${h5}>`;
var u4 = document;
var c2 = (t5 = "") => u4.createComment(t5);
var d2 = (t5) => t5 === null || typeof t5 != "object" && typeof t5 != "function";
var v2 = Array.isArray;
var a5 = (t5) => {
  var i6;
  return v2(t5) || typeof ((i6 = t5) === null || i6 === void 0 ? void 0 : i6[Symbol.iterator]) == "function";
};
var f2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var _2 = /-->/g;
var m2 = />/g;
var p2 = />|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g;
var $2 = /'/g;
var g2 = /"/g;
var y2 = /^(?:script|style|textarea)$/i;
var b2 = (t5) => (i6, ...s9) => ({ _$litType$: t5, strings: i6, values: s9 });
var T2 = b2(1);
var x2 = b2(2);
var w2 = Symbol.for("lit-noChange");
var A2 = Symbol.for("lit-nothing");
var P2 = new WeakMap();
var V2 = (t5, i6, s9) => {
  var e7, o9;
  const l7 = (e7 = s9 == null ? void 0 : s9.renderBefore) !== null && e7 !== void 0 ? e7 : i6;
  let n9 = l7._$litPart$;
  if (n9 === void 0) {
    const t6 = (o9 = s9 == null ? void 0 : s9.renderBefore) !== null && o9 !== void 0 ? o9 : null;
    l7._$litPart$ = n9 = new C2(i6.insertBefore(c2(), t6), t6, void 0, s9);
  }
  return n9.I(t5), n9;
};
var E2 = u4.createTreeWalker(u4, 129, null, false);
var M2 = (t5, i6) => {
  const s9 = t5.length - 1, e7 = [];
  let o9, h7 = i6 === 2 ? "<svg>" : "", u5 = f2;
  for (let i7 = 0; i7 < s9; i7++) {
    const s10 = t5[i7];
    let l7, c4, d3 = -1, v3 = 0;
    for (; v3 < s10.length && (u5.lastIndex = v3, c4 = u5.exec(s10), c4 !== null); )
      v3 = u5.lastIndex, u5 === f2 ? c4[1] === "!--" ? u5 = _2 : c4[1] !== void 0 ? u5 = m2 : c4[2] !== void 0 ? (y2.test(c4[2]) && (o9 = RegExp("</" + c4[2], "g")), u5 = p2) : c4[3] !== void 0 && (u5 = p2) : u5 === p2 ? c4[0] === ">" ? (u5 = o9 != null ? o9 : f2, d3 = -1) : c4[1] === void 0 ? d3 = -2 : (d3 = u5.lastIndex - c4[2].length, l7 = c4[1], u5 = c4[3] === void 0 ? p2 : c4[3] === '"' ? g2 : $2) : u5 === g2 || u5 === $2 ? u5 = p2 : u5 === _2 || u5 === m2 ? u5 = f2 : (u5 = p2, o9 = void 0);
    const a7 = u5 === p2 && t5[i7 + 1].startsWith("/>") ? " " : "";
    h7 += u5 === f2 ? s10 + r6 : d3 >= 0 ? (e7.push(l7), s10.slice(0, d3) + "$lit$" + s10.slice(d3) + n7 + a7) : s10 + n7 + (d3 === -2 ? (e7.push(void 0), i7) : a7);
  }
  const c3 = h7 + (t5[s9] || "<?>") + (i6 === 2 ? "</svg>" : "");
  return [l5 !== void 0 ? l5.createHTML(c3) : c3, e7];
};
var N2 = class {
  constructor({ strings: t5, _$litType$: i6 }, s9) {
    let e7;
    this.parts = [];
    let l7 = 0, r7 = 0;
    const u5 = t5.length - 1, d3 = this.parts, [v3, a7] = M2(t5, i6);
    if (this.el = N2.createElement(v3, s9), E2.currentNode = this.el.content, i6 === 2) {
      const t6 = this.el.content, i7 = t6.firstChild;
      i7.remove(), t6.append(...i7.childNodes);
    }
    for (; (e7 = E2.nextNode()) !== null && d3.length < u5; ) {
      if (e7.nodeType === 1) {
        if (e7.hasAttributes()) {
          const t6 = [];
          for (const i7 of e7.getAttributeNames())
            if (i7.endsWith("$lit$") || i7.startsWith(n7)) {
              const s10 = a7[r7++];
              if (t6.push(i7), s10 !== void 0) {
                const t7 = e7.getAttribute(s10.toLowerCase() + "$lit$").split(n7), i8 = /([.?@])?(.*)/.exec(s10);
                d3.push({ type: 1, index: l7, name: i8[2], strings: t7, ctor: i8[1] === "." ? I2 : i8[1] === "?" ? L2 : i8[1] === "@" ? R2 : H2 });
              } else
                d3.push({ type: 6, index: l7 });
            }
          for (const i7 of t6)
            e7.removeAttribute(i7);
        }
        if (y2.test(e7.tagName)) {
          const t6 = e7.textContent.split(n7), i7 = t6.length - 1;
          if (i7 > 0) {
            e7.textContent = o7 ? o7.emptyScript : "";
            for (let s10 = 0; s10 < i7; s10++)
              e7.append(t6[s10], c2()), E2.nextNode(), d3.push({ type: 2, index: ++l7 });
            e7.append(t6[i7], c2());
          }
        }
      } else if (e7.nodeType === 8)
        if (e7.data === h5)
          d3.push({ type: 2, index: l7 });
        else {
          let t6 = -1;
          for (; (t6 = e7.data.indexOf(n7, t6 + 1)) !== -1; )
            d3.push({ type: 7, index: l7 }), t6 += n7.length - 1;
        }
      l7++;
    }
  }
  static createElement(t5, i6) {
    const s9 = u4.createElement("template");
    return s9.innerHTML = t5, s9;
  }
};
function S4(t5, i6, s9 = t5, e7) {
  var o9, l7, n9, h7;
  if (i6 === w2)
    return i6;
  let r7 = e7 !== void 0 ? (o9 = s9.\u03A3i) === null || o9 === void 0 ? void 0 : o9[e7] : s9.\u03A3o;
  const u5 = d2(i6) ? void 0 : i6._$litDirective$;
  return (r7 == null ? void 0 : r7.constructor) !== u5 && ((l7 = r7 == null ? void 0 : r7.O) === null || l7 === void 0 || l7.call(r7, false), u5 === void 0 ? r7 = void 0 : (r7 = new u5(t5), r7.T(t5, s9, e7)), e7 !== void 0 ? ((n9 = (h7 = s9).\u03A3i) !== null && n9 !== void 0 ? n9 : h7.\u03A3i = [])[e7] = r7 : s9.\u03A3o = r7), r7 !== void 0 && (i6 = S4(t5, r7.S(t5, i6.values), r7, e7)), i6;
}
var k2 = class {
  constructor(t5, i6) {
    this.l = [], this.N = void 0, this.D = t5, this.M = i6;
  }
  u(t5) {
    var i6;
    const { el: { content: s9 }, parts: e7 } = this.D, o9 = ((i6 = t5 == null ? void 0 : t5.creationScope) !== null && i6 !== void 0 ? i6 : u4).importNode(s9, true);
    E2.currentNode = o9;
    let l7 = E2.nextNode(), n9 = 0, h7 = 0, r7 = e7[0];
    for (; r7 !== void 0; ) {
      if (n9 === r7.index) {
        let i7;
        r7.type === 2 ? i7 = new C2(l7, l7.nextSibling, this, t5) : r7.type === 1 ? i7 = new r7.ctor(l7, r7.name, r7.strings, this, t5) : r7.type === 6 && (i7 = new z2(l7, this, t5)), this.l.push(i7), r7 = e7[++h7];
      }
      n9 !== (r7 == null ? void 0 : r7.index) && (l7 = E2.nextNode(), n9++);
    }
    return o9;
  }
  v(t5) {
    let i6 = 0;
    for (const s9 of this.l)
      s9 !== void 0 && (s9.strings !== void 0 ? (s9.I(t5, s9, i6), i6 += s9.strings.length - 2) : s9.I(t5[i6])), i6++;
  }
};
var C2 = class {
  constructor(t5, i6, s9, e7) {
    this.type = 2, this.N = void 0, this.A = t5, this.B = i6, this.M = s9, this.options = e7;
  }
  setConnected(t5) {
    var i6;
    (i6 = this.P) === null || i6 === void 0 || i6.call(this, t5);
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
  I(t5, i6 = this) {
    t5 = S4(this, t5, i6), d2(t5) ? t5 === A2 || t5 == null || t5 === "" ? (this.H !== A2 && this.R(), this.H = A2) : t5 !== this.H && t5 !== w2 && this.m(t5) : t5._$litType$ !== void 0 ? this._(t5) : t5.nodeType !== void 0 ? this.$(t5) : a5(t5) ? this.g(t5) : this.m(t5);
  }
  k(t5, i6 = this.B) {
    return this.A.parentNode.insertBefore(t5, i6);
  }
  $(t5) {
    this.H !== t5 && (this.R(), this.H = this.k(t5));
  }
  m(t5) {
    const i6 = this.A.nextSibling;
    i6 !== null && i6.nodeType === 3 && (this.B === null ? i6.nextSibling === null : i6 === this.B.previousSibling) ? i6.data = t5 : this.$(u4.createTextNode(t5)), this.H = t5;
  }
  _(t5) {
    var i6;
    const { values: s9, _$litType$: e7 } = t5, o9 = typeof e7 == "number" ? this.C(t5) : (e7.el === void 0 && (e7.el = N2.createElement(e7.h, this.options)), e7);
    if (((i6 = this.H) === null || i6 === void 0 ? void 0 : i6.D) === o9)
      this.H.v(s9);
    else {
      const t6 = new k2(o9, this), i7 = t6.u(this.options);
      t6.v(s9), this.$(i7), this.H = t6;
    }
  }
  C(t5) {
    let i6 = P2.get(t5.strings);
    return i6 === void 0 && P2.set(t5.strings, i6 = new N2(t5)), i6;
  }
  g(t5) {
    v2(this.H) || (this.H = [], this.R());
    const i6 = this.H;
    let s9, e7 = 0;
    for (const o9 of t5)
      e7 === i6.length ? i6.push(s9 = new C2(this.k(c2()), this.k(c2()), this, this.options)) : s9 = i6[e7], s9.I(o9), e7++;
    e7 < i6.length && (this.R(s9 && s9.B.nextSibling, e7), i6.length = e7);
  }
  R(t5 = this.A.nextSibling, i6) {
    var s9;
    for ((s9 = this.P) === null || s9 === void 0 || s9.call(this, false, true, i6); t5 && t5 !== this.B; ) {
      const i7 = t5.nextSibling;
      t5.remove(), t5 = i7;
    }
  }
};
var H2 = class {
  constructor(t5, i6, s9, e7, o9) {
    this.type = 1, this.H = A2, this.N = void 0, this.V = void 0, this.element = t5, this.name = i6, this.M = e7, this.options = o9, s9.length > 2 || s9[0] !== "" || s9[1] !== "" ? (this.H = Array(s9.length - 1).fill(A2), this.strings = s9) : this.H = A2;
  }
  get tagName() {
    return this.element.tagName;
  }
  I(t5, i6 = this, s9, e7) {
    const o9 = this.strings;
    let l7 = false;
    if (o9 === void 0)
      t5 = S4(this, t5, i6, 0), l7 = !d2(t5) || t5 !== this.H && t5 !== w2, l7 && (this.H = t5);
    else {
      const e8 = t5;
      let n9, h7;
      for (t5 = o9[0], n9 = 0; n9 < o9.length - 1; n9++)
        h7 = S4(this, e8[s9 + n9], i6, n9), h7 === w2 && (h7 = this.H[n9]), l7 || (l7 = !d2(h7) || h7 !== this.H[n9]), h7 === A2 ? t5 = A2 : t5 !== A2 && (t5 += (h7 != null ? h7 : "") + o9[n9 + 1]), this.H[n9] = h7;
    }
    l7 && !e7 && this.W(t5);
  }
  W(t5) {
    t5 === A2 ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t5 != null ? t5 : "");
  }
};
var I2 = class extends H2 {
  constructor() {
    super(...arguments), this.type = 3;
  }
  W(t5) {
    this.element[this.name] = t5 === A2 ? void 0 : t5;
  }
};
var L2 = class extends H2 {
  constructor() {
    super(...arguments), this.type = 4;
  }
  W(t5) {
    t5 && t5 !== A2 ? this.element.setAttribute(this.name, "") : this.element.removeAttribute(this.name);
  }
};
var R2 = class extends H2 {
  constructor() {
    super(...arguments), this.type = 5;
  }
  I(t5, i6 = this) {
    var s9;
    if ((t5 = (s9 = S4(this, t5, i6, 0)) !== null && s9 !== void 0 ? s9 : A2) === w2)
      return;
    const e7 = this.H, o9 = t5 === A2 && e7 !== A2 || t5.capture !== e7.capture || t5.once !== e7.once || t5.passive !== e7.passive, l7 = t5 !== A2 && (e7 === A2 || o9);
    o9 && this.element.removeEventListener(this.name, this, e7), l7 && this.element.addEventListener(this.name, this, t5), this.H = t5;
  }
  handleEvent(t5) {
    var i6, s9;
    typeof this.H == "function" ? this.H.call((s9 = (i6 = this.options) === null || i6 === void 0 ? void 0 : i6.host) !== null && s9 !== void 0 ? s9 : this.element, t5) : this.H.handleEvent(t5);
  }
};
var z2 = class {
  constructor(t5, i6, s9) {
    this.element = t5, this.type = 6, this.N = void 0, this.V = void 0, this.M = i6, this.options = s9;
  }
  I(t5) {
    S4(this, t5);
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
    var t5, e7;
    const r7 = super.createRenderRoot();
    return (t5 = (e7 = this.renderOptions).renderBefore) !== null && t5 !== void 0 || (e7.renderBefore = r7.firstChild), r7;
  }
  update(t5) {
    const r7 = this.render();
    super.update(t5), this.\u03A6t = V2(r7, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t5;
    super.connectedCallback(), (t5 = this.\u03A6t) === null || t5 === void 0 || t5.setConnected(true);
  }
  disconnectedCallback() {
    var t5;
    super.disconnectedCallback(), (t5 = this.\u03A6t) === null || t5 === void 0 || t5.setConnected(false);
  }
  render() {
    return w2;
  }
};
h6.finalized = true, h6._$litElement$ = true, (o8 = (l6 = globalThis).litElementHydrateSupport) === null || o8 === void 0 || o8.call(l6, { LitElement: h6 }), (n8 = (s8 = globalThis).litElementPlatformSupport) === null || n8 === void 0 || n8.call(s8, { LitElement: h6 });

// src/pfe-badge.ts
var PfeBadge = class extends PFElement {
  static get tag() {
    return "pfe-badge";
  }
  static get properties() {
    return {
      number: { type: Number },
      threshold: { type: Number }
    };
  }
  static get styles() {
    return i`__css__`;
  }
  constructor() {
    super();
    this.number = 0;
    this.threshold = 0;
  }
  render() {
    return T2`
      <span>${this.number}</span>
    `;
  }
  updated(changedProperties) {
    if (changedProperties.has("number")) {
      this.textContent = this.number.toString();
    }
  }
};
PFElement.create(PfeBadge);
export {
  PfeBadge
};
/*! For license information please see pfe-badge.js.LEGAL.txt */
