import { describe, expect, it, vi, afterEach } from "vitest";
import type { NextAuthConfig } from "next-auth";
import { createAuthConfig, isGoogleAuthReady } from "./auth";

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => undefined }) }));
vi.mock("./identity/runtime", () => ({
  getAccounts: () => ({
    google: () => ({ id: "google-uid-1234" }),
    byId: (id: string) => ({
      id,
      email: "user@example.com",
      name: "Test User",
      role: "customer",
      owner_key: "google-owner",
    }),
    createSession: () => "session-token",
    session: () => ({
      id: "google-uid-1234",
      email: "user@example.com",
      name: "Test User",
      role: "customer",
      owner_key: "google-owner",
    }),
  }),
}));
vi.mock("next-auth", () => ({
  default: vi.fn(() => ({
    handlers: {},
    auth: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
  })),
}));

type AuthCallbacks = NonNullable<NextAuthConfig["callbacks"]>;
type SignInArgs = Parameters<NonNullable<AuthCallbacks["signIn"]>>[0];
type JwtArgs = Parameters<NonNullable<AuthCallbacks["jwt"]>>[0];
type SessionArgs = Parameters<NonNullable<AuthCallbacks["session"]>>[0];

describe("server/auth policy and configuration", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("reports ready only when all required auth credentials are present", () => {
    vi.stubEnv("AUTH_GOOGLE_ID", "test-client-id");
    vi.stubEnv("AUTH_GOOGLE_SECRET", "test-client-secret");
    vi.stubEnv("AUTH_SECRET", "32-bytes-random-auth-secret-string");

    expect(isGoogleAuthReady()).toBe(true);
    const config = createAuthConfig();
    expect(config.providers).toHaveLength(2);
  });

  it("keeps manual login available when Google credentials are missing", () => {
    vi.stubEnv("AUTH_GOOGLE_ID", "");
    vi.stubEnv("AUTH_GOOGLE_SECRET", "");
    vi.stubEnv("AUTH_SECRET", "");
    delete process.env.AUTH_GOOGLE_ID;
    delete process.env.AUTH_GOOGLE_SECRET;
    delete process.env.AUTH_SECRET;

    expect(isGoogleAuthReady()).toBe(false);
    const config = createAuthConfig();
    expect(config.providers).toHaveLength(1);
  });

  it("configures Google provider with pkce, state, and minimal openid email profile scopes", () => {
    vi.stubEnv("AUTH_GOOGLE_ID", "test-client-id");
    vi.stubEnv("AUTH_GOOGLE_SECRET", "test-client-secret");
    vi.stubEnv("AUTH_SECRET", "32-bytes-random-auth-secret-string");

    const config = createAuthConfig();
    expect(config.providers).toHaveLength(2);

    const providerEntry = config.providers[0];
    expect(providerEntry).toBeDefined();
    if (!providerEntry) return;

    const provider = typeof providerEntry === "function" ? providerEntry() : providerEntry;
    expect(provider.id).toBe("google");
    expect(provider.type).toBe("oidc");
    if (provider.type !== "oidc") return;

    expect("options" in provider).toBe(true);
    if (!("options" in provider) || typeof provider.options !== "object" || !provider.options) {
      throw new Error("Provider options not found");
    }

    const options = provider.options as {
      checks?: string[];
      authorization?: { params?: { scope?: string } };
    };
    expect(options.checks).toEqual(["pkce", "state"]);
    expect(options.authorization).toEqual({
      params: {
        scope: "openid email profile",
      },
    });
  });

  it("enforces verified email validation for Google sign-in and denies unverified or missing profile", async () => {
    const config = createAuthConfig();
    const signInCallback = config.callbacks?.signIn;

    if (!signInCallback) return;

    const baseAccount: SignInArgs["account"] = {
      provider: "google",
      type: "oidc",
      providerAccountId: "google-uid-123",
    };
    const baseUser: SignInArgs["user"] = {
      id: "google-uid-123",
      email: "user@example.com",
    };

    const allowed = await signInCallback({
      account: baseAccount,
      profile: { email_verified: true, email: "user@example.com", sub: "google-uid-123" },
      user: baseUser,
    });
    expect(allowed).toBe(true);

    const denied = await signInCallback({
      account: baseAccount,
      profile: { email_verified: false, email: "user@example.com", sub: "google-uid-123" },
      user: baseUser,
    });
    expect(denied).toBe(false);

    const missingField = await signInCallback({
      account: baseAccount,
      profile: { email: "user@example.com", sub: "google-uid-123" },
      user: baseUser,
    });
    expect(missingField).toBe(false);

    const missingProfile = await signInCallback({
      account: baseAccount,
      user: baseUser,
    });
    expect(missingProfile).toBe(false);

    const nonGoogle = await signInCallback({
      account: { provider: "credentials", type: "credentials", providerAccountId: "c-1" },
      user: baseUser,
    });
    expect(nonGoogle).toBe(true);
  });

  it("sanitizes session, stores user id, and prevents leaking oauth tokens", async () => {
    const config = createAuthConfig();

    expect(config.session?.strategy).toBe("jwt");
    expect(config.session?.maxAge).toBe(24 * 60 * 60);

    const jwtCallback = config.callbacks?.jwt;
    const sessionCallback = config.callbacks?.session;
    if (!jwtCallback || !sessionCallback) return;

    const jwtArgs: JwtArgs = {
      token: {
        sub: "google-sub-5678",
        access_token: "sensitive-access-token",
        refresh_token: "sensitive-refresh-token",
      },
      user: { id: "google-uid-1234", email: "user@example.com" },
      profile: { email_verified: true, sub: "google-sub-5678" },
      account: { provider: "google", type: "oidc", providerAccountId: "google-sub-5678" },
    };

    const token = await jwtCallback(jwtArgs);
    expect(token).not.toBeNull();
    if (!token) {
      throw new Error("Token must not be null");
    }

    expect(token["sid"]).toBe("session-token");
    expect(token["authMethod"]).toBe("google");

    const sessionArgs = {
      session: {
        user: { name: "Test User", email: "user@example.com" },
        expires: new Date(Date.now() + 86400 * 1000).toISOString(),
      },
      token,
    } as unknown as SessionArgs;

    const session = await sessionCallback(sessionArgs);
    expect(session.user?.id).toBe("google-uid-1234");
    expect(session).not.toHaveProperty("access_token");
    expect(session).not.toHaveProperty("refresh_token");
    expect(session.user).not.toHaveProperty("access_token");
    expect(session.user).not.toHaveProperty("refresh_token");
  });
});
