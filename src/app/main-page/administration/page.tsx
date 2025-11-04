import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function UsersManagmentPage() {
    return (
        <PermissionRedirect
            routes={[
                '/main-page/administration/usersmanagment',
            ]}
        />
    );
}