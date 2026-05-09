import { describe, expect, it } from 'vitest';
import { parseCreateTable } from '@/lib/sql/parse-schema';

describe('parseCreateTable', () => {
  it('parses a typical CREATE TABLE', () => {
    const sql = `CREATE TABLE users (
      id INTEGER NOT NULL PRIMARY KEY,
      name VARCHAR,
      age INTEGER,
      email VARCHAR
    )`;
    const cols = parseCreateTable(sql);
    expect(cols).toHaveLength(4);
    expect(cols[0]).toEqual({ name: 'id', type: 'INTEGER', nullable: false, primaryKey: true });
    expect(cols[1]).toEqual({ name: 'name', type: 'VARCHAR', nullable: true, primaryKey: false });
  });

  it('skips standalone constraints', () => {
    const sql = `CREATE TABLE t (
      a INTEGER,
      b VARCHAR,
      PRIMARY KEY (a),
      UNIQUE (b)
    )`;
    const cols = parseCreateTable(sql);
    expect(cols.map((c) => c.name)).toEqual(['a', 'b']);
  });

  it('handles malformed input', () => {
    expect(parseCreateTable('not sql')).toEqual([]);
    expect(parseCreateTable('')).toEqual([]);
  });

  it('strips type modifiers', () => {
    const sql = `CREATE TABLE t (a VARCHAR(255) NOT NULL, b DECIMAL(10,2))`;
    const cols = parseCreateTable(sql);
    expect(cols[0]?.type).toBe('VARCHAR(255)');
    expect(cols[0]?.nullable).toBe(false);
  });
});
