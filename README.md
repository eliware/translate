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

Translate `en-US.json` into supported Discord locales. Translate Discord command manifests in place.

## Requirements

Use Node.js 26 or later. Get an OpenAI API key. Keep the key in `.env` at the repository root.

## Setup

Install the package with `npm install @eliware/translate`. Create `.env` with `OPENAI_API_KEY=your_api_key`.

## Usage

Run `translate` from a directory with locale files or command manifests. Read [Release Notes](RELEASE_NOTES.md) for version changes.

Locale mode reads `en-US.json` and `prompt.json`. It writes one file for each supported locale and overwrites existing files.

Command mode runs when `en-US.json` is absent. It scans JSON files with string `name` and numeric `type` fields. It rewrites matching files.

## Development

Run `npm install` to install dependencies. Read [documentation](docs/README.md), [agent guidance](AGENTS.md), and [specifications](specs/README.md).

## Testing

Run `npm test` for aggregate checks. Run `npm run lint` for lint checks. Run `npm run format:check` to check formatting.

## Troubleshooting

Check `.env` and `OPENAI_API_KEY` when the CLI reports a setup error. Check the input JSON when the CLI skips a file.

## Security

Keep API keys out of source control. The CLI sends source JSON to OpenAI for translation. Review files before you share them.

## Configuration

Set `OPENAI_API_KEY` in `.env`. Locale mode uses `prompt.json`. Command mode uses `prompt-commands.json`.

## Operations

Run the CLI from the target directory. Translation replaces generated locale files and matching command manifests.

## Commands

`translate` translates locale files or command manifests. Use `translate --help` for command details. Use `translate --version` to show the package version.

## Exit codes

The CLI returns `0` after a successful run. It returns `1` when setup or file processing fails.

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
