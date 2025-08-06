'use client';

import DynamicFormMatrix
 from './DynamicFormMatrix';
import { FieldModel } from '@/app/components/DynamicForm/types';

export default function FormTestPage() {
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
  ];

  return (
    <div className="max-w-5xl mx-auto p-8">
      <DynamicFormMatrix
        title="Formulario de Viáticos"
        fields={fields}
        layoutMatrix={[
          [2.5,2.5,5],
        ]}
        submitLabel="Enviar solicitud"
        onSubmit={(values) => {
          console.log('Valores enviados:', values);
        }}
      />
    </div>
  );
}
