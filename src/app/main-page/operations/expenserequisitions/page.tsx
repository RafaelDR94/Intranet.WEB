import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function ExpenseRequisitions() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/operations/expenserequisitions/beneficiaryhistory',
        '/main-page/operations/expenserequisitions/travelexpenserequest',
      ]}
    />
  );
}
