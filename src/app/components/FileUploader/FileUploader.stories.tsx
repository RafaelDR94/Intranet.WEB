// src/app/components/FileUploader/FileUploader.stories.tsx

import { Meta, StoryObj } from '@storybook/react';

import { FileUploader } from './FileUploader';
import { FileUploaderProps } from './types';

import UploadIcon from '@/assets/icons/acciones/upload.svg';
export default {
  title: 'Components/FileUploader',
  component: FileUploader,
  argTypes: {
    onFile: { action: 'fileSelected' },
  },
  tags: ['autodocs'],
} as Meta<FileUploaderProps>;

type Story = StoryObj<FileUploaderProps>;

export const Default: Story = {
  args: {
    accept: '.xml',
    label: 'Archivo',
    placeholder: 'Seleccionar documento',
  },
};

export const Disabled: Story = {
  args: {
    accept: '.xml',
    label: 'Archivo',
    placeholder: 'Seleccionar documento',
    disabled: true,
  },
};

export const WithCustomIcon: Story = {
  args: {
    accept: '.pdf',
    label: 'Archivo',
    placeholder: 'Upload PDF',
    icon: UploadIcon,
  },
};

export const WithInitialFile: Story = {
  args: {
    accept: '.txt',
     label: 'Archivo',
     placeholder: 'Subir archivo',
    initialFile: {
      name: 'ejemplo.txt',
      base64: 'data:text/plain;base64,ZXhhbXBsbyA=',
    },
  },
};
