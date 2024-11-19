import { tmp } from "./index";

import { fixture, assert } from "@open-wc/testing";
import { html } from "lit/static-html.js";

suite("index.ts", () => {
  test("tmp", () => {
    assert.isDefined(tmp);
  });
});
