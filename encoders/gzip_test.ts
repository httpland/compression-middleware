import { Gzip } from "./gzip.ts";
import { assertEquals, describe, it } from "../_dev_deps.ts";
import { Format } from "./utils.ts";

describe("Gzip", () => {
  it("should return gzip", () => {
    assertEquals(Gzip.encoding, Format.Gzip);
  });
});
