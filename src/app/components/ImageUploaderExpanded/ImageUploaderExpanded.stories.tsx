import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { fn } from '@storybook/test';

import { ImageUploaderExpanded } from './ImageUploaderExpanded';

const meta: Meta<typeof ImageUploaderExpanded> = {
  title: 'Components/ImageUploaderExpanded',
  component: ImageUploaderExpanded,
  args: {
    label: 'Fotografia de evidencia',
    placeholder: 'arrastra/selecciona la imagen que deseas subir',
    buttonLabel: 'Seleccionar Imagen',
    onImage: fn(),
    accept: 'image/*',
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Dropzone con boton + integracion de camara. Permite subir un archivo desde el sistema o capturarlo al vuelo usando CameraViewer.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ImageUploaderExpanded>;

export const Playground: Story = {
  render: (args) => {
    const [fileName, setFileName] = useState<string | null>(null);

    return (
      <div style={{ width: 360 }}>
        <ImageUploaderExpanded
          {...args}
          onImage={(file) => {
            setFileName(file ? file.name : null);
            args.onImage?.(file ?? null);
          }}
          cameraLabels={{ capture: 'Tomar fotografia', switchCamera: 'Cambiar camara', close: 'Cerrar visor' }}
        />
        <p style={{ marginTop: 16, fontSize: 12, color: '#475569' }}>
          {fileName ? Ultimo archivo:  : 'Sin archivo seleccionado'}
        </p>
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
