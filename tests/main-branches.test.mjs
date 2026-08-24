import { runTranslate } from '../src/main.mjs';

const base = () => {
  const files = new Map([
    ['prompt-commands.json', '{"messages":[{"content":[{"text":"{json}"}]}]}'],
    ['a.json', '{"name":"a","type":1}'],
    ['bad.json', '{bad']
  ]);
  const fs = {
    access: async file => {
      const value = String(file);
      if (value.endsWith('/en-US.json') || value.endsWith('\\\\en-US.json')) throw Error('missing');
    },
    readFile: async (file) => { const key = String(file).split('/').at(-1); if (!files.has(key)) throw Error('read'); return files.get(key); },
    writeFile: async () => {},
    readdir: async () => ['a.json', 'bad.json', 'note.txt']
  };
  const processDep = { env: { OPENAI_API_KEY: 'key' }, cwd: () => '/cwd', stderr: { write: message => console.log(`ERR:${message}`) }, stdout: {} };
  return { fsDep: fs, processDep, pathDep: { join: (...parts) => parts.join('/'), dirname: p => p.split('/').slice(0, -1).join('/') }, dotenvConfigDep: () => {}, translateLocaleDep: async () => '{"ok":true}', createProgressBarDep: () => ({ update: () => {} }), __filenameDep: '/repo/src/main.mjs', __dirnameDep: '/repo/src' };
};

