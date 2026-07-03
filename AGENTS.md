# AGENTS.md (/opt/translate)

## What this repo is

@eliware/translate is a Node.js CLI that translates Discord JSON files with OpenAI.

Modes:
- Locale mode: if current dir contains en-US.json, it generates supported locale files in place.
- Command mode: otherwise it translates Discord command manifest JSON files in place.

## Important files

- translate.mjs: CLI entry point
- src/main.mjs: mode selection, file I/O, orchestration
- src/openai.mjs: OpenAI SDK call
- src/worker.mjs: wrapper around OpenAI call
- src/progress.mjs: simple progress output
- src/prompt.mjs: prompt loader helper
- prompt.json: locale prompt template
- prompt-commands.json: command prompt template
- tests/: Jest tests

## Rules for agents

- Read README.md before changing behavior.
- Keep edits small and focused.
- Preserve existing ESM/.mjs style.
- Add or update tests when behavior changes.
- Use npm test to verify changes.
- Treat code as source of truth if docs disagree.

## Runtime assumptions

- .env must exist one level above the repo root.
- OPENAI_API_KEY must be set there.
- Locale mode uses en-US.json in the current working directory.
- Command mode scans the current working directory for .json command manifests.

## Prompt behavior

- Locale mode loads prompt.json.
- Command mode loads prompt-commands.json.
- {json} may be replaced with raw source JSON.
- {target_locale} may be replaced in prompt text.

## Do not

- Do not run destructive file operations unless requested.
- Do not change generated outputs unless the task is about output behavior.
- Do not broaden scope without a clear reason.
