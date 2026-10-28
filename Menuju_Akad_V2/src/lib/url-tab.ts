export function readUrlTab<T extends string>(
  search: string,
  key: string,
  values: readonly T[],
  fallback: T,
): T {
  const requested = new URLSearchParams(search).get(key)?.toLocaleLowerCase("id-ID");
  return values.find((value) => value.toLocaleLowerCase("id-ID") === requested) ?? fallback;
}
export function urlWithTab(href: string, key: string, value: string): string {
  const url = new URL(href);
  url.searchParams.set(key, value);
  return `${url.pathname}${url.search}${url.hash}`;
}
