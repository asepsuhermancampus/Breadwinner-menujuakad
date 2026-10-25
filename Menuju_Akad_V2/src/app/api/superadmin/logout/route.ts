import { reviewJson } from "@/server/reviews/http";
export function POST(_request: Request) {
  void _request;
  return reviewJson({ error: "Gunakan tombol Keluar pada akun untuk mengakhiri sesi." }, 410);
}
