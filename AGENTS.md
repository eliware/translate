# AGENTS.md

## Project

Maintain `@eliware/translate` as a Node.js 26 native ESM CLI.

## Scope and boundaries

Translate Discord locale files and command manifests. Run the CLI from the target repository root.

## Layout

Keep source modules in `src/`. Keep the CLI in `bin/`. Keep tests in `tests/` and fixtures in `test-fixtures/`.

## Development

Use native ESM. Add tests for behavior changes. Keep API keys and user locale data out of source control.

## Validation

Run `npm test`.
Run `npm run lint`.
Run `npm run audit`.
Run `npm run format`.
Run `npm run format:check`.
Run `npm run pack`.

## Security

The CLI sends input JSON to OpenAI. Keep secrets and private data out of source files.

## Changes

Update release notes for user-visible changes. Do not publish, push, tag, or release without approval.

## Application

Locale mode reads `en-US.json` and `prompt.json`.
Command mode reads JSON manifests and `prompt-commands.json`.
Set `OPENAI_API_KEY` in `.env` at the installed package root.

Run focused tests first during development.
Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Prevent repeated full-suite runs during development.
Run the full `npm test` suite for final validation before a commit, milestone, or release.

## CLI

Use `translate --help` for usage. Use `translate --version` for the package version. Exit code `0` means success. Exit code `1` means setup or processing failure.

## npm publication

Run `npm run pack` before publication. Follow Eliware Operations approval before publication.
