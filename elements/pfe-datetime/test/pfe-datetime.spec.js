import { expect } from "@open-wc/testing/index-no-side-effects";
import { createFixture } from "../../../test/utils/create-fixture";
import { PfeDatetime } from "../dist/pfe-datetime.js";

const element = `
  <pfe-datetime datetime="Mon Jan 2 15:04:05 EST 2006">
    Mon Jan 2 15:04:05 EST 2006
  </pfe-datetime>
`;

const simple = `
  <pfe-datetime id="simple" datetime="Mon Jan 2 15:04:05 EST 2006">
    Mon Jan 2 15:04:05 EST 2006
  </pfe-datetime>
`;

const justdate = `
  <pfe-datetime
    id="justdate"
    datetime="Mon Jan 2 15:04:05 EST 2006"
    format="local"
    day="numeric"
    month="long"
    year="numeric"
    locale="en-US">
    Mon Jan 2 15:04:05 EST 2006
  </pfe-datetime>
`;

const withtime = `
  <pfe-datetime
    id="withtime"
    datetime="Mon Jan 2 15:04:05 EST 2006"
    format="local"
    weekday="long"
    month="short"
    day="2-digit"
    year="numeric"
    hour="2-digit"
    minute="2-digit"
    second="2-digit"
    locale="en-US">
    Mon Jan 2 15:04:05 EST 2006
  </pfe-datetime>
`;

const engbLocale = `
  <pfe-datetime
    id="engbLocale"
    datetime="Mon Jan 2 15:04:05 EST 2006"
    format="local"
    weekday="long"
    month="short"
    day="2-digit"
    year="numeric"
    hour="2-digit"
    minute="2-digit"
    second="2-digit"
    locale="en-GB">
    Mon Jan 2 15:04:05 EST 2006
  </pfe-datetime>
`;

const esLocale = `
  <pfe-datetime
    id="esLocale"
    datetime="Mon Jan 2 15:04:05 EST 2006"
    format="local"
    weekday="long"
    month="short"
    day="2-digit"
    year="numeric"
    locale="es">
    Mon Jan 2 15:04:05 EST 2006
  </pfe-datetime>
`;

const yearsago = `
  <pfe-datetime
    id="yearsago"
    format="relative"
    datetime="Mon Jan 2 15:04:05 EST 2006">
    Mon Jan 2 15:04:05 EST 2006
  </pfe-datetime>
`;

const realtime = `
  <pfe-datetime
    id="realtime"
    format="local"
    hour="2-digit"
    minute="2-digit"
    second="2-digit"
    locale="en-US">
    Mon Jan 2 15:04:05 EST 2006
  </pfe-datetime>
`;

const simpleUnixtime = `
  <pfe-datetime
    id="simpleUnixtime"
    timestamp="1136214245">
    Mon Jan 2 15:04:05 EST 2006
  </pfe-datetime>
`;

const withTimeZone = `
  <pfe-datetime
    id="withTimeZone"
    datetime="Mon Jan 2 15:04:05 EST 2006"
    time-zone="UTC"
    time-zone-name="short">
    Mon Jan 2 15:04:05 EST 2006
  </pfe-datetime>
`;

describe("<pfe-datetime>", () => {
  it("should upgrade", async () => {
    const el = await createFixture(element);
    expect(el).to.be.an.instanceOf(customElements.get(PfeDatetime.tag), "pfe-datetime should be an instance of PfeDatetime");
  });

  it("should show a simple date format if just a datetime attribute is provided", async () => {
    const el = await createFixture(simple);
    const text = el.shadowRoot.querySelector("span").textContent;

    expect(text).to.equal("1/2/2006", "should just show a simple date");
  });

  it("should show a formatted date", async () => {
    const el = await createFixture(justdate);
    const text = el.shadowRoot.querySelector("span").textContent;

    expect(text).to.equal("January 2, 2006", "should show a formatted date");
  });

  it("should show a formatted date with time", async () => {
    const el = await createFixture(withtime);
    const text = el.shadowRoot.querySelector("span").textContent;
    const regex = /.*?, .*?, \d{4}, \d+:\d+:\d+ .{2}/;

    expect(regex.test(text), "should show a formatted date with time").to.be.true;
  });

  it("should show a relative time since the date", async () => {
    const el = await createFixture(yearsago);
    const text = el.shadowRoot.querySelector("span").textContent;

    expect(text, "should show a relative time since the date").to.match(/\d+ years ago/);
  });

  it("should convert a unix timestamp and display properly", async () => {
    const el = await createFixture(simpleUnixtime);
    const text = el.shadowRoot.querySelector("span").textContent;

    expect(text).to.equal("1/2/2006", "should show a relative time since the date");
  });

  it("should show a formatted date with time for a different locale", async () => {
    const el = await createFixture(esLocale);
    const text = el.shadowRoot.querySelector("span").textContent;

    expect(text).to.equal("lunes, 02 de ene de 2006", "should show a (locally) formatted date with time");
  });

  it("should show formatted date for a specified time zone", async () => {
    const el = await createFixture(withTimeZone);
    const text = el.shadowRoot.querySelector("span").textContent;

    expect(text).to.equal("1/2/2006, UTC", "should show a formatted date for a specified time zone");
  });
});