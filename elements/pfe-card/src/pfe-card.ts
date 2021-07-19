import {PFElement} from "@patternfly/pfelement";
import {html, PropertyValues} from "lit";
import styles from "./pfe-card.scss";

export class PfeCard extends PFElement {
    imgSrc: string | undefined;

    static styles = styles;

    static get tag() {
        return "pfe-card";
    }

    // static get properties() {
    //     return {
    //         imgSrc: {
    //             type: String,
    //             attribute: "img-src"
    //         }
    //     };
    // }

    static get slots() {
        return {
            header: {
                title: "Header",
                type: "array",
                namedSlot: true,
                maxItems: 3,
                items: {
                    $ref: "raw",
                },
            },
            body: {
                title: "Body",
                type: "array",
                namedSlot: false,
                items: {
                    $ref: "raw",
                },
            },
            footer: {
                title: "Footer",
                type: "array",
                namedSlot: true,
                maxItems: 3,
                items: {
                    oneOf: [
                        {
                            $ref: "pfe-cta",
                        },
                        {
                            $ref: "raw",
                        },
                    ],
                },
            },
        };
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
