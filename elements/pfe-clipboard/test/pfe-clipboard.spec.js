import { expect } from "@open-wc/testing/index-no-side-effects";
import { createFixture } from "../../../test/utils/create-fixture";
import { PfeElement } from "../dist/pfe-clipboard.js";

const element = `
  <pfe-clipboard></pfe-clipboard>
`;

describe("<pfe-clipboard>", () => {
  it("should upgrade", async () => {
    const el = await createFixture(element);
    expect(el).to.be.an.instanceOf(customElements.get(PfeClipboard.tag), "pfe-clipboard should be an instance of PfeClipboard");
  });
});