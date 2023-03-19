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
import type { Encode, Encoder, EncodingMap } from "./types.ts";

const DefaultEncoders: Encoder[] = [Gzip, Deflate];

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
export function compression(encoders?: Encoder[] | EncodingMap): Middleware {
  const encodingMap = {
    ...fromEncoders(DefaultEncoders),
    ...Array.isArray(encoders) ? fromEncoders(encoders) : encoders,
  };
  const encodings = Object.keys(encodingMap);

  return async (request, next) => {
    const encoding = acceptsEncodings(request, ...encodings, IDENTITY);
    const response = await next(request);

    response.headers.append(
      ContentNegotiationHeader.Vary,
      ContentNegotiationHeader.AcceptEncoding,
    );

    if (!encoding || encoding === IDENTITY) return response;

    const encode = encodingMap[encoding];

    if (!encode) return response;

    return withContentEncoding(response, { encode, encoding });
  };
}

function flat(encoder: Encoder): [encoding: string, encode: Encode] {
  return [encoder.encoding, encoder.encode];
}

function fromEncoders(encoders: readonly Encoder[]): EncodingMap {
  return Object.fromEntries(encoders.map(flat));
}

const IDENTITY = "identity";
