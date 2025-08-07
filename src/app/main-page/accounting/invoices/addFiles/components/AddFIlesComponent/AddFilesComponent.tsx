'use client'
import { useRef, useState } from 'react'
import { Button } from '@/app/components/Button/Button'
import { FieldModel } from '@/app/components/DynamicForm/types'
import DynamicForm from '@/app/components/DynamicForm/DynamicForm'

const AddFilesComponent = () => {
    const submitRef = useRef<() => void | Promise<void>>(null)
    const [formReady, setFormReady] = useState(false);
    const fields: FieldModel[] = [
        {
            type: 'input',
            name: 'debtorName',
            label: 'Nombre del Deudor',
            placeholder: 'Ingrese el nombre completo',
            value: 'Bruno',
            className: 'max-w-[400px]',
            onlyText: false
        },
        {
            type: 'select',
            name: 'project',
            label: 'Seleccionar Proyecto',
            placeholder: 'Proyecto',
            value: 'a',
            options: [
                { label: 'Proyecto A', value: 'a' },
                { label: 'Proyecto B', value: 'b' },
            ],
            className: 'max-w-[400px]',
            onlyText: false

        },
        {
            type: 'select',
            name: 'expenseType',
            label: 'Tipo de Viáticos',
            placeholder: 'Seleccione tipo',
            value: 'proyecto',
            options: [
                { label: 'Proyecto', value: 'proyecto' },
                { label: 'Administrativo', value: 'admin' },
            ],
            className: 'max-w-[400px]',
            
        },
        {
            type: 'file',
            name: 'pdf',
            label: 'Subir archivo',
            value: null,
            accept: '.pdf',
            validations: [{ type: 'required' }],
            className: 'max-w-[300px]',
            onChange:(value,values)=>{console.log("value",value);console.log("values",values)}
        },
        {
            type: 'file',
            name: 'xml',
            label: 'Subir archivo',
            value: null,
            accept: '.xml',
            validations: [{ type: 'required' }],
            className: 'max-w-[300px]'
        },
    ]


    return (
        <div className="flex flex-col gap-4">
            {/* Título y botón */}
            <div className="flex justify-between items-center">
                <h2 className="text-blue-60 text-b4 font-medium">
                    Sube aquí tus archivos XML y PDF
                </h2>
                <Button
                    onClick={() => submitRef.current?.()}
                    disabled={!formReady}
                    hideIcon={true}
                >
                    Subir Archivos
                </Button>
            </div>

            {/* Contenedor del formulario + imagen */}
            <div className="flex bg-white-100 p-6 rounded-lg shadow-md gap-6">
                {/* Formulario: 3/4 */}
                <div className="w-3/4">
                    <DynamicForm
                        fields={fields}
                        layoutMatrix={[[5], [5, 5], [5, 5]]}
                        submitLabel="Enviar solicitud"
                        onSubmit={(values) => {
                            console.log('Valores enviados:', values)
                        }}
                        onValidChange={(isvalid) => { setFormReady(isvalid) }}
                        externalSubmitRef={submitRef}
                        showSubmitIf={() => false}
                    />
                </div>

                {/* Imagen: 1/4 */}
                <div className="w-1/4 flex justify-center items-start">
                    <img
                        src="/images/receipt-example.png" // <-- reemplaza con tu ruta real
                        alt="Vista previa del recibo"
                        className="w-full max-w-[160px] object-contain rounded-md shadow"
                    />
                </div>
            </div>
        </div>
    )
}

export default AddFilesComponent
