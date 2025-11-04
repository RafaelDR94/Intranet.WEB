import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function Documents() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/humanresources/documents/documentregistry',
        '/main-page/humanresources/documents/managementdocuments',
        '/main-page/humanresources/documents/operationaldocuments'
      ]}
    />
  );
}
