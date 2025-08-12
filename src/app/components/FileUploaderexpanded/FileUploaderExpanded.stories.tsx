// src/app/components/FileUploaderExpanded/FileUploaderExpanded.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { FileUploaderExpanded } from './FileUploaderExpanded';

const meta: Meta<typeof FileUploaderExpanded> = {
  title: 'Components/FileUploaderExpanded',
  component: FileUploaderExpanded,
  parameters: { layout: 'centered' },
  args: {
    label: 'Seleccione el archivo excel a subir',
    accept: '.pdf,.xlsx,.xls',
    placeholder: 'Arrastra y suelta un archivo o usa el botón',
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof FileUploaderExpanded>;

export const Light: Story = {
  decorators: [
    (Story) => (
      <div data-theme="light" style={{ width: 520 }}>
        <Story />
      </div>
    ),
  ],
};

export const Dark: Story = {
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ width: 520 }}>
        <Story />
      </div>
    ),
  ],
};

export const WithFileControlled: Story = {
  render: (args) => {
    const [file, setFile] = useState<File | null>(new File(['x'], 'ejemplo.pdf', { type: 'application/pdf' }));
    return (
      <div data-theme="light" style={{ width: 520 }}>
        <FileUploaderExpanded {...args} initialFile={file ?? undefined} onFile={setFile} />
      </div>
    );
  },
};
