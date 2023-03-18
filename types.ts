// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

/** Encoding and encode mapping. */
export interface EncodingMap {
  [k: string]: Encode;
}

/** Stream encode API. */
export interface Encode {
  (stream: ReadableStream<Uint8Array>): BodyInit | Promise<BodyInit>;
}

/** Stream encoder API. */
export interface Encoder {
  /** Encoding format. */
  readonly encoding: string;

  /** Encode stream. */
  readonly encode: Encode;
}
