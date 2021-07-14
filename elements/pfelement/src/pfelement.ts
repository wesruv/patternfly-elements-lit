import { LitElement } from "lit";
// import { PfeCard } from "../../pfe-card";
// console.log(PfeCard)

export class PFElement extends LitElement {
  static _debugLog: boolean;
  static _trackPerformance: boolean;
  static _markId: string;
  tag: string;

  /**
   * A boolean value that indicates if the logging should be printed to the console; used for debugging.
   * For use in a JS file or script tag; can also be added in the constructor of a component during development.
   * @example PFElement.debugLog(true);
   * @tags debug
   */
  static debugLog(preference = null) {
    if (preference !== null) {
      // wrap localStorage references in a try/catch; merely referencing it can
      // throw errors in some locked down environments
      try {
        localStorage.pfeLog = !!preference;
      } catch (e) {
        // if localStorage fails, fall back to PFElement._debugLog
        PFElement._debugLog = !!preference;
        return PFElement._debugLog;
      }
    }
    // @TODO the reference to _debugLog is for backwards compatibiilty and will be removed in 2.0
    return localStorage.pfeLog === "true" || PFElement._debugLog;
  }

  /**
   * A boolean value that indicates if the performance should be tracked.
   * For use in a JS file or script tag; can also be added in the constructor of a component during development.
   * @example PFElement._trackPerformance = true;
   */
   static trackPerformance(preference = null) {
    if (preference !== null) {
      PFElement._trackPerformance = !!preference;
    }
    return PFElement._trackPerformance;
  }

  /**
   * A logging wrapper which checks the debugLog boolean and prints to the console if true.
   *
   * @example PFElement.log("Hello");
   */
   static log(...msgs: string[]) {
    if (PFElement.debugLog()) {
      console.log(...msgs);
    }
  }

  /**
   * Local logging that outputs the tag name as a prefix automatically
   *
   * @example this.log("Hello");
   */
  log(...msgs: string[]) {
    PFElement.log(`[${this.tag}${this.id ? `#${this.id}` : ""}]`, ...msgs);
  }

  /**
   * A console warning wrapper which formats your output with useful debugging information.
   *
   * @example PFElement.warn("Hello");
   */
  static warn(...msgs: string[]) {
    console.warn(...msgs);
  }

  /**
   * Local warning wrapper that outputs the tag name as a prefix automatically.
   * For use inside a component's function.
   * @example this.warn("Hello");
   */
  warn(...msgs: string[]) {
    PFElement.warn(`[${this.tag}${this.id ? `#${this.id}` : ``}]`, ...msgs);
  }

  /**
   * A console error wrapper which formats your output with useful debugging information.
   * For use inside a component's function.
   * @example PFElement.error("Hello");
   */
  static error(...msgs: string[]) {
    throw new Error([...msgs].join(" "));
  }

  /**
   * Local error wrapper that outputs the tag name as a prefix automatically.
   * For use inside a component's function.
   * @example this.error("Hello");
   */
  error(...msgs: string[]) {
    PFElement.error(`[${this.tag}${this.id ? `#${this.id}` : ``}]`, ...msgs);
  }

  /**
   * A global definition of component types (a general way of defining the purpose of a
   * component and how it is put together).
   */
  static get PfeTypes() {
    return {
      Container: "container",
      Content: "content",
      Combo: "combo",
    };
  }

  /**
   * The current version of a component; set by the compiler using the package.json data.
   */
  static get version() {
    return "{{version}}";
  }

  /**
   * Breakpoint object mapping human-readable size names to viewport sizes
   * To overwrite this at the component-level, include `static get breakpoint` in your component's class definition
   * @returns {Object} keys are t-shirt sizes and values map to screen-sizes (sourced from PF4)
   */
   static get breakpoint() {
    return {
      xs: "0px", // $pf-global--breakpoint--xs: 0 !default;
      sm: "576px", // $pf-global--breakpoint--sm: 576px !default;
      md: "768px", // $pf-global--breakpoint--md: 768px !default;
      lg: "992px", // $pf-global--breakpoint--lg: 992px !default;
      xl: "1200px", // $pf-global--breakpoint--xl: 1200px !default;
      "2xl": "1450px", // $pf-global--breakpoint--2xl: 1450px !default;
    };
  }

  static create(pfe: any) {
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
}