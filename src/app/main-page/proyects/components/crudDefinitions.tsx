'use client';

import { Button } from '@/app/components/Button/Button';
import type { ColumnDefinition } from '@/app/components/DataTable/types';
import type { FieldModel, ResponsiveLayoutMatrix } from '@/app/components/DynamicForm/types';
import type {
  CrudConfig,
  CrudDetailItem,
  CrudMode,
  CrudModuleDefinition,
  CrudRecord,
  CrudScope,
} from './types';

const baseResponsiveLayout: ResponsiveLayoutMatrix = {
  sm: [[10], [10], [10], [10]],
  md: [[5, 5], [5, 5]],
  lg: [[5, 5], [5, 5]],
};

const buildCommonFields = (
  config: CrudConfig,
  scope: CrudScope,
  mode: CrudMode,
  current: CrudRecord | null,
): FieldModel[] => {
  const prefix = scope === 'inventory' ? 'Inventario' : 'Proyecto';

  return [
    {
      type: 'input' as const,
      name: 'primary',
      label: config.primaryColumnLabel,
      placeholder: `Captura ${config.primaryColumnLabel.toLowerCase()}`,
      value: current?.primary ?? '',
      validations: [{ type: 'required' as const }],
      helperText: `${prefix} ${mode === 'edit' ? 'actualizando' : 'registrando'} ${config.entityLabel}.`,
    },
    {
      type: 'input' as const,
      name: 'secondary',
      label: config.secondaryColumnLabel,
      placeholder: `Captura ${config.secondaryColumnLabel.toLowerCase()}`,
      value: current?.secondary ?? '',
      validations: [{ type: 'required' as const }],
    },
    {
      type: 'input' as const,
      name: 'tertiary',
      label: config.tertiaryColumnLabel,
      placeholder: `Captura ${config.tertiaryColumnLabel.toLowerCase()}`,
      value: current?.tertiary ?? '',
      validations: [{ type: 'required' as const }],
    },
    {
      type: 'textarea' as const,
      name: 'description',
      label: 'Descripcion',
      placeholder: `Describe el ${config.entityLabel}`,
      value: current?.description ?? '',
      rows: 4,
      validations: [{ type: 'required' as const }],
    },
  ];
};

const buildCommonDetails = (row: CrudRecord | null): CrudDetailItem[] => [
  { label: 'Nombre', value: row?.primary ?? 'Sin informacion' },
  { label: 'Dato secundario', value: row?.secondary ?? 'Sin informacion' },
  { label: 'Dato terciario', value: row?.tertiary ?? 'Sin informacion' },
  { label: 'Estado', value: row?.status ?? 'Sin informacion' },
  { label: 'Descripcion', value: row?.description ?? 'Sin informacion' },
];

const refactionsResponsiveLayout: ResponsiveLayoutMatrix = {
  sm: [[10], [10], [10], [10], [10], [10]],
  md: [[5, 5], [3.34, 3.33, 3.33], [10]],
  lg: [[5, 5], [3.34, 3.33, 3.33], [10]],
};

const buildRefactionFields = (
  _scope: CrudScope,
  _mode: CrudMode,
  current: CrudRecord | null,
): FieldModel[] => [
  {
    type: 'input',
    name: 'sku',
    label: 'ID / SKU',
    placeholder: 'Captura el identificador',
    value: current?.id ?? '',
  },
  {
    type: 'input',
    name: 'stock',
    label: 'Piezas en stock',
    placeholder: 'Captura el stock',
    value: current?.stock ?? '',
  },
  {
    type: 'input',
    name: 'name',
    label: 'Nombre',
    placeholder: 'Captura el nombre de la refaccion',
    value: current?.primary ?? '',
    validations: [{ type: 'required' }],
  },
  {
    type: 'input',
    name: 'brand',
    label: 'Marca',
    placeholder: 'Captura la marca',
    value: current?.tertiary ?? '',
    validations: [{ type: 'required' }],
  },
  {
    type: 'input',
    name: 'model',
    label: 'Modelo',
    placeholder: 'Captura el modelo',
    value: current?.model ?? '',
    validations: [{ type: 'required' }],
  },
  {
    type: 'input',
    name: 'provider',
    label: 'Proveedor',
    placeholder: 'Captura el proveedor',
    value: current?.provider ?? '',
  },
  {
    type: 'input',
    name: 'website',
    label: 'Pagina web',
    placeholder: 'Captura la pagina web',
    value: current?.website ?? '',
  },
  {
    type: 'input',
    name: 'phone',
    label: 'Telefono',
    placeholder: 'Captura el telefono',
    value: current?.phone ?? '',
  },
];

