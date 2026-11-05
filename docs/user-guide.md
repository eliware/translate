# User guide

`@eliware/translate` translates Discord locale JSON files and application command manifests. A locale is a language or region code such as `en-US`. A command manifest is a JSON file that defines one Discord command. The CLI sends source JSON and prompts to OpenAI.

## Requirements

- Use Node.js 26 or later.
- Install `@eliware/translate` with npm.
- Create an OpenAI API key before translation.

## Install

Install the CLI globally:

```sh
npm install --global @eliware/translate
```

Or install the CLI in one project:

```sh
npm install @eliware/translate
```

Run `translate` after a global install. Run `npx translate` after a local install. Run commands from the target repository root.

## Configure the API key

The installed package must contain an `.env` file. The CLI reads this file from the package root. It reads `OPENAI_API_KEY` from the process environment after it loads `.env`.

For a local install, create `node_modules/@eliware/translate/.env`. For a global install, run `npm root --global`, then create `.env` in `@eliware/translate` under that directory.

Add this line to `.env`:

```text
OPENAI_API_KEY=your_openai_api_key_here
```

`OPENAI_API_KEY` has no default value. Write runs require a valid key.

You can copy `.env.example` as a starting point. Keep `.env` private. Do not commit it.

The CLI also requires the `.env` file when `OPENAI_API_KEY` is set in the process environment. A preview run does not read `.env` or require an API key.

## Run modes

The CLI shows help when you run it without arguments or with `--help` alone. Use `--version` alone to show the installed package version. These options do not read project files or contact OpenAI.

The CLI has no subcommands or pass-through arguments. No delimiter is required.

The executable registers process error and shutdown handlers for each run. It removes the handlers when the run ends. A supported shutdown signal runs cleanup before the process exits.

If the current directory contains `en-US.json`, the CLI uses locale mode. If it does not, the CLI uses command mode. Use `--file <path>` to select one command manifest and force command mode.

The CLI previews targets when you omit `--yes`. Add `--dry-run` to request a preview explicitly. A preview does not contact OpenAI or write files. The CLI reads and validates input files to list targets.

Add `--yes` to contact OpenAI and write results. If you also add `--dry-run`, the CLI previews files and does not write them.

## Translate locale files

Put `en-US.json` in the target repository root. Run a preview first:

```sh
npx translate --dry-run
```

Then run the translation:

```sh
npx translate --yes
```

Locale mode reads `en-US.json` from the current directory. It reads the package prompt from `prompt.json`. It writes one file for each supported locale. It does not change the source file `en-US.json`.

The prompt uses model `gpt-6-luna`. The CLI runs five locale requests at most at one time. It checks each response against the source JSON keys, value types, and array lengths before it writes the response.

Supported locales:

`bg`, `cs`, `da`, `de`, `el`, `en-GB`, `es-419`, `es-ES`, `fi`, `fr`, `hi`, `hr`, `hu`, `id`, `it`, `ja`, `ko`, `lt`, `nl`, `no`, `pl`, `pt-BR`, `ro`, `ru`, `sv-SE`, `th`, `tr`, `uk`, `vi`, `zh-CN`, and `zh-TW`.

Keep the source JSON valid. Preserve the keys and value types that your application expects. Read generated files before you use or share them.

## Translate command manifests

Put command manifest JSON files in the target repository root. The CLI scans only that directory and does not scan subdirectories. A command manifest must have a string `name` and numeric `type` at the top level.

The CLI reads the package prompt from `prompt-commands.json`. It translates the command name, description, and localization maps. It keeps other source fields and option structure. It writes valid output to the selected manifest file.

Run a preview for all detected command files:

```sh
npx translate --dry-run
```

Translate one command file with a preview, then write the result:

```sh
npx translate --file lock.json --dry-run
npx translate --file lock.json --yes
```

The file path can be relative to the current directory or absolute. The file must use the `.json` extension. It must contain a command manifest.

The CLI checks command names and localized names for nonempty text and a maximum of 32 characters. It checks descriptions and localized descriptions for nonempty text and a maximum of 100 characters. Command localization keys can use any locale listed above or `en-US`. The CLI also checks command option objects and context command restrictions.

The CLI overwrites each valid manifest after a valid response. If one file fails, the CLI can continue with other files. It returns exit code `1` if any file fails. Save a copy of important files before a write run.

## Debug errors

Add `--debug` to print error details to standard error. In command mode, validation details identify the failed field and the rule. For example, the CLI can report that a localized description exceeds 100 characters.

```sh
npx translate --file lock.json --yes --debug
```

The CLI can continue with other files after one file fails. A run returns exit code `1` if any file fails.

## Options and exit codes

| Option          | Purpose                                           |
| --------------- | ------------------------------------------------- |
| `--help`        | Show usage.                                       |
| `--version`     | Show the installed package version.               |
| `--dry-run`     | List targets without API requests or file writes. |
| `--yes`         | Send API requests and write valid results.        |
| `--file <path>` | Select one command manifest and use command mode. |
| `--debug`       | Show error details on standard error.             |

Processing options can appear in any order. Use `--help` or `--version` alone. The CLI returns `0` when all selected files complete. It returns `1` when setup, input, translation, or file processing fails.

The CLI has no child commands or pass-through arguments. No delimiter is required.

## Package contents and releases

The npm package is named `@eliware/translate`. Its public executable is `translate`, declared in `package.json` and launched from `bin/translate.mjs`.

The published package contains `package.json`, `src/`, `bin/`, `docs/`, `specs/`, `README.md`, `AGENTS.md`, `LICENSE`, `RELEASE_NOTES.md`, `.env.example`, `prompt.json`, and `prompt-commands.json`. It does not contain `package-lock.json`, `tests/`, or `test-fixtures/`.

The package version follows `MAJOR.MINOR.PATCH` format. Run `translate --version` to see the installed version. The approved npm workflow controls publication. Installing the package does not publish it.

## Troubleshoot

If the CLI reports a setup error, make sure that `.env` exists in the installed package root. Check that `OPENAI_API_KEY` contains a valid key.

If locale mode cannot find input, run the CLI from the directory that contains `en-US.json`.

If command mode cannot find a manifest, run the CLI from the directory that contains command JSON files. Check that each manifest has a string `name` and numeric `type`.

If the CLI rejects a response, add `--debug` and check the reported field and rule. Check JSON syntax and Discord character limits before you run the command again.

## Data and costs

The CLI sends source JSON and prompt text to OpenAI. Send only data that you can share with OpenAI. OpenAI may charge for API requests.

Keep API keys out of source control. Read generated files before you share them.
