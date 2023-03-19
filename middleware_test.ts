import { compression } from "./middleware.ts";
import {
  assert,
  assertSpyCalls,
  describe,
  equalsResponse,
  it,
  spy,
} from "./_dev_deps.ts";

describe("compression", () => {
  it(
    "should not apply compress if the accept-encoding does not match",
    async () => {
      const middleware = compression();
      const request = new Request("test:", {
        headers: { "accept-encoding": "test" },
      });

      const response = await middleware(request, () => new Response("a"));

      assert(
        await equalsResponse(
          response,
          new Response("a", { headers: { vary: "accept-encoding" } }),
          true,
        ),
      );
      await response.text();
    },
  );

  it(
    "should apply first encoding if the accept-encoding header does not exist in request",
    async () => {
      const middleware = compression();
      const request = new Request("test:");

      const response = await middleware(request, () => new Response(""));

      assert(equalsResponse(
        response,
        new Response("", {
          headers: {
            "content-encoding": "gzip",
            vary: "accept-encoding",
          },
        }),
      ));

      await response.text();
    },
  );

  it("should return compressed response", async () => {
    const middleware = compression();
    const request = new Request("test:", {
      headers: { "accept-encoding": "gzip" },
    });

    const content = "a".repeat(1000);
    const response = await middleware(request, () => new Response(content));

    assert(equalsResponse(
      response,
      new Response("", {
        headers: {
          "content-encoding": "gzip",
          vary: "accept-encoding",
        },
      }),
    ));

    const text = await response.text();
    assert(text.length < content.length);
  });

  it("should apply encoding what is most highest priority", async () => {
    const middleware = compression();
    const request = new Request("test:", {
      headers: { "accept-encoding": "gzip;q=0.5, deflate;q=1.0" },
    });

    const response = await middleware(request, () => new Response(""));

    assert(equalsResponse(
      response,
      new Response("", {
        headers: {
          "content-encoding": "deflate",
          vary: "accept-encoding",
        },
      }),
    ));

    await response.text();
  });

  it("should override default encoding", async () => {
    const middleware = compression({ gzip: () => "def" });
    const request = new Request("test:", {
      headers: { "accept-encoding": "gzip" },
    });

    const response = await middleware(request, () => new Response("abc"));

    assert(
      await equalsResponse(
        response,
        new Response("def", {
          headers: {
            "content-encoding": "gzip",
            vary: "accept-encoding",
          },
        }),
        true,
      ),
    );
  });

  it("should skip if the accept-encoding is identity", async () => {
    const fn = spy(() => "");
    const middleware = compression({ identity: fn });
    const request = new Request("test:", {
      headers: { "accept-encoding": "identity" },
    });

    const response = await middleware(request, () => new Response("abc"));

    assertSpyCalls(fn, 0);

    assert(
      await equalsResponse(
        response,
        new Response("abc", {
          headers: { vary: "accept-encoding" },
        }),
        true,
      ),
    );
  });
});
