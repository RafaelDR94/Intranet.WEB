'use client'
import React from "react";
import { DataTable } from "@/app/components/DataTable/DataTable";
import Avatar from "@/app/components/Avatar/Avatar";
import EmployeeDetails from "./components/EmployeeDetails/EmployeeDetails";
import useEmployeesList from "./hooks/useEmployeesList";
import { EmployeeType } from "@/app/mappings/employees/employee.types";
import { ColumnDefinition } from "@/app/components/DataTable/types";
import ActionMenuCell from "@/app/components/ActionMenuCell/ActionMenuCell";
import { Button } from "@/app/components/Button/Button";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
const EmployeesList = () => {
    const { employeesList, handleCloseDetails, handleOpenDeletePopUp, handleEditEmployee, handleOpenDetails, handleDeleteEmployee, handleCloseDeletePopUp, handleOpenNew, openDeletePopUp, currentEmployee, openDetails, currentPagePermissions } = useEmployeesList();

    const isMobile = useIsMobile();
    const columnsDesktop: ColumnDefinition<EmployeeType>[] = [
        {
            key: "fullname",
            label: "NOMBRE",
            render: (row) => (<div className="flex gap-3">
                <Avatar src={row.image_url} size="xxs" />
                <p>{row.fullname}</p>
            </div>),
            cellClass: "w-3/12",
            headerClass: "w-3/12",
        },
        {
            key: "workposition",
            label: "PUESTO",
            render: (row) => (<div>
                <p>{row?.workposition?.name}</p>
            </div>),
            cellClass: "w-3/12",
            headerClass: "w-3/12",
        },
        {
            key: "phone_number",
            label: "TELEFONO",
            cellClass: "w-2/12",
            headerClass: "w-2/12",
        },
        {
            key: "email",
            label: "CORREO",
            cellClass: "w-2/12",
            headerClass: "w-2/12",
        },
        {
            key: "employee_number",
            label: "No.Empleado",
            cellClass: "w-1/12",
            headerClass: "w-1/12",
        },
        {
            key: "actions" as keyof (EmployeeType),
            label: "",
            cellClass: "w-1/12",
            headerClass: "w-1/12",
            render: (row) => (
                <>
                    {currentPagePermissions?.showdetails && <Button hideIcon variant="ghost" size="small" onClick={() => handleOpenDetails(row)}>Ver más</Button>}
                    {(currentPagePermissions?.delete || currentPagePermissions?.update) &&
                        <ActionMenuCell row={row} onEdit={() => { handleEditEmployee(row) }}
                            onDelete={() => { handleOpenDeletePopUp(row) }} />
                    }
                </>
            )

        }
    ]

    const columnsMobile: ColumnDefinition<EmployeeType>[] = [
        {
            key: "fullname",
            label: "NOMBRE",
            render: (row) => (<div className="flex gap-5">
                <Avatar src={row.image_url} size="xxs" />
                <p>{row.fullname}</p>
            </div>),
            cellClass: "w-8/12 text-left pr-5",
            headerClass: "w-8/12 text-left pr-5",
        },
        // {
        //     key: "workposition",
        //     label: "PUESTO",
        //     render: (row) => (<div>
        //         <p>{row?.workposition?.name}</p>
        //     </div>),
        //     cellClass: "w-5/12",
        //     headerClass: "w-5/12",
        // },
        {
            key: "actions" as keyof (EmployeeType),
            label: "",
            cellClass: "w-4/12 text-right",
            headerClass: "w-4/12 text-right",
            render: (row) => (
                <div  className="flex">  <Button hideIcon variant="ghost" size="xsmall" onClick={() => handleOpenDetails(row)}>Ver más</Button>
                    <ActionMenuCell row={row} onEdit={() => { handleEditEmployee(row) }}
                        onDelete={() => { handleOpenDeletePopUp(row) }} />
                </div>)

        }
    ]

    const columnas = isMobile ? columnsMobile : columnsDesktop;
    return (<>
        {currentEmployee &&
            <PopUp
                open={openDeletePopUp}
                onClose={handleCloseDeletePopUp}
                title={"¿Deseas eliminar a " + currentEmployee.fullname + "?"}
                content="Esta acción confirmará la eliminación del usuario"
                showPrimaryButton
                showSecondaryButton
                onPrimaryButtonClick={handleDeleteEmployee}
                onSecondaryButtonClick={handleCloseDeletePopUp} />
        }
        <EmployeeDetails open={openDetails} onClose={handleCloseDetails} />
        <DataTable
            onTableActionClick={handleOpenNew}
            actionLabel="Nuevo Empleado"
            showButton={currentPagePermissions?.create}
            showCalendar={false}
            textSize={{ mobile: "text-d3", desktop: "text-b3" }}
            tables={[{
                data: employeesList,
                columns: columnas,
                title: "Lista de empleados"
            }]}
        />



    </>)
}
export default EmployeesList;
