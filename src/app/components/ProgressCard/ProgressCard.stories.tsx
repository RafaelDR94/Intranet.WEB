import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { ProgressCard } from './ProgressCard';

const meta: Meta<typeof ProgressCard> = {
  title: 'Components/ProgressCard',
  component: ProgressCard,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ProgressCard>;

const withLightTheme = (StoryComp: any) => (
  <div data-theme="light" style={{ color: 'var(--color-foreground)', minHeight: '50vh', padding: '2rem' }}>
    <StoryComp />
  </div>
);

export const Default: Story = {
  args: { percentage: 65 },
  decorators: [withLightTheme],
};

