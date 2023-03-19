import { RepresentationHeader } from "./deps.ts";

const ReNoTransform = /(?:^|,)\s*?no-transform\s*?(?:,|$)/;

export function isNoTransform(input: string): boolean {
  return ReNoTransform.test(input);
}

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
