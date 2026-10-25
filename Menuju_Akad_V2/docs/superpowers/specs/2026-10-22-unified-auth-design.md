# Unified Google and email/password authentication

Date: 22 October 2026
Status: Approved and implemented. Verification and usage: ../../unified-auth.md.

## User intent

Repair the previously working Google sign-in, add real email/password registration and login, support convenient browser password-manager autofill after logout, and give every role one login URL with an appropriate dashboard after authentication. Password inputs are masked by default. Preserve existing plans, workspaces, subscriptions, reviews and superadmin testing credentials.

Only initial testing accounts/data may be dummy. Authentication, registration, sessions, role enforcement and persistence are real; do not restore mock OTP/forms or add preview/example product interfaces.

## Findings in the current application

- `/login` and `/auth/{login,register,recovery}` render `CustomerAuth`, which offers Google only. Legacy manual forms still exist but are attached to a mock authentication adapter, not a functioning account backend.
- `src/server/auth.ts` configures Auth.js with a Google provider and JWT sessions. `/api/auth/status` checks whether required configuration values are present; that check does not prove a Google round trip succeeds.
- During diagnosis, localhost:3201 reported Google enabled and `/api/auth/providers` included Google. The Configuration banner is selected by the URL query parameter and is not a live diagnosis of missing credentials. Do not claim that clearing the query repairs OAuth.
- Superadmin credentials and sessions currently live in dedicated review tables. Other roles use operations allowlists or unfinished legacy route guards. Existing `/admin`, `/vendor` and `/ba` paths currently redirect unconditionally to login.

## Recommended architecture

Extend the existing Auth.js integration with a Credentials provider and a persistent, canonical account repository. Use one session and server-side identity/role resolution for Google, manual accounts and superadmin. Reuse Node crypto and SQLite already available in the project; read the bundled Next.js guides and installed Auth.js implementation/types before modifying integration APIs.

Keep Google alongside manual credentials. A browser-only saved-login implementation would neither provide real account registration nor safe shared sessions. Maintaining separate customer and superadmin login sessions would contradict the requested unified entry point.

## Entry points and forms

- `/login` is the canonical login URL for all roles. Show Google sign-in plus a labelled email/password form, a registration link and clear errors without discarding the entered email.
- `/auth/register` supports name, email, password, password confirmation and consent. Also offer registration with Google; a first verified Google login creates a normal customer account automatically.
- `/auth/login` and `/superadmin/login` redirect to `/login`, preserving only validated local return destinations. Existing superadmin testing credentials continue to work from `/login`.
- Registration always creates the ordinary customer role. No request parameter, browser flag or public role selector grants administrative access.
- Provide loading/disabled states, double-submit protection, responsive layout, keyboard operation and accessible field errors. Existing recovery links must accurately describe available recovery methods rather than offering simulated success.

## Password saving and one-click filling

Use stable HTML form/input names, `autocomplete="username"` on the email login field, `autocomplete="current-password"` on login passwords and `autocomplete="new-password"` on registration passwords. Password inputs use `type="password"` by default and may provide an explicit show/hide control.

Browser/Google Password Manager owns the saved passwords and the permission to save/fill them. After a successful login, preserve standard form submission semantics and, where supported, feature-detect the browser Credential Management API. A rejected or unsupported password-manager operation must never fail login. Native autofill must work without that optional API. A browser password-manager choice can fill both fields while the password stays masked.

Do not store raw passwords in localStorage, sessionStorage, app cookies, server logs or retrievable account history. Do not render a fabricated saved-password list. Logout revokes the application session and clears account-specific session/workspace state; it does not delete entries owned by the browser password manager. The application cannot force the browser to show its save prompt or promise a particular one-click UI across every browser.

## Persistent accounts and role routing

Persist canonical account IDs, normalized emails, display names, salted password hashes where applicable, verified email status, linked provider identities, role and account status. Password-only and Google-only accounts are both supported. Enforce unique normalized account identifiers and provider identity constraints under transactions.

Initial supported destinations:

| Role             | Destination and access                                                                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Customer         | Existing `/dashboard` and that account's workspace/package access.                                                                                          |
| Superadmin       | Existing `/superadmin/reviews`; retains exclusive access to private review contents and publication controls.                                               |
| Admin/operations | A guarded `/admin` home using existing real operations capabilities and server-assigned permissions. No access to private reviews merely by being an admin. |

