# Release Notes

## 13.0.0 — 2026-10-17

### Added

- Add `translate --dry-run` to list target files without API calls or file writes.

### Changed

- Require `translate --yes` before the CLI sends API requests or writes files.
- Show help when users run `translate` without flags.
- Update the package and dependency versions for convention 13.

## 12.0.0 — 2026-10-14

### Added

- Add `translate --help` and `translate --version`.
- Add command mode for Discord application command manifests.
- Add a user guide for setup, use, configuration, and error handling.
- Add CI and release workflows for validation and npm publication.

### Changed

- Require Node.js 26 or later.
- Use `@eliware/openai` for OpenAI requests and `@eliware/common` for logs, errors, and process signals.
- Preserve source fields and option structure when the CLI updates locale files and command manifests.
- Limit request concurrency and validate translation output before file writes.
- Validate command names, descriptions, and localization keys against Discord limits and supported locales.
- Report file read and write errors, then continue with other files.
- Use ESM modules and focused helpers across the CLI.
