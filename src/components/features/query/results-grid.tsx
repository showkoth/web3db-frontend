'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';

type Row = Record<string, unknown>;

export function ResultsGrid({ rows }: { rows: Row[] }) {
  const columns = useMemo<ColumnDef<Row>[]>(() => {
    if (!rows.length) return [];
    return Object.keys(rows[0] ?? {}).map((key) => ({
      accessorKey: key,
      header: key,
      cell: ({ getValue }) => {
        const v = getValue();
        if (v === null || v === undefined)
          return <span className="text-muted-foreground italic">null</span>;
        if (typeof v === 'object') return <span className="font-mono">{JSON.stringify(v)}</span>;
        return <span className="font-mono">{String(v)}</span>;
      },
    }));
  }, [rows]);

  const table = useReactTable({ data: rows, columns, getCoreRowModel: getCoreRowModel() });
  const parentRef = useRef<HTMLDivElement>(null);
  const { rows: trows } = table.getRowModel();

  const virtualizer = useVirtualizer({
    count: trows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
    overscan: 12,
  });

  if (!rows.length) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
        No rows returned.
      </div>
    );
  }

  const items = virtualizer.getVirtualItems();
  const total = virtualizer.getTotalSize();
  const padTop = items[0]?.start ?? 0;
  const padBot = total - (items[items.length - 1]?.end ?? 0);

  return (
    <div ref={parentRef} className="h-[480px] overflow-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b">
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  className="px-3 py-2 text-left font-mono text-xs font-medium text-muted-foreground"
                >
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {padTop > 0 && (
            <tr>
              <td colSpan={columns.length} style={{ height: padTop }} />
            </tr>
          )}
          {items.map((vi) => {
            const row = trows[vi.index];
            if (!row) return null;
            return (
              <tr
                key={row.id}
                className={cn('border-b', vi.index % 2 === 1 && 'bg-muted/30')}
                style={{ height: vi.size }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="truncate px-3 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
          {padBot > 0 && (
            <tr>
              <td colSpan={columns.length} style={{ height: padBot }} />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
