import { useState,useEffect,useCallback } from "react";
import { CheckBoxListOption, useCheckBoxListProps } from "../types";
const normalizeInitial = (
    options: CheckBoxListOption[],
    values: string[] | undefined
) => {
    if (!values) return [];
    const optionValues = new Set(options.map((o) => o.value));
    return values.filter((v) => optionValues.has(v));
};
const useCheckBoxList = ({ options, value, defaultValue, onChange, disabled }: useCheckBoxListProps) => {
    const [internalSelection, setInternalSelection] = useState<string[]>(() =>
        normalizeInitial(options, defaultValue)
    );

    const isControlled = value !== undefined;
    const selection = isControlled
        ? normalizeInitial(options, value)
        : internalSelection;

    useEffect(() => {
        if (!isControlled) {
            setInternalSelection(normalizeInitial(options, defaultValue));
        }
    }, [defaultValue, isControlled, options]);

    const handleToggle = useCallback(
        (option: CheckBoxListOption) => {
            if (disabled || option.disabled) return;

            const computeNext = (current: string[]) => {
                const exists = current.includes(option.value);
                return exists
                    ? current.filter((v) => v !== option.value)
                    : [...current, option.value];
            };

            const nextSelection = computeNext(selection);

            if (!isControlled) {
                setInternalSelection((prev) => computeNext(prev));
            }

            onChange?.(nextSelection);
        },
        [disabled, isControlled, onChange, selection]
    );
    return {
        handleToggle,
        selection,
    }
}
export default useCheckBoxList;