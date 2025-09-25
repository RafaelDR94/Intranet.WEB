import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function TreasuryPage() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/treasury/treasurypettycash',
      ]}
    />
  );
}
