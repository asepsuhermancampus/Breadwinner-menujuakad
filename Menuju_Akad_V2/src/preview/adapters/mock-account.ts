import type {
  AccountAdapter,
  AccountResult,
  AccountSnapshot,
} from "@/features/account/types/account";
import { profileSchema } from "@/features/account/schemas/profile";
import {
  latency,
  readStored,
  scenario,
  systemClock,
  writeStored,
  type Clock,
} from "./mock-runtime";
import { accountStorageSchema } from "./storage-schema";
import { mockAccountDeletion } from "./mock-account-deletion";

export function createMockAccount(
  initial: AccountSnapshot,
  clock: Clock = systemClock,
  wait = latency,
): AccountAdapter {
  let state = structuredClone(initial);
  let deleted = false;
  const blocked = (): AccountResult<never> | null => {
    const mode = scenario();
    if (deleted || readStored("ma-v2-account-deleted") === true || mode === "revoked")
      return {
        ok: false,
        code: "revoked",
        message: "Akses simulasi dicabut. Draf tetap tersimpan.",
      };
    if (mode === "offline")
      return { ok: false, code: "offline", message: "Kamu sedang offline. Draf belum disimpan." };
    if (mode === "conflict")
      return {
        ok: false,
        code: "conflict",
        message: "Versi berubah. Tinjau ulang sebelum menyimpan.",
      };
    if (typeof localStorage !== "undefined" && localStorage.getItem("ma-v2-account") !== null) {
      const parsed = accountStorageSchema.safeParse(readStored("ma-v2-account"));
      if (!parsed.success)
        return {
          ok: false,
          code: "unavailable",
          message:
            "Data pratinjau tidak valid. Pulihkan melalui reset pratinjau; draf belum disimpan.",
        };
      state = { ...state, ...parsed.data };
    }
    return null;
  };
  const conflict = {
    ok: false,
    code: "conflict",
    message: "Data berubah sejak dibuka. Muat ulang dan tinjau perubahan.",
  } as const;
  const persist = () => writeStored("ma-v2-account", state);
  return {
    ...mockAccountDeletion({
      clock,
      wait,
      blocked,
      onDeleted() {
        deleted = true;
        state.sessions = [];
        state.partner = null;
        writeStored("ma-v2-account-deleted", true);
        persist();
      },
    }),
    async saveProfile(input) {
      await wait();
      const failure = blocked();
      if (failure) return failure;
      const parsed = profileSchema.safeParse(input);
      if (!parsed.success)
        return {
          ok: false,
          code: "invalid",
          message: "Periksa kembali nama, email, dan nomor telepon.",
        };
      if (state.profile.version !== input.expectedVersion) return conflict;
      const { expectedVersion, ...values } = parsed.data;
      state.profile = { ...state.profile, ...values, version: expectedVersion + 1 };
      persist();
      return { ok: true, data: { ...state.profile } };
    },
    async savePartner(input) {
      await wait();
      const failure = blocked();
      if (failure) return failure;
      if (!state.partner || state.partner.version !== input.expectedVersion) return conflict;
      if (!input.nickname.trim() || input.nickname.length > 60)
        return {
          ok: false,
          code: "invalid",
          message: "Isi nama panggilan antara 1 dan 60 karakter.",
        };
      state.partner = {
        ...state.partner,
        nickname: input.nickname,
        version: state.partner.version + 1,
      };
      persist();
      return { ok: true, data: { ...state.partner } };
    },
    async unlinkPartner(input) {
      await wait();
      const failure = blocked();
      if (failure) return failure;
      if (!state.partner || state.partner.version !== input.expectedVersion) return conflict;
      state.partner = null;
      persist();
      return { ok: true, data: { disconnected: true } };
    },
    async savePreferences(input) {
      await wait();
      const failure = blocked();
      if (failure) return failure;
      if (state.preferences.version !== input.expectedVersion) return conflict;
      const schema = accountStorageSchema.shape.preferences
        .omit({ version: true })
        .extend({ expectedVersion: accountStorageSchema.shape.preferences.shape.version })
        .strict();
      const parsed = schema.safeParse(input);
      if (!parsed.success)
        return { ok: false, code: "invalid", message: "Preferensi belum valid." };
      const { expectedVersion, ...preferences } = parsed.data;
      state.preferences = { ...preferences, version: expectedVersion + 1 };
      persist();
      return { ok: true, data: { ...state.preferences } };
    },
    async revokeSessions({ ids }) {
      await wait();
      const failure = blocked();
      if (failure) return failure;
      if (!ids.length || ids.some((id) => !state.sessions.some((session) => session.id === id)))
        return { ok: false, code: "invalid", message: "Sesi perangkat tidak tersedia." };
      if (state.sessions.some((session) => session.current && ids.includes(session.id)))
        return { ok: false, code: "invalid", message: "Perangkat saat ini tetap aktif." };
      state.sessions = state.sessions.filter((session) => !ids.includes(session.id));
      persist();
      return { ok: true, data: [...state.sessions] };
    },
    async requestPlanChange() {
      await wait();
      const failure = blocked();
      if (failure) return failure;
      return {
        ok: true,
        data: {
          message: "Pratinjau upgrade siap. Pembayaran belum tersedia; paketmu tetap Premium.",
        },
      };
    },
  };
}
