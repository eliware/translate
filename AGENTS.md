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

Run `npm test`, `npm run lint`, `npm run audit`, `npm run format`, `npm run format:check`, and `npm run pack`.

## Security

The CLI sends input JSON to OpenAI. Keep secrets and private data out of source files.

## Changes

Update release notes for user-visible changes. Do not publish, push, tag, or release without approval.

## Application

Locale mode reads `en-US.json` and `prompt.json`. Command mode reads JSON manifests and `prompt-commands.json`. Set `OPENAI_API_KEY` in `.env` at the installed package root.

## CLI

Use `translate --help` for usage. Use `translate --version` for the package version. Exit code `0` means success. Exit code `1` means setup or processing failure.

## npm publication

Run `npm run pack` before publication. Follow Eliware Operations approval before publication.
