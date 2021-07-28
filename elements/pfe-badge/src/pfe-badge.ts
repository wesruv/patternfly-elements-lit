import { PFElement, html } from "@patternfly/pfelement";
import { PropertyValues } from "lit";
import styles from "./pfe-badge.scss";

export class PfeBadge extends PFElement {
  number: number = 0;
  threshold: number = 0;
  displayText: string = "";

  static get tag() {
    return "pfe-badge";
  }

  static styles = styles;

  static get properties() {
    return {
      number: {type: Number},
      threshold: {type: Number},
      displayText: {type: String}
    }
  }

  render() {
    return html`
      <span>${this.displayText}</span>
    `;
  }

  updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("number") || changedProperties.has("threshold")) {
      this.displayText = this.textContent = (this.threshold && this.threshold < this.number) ? `${this.threshold.toString()}+` : this.number.toString();
    }
  }
}

PFElement.create(PfeBadge);