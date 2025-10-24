import { useEffect, useRef, useState, useCallback } from "react";
import { FieldModel } from "@/app/components/DynamicForm/types";
import { useFormFieldsStore } from "@/app/stores/useFormFieldsStore/useFormFieldsStore";
import { useEmployeesStore } from "@/app/stores/useEmployeesStore/useEmployeesStore";
import { shallow } from "zustand/shallow";
import { EmployeeType } from "@/app/mappings/employees/employee.types";
import { useTransportStore } from "@/app/stores/useTransportStore/useTransportStore";
import { Transport, TransportAssignament, VehicleTraking } from "@/app/mappings/transport/transport.types";
import { currentDate } from "@/app/utilities/DatesHelper/Dateshelper";

const formId1 = "departure-form";
const formId2 = "arrive-form";
const FORM_IDS = {
  departure: formId1,
  arrive: formId2,
} as const;

const EMPTY_ARRAY: FieldModel[] = [];

const selectPlaceholder = {
  label: "Selecciona la opción requerida",
  value: "",
};

const toolsChecklistOptions = [
  { label: "Gato", value: "jack" },
  { label: "Llave para quitar birlos", value: "lug_wrench" },
  { label: "Llanta de refacción", value: "spare_tire" },
];

const documentsChecklistOptions = [
  { label: "Tarjeta de Circulación", value: "card" },
  { label: "Tarjeta de Combustible", value: "fuel_card" },
  { label: "Tag o pase", value: "tag" },
  { label: "Póliza de seguro", value: "insurance" },
  { label: "Ambas placas", value: "plates" },
];

const DEFAULT_TOOLS_CHECKED = toolsChecklistOptions.map((option) => option.value);
const DEFAULT_DOCUMENTS_CHECKED = documentsChecklistOptions.map((option) => option.value);

const areFieldValuesEqual = (
  currentValue: FieldModel["value"],
  nextValue: FieldModel["value"]
) => {
  if (currentValue === nextValue) return true;

  if (Array.isArray(currentValue) && Array.isArray(nextValue)) {
    if (currentValue.length !== nextValue.length) return false;
    return currentValue.every((item, index) => item === nextValue[index]);
  }

  const currentIsNumberLike =
    typeof currentValue === "number" ||
    (typeof currentValue === "string" && currentValue.trim() !== "" && !Number.isNaN(Number(currentValue)));
  const nextIsNumberLike =
    typeof nextValue === "number" ||
    (typeof nextValue === "string" && nextValue.trim() !== "" && !Number.isNaN(Number(nextValue)));

  if (currentIsNumberLike && nextIsNumberLike) {
    return Number(currentValue) === Number(nextValue);
  }

  return currentValue === nextValue;
};

const getToolsChecklistValues = (tracking?: VehicleTraking) => {
  if (!tracking) return [...DEFAULT_TOOLS_CHECKED];
  const entries: Array<[string, boolean]> = [
    ["jack", tracking.mechanicalOrhydraulicjack],
    ["lug_wrench", tracking.keytoRemoveStuds],
    ["spare_tire", tracking.sparetire],
  ];
  return entries.reduce<string[]>((acc, [value, checked]) => {
    if (checked) acc.push(value);
    return acc;
  }, []);
};

const getDocumentsChecklistValues = (tracking?: VehicleTraking) => {
  if (!tracking) return [...DEFAULT_DOCUMENTS_CHECKED];
  const entries: Array<[string, boolean]> = [
    ["card", tracking.circulationcard],
    ["fuel_card", tracking.fuelCard],
    ["tag", tracking.tagOrpas],
    ["insurance", tracking.insurancePolicy],
    ["plates", tracking.platesDelYtra],
  ];
  return entries.reduce<string[]>((acc, [value, checked]) => {
    if (checked) acc.push(value);
    return acc;
  }, []);
};

