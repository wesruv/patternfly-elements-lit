import { PFElement } from "@patternfly/pfelement";
import { html } from "lit";
import styles from "./pfe-cta.scss";

const supportedTags = ["a", "button"];

export class PfeCta extends PFElement {
  private _slot: HTMLSlotElement;
  priority: string;
  variant: string;
  color: string;
  cta: Element;
  data: { type: string; href: string; text: string; title: string; color: string; };

  static styles = styles;

  static get tag() {
    return "pfe-cta";
  }

  static get properties() {
    return {
      priority: { type: String },
      color: { type: String },
      variant: { type: String },
      data: { type: Object }
    }
  }

  get isDefault() {
    return this.hasAttribute("priority") ? false : true;
  }

  constructor() {
    super();

    this._init = this._init.bind(this);
    this._focusHandler = this._focusHandler.bind(this);
    this._blurHandler = this._blurHandler.bind(this);
    this._clickHandler = this._clickHandler.bind(this);
    this._keyupHandler = this._keyupHandler.bind(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    // Remove the slot change listeners
    this._slot.removeEventListener("slotchange", this._init);

    // Remove the focus state listeners
    if (this.cta) {
      this.cta.removeEventListener("focus", this._focusHandler);
      this.cta.removeEventListener("blur", this._blurHandler);
      this.cta.removeEventListener("click", this._clickHandler);
      this.cta.removeEventListener("keyup", this._keyupHandler);
    }
  }

  render() {
    return html`
      <span class="pfe-cta--wrapper">
        <slot></slot>${this.isDefault ? html`&#160;<svg class="pfe-cta--arrow" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 31.56 31.56" focusable="false" width="1em">
          <path d="M15.78 0l-3.1 3.1 10.5 10.49H0v4.38h23.18l-10.5 10.49 3.1 3.1 15.78-15.78L15.78 0z" /></svg>` : ``}
        <span class="pfe-cta--inner"></span>
      </span>
    `;
  }

  firstUpdated() {
    this._slot = this.shadowRoot.querySelector("slot");
    this._slot.addEventListener("slotchange", this._init);
    this._init();
  }

  _init() {
    let supportedTag = false;

    // If the first child does not exist or that child is not a supported tag
    if (this.firstElementChild) {
      supportedTags.forEach((tag) => {
        if (this.firstElementChild.tagName.toLowerCase() === tag) {
          supportedTag = true;
        }
      });
    }

    if (!this.firstElementChild || !supportedTag) {
      this.warn(`The first child in the light DOM must be a supported call-to-action tag (<a>, <button>)`);
    } else if (
      this.firstElementChild.tagName.toLowerCase() === "button" &&
      this.priority === null &&
      this.getAttribute("aria-disabled") !== "true"
    ) {
      this.warn(`Button tag is not supported semantically by the default link styles`);
    } else {
      // Capture the first child as the CTA element
      this.cta = this.firstElementChild;

      this.data = {
        href: this.cta.href,
        text: this.cta.text,
        title: this.cta.title,
        color: this.color,
        type: this.priority
      };

      // Set the value for the priority property
      // this.priority = this.isDefault ? "default" : this.getAttribute("priority");

      // Add the priority value to the data set for the event
      this.data.type = this.priority;

      // Append the variant to the data type
      if (this.variant) {
        this.data.type = `${this.data.type} ${this.variant}`;
      }

      // Override type if set to disabled
      if (this.getAttribute("aria-disabled")) {
        this.data.type = "disabled";
      }

      // Watch the light DOM link for focus and blur events
      this.cta.addEventListener("focus", this._focusHandler);
      this.cta.addEventListener("blur", this._blurHandler);

      // Attach the click listener
      this.cta.addEventListener("click", this._clickHandler);
      this.cta.addEventListener("keyup", this._keyupHandler);
    }
  }

  _focusHandler() {
    this.classList.add("focus-within");
  }

  _blurHandler() {
    this.classList.remove("focus-within");
  }

  _keyupHandler(event) {
    let key = event.key || event.keyCode;
    switch (key) {
      case "Enter":
      case 13:
        // this.click(event);
    }
  }

  _clickHandler(event) {
    
  }
}

PFElement.create(PfeCta);