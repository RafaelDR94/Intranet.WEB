import type { Meta, StoryObj } from '@storybook/react';
import LoadingOverlay from './LoadingOverlay';

const meta: Meta<typeof LoadingOverlay> = {
  title: 'Components/LoadingOverlay',
  component: LoadingOverlay,
};
export default meta;

export const Light: StoryObj<typeof LoadingOverlay> = {
  args: { open: true },
  parameters: { backgrounds: { default: 'light' } },
  render: (args) => <div data-theme="light"><LoadingOverlay {...args} /></div>,
};

export const Dark: StoryObj<typeof LoadingOverlay> = {
  args: { open: true },
  render: (args) => <div data-theme="dark"><LoadingOverlay {...args} /></div>,
};