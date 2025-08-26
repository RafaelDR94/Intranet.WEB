import { redirect } from 'next/navigation';
export default function AccountingPage() {
  redirect('/main-page/accounting/personalInvoices/invoices');
}
