import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function Documents() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/humanresources/release/pressreleases',
        '/main-page/humanresources/release/importantinformation',
      ]}
    />
  );
}
