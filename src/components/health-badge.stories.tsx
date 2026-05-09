import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { HealthBadge } from './health-badge';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const meta = {
  title: 'App/HealthBadge',
  component: HealthBadge,
  decorators: [
    (Story: () => ReactNode) => (
      <QueryClientProvider client={queryClient}>{Story()}</QueryClientProvider>
    ),
  ],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof HealthBadge>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
