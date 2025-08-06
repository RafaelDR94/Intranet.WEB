// CollapsibleSection.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { CollapsibleSection } from './CollapsibleSection';

const meta: Meta<typeof CollapsibleSection> = {
  title: 'Components/CollapsibleSection',
  component: CollapsibleSection,
  tags: ['autodocs'],
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#171717' },
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof CollapsibleSection>;

export const DefaultOpen: Story = {
  args: {
    title: 'Sección visible',
    children: <div>Este contenido está visible por defecto</div>,
  },
};

export const ClosedInitially: Story = {
  args: {
    title: 'Sección cerrada al inicio',
    defaultOpen: false,
    children: <div>Este contenido aparece tras hacer clic</div>,
  },
};
