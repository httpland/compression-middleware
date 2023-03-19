// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { Format } from "./utils.ts";
import type { Encoder } from "../types.ts";

function encodeGzip(
  stream: ReadableStream<Uint8Array>,
): ReadableStream<Uint8Array> {
  return stream.pipeThrough(new CompressionStream(Format.Gzip));
}

/** Encoder for `gzip` */
export const Gzip: Encoder = {
  encoding: Format.Gzip,
  encode: encodeGzip,
};
