'use client';
import { useRef } from 'react';
import { Button } from '@/app/components/Button/Button';
import FormTestPage from '@/app/components/DynamicForm/FormTestPage';
import { FieldModel } from '@/app/components/DynamicForm/types';
import DynamicFormMatrix from '@/app/components/DynamicForm/DynamicFormMatrix';
const AddFilesComponent = () => {

    const submitRef = useRef<() => void | Promise<void>>(null)
    const fields: FieldModel[] = [
        {
            type: 'input',
            name: 'debtorName',
            label: 'Nombre del Deudor',
            placeholder: 'Ingrese el nombre completo',
            value: '',
        },
        {
            type: 'select',
            name: 'project',
            label: 'Seleccionar Proyecto',
            placeholder: 'Proyecto',
            value: '',
            options: [
                { label: 'Proyecto A', value: 'a' },
                { label: 'Proyecto B', value: 'b' },
            ],
        },
        {
            type: 'select',
            name: 'expenseType',
            label: 'Tipo de Viáticos',
            placeholder: 'Seleccione tipo',
            value: '',
            options: [
                { label: 'Proyecto', value: 'proyecto' },
                { label: 'Administrativo', value: 'admin' },
            ],
        },
        {
            type: 'file',
            name: 'pdf',
            label: 'Subir archivo',
            value: null,
            accept: '.pdf',
            validations: [{ type: 'required' }],
        },
        {
            type: 'file',
            name: 'xml',
            label: 'Subir archivo',
            value: null,
            accept: '.xml',
            validations: [{ type: 'required' }],
        },
    ]
    const isFormComplete = false

    return (
        <div className="flex flex-col gap-4">
            {/* Título + botón fuera del contenedor */}
            <div className="flex justify-between items-center">
                <h2 className="text-blue-60 text-b4 font-medium">
                    Sube aquí tus archivos XML y PDF
                </h2>
                <Button onClick={() => submitRef.current?.()} disabled={!isFormComplete} hideIcon={true} >Subir Archivos</Button>
            </div>

            <div className="bg-white-100 p-6 rounded-lg shadow-md">
                <DynamicFormMatrix
                    fields={fields}
                    layoutMatrix={[[5], [5, 5], [5, 5]]}
                    submitLabel="Enviar solicitud"
                    onSubmit={(values) => {
                        console.log('Valores enviados:', values)
                    }}
                    externalSubmitRef={submitRef}
                    showSubmitIf={() => false} // Para ocultar botón interno
                />
            </div>
        </div>
    );
};

export default AddFilesComponent;
