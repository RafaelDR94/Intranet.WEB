
import ServerIcon from '@/assets/icons/Connectivity/server.svg';
import FileIcon from '@/assets/icons/Docs/archive.svg';
import HomeIcon from '@/assets/icons/navegacion/home.svg';
export const sidebarRoutes = [
  {
    label: 'Inicio',
    path: '/main-page/home',
    icon: HomeIcon,
  },
  {
    label: 'Solicitudes',
    path: '/main-page/request',
    icon: FileIcon,
    subroutes: [
      { label: 'FacturaciÃ³n', path: '/main-page/request/invoices' },
    ],
  },
  {
    label: 'Contabilidad',
    path: '/main-page/accounting',
    icon: ServerIcon,
    subroutes: [
      { label: 'FacturaciÃ³n', path: '/main-page/accounting/invoices' },
      { label: 'FacturaciÃ³n personal', path: '/main-page/accounting/personalInvoices' },
      { label: 'Requisiciones', path: '/main-page/accounting/requisitions' },
      { label: 'Historico de facturas', path: '/main-page/accounting/documentshistory' },
    ],
  },
  {
    label: 'Operaciones',
    path: '/main-page/operations',
    icon: ServerIcon,
    subroutes: [
      { label: 'Requisiciones', path: '/main-page/operations/requisitions' },
      { label: 'Historico de facturas', path: '/main-page/operations/documentshistory' },
    ],
  },


];
