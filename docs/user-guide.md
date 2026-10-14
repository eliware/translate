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

Run `translate` from the target repository root after a global install. Run `npx translate` after a local install.

## Set the API key

The CLI needs an `.env` file in the installed `@eliware/translate` package directory. Put this line in that file:

```text
OPENAI_API_KEY=your_openai_api_key_here
```

For a local install, the package directory is `node_modules/@eliware/translate`. For a global install, run `npm root --global` to find the global module directory. Add `@eliware/translate` to that path.

Keep the real key private. Do not commit the `.env` file. The CLI exits with code `1` if the file or key is absent.

## Translate locale files

Put `en-US.json` in the target repository root. Run `translate` or `npx translate` from that directory. The CLI reads the source file and the bundled `prompt.json` file.

The CLI writes one JSON file for each supported locale. It overwrites existing locale files. Inspect the generated files before you use or share them.
The CLI accepts only valid JSON responses. It does not write an invalid response and returns `1`.
The CLI processes up to five locale translations at a time.

Supported locales:

`bg`, `cs`, `da`, `de`, `el`, `en-GB`, `es-419`, `es-ES`, `fi`, `fr`, `hi`, `hr`, `hu`, `id`, `it`, `ja`, `ko`, `lt`, `nl`, `no`, `pl`, `pt-BR`, `ro`, `ru`, `sv-SE`, `th`, `tr`, `uk`, `vi`, `zh-CN`, and `zh-TW`.

Keep the source JSON valid. Keep its text and keys in the format that your application expects. The CLI sends the source content to OpenAI.

## Translate command manifests

Use command mode when the target root has no `en-US.json` file. Put command manifest JSON files in that directory. Each manifest must have a string `name` field and a numeric `type` field at its top level.

The CLI scans only JSON files in the target root. It skips files that do not match the required fields. It reports files that it cannot read or parse, then continues with other manifests.
The CLI reads the bundled `prompt-commands.json` file.

The CLI sends each detected manifest to OpenAI. It rewrites each detected file in place. It formats valid JSON output with two spaces. It does not write invalid JSON responses. Inspect each file before you use or share it.

## Commands and exit codes

Run the CLI without arguments to translate files:

```sh
translate
```

Use these options to read help or version information:

```sh
translate --help
translate --version
```

The CLI returns `0` after a successful run. It returns `1` when setup fails, input is not usable, or a file fails. The CLI can continue with other files after a file fails. Review the CLI output and generated files after each run.

## Troubleshoot

If the CLI reports a setup error, confirm that `.env` exists in the installed package directory. Confirm that it contains `OPENAI_API_KEY` with a valid key.

If the CLI finds no input, run it from the target repository root. Add `en-US.json` for locale mode. Add valid command manifest JSON files for command mode.

If a file does not change as expected, check its JSON syntax and required fields. Review the CLI output for a translation error.

## Data and security

The CLI sends source JSON and prompts to OpenAI. Use only data that you can send to that service. OpenAI may charge for API use.

Keep API keys out of source control. Review generated files before you share them.
