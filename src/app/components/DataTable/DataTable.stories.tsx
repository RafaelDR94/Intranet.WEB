import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { DataTable } from './DataTable';

interface Person {
  id: number;
  name: string;
  role: string;
  joinedAt?: string;
}

const columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'role', label: 'Rol' },
] as const;

const data: Person[] = [
  { id: 1, name: 'Alice', role: 'Admin' },
  { id: 2, name: 'Bob', role: 'User' },
  { id: 3, name: 'Charlie', role: 'Developer' },
];

const filterOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Admins', value: 'admin' },
  { label: 'No admins', value: 'others' },
];

const meta: Meta<typeof DataTable<Person>> = {
  title: 'Components/DataTable',
  component: DataTable<Person>,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Componente de tabla con **búsqueda**, **filtros**, **paginación** y **selección**.

- Compatible con **tema claro/oscuro** via \`data-theme\`.
- Soporta múltiples tablas agrupadas (cada una puede ser colapsable).
- Búsqueda **interna** (local) o **externa** (controlada por props).

> Las props están documentadas con **JSDoc** para aprovechar **autodocs** de Storybook. :contentReference[oaicite:10]{index=10}:contentReference[oaicite:11]{index=11}:contentReference[oaicite:12]{index=12}:contentReference[oaicite:13]{index=13}
        `,
      },
    },
  },
  argTypes: {
    actionLabel: { control: 'text', description: 'Etiqueta del botón de acción principal' },
    showButton: { control: 'boolean' },
    showCalendar: { control: 'boolean' },
    showFilter: { control: 'boolean' },
    showDownloadTable: { control: 'boolean' },
    enableInternalSearch: { control: 'boolean' },
    enablePagination: { control: 'boolean' },
    rowsPerPage: { control: { type: 'number', min: 1, step: 1 } },
    onTableActionClick: { action: 'onTableActionClick' },
    onCalendarClick: { action: 'onCalendarClick' },
    onFilterClick: { action: 'onFilterClick' },
    onFilterChange: { action: 'onFilterChange' },
    onSearch: { action: 'onSearch' },
    onSearchChange: { action: 'onSearchChange' },
    onPageChange: { action: 'onPageChange' },
    onDateRangeChange: { action: 'onDateRangeChange' },
    onSelectedChange: { action: 'onSelectedChange' },
  },
};
export default meta;

type Story = StoryObj<typeof DataTable<Person>>;

export const Basico: Story = {
  args: {
    tables: [
      { title: 'Usuarios', columns: columns as any, data, enableSelection: true },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: `
### 🧾 Tabla básica
Tabla simple con selección de filas por checkbox. Ideal como boilerplate.
        `,
      },
    },
  },
};

export const ConBusqueda: Story = {
  args: {
    tables: [
      { title: 'Usuarios', columns: columns as any, data, enableSelection: true },
    ],
    enableInternalSearch: true,
    searchableKeys: ['name', 'role'] as any,
  },
  parameters: {
    docs: {
      description: {
        story: `
### 🔍 Búsqueda interna
Filtra localmente usando \`searchableKeys\`.
        `,
      },
    },
  },
};

export const MultiplesTablas: Story = {
  args: {
    tables: [
      { title: 'Admins', data: data.filter(d => d.role === 'Admin'), columns: columns as any, enableCollaps: true },
      { title: 'Usuarios', data: data.filter(d => d.role !== 'Admin'), columns: columns as any, enableCollaps: true },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: `
### 📚 Múltiples tablas colapsables
Agrupa datasets distintos bajo secciones plegables.
        `,
      },
    },
  },
};

export const ConAcciones: Story = {
  args: {
    tables: [{ title: 'Con Acciones', columns: columns as any, data }],
    actionLabel: 'Crear nuevo',
    showButton: true,
    showCalendar: true,
    showFilter: true,
    filterOptions,
    filterValue: 'all',
    filterTitle: 'Filtrar usuarios',
  },
  parameters: {
    docs: {
      description: {
        story: `
### ⚙️ Acciones y filtros
Activa los controles de cabecera y captura eventos desde \`actions\`.
        `,
      },
    },
  },
};

export const ConRenderPersonalizado: Story = {
  args: {
    tables: [
      {
        title: 'Custom',
        columns: [
          { key: 'name' as any, label: 'Nombre', render: (row: Person) => <strong>{row.name}</strong> },
          { key: 'role' as any, label: 'Rol', render: (row: Person) => <span className="px-2 py-0.5 rounded bg-blue-10">{row.role}</span> },
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
Personaliza celdas y encabezados con \`render\` y \`headerRender\`.
        `,
      },
    },
  },
};

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
Soporte garantizado para \`data-theme="dark"\` usando variables CSS definidas en el theme. :contentReference[oaicite:14]{index=14}:contentReference[oaicite:15]{index=15}
        `,
      },
    },
  },
};

export const ConAccionesPersonalizadas: Story = {
  args: {
    tables: [{ title: 'Acciones personalizadas', columns: columns as any, data }],
    actionsRender: () => (
      <div className="flex gap-2 items-center">
        <button onClick={() => alert('Exportar')} className="btn-outline">📤 Exportar</button>
        <button onClick={() => alert('Descargar CSV')} className="btn-outline">📄 CSV</button>
      </div>
    ),
    showButton: false,
    showCalendar: false,
    showFilter: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
### 🧩 Acciones personalizadas
Reemplaza el botón principal con \`actionsRender\`.
        `,
      },
    },
  },
};

export const ConEncabezadoPersonalizado: Story = {
  args: {
    tables: [
      {
        title: 'Encabezado custom',
        columns: [
          { key: 'name' as any, label: 'Nombre', headerRender: () => <span style={{ fontWeight: 700 }}>🧑 Nombre del usuario</span> },
          { key: 'role' as any, label: 'Rol' },
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
Ideal para iconografía y estilos avanzados en la cabecera.
        `,
      },
    },
  },
};
