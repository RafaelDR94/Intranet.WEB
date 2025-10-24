
import useReportBuilderStore from "@/app/stores/useReportBuilderStore/useReportBuilderStore";
import { useReportsStore } from "@/app/stores/useReportsStore/useReportsStore";
import { useFormFieldsStore } from "@/app/stores/useFormFieldsStore/useFormFieldsStore";
import useProyectLocationStore from "@/app/stores/useProyectLocationStore/useProyectLocationStore";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { resolveModel } from "../../../utilities/newReportutilities";
import { BASE_FIELDS } from "../../../utilities/constants";
import { FieldModel } from "@/app/components/DynamicForm/types";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import useQuery from "@/app/hooks/useQuery/useQuery";
import { toDateInputValue } from "@/app/utilities/DatesHelper/Dateshelper";
import { shallow } from "zustand/shallow";
const FORM_ID = "new-report-avance-form";
const useAdvanceForm = (currentModelName: string) => {
    const [isStepValid, setIsStepValid] = useState(false);
    const latestValuesRef = useRef<Record<string, any>>({});
    const reportInitialized = useRef(false);
    const [canStart, setCanStart] = useState(false);
    const { all } = useQuery();
    const proyectFromQuery = all.id;
    const { usePrincipalAlert } = usePrincipal();
    const { showAlert } = usePrincipalAlert;
    const { reportCategories, loadingCategories } = useReportsStore();
    const { error, locations, loadingLocations, fetchLocations, resetFlags } = useProyectLocationStore();
    const { fieldsByFormId, setFields, updateField, resetFields } = useFormFieldsStore();
    const {
        updateAdvance,
        report,
    } = useReportBuilderStore(
        (state) => ({
            updateAdvance: state.updateAdvance,
            report: state.report,
            isReportHydrated: state.isReportHydrated,
            currentReportfrontguid: state.currentReportfrontguid,
        }),
        shallow
    );
    const currentModel = useMemo(() => resolveModel(currentModelName), [currentModelName]);
    const storedFields = fieldsByFormId[FORM_ID] ?? [];
    const filteredFields = useMemo<FieldModel[]>(() => {
        return BASE_FIELDS.filter((field) => {
            if (field.name === "diagnostic") return currentModel.diagnostic;
            if (field.name === "solution") return currentModel.solution;
            if (field.name === "ticket") return currentModel.ticket;
            return true;
        }).map((field) => ({
            ...field,
        }));
    }, [currentModel]);

    useEffect(() => {

        const structureChanged =
            storedFields.length !== filteredFields.length ||
            storedFields.some((field, index) => field.name !== filteredFields[index]?.name);

        if (!structureChanged) return;

        setFields(
            FORM_ID,
            filteredFields.map((field) => ({
                ...field,
                options: field.options ? [...field.options] : field.options,
            }))
        );
        updateForm();


    }, [filteredFields, setFields, storedFields, canStart]);

    useEffect(() => {
        if (!error) return;
        showAlert({
            type: "error",
            variant: "filled",
            title: "No fue posible cargar las ubicaciones",
            description: error,
            autoCloseMs: 4000,
            showPrimaryButton: false,
            showSecondaryButton: false,
        });
        resetFlags();
    }, [error, showAlert, resetFlags]);


    useEffect(() => {
        if (!canStart) return;
        if (locations.length === 0 && proyectFromQuery) {
            fetchLocations(String(proyectFromQuery));
            return;
        }
        updateField(FORM_ID, "location", {
            options: locations.map((location) => ({ value: location.id, label: location.name })),
            disabled: false,
            helperText: "",
            value: report?.location?.id || ""
        });
    }, [fetchLocations, locations, proyectFromQuery, updateField, reportCategories, canStart]);

    useEffect(() => {
        if (!canStart) return;
        if (loadingLocations)
            updateField(FORM_ID, "location", {
                options: [],
                disabled: true,
                helperText: "",

            });

        if (locations.length === 0)
            updateField(FORM_ID, "location", {
                options: [],
                disabled: true,
                helperText: "No se encontraron ubicaciones para este proyecto",
            });
    }, [loadingLocations, locations, updateField, canStart]);

    useEffect(() => {
        if (!canStart) return;
        if (reportCategories.length === 0) return;
        updateField(FORM_ID, "category", {
            options:
                reportCategories.map((category) => ({ value: category.id, label: category.name })) || [],
            disabled: false,
            helperText: "",
            value: report?.reportcategories?.id || ""
        });
    }, [reportCategories, updateField, canStart]);

    useEffect(() => {
        if (!canStart) return;
        if (loadingCategories)
            updateField(FORM_ID, "category", {
                options: [],
                disabled: true,
                helperText: "",
            });

        if (reportCategories.length === 0)
            updateField(FORM_ID, "category", {
                options: [],
                disabled: true,
                helperText: "No se encontraron categorias para este tipo",
            });
    }, [loadingCategories, reportCategories, updateField, canStart]);



    const handleValidChange = useCallback((valid: boolean) => {
        setIsStepValid(valid);
    }, []);

    const handleValuesChange = useCallback(
        (values: Record<string, any>) => {
            latestValuesRef.current = { ...values };
            const {
                ticket,
                category,
                location,
                startDate,
                endDate,
                progress,
                remarks,
                diagnostic,
                solution,
            } = values;

            const resolvedCategory =
                category === undefined || category === null || category === ""
                    ? undefined
                    : reportCategories.find((item) => String(item.id) === String(category));

            const resolvedLocation =
                location === undefined || location === null || location === ""
                    ? undefined
                    : locations.find((item) => String(item.id) === String(location));

            let normalizedProgress: number | undefined;
            if (progress !== "" && progress !== null && progress !== undefined) {
                const parsed = Number(progress);
                normalizedProgress = Number.isNaN(parsed) ? undefined : parsed;
            }

            updateAdvance({
                ticket: ticket ?? undefined,
                reportcategory: resolvedCategory,
                location: resolvedLocation,
                remarks: remarks ?? undefined,
                diagnostic: diagnostic ?? undefined,
                solution: solution ?? undefined,
                startdate: startDate ?? undefined,
                enddate: endDate ?? undefined,
                progress: normalizedProgress,
            });
        },
        [locations, reportCategories, updateAdvance]
    );

    const handleFormSubmit = useCallback(
        (_values: Record<string, any>) => {
            console.log("values", _values);
        },
        []
    );

    const updateForm = () => {

        const fieldMap = new Map(storedFields.map((field) => [field.name, field.value]));
        const updates: Array<[string, any]> = [
            ["ticket", report.ticket ?? ""],
            ["startDate", toDateInputValue(report.startdate)],
            ["endDate", toDateInputValue(report.enddate)],
            ["progress", report.progress],
            ["remarks", report.remarks ?? ""],
            ["diagnostic", report.diagnostic ?? ""],
            ["solution", report.solution ?? ""],
        ];
        updates.forEach(([name, value]) => {
            if (fieldMap.get(name) === value) return;
            updateField(FORM_ID, name, { value });
        });
    }

 useEffect(() => {
        if (report?.front_identifier && !reportInitialized.current && storedFields.length > 0) {
            resetFields(FORM_ID);
            setTimeout(() => {
                updateForm();
                setCanStart(true);
            }, 200)

            reportInitialized.current = true;
        }
    }, [resetFields, report, storedFields, updateForm]);



    const effectiveFields = storedFields.length > 0 ? storedFields : filteredFields;

    return {
        formFields: effectiveFields,
        onFormSubmit: handleFormSubmit,
        formId: FORM_ID,
        categoriesLoading: loadingCategories,
        onFormValidChange: handleValidChange,
        isStepValid,
        loadingLocations,
        handleValuesChange,
        canStart,
        report
    };
}
export default useAdvanceForm;