import { useReportsStore } from "@/app/stores/useReportsStore/useReportsStore";
import { shallow } from "zustand/shallow";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { useFormFieldsStore } from "@/app/stores/useFormFieldsStore/useFormFieldsStore";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { resolveModel } from "../../../utilities/newReportutilities";
import { BASE_FIELDS } from "../../../utilities/constants";
import { FieldModel } from "@/app/components/DynamicForm/types";
import useProyectLocationStore from "@/app/stores/useProyectLocationStore/useProyectLocationStore";
import { useSearchParams } from "next/navigation";
import useReportBuilderStore from "@/app/stores/useReportBuilderStore/useReportBuilderStore";

const FORM_ID = "new-report-avance-form";

const useAdvance = (currentModelName: string) => {
  const searchParams = useSearchParams();
  const [isStepValid, setIsStepValid] = useState(false);
  const lastHydratedKeyRef = useRef<string | null>(null);
  const latestValuesRef = useRef<Record<string, any>>({});

  useEffect(() => {
    setIsStepValid(false);
    latestValuesRef.current = {};
    lastHydratedKeyRef.current = null;
  }, [currentModelName]);

  const { usePrincipalAlert } = usePrincipal();
  const { showAlert } = usePrincipalAlert;
  const {
    reportCategories,
    loadingCategories,
  } = useReportsStore(
    (state) => ({
      typesofReports: state.typesofReports,
      reportCategories: state.reportCategories,
      fetchReportTypes: state.fetchReportTypes,
      fetchReportCategories: state.fetchReportCategories,
      loadingTypes: state.loadingTypes,
      loadingCategories: state.loadingCategories,
      error: state.error,
      reportCategoriesTypeId: state.reportCategoriesTypeId,
    }),
    shallow
  );
  const { error, locations, loadingLocations, fetchLocations, resetFlags } = useProyectLocationStore();
  const { fieldsByFormId, setFields, updateField } = useFormFieldsStore();
  const currentModel = useMemo(() => resolveModel(currentModelName), [currentModelName]);
  const storedFields = fieldsByFormId[FORM_ID] ?? [];
  const idproyect = searchParams.get("id") ?? "";

  const {
    updateAdvance,
    report,
    isReportHydrated,
    currentReportfrontguid,
  } = useReportBuilderStore(
    (state) => ({
      updateAdvance: state.updateAdvance,
      report: state.report,
      isReportHydrated: state.isReportHydrated,
      currentReportfrontguid: state.currentReportfrontguid,
    }),
    shallow
  );

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
  }, [filteredFields, setFields, storedFields]);

  const persistFieldsSnapshot = useCallback(() => {
    const sourceFields = (storedFields.length > 0 ? storedFields : filteredFields).map((field) => {
      const latestValue = latestValuesRef.current[field.name];
      return {
        ...field,
        value: latestValue !== undefined ? latestValue : field.value,
        options: field.options ? [...field.options] : field.options,
      };
    });

    setFields(FORM_ID, sourceFields);
  }, [filteredFields, setFields, storedFields]);

  const persistCleanupRef = useRef(persistFieldsSnapshot);
  useEffect(() => {
    persistCleanupRef.current = persistFieldsSnapshot;
  }, [persistFieldsSnapshot]);

  useEffect(() => {
    return () => {
      persistCleanupRef.current();
    };
  }, []);

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
    if (locations.length === 0 && idproyect) {
      fetchLocations(idproyect);
      return;
    }
    updateField(FORM_ID, "location", {
      options: locations.map((location) => ({ value: location.id, label: location.name })),
      disabled: false,
      helperText: "",
    });
  }, [fetchLocations, locations, idproyect, updateField, reportCategories]);

  useEffect(() => {
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
  }, [loadingLocations, locations, updateField]);

  useEffect(() => {
    if (reportCategories.length === 0) return;
    updateField(FORM_ID, "category", {
      options:
        reportCategories.map((category) => ({ value: category.id, label: category.name })) || [],
      disabled: false,
      helperText: "",
    });
  }, [reportCategories, updateField]);

  useEffect(() => {
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
  }, [loadingCategories, reportCategories, updateField]);

  const fieldStructureKey = useMemo(
    () => storedFields.map((field) => field.name).join("|"),
    [storedFields]
  );

  const toDateInputValue = (value?: string | null) => {
    if (!value) return "";
    return value.includes("T") ? value.split("T")[0] : value;
  };

  useEffect(() => {
    if (!isReportHydrated) {
      lastHydratedKeyRef.current = null;
      return;
    }

    if (storedFields.length === 0) return;

    const targetFrontId = report.front_identifier || currentReportfrontguid || "";
    if (!targetFrontId) return;

    const hydrationKey = `${targetFrontId}|${fieldStructureKey}`;
    if (lastHydratedKeyRef.current === hydrationKey) return;

    const progressValue = report.progress ?? "";
    const parsedProgress =
      progressValue === "" || progressValue === null ? "" : Number(progressValue);
    const safeProgress =
      typeof parsedProgress === "number" && !Number.isNaN(parsedProgress) ? parsedProgress : "";

    const fieldMap = new Map(storedFields.map((field) => [field.name, field.value]));

    const updates: Array<[string, any]> = [
      ["ticket", report.ticket ?? ""],
      ["category", report.reportcategories?.id ? String(report.reportcategories.id) : ""],
      ["location", report.location?.id ? String(report.location.id) : ""],
      ["startDate", toDateInputValue(report.startdate)],
      ["endDate", toDateInputValue(report.enddate)],
      ["progress", safeProgress],
      ["remarks", report.remarks ?? ""],
      ["diagnostic", report.diagnostic ?? ""],
      ["solution", report.solution ?? ""],
    ];

    updates.forEach(([name, value]) => {
      if (fieldMap.get(name) === value) return;
      updateField(FORM_ID, name, { value});
    });

    lastHydratedKeyRef.current = hydrationKey;
  }, [
    currentReportfrontguid,
    fieldStructureKey,
    isReportHydrated,
    report,
    storedFields,
    updateField,
  ]);

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
      console.log("values");
      //   const currentIndex = steps.findIndex((step) => step.id === 'avance');
      //   const nextStep = steps[currentIndex + 1];
      //   if (nextStep) {
      //     setActiveStep(nextStep.id);
      //   }
    },
    []
  );

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
  };
};

export default useAdvance;
