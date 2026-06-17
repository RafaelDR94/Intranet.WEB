import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function Documents() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/request/documents/documentregistry',
        '/main-page/request/documents/managementdocuments',
        '/main-page/request/documents/operationaldocuments'
      ]}
    />
  );
}
