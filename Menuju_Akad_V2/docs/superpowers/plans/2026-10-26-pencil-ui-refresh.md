# Pencil batches 1–7 UI refresh implementation plan

**Goal:** Apply the current Pencil document's Eco-Tech & Health Growth design to existing UI while preserving implemented behavior.

**Source:** Active Pencil document c5a247e7-ec44-4202-b361-d7caca1734c1, read on 2026-10-26. Representative frames MNC2H, RaRRu, Ocnbb, KFema, orG6X, A5HAQ, r8jyq and master QJYKQ.

**Architecture:** Update shared CSS tokens, local fonts and presentation components in place. Keep state, services, endpoints, permissions, payment flows and invitation document content intact. Existing React, Next.js 16.4.2, Tailwind 4 and CSS Modules remain in use. User requested immediate execution and a checkpoint; checkpoint is 3aac4fe. Execute inline.

## Tasks

- [x] Shared foundations: mint #F4FBF7, white surfaces, emerald #10B981, ink #052E16, secondary #4B5563, borders #D1FAE5; heading Plus Jakarta Sans, body Inter, mono JetBrains Mono; 10px controls, 16px cards. Retain separate semantic success/warning/danger/info colors.
- [x] Batch 1: centered authentication card and connected customer shell (272/68px dock, 12px inset, 76px header, 10px exterior corners). Preserve auth form and all account/navigation actions.
- [x] Batch 2: light mint greeting, emerald readiness ring, quieter priority list and mint agenda. Retain live readiness, checklist mutations, event switch and trial persistence.
- [x] Batches 3–5: apply shared foundations to finance, CRM, invitation management and guest UI; remove legacy warm palette from application chrome; preserve user theme data and invitation templates.
- [x] Batch 6: match studio panel backgrounds, mint canvas surround, selection controls and heading typography without changing editor state or preview data.
- [x] Batch 7: connect operations dock and canvas, quiet active navigation, preserve role switching and operations restrictions.
- [x] Verify: formatting, lint, typecheck, unit tests and production build. Run existing customer layout/workflow and operations style browser tests; add focused computed-style assertions for the new design and inspect desktop/mobile screenshots.

## Review focus

Keep keyboard and mobile navigation reachable; prevent horizontal overflow; maintain contrast on emerald actions; preserve payment/provider and login results; do not alter stored editor themes or business calculations. Existing tests provide behavioral regression coverage; focused browser checks cover typography, palettes and shell geometry.
