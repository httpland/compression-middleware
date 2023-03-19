# compression-middleware

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno)](https://deno.land/x/compression_middleware)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/compression_middleware/mod.ts)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/httpland/compression-middleware)](https://github.com/httpland/compression-middleware/releases)
[![codecov](https://codecov.io/github/httpland/compression-middleware/branch/main/graph/badge.svg)](https://codecov.io/gh/httpland/compression-middleware)
[![GitHub](https://img.shields.io/github/license/httpland/compression-middleware)](https://github.com/httpland/compression-middleware/blob/main/LICENSE)

[![test](https://github.com/httpland/compression-middleware/actions/workflows/test.yaml/badge.svg)](https://github.com/httpland/compression-middleware/actions/workflows/test.yaml)
[![NPM](https://nodei.co/npm/@httpland/compression-middleware.png?mini=true)](https://nodei.co/npm/@httpland/compression-middleware/)

HTTP compression middleware.

Compresses HTTP Content(body).

Compliant with
[RFC 9110, 8.4. Content-Encoding](https://www.rfc-editor.org/rfc/rfc9110.html#section-8.4)
and
[RFC 9110, 12.5.3. Accept-Encoding](https://www.rfc-editor.org/rfc/rfc9110.html#name-accept-encoding)
.

## Middleware

For a definition of Universal HTTP middleware, see the
[http-middleware](https://github.com/httpland/http-middleware) project.

## Usage

Middleware convert message body and adds the `Content-Encoding` header to the
response.

Also, safely add `Accept-Encoding` to the `vary` header in response.

```ts
import { compression } from "https://deno.land/x/compression_middleware@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const middleware = compression();
const request = new Request("test:", {
  headers: {
    "accept-encoding": "deflate;q=0.5, gzip;q=1.0",
  },
});

const response = await middleware(
  request,
  () => new Response("<body>"),
);

assertEquals(await response.text(), "<gzip:body>");
assertEquals(response.headers.get("content-encoding"), "gzip");
```

yield:

```http
Content-Encoding: <encoding>
Vary: accept-encoding
```

## Additional encoding

By default, middleware supports the following encodings:

- gzip
- deflate

You can add supported encoding.

There are two ways to add encodings:

- Encoding map
- Encoder list

In either style, the result is the same.

When encoding is added, a shallow merge is performed in favor of user-defined.

## Encoding map

Encoding map defines a map of encoding formats and
[encode functions](#encode-api) .

Example of adding `brotli` encoding:

```ts
import {
  compression,
  type Encode,
  type EncodingMap,
} from "https://deno.land/x/compression_middleware@$VERSION/mod.ts";

declare const encodeBr: Encode;
const encodingMap: EncodingMap = { br: encodeBr };

const middleware = compression(encodingMap);
```

## Encoder list

Encoder list defines a list of `Encoder`.

`Encoder` is a following structured object:

| Name     | Type                  | Description      |
| -------- | --------------------- | ---------------- |
| encoding | `string`              | Encoding format. |
| encode   | [Encode](#encode-api) | Encode stream.   |

Example of adding `brotli` encoding:

```ts
import {
  compression,
  type Encoder,
  type EncodingMap,
} from "https://deno.land/x/compression_middleware@$VERSION/mod.ts";

declare const encodeBr: Encode;
const Br: Encoder = { encoding: "br", encode: encodeBr };

const middleware = compression([Br]);
```

## Encode API

`Encode` is an API for converting content.

```ts
interface Encode {
  (stream: ReadableStream<Unit8Array>): BodyInit | Promise<BodyInit>;
}
```

## Compressible

Filter media types to be compressed according to the following
[specifications](https://www.rfc-editor.org/rfc/rfc9110.html#section-8.4-8):

> If the media type includes an inherent encoding, such as a data format that is
> always compressed, then that encoding would not be restated in
> Content-Encoding even if it happens to be the same algorithm as one of the
> content codings.

Determine from the `Content-Type` response header whether the representation is
compressible.

For example, image media such as `image/jpag` is not compressible because it is
already compressed.

## Effects

Middleware may make changes to the following elements of the HTTP message.

- HTTP Content
- HTTP Headers
  - Content-Encoding
  - Vary

## Conditions

Middleware is executed if all of the following conditions are met:

- Encoding matches `Accept-Encoding` header in request
- `Content-Type` header exists in response
- `Content-Encoding` header does not exists in response
- `Cache-Control` header does not have `no-transform` directive in response
- Response body exists
- Response body is readable
- Response body is [compressible](#compressible)

## API

All APIs can be found in the
[deno doc](https://doc.deno.land/https/deno.land/x/compression_middleware/mod.ts).

## License

Copyright © 2023-present [httpland](https://github.com/httpland).

Released under the [MIT](./LICENSE) license
