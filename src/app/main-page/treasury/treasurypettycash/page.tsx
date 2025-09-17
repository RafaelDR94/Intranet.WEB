import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function TreasuryPettyCash() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/treasury/treasurypettycash/treasurycontrol',
        '/main-page/treasury/treasurypettycash/treasuryrequest'
      ]}
    />
  );
}
