'use client'
import { useRef, useState } from 'react'
import { FieldModel } from '@/app/components/DynamicForm/types'
import DynamicForm from '@/app/components/DynamicForm/DynamicForm'
import FormsLayout from '@/app/components/FormsLayout/FormsLayout'

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
            onChange: (value, values) => { console.log("value", value); console.log("values", values) }
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
        <FormsLayout
            title="Sube aquí tus archivos XML y PDF"
            buttonLabel="Subir Archivos"
            onButtonClick={() => submitRef.current?.()}
            buttonDisabled={!formReady}
        >


            <div className="w-3/4">
                <DynamicForm
                    fields={fields}
                    layoutMatrix={[[5], [5, 5], [5, 5]]}
                    submitLabel="Enviar solicitud"
                    onSubmit={(values) => console.log("Valores enviados:", values)}
                    onValidChange={setFormReady}
                    externalSubmitRef={submitRef}
                    showSubmitIf={() => false}
                />
            </div>

            <div className="w-1/4 flex justify-center items-start">
                <img
                    src="/images/receipt-example.png"
                    alt="Vista previa del recibo"
                    className="w-full max-w-[160px] object-contain rounded-md shadow"
                />
            </div>

        </FormsLayout>
    )
}

export default AddFilesComponent
