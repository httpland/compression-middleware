// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

export interface EncodingMap {
  [k: string]: EncodeCallback;
}

export interface EncodeCallback {
  (stream: ReadableStream<Uint8Array>): BodyInit | Promise<BodyInit>;
}

export interface Encoder {
  readonly encoding: string;
  readonly encode: EncodeCallback;
}
