import { describe, expect, test } from 'vitest';

import { splitTextByLines } from './text.js';

describe('text', () => {
  describe('splitTextByLines', () => {
    const testCases: {
      input: Parameters<typeof splitTextByLines>;
      expected: ReturnType<typeof splitTextByLines>;
    }[] = [
      {
        input: [
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi pariatur magnam excepturi nesciunt tempora deserunt? Pariatur sit quam, ducimus molestias quia aut maxime eligendi repudiandae expedita repellat, harum dignissimos aliquam.',
          60,
        ],
        expected: [
          'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          'Commodi pariatur magnam excepturi nesciunt tempora deserunt?',
          'Pariatur sit quam, ducimus molestias quia aut maxime',
          'eligendi repudiandae expedita repellat, harum dignissimos',
          'aliquam.',
        ],
      },
      {
        input: ['', 60],
        expected: [''],
      },
      {
        input: [
          'Supercalifragilisticexpialidocious is a long word that needs splitting',
          20,
        ],
        expected: [
          'Supercalifragilistic',
          'expialidocious',
          'is a long word that',
          'needs splitting',
        ],
      },
      {
        input: [
          '   Multiple    spaces     and    tabs\t\tbetween\twords   ',
          15,
        ],
        expected: ['Multiple spaces', 'and tabs', 'between words'],
      },
      {
        input: [
          'Precise-length testing with exact match requirements for assessment',
          20,
        ],
        expected: [
          'Precise-length',
          'testing with exact',
          'match requirements',
          'for assessment',
        ],
      },
      {
        input: [
          `Special characters: @#$%^&*()_+={}[]|\\:";'<>?,./ and backticks \`code\` should work!`,
          30,
        ],
        expected: [
          'Special characters:',
          String.raw`@#$%^&*()_+={}[]|\:";'<>?,./`,
          'and backticks `code` should',
          'work!',
        ],
      },
      {
        input: ['ThisIsACombinedWordThatExceedsLimit and normal words', 15],
        expected: [
          'ThisIsACombined',
          'WordThatExceeds',
          'Limit',
          'and normal',
          'words',
        ],
      },
    ];

    testCases.forEach((testCase, i) => {
      test(`test case #${i + 1}`, () => {
        expect(splitTextByLines(...testCase.input)).toStrictEqual(
          testCase.expected,
        );
      });
    });
  });
});
