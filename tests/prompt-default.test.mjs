import { jest } from '@jest/globals';

const readFile = jest.fn().mockResolvedValue('hello {target_locale}');
jest.unstable_mockModule('node:fs/promises', () => ({ readFile }));
const { loadPrompt } = await import('../src/prompt.mjs');

it('loads the default filesystem implementation', async () => {
  await expect(loadPrompt('prompt.json', 'de')).resolves.toBe('hello de');
});
