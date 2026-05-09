import type { Metadata } from 'next';
import { QueryView } from '@/components/features/query/query-view';

export const metadata: Metadata = { title: 'Run Query · web3db' };

export default function QueryPage() {
  return <QueryView />;
}
