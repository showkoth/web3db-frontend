'use client';

import { Loader2, Shield, Trash2, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { PolicyForm } from '@/components/features/policies/policy-form';
import { PolicyGraph } from '@/components/features/policies/policy-graph';
import type { Policy } from '@/components/features/policies/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetPoliciesGrantedByAccessPoliciesGrantedBySubjectAddressGet } from '@/lib/api/generated/hooks/useGetPoliciesGrantedByAccessPoliciesGrantedBySubjectAddressGet';
import { useRemoveAccessPolicyAccessPoliciesDelete } from '@/lib/api/generated/hooks/useRemoveAccessPolicyAccessPoliciesDelete';
import { useWallet } from '@/lib/web3/hooks';

const short = (a: string) => `${a.slice(0, 8)}…${a.slice(-6)}`;

type GrantedResponse = { policies?: Policy[]; policy_count?: number };

export function PoliciesView() {
  const { address, isConnected } = useWallet();

  const grants = useGetPoliciesGrantedByAccessPoliciesGrantedBySubjectAddressGet(address ?? '', {
    query: { enabled: !!address },
  });
  const policies = (grants.data as GrantedResponse | undefined)?.policies ?? [];

  const remove = useRemoveAccessPolicyAccessPoliciesDelete();

  if (!isConnected || !address) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border bg-card p-12 text-center">
        <Wallet className="h-8 w-8 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Connect your wallet</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Access policies are scoped to a wallet address. Connect to view what you have granted.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Access policies</h1>
          <p className="text-sm text-muted-foreground">
            Grants you have issued from <span className="font-mono">{short(address)}</span>.
          </p>
        </div>
        <PolicyForm subject={address} onCreated={() => grants.refetch()} />
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="graph">Graph</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4">
          {grants.isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : policies.length === 0 ? (
            <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
              No grants issued yet. Click <span className="font-medium">Grant access</span> to start.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {policies.map((p, i) => (
                <article
                  key={`${p.object_address}-${i}`}
                  className="space-y-2 rounded-xl border bg-card p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Shield className="h-3 w-3" /> {p.table_name}
                    </Badge>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      onClick={() => {
                        if (p.policy_index === undefined) {
                          toast.error('Policy index unknown — cannot revoke from UI');
                          return;
                        }
                        remove.mutate(
                          {
                            data: { object_address: p.object_address, policy_index: p.policy_index },
                          },
                          {
                            onSuccess: () => {
                              toast.success('Revoked');
                              grants.refetch();
                            },
                            onError: (err) => toast.error(`Revoke failed: ${err.statusText}`),
                          },
                        );
                      }}
                      disabled={remove.isPending}
                      aria-label="Revoke"
                    >
                      {remove.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3 text-destructive" />
                      )}
                    </Button>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="text-muted-foreground">grantee</div>
                    <div className="break-all font-mono">{p.object_address}</div>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="text-muted-foreground">filter</div>
                    <pre className="overflow-x-auto rounded-md bg-muted/50 p-2 font-mono">
                      {p.policy_sql}
                    </pre>
                  </div>
                </article>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="graph" className="mt-4">
          {grants.isLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <PolicyGraph subject={address} policies={policies} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
