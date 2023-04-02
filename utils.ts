// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { RepresentationHeader } from "./deps.ts";

// TODO(miayuci): add strict parsing.

const ReNoTransform = /(?:^|,)\s*?no-transform\s*?(?:,|$)/;

export function isNoTransform(input: string): boolean {
  return ReNoTransform.test(input);
}

/** Return new `Response` if the response include `Content-Length` header and readable. */
export async function reCalcContentLength(
  response: Response,
): Promise<Response> {
  if (
    response.bodyUsed ||
    !response.headers.has(RepresentationHeader.ContentLength)
  ) return response;

  const length = await response
    .clone()
    .arrayBuffer()
    .then((buffer) => buffer.byteLength)
    .then(String);

  response.headers.set(RepresentationHeader.ContentLength, length);

  return response;
}
