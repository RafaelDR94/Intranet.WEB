'use client';
import React, { useMemo, useState } from 'react';
import { ColumnDefinition } from "@/app/components/DataTable/types";
import { DataTable } from "@/app/components/DataTable/DataTable";

import CheckIcon from '@/assets/icons/acciones/check.svg';
import CrossIcon from '@/assets/icons/acciones/cancel.svg';
import WarningIcon from '@/assets/icons/acciones/minus.svg';
import DownloadIcon from '@/assets/icons/acciones/download.svg';

import { Button } from "@/app/components/Button/Button";
import DetailsPanelLayout from '@/app/components/DetailsPanelLayout/DetailsPanelLayout';

type Cfdi = {
  id: string;
  deudor: string;
  archivo: string;
  uuid: string;
  clave?: string;
  descripcion?: string;
  total: number;
  estado: string;
};

type PanelMode = 'details' | 'comment';

const SAT = () => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [selected, setSelected] = useState<Cfdi | null>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>('details');
  const [comment, setComment] = useState('');

  const dataCFDI: Cfdi[] = useMemo(() => ([
    {
      id: '1',
      deudor: 'DD0001',
      archivo: 'DD0001',
      uuid: '0A6F61E0-BAAD-4CF4...',
      clave: '50202200',
      descripcion: 'New Mix Paloma...',
      total: 297,
      estado: 'Vigente',
    },
  ]), []);

  const columnasValidos: ColumnDefinition<Cfdi>[] = [
    {
      key: 'estado',
      headerRender: () => null,
      render: () => <CheckIcon className="text-green-60" />,
      cellClass: 'w-10 text-center',
      headerClass: 'w-10',
    },
    { key: 'archivo', label: 'ARCHIVO' },
    { key: 'uuid', label: 'UUID' },
    { key: 'total', label: 'TOTAL', render: (row) => `$${row.total.toFixed(2)}` },
    { key: 'estado', label: 'ESTADO SAT' },
  ];

  const columnasProhibidas: ColumnDefinition<Cfdi>[] = [
    {
      key: 'estado',
      headerRender: () => null,
      render: () => <CrossIcon className="text-alert-red-50" />,
      cellClass: 'w-10 text-center',
      headerClass: 'w-10',
    },
    { key: 'deudor', label: 'DEUDOR' },
    { key: 'archivo', label: 'ARCHIVO' },
    { key: 'uuid', label: 'UUID' },
    { key: 'clave', label: 'CLAVE' },
    { key: 'descripcion', label: 'DESCRIPCIÓN' },
    { key: 'total', label: 'TOTAL', render: (row) => `$${row.total.toFixed(2)}` },
    { key: 'estado', label: 'ESTADO SAT' },
    {
      key: 'detalles' as keyof Cfdi,
      label: 'DETALLES',
      render: (row) => (
        <Button
          variant="ghost"
          size="small"
          hideIcon
          onClick={() => {
            setSelected(row);
            setPanelMode('details');
            setPanelOpen(true);
          }}
        >
          Ver Detalles
        </Button>
      ),
    },
    {
      key: 'comentarios' as keyof Cfdi,
      label: 'COMENTARIOS',
      render: (row) => (
        <Button
          variant="ghost"
          size="small"
          onClick={() => {
            setSelected(row);
            setPanelMode('comment');
            setComment('');
            setPanelOpen(true);
          }}
        >
          Agregar un comentario
        </Button>
      ),
    },
  ];

  const columnasInvalidas = columnasProhibidas.map(col =>
    col.key === 'estado'
      ? { ...col, render: () => <WarningIcon className="text-alert-yellow-100" /> }
      : col
  );

  const handleSaveComment = () => {
    if (!selected) return;
    // Aquí integras tu POST/PUT al backend con { id: selected.id, comment }
    console.log('Guardar comentario', { id: selected.id, comment });
    setPanelOpen(false);
  };

  return (
    <>
      <DataTable
        tables={[{
          title: 'CFDIs Válidos',
          enableCollaps: true,
          data: dataCFDI,
          columns: columnasValidos,
        }]}
        enableInternalSearch
        onSearchChange={() => console.log('Enviar')}
        actionsRender={() => (
          <div className="ml-auto flex items-center gap-2">
            <Button size="medium" variant="ghost" hideIcon>Descargar</Button>
            <Button size="medium" variant="outline" icon={DownloadIcon} iconOnly aria-label="Descargar" />
            <Button size="medium" hideIcon>Enviar</Button>
          </div>
        )}
      />

      <div className="mt-5">
        <DataTable
          enableInternalSearch
          tables={[
            { data: dataCFDI, columns: columnasProhibidas, title: 'CFDIs con Claves Prohibidas', enableCollaps: false },
            { data: dataCFDI, columns: columnasInvalidas, title: 'CFDIs con Claves Inválidas', enableCollaps: false },
          ]}
          actionsRender={() => (
            <div className="ml-auto flex items-center gap-2">
              <Button size="medium" variant="ghost" hideIcon>Descargar</Button>
              <Button size="medium" variant="outline" icon={DownloadIcon} iconOnly aria-label="Descargar" />
              <Button size="medium" hideIcon>Enviar</Button>
            </div>
          )}
        />
      </div>

      {/* Details / Comment Panel */}
      <DetailsPanelLayout
        open={panelOpen}
        withinContainer
        onClose={() => setPanelOpen(false)}
        leftLabel={selected ? `UUID: ${selected.uuid}` : undefined}
        rightLabel={selected ? `Total: $${selected.total.toFixed(2)}` : undefined}
        actionButton={
          <Button size="large" variant="solid" hideIcon>
            Acción
          </Button>
        }
      >
        {selected ? (
          <div className="space-y-4">
            <div className="text-s2 font-semibold">Detalles del CFDI</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="text-b3">Deudor: {selected.deudor}</div>
              <div className="text-b3">Archivo: {selected.archivo}</div>
              <div className="text-b3">Clave: {selected.clave ?? '—'}</div>
              <div className="text-b3">Descripción: {selected.descripcion ?? '—'}</div>
              <div className="text-b3">Estado SAT: {selected.estado}</div>
            </div>

            {/* Footer condicional solo para "Agregar un comentario" */}
            {panelMode === 'comment' && (
              <div className="pt-2">
                <div className="text-s2 font-semibold mb-2">Comentarios:</div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Agregar comentario"
                  className="w-full min-h-28 rounded-md border border-gray-30 bg-white-100 text-b3 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-50"
                />
                <div className="mt-3 flex justify-end">
                  <Button
                    size="medium"
                    variant="outline"
                    hideIcon
                    onClick={handleSaveComment}
                    disabled={!comment.trim()}
                  >
                    Guardar Comentario
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-70 text-b3">Selecciona un CFDI para ver detalles.</div>
        )}
      </DetailsPanelLayout>
    </>
  );
};

export default SAT;
