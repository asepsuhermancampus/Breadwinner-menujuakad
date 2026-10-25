import "server-only";
import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import { getAccounts } from "./identity/runtime";
import { limitAuth } from "./identity/policy";
import { isOperationsEmail } from "./operations-access";

export function isGoogleAuthReady(): boolean {
  return Boolean(
    process.env.AUTH_GOOGLE_ID?.trim() &&
    process.env.AUTH_GOOGLE_SECRET?.trim() &&
    process.env.AUTH_SECRET?.trim(),
  );
}
export function createAuthConfig(): NextAuthConfig {
  const providers: NextAuthConfig["providers"] = [];
  if (isGoogleAuthReady())
    providers.push(
      Google({
        clientId: process.env.AUTH_GOOGLE_ID!.trim(),
        clientSecret: process.env.AUTH_GOOGLE_SECRET!.trim(),
        authorization: { params: { scope: "openid email profile" } },
        checks: ["pkce", "state"],
      }),
    );
  providers.push(
    Credentials({
      credentials: { email: { type: "email" }, password: { type: "password" } },
      authorize(credentials, request) {
        if (typeof credentials.email !== "string" || typeof credentials.password !== "string")
          return null;
        try {
          limitAuth(request, credentials.email, "login");
        } catch {
          return null;
        }
        const account = getAccounts().authenticate(credentials.email, credentials.password);
        return account ? { id: account.id, email: account.email, name: account.name } : null;
      },
    }),
  );
  return {
    providers,
    pages: { signIn: "/login", error: "/login" },
    session: { strategy: "jwt", maxAge: 86400 },
    callbacks: {
      async signIn({ account, profile, user }) {
        if (account?.provider !== "google") return true;
        if (profile?.email_verified !== true || !profile.email) return false;
        try {
          const jar = await cookies();
          const resolved = getAccounts().google(
            account.providerAccountId,
            profile.email,
            user.name ?? profile.email,
            true,
            isOperationsEmail(profile.email),
            jar.get("ma_google_link")?.value,
          );
          user.id = resolved.id;
          return true;
        } catch {
          return "/login?error=AccountLinkRequired";
        }
      },
      jwt({ token, user, account }) {
        if (user?.id && account) {
          const stored = getAccounts().byId(user.id);
          if (!stored) return null;
          token["sid"] = getAccounts().createSession(stored.id);
          token["authMethod"] = account.provider;
          token["authenticatedAt"] = Date.now();
        }
        if (!token["sid"] && token["emailVerified"] === true && token.email && token.sub) {
          try {
            const stored = getAccounts().google(
              token.sub,
              token.email,
              token.name ?? token.email,
              true,
              isOperationsEmail(token.email),
              undefined,
              true,
            );
            if (!token.jti) return null;
            token["sid"] = getAccounts().migrateSession(stored.id, token.jti);
          } catch {
            return null;
          }
        }
        return typeof token["sid"] === "string" && getAccounts().session(token["sid"])
          ? token
          : null;
      },
      session({ session, token }) {
        const stored =
          typeof token["sid"] === "string" ? getAccounts().session(token["sid"]) : null;
        if (!stored) {
          session.user = undefined as unknown as typeof session.user;
          return session;
        }
        Object.assign(session.user, {
          id: stored.id,
          email: stored.email,
          name: stored.name,
          role: stored.role,
          ownerKey: stored.owner_key,
        });
        if (typeof token["authMethod"] === "string") session.user.authMethod = token["authMethod"];
        if (typeof token["authenticatedAt"] === "number")
          session.user.authenticatedAt = token["authenticatedAt"];
        return session;
      },
    },
    events: {
      signOut(message) {
        if ("token" in message && typeof message.token?.["sid"] === "string")
          getAccounts().revoke(message.token["sid"]);
        else if ("token" in message && message.token?.jti)
          getAccounts().revokeLegacy(message.token.jti);
      },
    },
  };
}
export const authConfig = createAuthConfig();
export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
