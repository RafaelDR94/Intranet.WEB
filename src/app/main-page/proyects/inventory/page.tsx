import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function InventoryPage() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/proyects/inventory/devices',
        '/main-page/proyects/inventory/refactions',
        '/main-page/proyects/inventory/locations',
        '/main-page/proyects/inventory/providers',
      ]}
    />
  );
}
