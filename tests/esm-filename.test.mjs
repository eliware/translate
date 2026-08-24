import { jest } from '@jest/globals';
import { getCurrentFilename, getCurrentDirname } from '../src/esm-filename.mjs';

describe('esm filename helpers', () => {
  it('uses import meta when available', () => {
    expect(getCurrentFilename({ url: 'file:///C:/tmp/example.mjs' })).toMatch(/tmp[\\/]example\.mjs$/);
    expect(getCurrentDirname({ url: 'file:///C:/tmp/example.mjs' }, jest.fn(() => '/tmp'))).toBe('/tmp');
  });

  it('falls back safely when metadata is absent', () => {
    expect(getCurrentFilename({})).toBe('');
    expect(getCurrentDirname({})).toBe('');
  });

  it('uses the injected dirname function', () => {
    const dirname = jest.fn(() => '/custom');
    expect(getCurrentDirname({ url: 'file:///C:/tmp/example.mjs' }, dirname)).toBe('/custom');
    expect(dirname).toHaveBeenCalled();
  });
});
