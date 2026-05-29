"use client";

import UserPlus from "@/assets/icons/Users/Users/add-user.svg";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/app/components/Button/Button";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import type {
  FieldModel,
  ResponsiveLayoutMatrix,
} from "@/app/components/DynamicForm/types";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { statesList } from "@/app/main-page/accounting/requisitions/components/RequisitionsForm/utilities/statesList";
import { useProyectsStore } from "@/app/stores/useProyectsStore/useProyectsStore";
import { useTravelExpensesStore } from "@/app/stores/useTravelExpensesStore/useTravelExpensesStore";
import { useUsersStore } from "@/app/stores/useUsersStore/useUsersStore";

const travelExpenseRequestLayout: ResponsiveLayoutMatrix = {
  sm: [[10], [10], [10], [10], [10], [10], [10], [10]],
  md: [
    [4.8, 4.8],
    [4.8, 4.8],
    [4.8, 4.8],
    [4.8, 4.8],
  ],
  lg: [
    [3.05, 3.05, 3.05],
    [3.05, 3.05],
    [3.05, 3.05, 3.05],
  ],
};

const toFormString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const toIsoDate = (value: unknown) => {
  const dateValue = toFormString(value);
  if (!dateValue) return "";

  const date = new Date(`${dateValue}T00:00:00`);
  return Number.isNaN(date.getTime()) ? dateValue : date.toISOString();
};

const getEmployeePhone = (
  employee:
    | {
        phone_number?: string | null;
        employee_phone?: string | null;
      }
    | undefined,
) => toFormString(employee?.phone_number || employee?.employee_phone);

