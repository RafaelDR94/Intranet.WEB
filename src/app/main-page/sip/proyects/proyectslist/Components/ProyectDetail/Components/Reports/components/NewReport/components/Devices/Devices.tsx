'use client';

import { useState, useCallback } from 'react';
import DevicesList from './Components/DevicesList/DevicesList';
import DevicesForm from './Components/DevicesForm/DevicesForm';

// Convención: "__new__" indica que se abrió el formulario en modo creación
export const NEW_DEVICE_ID = '__new__';

const Devices: React.FC = () => {
  // ÚNICA responsabilidad del contenedor:
  // orquestar qué fila está "seleccionada" para edición/creación.
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  // Abrir formulario en modo "crear"
  const handleCreate = useCallback(() => setSelectedRowId(NEW_DEVICE_ID), []);
  // Abrir formulario en modo "editar"
  const handleEdit = useCallback((id: string) => setSelectedRowId(id), []);
  // Cerrar formulario (volver a la lista)
  const handleCloseForm = useCallback(() => setSelectedRowId(null), []);

  return (
    <section className="flex flex-col gap-6">
      {/* La lista decide si enseña tabla completa; no condicionamos aquí */}
      {!selectedRowId && <DevicesList
        selectedRowId={selectedRowId}
        onCreate={handleCreate}
        onEdit={handleEdit}
      />}
      {selectedRowId && <DevicesForm
        selectedRowId={selectedRowId}
        onClose={handleCloseForm}
        // Si quieres que el form, tras guardar, “regrese” a la lista:
        onSaved={handleCloseForm}
      />}

      {/* El form se autogestiona; solo necesita saber "a quién" edita */}

    </section>
  );
};

export default Devices;
