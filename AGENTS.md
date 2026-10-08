# Project context

## Resume source of truth

- Use the `$pas-resume-coach` skill when Akshit starts a resume-refinement session, asks to work on his resume, approves resume edits, or asks for resume-to-role matching.
- When Akshit says "my resume", use `PAS_Resume_MASTER.pdf` (file ID `1kYGzulxSB2IzTGVUNvkZLWY8cSP-aCne`) from the connected Google Drive folder `PAS_Resume`.
- `PAS_Resume_MASTER.pdf` is the only canonical resume and the application-ready file. Fetch it again at the start of resume, job-search, or role-matching work; do not rely on remembered text or an older export.
- `PAS_Resume_SYNC_SOURCE` (Google Doc ID `1Sz8ZeQ3tq2q1SOKLq2Zt5NLqlLOHxlZoYioQ2DoDhPc`) is a text mirror used only because PAS currently ingests Google Docs. It is not a second master and must not override the PDF.
- Keep proposed edits as drafts until approved. After approval, update the master PDF first, then mirror its approved resume text into `PAS_Resume_SYNC_SOURCE` and verify both artifacts.
- If Google Drive is unavailable or disconnected, say so instead of silently using stale resume text.

## Communication

- Always end user-facing task handoffs with clear, concrete next steps.

## City feature parity

- Treat every supported city as a first-class experience at the same feature level.
- A city is not complete unless it supports the same map, list, matches, upside, search, filtering, mobile, metadata/PWA, validation, and data-quality capabilities as every other city.
- Build shared functionality through city configuration and shared components; do not introduce city-specific feature gaps.
- When adding or changing a cross-city feature, verify it for every supported city before handoff.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Conversational system of intelligence — 2026-10-08

Working Class Hero is the durable intelligence backend for Robby. For company discussions, read `docs/SYSTEM.md`, get the research framework, resolve identity, and recall the investigation plus owner context before answering. Use the `system` CLI or authenticated MCP tools to save every available relevant turn, explicitly marking summaries versus exact supplied text. Record sourced evidence, stated interests, decisions, unresolved questions and generated outputs. Retry unchanged saves with the same request ID. Follow recall cursors when relevant context is older. The host chooses voice, report or sandboxed UI according to the question. The React site remains an optional view. Never claim unseen speech was recorded or an external Robby host is connected without a successful tool call. Private credentials live in `.env.intelligence.local`; never expose or commit them.

Version 2 resilience: prefer atomic `save_turn` and `get_investigation_context`; distinguish database-confirmed writes, local queued writes and stale cached reads. The Mac outbox must be preserved and retried unchanged. Use `search_memory` for relevant older context. Create an encrypted, restore-verified backup at a substantive session checkpoint and mirror it to the existing private Drive memory folder when available. Report pending off-device backups honestly. `docs/SYSTEM.md` contains the recovery contract.
