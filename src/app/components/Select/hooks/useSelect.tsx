import { useState, useEffect, useRef } from "react";
interface UseSelectProps {
    multiple: boolean
    onChange: (values: string[]) => void;
    selected: string[];
}
const useSelect = ({ multiple, onChange, selected }: UseSelectProps) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (value: string) => {
        if (multiple) {
            onChange(
                selected.includes(value)
                    ? selected.filter((v) => v !== value)
                    : [...selected, value]
            );
        } else {
            onChange([value]);
            setOpen(false);
        }
    };
    return ({open, ref,toggleOption,setOpen})
}
export default useSelect;