import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { AppTopbar } from '@/components/app-topbar';
import { ErrorBoundary } from '@/components/error-boundary';
import { QueryProvider } from '@/components/query-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Web3Provider } from '@/components/web3-provider';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <Web3Provider>
        <NuqsAdapter>
          <TooltipProvider delay={300}>
            <div className="flex min-h-dvh">
              <AppSidebar />
              <div className="flex min-w-0 flex-1 flex-col">
                <AppTopbar />
                <main className="flex-1 p-6">
                  <ErrorBoundary>{children}</ErrorBoundary>
                </main>
              </div>
            </div>
          </TooltipProvider>
        </NuqsAdapter>
      </Web3Provider>
    </QueryProvider>
  );
}
