import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import DetailsPanelLayout from './DetailsPanelLayout';

const meta: Meta<typeof DetailsPanelLayout> = {
  title: 'Components/DetailsPanel',
  component: DetailsPanelLayout,
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof DetailsPanelLayout>;

export const Playground: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [expanded, setExpanded] = useState(false);

    return (
      <div className='h-screen w-full bg-gray-10' data-theme='light'>
        <button className='m-4 px-3 py-2 rounded-md bg-blue-60 text-white-100' onClick={() => setOpen(true)}>Abrir Detalles</button>

        <DetailsPanelLayout
          open={open}
          expanded={expanded}
          onClose={() => { setOpen(false); setExpanded(false); }}
          onExpandedChange={setExpanded}
          actionButton={<button className='px-3 py-2 rounded-md bg-turquoise-70 text-black-100'>Validar</button>}
          renderActions={() => (
            <div className='flex items-center gap-2'>
              <button className='text-c2 underline'>Acción 1</button>
              <button className='text-c2 underline'>Acción 2</button>
            </div>
          )}
          leftLabel={<span>Usuario: Tania Guerrero</span>}
          rightLabel={<span>Proyecto: VISITAX</span>}
        >
          <div className='space-y-4'>
            <p className='text-b3'>Aquí va tu contenido (children). Puedes pegar el layout de factura o formulario.</p>
            <div className='h-96 rounded-md border border-gray-20 bg-white-100' />
          </div>
        </DetailsPanelLayout>
      </div>
    );
  },
};