'use client';

import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, Check, KeyRound } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Column } from '@/lib/sql/parse-schema';

const columns: ColumnDef<Column>[] = [
  {
    accessorKey: 'name',
    header: 'Column',
    cell: ({ row }) => (
      <span className="flex items-center gap-2 font-mono text-sm">
        {row.original.primaryKey && <KeyRound className="h-3 w-3 text-amber-500" />}
        {row.original.name}
      </span>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ getValue }) => (
      <Badge variant="secondary" className="font-mono text-xs">
        {String(getValue())}
      </Badge>
    ),
  },
  {
    accessorKey: 'nullable',
    header: 'Nullable',
    cell: ({ getValue }) =>
      getValue() ? (
        <span className="text-xs text-muted-foreground">yes</span>
      ) : (
        <Check className="h-4 w-4 text-emerald-500" />
      ),
  },
  {
    accessorKey: 'primaryKey',
    header: 'Key',
    cell: ({ getValue }) =>
      getValue() ? <Badge variant="outline">PK</Badge> : <span className="text-muted-foreground">—</span>,
  },
];

export function SchemaTable({ columns: data }: { columns: Column[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => {
                const sorted = h.column.getIsSorted();
                return (
                  <TableHead key={h.id}>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={h.column.getToggleSortingHandler()}
                      className="-ml-2 px-2"
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {sorted === 'asc' ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : sorted === 'desc' ? (
                        <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 opacity-40" />
                      )}
                    </Button>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
