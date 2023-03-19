import { BuildOptions } from "https://deno.land/x/dnt@0.33.1/mod.ts";

export const makeOptions = (version: string): BuildOptions => ({
  test: false,
  shims: {},
  compilerOptions: {
    lib: ["dom", "esnext", "dom.iterable"],
  },
  typeCheck: false,
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  package: {
    name: "@httpland/compression-middleware",
    version,
    description: "HTTP compression middleware",
    keywords: [
      "http",
      "middleware",
      "header",
      "compression",
      "compress",
      "gzip",
      "deflate",
      "encoding",
      "encoder",
      "fetch-api",
    ],
    engines: {
      node: "^18.x",
    },
    license: "MIT",
    homepage: "https://github.com/httpland/compression-middleware",
    repository: {
      type: "git",
      url: "git+https://github.com/httpland/compression-middleware.git",
    },
    bugs: {
      url: "https://github.com/httpland/compression-middleware/issues",
    },
    sideEffects: false,
    type: "module",
    publishConfig: {
      access: "public",
    },
  },
  mappings: {
    "https://esm.sh/compressible@2.0.18": {
      name: "compressible",
      version: "2.0.18",
    },
    "https://deno.land/x/http_middleware@1.0.0/mod.ts": {
      name: "@httpland/http-middleware",
      version: "1.0.0",
    },
    "https://deno.land/x/http_utils@1.0.0-beta.13/header.ts": {
      name: "@httpland/http-utils",
      version: "1.0.0-beta.13",
    },
    "https://deno.land/x/isx@1.0.0-beta.24/mod.ts": {
      name: "isxx",
      version: "1.0.0-beta.24",
    },
  },
  packageManager: "pnpm",
});
