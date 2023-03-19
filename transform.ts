// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import {
  CachingHeader,
  compressible,
  isNull,
  parseMediaType,
  RepresentationHeader,
} from "./deps.ts";
import { isNoTransform, reCalcContentLength } from "./utils.ts";
import type { Encoder } from "./types.ts";

/** Response with `Content-Encoding` header. */
export async function withContentEncoding(
  response: Response,
  context: Encoder,
): Promise<Response> {
  const contentType = response.headers.get(RepresentationHeader.ContentType);
  const cacheControl = response.headers.get(CachingHeader.CacheControl);

  if (
    isNull(contentType) ||
    response.headers.has(RepresentationHeader.ContentEncoding) ||
    !response.body ||
    response.bodyUsed ||
    (!isNull(cacheControl) && isNoTransform(cacheControl))
  ) return response;

  const [mediaType] = parseMediaType(contentType);
  const isCompressible = compressible(mediaType);

  if (!isCompressible) return response;

  const bodyInit = await context.encode(response.body);
  const newResponse = await reCalcContentLength(
    new Response(bodyInit, response),
  );

  newResponse.headers.set(
    RepresentationHeader.ContentEncoding,
    context.encoding,
  );

  return newResponse;
}
