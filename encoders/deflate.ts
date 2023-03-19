// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { Format } from "./utils.ts";
import type { Encoder } from "../types.ts";

function encodeDeflate(
  stream: ReadableStream<Uint8Array>,
): ReadableStream<Uint8Array> {
  return stream.pipeThrough(new CompressionStream(Format.Deflate));
}

/** Encoder for `deflate` */
export const Deflate: Encoder = {
  encoding: Format.Deflate,
  encode: encodeDeflate,
};
