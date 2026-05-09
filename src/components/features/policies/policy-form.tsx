'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAddAccessPolicyAccessPoliciesPost } from '@/lib/api/generated/hooks/useAddAccessPolicyAccessPoliciesPost';
import { useGetAllTableNamesSchemasTablesGet } from '@/lib/api/generated/hooks/useGetAllTableNamesSchemasTablesGet';

const ADDRESS = /^0x[a-fA-F0-9]{40}$/;
const schema = z.object({
  object_address: z.string().regex(ADDRESS, 'Must be a 0x… address'),
  table_name: z.string().min(1),
  policy_sql: z.string().min(1, 'SQL filter required'),
});
type FormValues = z.infer<typeof schema>;

export function PolicyForm({ subject, onCreated }: { subject: string; onCreated?: () => void }) {
  const tables = useGetAllTableNamesSchemasTablesGet();
  const tableNames = (tables.data as { table_names?: string[] } | undefined)?.table_names ?? [];

  const { control, register, handleSubmit, reset, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { object_address: '', table_name: '', policy_sql: 'TRUE' },
  });

  const add = useAddAccessPolicyAccessPoliciesPost();

  const onSubmit = handleSubmit((v) => {
    add.mutate(
      { data: { ...v, subject_address: subject } },
      {
        onSuccess: () => {
          toast.success('Policy granted');
          reset();
          onCreated?.();
        },
        onError: (err) => toast.error(`Add failed: ${err.statusText ?? 'unknown'}`),
      },
    );
  });

  return (
    <Dialog>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="mr-1 h-4 w-4" /> Grant access
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Grant access to a wallet</DialogTitle>
            <DialogDescription>
              Authorize another address to read rows from one of your tables.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="object_address">Recipient wallet</Label>
            <Input
              id="object_address"
              placeholder="0x…"
              className="font-mono"
              {...register('object_address')}
            />
            {formState.errors.object_address && (
              <p className="text-xs text-destructive">{formState.errors.object_address.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Table</Label>
            <Controller
              control={control}
              name="table_name"
              render={({ field }) => (
                <Select value={field.value} onValueChange={(v) => field.onChange(v ?? '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a table" />
                  </SelectTrigger>
                  <SelectContent>
                    {tableNames.map((n) => (
                      <SelectItem key={n} value={n}>
                        <span className="font-mono">{n}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {formState.errors.table_name && (
              <p className="text-xs text-destructive">{formState.errors.table_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="policy_sql">Filter (SQL WHERE clause)</Label>
            <Textarea
              id="policy_sql"
              placeholder="e.g. age >= 18 AND department = 'eng'"
              className="font-mono"
              rows={3}
              {...register('policy_sql')}
            />
            <p className="text-xs text-muted-foreground">
              Use <code className="font-mono">TRUE</code> to grant full access.
            </p>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={add.isPending}>
              {add.isPending && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              Grant
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
