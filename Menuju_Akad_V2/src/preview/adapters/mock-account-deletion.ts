import type { AccountAdapter, AccountResult } from "@/features/account/types/account";
import { DEMO_CODE, type Clock } from "./mock-runtime";

export function mockAccountDeletion({
  clock,
  wait,
  blocked,
  onDeleted,
}: {
  clock: Clock;
  wait: () => Promise<void>;
  blocked: () => AccountResult<never> | null;
  onDeleted: () => void;
}): Pick<AccountAdapter, "verifyDeletion" | "deleteAccount"> {
  let proof: { token: string; expiresAt: number; used: boolean } | null = null;
  let attempts = 0;
  return {
    async verifyDeletion({ code }) {
      await wait();
      const failure = blocked();
      if (failure) return failure;
      if (attempts >= 5)
        return {
          ok: false,
          code: "invalid",
          message: "Batas percobaan tercapai. Mulai ulang pratinjau.",
        };
      if (code !== DEMO_CODE) {
        attempts++;
        return { ok: false, code: "invalid", message: "Kode tidak valid." };
      }
      proof = {
        token: `mock-delete-${crypto.randomUUID()}`,
        expiresAt: clock.now() + 60_000,
        used: false,
      };
      return { ok: true, data: { proof: proof.token } };
    },
    async deleteAccount(input) {
      await wait();
      const failure = blocked();
      if (failure) return failure;
      if (
        !proof ||
        proof.used ||
        proof.expiresAt <= clock.now() ||
        input.proof !== proof.token ||
        input.confirmation !== "HAPUS AKUN" ||
        !input.acknowledged
      )
        return {
          ok: false,
          code: "invalid",
          message: "Konfirmasi dan verifikasi terbaru diperlukan.",
        };
      proof.used = true;
      onDeleted();
      return { ok: true, data: { deleted: true } };
    },
  };
}
