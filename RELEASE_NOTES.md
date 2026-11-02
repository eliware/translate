# Release Notes

## 15.1.0 — 2026-11-02

### Added

- Add command manifest translation, single-file selection with `--file`, and `--debug` validation details.
- Add a user guide for installation, configuration, and translation.

### Changed

- Use `gpt-6-luna` for locale and command translations.
- Validate translation responses before file writes and preserve command fields and option structure.
- Update dependencies. Upgrade `@eliware/test` to `15.1.0`.
- Align CI and deployment workflows with current repository conventions.

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
