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
const formId = "CreateEmployee"
const useCreateEemployee = () => {
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
    const idEmployee = all.idEmployee
    const { fetchWorkPosition, fetchEnterprises, resetEnterprisesFlags, enterprisesList, errorEnterprises } = useEnterprisesStore((s) => ({
        fetchWorkPosition: s.fetchWorkpositions,
        // workpositionList: s.workpositions,
        fetchEnterprises: s.fetchEnterprises,
        enterprisesList: s.enterprises,
        errorEnterprises: s.error,
        resetEnterprisesFlags: s.resetFlags
    }), shallow);

    const { fetchEmployeeById, fetchActiveEmployees, employeesList, errorEmployees, createEmployee, creatingEmployee, succesCreate, updateEmployee, updatingEmployee, succesUpdate, currentEmployee, resetFlags, resetCurrentEmployee } = useEmployeesStore((s) => ({
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
        resetCurrentEmployee: s.resetEmployee

    }), shallow);

    const { fieldsByFormId, setFields, updateField, resetFields } = useFormFieldsStore();
    const handleValidChange = (valid: boolean) => {
        setFormCompleted(valid);
    }
    const handleSubmit = async (values: Record<string, any>) => {
        let image_url = ""

        const rawImage = values.image_url

        // 1️⃣ Validar que image_url es string con https
        if (typeof rawImage === 'string' && /^https?:\/\//i.test(rawImage)) {
            image_url = rawImage
        }


        else if (rawImage) {
            try {
                showSpinner(({ message: "Subiendo imagen de perfil" }));
                image_url = await firebasestorage.uploadFile(
                    rawImage,
                    `Employees/${values.firstname}${values.lastname}${values.motherlast_name}/profileImage.jpg`
                )
            } catch (err) {
                hideSpinner();
                console.error("Error al subir imagen:", err)
                image_url = "" // fallback
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
            gtstype: values.gtstype
        }

        // 4️⃣ Crear o actualizar
        if (currentEmployee) {
            updateEmployee({ ...postPayload, employee_id: currentEmployee.employee_id })
        } else {
            createEmployee({ ...postPayload })
        }
    }


    const completeSelect = async (idEnterprise: string) => {
        setLoadingForm(true);
        const workposition = await fetchWorkPosition(idEnterprise, true);
        updateField(formId, 'workposition', {
            options: workposition.map((workposition) => ({ label: workposition.name, value: workposition.workposition_id })),
            value: currentEmployee?.workposition?.workposition_id || "",// reset value
            disabled: false,
        });
        if (enterprisesList) {
            const enterpriseSelected = enterprisesList?.filter(enterprise => (enterprise.enterprise_id == idEnterprise))||[];
            const departments = enterpriseSelected[0].departments;
            updateField(formId, 'departments', {
                options: departments.map((deparments) => ({ label: deparments.name, value: deparments.department_id })),
                value: currentEmployee?.department?.department_id || "", // reset value
                disabled: false,
            });
        }

        setLoadingForm(false);
    }


    const loadInitialFields = () => {
        if (hasInitFields.current) return;
        const showRestFor: ((values: Record<string, any>, fields: FieldModel[]) => boolean) | undefined = (_values) => {
            return !!_values?.enteprise;
        }
        const initialFields: () => FieldModel[] = () => {


            const model: FieldModel[] = [
                {
                    type: "input",
                    name: "firstname",
                    value: currentEmployee?.firstname || "",
                    label: "Nombre",
                    validations: [{ type: 'required' }]
                },
                {
                    type: "input",
                    name: "secondname",
                    value: currentEmployee?.secondname || "",
                    label: "Segundo nombre"
                },



                {
                    type: "input",
                    name: "lastname",
                    value: currentEmployee?.lastname || "",
                    label: "Apellido Paterno",
                    validations: [{ type: 'required' }]
                },
                {
                    type: "input",
                    name: "motherlast_name",
                    value: currentEmployee?.motherlast_name || "",
                    label: "Apellido Materno",
                    validations: [{ type: 'required' }]
                },
                {
                    type: "input",
                    name: "employee_number",
                    value: currentEmployee?.employee_number || "",
                    label: "Numero de empleado",
                    validations: [{ type: 'required' }]
                },
                {
                    type: "select",
                    name: "gender",
                    options: [{ value: "M", label: "Masculino" }, { value: "F", label: "Femenino" }],
                    value: currentEmployee?.gender || "",
                    label: "Género",
                    placeholder: 'Seleccione el género',
                    validations: [{ type: 'required' }]
                },
                {
                    type: "select",
                    name: "gtstype",
                    options: [{ value: "A", label: "Administrativo" }, { value: "O", label: "Operativo" }],
                    value: currentEmployee?.gtstype || "",
                    label: "Tipo de empleado",
                    placeholder: 'Seleccione el tipo de empleadoo',
                    validations: [{ type: 'required' }]
                },
                {
                    type: 'select',
                    name: 'enteprise',
                    label: 'Empresa',
                    placeholder: 'Seleccione la empresa',
                    value: currentEmployee?.department?.enterprise_id || "",
                    options: [],
                    validations: [{ type: 'required' }],

                },

                {
                    type: 'select',
                    name: 'departments',
                    label: 'Departamento',
                    placeholder: 'Seleccione el departamento',
                    value: currentEmployee?.department?.department_id || "",
                    options: [],
                    showIf: showRestFor,
                    validations: [{ type: 'required' }]
                },
                {
                    type: 'select',
                    name: 'workposition',
                    label: 'Puesto',
                    placeholder: 'Seleccione el Puesto',
                    value: currentEmployee?.workposition?.workposition_id || "",
                    options: [],
                    showIf: showRestFor,
                    validations: [{ type: 'required' }]

                },
                {
                    type: 'select',
                    name: 'manager',
                    label: 'Jefe directo',
                    placeholder: 'Seleccione el jefe directo',
                    value: currentEmployee?.manager_id || "",
                    options: [],
                    showIf: showRestFor,

                },
                {
                    type: "email",
                    name: "email",
                    value: currentEmployee?.email || "",
                    label: "Correo electrónico"
                },
                {
                    type: "number",
                    name: "phone_number",
                    value: currentEmployee?.phone_number.replaceAll(" ", "") || "",
                    label: "Número de teléfono"
                },
                {
                    type: "number",
                    name: "extension",
                    value: currentEmployee?.extension || "",
                    label: "Extensión"
                },
                {
                    type: "file",
                    name: "image_url",
                    label: "Imagen de perfil JPG/PNG",
                    initialFile: { name: "Imagen de perfil", url: currentEmployee?.image_url },
                    value: { name: "Imagen de perfil", url: currentEmployee?.image_url },
                    accept: ".jpg,.png",
                    validations: [{ type: "required" }],
                },
            ]
            return (model);
        }
        setFields(formId, initialFields());
        hasInitFields.current = true;
    }

    useEffect(() => {
        if (creatingEmployee) {
            showSpinner(({ message: "Creando empleado" }));

            return;
        }
        if (updatingEmployee) {
            showSpinner(({ message: "Actualizando empleado" }));
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
            router.push('/main-page/administration/usersmanagment/employeesList?force=true');
            showAlert({
                type: "success",
                title: "Registro exitoso",
                description: "Se creo correctamente el empleado",
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1000,
            });
        }
        if (succesUpdate) {
            router.push('/main-page/administration/usersmanagment/employeesList?force=true');
            showAlert({
                type: "success",
                title: "Registro exitoso",
                description: "Se actualizó correctamente el empleado",
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1000,
            });
        }
        resetFlags();
        resetEnterprisesFlags();

    }, [resetFlags, resetEnterprisesFlags, showAlert, showSpinner, hideSpinner, creatingEmployee, updatingEmployee, errorEmployees, errorEnterprises, succesCreate, succesUpdate])

    useEffect(() => {
        if (canStart) {
            loadInitialFields();
            if (enterprisesList.length == 0 && !hasaskedEnterprisesList.current) {
                hasaskedEnterprisesList.current = true
                setLoadingForm(true);
                fetchEnterprises(true);
            }
            if (employeesList.length == 0 && !hasaskedEmployeesList.current) {
                hasaskedEmployeesList.current = true
                setLoadingForm(true);
                fetchActiveEmployees(true);

            }
            if (employeesList.length > 0 && enterprisesList.length > 0 && !hasUpdateList.current) {
                hasUpdateList.current = true
                setLoadingForm(false);
                updateField(formId, 'manager', {
                    options: employeesList.map((employee) => ({ label: employee.fullname, value: employee.employee_id })),
                    value: currentEmployee?.manager_id || "", // reset value
                    disabled: false,
                });
                updateField(formId, 'enteprise', {
                    options: enterprisesList.map((enterprise) => ({ label: enterprise.name, value: enterprise.enterprise_id })),
                    value: currentEmployee?.department?.enterprise_id, // reset value
                    disabled: false,
                    onChange: async (value: string) => {
                        completeSelect(value)
                    }
                });

            }
        }


    }, [enterprisesList, employeesList, fetchEnterprises, setLoadingForm, canStart])

    const getEmployeeInfo = async () => {
        if (!currentEmployee) await fetchEmployeeById(String(idEmployee));
        setCanStart(true)
    }

    useEffect(() => {
        if (!hasresetedfields.current) { resetFields(formId); hasresetedfields.current = true }
        if (idEmployee) {
            getEmployeeInfo();

        }
        else {
            resetFields(formId);
            resetCurrentEmployee();
            setCanStart(true)
        }
    }, [idEmployee, resetCurrentEmployee, setCanStart, resetFields]);

    useEffect(() => {
        if (currentEmployee && enterprisesList.length > 0 && employeesList.length > 0 && !hasInitTheOtherList.current) {
            hasInitTheOtherList.current = true;
            completeSelect(currentEmployee?.department?.enterprise_id || "")
        }
    }, [currentEmployee, enterprisesList, employeesList])

    return ({
        loadingForm,
        fields: fieldsByFormId[formId],
        submitRef,
        handleSubmit,
        canStart,
        handleValidChange,
        formCompleted
    })
}
export default useCreateEemployee;