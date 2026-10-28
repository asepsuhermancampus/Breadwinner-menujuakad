# KUA usability correction

**Goal:** Make the checklist the primary workspace and move optional setup out of its reading flow.

**Design:** Two explicit views on the same route: Checklist saya and Pilih template. Show saved checklist groups immediately; no template catalog or permanent add form before the checklist. Empty main group offers one start action that opens its inline preview. Additional group offers condition templates and a collapsed manual-add form. In the catalog, choose main/additional first and replace cards with the selected inline preview. Applying a template returns to the appropriate checklist group with focus. Hide zero-of-zero progress; keep progress compact once documents exist. Preserve storage, template history, main immutability, additional edit dialog and save-error behavior.

- [x] Add browser expectations for checklist-first layout and separate template setup; update affected navigation helpers.
- [x] Simplify checklist layout, template flow, contextual empty actions and additional-only creation.
- [x] Inspect desktop/mobile and verify apply/return, existing data, edit/delete, copy/reset, failure handling and trial limits.
- [x] Run focused lint/architecture, production build/TypeScript and browser regressions; request review.

Validation: production build/TypeScript passed, focused ESLint passed without warnings, architecture passed (828 modules, 200-line limit). Eleven production browser regressions passed, covering 375/768/1600px layouts, persisted checklist-first entry, contextual template setup, confirmation/apply return, keyboard focus, manual draft preservation, copy/reset, popup editing, deletion history, main-document guards, trial limits and failed storage/API saves. Desktop/mobile empty and saved states inspected through local screenshots. Local server remains on 127.0.0.1:3201.

Review identified focus loss when opening conditional templates and canceling. Picker entry now focuses its heading, cancellation restores the persistent checklist-view button, and application opens/focuses the target group. Follow-up review found no remaining material issues. Stored document data and backend rules remain unchanged.
