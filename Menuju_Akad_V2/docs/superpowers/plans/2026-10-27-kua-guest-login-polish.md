# KUA, guest names and login polish

**Goal:** Empty initial KUA checklist with manual multi-select and one-click templates; accurate official document catalog; personal guest-family labels and a compact login screen.

**Approach:** Retain existing versioned document resources and mandatory-document protection. Render no checklist cards before selection. Place two tabs left and manual/export actions right. Manual selection appends only chosen documents; templates append main or conditional documents with stable provenance and no duplicates. Keep existing saved records; never bulk-delete customer data to change defaults. Conditional requirements remain editable because only the couple can determine applicability.

## Tasks

- [x] Verify current national KUA requirements using official sources; distinguish universally required, conditional and national service guidance.
- [x] Add domain tests for partial manual selection, subsequent template completion, duplicate prevention, empty defaults and export escaping.
- [x] Build manual chooser, two template cards, side-by-side checklist cards, contextual empty view and PDF/CSV export.
- [x] Replace production dummy family names with configured partner nicknames or neutral anonymous labels; simplify guest dialog copy.
- [x] Tighten login spacing and remove the password-manager note. Read-only audit existing local test identities and known seeded passwords.
- [x] Run scoped checks, full unit tests, production build and targeted browser checks for KUA/guest/login.

**Constraints:** Preserve saved documents and stored legacy group identifiers; do not reset passwords, create accounts, deploy or commit. Test accounts may be reported only when verified; password hashes cannot reveal unknown passwords.

## Verification

- 657 unit tests in 134 files passed; scoped TypeScript, ESLint and architecture checks passed (916 modules).
- Production build passed in isolated customer-consistency output. Browser checks cover KUA empty state/manual selection/templates/export/mandatory API protection at mobile and desktop widths, anonymous guest labels, and both account-owner sides' nicknames.
- Focused independent KUA review found no actionable issues.
- Login screenshots inspected at 320/375/768/1440px and registration smoke check passed.
- Official references: PMA 30/2024 primary PDF and current national Bimas Islam Info Nikah procedure. No later replacement found in targeted official searches as of 2026-10-27; JDIH status page could not be reached.
- Seed account audit used read-only SQLite access and checked known seed passwords against stored hashes; no credentials written to tracked files.
