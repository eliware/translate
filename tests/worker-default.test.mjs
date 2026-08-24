import { jest } from '@jest/globals';

const callOpenAI = jest.fn().mockResolvedValue('default-result');
jest.unstable_mockModule('../src/openai.mjs', () => ({ callOpenAI }));
const { translateLocale } = await import('../src/worker.mjs');

it('loads the default OpenAI implementation when no dependency is injected', async () => {
  await expect(translateLocale({ locale: 'fr', promptObj: {}, apiKey: 'key' })).resolves.toBe('default-result');
  expect(callOpenAI).toHaveBeenCalledWith({ promptObj: {}, targetLocale: 'fr', apiKey: 'key' });
});
