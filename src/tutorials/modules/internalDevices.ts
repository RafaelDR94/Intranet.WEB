import type { TutorialDefinition } from '../types';

export const internalDevicesTutorials: TutorialDefinition[] = [
  {
    id: 'it-internaldevices:list',
    moduleId: 'it-internaldevices-list',
    title: 'Inventario de dispositivos internos',
    description: 'Recorre las acciones clave del inventario de dispositivos.',
    version: 1,
    steps: [
      {
        target: '[data-tour="internaldevices-list-table"]',
        title: 'Listado principal',
        description: 'Aqui se muestra el inventario de dispositivos internos.',
      },
      {
        target: '[data-tour="internaldevices-list-search"]',
        title: 'Busqueda rapida',
        description: 'Filtra por nombre, modelo o serie desde la barra de busqueda.',
      },
      {
        target: '[data-tour="internaldevices-list-calendar"]',
        title: 'Rango de fechas',
        description: 'Usa el calendario para filtrar por periodo.',
      },
      {
        target: '[data-tour="internaldevices-list-refresh"]',
        title: 'Actualizar',
        description: 'Recarga el listado con la informacion mas reciente.',
      },
      {
        target: '[data-tour="internaldevices-list-create"]',
        title: 'Nuevo dispositivo',
        description: 'Abre el formulario para registrar un nuevo dispositivo.',
      },
      {
        target: '[data-tour="internaldevices-list-row-actions"]',
        title: 'Acciones por fila',
        description: 'Consulta detalle o elimina un dispositivo desde aqui.',
        onlyDesktop: true,
      },
      {
        target: '[data-tour="internaldevices-list-row-actions"]',
        title: 'Acciones por fila',
        description: 'En mobile, abre este menu para ver detalle o eliminar.',
        onlyMobile: true,
      },
    ],
  },
  {
    id: 'it-internaldevices-asignation:list',
    moduleId: 'it-internaldevices-asignation-list',
    title: 'Asignacion de dispositivos',
    description: 'Explora el listado de dispositivos asignados.',
    version: 1,
    steps: [
      {
        target: '[data-tour="internaldevices-asignation-table"]',
        title: 'Listado de asignaciones',
        description: 'Aqui se muestran los dispositivos asignados.',
      },
      {
        target: '[data-tour="internaldevices-asignation-search"]',
        title: 'Busqueda rapida',
        description: 'Encuentra un dispositivo por nombre o serie.',
      },
      {
        target: '[data-tour="internaldevices-asignation-calendar"]',
        title: 'Rango de fechas',
        description: 'Filtra el listado por fechas de asignacion.',
      },
      {
        target: '[data-tour="internaldevices-asignation-refresh"]',
        title: 'Actualizar',
        description: 'Recarga el listado cuando necesites datos actualizados.',
      },
      {
        target: '[data-tour="internaldevices-asignation-create"]',
        title: 'Nueva asignacion',
        description: 'Inicia el flujo para asignar un dispositivo.',
      },
      {
        target: '[data-tour="internaldevices-asignation-row-actions"]',
        title: 'Detalle de asignacion',
        description: 'Abre el detalle para revisar la asignacion.',
        onlyDesktop: true,
      },
      {
        target: '[data-tour="internaldevices-asignation-row-actions"]',
        title: 'Detalle de asignacion',
        description: 'En mobile, abre este menu para ver el detalle.',
        onlyMobile: true,
      },
    ],
  },
  {
    id: 'it-internaldevices-asignation:create',
    moduleId: 'it-internaldevices-asignation-create',
    title: 'Crear asignacion',
    description: 'Completa los pasos para asignar un dispositivo.',
    version: 1,
    steps: [
      {
        target: '[data-tour="internaldevices-asignation-steps"]',
        title: 'Pasos del flujo',
        description: 'Avanza entre Dispositivo y Firma de responsiva.',
      },
      {
        target: '[data-tour="internaldevices-asignation-form"]',
        title: 'Datos del dispositivo',
        description: 'Selecciona el dispositivo, estatus y colaborador.',
      },
      {
        target: '[data-tour="internaldevices-asignation-next"]',
        title: 'Continuar',
        description: 'Avanza al paso de firma cuando el formulario sea valido.',
      },
      {
        target: '[data-tour="internaldevices-asignation-signature"]',
        title: 'Firma de responsiva',
        description: 'Captura la firma para completar la asignacion.',
      },
      {
        target: '[data-tour="internaldevices-asignation-assign"]',
        title: 'Asignar dispositivo',
        description: 'Guarda la asignacion cuando todo este completo.',
      },
      {
        target: '[data-tour="internaldevices-asignation-back"]',
        title: 'Volver al listado',
        description: 'Regresa al listado de asignaciones.',
      },
    ],
  },
];
