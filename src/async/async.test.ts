import { describe, expect, test } from 'vitest';
import { type AsyncTemplatePiece, asyncTemplate } from 'yummies/async';

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

  test('async fns', async () => {
    const tmpl = asyncTemplate`foo${async () => {
      return 'bar';
    }}`;
    await expect(concatChunks(tmpl)).resolves.toBe('foobar');
  });

  test('streams async iterables of non-string primitives with String()', async () => {
    async function* nums() {
      yield 1;
      yield 2;
      yield true;
    }
    await expect(concatChunks(asyncTemplate`<${nums()}>`)).resolves.toBe(
      '<12true>',
    );
  });

  test('async iterable chunks omit null, undefined, and false', async () => {
    async function* mixed() {
      yield 'a';
      yield null;
      yield undefined;
      yield false;
      yield 0;
      yield '';
    }
    await expect(concatChunks(asyncTemplate`[${mixed()}]`)).resolves.toBe(
      '[a0]',
    );
  });

  test('awaits promise of primitive (not only string)', async () => {
    await expect(
      concatChunks(asyncTemplate`n=${Promise.resolve(42)}`),
    ).resolves.toBe('n=42');
    await expect(
      concatChunks(asyncTemplate`ok=${Promise.resolve(true)}`),
    ).resolves.toBe('ok=true');
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
