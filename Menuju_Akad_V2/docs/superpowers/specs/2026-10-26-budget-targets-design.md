# Customer Budget Targets

User requested expanded budget columns, Target instead of Rencana, purpose, description preview with eye disclosure, creation/due dates in Indonesian, priorities, icon actions, duplicate, and manual achieved status with filters. User clarified that achieved means funds collected, not paid.

## Approach

Use status filters in the existing budget table, retaining Ringkasan/Anggaran navigation rather than nesting extra tabs. Default to Belum tercapai. Keep created date below the need name to limit table width. Show cards on mobile. A description dialog exposes full notes; icon buttons expose accessible names. Duplicate opens a prefilled draft, uses a new id/date, and resets achieved status when saved. Delete requires confirmation.

## Data

Keep existing id/title/amount/notes; add optional purpose, createdAt (ISO timestamp), dueDate (YYYY-MM-DD), priority (Rendah/Normal/Tinggi), and completed (funds collected). Existing rows without added fields remain valid; missing priority is Normal, missing completed is false, missing dates remain unknown rather than invented. Existing notes become description.

## Behavior

Filter by status, priority, due bucket, and search text. Overdue means an unachieved target whose due date is before today in Jakarta. Display total target, pending target amount, and achieved count. Keep save failures/drafts and revision conflicts intact. Shared validation applies to account API and trial storage. Printable reports use Indonesian labels and funds-collected semantics.

## Constraints

No payment/refund behavior changes, automatic status from payments, or account data migration that fabricates old dates. Preserve customer layout, heading info, and existing save mechanism. Follow accessible dialog, keyboard, and reduced-motion conventions already in the app.
