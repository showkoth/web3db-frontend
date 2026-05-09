import type { Metadata } from 'next';
import { Suspense } from 'react';
import { TablesView } from '@/components/features/tables/tables-view';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = { title: 'Tables · web3db' };

export default function TablesPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
      <TablesView />
    </Suspense>
  );
}
