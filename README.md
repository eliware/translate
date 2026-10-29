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

Translate `en-US.json` into supported Discord locales. Translate Discord command manifests.

## Requirements

Use Node.js 26 or later. Use an OpenAI API key.

## Setup

Install the package with `npm install @eliware/translate`. Create `.env` at the installed package root. Set `OPENAI_API_KEY` in that file.

## Usage

Run `translate --yes` from the target repository root to translate files. Read the [user guide](docs/user-guide.md) for setup and use. Read the [release notes](RELEASE_NOTES.md) for changes.

## Development

Run `npm install` to install dependencies. Read [documentation](docs/README.md) and [specifications](specs/README.md).

## Testing

Run `npm test` for aggregate checks. Run `npm run lint` for lint checks.

## Troubleshooting

Check `.env` and `OPENAI_API_KEY` when setup fails. Check the input JSON when the CLI skips a file.

## Security

Keep API keys out of source control. The CLI sends source JSON to OpenAI. Examine generated files before you share them.

## Configuration

Set `OPENAI_API_KEY` in `.env` at the installed package root. Locale mode uses `prompt.json`. Command mode uses `prompt-commands.json`.

## Operations

Run the CLI from the target repository root. The CLI writes files only when you use `--yes`. It can overwrite existing locale files and command manifests.

## Commands

Run `translate` or `translate --help` to read the help text. Run `translate --dry-run` to list target files.
Run `translate --yes` to send API requests and write translations. Run `translate --version` to show the package version.
Run `translate --file lock.json --dry-run` to list one command manifest. Add `--debug` to show error details.

## Exit codes

The CLI returns `0` when a run completes without errors. It returns `1` when setup or file processing fails.

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
