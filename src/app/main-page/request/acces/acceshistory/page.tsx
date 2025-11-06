'use client'
import { DataTable } from "@/app/components/DataTable/DataTable";
import useAccesHistory from "./hooks/useAccesHistory";
import HistoryDetails from "./components/historyDetails/HistoryDetails";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { ColumnDefinition } from "@/app/components/DataTable/types";
import { AccesRequirmentGet } from "@/app/mappings/accesrequest/accesrequest.types";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { Button } from "@/app/components/Button/Button";
import AddUser from "@/assets/icons/Users/Users/add-user.svg"
import ActionMenuCell from "@/app/components/ActionMenuCell/ActionMenuCell";
import Label from "@/app/components/Label/Label";
import { useAuth } from "@/app/context/AuthContext/AuthContext";

const AcccesHistory = () => {
    const isMobile = useIsMobile();
    const { currentPagePermissions } = useAuth();
    const {
        accesreq,
        handleCreate,
        handleLinkClick,
        handleAddPerson,
        handleDelete,
        handleOpenDetails,
        handleCloseDetails,
        handleOpenConfirmPopUP,
        handleOpenClosePopUP,
        openDetails,
        openConfirmPopUp } = useAccesHistory();
    const columnRows = () => {
        const columns: ColumnDefinition<AccesRequirmentGet>[] = [
            {
                key: "external_enterprise",
                label: "Empresa",
                render: (row) => (<>{row?.external_enterprise?.name}</>)
            },
            {
                key: "location_responsible",
                label: "Lugar a Visitar",
                render: (row) => (<>{row?.location?.name}</>)
            },
            {
                key: "start_date",
                label: "Inicio",
            },
            {
                key: "end_date",
                label: "Término",
            },
            {
                key: "link" as keyof AccesRequirmentGet,
                label: "Link",
                render: (row) => <div className="flex">
                    {currentPagePermissions?.canObtainLink && <Button hideIcon onClick={() => handleLinkClick(row)}> Link Formuarlio</Button>}
                    {currentPagePermissions?.canAddInfo && <Button icon={AddUser} variant="ghost" onClick={() => handleAddPerson(row)} />}
                    {(currentPagePermissions?.delete || currentPagePermissions?.delete) && <ActionMenuCell row={row} onDelete={handleOpenConfirmPopUP} onDetails={handleOpenDetails} />}
                </div>
            },
        ]
        const mobileColumns: ColumnDefinition<AccesRequirmentGet>[] = [
            {
                key: "location_responsible",
                label: "Lugar a Visitar",
                render: (row) => (<>{row?.location?.name}</>)
            },
            {
                key: "start_date",
                label: "Inicio",
            },
            {
                key: "end_date",
                label: "Término",
            },
            {
                key: "link" as keyof AccesRequirmentGet,
                label: "Link",
                render: (row) => <div className="flex">
                    {currentPagePermissions?.canObtainLink && <Button hideIcon onClick={() => handleLinkClick(row)}> Link Formuarlio</Button>}
                    {currentPagePermissions?.canAddInfo && <Button icon={AddUser} variant="ghost" onClick={() => handleAddPerson(row)} />}
                    {(currentPagePermissions?.delete || currentPagePermissions?.delete) && <ActionMenuCell row={row} onDelete={handleOpenConfirmPopUP} onDetails={handleOpenDetails} />}
                </div>
            },
        ]

        return isMobile ? mobileColumns : columns
    }

    const columnRowsHistory = () => {
        const columns: ColumnDefinition<AccesRequirmentGet>[] = [
            {
                key: "external_enterprise",
                label: "Empresa",
                render: (row) => (<>{row?.external_enterprise?.name}</>)
            },
            {
                key: "location_responsible",
                label: "Lugar a Visitar",
                render: (row) => (<>{row?.location?.name}</>)
            },
            {
                key: "start_date",
                label: "Inicio",
            },
            {
                key: "end_date",
                label: "Término",
            },
            {
                key: "status",
                label: "Estatus",
                render: (row) => <div className="flex">
                    {(currentPagePermissions?.delete || currentPagePermissions?.delete) && <ActionMenuCell row={row} onDelete={handleOpenConfirmPopUP} onDetails={handleOpenDetails} />}
                </div>
            },
        ]
        const mobileColumns: ColumnDefinition<AccesRequirmentGet>[] = [
            {
                key: "location_responsible",
                label: "Lugar a Visitar",
                render: (row) => (<>{row?.location?.name}</>)
            },
            {
                key: "start_date",
                label: "Inicio",
            },
            {
                key: "end_date",
                label: "Término",
            },
            {
                key: "link" as keyof AccesRequirmentGet,
                label: "Link",
                render: (row) => <div className="flex">
                    <Label type="valido" text={row.status} />
                </div>
            },
        ]

        return isMobile ? mobileColumns : columns
    }



    return (<>
        <DataTable tables={[
            {
                data: accesreq.filter(acces => acces.status == 'Creada'),
                columns: columnRows(),
                title: "Solicitudes creadas",
            },
            {
                data: accesreq.filter(acces => acces.status != 'Creada'),
                columns: columnRowsHistory(),
                title: "Historial de accesos",
            }
        ]} actionLabel="Crear solicitud" onTableActionClick={handleCreate} showButton={currentPagePermissions?.create}/>
        <HistoryDetails open={openDetails} onClose={handleCloseDetails} />
        <PopUp open={openConfirmPopUp} onClose={handleOpenClosePopUP}
            title="Eliminar"
            showPrimaryButton
            showSecondaryButton
            secondaryButtonText="Cancelar"
            primaryButtonText="Confirmar"
            content="¿Seguro que desea eliminar este registro?"
            onPrimaryButtonClick={handleDelete} />
    </>)
}
export default AcccesHistory; 