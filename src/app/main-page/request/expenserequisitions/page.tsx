import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function ExpenseRequisitions() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/request/expenserequisitions/travelexpenserequest',
        '/main-page/request/expenserequisitions/travelexpensehistory',
      ]}
    />
  );
}
