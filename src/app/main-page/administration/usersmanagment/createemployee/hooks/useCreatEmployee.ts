import { useEmployeesStore } from "@/app/stores/useEmployeesStore/useEmployeesStore";
import { useEnterprisesStore } from "@/app/stores/useEnterprisesStore/useEnterprisesStore";
import { useFormFieldsStore } from "@/app/stores/useFormFieldsStore/useFormFieldsStore";
import { shallow } from "zustand/shallow";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { useEffect, useState, useRef } from "react";
import { FieldModel } from "@/app/components/DynamicForm/types";
import useQuery from "@/app/hooks/useQuery/useQuery";
import { useFirebase } from "@/app/context/FirebaseContext/FirebaseContext";
import { useRouter } from "next/navigation";
import type { User } from "@/app/context/AuthContext/types";
const formId = "CreateEmployee";
type UseCreateEmployeeOptions = {
  loggedUser?: User;
  onSuccess?: () => void;
  redirectOnSuccess?: boolean;
};
const useCreateEemployee = ({
  loggedUser,
  onSuccess,
  redirectOnSuccess = true,
}: UseCreateEmployeeOptions = {}) => {
  const router = useRouter();
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const [loadingForm, setLoadingForm] = useState(false);
  const [canStart, setCanStart] = useState(false);
  const [formCompleted, setFormCompleted] = useState(false);
  const submitRef = useRef<() => void | Promise<void>>(null);
  const hasUpdateList = useRef(false);
  const hasresetedfields = useRef(false);
  const hasaskedEmployeesList = useRef(false);
  const hasaskedEnterprisesList = useRef(false);
  const hasInitTheOtherList = useRef(false);
  const hasInitFields = useRef(false);
  const { firebasestorage } = useFirebase();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert } = usePrincipalAlert;
  const { all } = useQuery();
  const idEmployeeFromQuery = Array.isArray(all.idEmployee)
    ? all.idEmployee[0]
    : all.idEmployee;
  const targetEmployeeId =
    loggedUser?.idEmployee ?? (idEmployeeFromQuery ? String(idEmployeeFromQuery) : undefined);
  const isReadOnly = Boolean(loggedUser);
  const {
    fetchWorkPosition,
    fetchEnterprises,
    resetEnterprisesFlags,
    enterprisesList,
    errorEnterprises,
  } = useEnterprisesStore(
    (s) => ({
      fetchWorkPosition: s.fetchWorkpositions,
      // workpositionList: s.workpositions,
      fetchEnterprises: s.fetchEnterprises,
      enterprisesList: s.enterprises,
      errorEnterprises: s.error,
      resetEnterprisesFlags: s.resetFlags,
    }),
    shallow,
  );
 
  const {
    fetchEmployeeById,
    fetchActiveEmployees,
    employeesList,
    errorEmployees,
    createEmployee,
    creatingEmployee,
    succesCreate,
    updateEmployee,
    updatingEmployee,
    succesUpdate,
    currentEmployee,
    resetFlags,
    resetCurrentEmployee,
  } = useEmployeesStore(
    (s) => ({
      fetchActiveEmployees: s.fetchEmployees,
      employeesList: s.employees,
      errorEmployees: s.error,
      createEmployee: s.createEmployee,
      fetchEmployeeById: s.fetchEmployeeById,
      creatingEmployee: s.creating,
      succesCreate: s.successPost,
      updateEmployee: s.updateEmployee,
      updatingEmployee: s.updating,
      succesUpdate: s.successPut,
      currentEmployee: s.employee,
      resetFlags: s.resetFlags,
      resetCurrentEmployee: s.resetEmployee,
    }),
    shallow,
  );
 
  const { fieldsByFormId, setFields, updateField, resetFields } =
    useFormFieldsStore();
  const formVersion = useFormFieldsStore(
    (state) => state.formVersionsByFormId?.[formId] ?? 0,
  );
  const handleValidChange = (valid: boolean) => {
    setFormCompleted(isReadOnly ? false : valid);
  };
  const handleSubmit = async (values: Record<string, any>) => {
    if (isReadOnly) {
      return;
    }
    let image_url = "";
 
    const rawImage = values.image_url;
 
    // 1️⃣ Validar que image_url es string con https
    if (typeof rawImage === "string" && /^https?:\/\//i.test(rawImage)) {
      image_url = rawImage;
    } else if (rawImage) {
      try {
        showSpinner({ message: "Subiendo imagen de perfil" });
        image_url = await firebasestorage.uploadFile(
          rawImage,
          `Employees/${values.firstname}${values.lastname}${values.motherlast_name}/profileImage.jpg`,
        );
      } catch (err) {
        hideSpinner();
        console.error("Error al subir imagen:", err);
        image_url = ""; // fallback
      }
    }
 
    // 3️⃣ Construir payload final
    const postPayload = {
      employee_number: values.employee_number,
      firstname: values.firstname,
      secondname: values.secondname,
      lastname: values.lastname,
      motherlast_name: values.motherlast_name,
      gender: values.gender,
      email: values.email,
      phone_number: values.phone_number,
      extension: values.extension,
      image_url,
      department_id: values.departments,
      workposition_id: values.workposition,
      manager_id: values.manager,
      gtstype: values.gtstype,
    };
 
    // 4️⃣ Crear o actualizar
    if (currentEmployee) {
      await updateEmployee({
        ...postPayload,
        employee_id: currentEmployee.employee_id,
      });
    } else {
      await createEmployee({ ...postPayload });
    }
  };
 
  const completeSelect = async (idEnterprise: string) => {
    setLoadingForm(true);

    try {
      updateField(formId, "enteprise", {
        value: idEnterprise,
        disabled: isReadOnly,
      });

      const workposition = await fetchWorkPosition(idEnterprise, true);
      updateField(formId, "workposition", {
        options: workposition.map((workposition) => ({
          label: workposition.name,
          value: workposition.workposition_id,
        })),
        value: currentEmployee?.workposition?.workposition_id || "",
        disabled: isReadOnly,
      });

      const enterpriseSelected = enterprisesList.find(
        (enterprise) => enterprise.enterprise_id === idEnterprise,
      );
      const departments = enterpriseSelected?.departments ?? [];

      updateField(formId, "departments", {
        options: departments.map((deparments) => ({
          label: deparments.name,
          value: deparments.department_id,
        })),
        value: currentEmployee?.department?.department_id || "",
        disabled: isReadOnly,
      });
    } finally {
      setLoadingForm(false);
    }
  };
 
  const loadInitialFields = () => {
    if (hasInitFields.current) return;
    const initialFields: () => FieldModel[] = () => {
      const model: FieldModel[] = [
        {
          type: "imageUploaderExpanded",
          name: "image_url",
          label: "Imagen de perfil JPG/PNG",
          initialFile: {
            name: "Imagen de perfil",
            url: currentEmployee?.image_url,
          },
          value: { name: "Imagen de perfil", url: currentEmployee?.image_url },
          accept: ".jpg,.png",
          preview: true,
          previewCoverMode: true,
          validations: [{ type: "required" }],
          disabled: isReadOnly,
        },
        {
          type: "input",
          name: "employee_number",
          value: currentEmployee?.employee_number || "",
          label: "No. de Empleado",
          validations: [{ type: "required" }],
          disabled: isReadOnly,
        },
        {
          type: "input",
          name: "firstname",
          value: currentEmployee?.firstname || "",
          label: "Primer Nombre",
          validations: [{ type: "required" }],
          disabled: isReadOnly,
        },
        {
          type: "input",
          name: "secondname",
          value: currentEmployee?.secondname || "",
          label: "Segundo Nombre",
          disabled: isReadOnly,
        },
        {
          type: "input",
          name: "lastname",
          value: currentEmployee?.lastname || "",
          label: "Primer Apellido",
          validations: [{ type: "required" }],
          disabled: isReadOnly,
        },
        {
          type: "input",
          name: "motherlast_name",
          value: currentEmployee?.motherlast_name || "",
          label: "Segundo Apellido",
          validations: [{ type: "required" }],
          disabled: isReadOnly,
        },
        {
          type: "select",
          name: "enteprise",
          label: "Empresa",
          placeholder: "Seleccione la empresa",
          value: currentEmployee?.department?.enterprise_id || "",
          options: [],
          validations: [{ type: "required" }],
          disabled: isReadOnly,
        },
        {
          type: "select",
          name: "departments",
          label: "Departamento",
          placeholder: "Seleccione el departamento",
          value: currentEmployee?.department?.department_id || "",
          options: [],
          validations: [{ type: "required" }],
          disabled: isReadOnly,
        },
        {
          type: "select",
          name: "workposition",
          label: "Puesto",
          placeholder: "Seleccione el Puesto",
          value: currentEmployee?.workposition?.workposition_id || "",
          options: [],
          validations: [{ type: "required" }],
          disabled: isReadOnly,
        },
        {
          type: "select",
          name: "manager",
          label: "Gerente",
          placeholder: "Seleccione el Gerente",
          value: currentEmployee?.manager_id || "",
          options: [],
          disabled: isReadOnly,
        },
        {
          type: "email",
          name: "email",
          value: currentEmployee?.email || "",
          label: "Correo Electrónico",
          disabled: isReadOnly,
        },
        {
          type: "number",
          name: "phone_number",
          value: currentEmployee?.phone_number.replaceAll(" ", "") || "",
          label: "Número De Teléfono",
          disabled: isReadOnly,
        },
        {
          type: "select",
          name: "gender",
          options: [
            { value: "M", label: "Masculino" },
            { value: "F", label: "Femenino" },
          ],
          value: currentEmployee?.gender || "",
          label: "Género",
          placeholder: "Seleccione el género",
          validations: [{ type: "required" }],
          disabled: isReadOnly,
        },
        {
          type: "select",
          name: "gtstype",
          options: [
            { value: "A", label: "Administrativo" },
            { value: "O", label: "Operativo" },
          ],
          value: currentEmployee?.gtstype || "",
          label: "Tipo de empleado",
          placeholder: "Seleccione el tipo de empleadoo",
          validations: [{ type: "required" }],
          disabled: isReadOnly,
        },
        {
          type: "number",
          name: "extension",
          value: currentEmployee?.extension || "",
          label: "Extensión",
          disabled: isReadOnly,
        },
      ];
      return model;
    };
    setFields(formId, initialFields());
    hasInitFields.current = true;
  };
 
  useEffect(() => {
    if (creatingEmployee) {
      showSpinner({ message: "Creando empleado" });
 
      return;
    }
    if (updatingEmployee) {
      showSpinner({ message: "Actualizando empleado" });
      return;
    }
    hideSpinner();
    if (errorEmployees) {
      showAlert({
        type: "error",
        title: "Ocurrio un error",
        description: errorEmployees,
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1000,
      });
    }
    if (errorEnterprises) {
      showAlert({
        type: "error",
        title: "Ocurrio un error",
        description: errorEnterprises,
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1000,
      });
    }
    if (succesCreate) {
      if (redirectOnSuccess) {
        router.push(
          "/main-page/administration/usersmanagment/employeesList?force=true",
        );
      }
      showAlert({
        type: "success",
        title: "Registro exitoso",
        description: "Se creo correctamente el empleado",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1000,
      });
      onSuccess?.();
    }
    if (succesUpdate) {
      if (redirectOnSuccess) {
        router.push(
          "/main-page/administration/usersmanagment/employeesList?force=true",
        );
      }
      showAlert({
        type: "success",
        title: "Registro exitoso",
        description: "Se actualizó correctamente el empleado",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1000,
      });
      onSuccess?.();
    }
    resetFlags();
    resetEnterprisesFlags();
  }, [
    resetFlags,
    resetEnterprisesFlags,
    showAlert,
    showSpinner,
    hideSpinner,
    creatingEmployee,
    updatingEmployee,
    errorEmployees,
    errorEnterprises,
    succesCreate,
    succesUpdate,
    onSuccess,
    redirectOnSuccess,
  ]);
 
  useEffect(() => {
    if (canStart) {
      loadInitialFields();
      if (enterprisesList.length == 0 && !hasaskedEnterprisesList.current) {
        hasaskedEnterprisesList.current = true;
        setLoadingForm(true);
        fetchEnterprises(true);
      }
      if (employeesList.length == 0 && !hasaskedEmployeesList.current) {
        hasaskedEmployeesList.current = true;
        setLoadingForm(true);
        fetchActiveEmployees(true);
      }
      if (
        employeesList.length > 0 &&
        enterprisesList.length > 0 &&
        !hasUpdateList.current
      ) {
        hasUpdateList.current = true;
        setLoadingForm(false);
        updateField(formId, "manager", {
          options: employeesList.map((employee) => ({
            label: employee.fullname,
            value: employee.employee_id,
          })),
          value: currentEmployee?.manager_id || "", // reset value
          disabled: isReadOnly,
        });
        updateField(formId, "enteprise", {
          options: enterprisesList.map((enterprise) => ({
            label: enterprise.name,
            value: enterprise.enterprise_id,
          })),
          value: currentEmployee?.department?.enterprise_id, // reset value
          disabled: isReadOnly,
          onChange: isReadOnly
            ? undefined
            : (value: string) => {
                void completeSelect(value);
                return value;
              },
        });
      }
    }
  }, [
    enterprisesList,
    employeesList,
    fetchEnterprises,
    setLoadingForm,
    canStart,
    isReadOnly,
  ]);
 
  const getEmployeeInfo = async (employeeId: string) => {
    if (!currentEmployee || currentEmployee.employee_id !== employeeId) {
      await fetchEmployeeById(String(employeeId));
    }
    setCanStart(true);
  };
 
  useEffect(() => {
    if (!hasresetedfields.current) {
      resetFields(formId);
      hasresetedfields.current = true;
    }
    if (targetEmployeeId) {
      getEmployeeInfo(targetEmployeeId);
    } else {
      resetFields(formId);
      resetCurrentEmployee();
      setCanStart(true);
    }
  }, [targetEmployeeId, resetCurrentEmployee, resetFields]);
 
  useEffect(() => {
    if (
      currentEmployee &&
      enterprisesList.length > 0 &&
      employeesList.length > 0 &&
      !hasInitTheOtherList.current
    ) {
      hasInitTheOtherList.current = true;
      completeSelect(currentEmployee?.department?.enterprise_id || "");
    }
  }, [currentEmployee, enterprisesList, employeesList]);
 
  return {
    loadingForm,
    fields: fieldsByFormId[formId],
    formVersion,
    submitRef,
    handleSubmit,
    canStart,
    handleValidChange,
    formCompleted,
    isReadOnly,
  };
};
export default useCreateEemployee;
