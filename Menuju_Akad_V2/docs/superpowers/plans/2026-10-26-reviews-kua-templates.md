# Reviews and KUA templates implementation plan

**Goal:** Verify private superadmin feedback moderation and local dummy access, clarify example landing reviews, and add confirmed, reusable-once KUA templates with separate collapsible groups.

**Architecture:** Reuse review storage, authentication and moderation. Add an explicit sample badge to seeded reviews and scoped palette accents. Keep documents in the existing revision-controlled resource; optional group/template/archive metadata preserves existing records and remembers applied templates even when their documents are removed. Archive template items without counting or exporting them. New workspaces start empty; existing lists are never replaced. Templates are editable starting points sourced from Kemenag, not verification of legal completeness.

User clarification: main documents are fixed and only checkable, enforced on writes as well as in the UI. Only additional documents may be edited/deleted, with editing inside an accessible dialog. Untagged legacy documents remain editable in the additional group. Long template previews stay inline.

- [x] Add domain tests for explicit application, deduplication, archive history, grouping/copy/reset and metadata persistence.
- [x] Build catalog, shared document schema and safe document helpers; retain legacy lists and consent-based empty defaults.
- [x] Build inline preview/confirmation cards, progress, grouped collapse, custom documents, copy and reset confirmation. Preserve edits and error handling.
- [x] Label seeded review examples, apply scoped palette accents, and verify private review moderation/no publication cap.
- [x] Verify supplied local superadmin credentials (provision only if missing), sample data and private access boundaries.
- [x] Run unit, build, lint and browser coverage at mobile/tablet/desktop; request implementation review.

Reference palette: https://colorhunt.co/palette/08cb00253900000000eeeeee
Document source: https://sulteng.kemenag.go.id/artikel/mm7g/07-05-2025-syarat-administrasi-daftar-
Photo sizes/quantities and local forms are intentionally left for the destination KUA to confirm.

Validation: production build/TypeScript passed; ESLint/architecture passed (12 existing warnings, no errors). All 549 unit tests passed with maxWorkers=2. Browser verification: 5 existing KUA/session/trial tests, 4 template tests at 375/768/1600px including copy/reset/failure handling, and 4 review moderation/responsive/pagination tests passed. Local screenshots inspected at 375/1440px; six seeded examples visible with dummy labels. All three supplied superadmin accounts exist and match the supplied test password; actual local superadmin login can read the inbox (200), while admin login is denied (401). Server restored at 127.0.0.1:3201.

Review found a trial export regression involving archived document history. Added a failing regression test, filtered archived records and internal fields from guest exports/counts, and reran the suite. Follow-up review found no remaining material issues. Initial unrestricted parallel unit run hit unrelated timeouts; bounded repeat passed. Browser test selectors were corrected to use the accessible notes textbox name, and the direct API test now sends an Origin header to exercise the document guard beyond the existing CSRF guard.
