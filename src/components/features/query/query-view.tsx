'use client';

import { Download, History, Loader2, Play, Wallet } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ResultsGrid } from '@/components/features/query/results-grid';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllTableNamesSchemasTablesGet } from '@/lib/api/generated/hooks/useGetAllTableNamesSchemasTablesGet';
import { useGetTableSchemaSchemasTableNameGet } from '@/lib/api/generated/hooks/useGetTableSchemaSchemasTableNameGet';
import { useQueryQueryPost } from '@/lib/api/generated/hooks/useQueryQueryPost';
import { download, rowsToCsv } from '@/lib/sql/export';
import { useQueryHistory } from '@/lib/sql/history';
import { parseCreateTable } from '@/lib/sql/parse-schema';
import { useWallet } from '@/lib/web3/hooks';

const SqlEditor = dynamic(
  () => import('@/components/features/query/sql-editor').then((m) => m.SqlEditor),
  { ssr: false, loading: () => <Skeleton className="h-[220px] w-full" /> },
);

type TablesResponse = { table_names?: string[] };
type SchemaResponse = { schema?: string; tableSchema?: string };
type QueryResponse = {
  records?: number;
  results?: Record<string, unknown>[];
  message?: string;
};

export function QueryView() {
  const { address, isConnected } = useWallet();
  const tables = useGetAllTableNamesSchemasTablesGet();
  const tableNames = (tables.data as TablesResponse | undefined)?.table_names ?? [];
  const [table, setTable] = useState<string>('');
  const activeTable = table || tableNames[0] || '';

  const tableSchema = useGetTableSchemaSchemasTableNameGet(activeTable, {
    query: { enabled: !!activeTable },
  });
  const completions = useMemo(() => {
    const sql =
      (tableSchema.data as SchemaResponse | undefined)?.schema ??
      (tableSchema.data as SchemaResponse | undefined)?.tableSchema ??
      '';
    return parseCreateTable(sql).map((c) => ({ label: c.name, detail: c.type }));
  }, [tableSchema.data]);

  const [sql, setSql] = useState('SELECT * FROM users LIMIT 100');
  const history = useQueryHistory();
  const mutation = useQueryQueryPost();

  const run = () => {
    if (!isConnected || !address) {
      toast.error('Connect your wallet first');
      return;
    }
    if (!activeTable) {
      toast.error('Select a table first');
      return;
    }
    const started = performance.now();
    mutation.mutate(
      { data: { table_name: activeTable, query: sql, wallet_address: address } },
      {
        onSuccess: (data) => {
          const r = data as QueryResponse;
          const ms = Math.round(performance.now() - started);
          history.push({ sql, table: activeTable, rows: r.records ?? 0, ms, ok: true });
          if (r.message && (!r.results || r.results.length === 0)) toast.warning(r.message);
          else toast.success(`${r.records ?? r.results?.length ?? 0} rows in ${ms}ms`);
        },
        onError: (err) => {
          const ms = Math.round(performance.now() - started);
          history.push({ sql, table: activeTable, rows: 0, ms, ok: false });
          toast.error(`Query failed: ${err.statusText ?? 'unknown'}`);
        },
      },
    );
  };

  const result = mutation.data as QueryResponse | undefined;
  const rows = result?.results ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Run Query</h1>
          <p className="text-sm text-muted-foreground">
            Press <kbd className="rounded border bg-muted px-1 py-0.5 text-xs">⌘ Enter</kbd> to run.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={activeTable} onValueChange={(v) => setTable(v ?? '')}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select table" />
            </SelectTrigger>
            <SelectContent>
              {tableNames.map((name) => (
                <SelectItem key={name} value={name}>
                  <span className="font-mono">{name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
              <History className="mr-1 h-4 w-4" />
              History
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[420px]">
              <DropdownMenuLabel>Recent queries</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {history.entries.length === 0 ? (
                <div className="px-2 py-3 text-sm text-muted-foreground">No history yet.</div>
              ) : (
                history.entries.slice(0, 15).map((h) => (
                  <DropdownMenuItem
                    key={h.id}
                    onClick={() => {
                      setSql(h.sql);
                      setTable(h.table);
                    }}
                    className="flex flex-col items-start gap-1"
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <Badge variant={h.ok ? 'secondary' : 'destructive'} className="font-mono">
                        {h.table}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {h.rows} rows · {h.ms}ms
                      </span>
                    </div>
                    <div className="line-clamp-2 w-full font-mono text-xs">{h.sql}</div>
                  </DropdownMenuItem>
                ))
              )}
              {history.entries.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={history.clear} variant="destructive">
                    Clear history
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={run} disabled={mutation.isPending} size="sm">
            {mutation.isPending ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-1 h-4 w-4" />
            )}
            Run
          </Button>
        </div>
      </div>

      {!isConnected && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 text-sm">
          <Wallet className="h-4 w-4" />
          Connect your wallet to authorize queries.
        </div>
      )}

      <SqlEditor value={sql} onChange={setSql} onRun={run} completions={completions} />

      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          {result ? `${rows.length} rows` : mutation.isPending ? 'Running…' : 'No results yet'}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={!rows.length}
            onClick={() => download('query.csv', rowsToCsv(rows), 'text/csv')}
          >
            <Download className="mr-1 h-4 w-4" /> CSV
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={!rows.length}
            onClick={() => download('query.json', JSON.stringify(rows, null, 2), 'application/json')}
          >
            <Download className="mr-1 h-4 w-4" /> JSON
          </Button>
        </div>
      </div>

      <ResultsGrid rows={rows} />
    </div>
  );
}
