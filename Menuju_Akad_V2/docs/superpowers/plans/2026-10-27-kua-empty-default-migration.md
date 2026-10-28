# KUA empty defaults: existing-data migration

**Problem:** New workspaces already start empty, but existing local accounts still contain eight automatically initialized `kua-template-*` documents from the old implementation. Ungrouped records appear in the optional card.

**Fix:** Recognize the exact old ID/title/default-note combinations, remove only those unchanged automatic rows, and preserve custom edits and explicitly selected modern templates. Account reads persist the cleanup with a revision compare-and-set; trial reads normalize old browser snapshots and subsequent saves retain the cleaned state. Future reads remain idempotent. No UI or template flow redesign.

**Local repair:** Removed recognized automatic samples from existing workspaces using a transaction and a document-only backup in ignored `.data/`. Post-repair scan found zero remaining recognized samples; existing explicitly selected documents retained.

**Checks:** Unit coverage verifies exact legacy recognition, custom-data preservation, account revision/idempotency and old browser storage. Integration coverage exercises all four role labels across the three plan labels. Browser coverage verifies old seeded checklists become empty for guest/Free/Premium/Lifetime and templates subsequently selected survive reload.

**Results:** Production build, 661 unit tests, 7 targeted browser tests, scoped ESLint, Prettier and architecture checks passed. Local development type configuration restored after the isolated build.
