import { ref, onValue, Database } from "firebase/database";
import { useEffect, useState } from "react";

/**
 * Mantiene una única suscripción al árbol de permisos del UID autenticado en
 * Firebase. `null` significa que aún no existe una sesión Firebase lista.
 */
export function usePermissionsListener(
  database: Database | null,
  firebaseUid: string | null,
): string | null {
  const [permissions, setPermissions] = useState<string | null>(null);

  useEffect(() => {
    setPermissions(null);

    if (!database || !firebaseUid) return;

    const permissionsRef = ref(database, `permissionsByUid/${firebaseUid}`);
    const unsubscribe = onValue(permissionsRef, (snapshot) => {
      // Un nodo ausente equivale a no tener permisos: comportamiento seguro.
      const nextPermissions = JSON.stringify(snapshot.exists() ? snapshot.val() : {});
      setPermissions((previous) =>
        previous === nextPermissions ? previous : nextPermissions,
      );
    });

    return unsubscribe;
  }, [database, firebaseUid]);

  return permissions;
}
