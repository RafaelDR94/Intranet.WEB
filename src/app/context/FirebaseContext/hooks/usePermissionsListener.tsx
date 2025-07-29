import { useState, useEffect, useRef } from "react";
import { ref, onValue, off, Database } from "firebase/database";

export function usePermissionsListener(
    database: Database | null,
    userId: string
): {
    state: boolean;
    newPermissions: string;
} 
{
    const [permissionsChanged, setPermissionsChanged] = useState({ state: false, newPermissions: "" });
    const prevPermissionsRef = useRef<any>(null);
    useEffect(() => {
        if (!database || !userId) return;
        const path = `Permissions/Users/${userId.toUpperCase()}/Permissions`;
        const permissionsRef = ref(database, path);
        let firstLoad = true;

        // Suscribimos el listener
        const unsubscribe = onValue(permissionsRef, (snapshot) => {
            const newPermissions = snapshot.exists() ? snapshot.val() : null;
    
            if (firstLoad) {
                // En la primera carga sólo guardamos el valor
                prevPermissionsRef.current = newPermissions;
                firstLoad = false;
            } else {
                // Comparamos con el valor previo
                const prev = prevPermissionsRef.current;
                const changed = JSON.stringify(prev) !== JSON.stringify(newPermissions);
                if (changed) {
                    prevPermissionsRef.current = newPermissions;
                    setPermissionsChanged({ state: true, newPermissions: JSON.stringify(newPermissions) });
                    setTimeout(() => { setPermissionsChanged({ state: false, newPermissions: "" }) }, 1000)
                }
            }
        });
        // Cleanup: desuscribimos al desmontar o cambiar userId/database
        return () => {
            unsubscribe();
            off(permissionsRef);
        };
    }, [database, userId]);

    return permissionsChanged;
}
