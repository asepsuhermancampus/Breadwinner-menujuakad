# Settings consolidation implementation plan

**Goal:** Replace the sidebar account overflow menu with one Pengaturan destination containing five separate settings tabs.

**Architecture:** Keep /account as the existing settings entry point. Reuse CustomerProfile, CustomerPlans, AccountSecurity, DomainSettings, PrioritySupport and CustomerSignOut without changing their service logic. Add /account/domain and /account/support alongside the existing profile, plans and security routes. Preserve legacy section links with exact redirects.

**Constraints:** Preserve ownership, subscription and operator checks; retain trial/account separation; render only the selected settings content; keep the sidebar gear aligned; retain native fixed header/content scrolling and narrow-screen layout.

- [x] Add browser coverage for the five destinations, active tab/content isolation, sidebar simplification and legacy links.
- [x] Centralize settings tab metadata and validate route IDs. Add the two exact settings paths to the existing safe login return allowlist.
- [x] Remove the sidebar account dialog and rename its footer link Pengaturan. Move sign-out/sign-in to the settings page.
- [x] Split existing settings sections into five panels and adapt guest sign-in prompts. Keep support operator queue within the support tab.
- [x] Update feature, guide, payment and search links plus affected navigation/logout/feature-lock tests.
- [x] Check mobile rendering, entitlement gates, profile persistence and authentication/logout. Run focused unit tests, lint/architecture, type checks and a production build.

Execute in the existing workspace as requested. Do not modify payment, domain verification, support, profile or authentication services.

Validation: production build and TypeScript passed; lint/architecture passed with 12 existing warnings and no errors; 540 unit tests passed; 14 customer settings/sidebar/entitlement/session browser tests and 5 authentication browser tests passed. Desktop (1600px) and mobile (375px) screenshots inspected. Local /account responded HTTP 200 on port 3201. Implementation review found no material issues.
