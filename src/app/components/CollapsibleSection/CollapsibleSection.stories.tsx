import type { Meta, StoryObj } from '@storybook/react';

import { CollapsibleSection } from './CollapsibleSection';

const meta: Meta<typeof CollapsibleSection> = {
  title: 'Components/CollapsibleSection',
  component: CollapsibleSection,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof CollapsibleSection>;

const wrapperStyle = {
  backgroundColor: 'var(--color-gray-10)',
  color: 'var(--color-foreground)',
  minHeight: '20vh',
  padding: '1rem',
};

export const LightDefaultOpen: Story = {
  args: {
    title: 'Sección visible',
    children: <div>Este contenido está visible por defecto</div>,
  },
  decorators: [
    (Story) => (
      <div data-theme="light" style={wrapperStyle}>
        <Story />
      </div>
    ),
  ],
};

export const DarkDefaultOpen: Story = {
  args: {
    title: 'Sección visible',
    children: <div>Este contenido está visible por defecto</div>,
  },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={wrapperStyle}>
        <Story />
      </div>
    ),
  ],
};

export const LightClosedInitially: Story = {
  args: {
    title: 'Sección cerrada al inicio',
    defaultOpen: false,
    children: <div>Este contenido aparece tras hacer clic</div>,
  },
  decorators: [
    (Story) => (
      <div data-theme="light" style={wrapperStyle}>
        <Story />
      </div>
    ),
  ],
};

export const DarkClosedInitially: Story = {
  args: {
    title: 'Sección cerrada al inicio',
    defaultOpen: false,
    children: <div>Este contenido aparece tras hacer clic</div>,
  },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={wrapperStyle}>
        <Story />
      </div>
    ),
  ],
};
