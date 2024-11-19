import { tmp } from "./index";
import { assert } from "@open-wc/testing";

suite("index.ts", () => {
  test("tmp", () => {
    assert.isDefined(tmp);
  });
});
