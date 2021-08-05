import { expect, oneEvent } from "@open-wc/testing/index-no-side-effects";
import { createFixture } from "../../../test/utils/create-fixture";
import { PfeAvatar } from "../dist/pfe-avatar.js";

const element = `
  <pfe-avatar name="foobar"></pfe-avatar>
`;

describe("<pfe-avatar>", () => {
  it("should upgrade", async () => {
    const el = await createFixture(element);
    expect(el).to.be.an.instanceOf(customElements.get(PfeAvatar.tag), "pfe-badge should be an instance of PfeAvatar");
  });

  it(`should default to pattern: "squares"`, async () => {
    const el = await createFixture(element);
    expect(el.pattern).to.equal("squares");
  });

  it("should load a user-provided avatar image", async () => {
    const el = await createFixture(element);
    const img = el.shadowRoot.querySelector("img");
    el.src = "elements/pfe-avatar/test/mwcz.jpg";

    await oneEvent(img, "load");
    expect(img.complete).to.be.true;
    expect(img.naturalWidth).to.be.above(0, "image has a natural resolution");
  });
});