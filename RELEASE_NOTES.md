# Release Notes

## 12.0.0 — 2026-10-13

### Added

The CLI supports `--help` and `--version`.

### Changed

The CLI now requires Node.js 26 or later. OpenAI requests use the shared `@eliware/openai` client and the Responses API. Shared runtime tools handle logs, errors, and process signals.
