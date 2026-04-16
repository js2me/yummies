import { describe, expect, test } from 'vitest';

import { type AsyncTemplatePiece, asyncTemplate } from './async.js';

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

  test('invokes zero-arg function thunks and processes the return value', async () => {
    await expect(concatChunks(asyncTemplate`x${() => 'y'}z`)).resolves.toBe(
      'xyz',
    );
  });

  test('thunk may return a promise or nested structure', async () => {
    await expect(
      concatChunks(
        asyncTemplate`${(() => Promise.resolve('p')) as unknown as AsyncTemplatePiece}`,
      ),
    ).resolves.toBe('p');
    await expect(
      concatChunks(asyncTemplate`${() => ['a', 'b']}`),
    ).resolves.toBe('ab');
  });

  test('recurses when thunk returns another thunk', async () => {
    await expect(
      concatChunks(
        asyncTemplate`${(() => () => 'nested') as unknown as AsyncTemplatePiece}`,
      ),
    ).resolves.toBe('nested');
  });

  test('thunk may return an async iterable', async () => {
    async function* inner() {
      yield 'i';
    }
    await expect(concatChunks(asyncTemplate`${() => inner()}`)).resolves.toBe(
      'i',
    );
  });
});
