import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { fn } from '@storybook/test';

import { CameraViewer } from './CameraViewer';

const meta: Meta<typeof CameraViewer> = {
  title: 'Components/CameraViewer',
  component: CameraViewer,
  args: {
    isOpen: true,
    defaultFacingMode: 'environment',
    captureButtonLabel: 'Capturar',
    switchButtonLabel: 'Cambiar camara',
    closeButtonLabel: 'Cerrar',
    onClose: fn(),
    onCapture: fn(),
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Modal generico que envuelve al API getUserMedia. Muestra la vista previa, permite alternar camara y expone la captura como File.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof CameraViewer>;

export const Playground: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);
    const [lastCapture, setLastCapture] = useState<string | null>(null);

    if (!open) {
      return (
        <button type="button" onClick={() => setOpen(true)}>
          Abrir visor
        </button>
      );
    }

    return (
      <div>
        <CameraViewer
          {...args}
          isOpen={open}
          onClose={() => {
            setOpen(false);
            args.onClose?.();
          }}
          onCapture={(file) => {
            setLastCapture(file.name);
            args.onCapture?.(file);
          }}
        />
        {lastCapture && (
          <p style={{ marginTop: 16, fontSize: 12 }}>Ultima captura: {lastCapture}</p>
        )}
      </div>
    );
  },
};

export const LoadingState: Story = {
  args: {
    isOpen: true,
  },
  render: (args) => (
    <CameraViewer
      {...args}
      onCapture={fn()}
      onClose={fn()}
    />
  ),
};
