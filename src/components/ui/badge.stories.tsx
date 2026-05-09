import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Badge } from './badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'patient_data' } };
export const Secondary: Story = { args: { variant: 'secondary', children: 'VARCHAR' } };
export const Outline: Story = { args: { variant: 'outline', children: 'PK' } };
export const Destructive: Story = { args: { variant: 'destructive', children: 'failed' } };
