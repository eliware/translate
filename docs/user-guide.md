# User guide

`@eliware/translate` translates Discord locale files and command manifests. Run it from the target repository root. The CLI sends input JSON to OpenAI.

## Requirements

- Use Node.js 26 or later.
- Create an OpenAI API key.
- Install `@eliware/translate` with npm.

## Install

Install the CLI for all projects:

```sh
npm install --global @eliware/translate
```

Or install the CLI in one project:

```sh
npm install @eliware/translate
```

Run `translate --yes` from the target repository root after a global install. Run `npx translate --yes` after a local install.

## Set the API key

The CLI uses an `.env` file in the installed `@eliware/translate` package directory. Add this line to that file:

```text
OPENAI_API_KEY=your_openai_api_key_here
```

For a local install, the package directory is `node_modules/@eliware/translate`. For a global install, run `npm root --global` to find the global module directory. Add `@eliware/translate` to that path.

Keep the API key private. Do not commit the `.env` file. The CLI exits with code `1` if the file or key is missing.

## Translate locale files

Put `en-US.json` in the target repository root. Run `translate --yes` or `npx translate --yes` from that directory. The CLI reads the source file and the bundled `prompt.json` file.

Run `translate --dry-run` to list target files. The CLI does not call OpenAI or write files in this mode. This mode does not read `.env` or use an API key.

Run `translate --yes` to call OpenAI and write translated files. The CLI can overwrite existing locale files.

The CLI accepts only responses that keep the source JSON keys, arrays, and value types. It returns `1` and does not write a response with a different structure.

The CLI runs a maximum of five locale translations at one time.

Supported locales:

`bg`, `cs`, `da`, `de`, `el`, `en-GB`, `es-419`, `es-ES`, `fi`, `fr`, `hi`, `hr`, `hu`, `id`, `it`, `ja`, `ko`, `lt`, `nl`, `no`, `pl`, `pt-BR`, `ro`, `ru`, `sv-SE`, `th`, `tr`, `uk`, `vi`, `zh-CN`, and `zh-TW`.

Keep the source JSON valid. Keep its text and keys in the format that your application expects. The CLI sends the source content to OpenAI.

## Translate command manifests

Use command mode when the target root has no `en-US.json` file. Put command manifest JSON files in that directory. Each manifest must have a string `name` field and a numeric `type` field at its top level.

The CLI scans only JSON files in the target root. It skips files that do not match the required fields. It reports files that it cannot read or parse, then continues with other manifests.
The CLI reads the bundled `prompt-commands.json` file.

The CLI keeps source fields and option structure. It updates command names, descriptions, and localization maps.

The CLI formats valid JSON output with two spaces. It does not write invalid JSON responses.

Run `translate --dry-run` to list command files. The CLI does not call OpenAI or write files in this mode. This mode does not read `.env` or use an API key.

Run `translate --yes` to call OpenAI and write translated command files. The CLI can overwrite existing command files.
Command names and localized names must contain 1 to 32 characters. Description fields must contain 1 to 100 characters.

Use `translate --file lock.json --dry-run` to list one command file. Use `translate --file lock.json --yes` to translate that file.

Add `--debug` to show the failed field and its cause when a command response fails.

## Commands and exit codes

Run `translate` or `translate --help` to read usage. Run `translate --dry-run` to list target files.

```sh
translate --dry-run
```

Use these options to read help or version information:

```sh
translate --help
translate --version
translate --yes
translate --file lock.json --dry-run
translate --file lock.json --yes --debug
```

The CLI returns `0` when a run completes without errors. It returns `1` when setup fails, input is not usable, or a file fails.

The CLI can continue with other files after a file fails. Examine the CLI output and generated files after each run.

## Troubleshoot

If the CLI reports a setup error, check that `.env` exists in the installed package directory. Check that the file contains `OPENAI_API_KEY` with a valid key.

If the CLI finds no input, run it from the target repository root. Add `en-US.json` for locale mode.

If the target has no `en-US.json` file, add valid command manifest JSON files for command mode.

If a file does not change as expected, check its JSON syntax and required fields. Examine the CLI output for a translation error.

## Data use

The CLI sends source JSON and prompts to OpenAI. Send only data that you can share with OpenAI. OpenAI may charge fees for API use.

Keep API keys out of source control. Examine generated files before you share them.
