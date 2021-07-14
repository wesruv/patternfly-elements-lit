import { PFElement } from "../../pfelement";
import { html, css } from "lit";
export class PfeBadge extends PFElement {
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
    return css`:host {
  display: inline-block;
  line-height: calc(1.5 * 0.75);
  line-height: calc(var(--pfe-theme--line-height, 1.5) * 0.75);
  text-align: center;
  text-rendering: optimizelegibility;
}

span {
  background-color: #f0f0f0;
  background-color: var(--pfe-badge--BackgroundColor, var(--pfe-theme--color--feedback--default--lightest, #f0f0f0));
  border-radius: calc(2px * 30);
  border-radius: var(--pfe-badge--BorderRadius, calc(var(--pfe-theme--ui--border-radius, 2px) * 30));
  color: #151515;
  color: var(--pfe-badge--Color, var(--pfe-theme--color--text, #151515));
  font-size: calc(1rem * 0.75);
  font-size: var(--pfe-badge--FontSize, calc(var(--pfe-theme--font-size, 1rem) * 0.75));
  font-weight: 600;
  font-weight: var(--pfe-badge--FontWeight, var(--pfe-theme--font-weight--semi-bold, 600));
  min-width: calc(1px * 2);
  min-width: var(--pfe-badge--MinWidth, calc(var(--pfe-theme--ui--border-width, 1px) * 2));
  padding-left: calc(1rem / 2);
  padding-left: var(--pfe-badge--PaddingLeft, calc(var(--pfe-theme--container-padding, 1rem) / 2));
  padding-right: calc(1rem / 2);
  padding-right: var(--pfe-badge--PaddingRight, calc(var(--pfe-theme--container-padding, 1rem) / 2));
}

:host([state=moderate]) span {
  --pfe-badge--BackgroundColor: var(--pfe-theme--color--feedback--moderate, #f0ab00);
  --pfe-badge--Color: var(--pfe-theme--color--text--on-dark, #fff);
}

:host([state=important]) span {
  --pfe-badge--BackgroundColor: var(--pfe-theme--color--feedback--important, #c9190b);
  --pfe-badge--Color: var(--pfe-theme--color--text--on-dark, #fff);
}

:host([state=critical]) span {
  --pfe-badge--BackgroundColor: var(--pfe-theme--color--feedback--critical, #a30000);
  --pfe-badge--Color: var(--pfe-theme--color--text--on-dark, #fff);
}

:host([state=success]) span {
  --pfe-badge--BackgroundColor: var(--pfe-theme--color--feedback--success, #3e8635);
  --pfe-badge--Color: var(--pfe-theme--color--text--on-dark, #fff);
}

:host([state=info]) span {
  --pfe-badge--BackgroundColor: var(--pfe-theme--color--feedback--info, #06c);
  --pfe-badge--Color: var(--pfe-theme--color--text--on-dark, #fff);
}

:host([hidden]) {
  display: none;
}`;
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
  updated(changedProperties) {
    if (changedProperties.has("number")) {
      this.textContent = this.number.toString();
    }
  }
}
PFElement.create(PfeBadge);
