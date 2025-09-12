
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
      { label: 'Facturación', path: '/main-page/request/invoices' },
    ],
  },
  {
    label: 'Contabilidad',
    path: '/main-page/accounting',
    icon: ServerIcon,
    subroutes: [
      { label: 'Facturación', path: '/main-page/accounting/invoices' },
      { label: 'Facturación personal', path: '/main-page/accounting/personalInvoices' },
      { label: 'Requisiciones', path: '/main-page/accounting/requisitions' },
    ],
  },


];