import { useState, useCallback } from "react";
export const NEW_DEVICE_ID = '__new__';
const useDevices = () => {
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

    // Abrir formulario en modo "crear"
    const handleCreate = useCallback(() => setSelectedRowId(NEW_DEVICE_ID), []);
    // Abrir formulario en modo "editar"
    const handleEdit = useCallback((id: string) => setSelectedRowId(id), []);
    // Cerrar formulario (volver a la lista)
    const handleCloseForm = useCallback(() => setSelectedRowId(null), []);

    return {
        selectedRowId,
        handleCreate,
        handleEdit,
        handleCloseForm
    }
}
export default useDevices