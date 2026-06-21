import { describe, expect, it } from 'vitest';

import { sanitizeHtml } from './sanitize-html.js';

describe('sanitizeHtml', () => {
  it('removes script tags and inline event handlers', () => {
    const result = sanitizeHtml(
      '<div>safe<script>alert(1)</script><img src="x" onerror="alert(1)" /></div>',
    );

    expect(result).toContain('<div>safe');
    expect(result).toContain('<img src="x">');
    expect(result).not.toContain('<script');
    expect(result).not.toContain('onerror=');
  });

  it('strips javascript: urls from links', () => {
    const result = sanitizeHtml(
      '<a href="javascript:alert(1)" onclick="alert(1)">click</a>',
    );

    expect(result).toContain('<a');
    expect(result).toContain('>click</a>');
    expect(result).not.toContain('javascript:');
    expect(result).not.toContain('onclick=');
  });

  it('removes disallowed tags like iframe', () => {
    const result = sanitizeHtml(
      '<p>before</p><iframe src="https://evil.test"></iframe><p>after</p>',
    );

    expect(result).toContain('<p>before</p>');
    expect(result).toContain('<p>after</p>');
    expect(result).not.toContain('<iframe');
  });
});
