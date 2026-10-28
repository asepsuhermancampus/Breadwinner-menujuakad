# Couple Savings and Budget Allocation

User-approved rule: each logged-in account can manually add/subtract only its own assigned groom/bride savings. Both workspace members may fund a budget from either savings side without approval. No additional password. All actions have server timestamp and actor attribution.

## Experience

Tabs Ringkasan, Tabungan, Anggaran. Savings has combined balance and two columns (groom left, bride right), responsive stacked cards on phones. Each side has balance, own-account adjustment controls, and a bounded scroll history containing date and signed amount only. Positive green, negative red. Inputs group rupiah digits by thousands. Deposit sources Gaji, Sampingan/Freelance, Jualan/Dagang, or custom; withdrawal notes explain purpose. A one-time account-side selection establishes ownership without assuming workspace owner is groom.

Budget completion opens source confirmation with both current balances. Allocation deducts the current target once and marks completed atomically. Releasing/deleting a funded budget credits the same source with a linked reversal, never erases history. An already-completed legacy budget never causes retroactive deductions. Funded targets cannot change amount before release. Form completion checkbox is replaced by explicit allocation flow.

Summary shows combined and individual balances, outstanding budget needs, allocation totals, and funding coverage. Savings report uses a landscape printable PDF layout with paired side-by-side full histories, source, note, actor, timestamps, signed colors, individual balances and combined total; Save as PDF uses browser print to preserve long/Unicode notes without dependencies.

## Persistence and access

Use a dedicated authenticated command API, checked workspace membership, immutable account-side binding while active, integer rupiah, sufficient balance, revision checks, and idempotent request ids. Store ledger and budget changes within one SQLite transaction. A shared pure reducer supports isolated trial simulation; trial is explicitly identified and is not real two-account security. Keep legacy budget JSON in finance resource for compatibility/export. Guard old generic writes against bypassing allocations or altering funded amounts. Poll and refresh on focus with revision ordering; failed saves preserve forms.

## Validation

Tests must cover manual cross-side denial, budget cross-side allowance, no overdraft, retries, double funding, rollback, reversals, membership/revocation, legacy budgets, metadata preservation, trial atomicity, currency input, source validation, report escaping and pagination layout, and mobile/keyboard flows.
