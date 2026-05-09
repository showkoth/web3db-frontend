import type { Metadata } from 'next';
import { CloudOff } from 'lucide-react';

export const metadata: Metadata = { title: 'Offline · web3db' };

export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <CloudOff className="h-10 w-10 text-muted-foreground" />
      <h1 className="text-2xl font-semibold">You're offline</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        web3db needs a connection to talk to the backend and IPFS. Pages and assets you have
        already visited remain available.
      </p>
    </div>
  );
}
