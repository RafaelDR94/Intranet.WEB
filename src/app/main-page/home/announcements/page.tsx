'use client';
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext"
import { Button } from "@/app/components/Button/Button";
const Announcements = () => {
    const { usePrincipalAlert } = usePrincipal();
    const { showAlert } = usePrincipalAlert;

    return (
        <Button
            onClick={() =>
                showAlert({
                    title: 'Operación exitosa',
                    description: 'Los datos fueron guardados correctamente.',
                    type: 'info',
                    showSecondaryButton: false,
                    primaryLabel:"Cerrar"
                })
            }
        >
            Mostrar alerta
        </Button>
    );
}
export default Announcements