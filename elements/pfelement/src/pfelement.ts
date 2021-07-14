import { LitElement } from "lit";

export class PFElement extends LitElement {
  static create(pfe: any) {
    window.customElements.define(pfe.tag, pfe);
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("pfelement", "");
    console.log("hey!");
  }
}