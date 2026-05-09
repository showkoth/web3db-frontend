import { describe, expect, it } from 'vitest';
import { rowsToCsv } from '@/lib/sql/export';

describe('rowsToCsv', () => {
  it('returns empty string for empty rows', () => {
    expect(rowsToCsv([])).toBe('');
  });

  it('produces header + body', () => {
    const csv = rowsToCsv([{ a: 1, b: 'x' }, { a: 2, b: 'y' }]);
    expect(csv).toBe('a,b\n1,x\n2,y');
  });

  it('escapes quotes and commas', () => {
    const csv = rowsToCsv([{ a: 'with, comma', b: 'has "quote"' }]);
    expect(csv).toBe('a,b\n"with, comma","has ""quote"""');
  });

  it('handles null and undefined', () => {
    const csv = rowsToCsv([{ a: null, b: undefined, c: 0 }]);
    expect(csv).toBe('a,b,c\n,,0');
  });

  it('serializes objects as JSON', () => {
    const csv = rowsToCsv([{ a: { x: 1 } }]);
    expect(csv).toBe('a\n"{""x"":1}"');
  });
});
