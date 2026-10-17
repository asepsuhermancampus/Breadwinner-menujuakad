export type AuthMethod = "email" | "phone";
export type AuthMode = "login" | "register" | "recovery";
export type CredentialKind = "password" | "pin";
export type AuthErrorCode =
  | "invalid"
  | "wrong-code"
  | "expired"
  | "rate-limit"
  | "offline"
  | "revoked"
  | "unavailable"
  | "conflict";

export type AuthFailure = {
  ok: false;
  code: AuthErrorCode;
  retryAt?: number;
};
export type AuthResult<T> = { ok: true; data: T } | AuthFailure;
export type OtpChallenge = {
  id: string;
  purpose: AuthMode;
  channel: AuthMethod;
  destination: string;
  expiresAt: number;
  resendAt: number;
};
export type AuthSession = { id: string; actorId: string; expiresAt: number };
export type RecoveryGrant = {
  kind: "recovery";
  recoveryToken: string;
  destination: string;
};
export type AuthVerification = { kind: "authenticated"; session: AuthSession } | RecoveryGrant;
export type LoginInput = {
  method: AuthMethod;
  identifier: string;
  secret: string;
  remember: boolean;
};
export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  acceptTerms: true;
};

/** Implementations own authorization, challenge integrity, and server rate limits. */
export interface AuthAdapter {
  mode: "mock" | "live";
  now(): number;
  login(input: LoginInput): Promise<AuthResult<OtpChallenge>>;
  register(input: RegisterInput): Promise<AuthResult<OtpChallenge>>;
  recover(input: { method: AuthMethod; identifier: string }): Promise<AuthResult<OtpChallenge>>;
  verify(input: { challengeId: string; code: string }): Promise<AuthResult<AuthVerification>>;
  resend(challengeId: string): Promise<AuthResult<OtpChallenge>>;
  reset(input: {
    recoveryToken: string;
    kind: CredentialKind;
    secret: string;
  }): Promise<AuthResult<{ updated: true }>>;
}
