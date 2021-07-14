import { PFElement } from "../../pfelement";
import { html, css, PropertyValues } from "lit";

export class PfeBadge extends PFElement {
  number: number;
  threshold: number;

  static get tag() {
    return "pfe-badge";
  }

  static get properties() {
    return {
      number: { type: Number },
      threshold: { type: Number }
    }
  }

  static get styles() {
    return css`__css__`;
  }

  constructor() {
    super();
    this.number = 0;
    this.threshold = 0;
  }

  render() {
    return html`
      <span>${this.number}</span>
    `;
  }

  updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("number")) {
      this.textContent = this.number.toString();
    }
  }
}

PFElement.create(PfeBadge);