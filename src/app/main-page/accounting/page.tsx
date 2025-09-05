import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function AccountingPage() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/accounting/invoices',
        '/main-page/accounting/personalInvoices',
        '/main-page/accounting/requisitions',
      ]}
    />
  );
}
