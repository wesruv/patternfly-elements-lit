import { expect, elementUpdated, triggerFocusFor, triggerBlurFor } from "@open-wc/testing/index-no-side-effects";
import { spy } from "sinon";
import { createFixture } from "../../../test/utils/create-fixture";
import { PfeCta } from "../dist/pfe-cta.js";

const element = `
  <pfe-cta>
    <a href="https://redhat.com">redhat.com</a>
  </pfe-cta>
`;

describe("<pfe-cta>", () => {
  it("should upgrade", async () => {
    const el = await createFixture(element);
    expect(el).to.be.an.instanceOf(customElements.get(PfeCta.tag), "pfe-card should be an instance of PfeCard");
  });

  it("should log a warning if there are no children in the light DOM", async () => {
    const spyConsole = spy(console, "warn");
    const el = await createFixture(`
      <pfe-cta>This is wrong</pfe-cta>
    `);

    expect(el).to.exist;
    expect(spyConsole.calledWith("[pfe-cta]", "The first child in the light DOM must be a supported call-to-action tag (<a>, <button>)")).to.be.true;
    spyConsole.restore();
  });

  it("should log a warning if the first child in the light DOM is not an anchor", async () => {
    const spyConsole = spy(console, "warn");
    const el = await createFixture(`
      <pfe-cta>
        <p>Something</p><a href="#">A link</a>
      </pfe-cta>
    `);

    expect(el).to.exist;
    expect(spyConsole.calledWith("[pfe-cta]", "The first child in the light DOM must be a supported call-to-action tag (<a>, <button>)")).to.be.true;
    spyConsole.restore();
  });

  // @TODO: reinstate after pfe-cta is converted to new format
  // it("should log a warning if the first child in the light DOM is a default style button", async () => {
  //   const spyConsole = spy(console, "warn");
  //   const el = await createFixture(`
  //     <pfe-cta>
  //       <button>A button</button>
  //     </pfe-cta>
  //   `);

  //   expect(el).to.exist;
  //   expect(spyConsole.calledWith("[pfe-cta]", "Button tag is not supported semantically by the default link styles")).to.be.true;
  //   spyConsole.restore();
  // });

  it("should properly initialize when the contents of the slot change", async () => {
    const el = await createFixture(element);
    expect(el.data.href).to.equal("https://redhat.com/");

    el.innerHTML = `<a href="https://access.redhat.com">Customer Portal</a>`;
    
    await elementUpdated(el);
    expect(el.data.href).to.equal("https://access.redhat.com/");
  });

  // @NOTE This test is failing silently. Need to fix it.
  // it("should register an event when clicked", async () => {
  //   const el = await createFixture(element);
  //   const spyClick = spy(el, "click");
  //   const event = new Event("click");

  //   el.dispatchEvent(event);

  //   setTimeout(() => {
  //     expect(spyClick.callCount).to.equal(1);
  //   }, 2000);
    
  //   spyClick.restore();
  // });

  // @NOTE This test is failing silently. Need to fix it.
  // it("should register an event when enter key is pressed", async () => {
  //   const el = await createFixture(element);
  //   const spyClick = spy(el, "click");
  //   const event = new KeyboardEvent("keyup", {
  //     key: "Enter"
  //   });

  //   el.dispatchEvent(event);

  //   setTimeout(function () {
  //     expect(spyClick.callCount).to.equal(1);
  //   }, 2000);

  //   spyClick.restore();
  // });

  it("should register an event when the click function is run", async () => {
    const el = await createFixture(element)
    const spyClick = spy(el, "click");

    el.click();

    expect(spyClick.callCount).to.equal(1);
    spyClick.restore();
  });

  it("should add toggle a focus-within class when cta receives focus and is blurred", async () => {
    const el = await createFixture(element);
    
    triggerFocusFor(el.cta);
    expect(el.classList.contains("focus-within")).to.be.true;

    triggerBlurFor(el.cta);
    expect(el.classList.contains("focus-within")).to.be.false;
  });
});