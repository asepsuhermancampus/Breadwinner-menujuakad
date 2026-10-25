# Unified authentication implementation

Approved design: ../specs/2026-10-22-unified-auth-design.md. Execute in the shared workspace without changing unrelated dashboard work.

1. Add persistent canonical accounts, password hashing, provider mapping, revocable sessions and throttling. Test identity isolation, migration and rejected credentials.
2. Connect Credentials and Google to Auth.js; retain verified Google ownership and require explicit proof for linking. Trace Google initiation without exposing secrets.
3. Replace Google-only entry with real login/registration forms and browser password-manager semantics. Route all roles through /login and server-selected destinations.
4. Use canonical ownership and current persisted roles in customer, operations and review guards. Retire independent superadmin authentication.
5. Add account password/link controls, exercise browser flows, run focused regressions, typecheck, lint and isolated build. Report any external OAuth consent limitation accurately.

Verified: 535 unit tests and 15 isolated browser tests pass; production build includes successful TypeScript checks. Lint and architecture pass, with 12 existing warnings elsewhere. Local port 3201 superadmin login/inbox/logout succeeds. Google initiation reaches Google with correct callback, PKCE S256 and state; interactive Google consent remains an owner-operated check. Password-manager prompts remain browser-controlled.