const createVehicleRegistryFields = (): FieldModel[] => [
  {
    type: "select",
    name: "driver",
    label: "Conductor",
    placeholder: "Selecciona la opción requerida",
    value: "",
    options: [{ ...selectPlaceholder }],
    validations: [{ type: "required" }],
  },
  {
    type: "select",
    name: "vehicle",
    label: "Vehíulo",
    placeholder: "Selecciona la opción requerida",
    value: "",
    options: [{ ...selectPlaceholder }],
    validations: [{ type: "required" }],
  },
  {
    type: "number",
    name: "mileage",
    label: "Kilometraje",
    placeholder: "Escriba el kilometraje del vehículo",
    value: null,
    min: 0,
    validations: [
      { type: "required" },
      { type: "min", value: 0 },
    ],
  },
  {
    type: "date",
    name: "date",
    label: "Fecha",
    placeholder: "Selecciona la fecha",
    value: currentDate(),
    min: 0,
    validations: [
      { type: "required" },
      { type: "min", value: 0 },
    ],
  },
  {
    type: "input",
    name: "destination",
    label: "Destino",
    placeholder: "Escribe aquí el destino y/o dirección",
    value: "",
    rows: 3,
    validations: [{ type: "required" }],
  },
  {
    type: "textarea",
    name: "observations",
    label: "Observaciones",
    placeholder: "Describe aquí las observaciones que creas pertinentes",
    value: "Sin observaciones",
    rows: 3,
  },

  {
    type: "checkboxList",
    name: "toolsChecklist",
    label: "Check List Herramientas",
    value: getToolsChecklistValues(),
    options: toolsChecklistOptions,
    checkboxListProps: {
      labelPosition: "right",
    },
  },
  {
    type: "checkboxList",
    name: "documentsChecklist",
    label: "Check List Documentos",
    value: getDocumentsChecklistValues(),
    options: documentsChecklistOptions,
    checkboxListProps: {
      labelPosition: "right",
    },
  },
  {
    type: "controlLevel",
    name: "fuelLevel",
    label: "Nivel de Combustible",
    value: 50,
    helperText: "Selecciona el nivel actual de combustible",
    controlLevelProps: {
      min: 0,
      max: 100,
      divisions: 4,
      labelMode: "fraction",
      showSemicircle: true,
      showLinear: true,
      initialValue: 0.5,
    },
    validations: [{ type: "required" }],
  },
];

const createVehicleRegistryFieldsArrive = (assignment: TransportAssignament): FieldModel[] => {
  const tracking = assignment.vehicletrackinglist?.[0];
  const toolsChecklistValues = getToolsChecklistValues(tracking);
  const documentsChecklistValues = getDocumentsChecklistValues(tracking);
  const mileageMinimum = Number(tracking?.mileage ?? 0);
  const fuelLevel = Number(tracking?.fuelLevel ?? 0);

  return [
    {
      type: "input",
      name: "driver",
      label: "Conductor",
      placeholder: "Selecciona la opción requerida",
      value: assignment.name ?? '',
      validations: [{ type: "required" }],
      onlyText: true,
    },
    {
      type: "input",
      name: "vehicle",
      label: "Vehículo",
      placeholder: "Selecciona la opción requerida",
      value: assignment?.transport?.brand ?? '',
      validations: [{ type: "required" }],
      onlyText: true,
    },
    {
      type: "textarea",
      name: "destination",
      label: "Destino",
      placeholder: "Escribe aquí el destino y/o dirección",
      value: assignment.destination ?? '',
      rows: 3,
      validations: [{ type: "required" }],
      onlyText: true,
    },
    {
      type: "number",
      name: "mileage",
      label: "Kilometraje",
      placeholder: "Escriba el kilometraje del vehículo",
      value: null,
      min: 0,
      validations: [
        { type: "required" },
        { type: "min", value: mileageMinimum },
      ],
    },
    {
      type: "date",
      name: "date",
      label: "Fecha",
      placeholder: "Selecciona la fecha",
      value: currentDate(),
      min: 0,
      validations: [
        { type: "required" },
        { type: "min", value: 0 },
      ],
    },
    {
      type: "textarea",
      name: "observations",
      label: "Observaciones",
      placeholder: "Describe aquí las observaciones que creas pertinentes",
      value: "Sin observaciones",
      rows: 3,
    },

    {
      type: "checkboxList",
      name: "toolsChecklist",
      label: "Check List Herramientas",
      value: toolsChecklistValues,
      options: toolsChecklistOptions,
      checkboxListProps: {
        labelPosition: "right",
      },
    },
    {
      type: "checkboxList",
      name: "documentsChecklist",
      label: "Check List Documentos",
      value: documentsChecklistValues,
      options: documentsChecklistOptions,
      checkboxListProps: {
        labelPosition: "right",
      },
    },
    {
      type: "controlLevel",
      name: "fuelLevel",
      label: "Nivel de Combustible",
      value: fuelLevel,
      helperText: "Selecciona el nivel actual de combustible",
      controlLevelProps: {
        min: 0,
        max: 100,
        divisions: 4,
        labelMode: "fraction",
        showSemicircle: true,
        showLinear: true,
        initialValue: fuelLevel,
      },
      validations: [{ type: "required" }],
    },
  ];
};

