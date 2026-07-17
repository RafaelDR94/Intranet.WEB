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
import type { UserEmployeeSummary } from "@/app/mappings/users/user.types";
import { useProyectsStore } from "@/app/stores/useProyectsStore/useProyectsStore";
import type { TravelExpenseEmployeeWithCardNumber } from "@/app/stores/useTravelExpensesStore/types";
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

const getEmployeeCardNumber = (
  employee:
    | {
        card_number?: string | null;
      }
    | undefined,
) => toFormString(employee?.card_number);

const normalizeOptionalCardNumber = (value: string) => {
  const normalizedValue = value.trim();

  return normalizedValue === "000 -" ? "" : normalizedValue;
};

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
  const updateEmployeeNumberCard = useUsersStore(
    (state) => state.updateEmployeeNumberCard,
  );
  const proyects = useProyectsStore((state) => state.proyects);
  const proyectsLoading = useProyectsStore((state) => state.loading);
  const fetchProyects = useProyectsStore((state) => state.fetchProyects);
  const createTravelExpense = useTravelExpensesStore(
    (state) => state.createTravelExpense,
  );
  const employeesWithCardNumber = useTravelExpensesStore(
    (state) => state.employeesWithCardNumber,
  );
  const loadingEmployeesWithCardNumber = useTravelExpensesStore(
    (state) => state.loadingEmployeesWithCardNumber,
  );
  const fetchEmployeesWithCardNumber = useTravelExpensesStore(
    (state) => state.fetchEmployeesWithCardNumber,
  );
  const creatingTravelExpense = useTravelExpensesStore(
    (state) => state.creating,
  );

  useEffect(() => {
    fetchEmployeesWithCardNumber();
    fetchEmployeesWithActiveUser(true);
    fetchProyects();
  }, [
    fetchEmployeesWithActiveUser,
    fetchEmployeesWithCardNumber,
    fetchProyects,
  ]);

  const employeeOptions = useMemo(
    () =>
      employeesWithActiveUser.map((employee) => ({
        label: employee.fullname || employee.employee_number,
        value: employee.employee_id,
      })),
    [employeesWithActiveUser],
  );

  const employeeWithCardNumberOptions = useMemo(
    () =>
      employeesWithCardNumber.map((employee) => ({
        label: employee.full_name,
        value: employee.employee_id,
      })),
    [employeesWithCardNumber],
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
        const cardNumberName = `cardNumber${suffix}`;
        const isStaffSelected = Boolean(formValues[assignedStaffName]);
        const options =
          index === 0 ? employeeWithCardNumberOptions : employeeOptions;

        return [
          {
            type: "select",
            name: assignedStaffName,
            label: "Personal asignado",
            placeholder: "Selecciona un empleado",
            value: (formValues[assignedStaffName] ?? "") as FieldModel["value"],
            options,
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
          {
            type: "input",
            name: cardNumberName,
            label: "Numero de tarjeta",
            placeholder: "000 -",
            value: (formValues[cardNumberName] ?? "") as FieldModel["value"],
            disabled: !isStaffSelected,
          },
        ] satisfies FieldModel[];
      }).flat(),
    [
      assignedStaffRows,
      employeeOptions,
      employeeWithCardNumberOptions,
      formValues,
    ],
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

  const handleRemoveAssignedStaff = (rowIndex: number) => {
    if (rowIndex === 0) return;

    setFormValues((currentValues) => {
      const nextValues = { ...currentValues };

      Array.from({ length: assignedStaffRows }, (_, index) => {
        const suffix = index === 0 ? "" : String(index + 1);
        delete nextValues[`assignedStaff${suffix}`];
        delete nextValues[`phone${suffix}`];
        delete nextValues[`cardNumber${suffix}`];
      });

      let nextIndex = 0;

      Array.from({ length: assignedStaffRows }, (_, index) => {
        if (index === rowIndex) return;

        const currentSuffix = index === 0 ? "" : String(index + 1);
        const nextSuffix = nextIndex === 0 ? "" : String(nextIndex + 1);

        nextValues[`assignedStaff${nextSuffix}`] =
          currentValues[`assignedStaff${currentSuffix}`] ?? "";
        nextValues[`phone${nextSuffix}`] =
          currentValues[`phone${currentSuffix}`] ?? "";
        nextValues[`cardNumber${nextSuffix}`] =
          currentValues[`cardNumber${currentSuffix}`] ?? "";
        nextIndex += 1;
      });

      return nextValues;
    });
    setAssignedStaffRows((currentRows) => Math.max(1, currentRows - 1));
    setValuesVersion((currentVersion) => currentVersion + 1);
  };

  const handleValuesChange = (values: Record<string, unknown>) => {
    const nextValues = { ...formValues, ...values };
    let shouldSyncFormikValues = false;

    Array.from({ length: assignedStaffRows }, (_, index) => {
      const suffix = index === 0 ? "" : String(index + 1);
      const assignedStaffName = `assignedStaff${suffix}`;
      const phoneName = `phone${suffix}`;
      const cardNumberName = `cardNumber${suffix}`;
      const selectedEmployeeId = toFormString(nextValues[assignedStaffName]);
      const previousEmployeeId = toFormString(formValues[assignedStaffName]);
      const selectedEmployee = getSelectedCreateEmployee(
        index,
        selectedEmployeeId,
      );
      const selectedPhone = selectedEmployeeId
        ? getEmployeePhone(selectedEmployee)
        : "";
      const selectedCardNumber = selectedEmployeeId
        ? getEmployeeCardNumber(selectedEmployee)
        : "";

      if (!selectedEmployeeId) {
        if (nextValues[phoneName] || nextValues[cardNumberName]) {
          nextValues[phoneName] = "";
          nextValues[cardNumberName] = "";
          shouldSyncFormikValues = true;
        }

        return;
      }

      if (selectedEmployeeId === previousEmployeeId) return;

      if (selectedPhone && nextValues[phoneName] !== selectedPhone) {
        nextValues[phoneName] = selectedPhone;

        if (values[phoneName] !== selectedPhone) {
          shouldSyncFormikValues = true;
        }
      }

      if (
        selectedCardNumber &&
        nextValues[cardNumberName] !== selectedCardNumber
      ) {
        nextValues[cardNumberName] = selectedCardNumber;

        if (values[cardNumberName] !== selectedCardNumber) {
          shouldSyncFormikValues = true;
        }
      }
    });

    setFormValues(nextValues);

    if (shouldSyncFormikValues) {
      setValuesVersion((currentVersion) => currentVersion + 1);
    }
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    const applicantId = toFormString(user?.idEmployee);
    const selectedAssignees = Array.from(
      { length: assignedStaffRows },
      (_, index) => {
        const suffix = index === 0 ? "" : String(index + 1);
        const employeeId = toFormString(values[`assignedStaff${suffix}`]);

        return {
          index,
          employeeId,
          phoneNumber: toFormString(values[`phone${suffix}`]),
          cardNumber: toFormString(values[`cardNumber${suffix}`]),
        };
      },
    ).filter((assignee) => Boolean(assignee.employeeId));
    const assignedEmployeeIds = selectedAssignees
      .map((assignee) => assignee.employeeId)
      .filter(
        (employeeId, index, employeeIds) =>
          employeeIds.indexOf(employeeId) === index,
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

    const employeeContactUpdated =
      await updateMissingEmployeeContactData(selectedAssignees);

    if (!employeeContactUpdated) return;

    const [employeeId, ...companionIds] = assignedEmployeeIds;
    const companions = companionIds.map((id) => {
      const employee = employeesWithActiveUser.find(
        (item) => item.employee_id === id,
      );

      return {
        employee_id: id,
        full_name: employee?.fullname || "",
      };
    });

    showSpinner({ message: "Enviando solicitud de vi\u00e1ticos..." });
    const created = await createTravelExpense({
      applicant_id: applicantId,
      employee_id: employeeId,
      companions,
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

  const updateMissingEmployeeContactData = async (
    assignees: Array<{
      index: number;
      employeeId: string;
      phoneNumber: string;
      cardNumber: string;
    }>,
  ) => {
    const updates = assignees
      .map((assignee) => {
        const employee = getSelectedCreateEmployee(
          assignee.index,
          assignee.employeeId,
        );
        const existingPhone = getEmployeePhone(employee);
        const existingCardNumber = normalizeOptionalCardNumber(
          getEmployeeCardNumber(employee),
        );
        const phoneNumber = assignee.phoneNumber || existingPhone;
        const enteredCardNumber = normalizeOptionalCardNumber(
          assignee.cardNumber,
        );
        const cardNumber = enteredCardNumber || existingCardNumber;
        const needsUpdate =
          !existingPhone ||
          phoneNumber !== existingPhone ||
          (Boolean(enteredCardNumber) && cardNumber !== existingCardNumber);

        return {
          ...assignee,
          phoneNumber,
          cardNumber,
          needsUpdate,
        };
      })
      .filter((assignee) => assignee.needsUpdate);

    const incompleteAssignee = updates.find(
      (assignee) => !assignee.phoneNumber,
    );

    if (incompleteAssignee) {
      showAlert({
        type: "error",
        title: "Faltan datos del colaborador",
        description:
          "Captura telefono para el personal asignado que no tiene ese dato.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 3000,
      });
      return false;
    }

    if (updates.length === 0) return true;

    showSpinner({ message: "Actualizando datos del colaborador..." });
    const results = await Promise.all(
      updates.map((assignee) =>
        updateEmployeeNumberCard({
          idEmployee: assignee.employeeId,
          cardNumber: assignee.cardNumber,
          phoneNumber: assignee.phoneNumber,
        }),
      ),
    );
    hideSpinner();

    if (results.some((success) => !success)) {
      showAlert({
        type: "error",
        title: "No se pudieron actualizar los datos",
        description:
          useUsersStore.getState().error ||
          "Hubo un problema al guardar el telefono o numero de tarjeta.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 3000,
      });
      return false;
    }

    await Promise.all([
      fetchEmployeesWithActiveUser(true),
      fetchEmployeesWithCardNumber(true),
    ]);

    return true;
  };

  const getSelectedCreateEmployee = (
    index: number,
    employeeId: string,
  ): TravelExpenseEmployeeWithCardNumber | UserEmployeeSummary | undefined =>
    index === 0
      ? employeesWithCardNumber.find(
          (employee) => employee.employee_id === employeeId,
        )
      : employeesWithActiveUser.find(
          (employee) => employee.employee_id === employeeId,
        );

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
            loadingFormInfo={
              loadingEmployeesWithCardNumber ||
              employeesWithActiveUserLoading ||
              proyectsLoading
            }
            dataTestId="travel-expense-request-form"
          >
            {assignedStaffRows > 1 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {Array.from({ length: assignedStaffRows - 1 }, (_, index) => {
                  const rowIndex = index + 1;

                  return (
                    <Button
                      key={rowIndex}
                      type="button"
                      onClick={() => handleRemoveAssignedStaff(rowIndex)}
                      arrowDirection="cancel"
                      variant="ghost"
                      size="small"
                      className="text-alert-red-100"
                      dataTestId={`remove-companion-${rowIndex}`}
                    >
                      Cancelar acompañante {rowIndex}
                    </Button>
                  );
                })}
              </div>
            )}
            <Button
              type="button"
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
