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

Translate Discord locale JSON files or Discord application command manifests with OpenAI.

## Requirements

Use Node.js 26 or later. Create an OpenAI API key before translation.

## Setup

Install `@eliware/translate` globally with `npm install --global @eliware/translate` or locally with `npm install @eliware/translate`.
Create `.env` in the installed package directory. Set `OPENAI_API_KEY` in that file.

## Usage

Run the CLI from the target repository root. Read the [user guide](docs/user-guide.md) for setup, modes, and options. Read [release notes](RELEASE_NOTES.md) for package changes.

## Development

Read the [documentation index](docs/README.md) and [specifications index](specs/README.md) before you change repository files.

## Testing

Run `npm test` for aggregate validation.

## Troubleshooting

Use `--debug` to show error details. Check the input JSON and package `.env` file when a run fails.

## Security

The CLI sends source JSON and prompts to OpenAI. Keep secrets and data that you cannot share out of source files.

## Configuration

Locale mode reads `en-US.json` and the package prompt `prompt.json`. Command mode reads command manifests and `prompt-commands.json`.

## Operations

The CLI previews targets when you omit `--yes`. Use `--dry-run` to request a preview. Use `--yes` to send requests and write translation files. A write run can overwrite target files.

## Commands

Run `translate --help` to show usage. Run `translate --version` to show the installed package version. Run the CLI without arguments to show help.
Use `--file <path>` to select one command manifest. Add `--debug` to show error details.

## Exit codes

The CLI returns `0` when the run succeeds. It returns `1` when setup, input, translation, or file processing fails.

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
