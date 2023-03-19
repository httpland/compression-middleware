const ReNoTransform = /(?:^|,)\s*?no-transform\s*?(?:,|$)/;

export function isNoTransform(input: string): boolean {
  return ReNoTransform.test(input);
}
