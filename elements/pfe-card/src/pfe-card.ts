import { PFElement } from "../../pfelement/dist/pfelement";
import { html, css, PropertyValues } from "lit";

export class PfeCard extends PFElement {
  imgSrc: string;
  
  static get tag() {
    return "pfe-card";
  }
  
  static get styles() {
    return css`__css__`;
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
    return html`
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

  updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("imgSrc")) {
      this.style.backgroundImage = `url('${this.imgSrc}')`;
    }
  }
}

PFElement.create(PfeCard);