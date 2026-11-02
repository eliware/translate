# AGENTS.md

## Project

Maintain `@eliware/translate` as a Node.js 26 native ESM CLI.

## Scope and boundaries

Translate Discord locale JSON files and application command manifests in a target repository.

## Layout

Keep launchers in `bin/`, implementation in `src/`, tests in `tests/`, and fixtures in `test-fixtures/`.

## Development

Add tests for behavior changes. Keep each module focused. Keep credentials and private user data out of Git.

## Validation

Use Node.js 26 and native ESM.
Run `npm test` for aggregate validation.
Run `npm run lint` for lint checks.
Run `npm run audit` for dependency checks.
Run `npm run format` to format files.
Run `npm run format:check` to check formatting.

## Security

Send only data that you can share with OpenAI. Keep API keys out of source control.

## Changes

Update `RELEASE_NOTES.md` for user-visible changes. Follow the approved process before publication.

## Application

Run focused tests first during development.
Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Prevent repeated full-suite runs during development.
Run the full `npm test` suite for final validation before a commit, milestone, or release.

## CLI

Keep `--help` and `--version` read-only. Document options and exit codes in the user guide.

## npm publication

Use `.github/workflows/npm.yaml` for publication. Follow Eliware Operations approval before publishing.
