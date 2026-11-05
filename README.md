# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/translate [![npm](https://img.shields.io/npm/v/@eliware/translate)](https://www.npmjs.com/package/@eliware/translate) [![License](https://img.shields.io/github/license/eliware/translate)](https://github.com/eliware/translate/blob/main/LICENSE) [![CI](https://github.com/eliware/translate/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/translate/actions/workflows/ci.yaml)

A tool for translating locale files for discord apps built on @eliware/discord

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [Configuration](#configuration)
- [Operations](#operations)
- [Commands](#commands)
- [Exit codes](#exit-codes)
- [Support](#support)
- [Links](#links)
- [License](#license)

## Features

Translate Discord locale JSON files or application command manifests with OpenAI.

## Requirements

Use Node.js 26 or later. Create an OpenAI API key before a write run.

## Setup

Install `@eliware/translate` globally with `npm install --global @eliware/translate` or locally with `npm install @eliware/translate`. Set `OPENAI_API_KEY` in an `.env` file in the installed package root.

## Usage

Run the CLI from the target repository root. Read the [user guide](docs/user-guide.md) for setup, modes, options, and file changes. Read [release notes](RELEASE_NOTES.md) for package changes.

## Development

Read the [documentation index](docs/README.md) and [specifications index](specs/README.md) before you change repository files.

## Testing

Run `npm test` for aggregate validation.

## Troubleshooting

Use `--debug` to show error details. Check the input JSON and the installed package `.env` file when a write run fails.

## Security

The CLI sends source JSON and prompt text to OpenAI. Send only data that you can share with OpenAI. Keep API keys out of source control.

## Configuration

Write runs require `OPENAI_API_KEY` and an `.env` file in the installed package root. A preview does not read `.env` or require the API key. Locale mode reads `prompt.json`. Command mode reads `prompt-commands.json`.

## Operations

Run `translate --dry-run` before a write run. Add `--yes` to send requests and write files. Locale mode writes translated locale files and leaves `en-US.json` unchanged. Command mode overwrites valid command manifests, or only the manifest selected with `--file`. The CLI does not write files when you add `--dry-run`.

## Commands

Run `translate --help` to show usage. Run `translate --version` to show the installed package version. Run `translate` without arguments to show help. The CLI has no subcommands or pass-through arguments. No delimiter is required.

## Exit codes

| Code | Meaning                                               |
| ---- | ----------------------------------------------------- |
| `0`  | The command completed successfully.                   |
| `1`  | Setup, input, translation, or file processing failed. |

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)[![eliware.org](https://eliware.org/logos/eliware_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## Links

- [Home Page](https://eliware.org)
- [GitHub Org](https://github.com/eliware)
- [GitHub Repo](https://github.com/eliware/translate)
- [Bug Reports](https://github.com/eliware/translate/issues)
- [npm](https://www.npmjs.com/package/@eliware/translate)
- [Discord](https://discord.gg/M6aTR9eTwN)

## License

[MIT © Eliware](LICENSE)
