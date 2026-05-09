export type Column = {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
};

export function parseCreateTable(sql: string): Column[] {
  const open = sql.indexOf('(');
  const close = sql.lastIndexOf(')');
  if (open === -1 || close === -1) return [];
  const body = sql.slice(open + 1, close);

  const lines = body
    .split(/,(?![^(]*\))/)
    .map((s) => s.trim())
    .filter(Boolean);

  const cols: Column[] = [];
  for (const line of lines) {
    const upper = line.toUpperCase();
    if (
      upper.startsWith('PRIMARY KEY') ||
      upper.startsWith('FOREIGN KEY') ||
      upper.startsWith('CONSTRAINT') ||
      upper.startsWith('UNIQUE')
    ) {
      continue;
    }
    const match = line.match(/^"?([A-Za-z_][\w]*)"?\s+([A-Za-z0-9()_,\s]+?)(\s+|$)/);
    if (!match) continue;
    const [, name, rawType] = match;
    if (!name || !rawType) continue;
    const type = rawType.trim().split(/\s+/)[0] ?? rawType.trim();
    cols.push({
      name,
      type,
      nullable: !upper.includes('NOT NULL'),
      primaryKey: upper.includes('PRIMARY KEY'),
    });
  }
  return cols;
}
