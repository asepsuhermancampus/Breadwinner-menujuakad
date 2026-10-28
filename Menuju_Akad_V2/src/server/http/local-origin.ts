/** Match loopback browser aliases only against a verified local development Host. */
export function isLocalOriginAlias(request: Request, origin: string | null): boolean {
  if (process.env.NODE_ENV === "production" || !origin) return false;
  try {
    const target = new URL(request.url),
      source = new URL(origin);
    const loopback = ["localhost", "127.0.0.1", "[::1]"];
    const localBind = [...loopback, "0.0.0.0", "[::]"];
    return (
      localBind.includes(target.hostname) &&
      loopback.includes(source.hostname) &&
      source.protocol === target.protocol &&
      source.port === target.port &&
      request.headers.get("host") === source.host
    );
  } catch {
    return false;
  }
}
