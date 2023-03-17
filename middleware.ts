// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import {
  acceptsEncodings,
  ContentNegotiationHeader,
  type Middleware,
} from "./deps.ts";
import { withContentEncoding } from "./transform.ts";
import { Gzip } from "./encoders/gzip.ts";
import { Deflate } from "./encoders/deflate.ts";
import { DeflateRaw } from "./encoders/deflate_raw.ts";
import type { EncodeCallback, Encoder } from "./types.ts";

const DefaultEncoders: Encoder[] = [Gzip, Deflate, DeflateRaw];

/** Create HTTP content compression middleware.
 *
 * @example
 * ```ts
 * import { compression } from "https://deno.land/x/compression_middleware@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 *
 * const middleware = compression();
 * const request = new Request("test:", {
 *   headers: {
 *     "accept-encoding": "deflate;q=0.5, gzip;q=1.0, deflate-raw;q=0.3",
 *   },
 * });
 *
 * const response = await middleware(
 *   request,
 *   () => new Response("<body>"),
 * );
 *
 * assertEquals(await response.text(), "<gzip:body>");
 * assertEquals(response.headers.get("content-encoding"), "gzip");
 * ```
 */
export function compression(): Middleware {
  const encoders = Object.fromEntries(DefaultEncoders.map(entry));
  const encodings = Object.keys(encoders);

  return async (request, next) => {
    const encoding = acceptsEncodings(request, ...encodings, "identity");
    const response = await next(request);

    response.headers.append(
      ContentNegotiationHeader.Vary,
      ContentNegotiationHeader.AcceptEncoding,
    );

    if (!encoding) return response;

    const encode = encoders[encoding];

    if (!encode) return response;

    return withContentEncoding(response, { encode, encoding });
  };
}

function entry(encoder: Encoder): [encoding: string, encode: EncodeCallback] {
  return [encoder.encoding, encoder.encode];
}