const buildCommonColumns = (
  config: CrudConfig,
  handlers: {
    onDetail: (row: CrudRecord) => void;
    onEdit: (row: CrudRecord) => void;
    onDelete: (row: CrudRecord) => void;
  },
): ColumnDefinition<CrudRecord>[] => [
  {
    key: 'primary',
    label: config.primaryColumnLabel.toUpperCase(),
    cellClass: 'w-3/12',
    headerClass: 'w-3/12',
  },
  {
    key: 'secondary',
    label: config.secondaryColumnLabel.toUpperCase(),
    cellClass: 'w-2/12',
    headerClass: 'w-2/12',
  },
  {
    key: 'tertiary',
    label: config.tertiaryColumnLabel.toUpperCase(),
    cellClass: 'w-2/12',
    headerClass: 'w-2/12',
  },
  {
    key: 'status',
    label: 'ESTADO',
    cellClass: 'w-2/12',
    headerClass: 'w-2/12',
  },
  {
    key: 'description',
    label: '',
    cellClass: 'w-3/12 text-right',
    headerClass: 'w-3/12 text-right',
    render: (row) => (
      <div className="flex justify-end gap-2">
        <Button hideIcon size="small" variant="ghost" onClick={() => handlers.onDetail(row)}>
          Detalle
        </Button>
        <Button hideIcon size="small" variant="ghost" onClick={() => handlers.onEdit(row)}>
          Editar
        </Button>
        <Button hideIcon size="small" variant="ghost" onClick={() => handlers.onDelete(row)}>
          Eliminar
        </Button>
      </div>
    ),
  },
];

export const devicesConfig: CrudConfig = {
  entityLabel: 'dispositivo',
  entityLabelPlural: 'dispositivos',
  projectTitle: 'Dispositivos del proyecto',
  inventoryTitle: 'Inventario de dispositivos',
  createLabel: 'Nuevo dispositivo',
  updateLabel: 'Actualizar dispositivo',
  primaryColumnLabel: 'Dispositivo',
  secondaryColumnLabel: 'Serie',
  tertiaryColumnLabel: 'Ubicacion',
  detailTitle: 'Detalle del dispositivo',
};

export const refactionsConfig: CrudConfig = {
  entityLabel: 'refaccion',
  entityLabelPlural: 'refacciones',
  projectTitle: 'Refacciones del proyecto',
  inventoryTitle: 'Inventario de refacciones',
  createLabel: 'Nueva refacción',
  updateLabel: 'Actualizar refaccion',
  primaryColumnLabel: 'Refaccion',
  secondaryColumnLabel: 'Codigo',
  tertiaryColumnLabel: 'Existencia',
  detailTitle: 'Detalle de la refaccion',
};

export const locationsConfig: CrudConfig = {
  entityLabel: 'ubicacion',
  entityLabelPlural: 'ubicaciones',
  projectTitle: 'Ubicaciones del proyecto',
  inventoryTitle: 'Inventario de ubicaciones de los proyectos',
  createLabel: 'Nueva ubicacion',
  updateLabel: 'Actualizar ubicacion',
  primaryColumnLabel: 'Nombre',
  secondaryColumnLabel: 'Proyecto',
  tertiaryColumnLabel: 'Direccion',
  detailTitle: 'Detalle de la ubicacion',
};

export const providersConfig: CrudConfig = {
  entityLabel: 'proveedor',
  entityLabelPlural: 'proveedores',
  projectTitle: 'Proveedores del proyecto',
  inventoryTitle: 'Proveedores',
  createLabel: 'Nuevo proveedor',
  updateLabel: 'Actualizar proveedor',
  primaryColumnLabel: 'Proveedor',
  secondaryColumnLabel: 'Pagina web',
  tertiaryColumnLabel: 'Telefono',
  detailTitle: 'Detalle del proveedor',
};

