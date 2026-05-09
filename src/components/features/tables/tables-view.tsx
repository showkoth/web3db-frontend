'use client';

import { Database, KeyRound, Search } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { SchemaTable } from '@/components/features/tables/schema-table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllTableSchemasSchemasGet } from '@/lib/api/generated/hooks/useGetAllTableSchemasSchemasGet';
import { parseCreateTable } from '@/lib/sql/parse-schema';
import { cn } from '@/lib/utils';

type SchemaResponse = {
  status: string;
  schemas: Record<string, string>;
  storage_type?: string;
  timestamp?: string;
};

export function TablesView() {
  const { data, isLoading, isError, error } = useGetAllTableSchemasSchemasGet();
  const [search, setSearch] = useQueryState('q', parseAsString.withDefault(''));
  const [selected, setSelected] = useQueryState('table', parseAsString);

  const parsed = useMemo(() => {
    const schemas = (data as SchemaResponse | undefined)?.schemas ?? {};
    return Object.entries(schemas).map(([name, sql]) => ({
      name,
      sql,
      columns: parseCreateTable(sql),
    }));
  }, [data]);

  const filtered = useMemo(
    () =>
      parsed.filter((t) =>
        search ? t.name.toLowerCase().includes(search.toLowerCase()) : true,
      ),
    [parsed, search],
  );

  const active = parsed.find((t) => t.name === selected) ?? filtered[0];

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
        Failed to load schemas: {error ? String((error as { data?: unknown }).data ?? error) : 'unknown error'}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-[260px_1fr]">
      <aside className="space-y-3">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Tables</h1>
          <p className="text-sm text-muted-foreground">
            {parsed.length} table{parsed.length === 1 ? '' : 's'} in this database
          </p>
        </div>
        <div className="relative">
          <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value || null)}
            placeholder="Filter tables…"
            className="pl-8"
          />
        </div>
        <ul className="space-y-1">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                <li key={i}>
                  <Skeleton className="h-9 w-full" />
                </li>
              ))
            : filtered.map((t) => (
                <li key={t.name}>
                  <button
                    type="button"
                    onClick={() => setSelected(t.name)}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 rounded-md border border-transparent px-3 py-2 text-left text-sm transition-colors',
                      active?.name === t.name
                        ? 'border-border bg-muted'
                        : 'hover:bg-muted/60',
                    )}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Database className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate font-mono">{t.name}</span>
                    </span>
                    <Badge variant="secondary" className="shrink-0">
                      {t.columns.length}
                    </Badge>
                  </button>
                </li>
              ))}
          {!isLoading && filtered.length === 0 && (
            <li className="px-3 py-2 text-sm text-muted-foreground">No tables match.</li>
          )}
        </ul>
      </aside>

      <section className="min-w-0 space-y-4">
        {isLoading ? (
          <Skeleton className="h-[500px] w-full" />
        ) : active ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-mono text-xl font-semibold">{active.name}</h2>
                {active.columns.some((c) => c.primaryKey) && (
                  <Badge variant="outline" className="gap-1">
                    <KeyRound className="h-3 w-3" />
                    primary key
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {active.columns.length} columns
              </div>
            </div>

            <SchemaTable columns={active.columns} />

            <details className="rounded-lg border bg-card">
              <summary className="cursor-pointer px-4 py-2 text-sm font-medium">
                CREATE TABLE statement
              </summary>
              <pre className="overflow-x-auto border-t bg-muted/40 p-4 font-mono text-xs leading-relaxed">
                {active.sql}
              </pre>
            </details>
          </>
        ) : (
          <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
            No table selected.
          </div>
        )}
      </section>
    </div>
  );
}
