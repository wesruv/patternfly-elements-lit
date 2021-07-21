import { expect, elementUpdated } from "@open-wc/testing/index-no-side-effects";
import { createFixture } from "../../../test/utils/create-fixture";
import { PfeCard } from "../dist/pfe-card.js";

// Returns the luminance value from rgb
const luminance = (r, g, b) => {
  return (0.2126*r/255 + 0.7152*g/255 + 0.0722*b/255);
};

// Converts a hex value to RGBA
const hexToRgb = hex => {
  const [, r, g, b] = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/.exec(hex);
    return [
        parseInt(r, 16),
        parseInt(g, 16),
        parseInt(b, 16)
      ];
};

// Gets the rgba value from an element
const getColor = (el, prop) => {
  const [, r, g, b] = getComputedStyle(el, null)[prop].match(/rgba?\((\d+),\s+(\d+),\s+(\d+).*\)/)
    .map(n => +n);
  return [r, g, b];
};

// Themes and their expected hex values
const colors = {
  default: "#f0f0f0",
  darker: "#3c3f42",
  darkest: "#151515",
  accent: "#004080",
  complement: "#002952",
  lightest: "#ffffff"
};

const slots = {
  header: {
    name: "pfe-card--header",
    class: "pfe-card__header",
    content: "Card 1"
  },
  body: {
    class: "pfe-card__body",
    content: "This is pfe-card."
  },
  footer: {
    name: "pfe-card--footer",
    class: "pfe-card__footer",
    content: "Text in footer"
  }
};

const overflow = {
  top: "",
  right: "",
  bottom: "",
  left: ""
};

const customProperties = {
  paddingTop: {
    variable: "--pfe-card--PaddingTop",
    css: "padding-top",
    default:  "32px",
    custom: "28px"
  },
  paddingRight: {
    variable: "--pfe-card--PaddingRight",
    css: "padding-right",
    default:  "32px",
    custom: "28px"
  },
  paddingBottom: {
    variable: "--pfe-card--PaddingBottom",
    css: "padding-bottom",
    default:  "32px",
    custom: "28px"
  },
  paddingLeft: {
    variable: "--pfe-card--PaddingLeft",
    css: "padding-left",
    default:  "32px",
    custom: "28px"
  },
  padding: {
    variable: "--pfe-card--Padding",
    css: "padding",
    default:  "32px",
    custom: "20px 10px"
  },
  borderRadius: {
    variable: "--pfe-card--BorderRadius",
    css: "border-radius",
    default:  "3px",
    custom: "50%"
  },
  border: {
    variable: "--pfe-card--Border",
    css: "border",
    default:  "0px solid rgb(210, 210, 210)",
    custom: "1px solid rgb(238, 238, 238)"
  },
  backgroundColor: {
    variable: "--pfe-card--BackgroundColor",
    css: "background-color",
    default:  "rgb(240, 240, 240)",
    custom: "rgb(255, 105, 180)"
  }
};

const element = `
  <pfe-card id="card1">
    <h2 slot="pfe-card--header">Card 1</h2>
    <p>This is pfe-card.</p>
    <div slot="pfe-card--footer">Text in footer</div>
  </pfe-card>
`

const cardWithJustBody = `
  <pfe-card>
    <p>Card</p>
  </pfe-card>
`;

const cardWithImage = `
  <pfe-card>
    <img src="https://placekitten.com/1000/500" />
  </pfe-card>
`;

const cardWithHeaderAndImage = `
  <pfe-card id="card3">
    <h2 slot="pfe-card--header">Card 3</h2>
    <img src="https://placekitten.com/1000/500" overflow="top right bottom left"/>
  </pfe-card>
`

