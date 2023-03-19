import { isNoTransform, reCalcContentLength } from "./utils.ts";
import { assert, describe, equalsResponse, it } from "./_dev_deps.ts";

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

describe("reCalcContentLength", () => {
  it("should have new content-length if the response has content-length header", async () => {
    const response = await reCalcContentLength(
      new Response("abc", { headers: { "content-length": "100000" } }),
    );

    assert(
      equalsResponse(
        response,
        new Response("abc", { headers: { "content-length": "3" } }),
        true,
      ),
    );
  });

  it("should return same response if the response has been read", async () => {
    const initResponse = new Response("abc", {
      headers: { "content-length": "100000" },
    });

    await initResponse.text();

    assert(initResponse.bodyUsed);

    const response = await reCalcContentLength(initResponse);

    assert(initResponse === response);
  });

  it("should return same response if the response does not have content-length header", async () => {
    const initResponse = new Response("abc");
    const response = await reCalcContentLength(initResponse);

    assert(initResponse === response);
  });
});
