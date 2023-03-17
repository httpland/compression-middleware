// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import {
  compressible,
  isNull,
  parseMediaType,
  RepresentationHeader,
} from "./deps.ts";
import type { Encoder } from "./types.ts";

export async function withContentEncoding(
  response: Response,
  context: Encoder,
): Promise<Response> {
  response = response.clone();

  const contentType = response.headers.get(RepresentationHeader.ContentType);

  if (
    isNull(contentType) ||
    response.headers.has(RepresentationHeader.ContentEncoding) ||
    !response.body ||
    response.bodyUsed
  ) return response;

  const [mediaType] = parseMediaType(contentType);
  const isCompressible = compressible(mediaType);

  if (!isCompressible) return response;

  const bodyInit = await context.encode(response.body);

  response.headers.set(RepresentationHeader.ContentEncoding, context.encoding);

  return new Response(bodyInit, response);
}
