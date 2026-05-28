import React from "react";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout"
import ButtonsNavigation from "@/app/components/ButtonsNavigation/ButtonsNavigation"
import { EmployeeDetailsProps } from "./types"
import ShowDetails from "../ShowDetails/ShowDetails"
import CreateUser from "../CreateUser/CreateUser"
import UpdateUser from "../UpdateUser/UpdateUser"
import { useEmployeesStore } from "@/app/stores/useEmployeesStore/useEmployeesStore"
const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ open, onClose }) => {
    const employee = useEmployeesStore((state) => state.employee);

    return (
        <DetailsPanelLayout open={open} onClose={onClose} showExpandButton={false}>
            <ButtonsNavigation
                dataTestId="reportdetails-nav"
                ariaLabel="Secciones del reporte"
                buttonSize="small"
                activeVariant="solid"
                inactiveVariant="outline"
            >
                <ButtonsNavigation.Item id="details" label="Detalles" renderContent={<ShowDetails />} />
                <ButtonsNavigation.Item id="user" label={employee?.user ?"Actualizar Usuario":"Crear Usuario"} className="rounded-full" renderContent={employee?.user ? <UpdateUser /> : <CreateUser />} />
            </ButtonsNavigation>
        </DetailsPanelLayout>
    )
}
export default EmployeeDetails
