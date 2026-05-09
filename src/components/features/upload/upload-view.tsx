'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, FileSpreadsheet, Loader2, Upload as UploadIcon, X } from 'lucide-react';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetAllTableNamesSchemasTablesGet } from '@/lib/api/generated/hooks/useGetAllTableNamesSchemasTablesGet';
import { useUploadDataUploadTableNamePost } from '@/lib/api/generated/hooks/useUploadDataUploadTableNamePost';
import { useWallet } from '@/lib/web3/hooks';
import { cn } from '@/lib/utils';

const schema = z.object({
  table: z.string().min(1, 'Table name required'),
  newTable: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

type TablesResponse = { table_names?: string[] };

export function UploadView() {
  const { address, isConnected } = useWallet();
  const tables = useGetAllTableNamesSchemasTablesGet();
  const tableNames = (tables.data as TablesResponse | undefined)?.table_names ?? [];

  const { control, handleSubmit, watch, setValue, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { table: '', newTable: '' },
  });
  const table = watch('table');
  const newTable = watch('newTable');

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<{ cols: string[]; rows: Record<string, unknown>[] }>({
    cols: [],
    rows: [],
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'text/csv': ['.csv'], 'application/json': ['.json'], 'text/plain': ['.sql'] },
    multiple: false,
    onDrop: (accepted) => setFile(accepted[0] ?? null),
  });

  useEffect(() => {
    if (!file) {
      setPreview({ cols: [], rows: [] });
      return;
    }
    if (!file.name.endsWith('.csv')) return;
    Papa.parse<Record<string, unknown>>(file, {
      header: true,
      skipEmptyLines: true,
      preview: 5,
      complete: (res) => {
        const cols = res.meta.fields ?? [];
        setPreview({ cols, rows: res.data });
      },
    });
  }, [file]);

  const upload = useUploadDataUploadTableNamePost();

  const onSubmit = handleSubmit(async (values) => {
    if (!isConnected || !address) return toast.error('Connect your wallet first');
    if (!file) return toast.error('Drop a file first');

    const target = values.table === '__new__' ? values.newTable?.trim() : values.table;
    if (!target) return toast.error('Provide a table name');

    const fd = new FormData();
    fd.append('file', file);
    fd.append('wallet_address', address);

    upload.mutate(
      { data: fd, table_name: target } as never,
      {
        onSuccess: (data) => {
          toast.success('Upload complete', {
            description: typeof data === 'object' ? JSON.stringify(data) : String(data),
          });
        },
        onError: (err) => toast.error(`Upload failed: ${err.statusText ?? 'unknown'}`),
      },
    );
  });

  const isNew = table === '__new__';
  const targetName = isNew ? newTable : table;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Upload data</h1>
        <p className="text-sm text-muted-foreground">
          Drop a CSV, SQL dump, or JSON file. It is encrypted client-side and pinned to IPFS.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <Label>Target table</Label>
          <Controller
            control={control}
            name="table"
            render={({ field }) => (
              <Select value={field.value} onValueChange={(v) => field.onChange(v ?? '')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an existing table" />
                </SelectTrigger>
                <SelectContent>
                  {tableNames.map((n) => (
                    <SelectItem key={n} value={n}>
                      <span className="font-mono">{n}</span>
                    </SelectItem>
                  ))}
                  <SelectItem value="__new__">+ New table…</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {isNew && (
            <Input
              placeholder="new_table_name"
              value={newTable ?? ''}
              onChange={(e) => setValue('newTable', e.target.value)}
            />
          )}
          {formState.errors.table && (
            <p className="text-xs text-destructive">{formState.errors.table.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label>Wallet</Label>
          <div
            className={cn(
              'flex h-9 items-center rounded-lg border bg-muted/40 px-3 font-mono text-xs',
              !isConnected && 'border-amber-500/40',
            )}
          >
            {address ?? 'Not connected'}
          </div>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-12 text-center transition-colors',
          isDragActive ? 'border-foreground bg-muted/40' : 'border-border hover:bg-muted/30',
        )}
      >
        <input {...getInputProps()} />
        <UploadIcon className="h-8 w-8 text-muted-foreground" />
        {file ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-medium">
              <FileSpreadsheet className="h-4 w-4" />
              {file.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB · {file.type || 'unknown'}
            </div>
          </div>
        ) : isDragActive ? (
          <div className="text-sm">Drop the file here…</div>
        ) : (
          <div className="space-y-1">
            <div className="text-sm font-medium">Drop a file here, or click to browse</div>
            <div className="text-xs text-muted-foreground">CSV · JSON · SQL</div>
          </div>
        )}
        {file && (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setFile(null);
            }}
          >
            <X className="mr-1 h-3 w-3" /> Remove
          </Button>
        )}
      </div>

      {preview.cols.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Preview</span>
            <Badge variant="secondary">{preview.cols.length} columns</Badge>
            <span className="text-muted-foreground">first 5 rows</span>
          </div>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-xs">
              <thead className="bg-muted/50">
                <tr>
                  {preview.cols.map((c) => (
                    <th key={c} className="px-3 py-2 text-left font-mono">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((r, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: preview
                  <tr key={i} className="border-t">
                    {preview.cols.map((c) => (
                      <td key={c} className="truncate px-3 py-2 font-mono">
                        {String(r[c] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        {upload.isSuccess && (
          <span className="flex items-center gap-1 text-sm text-emerald-600">
            <CheckCircle2 className="h-4 w-4" /> Uploaded
          </span>
        )}
        <Button type="submit" disabled={upload.isPending || !file || !targetName || !isConnected}>
          {upload.isPending ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <UploadIcon className="mr-1 h-4 w-4" />
          )}
          Upload {targetName ? `to ${targetName}` : ''}
        </Button>
      </div>
    </form>
  );
}