describe("<pfe-card>", () => {
  it("should upgrade", async () => {
    const el = await createFixture(element);
    expect(el).to.be.an.instanceOf(customElements.get(PfeCard.tag), "pfe-card should be an instance of PfeCard");
  });

  it("should add or remove has_body, has_header, has_footer attributes if the slots exist", async () => {
    const el = await createFixture(element);
    expect(el.hasAttribute("has_header")).to.be.true;
    expect(el.hasAttribute("has_body")).to.be.true;
    expect(el.hasAttribute("has_footer")).to.be.true;

    el.querySelector('h2[slot="pfe-card--header"]').remove();
    el.querySelector('div[slot="pfe-card--footer"]').remove();

    await elementUpdated(el);

    expect(el.hasAttribute("has_header")).to.be.false;
    expect(el.hasAttribute("has_footer")).to.be.false;
  });

  it("should render a header and footer when content for those slots are added dynamicall", async () => {
    const el = await createFixture(cardWithJustBody);

    const header = document.createElement("h2");
    header.setAttribute("slot", "pfe-card--header");
    header.textContent = "Card Header";

    const footer = document.createElement("div");
    footer.setAttribute("slot", "pfe-card--footer");
    footer.textContent = "This is the footer";

    el.prepend(header);
    el.appendChild(footer);

    await elementUpdated(el);

    const cardHeaderSlot = el.shadowRoot.querySelector(`slot[name="pfe-card--header"]`);
    const cardFooterSlot = el.shadowRoot.querySelector(`slot[name="pfe-card--footer"]`);

    expect(cardHeaderSlot.assignedNodes().length).to.equal(1);
    expect(cardFooterSlot.assignedNodes().length).to.equal(1);
  });

  Object.entries(colors).forEach(set => {
    it(`should have a background color of ${set[1]} when color is ${set[0]}`, async () => {
      const el = await createFixture(element);

      // If this is not the default color, update the color attribute
      if(set[0] !== "default") {
        el.setAttribute("color", set[0]);
      }

      // Get the background color value
      const [r, g, b] = getColor(el, "background-color");

      // Test that the color is rendering as expected
      expect([r, g, b]).to.deep.equal(hexToRgb(set[1]));

      // Test that the color is working
      if(["dark", "darker", "darkest", "complement", "accent"].includes(set[0])) {
        expect(luminance(r, g, b)).to.be.lessThan(0.5);
      }
      else {
        expect(luminance(r, g, b)).to.be.greaterThan(0.5);
      }
    });
  });

  it("should have standard padding when size is not set", async () => {
    const el = await createFixture(element);
    expect(getComputedStyle(el, null)["padding"]).to.equal("32px");
  });

  it("should have reduced padding when size is small", async () => {
    const el = await createFixture(element);
    el.setAttribute("size", "small");
    expect(getComputedStyle(el, null)["padding"]).to.equal("16px");
  });

  it("should have a standard border when border is set", async () => {
    const el = await createFixture(element);
    el.setAttribute("border", "");

    expect(getColor(el, "border-left-color")).to.deep.equal(hexToRgb("#d2d2d2"));
    expect(Math.round(parseFloat(getComputedStyle(el, null)["border-left-width"]))).to.equal(1);
  });

  // Iterate over the slots object to test expected results
  Object.entries(slots).forEach(slot => {
    it(`${slot[0]} content is placed into correct slot`, async () => {
      const el = await createFixture(element);
      let selector = slot[0] !== "body" ? `[slot=${slot[1].name}]` : "p";
      
      expect(el.querySelector(selector).assignedSlot).to.equal(el.shadowRoot.querySelector(`.${slot[1].class} > *`));

      const content = el.shadowRoot
        .querySelector(`.${slot[1].class} > *`)
        .assignedNodes()
        .map(n => n.textContent)
        .join("")
        .trim();
      expect(content).to.equal(slot[1].content);
    });
  });

  // Iterate over possibilities for images
  Object.entries(overflow).forEach(direction => {
    it(`image should overflow to the ${direction[0]}`, async () => {
      const el = await createFixture(cardWithImage);
      const image = el.querySelector("img");
      const margin = direction[0] !== "bottom" ? "-32px" : "-35px";
      
      image.setAttribute("overflow", direction[0]);
      expect(getComputedStyle(image, null)[`margin-${direction[0]}`]).to.equal(margin);
    });
  });

  it("image should overflow all padding", async () => {
    const el = await createFixture(cardWithHeaderAndImage);
    let image = el.querySelector("img");
    
    expect(getComputedStyle(image, null)["margin-top"]).to.equal("-32px"); // this used to be -16px. need to check on it
    expect(getComputedStyle(image, null)["margin-right"]).to.equal("-32px");
    expect(getComputedStyle(image, null)["margin-bottom"]).to.equal("-35px");
    expect(getComputedStyle(image, null)["margin-left"]).to.equal("-32px");
  });

  // Iterate over the custom properties to test overrides work
  Object.entries(customProperties).forEach(set => {
    let property = set[1];

    it(`Test that ${property.variable} allows user customization`, async () => {
      const el = await createFixture(element);
      
      // Test default value
      expect(getComputedStyle(el, null)[property.css]).to.equal(property.default, `${property.css} should equal ${property.default}`);
      
      // Update the variable
      el.style.setProperty(property.variable, property.custom);
      
      // Test the update worked
      expect(getComputedStyle(el, null)[property.css]).to.equal(property.custom, `${property.css} should equal ${property.custom}`);
    });
  });
});