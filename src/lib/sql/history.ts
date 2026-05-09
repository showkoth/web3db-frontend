'use client';

import { useEffect, useState } from 'react';

export type QueryHistoryEntry = {
  id: string;
  sql: string;
  table: string;
  rows: number;
  ms: number;
  ts: number;
  ok: boolean;
};

const KEY = 'web3db.query.history';
const MAX = 50;

function read(): QueryHistoryEntry[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as QueryHistoryEntry[];
  } catch {
    return [];
  }
}

function write(entries: QueryHistoryEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX)));
}

export function useQueryHistory() {
  const [entries, setEntries] = useState<QueryHistoryEntry[]>([]);
  useEffect(() => setEntries(read()), []);

  return {
    entries,
    push: (entry: Omit<QueryHistoryEntry, 'id' | 'ts'>) => {
      const next: QueryHistoryEntry[] = [
        { ...entry, id: crypto.randomUUID(), ts: Date.now() },
        ...entries,
      ].slice(0, MAX);
      setEntries(next);
      write(next);
    },
    clear: () => {
      setEntries([]);
      write([]);
    },
  };
}
