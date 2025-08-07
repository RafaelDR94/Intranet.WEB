import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';
import type { ColumnDefinition } from './types';

interface Person {
  id: number;
  name: string;
  role: string;
  joinedAt?: string;
}

// 🔹 Columnas base
const columns:any = [
  { key: 'name', label: 'Nombre' },
  { key: 'role', label: 'Rol' },
];

// 🔹 Datos base
const data: Person[] = [
  { id: 1, name: 'Alice', role: 'Admin' },
  { id: 2, name: 'Bob', role: 'User' },
  { id: 3, name: 'Charlie', role: 'Developer' },
];

// 🔹 Meta principal
const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof DataTable>;

// ─────────────────────────────────────────
// 📘 1. Caso base (con selección)
// ─────────────────────────────────────────
export const Basico: Story = {
  args: {
    tables: [
      {
        title: 'Usuarios',
        columns,
        data,
        enableSelection: true,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: `
### 🧾 Tabla básica

Ejemplo simple de tabla con selección de filas y columnas estándar. Usa el campo \`enableSelection\` para permitir seleccionar múltiples elementos por checkbox.
        `,
      },
    },
  },
};

// ─────────────────────────────────────────
// 📘 2. Tabla con búsqueda interna
// ─────────────────────────────────────────
export const ConBusqueda: Story = {
  args: {
    tables: [
      {
        title: 'Usuarios',
        columns,
        data,
        enableSelection: true,
      },
    ],
    enableInternalSearch: true,
    searchableKeys: ['name', 'role'] as any,
  },
  parameters: {
    docs: {
      description: {
        story: `
### 🔍 Búsqueda interna

Activa el buscador incorporado con los props:

- \`enableInternalSearch: true\`
- \`searchableKeys: ['name', 'role']\`

La búsqueda filtra dinámicamente según las columnas especificadas.
        `,
      },
    },
  },
};

// ─────────────────────────────────────────
// 📘 3. Múltiples tablas colapsables
// ─────────────────────────────────────────
export const MultiplesTablas: Story = {
  args: {
    tables: [
      {
        title: 'Admins',
        data: data.filter(d => d.role === 'Admin'),
        columns,
        enableCollaps: true,
      },
      {
        title: 'Usuarios',
        data: data.filter(d => d.role !== 'Admin'),
        columns,
        enableCollaps: true,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: `
### 📚 Múltiples tablas colapsables

Puedes mostrar varias tablas agrupadas, cada una con su título y la opción \`enableCollaps: true\` para permitir contraerlas/expandirlas.
        `,
      },
    },
  },
};

// ─────────────────────────────────────────
// 📘 4. Con botones de acción superior
// ─────────────────────────────────────────
export const ConAcciones: Story = {
  args: {
    tables: [
      {
        title: 'Con Acciones',
        columns,
        data,
      },
    ],
    actionLabel: 'Crear nuevo',
    showButton: true,
    showCalendar: true,
    showFilter: true,
    onTableActionClick: () => alert('Acción principal'),
    onCalendarClick: () => alert('Abrir calendario'),
    onFilterClick: () => alert('Abrir filtros'),
  },
  parameters: {
    docs: {
      description: {
        story: `
### ⚙️ Acciones y filtros

Puedes añadir botones de acción y herramientas visuales como:

- \`onTableActionClick\`: Acción principal (botón).
- \`onCalendarClick\`, \`onFilterClick\`: íconos de calendario y filtro.
- \`actionLabel\`: personaliza el texto del botón principal.
        `,
      },
    },
  },
};

// ─────────────────────────────────────────
// 📘 5. Con renderizado personalizado
// ─────────────────────────────────────────
export const ConRenderPersonalizado: Story = {
  args: {
    tables: [
      {
        title: 'Custom',
        columns: [
          {
            key: 'name' as any,
            label: 'Nombre',
            render: (row:any) => <strong style={{ color: 'green' }}>{row.name}</strong>,
          },
          {
            key: 'role'as any,
            label: 'Rol',
            render: (row:any) => (
              <span style={{ backgroundColor: '#eef', padding: '2px 6px', borderRadius: 4 }}>
                {row.role}
              </span>
            ),
          },
        ],
        data,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: `
### 🎨 Renderizado personalizado

Puedes personalizar tanto las celdas como los encabezados de columnas usando:

- \`render: (row) => ReactNode\` para cada celda.
- \`headerRender: () => ReactNode\` si deseas cambiar el encabezado.
        `,
      },
    },
  },
};

// ─────────────────────────────────────────
// 📘 6. Tema oscuro
// ─────────────────────────────────────────
export const DarkMode: Story = {
  ...Basico,
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ background: 'var(--color-gray-10)', color: 'var(--color-foreground)', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: `
### 🌙 Tema oscuro

Todas las variantes soportan tema oscuro vía \`data-theme="dark"\`. Asegúrate de que tu componente reaccione a las variables CSS.
        `,
      },
    },
  },
  
};
// ─────────────────────────────────────────
// 📘 7. Acciones personalizadas con `actionsRender`
// ─────────────────────────────────────────
export const ConAccionesPersonalizadas: Story = {
  args: {
    tables: [
      {
        title: 'Acciones personalizadas',
        columns,
        data,
      },
    ],
    actionsRender: () => (
      <div className="flex gap-2 items-center">
        <button onClick={() => alert('Exportar')} className="btn-outline">📤 Exportar</button>
        <button onClick={() => alert('Descargar CSV')} className="btn-outline">📄 CSV</button>
      </div>
    ),
    showButton: false, // Oculta el botón principal para usar solo acciones personalizadas
    showCalendar: false,
    showFilter: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
### 🧩 Acciones personalizadas

Puedes reemplazar el botón de acción principal usando el prop \`actionsRender\`.

Esto permite insertar cualquier componente (botones, íconos, etc.) en lugar del botón principal.

> Importante: establece \`showButton: false\` para ocultar el botón por defecto.
        `,
      },
    },
  },
};

// ─────────────────────────────────────────
// 📘 8. Encabezado personalizado con `headerRender`
// ─────────────────────────────────────────
export const ConEncabezadoPersonalizado: Story = {
  args: {
    tables: [
      {
        title: 'Encabezado custom',
        columns: [
          {
            key: 'name'as any,
            label: 'Nombre',
            headerRender: () => (
              <span style={{ color: 'blue', fontWeight: 700 }}>
                🧑 Nombre del usuario
              </span>
            ),
          },
          {
            key: 'role'as any,
            label: 'Rol',
          },
        ],
        data,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: `
### 🧾 Encabezado personalizado con \`headerRender\`

Cada columna admite un prop opcional \`headerRender\` para modificar el encabezado visual.

Esto es útil para incluir íconos, estilos u otros elementos en la cabecera.
        `,
      },
    },
  },
};