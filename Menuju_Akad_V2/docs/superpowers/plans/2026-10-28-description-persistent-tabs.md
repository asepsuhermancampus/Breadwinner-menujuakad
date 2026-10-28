# Description detail and persistent page tabs

Keep the existing routes and customer data intact. Add the calculated total to expense source details and move general notes below a divider in the description dialog. Trace the supplied AVIF line art into a transparent SVG, colored through the project's green token at 25% opacity across this dialog only.

- [x] Add regression tests for source totals and validated URL tab values, preserving unrelated query parameters and hashes.
- [x] Add a shared URL-backed tab hook using native history, with stable server rendering and popstate support. Integrate local page tabs; retain existing route-based tabs. Form/modal draft tabs remain transient.
- [x] Add calculated totals, reordered general notes, and a scoped full-dialog vector background.
- [x] Verify representative customer tabs after refresh and browser navigation, description content and mobile layout; run TypeScript, lint, architecture, unit tests and production browser tests. Restore generated build paths afterwards.

URL values are validated against each page's known tabs. Separate query keys keep nested tabs and context controls independent. Refresh preserves navigation state without saving or restoring unsaved form input.

## Verification

- 150 unit files / 719 tests passed.
- TypeScript and final production build passed; changed-code lint passed with one pre-existing image warning. Architecture passed for 979 modules.
- Five catering/finance browser scenarios passed on production output with isolated account and trial storage, including calculated totals, reordered notes, 25% SVG, filtering and deletion.
- Eleven navigation browser tests passed: ten page/tab selections survive refresh, plus invalid tab recovery and preservation of category/hash/popstate behavior.
- Local desktop and mobile screenshots verified the real traced SVG background, total Rp 240.000 from 40 portions at Rp 6.000, and general notes below the divider.
- Scoped formatting and diff checks passed. Generated Next type and tsconfig build paths restored; main local server retained on port 3201.