export const devicesRows: CrudRecord[] = [
  {
    id: '0125',
    primary: 'Compresor de aire',
    secondary: 'Atlas Copco',
    tertiary: 'Metro Linea 2',
    status: 'Operativo',
    description: 'Equipo principal asignado al proyecto PRY-02-LPJ.',
  },
  {
    id: '0126',
    primary: 'Generador electrico',
    secondary: 'Caterpillar',
    tertiary: 'Planta Sur',
    status: 'Mantenimiento',
    description: 'Equipo temporalmente fuera de operacion por revision programada.',
  },
  {
    id: '0127',
    primary: 'Soldadora industrial',
    secondary: 'Miller',
    tertiary: 'Nave B',
    status: 'Disponible',
    description: 'Equipo listo para asignacion en actividades operativas.',
  },
  {
    id: '0128',
    primary: 'Taladro percutor',
    secondary: 'DeWalt',
    tertiary: 'Almacen central',
    status: 'Operativo',
    description: 'Herramienta activa y disponible para cuadrillas de campo.',
  },
];

export const refactionsRows: CrudRecord[] = [
  {
    id: '0125',
    primary: 'Filtro de aire',
    secondary: 'Compresor de aire',
    tertiary: 'Atlas Copco',
    status: 'Disponible',
    description: 'Color rojo. Refaccion para mantenimiento preventivo del equipo.',
    stock: '15',
    model: 'GA 75 VSD',
    serialOrPart: 'AC-GA75-8F2K91',
    provider: 'Industrial Supply',
    website: 'www.industrialsupply.com',
    phone: '55 5555 5555',
  },
  {
    id: '0126',
    primary: 'Bujia industrial',
    secondary: 'Generador electrico',
    tertiary: 'Caterpillar',
    status: 'Disponible',
    description: 'Pieza de encendido para reemplazo programado.',
    stock: '40',
    model: 'CAT-SPK-45',
    serialOrPart: 'BJ-CAT-77P0L',
    provider: 'Refacciones del Norte',
    website: 'www.refaccionesnorte.com',
    phone: '81 8888 1111',
  },
  {
    id: '0127',
    primary: 'Kit de sellos',
    secondary: 'Bomba hidraulica',
    tertiary: 'Bosch Rexroth',
    status: 'En uso',
    description: 'Juego completo para ajuste y sellado de linea.',
    stock: '8',
    model: 'REX-KS-71',
    serialOrPart: 'KS-BR-9912Q',
    provider: 'Hidraulica Total',
    website: 'www.hidraulicatotal.mx',
    phone: '33 4444 9922',
  },
  {
    id: '0128',
    primary: 'Llanta solida',
    secondary: 'Montacargas',
    tertiary: 'Toyota',
    status: 'Disponible',
    description: 'Llanta de reemplazo para operacion continua.',
    stock: '12',
    model: 'TY-TIRE-8F',
    serialOrPart: 'LL-TY-55X2A',
    provider: 'Llantas Industriales SA',
    website: 'www.llantasindustriales.com',
    phone: '55 7777 3333',
  },
];

export const locationsRows: CrudRecord[] = [
  {
    id: 'location-1',
    primary: 'Metro Linea 2',
    secondary: 'PY-DRONES-001',
    tertiary: 'Lomas del Encino #742, Colonia Jardines, CDMX',
    status: 'Activa',
    description: 'Ubicacion operativa vinculada al proyecto principal de drones.',
    projectCode: 'PY-DRONES-001',
    mapLink: 'https://maps.google.com/?q=Lomas+del+Encino+742+CDMX',
  },
  {
    id: 'location-2',
    primary: 'Aeropuerto QROO',
    secondary: 'QRO-VISITAX-001',
    tertiary: 'Av. del Aeropuerto 12, Terminal 2, Cancun, QROO',
    status: 'Disponible',
    description: 'Punto de despliegue de inspeccion para operaciones de campo.',
    projectCode: 'QRO-VISITAX-001',
    mapLink: 'https://maps.google.com/?q=Aeropuerto+QROO',
  },
  {
    id: 'location-3',
    primary: 'CETRAM TACUBAYA',
    secondary: 'PY-ORT-001',
    tertiary: 'Jose Maria Vigil S/N, Tacubaya, CDMX',
    status: 'Activa',
    description: 'Area de acceso y coordinacion de cuadrillas para despliegue urbano.',
    projectCode: 'PY-ORT-001',
    mapLink: 'https://maps.google.com/?q=CETRAM+Tacubaya',
  },
  {
    id: 'location-4',
    primary: 'Oficinas LEGO',
    secondary: 'PT-LEGO-001',
    tertiary: 'Paseo de la Reforma 222, Juarez, CDMX',
    status: 'Disponible',
    description: 'Ubicacion administrativa para seguimiento de proyecto y soporte.',
    projectCode: 'PT-LEGO-001',
    mapLink: 'https://maps.google.com/?q=Reforma+222+CDMX',
  },
];

