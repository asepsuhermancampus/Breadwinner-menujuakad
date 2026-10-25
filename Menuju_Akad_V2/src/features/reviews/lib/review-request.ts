export async function reviewRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  if (options.method === "POST" && ["/api/reviews", "/api/superadmin/login"].includes(url)) {
    const ready = await fetch("/api/reviews/identity", {
      cache: "no-store",
      credentials: "same-origin",
    });
    if (!ready.ok) throw new Error("Belum dapat terhubung. Silakan coba kembali.");
  }
  const response = await fetch(url, {
    ...options,
    cache: "no-store",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && url.startsWith("/api/superadmin/") && !url.endsWith("/login"))
      window.location.replace("/superadmin/login");
    throw new Error(data?.error || "Belum dapat terhubung. Silakan coba kembali.");
  }
  return data as T;
}
