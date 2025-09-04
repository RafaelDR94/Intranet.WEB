import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
const useMobileSideBar = ({ isOpen, onClose }:{isOpen:boolean,onClose:()=>void}) => {
    const pathname = usePathname();
    const panelRef = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = useState<string | null>(null);
    // Bloquear scroll cuando el drawer está abierto
    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);

    // Cerrar con tecla ESC
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    // Clic en overlay cierra
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };


    const isActive = (p: string) => pathname === p || pathname.startsWith(p + '/');

    return ({
        expanded, setExpanded,isActive,handleOverlayClick,panelRef
    })
}
export default useMobileSideBar;