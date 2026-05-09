import { ConnectWallet } from '@/components/connect-wallet';
import { HealthBadge } from '@/components/health-badge';
import { ThemeToggle } from '@/components/theme-toggle';

export function AppTopbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur">
      <HealthBadge />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <ConnectWallet />
      </div>
    </header>
  );
}
