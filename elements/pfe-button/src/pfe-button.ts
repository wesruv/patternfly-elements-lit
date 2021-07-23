import { PFElement } from "@patternfly/pfelement";
import { html, PropertyValues } from "lit";
import styles from "./pfe-button.scss";

// watching for changes on the _externalBtn so we can
// update text in our shadow DOM when the _externalBtn
// changes
const externalBtnObserverConfig = {
  characterData: true,
  attributes: true,
  subtree: true,
  childList: true,
};

// list of attributes that we DO NOT want to pass from
// the _externalBtn to our shadow DOM button. For example,
// the style attribute could ruin our encapsulated styles
// in the shadow DOM
const denylistAttributes = ["style"];

export class PfeButton extends PFElement {
  _externalBtnObserver: MutationObserver;
  _internalBtnContainer: HTMLSpanElement;
  
  static styles = styles;
  
  static get tag() {
    return "pfe-button";
  }

  static get events() {
    return {
      click: `${this.tag}:click`,
    };
  }

  static get properties() {
    return {
      variant: { type: String },
      disabled: { type: Boolean }
    }
  }

  get _externalBtn() {
    return this.querySelector("button");
  }

  constructor() {
    super();

    this._init = this._init.bind(this);
    this._clickHandler = this._clickHandler.bind(this);
    this._externalBtnClickHandler = this._externalBtnClickHandler.bind(this);
    this._externalBtnObserver = new MutationObserver(this._init);

    this.addEventListener("click", this._clickHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener("click", this._clickHandler);
    this._externalBtnObserver.disconnect();
  }

  render() {
    return html`
      <span id="internalBtn"></span>
    `;
  }

  firstUpdated() {
    this._internalBtnContainer = this.shadowRoot.querySelector("#internalBtn");

    if (this.hasLightDOM()) this._init();

    if (this._externalBtn) {
      this._externalBtnObserver.observe(this._externalBtn, externalBtnObserverConfig);
    }
  }

  updated(changed: PropertyValues<this>) {
    if (changed.has("disabled")) {
      if (this.disabled) {
        this._externalBtn.setAttribute("disabled", "");
      } else {
        this._externalBtn.removeAttribute("disabled");
      }
    }
  }

  _init() {
    if (!this._isValidLightDom()) {
      return;
    }

    if (!this._externalBtn) {
      return;
    }

    this._externalBtnObserver.disconnect();

    // If the external button has a disabled attribute
    if (this._externalBtn.hasAttribute("disabled")) {
      // Set it on the wrapper too
      this.setAttribute("disabled", "");
    }

    const clone = this._externalBtn.cloneNode(true);
    denylistAttributes.forEach((attribute) => {
      if (clone.hasAttribute) {
        clone.removeAttribute(attribute);
      }
    });

    this._internalBtnContainer.innerHTML = clone.outerHTML;
    this._externalBtnObserver.observe(this._externalBtn, externalBtnObserverConfig);

    this._externalBtn.addEventListener("click", this._externalBtnClickHandler);
  }

  _isValidLightDom() {
    if (!this.hasLightDOM()) {
      this.warn(`You must have a button in the light DOM`);
      return false;
    }
    if (this.children[0].tagName !== "BUTTON") {
      this.warn(`The only child in the light DOM must be a button tag`);

      return false;
    }

    return true;
  }

  // programmatically clicking the _externalBtn is what makes
  // this web component button work in a form as you'd expect
  _clickHandler() {
    this._externalBtn.click();
  }

  _externalBtnClickHandler() {
    this.emitEvent(PfeButton.events.click);
  }
}

PFElement.create(PfeButton);