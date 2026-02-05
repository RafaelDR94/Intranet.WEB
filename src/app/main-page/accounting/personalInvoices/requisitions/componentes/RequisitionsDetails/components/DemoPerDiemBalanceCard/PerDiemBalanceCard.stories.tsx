import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import PerDiemBalanceCard from './PerDiemBalanceCard';

const meta: Meta<typeof PerDiemBalanceCard> = {
  title: 'Components/PerDiemBalanceCard',
  component: PerDiemBalanceCard,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof PerDiemBalanceCard>;

const withLightTheme = (Story: any) => (
  <div data-theme="light" style={{ padding: '2rem', backgroundColor: 'var(--color-gray-10)' }}>
    <Story />
  </div>
);

const withDarkTheme = (Story: any) => (
  <div data-theme="dark" style={{ padding: '2rem', backgroundColor: 'var(--color-gray-10)' }}>
    <Story />
  </div>
);

const baseArgs = {
  startDate: '2025-01-01',
  endDate: '2025-01-10',
  requestedAmount: 1000,
  verifiedAmount: 600,
  enterpriseAmount: 300,
  employeeAmount: 100,
  elapsedDays: 3,
  totalDays: 5,
  percentage: 60,
};

export const Light: Story = {
  args: baseArgs,
  decorators: [withLightTheme],
};

export const Dark: Story = {
  args: baseArgs,
  decorators: [withDarkTheme],
};
