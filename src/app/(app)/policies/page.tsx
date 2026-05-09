import type { Metadata } from 'next';
import { PoliciesView } from '@/components/features/policies/policies-view';

export const metadata: Metadata = { title: 'Policies · web3db' };

export default function PoliciesPage() {
  return <PoliciesView />;
}
