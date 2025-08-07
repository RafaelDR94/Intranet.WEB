import React, { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DynamicForm } from './DynamicForm';
import { FieldModel } from './types';

const meta: Meta<typeof DynamicForm> = {
  title: 'Components/DynamicForm/Full Showcase',
  component: DynamicForm,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof DynamicForm>;

const fetchEquipos = async (ubicacion: string) => {
  const data: Record<string, { label: string; value: string }[]> = {
    cdmx: [
      { label: 'Laptop A', value: 'lapA' },
      { label: 'Tablet A', value: 'tabA' },
    ],
    mty: [
      { label: 'Laptop B', value: 'lapB' },
      { label: 'Tablet B', value: 'tabB' },
    ],
  };
  await new Promise((res) => setTimeout(res, 300));
  return data[ubicacion] || [];
};

const allFields: FieldModel[] = [
  { type: 'input', name: 'name', label: 'Nombre completo', value: '', validations: [{ type: 'required' }, { type: 'minLength', value: 3 }] },
  { type: 'email', name: 'email', label: 'Correo', value: '', warningRules: [{ type: "deprecatedEmailDomain" }], validations: [{ type: 'required' }, { type: 'email' }] },
  { type: 'password', name: 'clave', label: 'Contraseña', value: '', validations: [{ type: 'minLength', value: 6 }] },
  {
    type: 'select',
    name: 'ubicacion',
    label: 'Ubicación',
    value: '',
    options: [
      { label: 'CDMX', value: 'cdmx' },
      { label: 'Monterrey', value: 'mty' },
    ],
    onChange: async (val, values) => {
      const nuevos = await fetchEquipos(val);
      const equipoField = document.querySelector('[name=equipo]') as HTMLSelectElement;
      if (equipoField) equipoField.disabled = true;
      setTimeout(() => {
        const event = new CustomEvent('updateField', {
          detail: {
            name: 'equipo',
            props: { options: nuevos, disabled: false, value: '' },
          },
        });
        window.dispatchEvent(event);
      }, 100);
    },
  },
  {
    type: 'select',
    name: 'equipo',
    label: 'Equipo asignado',
    value: '',
    options: [],
    disabled: true,
    showIf: (values, fields) => {
      const f = fields.find((f) => f.name === 'equipo');
      return f?.options && f.options.length > 0;
    },
  },
  {
    type: 'multiSelect',
    name: 'skills',
    label: 'Tecnologías',
    value: [],
    validations: [{ type: 'required' }],
    options: [
      { label: 'React', value: 'react' },
      { label: 'Node', value: 'node' },
      { label: 'Python', value: 'python' },
    ],
  },
  {
    type: 'input',
    name: 'justificacion',
    label: 'Justificación',
    value: '',
    showIf: (values) => values.skills?.includes('node'),
    validations: [{ type: 'minLength', value: 10 }],
  },
  { type: 'toggle', name: 'activo', label: '¿Está activo?', value: true },
  { type: 'checkbox', name: 'terminos', label: 'Acepto términos', value: false, validations: [{ type: 'required' }] },
  {
    type: 'file',
    name: 'cv',
    label: 'Sube tu CV',
    value: null,
    accept: '.pdf',
    validations: [{ type: 'required' }],
  },
];

export const Showcase: Story = {
  args: {
    fields: allFields,
    title: 'Formulario completo con validaciones',
    submitLabel: 'Registrar',
    onSubmit: (vals) => alert(JSON.stringify(vals, null, 2)),
  },
  parameters: {
    docs: {
      description: {
        story: `
### 🧾 Showcase – Validaciones completas

Este ejemplo incluye todas las funcionalidades del formulario:

- Validaciones requeridas (\`required\`), longitud mínima (\`minLength\`), formato de email, etc.
- Campo de contraseña con longitud mínima.
- Combinación de validaciones y advertencias (\`warningRules\`).
- Campos dependientes con \`showIf\` y \`onChange\`.
- Subida de archivo obligatoria (\`file\` con \`required\`).
- Checkbox con validación requerida.

#### ✅ Validaciones soportadas:
- \`required\`: campo obligatorio.
- \`email\`: debe tener un formato de correo válido.
- \`minLength\`, \`maxLength\`: longitud mínima y máxima (solo en strings).
- \`min\`, \`max\`: valores numéricos (para tipo \`number\`).
- \`noSpecialCharacters\`: solo letras y números, sin símbolos.
- \`alphaNumericSpaces\`: permite letras, números y espacios sin comenzar/terminar con espacio.

#### ⚠️ Advertencias no bloqueantes (\`warningRules\`):
- \`deprecatedEmailDomain\`
- \`weakPassword\`
- \`minLengthWarning\`, \`maxLengthWarning\`
- ...y más.

Estas reglas no impiden el envío, pero pueden generar mensajes informativos o sugerencias visuales.
        `,
      },
    },
  },
};

export const ConCondiciones: Story = {
  args: {
    fields: allFields.filter(f =>
      ['ubicacion', 'equipo', 'skills', 'justificacion'].includes(f.name)
    ),
    title: 'Campos condicionales (showIf)',
    onSubmit: (vals) => console.log(vals),
  },
  parameters: {
    docs: {
      description: {
        story: `
### 🔀 Condiciones dinámicas con \`showIf\`

Esta historia muestra cómo se puede controlar la visibilidad de los campos en función del estado del formulario.

#### Ejemplos:

- El campo **"Equipo asignado"** se muestra solo si el campo \`ubicacion\` ha sido seleccionado y tiene opciones disponibles.
- El campo **"Justificación"** aparece únicamente cuando se ha seleccionado **"Node"** dentro del campo multiselección \`skills\`.

#### ✅ ¿Cómo funciona?

Cada campo puede incluir la propiedad \`showIf\` con una función:

\`\`\`ts
showIf: (values) => values.skills?.includes('node')
\`\`\`

Esta función se evalúa en cada render, permitiendo lógica condicional avanzada.
        `,
      },
    },
  },
};

export const ConLayout: Story = {
  args: {
    fields: allFields,
    layoutMatrix: [
      [5, 5],
      [10],
      [5, 5],
      [10],
      [10],
      [5, 5],
      [10],
    ],
    title: 'Con layoutMatrix definido',
    onSubmit: (vals) => console.log(vals),
  },
  parameters: {
    docs: {
      description: {
        story: `
### 📐 Layout personalizado con \`layoutMatrix\`

Este ejemplo muestra cómo distribuir los campos en filas con proporciones específicas.

#### 🧩 ¿Cómo funciona?

La propiedad \`layoutMatrix\` define una matriz de proporciones para cada fila, donde **la suma de cada fila debe ser 10**.

\`\`\`ts
layoutMatrix: [
  [5, 5],  // dos campos con 50% de ancho cada uno
  [10],    // un campo de ancho completo
  [5, 5],  // otra fila con dos mitades
]
\`\`\`

Esto es útil para crear formularios más compactos, organizados y alineados visualmente sin necesidad de escribir CSS adicional.
        `,
      },
    },
  },
};
export const ConSubmitExterno: Story = {
  render: (args) => {
    const submitRef = useRef<() => void>();
    return (
      <div data-theme="light" style={{ padding: '1rem', background: 'var(--color-gray-10)' }}>
        <DynamicForm {...args} externalSubmitRef={submitRef} showSubmitIf={() => false} />
        <button onClick={() => submitRef.current?.()} style={{ marginTop: '1rem' }}>Enviar</button>
      </div>
    );
  },
  args: {
    fields: allFields,
    onSubmit: (vals) => console.log(vals),
  },
parameters: {
  docs: {
    description: {
      story: `
### ⏭ Envío externo con \`externalSubmitRef\`

Este ejemplo muestra cómo enviar el formulario desde un botón fuera del propio componente.

#### ¿Cómo funciona?

- Se pasa una referencia React (\`useRef\`) al prop \`externalSubmitRef\`.
- Dentro del formulario, esta referencia se asocia a la función de envío (\`submitForm\` de Formik).
- Puedes disparar el envío llamando: \`submitRef.current?.()\`.

#### 🔁 ¿Cuándo se usa?

- Para flujos donde el botón de envío está en otro lugar del layout.
- Para pasos en formularios wizard/multi-paso.
      `,
    },
  },
},

};
