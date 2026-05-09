'use client';

import { Component, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

const reportError = (error: Error) => {
  if (typeof window === 'undefined') return;
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  import('@sentry/nextjs').then((Sentry) => Sentry.captureException(error)).catch(() => {});
};

type Props = { children: ReactNode; fallback?: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error) {
    reportError(error);
  }

  reset = () => this.setState({ error: null });

  override render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
            <div className="font-medium">Something went wrong</div>
            <div className="text-muted-foreground">{this.state.error.message}</div>
            <Button size="sm" variant="outline" onClick={this.reset}>
              Try again
            </Button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
