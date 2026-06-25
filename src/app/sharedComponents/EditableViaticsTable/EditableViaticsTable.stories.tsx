import type { Meta, StoryObj } from '@storybook/react';

import { EditableViaticsTable } from './EditableViaticsTable';
import { mockViaticsRows } from './utilities/mockRows';

const meta: Meta<typeof EditableViaticsTable> = {
  title: 'SharedComponents/EditableViaticsTable',
  component: EditableViaticsTable,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EditableViaticsTable>;

export const LightMode: Story = {
  args: {
    defaultValue: mockViaticsRows,
  },
  decorators: [(Story) => <div data-theme="light" className="p-4 bg-gray-10"><Story /></div>],
};

export const DarkMode: Story = {
  args: {
    defaultValue: mockViaticsRows,
  },
  decorators: [(Story) => <div data-theme="dark" className="p-4 bg-gray-10"><Story /></div>],
};