const TravelExpenseRequestPage = () => {
  const submitRef = useRef<(() => void | Promise<unknown>) | null>(null);
  const [formReady, setFormReady] = useState(false);
  const [assignedStaffRows, setAssignedStaffRows] = useState(1);
  const [valuesVersion, setValuesVersion] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const { user } = useAuth();
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert } = usePrincipalAlert;
  const { hideSpinner, showSpinner } = usePrincipalLoading;
  const employeesWithActiveUser = useUsersStore(
    (state) => state.employeesWithActiveUser,
  );
  const employeesWithActiveUserLoading = useUsersStore(
    (state) => state.loadingWithActiveUser,
  );
  const fetchEmployeesWithActiveUser = useUsersStore(
    (state) => state.fetchEmployeesWithActiveUser,
  );
  const proyects = useProyectsStore((state) => state.proyects);
  const proyectsLoading = useProyectsStore((state) => state.loading);
  const fetchProyects = useProyectsStore((state) => state.fetchProyects);
  const createTravelExpense = useTravelExpensesStore(
    (state) => state.createTravelExpense,
  );
  const creatingTravelExpense = useTravelExpensesStore(
    (state) => state.creating,
  );

  useEffect(() => {
    fetchEmployeesWithActiveUser(true);
    fetchProyects();
  }, [fetchEmployeesWithActiveUser, fetchProyects]);

  const employeeOptions = useMemo(
    () =>
      employeesWithActiveUser.map((employee) => ({
        label: employee.fullname || employee.employee_number,
        value: employee.employee_id,
      })),
    [employeesWithActiveUser],
  );

  const projectOptions = useMemo(
    () =>
      proyects.map((project) => ({
        label: project.proyectKey,
        value: project.id,
      })),
    [proyects],
  );

  const assignedStaffFields = useMemo<FieldModel[]>(
    () =>
      Array.from({ length: assignedStaffRows }, (_, index) => {
        const suffix = index === 0 ? "" : String(index + 1);
        const assignedStaffName = `assignedStaff${suffix}`;
        const phoneName = `phone${suffix}`;
        const isStaffSelected = Boolean(formValues[assignedStaffName]);

        return [
          {
            type: "select",
            name: assignedStaffName,
            label: "Personal asignado",
            placeholder: "Selecciona un empleado",
            value: (formValues[assignedStaffName] ?? "") as FieldModel["value"],
            options: employeeOptions,
            validations: [{ type: "required" }],
          },
          {
            type: "input",
            name: phoneName,
            label: "Tel\u00e9fono",
            placeholder: "Tel\u00e9fono del personal asignado",
            value: (formValues[phoneName] ?? "") as FieldModel["value"],
            disabled: !isStaffSelected,
          },
        ] satisfies FieldModel[];
      }).flat(),
    [assignedStaffRows, employeeOptions, formValues],
  );

  const fields = useMemo<FieldModel[]>(
    () => [
      {
        type: "date",
        name: "startDate",
        label: "Fecha Inicio",
        placeholder: "00/00/0000",
        value: (formValues.startDate ?? "") as FieldModel["value"],
        validations: [{ type: "required" }],
      },
      {
        type: "date",
        name: "endDate",
        label: "Fecha Termino",
        placeholder: "00/00/0000",
        value: (formValues.endDate ?? "") as FieldModel["value"],
        validations: [{ type: "required" }],
      },
      {
        type: "select",
        name: "project",
        label: "Proyecto",
        placeholder: "Selecciona un proyecto",
        value: (formValues.project ?? "") as FieldModel["value"],
        options: projectOptions,
        validations: [{ type: "required" }],
      },
      {
        type: "select",
        name: "state",
        label: "Estado",
        placeholder: "Selecciona una opci\u00f3n",
        value: (formValues.state ?? "") as FieldModel["value"],
        options: statesList,
        validations: [{ type: "required" }],
      },
      {
        type: "input",
        name: "motive",
        label: "Motivo",
        placeholder: "Escribe el motivo de la solicitud",
        value: (formValues.motive ?? "") as FieldModel["value"],
        validations: [{ type: "required" }],
      },
      ...assignedStaffFields,
    ],
    [assignedStaffFields, formValues, projectOptions],
  );

  const responsiveLayoutMatrix = useMemo<ResponsiveLayoutMatrix>(
    () => ({
      ...travelExpenseRequestLayout,
      sm: [
        [10],
        [10],
        [10],
        [10],
        [10],
        ...Array.from({ length: assignedStaffRows * 3 }, () => [10]),
      ],
      md: [
        [4.8, 4.8],
        [4.8, 4.8],
        [4.8],
        ...Array.from({ length: assignedStaffRows }, () => [
          [4.8, 4.8],
          [4.8],
        ]).flat(),
      ],
      lg: [
        [3.05, 3.05, 3.05],
        [3.05, 3.05],
        ...Array.from({ length: assignedStaffRows }, () => [3.05, 3.05, 3.05]),
      ],
    }),
    [assignedStaffRows],
  );

  const handleAddAssignedStaff = () => {
    setAssignedStaffRows((currentRows) => currentRows + 1);
    setValuesVersion((currentVersion) => currentVersion + 1);
  };

  const handleValuesChange = (values: Record<string, unknown>) => {
    const nextValues = { ...formValues, ...values };
    let shouldSyncFormikValues = false;

    Array.from({ length: assignedStaffRows }, (_, index) => {
      const suffix = index === 0 ? "" : String(index + 1);
      const assignedStaffName = `assignedStaff${suffix}`;
      const phoneName = `phone${suffix}`;
      const selectedEmployeeId = toFormString(nextValues[assignedStaffName]);
      const selectedEmployee = employeesWithActiveUser.find(
        (employee) => employee.employee_id === selectedEmployeeId,
      );
      const selectedPhone = selectedEmployeeId
        ? getEmployeePhone(selectedEmployee)
        : "";

      if (nextValues[phoneName] !== selectedPhone) {
        nextValues[phoneName] = selectedPhone;
      }

      if (values[phoneName] !== selectedPhone) {
        shouldSyncFormikValues = true;
      }
    });

    setFormValues(nextValues);

    if (shouldSyncFormikValues) {
      setValuesVersion((currentVersion) => currentVersion + 1);
    }
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    const applicantId = toFormString(user?.idEmployee);
    const assignedEmployeeIds = Array.from(
      { length: assignedStaffRows },
      (_, index) => {
        const suffix = index === 0 ? "" : String(index + 1);
        return toFormString(values[`assignedStaff${suffix}`]);
      },
    ).filter(
      (employeeId, index, employeeIds) =>
        Boolean(employeeId) && employeeIds.indexOf(employeeId) === index,
    );

    if (!applicantId) {
      showAlert({
        type: "error",
        title: "No se pudo enviar",
        description: "No se encontr\u00f3 el empleado solicitante.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2500,
      });
      return;
    }

    if (assignedEmployeeIds.length === 0) {
      showAlert({
        type: "error",
        title: "No se pudo enviar",
        description: "Selecciona al menos un empleado asignado.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2500,
      });
      return;
    }

    const [employeeId, ...companionIds] = assignedEmployeeIds;

    showSpinner({ message: "Enviando solicitud de vi\u00e1ticos..." });
    const created = await createTravelExpense({
      applicant_id: applicantId,
      employee_id: employeeId,
      companion_ids: companionIds,
      project_id: toFormString(values.project),
      department_id: toFormString(user?.idDepartment),
      enterprise_id: toFormString(user?.idEnterprise),
      assignmentdate: toIsoDate(values.startDate),
      enddate: toIsoDate(values.endDate),
      state: toFormString(values.state),
      motive: toFormString(values.motive),
    });
    hideSpinner();

    if (!created) {
      showAlert({
        type: "error",
        title: "No se pudo enviar",
        description:
          useTravelExpensesStore.getState().error ||
          "Hubo un problema al crear la solicitud de vi\u00e1ticos.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2500,
      });
      return;
    }

    setAssignedStaffRows(1);
    setFormValues({});
    setFormReady(false);
    setValuesVersion((currentVersion) => currentVersion + 1);
    showAlert({
      type: "success",
      title: "Solicitud enviada",
      description: "La solicitud de vi\u00e1ticos fue creada correctamente.",
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 1800,
    });
  };

  return (
    <section className="bg-gray-10 w-full py-4">
      <div className="flex w-full flex-col gap-3">
        <FormsLayout
          title="Solicitud de Requisiciones"
          primaryLabel={
            creatingTravelExpense ? "Enviando..." : "Enviar solicitud"
          }
          primaryDisabled={!formReady || creatingTravelExpense}
          onPrimaryClick={() => submitRef.current?.()}
          cardClassName="!block"
        >
          <DynamicForm
            fields={fields}
            onSubmit={handleSubmit}
            onValidChange={setFormReady}
            onValuesChange={handleValuesChange}
            externalSubmitRef={submitRef}
            showSubmitIf={() => false}
            valuesVersion={valuesVersion}
            valuesVersionActive
            responsiveLayoutMatrix={responsiveLayoutMatrix}
            loadingFormInfo={employeesWithActiveUserLoading || proyectsLoading}
            dataTestId="travel-expense-request-form"
          >
            <Button
              onClick={handleAddAssignedStaff}
              icon={UserPlus}
              variant="ghost"
              className="mt-2"
            >
              Agregar acompañante
            </Button>
          </DynamicForm>
        </FormsLayout>
      </div>
    </section>
  );
};

export default TravelExpenseRequestPage;
