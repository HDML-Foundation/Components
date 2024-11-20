/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { HdmlConnection } from "./HdmlConnection";
import { fixture, assert } from "@open-wc/testing";
import { html } from "lit/static-html.js";

suite("HdmlConnection element", () => {
  test("is defined", () => {
    const el = document.createElement("hdml-connection");
    assert.instanceOf(el, HdmlConnection);
  });

  test("renders without attributes", async () => {
    let counter = 0;
    let detail: undefined | HdmlConnection = undefined;

    document.addEventListener("hdom-changed", (evt) => {
      counter++;
      const event = <CustomEvent<HdmlConnection>>evt;
      detail = event.detail;
    });

    const element = await fixture(
      html`<hdml-connection></hdml-connection>`,
    );

    await assert.shadowDom.equal(element, "<slot></slot>");
    assert.equal(counter, 1);
    assert.instanceOf(detail, HdmlConnection);
  });

  test("renders with `name` attributes", async () => {
    let counter = 0;
    let detail: undefined | HdmlConnection = undefined;

    document.addEventListener("hdom-changed", (evt) => {
      counter++;
      const event = <CustomEvent<HdmlConnection>>evt;
      detail = event.detail;
    });

    const element = await fixture(
      html`<hdml-connection name="conn"></hdml-connection>`,
    );

    await assert.shadowDom.equal(element, "<slot></slot>");
    assert.equal(counter, 2);
    assert.instanceOf(detail, HdmlConnection);
  });
});
