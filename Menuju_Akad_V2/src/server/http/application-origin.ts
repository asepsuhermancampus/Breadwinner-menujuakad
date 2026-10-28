/** Public origins are trusted only when explicitly configured by the server. */
export function isConfiguredApplicationOrigin(origin: string): boolean {
  return [process.env.AUTH_URL?.trim() || process.env.NEXTAUTH_URL?.trim()].some((value) => {
    if (!value) return false;
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) && url.origin === origin;
    } catch {
      return false;
    }
  });
}
