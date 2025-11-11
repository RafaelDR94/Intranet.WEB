import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

const DocumentsPage = () => {
  return (
    <PermissionRedirect
      routes={[
        "/main-page/request/documents/managementdocuments",
        "/main-page/request/documents/operationaldocuments",
      ]}
    />
  );
};

export default DocumentsPage;
