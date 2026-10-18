// Exact sandbox token registry; an arbitrary token must never reveal Budi's personal sessions.
export function hasMicrositeAccess(token: string): boolean {
  return token === "token-budi-a7c6" || token === "a7c6";
}
