import { reviewJson } from "@/server/reviews/http";
export function POST(_request: Request) {
  void _request;
  return reviewJson({ error: "Gunakan halaman /login untuk masuk ke semua akun." }, 410);
}
