# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/translate [![npm version](https://img.shields.io/npm/v/@eliware/translate.svg)](https://www.npmjs.com/package/@eliware/translate) [![license](https://img.shields.io/github/license/eliware/translate.svg)](LICENSE) [![build status](https://github.com/eliware/translate/actions/workflows/nodejs.yml/badge.svg)](https://github.com/eliware/translate/actions)

A CLI tool for translating Discord JSON files with OpenAI.

It supports two workflows:

- Locale translation: translate `en-US.json` into all other supported Discord locales in the same directory.
- Command manifest translation: translate Discord application command JSON files in the current directory.

## Features

- Translates `en-US.json` to supported Discord locales
- Can also process command manifest JSON files in place
- Parallel translation with a simple progress indicator
- Uses OpenAI chat completions
- Designed for use with the skeleton Discord.js app template

## Requirements

- Node.js 26 or newer
- An OpenAI API key
- A `.env` file next to the repository root

## Installation

```sh
cd /path/to
# Clone the repository
git clone https://github.com/eliware/translate.git
cd translate
npm install
# Copy and edit the .env file
cp .env.example .env
# Run the required validation
npm test
npm run lint
# Optional: symlink for global CLI usage
# Requires sudo/root
ln -s /path/to/translate/translate.mjs /usr/local/bin/translate
```

## Setup

1. Obtain an OpenAI API key and add it to your `.env` file:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

2. For locale translation, place your English source translations in `en-US.json` in the directory you want to process.
3. For command translation, place Discord command manifest JSON files in the directory you want to process.

## Usage

### Locale translation

```sh
cd /path/to/your/locales/
translate
```

If `en-US.json` exists in the current directory, the tool will:

- read `en-US.json`
- load `prompt.json`
- generate translations for all supported locales
- write files such as `fr.json`, `de.json`, and `zh-CN.json` into the same directory

Existing locale files are overwritten.

### Command manifest translation

```sh
cd /path/to/your/commands/
translate
```

If `en-US.json` is not present, the tool will scan the current directory for `.json` files that look like Discord command manifests. Files must contain at least:

- `name` as a string
- `type` as a number

Each matching file is then passed through `prompt-commands.json`, and the result is written back to the same file.

## Supported Locales

Discord locales supported by the locale workflow include:

bg, cs, da, de, el, en-GB, es-419, es-ES, fi, fr, hi, hr, hu, id, it, ja, ko, lt, nl, no, pl, pt-BR, ro, ru, sv-SE, th, tr, uk, vi, zh-CN, zh-TW

## Prompt Templates

- `prompt.json` is used for locale translation.
- `prompt-commands.json` is used for command manifest translation.
- The locale workflow replaces `{json}` with the raw contents of `en-US.json` when that placeholder is present.
- Both workflows support `{target_locale}` in prompt text.

## Project Structure

- `src/` - Main source code
- `tests/` - Test suite
- `prompt.json` - Locale translation prompt template
- `prompt-commands.json` - Command translation prompt template
- `translate.mjs` - CLI entry point

## Support

For help or questions, join the community and chat with the author:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)  
**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## License

[MIT © 2025 Eli Sterling, eliware.org](LICENSE)

## Links

- [Home Page](https://eliware.org)
- [GitHub Repo](https://github.com/eliware/translate)
- [GitHub Org](https://github.com/eliware)
- [GitHub Personal](https://github.com/eli-sterling)
- [Discord](https://discord.gg/M6aTR9eTwN)
