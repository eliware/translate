# AGENTS.md

## Project

Maintain `@eliware/translate` as a Node.js 26 ESM CLI. Translate Discord locale files and command manifests with OpenAI.

## Scope and boundaries

Run the CLI from the target repository root. Translation can overwrite locale files and command manifests.

## Layout

Keep implementation modules in `src/`. Keep the CLI in `bin/`. Keep tests in `tests/`. Keep docs in `docs/` and specifications in `specs/`.

## Development

Use native ESM. Keep modules focused. Add a matching test for each source module. Keep `.env` and API keys out of source control.

## Validation

Use Node.js 26 or later. Run `npm test`, `npm run lint`, `npm run audit`, `npm run format`, `npm run format:check`, and `npm run pack`.

## Security

The CLI sends input JSON to OpenAI. Do not include secrets or private data in source files. Review generated files before commit.

## Changes

Update release notes for user-visible changes. Do not publish, push, tag, or release without explicit authorization.

## Application

Locale mode reads `en-US.json` and `prompt.json`. Command mode reads JSON manifests and `prompt-commands.json`. Store `OPENAI_API_KEY` in `.env` at the CLI repository root.

## CLI

Use `translate --help` for usage. Use `translate --version` for the installed version. Exit code 0 means success. Exit code 1 means a setup or processing error.

## npm publication

The public package is `@eliware/translate`. The version in `package.json` sets the package version. Run `npm run pack` before publication. Follow Eliware Operations approval before publication.
