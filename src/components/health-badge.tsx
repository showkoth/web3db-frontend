'use client';

import { useHealthCheckHealthGet } from '@/lib/api/generated/hooks/useHealthCheckHealthGet';
import { cn } from '@/lib/utils';

export function HealthBadge() {
  const { data, isLoading, isError } = useHealthCheckHealthGet({
    query: { refetchInterval: 30_000 },
  });

  const status = isLoading ? 'pending' : isError ? 'down' : 'up';
  const label = isLoading ? 'checking' : isError ? 'offline' : 'online';

  return (
    <div
      className="flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs"
      title={data ? JSON.stringify(data) : undefined}
    >
      <span
        className={cn(
          'h-2 w-2 rounded-full',
          status === 'up' && 'bg-emerald-500',
          status === 'pending' && 'bg-amber-500 animate-pulse',
          status === 'down' && 'bg-red-500',
        )}
      />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
