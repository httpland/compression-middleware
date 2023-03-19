import { withContentEncoding } from "./transform.ts";
import {
  assert,
  assertSpyCalls,
  describe,
  equalsResponse,
  it,
  spy,
} from "./_dev_deps.ts";

describe("withContentEncoding", () => {
  it("should apply encode", async () => {
    const encode = spy(() => "abc");
    const response = await withContentEncoding(new Response("test"), {
      encoding: "xxx",
      encode,
    });

    assertSpyCalls(encode, 1);

    assert(
      await equalsResponse(
        response,
        new Response("abc", { headers: { "content-encoding": "xxx" } }),
        true,
      ),
    );
  });

  it("should re-calculate content length if the response has content-length header", async () => {
    const encode = spy(() => "abc");

    const initResponse = new Response("abcdef", {
      headers: { "content-length": "6" },
    });

    const response = await withContentEncoding(initResponse, {
      encoding: "xxx",
      encode,
    });

    assertSpyCalls(encode, 1);
    assert(
      await equalsResponse(
        response,
        new Response("abc", {
          headers: { "content-length": "3", "content-encoding": "xxx" },
        }),
        true,
      ),
    );
  });

  it("should not apply if the response does not have content-type header", async () => {
    const encode = spy(() => "abc");

    const initResponse = new Response("test");
    initResponse.headers.delete("content-type");

    assert(!initResponse.headers.has("content-type"));

    const response = await withContentEncoding(initResponse, {
      encoding: "xxx",
      encode,
    });

    assertSpyCalls(encode, 0);
    assert(await equalsResponse(response, initResponse, true));
  });

  it("should not apply if the response has content-encoding header", async () => {
    const encode = spy(() => "abc");

    const initResponse = new Response("test", {
      headers: { "content-encoding": "" },
    });

    const response = await withContentEncoding(initResponse, {
      encoding: "xxx",
      encode,
    });

    assertSpyCalls(encode, 0);
    assert(await equalsResponse(response, initResponse, true));
  });

  it("should not apply if the response body does not exist", async () => {
    const encode = spy(() => "abc");

    const initResponse = new Response();

    assert(initResponse.body === null);

    const response = await withContentEncoding(initResponse, {
      encoding: "xxx",
      encode,
    });

    assertSpyCalls(encode, 0);
    assert(await equalsResponse(response, initResponse, true));
  });

  it("should not apply if the response body is not readable", async () => {
    const encode = spy(() => "abc");

    const initResponse = new Response("");

    await initResponse.text();

    assert(initResponse.bodyUsed);

    const response = await withContentEncoding(initResponse, {
      encoding: "xxx",
      encode,
    });

    assertSpyCalls(encode, 0);
    assert(equalsResponse(response, initResponse));
  });

  it("should not apply if the response is no-transform", async () => {
    const encode = spy(() => "abc");

    const initResponse = new Response("", {
      headers: { "cache-control": "no-transform" },
    });

    const response = await withContentEncoding(initResponse, {
      encoding: "xxx",
      encode,
    });

    assertSpyCalls(encode, 0);
    assert(equalsResponse(response, initResponse));
  });

  it("should not apply if the response body is not compressible", async () => {
    const encode = spy(() => "abc");

    const initResponse = new Response("", {
      headers: { "content-type": "image/jpeg" },
    });

    const response = await withContentEncoding(initResponse, {
      encoding: "xxx",
      encode,
    });

    assertSpyCalls(encode, 0);
    assert(equalsResponse(response, initResponse));
  });
});