Existing additional role types, such as finance/support/vendor/ambassador, must be inventoried before implementation planning. Route them only to actual implemented capabilities and enforce their permissions; do not invent a successful dashboard or silently grant superadmin privileges. Creating unrelated vendor/finance business workflows is outside this authentication task. Unknown, inactive or unprovisioned roles fail closed with an accurate explanation.

The server chooses the post-login destination. Respect a safe return URL only when that role is allowed to access it; never let `returnTo` bypass role permissions. Privileged page and API guards independently verify the current account/role from persisted server state. Hiding menu links or trusting a JWT role that remains stale after revocation is insufficient.

## Identity compatibility and account linking

Preserve existing workspace ownership and subscription/payment identity. Inventory all consumers of `session.user.email` before introducing canonical IDs. Migrate or map existing verified Google identities transactionally so they retain their data and do not receive a new empty workspace by accident.

An unverified manual registration using another person's email must not gain that person's existing Google workspace, payments or allowlisted administrative privileges. New manual identities start with their own canonical ownership key; privileged assignments require trusted provisioning/ownership evidence. Never treat an entered email address as proof of its ownership.

Link manual and Google sign-in only after proving ownership, such as an authenticated account-linking flow that completes Google authentication. Do not enable blanket dangerous email account linking. If a matching account already exists, show a useful sign-in/linking path without making an unverified password a backdoor into the verified Google account.

Migrate the seeded superadmin ID, normalized email and existing password hash without changing the password. Retain review moderation audit references. End the separate superadmin session mechanism once unified sessions protect the same APIs; old cookies must not continue granting a parallel administrative session after unified logout. Migrations are idempotent, transactional and do not reset existing roles/passwords on restart.

## Google diagnosis and repair

Trace the actual OAuth initiation, configured runtime origin and callback URL, Auth.js host/secret setup, PKCE/state cookies and callback errors. Inspect only sanitized diagnostics; never print OAuth secrets, tokens or session cookies.

Use localhost:3201 as the user's current local origin and make runtime callback handling consistent with it. Do not apply permissive host/origin checks or disable PKCE/state/email verification to hide an error. Changing Google Cloud OAuth settings, if demonstrated necessary, requires access to that project's configuration; explain the exact setting rather than claiming an external configuration was changed.

Automated checks prove the correct Google authorization request, state/PKCE protection, callback handling and account mapping. A real Google round trip needs the account owner's interactive consent; distinguish that evidence from mocked provider tests. Manual login stays available if Google is temporarily unavailable.

## Validation and abuse protection

Use server-side validation for email, names, password length and confirmation. Proposed new-password policy: 12–128 characters, permit passphrases and browser-generated passwords, do not trim or silently truncate passwords. Keep existing migrated passwords valid under their existing hashes.

Hash passwords with salted scrypt or a compatible existing hash scheme; compare safely and never return hashes to clients. Limit login/registration attempts per trustworthy client identity and normalized account identifier, using persistent bounded windows. Preserve the per-visitor isolation already implemented for reviews rather than introducing a global bucket that blocks unrelated users.

Protect mutation endpoints against cross-origin requests, cap bodies, prevent duplicate registrations, use appropriate HttpOnly/SameSite/Secure cookies and validate safe redirect targets. Use neutral login failure messages. Registration/login failures never fabricate a successful session.

## Verification and delivery

1. Register a manual account, authenticate, create account data, logout, restart/reload and login again; the same data and identity remain.
2. Reject wrong passwords, duplicate/case-variant registrations, malformed requests, hostile origins, forged roles and unauthorized dashboard/API requests.
3. Confirm new manual accounts cannot claim existing Google-owned workspaces or privileged allowlisted identities by typing the same email.
4. Confirm superadmin's current dummy credentials work at `/login`, reach its actual review dashboard, publish/hide correctly, and lose private access after unified logout.
5. Verify existing customer Google identity mapping and first-time Google account creation; exercise safe linking and reject unverified-email linking.
6. Verify role-specific landing and return destinations, administrative revocation and cross-account isolation. Regression-test subscription/package and workspace ownership behavior affected by identity changes.
7. Check masked fields and autocomplete semantics; demonstrate browser autofill when the local browser supports it. Do not claim browser-controlled prompts can be guaranteed by automated tests.
8. Check desktop/mobile layouts, keyboard controls, retained input after failure, and errors when Google is unavailable.
9. Run focused unit/integration tests, existing Google/review/identity regression suites, browser flows, lint/typecheck and an isolated production build. Preserve unrelated changes in the shared workspace.

Deliver actual testing instructions, URLs and observed results. Work natively in the current workspace; no push, deployment, paid service or outbound email is implied. A written implementation plan follows review of this design.
