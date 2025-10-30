import type { Meta, StoryObj } from '@storybook/react';

import type { ColumnDefinition } from '../../types';

import DataTableContent from './DataTableContent';

interface Person {
  id: number;
  name: string;
}

const columns: ColumnDefinition<Person>[] = [
  { key: 'name', label: 'Nombre' },
];

const data: Person[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

const meta: Meta<typeof DataTableContent> = {
  title: 'Components/DataTable/DataTableContent',
  component: DataTableContent,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof DataTableContent>;

export const LightMode: Story = {
  render: () => (
    <div
      data-theme="light"
      style={{ backgroundColor: 'var(--color-gray-10)', color: 'var(--color-foreground)', padding: '1rem' }}
    >
      <DataTableContent<Person> data={data} columns={columns} />
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      style={{ backgroundColor: 'var(--color-gray-10)', color: 'var(--color-foreground)', padding: '1rem' }}
    >
      <DataTableContent<Person> data={data} columns={columns} />
    </div>
  ),
};
