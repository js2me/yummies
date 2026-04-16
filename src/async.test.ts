import { describe, expect, test } from 'vitest';

import { asyncTemplate } from './async.js';

async function concatChunks(gen: AsyncIterable<string>): Promise<string> {
  let out = '';
  for await (const chunk of gen) {
    out += chunk;
  }
  return out;
}

describe('asyncTemplate', () => {
  test('concatenates static segments only', async () => {
    await expect(concatChunks(asyncTemplate`plain`)).resolves.toBe('plain');
  });

  test('interpolates primitives', async () => {
    await expect(concatChunks(asyncTemplate`a${1}b${true}`)).resolves.toBe(
      'a1btrue',
    );
  });

  test('omits null, undefined, and false', async () => {
    await expect(
      concatChunks(asyncTemplate`${null}${undefined}${false}X`),
    ).resolves.toBe('X');
  });

  test('awaits promises and nests results', async () => {
    await expect(
      concatChunks(asyncTemplate`x${Promise.resolve('y')}z`),
    ).resolves.toBe('xyz');
  });

  test('flattens nested arrays recursively', async () => {
    await expect(
      concatChunks(asyncTemplate`[${['a', ['b', 'c']]}]`),
    ).resolves.toBe('[abc]');
  });

  test('streams async iterables of strings in order', async () => {
    async function* chunks() {
      yield 'one';
      yield 'two';
    }
    await expect(concatChunks(asyncTemplate`(${chunks()})`)).resolves.toBe(
      '(onetwo)',
    );
  });

  test('matches typical tagged-template segment layout', async () => {
    const name = 'Ada';
    await expect(concatChunks(asyncTemplate`Hello, ${name}!`)).resolves.toBe(
      'Hello, Ada!',
    );
  });
});