describe('runTranslate uncovered branches', () => {
  it('translates command manifests and preserves non-JSON output', async () => {
    const deps = base();
    const first = await runTranslate(deps);
    expect(first).toBe(0);
    deps.translateLocaleDep = async () => 'not-json';
    expect(await runTranslate(deps)).toBe(0);
  });

  it('reports command directory and prompt failures', async () => {
    const deps = base();
    deps.fsDep.readdir = async () => { throw Error('no directory'); };
    expect(await runTranslate(deps)).toBe(1);
    const empty = base(); empty.fsDep.readdir = async () => ['note.txt'];
    expect(await runTranslate(empty)).toBe(1);
    const promptFail = base(); promptFail.fsDep.readFile = async file => String(file).endsWith('prompt-commands.json') ? '{bad' : '{"name":"a","type":1}';
    expect(await runTranslate(promptFail)).toBe(1);
  });

  it('handles malformed locale prompts and file errors', async () => {
    const deps = base(); deps.fsDep.readdir = async () => ['en-US.json'];
    deps.fsDep.access = async () => {};
    deps.fsDep.readFile = async file => String(file).endsWith('en-US.json') ? '{}' : '[]';
    expect(await runTranslate(deps,)).toBe(1);
    const readFail = base(); readFail.fsDep.readdir = async () => ['en-US.json'];
    readFail.fsDep.access = async () => {};
    readFail.fsDep.readFile = async file => { if (String(file).endsWith('en-US.json')) throw Error('read'); return '{"messages":[]}'; };
    expect(await runTranslate(readFail)).toBe(1);
  });

  it('covers locale prompt fallbacks and write failures', async () => {
    const fallback = base();
    fallback.fsDep.readdir = async () => ['en-US.json'];
    fallback.fsDep.access = async () => {};
    fallback.fsDep.readFile = async file => String(file).endsWith('en-US.json') ? '{"en":"x"}' : '{"messages":[{"content":[{"text":"plain"}]}]}';
    fallback.translateLocaleDep = async ({ promptObj }) => {
      expect(promptObj.messages[0].content[0].text).toBe('{"en":"x"}');
      return '{}';
    };
    fallback.fsDep.writeFile = async file => { if (String(file).endsWith('en-US.json')) throw Error('write'); };
    expect(await runTranslate({ ...fallback, locales: ['fr', 'en-US'] })).toBe(0);

    const badStructure = base();
    badStructure.fsDep.readdir = async () => ['en-US.json'];
    badStructure.fsDep.access = async () => {};
    badStructure.fsDep.readFile = async file => String(file).endsWith('en-US.json') ? '{}' : '{"messages":[{"content":[]}]}';
    expect(await runTranslate(badStructure)).toBe(1);

    const replacement = base();
    replacement.fsDep.readdir = async () => ['en-US.json']; replacement.fsDep.access = async () => {};
    replacement.fsDep.readFile = async file => String(file).endsWith('en-US.json') ? '{"en":"x"}' : '{"messages":[{"content":[{"type":"text","text":"{json} {target_locale}"}]}]}';
    replacement.translateLocaleDep = async ({ promptObj }) => { expect(promptObj.messages[0].content[0].text).toContain('en'); return '{}'; };
    await expect(runTranslate({ ...replacement, locales: ['fr'] })).resolves.toBe(0);
  });

  it('covers locale read failures and prompt read failures', async () => {
    const enRead = base();
    enRead.fsDep.readdir = async () => ['en-US.json']; enRead.fsDep.access = async () => {};
    enRead.fsDep.readFile = async file => { if (String(file).endsWith('en-US.json')) throw Error('read'); return '{}'; };
    expect(await runTranslate(enRead)).toBe(1);
    const promptRead = base();
    promptRead.fsDep.readdir = async () => ['en-US.json']; promptRead.fsDep.access = async () => {};
    promptRead.fsDep.readFile = async file => { if (String(file).endsWith('prompt.json')) throw Error('read'); return '{}'; };
    expect(await runTranslate(promptRead)).toBe(1);
  });

  it('covers command prompt fallback, injection failure, and translation failure', async () => {
    const append = base();
    append.fsDep.readFile = async file => String(file).endsWith('prompt-commands.json') ? '{"messages":[{"content":[{"text":"plain"}]}]}' : String(file).endsWith('bad.json') ? '{bad' : '{"name":"a","type":1}';
    append.translateLocaleDep = async ({ promptObj }) => { expect(promptObj.messages[0].content[0].text).toContain('name'); return '{}'; };
    expect(await runTranslate(append)).toBe(0);

    const noInject = base();
    noInject.fsDep.readFile = async file => String(file).endsWith('prompt-commands.json') ? '{"messages":[{"content":[]}]}' : '{"name":"a","type":1}';
    expect(await runTranslate(noInject)).toBe(0);

    const translateFail = base();
    translateFail.translateLocaleDep = async () => { throw Error('translate'); };
    expect(await runTranslate(translateFail)).toBe(0);

    const injection = base();
    injection.fsDep.readFile = async file => String(file).endsWith('prompt-commands.json') ? '{"messages":[{"content":[{"type":"text","text":"{json}"}]}]}' : '{"name":"a","type":1}';
    injection.translateLocaleDep = async ({ promptObj }) => { expect(promptObj.messages[0].content[0].text).toContain('name'); return '{}'; };
    expect(await runTranslate(injection)).toBe(0);
  });

  it('covers command directory and manifest branches without stderr', async () => {
    const noStderr = base(); noStderr.processDep = { ...noStderr.processDep, stderr: undefined };
    noStderr.fsDep.readdir = async () => [];
    expect(await runTranslate(noStderr)).toBe(1);
    const noManifest = base(); noManifest.processDep = { ...noManifest.processDep, stderr: undefined };
    noManifest.fsDep.readdir = async () => ['x.json']; noManifest.fsDep.readFile = async () => '{"x":true}';
    expect(await runTranslate(noManifest)).toBe(1);

    const defaults = base();
    defaults.processDep = { env: { OPENAI_API_KEY: 'key' }, cwd: () => '/cwd', stdout: {} };
    defaults.fsDep.readdir = async () => [];
    expect(await runTranslate({ ...defaults, __filenameDep: '', __dirnameDep: '' })).toBe(1);

    const malformedParts = base();
    malformedParts.fsDep.readdir = async () => ['en-US.json']; malformedParts.fsDep.access = async () => {};
    malformedParts.fsDep.readFile = async file => String(file).endsWith('en-US.json') ? '{}' : '{"messages":[null,{"content":[{"type":"text","text":"{json}"}]}]}';
    expect(await runTranslate({ ...malformedParts, locales: [] })).toBe(0);

    const nullLocaleMessage = base();
    nullLocaleMessage.fsDep.readdir = async () => ['en-US.json']; nullLocaleMessage.fsDep.access = async () => {};
    nullLocaleMessage.fsDep.readFile = async file => String(file).endsWith('en-US.json') ? '{}' : '{"messages":[{"content":[{"type":"text","text":"plain"}]},null]}';
    expect(await runTranslate({ ...nullLocaleMessage, locales: ['fr'] })).toBe(0);

    const noMessages = base();
    noMessages.fsDep.readFile = async file => String(file).endsWith('prompt-commands.json') ? '{}' : '{"name":"a","type":1}';
    expect(await runTranslate(noMessages)).toBe(0);

    const emptyMessages = base();
    emptyMessages.fsDep.readFile = async file => String(file).endsWith('prompt-commands.json') ? '{"messages":[]}' : '{"name":"a","type":1}';
    expect(await runTranslate(emptyMessages)).toBe(0);

    const nullCommandMessage = base();
    nullCommandMessage.fsDep.readFile = async file => String(file).endsWith('prompt-commands.json') ? '{"messages":[null]}' : '{"name":"a","type":1}';
    expect(await runTranslate(nullCommandMessage)).toBe(0);

    const plainCommandPart = base();
    plainCommandPart.fsDep.readFile = async file => String(file).endsWith('prompt-commands.json') ? '{"messages":[{"content":[{"type":"text","text":"plain"}]}]}' : '{"name":"a","type":1}';
    expect(await runTranslate(plainCommandPart)).toBe(0);
  });
});
