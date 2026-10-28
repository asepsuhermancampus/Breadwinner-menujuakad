# Release KUA templates

**Goal:** Let customers detach mandatory or optional templates and return the checklist to an empty state.

**Behavior:** Each checklist card has a release action with confirmation. It removes template-origin records in that group, including archived optional records, and preserves custom documents. A separate confirmed clear action removes the entire checklist. Released templates can be applied again. Mandatory document contents remain immutable; the server and trial validation now also allow removing a complete mandatory-template cohort atomically, while rejecting individual mandatory removal, edits or regrouping. Existing revision checks remain in effect.

**Verification:** Domain tests for release/reapply/custom preservation; account persistence tests; browser tests for both stores including cancellation, reload, reapplication, full reset and failed-save retention. Keep the existing sidebar/tab/card design.

**Results:** Production build, 662 unit tests, 5 targeted browser tests, scoped ESLint, Prettier and architecture checks passed. Development type configuration restored after the isolated build.
