import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Donut from './Donut';

const meta: Meta<typeof Donut> = {
  title: 'Components/Donut',
  component: Donut,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Donut>;

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

export const Light: Story = {
  args: { percentage: 65 },
  decorators: [withLightTheme],
};

export const Dark: Story = {
  ...Light,
  decorators: [withDarkTheme],
};
