import { useEmployeesStore } from "@/app/stores/useEmployeesStore/useEmployeesStore"
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext"
import { shallow } from "zustand/shallow";
import { useCallback, useEffect, useState } from "react";
import { EmployeeType } from "@/app/mappings/employees/employee.types";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { useRouter } from "next/navigation";
import useQuery from "@/app/hooks/useQuery/useQuery";
const useEmployeesList = () => {
    const{all}=useQuery();
    const forced = all.force
    const router = useRouter();
    const { currentPagePermissions } = useAuth();
    const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
    const [openDetails, setOpenDetails] = useState(false);
    const [openDeletePopUp, setOpenDeletePopUp] = useState(false);
    const { showSpinner, hideSpinner } = usePrincipalLoading;
    const { showAlert } = usePrincipalAlert
    const { resetCurrenEmployee, resetFlags, fetchEmployees, employeesList, currentEmployee, setCurrentEmployee, deletEmployee, employeesError, lodingEmployees, deleting, succesDelete } = useEmployeesStore((s) => ({
        fetchEmployees: s.fetchEmployees,
        currentEmployee: s.employee,
        employeesList: s.employees,
        setCurrentEmployee: s.setCurrentEmployee,
        deletEmployee: s.deleteEmployee,
        employeesError: s.error,
        lodingEmployees: s.loading,
        deleting: s.deleting,
        succesDelete: s.successDelete,
        resetFlags: s.resetFlags,
        resetCurrenEmployee: s.resetEmployee
    }), shallow);

    useEffect(() => {
        if (deleting) {
            showSpinner(({ message: "Eliminando empleado" }));
            return
        }
        if (lodingEmployees) {
            showSpinner(({ message: "Cargando lista de empleados" }));
            return
        }
        if (employeesError) {
            showAlert({
                type: "error",
                title: "Ocurrio un error",
                description: employeesError,
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1000,
            });
        }
        if (succesDelete) {
            showAlert({
                type: "info",
                title: "Se elimino exitosamente",
                description: "El empleado fue eliminado con éxito",
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1000,
            });

        }
        hideSpinner();
        resetFlags();

    }, [resetFlags, showAlert, showSpinner, hideSpinner, lodingEmployees, deleting, employeesError, succesDelete])

    useEffect(() => {
        fetchEmployees(!!forced);
    }, [fetchEmployees])

    const handleOpenDeletePopUp = (employee: EmployeeType) => {
        setOpenDeletePopUp(true);
        setCurrentEmployee(employee);
    }


    const handleCloseDeletePopUp = () => {
        setOpenDeletePopUp(false);
        resetCurrenEmployee();
    }

    const handleOpenDetails = (employee: EmployeeType) => {
        setOpenDetails(true);
        setCurrentEmployee(employee);
    }
    const handleCloseDetails = () => {
        setOpenDetails(false);
        resetCurrenEmployee();
    }

    const handleDeleteEmployee = async () => {
        if (currentEmployee) {
            await deletEmployee(currentEmployee?.employee_id);
            resetCurrenEmployee();
            setOpenDeletePopUp(false);
        }
    }
    const handleEditEmployee = useCallback((employee: EmployeeType) => {
        setCurrentEmployee(employee);
        router.push(`/main-page/administration/usersmanagment/createemployee?idEmployee=${employee.employee_id}`);
    }, [router])
    const handleOpenNew = useCallback(() => {
        router.push('/main-page/administration/usersmanagment/createemployee');
    }, [router])


    return ({
        currentEmployee,
        openDeletePopUp,
        openDetails,
        employeesList,
        currentPagePermissions,
        handleOpenDeletePopUp,
        handleCloseDeletePopUp,
        handleOpenDetails,
        handleCloseDetails,
        handleDeleteEmployee,
        handleEditEmployee,
        handleOpenNew

    })
}
export default useEmployeesList
