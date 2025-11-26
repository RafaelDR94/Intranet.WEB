import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

const AccesPage = () => {
    return (
        <PermissionRedirect
            routes={[
                "/main-page/request/acces/generateacces",
                "/main-page/request/acces/acceshistory"
            ]}
        />
    );
};

export default AccesPage;
