# Release Notes

## 15.1.1 — 2026-11-05

### Added

- Check chat input command names and localized names against Discord naming rules.
- Validate primary entry point commands and preserve valid description translations.
- Report invalid command JSON files when the CLI scans a folder.

### Changed

- Set the package version to `15.1.1` and refresh compatible dependency versions in the lock file.
- Correct the package and README descriptions to capitalize Discord and describe both translation modes.
- Limit command translation requests to five at a time.
- Split CLI argument handling, command file handling, merging, and validation into focused modules.
- Expand the user guide and clarify CLI setup, previews, validation, and file handling.

### Fixed

- Keep description localizations on nested command options and primary entry point commands.
- Make the missing configuration test portable across Windows and Linux.
- Isolate configuration tests from checkout `.env` files and inherited API keys.

## 15.1.0 — 2026-11-02

### Added

- Add `--file` to translate one command manifest.
- Add `--debug` to show validation details and error causes.
- Add a user guide for installation, configuration, and translation.

### Changed

- Use `gpt-6-luna` for locale and command translations.
- Validate translation responses before file writes and preserve command fields and option structure.
- Set the package version to `15.1.0`.
- Upgrade npm dependencies. Set `@eliware/test` to `15.1.0`.
- Update CI and deployment workflows.

## 12.0.0 — 2026-10-14

### Added

- Add `translate --dry-run` to list target files without API calls or file writes.
- Require `translate --yes` before the CLI sends API requests or writes files.
- Show help when users run `translate` without flags.
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
