# Release Notes

## 15.0.1 — 2026-10-28

### Changed

- Use `gpt-6-luna` for locale and command translations.
- Add `--file` to translate one command manifest and `--debug` to show validation details.
- Set the package version to `15.0.1`.
- Update dependencies to current releases.

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