export const providersRows: CrudRecord[] = [
  { id: 'provider-1', primary: 'Industrias Suply', secondary: 'www.industriasuply.com', tertiary: '55 5555 5555', status: 'Activo', description: 'Proveedor activo para suministros industriales.' },
  { id: 'provider-2', primary: 'Tecnologia Innovadora', secondary: 'www.tecnologiainnovadora.com', tertiary: '44 4444 4444', status: 'Activo', description: 'Proveedor activo de soluciones tecnologicas.' },
  { id: 'provider-3', primary: 'Soluciones Ecologicas', secondary: 'www.solucionesecologicas.com', tertiary: '33 3333 3333', status: 'Activo', description: 'Proveedor activo para lineas ecologicas.' },
  { id: 'provider-4', primary: 'Muebles Modernos', secondary: 'www.mueblesmodernos.com', tertiary: '22 2222 2222', status: 'Activo', description: 'Proveedor activo de mobiliario corporativo.' },
  { id: 'provider-5', primary: 'Alimentos Naturales', secondary: 'www.alimentosnaturales.com', tertiary: '11 1111 1111', status: 'Activo', description: 'Proveedor activo para insumos alimenticios.' },
  { id: 'provider-6', primary: 'Tecnologia Avanzada', secondary: 'www.tecnologiaavanzada.com', tertiary: '66 6666 6666', status: 'Activo', description: 'Proveedor activo para equipos especializados.' },
  { id: 'provider-7', primary: 'Automatizacion Intell', secondary: 'www.automatizacionintell.com', tertiary: '77 7777 7777', status: 'Activo', description: 'Proveedor activo para automatizacion industrial.' },
  { id: 'provider-8', primary: 'Ropa Sostenible', secondary: 'www.ropasostenible.com', tertiary: '88 8888 8888', status: 'Activo', description: 'Proveedor activo para uniformes y textiles.' },
  { id: 'provider-9', primary: 'Energia Renovable', secondary: 'www.energiarenovable.com', tertiary: '99 9999 9999', status: 'Activo', description: 'Proveedor activo para soluciones energeticas.' },
  { id: 'provider-10', primary: 'Transporte Eficiente', secondary: 'www.transporteeficiente.com', tertiary: '00 0000 0000', status: 'Activo', description: 'Proveedor activo para logistica y transporte.' },
  { id: 'provider-11', primary: 'Salud y Bienestar', secondary: 'www.saludybienestar.com', tertiary: '30 3030 3030', status: 'Activo', description: 'Proveedor activo para bienestar organizacional.' },
];

export const devicesDefinition: CrudModuleDefinition = {
  config: devicesConfig,
  rows: devicesRows,
  fields: (scope: CrudScope, mode: CrudMode, current: CrudRecord | null) =>
    buildCommonFields(devicesConfig, scope, mode, current),
  details: buildCommonDetails,
  columns: (handlers) => buildCommonColumns(devicesConfig, handlers),
  responsiveLayout: baseResponsiveLayout,
};

export const refactionsDefinition: CrudModuleDefinition = {
  config: refactionsConfig,
  rows: refactionsRows,
  fields: buildRefactionFields,
  details: buildCommonDetails,
  columns: (handlers) => buildCommonColumns(refactionsConfig, handlers),
  responsiveLayout: refactionsResponsiveLayout,
};

export const locationsDefinition: CrudModuleDefinition = {
  config: locationsConfig,
  rows: locationsRows,
  fields: (scope: CrudScope, mode: CrudMode, current: CrudRecord | null) =>
    buildCommonFields(locationsConfig, scope, mode, current),
  details: buildCommonDetails,
  columns: (handlers) => buildCommonColumns(locationsConfig, handlers),
  responsiveLayout: baseResponsiveLayout,
};

export const providersDefinition: CrudModuleDefinition = {
  config: providersConfig,
  rows: providersRows,
  fields: (scope: CrudScope, mode: CrudMode, current: CrudRecord | null) =>
    buildCommonFields(providersConfig, scope, mode, current),
  details: buildCommonDetails,
  columns: (handlers) => buildCommonColumns(providersConfig, handlers),
  responsiveLayout: baseResponsiveLayout,
};
