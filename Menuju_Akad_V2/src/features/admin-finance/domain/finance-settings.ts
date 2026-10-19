import type { ConfigInput, FinanceContext, FinanceState } from "../types/admin-finance";
import { commit, failure, financeGuard, intentGuard, replay, success } from "./finance-guards";

export function requestFinanceOtp(state: FinanceState, context: FinanceContext) {
  const blocked = financeGuard(context, "settings");
  if (blocked) return failure(state, blocked);
  if (state.otp?.actorId === context.actorId && state.otp.resendAfter > context.now())
    return failure(state, "Tunggu hingga jeda kirim ulang 45 detik selesai.");
  return success(
    {
      ...state,
      otp: {
        actorId: context.actorId,
        scope: "financial_settings.write",
        verifiedUntil: 0,
        challengeExpiresAt: context.now() + 300_000,
        resendAfter: context.now() + 45_000,
      },
    },
    "Kode mock tersedia untuk simulasi: 882016. Tidak ada kode dikirim.",
  );
}
export function verifyFinanceOtp(state: FinanceState, code: string, context: FinanceContext) {
  const blocked = financeGuard(context, "settings");
  if (blocked) return failure(state, blocked);
  if (
    !state.otp ||
    state.otp.actorId !== context.actorId ||
    state.otp.scope !== "financial_settings.write" ||
    state.otp.challengeExpiresAt <= context.now()
  )
    return failure(
      state,
      "Minta challenge OTP untuk aktor dan cakupan ini. Challenge tidak tersedia atau telah kedaluwarsa.",
    );
  if (!/^\d{6}$/.test(code) || code !== "882016")
    return failure(state, "Kode simulasi harus enam digit dan sesuai kode mock.");
  return success(
    {
      ...state,
      otp: {
        actorId: context.actorId,
        scope: "financial_settings.write",
        verifiedUntil: context.now() + 300_000,
        challengeExpiresAt: 0,
        resendAfter: state.otp.resendAfter,
      },
    },
    "OTP mock valid selama lima menit untuk review bank dan fee. Konfigurasi belum berubah.",
  );
}
export function publishFinanceConfig(
  state: FinanceState,
  input: ConfigInput,
  context: FinanceContext,
) {
  const blocked = financeGuard(context, "settings") ?? intentGuard(input);
  if (blocked) return failure(state, blocked);
  const fingerprint = JSON.stringify([
    "config",
    input.expectedVersion,
    input.feeBps,
    input.bankName,
    input.bankLast4,
  ]);
  const repeated = replay(state, input.operationId, fingerprint);
  if (repeated) return repeated;
  if (
    !state.otp ||
    state.otp.actorId !== context.actorId ||
    state.otp.scope !== "financial_settings.write" ||
    state.otp.verifiedUntil <= context.now()
  )
    return failure(state, "Verifikasi OTP kedaluwarsa atau tidak sesuai cakupan.");
  if (state.config.version !== input.expectedVersion)
    return failure(state, "Versi konfigurasi berubah. Review ulang perubahan sebelum konfirmasi.");
  if (!input.bankValidated || !/^\d{4}$/.test(input.bankLast4) || !input.bankName.trim())
    return failure(state, "Rekening platform usulan belum tervalidasi dalam sandbox.");
  if (!Number.isSafeInteger(input.feeBps) || input.feeBps < 0 || input.feeBps > 10_000)
    return failure(state, "Fee tidak valid.");
  const next = {
    ...state,
    config: {
      version: state.config.version + 1,
      feeBps: input.feeBps,
      bankName: input.bankName.trim(),
      bankLast4: input.bankLast4,
      manualQris: false as const,
    },
    otp: null,
  };
  return commit(
    state,
    next,
    context,
    input,
    "financial_settings.published",
    `CFG-${next.config.version}`,
    fingerprint,
    "Konfigurasi mock diterapkan untuk order baru. Snapshot fee historis dan rekening payout vendor tetap.",
    `Fee ${state.config.feeBps / 100}% → ${input.feeBps / 100}%; rekening platform ${state.config.bankName} ••${state.config.bankLast4} → ${input.bankName} ••${input.bankLast4}. Izin dan OTP valid saat konfirmasi.`,
  );
}
