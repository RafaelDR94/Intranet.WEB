import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function PersonalInvoicesPage() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/accounting/personalInvoices/invoices',
        '/main-page/accounting/personalInvoices/history',
      ]}
    />
  );
}
