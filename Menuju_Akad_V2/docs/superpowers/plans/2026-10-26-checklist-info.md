# Checklist Info Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans for this small inline change.

**Goal:** Keep the checklist heading compact with a clickable info icon.

**Architecture:** A local React disclosure beside the existing heading displays an absolutely positioned explanation. Reuse the existing Icon and theme tokens without dependencies.

**Tech Stack:** React, TypeScript, CSS Modules.

**Spec:** User approved the proposed heading with an info icon and click-to-open explanation in the conversation.

## Global Constraints

- Keep heading and icon on one line; keep the add-task action responsive.
- Copy: “Bagi tanggung jawab dengan pasangan, tentukan prioritas dan tenggat, lalu tandai tugas yang sudah selesai.”
- Close on repeat click, outside click, or Escape; support touch and keyboard.

## Review Focus

- Mobile width: explanation must fit the viewport.
- Opening help must not shift the task list.
- Escape must preserve focus on the trigger.
- Button must expose its name and expanded state.
- Existing task actions must remain accessible.

## Task 1: Compact heading

- [x] Add local task heading component and scoped styles; replace the subtitle in tasks-screen.tsx.
- [x] Verify formatting, ESLint, and TypeScript.
- [x] Check desktop/mobile appearance and disclosure interactions in the browser against the local server.

Verification: TypeScript, focused ESLint, and Prettier checks passed. Chromium checks passed at 1440px, 375px, and 320px for heading alignment, toggle, keyboard opening, Escape with restored focus, outside click, viewport fit, and no layout shift. Inspected the mobile screenshot.

Ruling: This is a reversible UI adjustment for local evaluation. Use focused browser verification rather than adding permanent tests; leave existing unrelated workspace edits intact.
