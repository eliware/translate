import { jest } from '@jest/globals';

const create = jest.fn().mockResolvedValue({ choices: [{ message: { content: 'default' } }] });
const OpenAI = jest.fn().mockImplementation(() => ({ chat: { completions: { create } } }));
jest.unstable_mockModule('openai', () => ({ default: OpenAI }));
const { callOpenAI } = await import('../src/openai.mjs');

it('loads the default OpenAI implementation', async () => {
  await expect(callOpenAI({ promptObj: { messages: [] }, apiKey: 'key' })).resolves.toBe('default');
});
