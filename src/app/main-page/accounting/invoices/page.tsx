import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function InvoicesPage() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/accounting/invoices/validateinvoices',
        '/main-page/accounting/invoices/nondeductibles',
        '/main-page/accounting/invoices/sat',
      ]}
    />
  );
}
