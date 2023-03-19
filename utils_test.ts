import { isNoTransform } from "./utils.ts";
import { assert, describe, it } from "./_dev_deps.ts";

describe("isNoTransform", () => {
  it("should return true", () => {
    const table: string[] = [
      "no-transform",
      " no-transform",
      "no-transform ",
      " no-transform ",
      "abc, no-transform",
    ];

    table.forEach((input) => {
      assert(isNoTransform(input));
    });
  });

  it("should return false", () => {
    const table: string[] = [
      "",
      "abc",
      "notransform",
    ];

    table.forEach((input) => {
      assert(!isNoTransform(input));
    });
  });
});
