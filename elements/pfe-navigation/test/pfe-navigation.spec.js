import { expect } from "@open-wc/testing/index-no-side-effects";
import { createFixture } from "../../../test/utils/create-fixture";
import { PfeElement } from "../dist/pfe-navigation.js";

const element = `
  <pfe-navigation></pfe-navigation>
`;

describe("<pfe-navigation>", () => {
  it("should upgrade", async () => {
    const el = await createFixture(element);
    expect(el).to.be.an.instanceOf(customElements.get(PfeNavigation.tag), "pfe-navigation should be an instance of PfeNavigation");
  });
});