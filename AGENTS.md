# AGENTS.md

## Project

Maintain `@eliware/translate` as a Node.js 26 native ESM CLI.

## Scope and boundaries

Keep repository requirements in `specs/directives.yaml`.

## Layout

Keep launchers in `bin/`, implementation in `src/`, tests in `tests/`, and fixtures in `test-fixtures/`.

## Development

Keep each source and test module focused.

## Validation

Use Node.js 26 or later and native ESM for maintained JavaScript modules.
Run `npm test` for aggregate validation.
Run `npm run lint` for lint checks.
Run `npm run audit` for dependency checks.
Run `npm run format` to format files.
Run `npm run format:check` to check formatting.

## Security

Keep credentials, private user data, and runtime state out of Git.

## Changes

Update `RELEASE_NOTES.md` for user-visible changes.

## Application

Run focused tests first during development.
Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Prevent repeated full-suite runs during development.
Run the full `npm test` suite for final validation before a commit, milestone, or release.

## CLI

Keep `--help` and `--version` read-only.
Document each command, argument, default, error, and exit code.

## npm publication

Use `.github/workflows/npm.yaml` for package publication.
Follow the approved release process before you publish.