const useInitForm = (formType: keyof typeof FORM_IDS = "departure") => {
  const submitRef = useRef<() => void | Promise<void>>(null);
  const [formReady, setFormReady] = useState(false);
  const { employees,fetchEmployees } =
    useEmployeesStore(
      (s) => ({
        employees: s.employees,
        employeesError: s.error,
        fetchEmployees: s.fetchEmployees,
        reset: s.reset,
      }),
      shallow,
    );
  const { setFields, resetFields, updateField } = useFormFieldsStore.getState();
  const { transports, fetchTransports, currentAssignment, fetchAssignmentById, resetCurrentAssignment } = useTransportStore(
    (s) => ({
      transports: s.transports,
      fetchTransports: s.fetchTransports,
      fetchAssignmentById: s.fetchAssignmentById,
      currentAssignment: s.currentAssignment,
      error: s.error,
      resetCurrentAssignment: s.resetCurrentAssignment,
    }),
    shallow
  );
  const activeFormId = currentAssignment ? formId2 : FORM_IDS[formType];
  const fields = useFormFieldsStore((s) => s.fieldsByFormId[activeFormId] ?? EMPTY_ARRAY);
  const formVersionsById = useFormFieldsStore((s) => s.formVersionsByFormId);
  const formVersion = formVersionsById?.[activeFormId] ?? 0;
  const employeesCount = employees?.length ?? 0;
  const transportsCount = transports?.length ?? 0;

  const resetDepartureForm = () => {
    setFields(formId1, EMPTY_ARRAY);
  };

  const resetArriveForm = () => {
    setFields(formId2, EMPTY_ARRAY);
  };

  const ResetForms = () => {
    resetDepartureForm();
    resetArriveForm();
  };

  const applyToAllForms = useCallback(
    (updater: (formId: string) => void) => {
      Object.values(FORM_IDS).forEach((id) => updater(id));
    },
    []
  );

  const UpdateEmployees = useCallback(() => {
    if (!employees?.length) return;

    const { fieldsByFormId } = useFormFieldsStore.getState();
    const hasDriverField = Object.values(FORM_IDS).some((formId) =>
      (fieldsByFormId[formId] ?? []).some((field) => field.name === "driver")
    );
    if (!hasDriverField) return;

    const options = employees.map((employee: EmployeeType) => ({
      label: employee.fullname,
      value: employee.employee_id,
    }));
    applyToAllForms((formId) =>
      updateField(formId, "driver", {
        options,
      })
    );
  }, [employees, applyToAllForms, updateField]);

  const UpdateTransport = useCallback(() => {
    if (!transports?.length) return;

    const { fieldsByFormId } = useFormFieldsStore.getState();
    const hasVehicleField = Object.values(FORM_IDS).some((formId) =>
      (fieldsByFormId[formId] ?? []).some((field) => field.name === "vehicle")
    );
    if (!hasVehicleField) return;

    const options = transports.map((vehicle: Transport) => {
      const mainLabel = [vehicle.brand, vehicle.model]
        .filter(Boolean)
        .join(" ")
        .trim();
      const descriptor = [mainLabel, vehicle.plates]
        .filter(Boolean)
        .join(" - ")
        .trim();

      return {
        label: descriptor || vehicle.transport_id,
        value: vehicle.transport_id,
      };
    });

    applyToAllForms((formId) =>
      updateField(formId, "vehicle", {
        options,
      })
    );
  }, [transports, applyToAllForms, updateField]);



  useEffect(() => {
    if (employeesCount > 0) return;
    fetchEmployees();
  }, [employeesCount, fetchEmployees]);
  useEffect(() => {
    if (transportsCount > 0) return;
    fetchTransports();
  }, [transportsCount, fetchTransports]);

  useEffect(() => {
    UpdateEmployees();
  }, [UpdateEmployees, formVersionsById]);
  useEffect(() => {
    UpdateTransport();
  }, [UpdateTransport, formVersionsById]);

  useEffect(() => {
    if (!currentAssignment) return;
    if (!currentAssignment.vehicletrackinglist || currentAssignment.vehicletrackinglist.length === 0) {
      fetchAssignmentById(currentAssignment.vehicleassignments_id, true);
      return;
    }
    const arriveFields = createVehicleRegistryFieldsArrive(currentAssignment);
    setFields(formId2, arriveFields);
    return () => {
      resetCurrentAssignment();
    };
  }, [currentAssignment, resetCurrentAssignment, fetchAssignmentById]);

  useEffect(() => {
    const departureFields = createVehicleRegistryFields();
    setFields(formId1, departureFields);
    return () => {
      ResetForms();
      resetFields(formId1);
      resetFields(formId2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const syncFormValues = useCallback(
    (values: Record<string, unknown>) => {
      Object.entries(values).forEach(([name, value]) => {
        const nextValue = value as FieldModel["value"];
        const fieldIndex = fields.findIndex((field) => field.name === name);
        if (fieldIndex === -1) return;

        const currentField = fields[fieldIndex];

        if (currentField && areFieldValuesEqual(currentField.value, nextValue)) {
          return;
        }

        updateField(activeFormId, name, {
          value: nextValue,
        });
      });
    },
    [activeFormId, updateField, fields]
  );

  return { submitRef, formReady, setFormReady, ResetForms, fields, formVersion, formId: activeFormId, syncFormValues };
};

export default useInitForm;
