
import { User } from "../types";

interface UsePermissionProp {
    user: User | null;
}

const hasAccess = (path: string, permissions: any) => {
    const cleanPath = path.replace(/\/\*$/, '');
    const segments = cleanPath.split('/').filter(Boolean);
    let currentLevel = permissions;

    for (const segment of segments) {

        if (currentLevel[segment]) {
            currentLevel = currentLevel[segment];

            if (!currentLevel.Acces) {
                return false;
            }
        } else {

            return false;
        }
    }

    return currentLevel.Acces !== false;
};
const getPermissions = (path: string, permissions: any) => {
    const cleanPath = path.replace(/\/\*$/, "");
    const segments = cleanPath.split("/").filter(Boolean);
    let currentLevel = permissions;
    for (const segment of segments) {
      if (currentLevel[segment]) {
        currentLevel = currentLevel[segment];
      } else {
        return {};
      }
    }
  
    return currentLevel.Permissions || {};
  };
  
/**
 * Hook personalizado para obtener y validar permisos del usuario.
 *
 * @param options.user - El usuario actual autenticado.
 * @returns Funciones para validar y obtener permisos por ruta.
 */
const usePermissions = ({ user }: UsePermissionProp) => {
    /**
   * Valida si el usuario tiene permisos para acceder a una ruta específica.
   *
   * @param route - Ruta a validar (ej. "/home", "/admin").
   * @returns `true` si el usuario tiene permisos, `false` si no.
   */
    const validPermissionsbyroute = (route: string):boolean => {
        try{
            const permissions = JSON.parse(user?.treeFirebase||"");
            if(permissions){
               return hasAccess(route,permissions);
            }
            return false;
        }
        catch(e){
            console.log(e);
            return false;
        }
    }
      /**
   * Devuelve los permisos asociados a una ruta específica.
   *
   * @param route - Ruta a consultar.
   * @returns Permisos asociados a esa ruta o `null` si no existen.
   */
    const getRoutePermissions = (route: string): any => {
        if (user?.treeFirebase) {
          const permission = JSON.parse(user.treeFirebase);
          if (permission) {
            return getPermissions(route, permission);
          }
          return {}
        }
        return {};
      };
    
    return {
        getRoutePermissions,
        validPermissionsbyroute
    }


}
export default usePermissions;
