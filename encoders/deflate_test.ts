import { Deflate } from "./deflate.ts";
import { assertEquals, describe, it } from "../_dev_deps.ts";
import { Format } from "./utils.ts";

describe("Deflate", () => {
  it("should return deflate", () => {
    assertEquals(Deflate.encoding, Format.Deflate);
  });
});
