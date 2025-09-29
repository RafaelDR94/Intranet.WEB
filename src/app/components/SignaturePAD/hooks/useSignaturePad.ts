import { useRef,useState,useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { SignaturePadProps } from "../types";
const useSignaturePad =({width,height,onSignatureSave}:SignaturePadProps)=>{
        const sigCanvasRef = useRef<SignatureCanvas>(null);
        const wrapperRef = useRef<HTMLDivElement>(null);
        const [size, setSize] = useState<{ width: number; height: number }>({
            width: Number(width),
            height: Number(height),
        });
    
        // ResizeObserver para ajustar tamaño dinámicamente
        useEffect(() => {
            if (!wrapperRef.current) return;
    
            const observer = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    const { width, height } = entry.contentRect;
                    setSize({ width, height });
                }
            });
    
            observer.observe(wrapperRef.current);
    
            return () => observer.disconnect();
        }, []);
    
        const handleClear = () => {
            sigCanvasRef.current?.clear();
        };
    
        const handleSave = () => {
            if (!sigCanvasRef.current) return;
            if (sigCanvasRef.current.isEmpty()) {
                alert('Por favor, dibuja tu firma antes de guardar.');
                return;
            }
            const data = sigCanvasRef.current.toDataURL('image/png');
            onSignatureSave(data);
        };
    return{sigCanvasRef,wrapperRef,size,handleSave,handleClear}
}
export default useSignaturePad