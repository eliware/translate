// Entrypoint logic for translation utility, now in src/main.mjs
import path from 'node:path';
import fs from 'node:fs/promises';
import { config as dotenvConfig } from 'dotenv';
import { translateLocale } from './worker.mjs';
import { createProgressBar } from './progress.mjs';
import { getCurrentFilename, getCurrentDirname } from './esm-filename.mjs';

export async function runTranslate({
    fsDep = fs,
    pathDep = path,
    processDep = process,
    dotenvConfigDep = dotenvConfig,
    translateLocaleDep = translateLocale,
    createProgressBarDep = createProgressBar,
    __filenameDep,
    __dirnameDep,
    importMeta = import.meta,
    locales = [
        'bg', 'cs', 'da', 'de', 'el', 'en-GB', 'es-419', 'es-ES', 'fi', 'fr', 'hi', 'hr', 'hu', 'id', 'it', 'ja', 'ko',
        'lt', 'nl', 'no', 'pl', 'pt-BR', 'ro', 'ru', 'sv-SE', 'th', 'tr', 'uk', 'vi', 'zh-CN', 'zh-TW'
    ]
} = {}) {
    const __filename = __filenameDep || getCurrentFilename(importMeta);
    const __dirname = __dirnameDep || getCurrentDirname(importMeta, pathDep.dirname);
    const dotenvPath = pathDep.join(__dirname, '..', '.env');
    try {
        await fsDep.access(dotenvPath);
    } catch (e) {
        processDep.stderr && processDep.stderr.write && processDep.stderr.write('.env file not found\n');
        return 1;
    }
    dotenvConfigDep({ path: dotenvPath });
    const apiKey = processDep.env.OPENAI_API_KEY;
    if (!apiKey) {
        processDep.stderr && processDep.stderr.write && processDep.stderr.write('Missing OPENAI_API_KEY\n');
        return 1;
    }

    const cwd = processDep.cwd();

    // Determine mode: locales mode if en-US.json present in cwd; otherwise commands mode
    const enUSPath = pathDep.join(cwd, 'en-US.json');
    let inLocalesMode = false;
    try {
        await fsDep.access(enUSPath);
        inLocalesMode = true;
    } catch (e) {
        inLocalesMode = false;
    }

    if (inLocalesMode) {
        const promptPath = pathDep.join(__dirname, '..', 'prompt.json');
        let enUSRaw, promptJsonRaw, promptObj;
        try {
            enUSRaw = await fsDep.readFile(enUSPath, 'utf8');
        } catch (e) {
            processDep.stderr && processDep.stderr.write && processDep.stderr.write('Failed to read en-US.json\n');
            return 1;
        }
        try {
            promptJsonRaw = await fsDep.readFile(promptPath, 'utf8');
        } catch (e) {
            processDep.stderr && processDep.stderr.write && processDep.stderr.write('Failed to read prompt.json\n');
            return 1;
        }
        try {
            promptObj = JSON.parse(promptJsonRaw);
        } catch (e) {
            processDep.stderr && processDep.stderr.write && processDep.stderr.write('Failed to parse prompt.json\n');
            return 1;
        }
        if (promptObj && Array.isArray(promptObj.messages)) {
            let replaced = false;
            for (const msg of promptObj.messages) {
                if (msg && Array.isArray(msg.content)) {
                    for (const part of msg.content) {
                        if (part && part.type === 'text' && typeof part.text === 'string' && part.text.includes('{json}')) {
                            part.text = part.text.replace('{json}', enUSRaw);
                            replaced = true;
                        }
                    }
                }
            }
            if (!replaced) {
                if (
                    promptObj.messages[0] &&
                    Array.isArray(promptObj.messages[0].content) &&
                    promptObj.messages[0].content[0] &&
                    typeof promptObj.messages[0].content[0].text === 'string'
                ) {
                    promptObj.messages[0].content[0].text = enUSRaw;
                } else {
                    processDep.stderr && processDep.stderr.write && processDep.stderr.write('Invalid prompt.json structure\n');
                    return 1;
                }
            }
        } else {
            processDep.stderr && processDep.stderr.write && processDep.stderr.write('Invalid prompt.json structure\n');
            return 1;
        }
        const progress = createProgressBarDep(locales.length, processDep.stdout);
        await Promise.all(locales.map(locale =>
            (async () => {
                if (locale === 'en-US') {
                    try {
                        await fsDep.writeFile(pathDep.join(cwd, 'en-US.json'), enUSRaw);
                    } catch (e) {
                    }
                    progress.update(locale);
                    return;
                }
                try {
                    const localePromptObj = JSON.parse(JSON.stringify(promptObj));
                    if (Array.isArray(localePromptObj.messages)) {
                        for (const m of localePromptObj.messages) {
                            if (m && Array.isArray(m.content)) {
                                for (const part of m.content) {
                                    if (part && part.type === 'text' && typeof part.text === 'string' && part.text.includes('{target_locale}')) {
                                        part.text = part.text.replace(/\{target_locale\}/g, locale);
                                    }
                                }
                            }
                        }
                    }
                    const result = await translateLocaleDep({
                        locale,
                        promptObj: localePromptObj,
                        apiKey
                    });
                    await fsDep.writeFile(pathDep.join(cwd, `${locale}.json`), result);
                    progress.update(locale);
                } catch (err) {
                    processDep.stderr && processDep.stderr.write && processDep.stderr.write(`Failed to translate ${locale}\n`);
                    progress.update(locale);
                }
            })()
        ));
        return 0;
    }

    let files;
    try {
        const dirents = await fsDep.readdir(cwd);
        files = dirents.filter(f => f.endsWith('.json'));
    } catch (e) {
        processDep.stderr && processDep.stderr.write && processDep.stderr.write('Failed to read current directory\n');
        return 1;
    }
    if (!files || files.length === 0) {
        processDep.stderr && processDep.stderr.write && processDep.stderr.write('No .json files found — nothing to do\n');
        return 1;
    }

    const commandFiles = [];
    for (const f of files) {
        const p = pathDep.join(cwd, f);
        try {
            const raw = await fsDep.readFile(p, 'utf8');
            const parsed = JSON.parse(raw);
            if (typeof parsed.name === 'string' && typeof parsed.type === 'number') {
                commandFiles.push({ file: f, raw, parsed });
            }
        } catch (e) {
        }
    }
    if (commandFiles.length === 0) {
        processDep.stderr && processDep.stderr.write && processDep.stderr.write('No command JSON manifests detected in this directory\n');
        return 1;
    }

    const promptCmdPath = pathDep.join(__dirname, '..', 'prompt-commands.json');
    let promptCmdRaw, promptCmdObj;
    try {
        promptCmdRaw = await fsDep.readFile(promptCmdPath, 'utf8');
        promptCmdObj = JSON.parse(promptCmdRaw);
    } catch (e) {
        processDep.stderr && processDep.stderr.write && processDep.stderr.write('Failed to read or parse prompt-commands.json\n');
        return 1;
    }

    await Promise.all(commandFiles.map(({ file, raw, parsed }) => (async () => {
        try {
            const cmdPromptObj = JSON.parse(JSON.stringify(promptCmdObj));
            let inserted = false;
            if (Array.isArray(cmdPromptObj.messages)) {
                for (const msg of cmdPromptObj.messages) {
                    if (msg && Array.isArray(msg.content)) {
                        for (const part of msg.content) {
                            if (part && part.type === 'text' && typeof part.text === 'string') {
                                if (part.text.includes('{json}')) {
                                    part.text = part.text.replace('{json}', raw);
                                    inserted = true;
                                    break;
                                }
                            }
                        }
                        if (inserted) break;
                    }
                }
                if (!inserted) {
                    if (cmdPromptObj.messages[0] && Array.isArray(cmdPromptObj.messages[0].content) && cmdPromptObj.messages[0].content[0] && typeof cmdPromptObj.messages[0].content[0].text === 'string') {
                        cmdPromptObj.messages[0].content[0].text += '\n\n' + raw;
                        inserted = true;
                    }
                }
            }
            if (!inserted) {
                processDep.stderr && processDep.stderr.write && processDep.stderr.write(`Could not inject command JSON into prompt for ${file}\n`);
                return;
            }

            const result = await translateLocaleDep({
                locale: '',
                promptObj: cmdPromptObj,
                apiKey
            });

            let out;
            try {
                out = JSON.parse(result);
                await fsDep.writeFile(pathDep.join(cwd, file), JSON.stringify(out, null, 2), 'utf8');
            } catch (e) {
                await fsDep.writeFile(pathDep.join(cwd, file), result, 'utf8');
            }
        } catch (err) {
            processDep.stderr && processDep.stderr.write && processDep.stderr.write(`Failed to translate command file ${file}\n`);
        }
    })()));

    return 0;
}
