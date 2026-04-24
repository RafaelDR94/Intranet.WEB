"use client"
'use client';

import React, { useMemo } from 'react';

import useProyectList from "./hooks/useProyectList";

import ActionMenuCell from "@/app/components/ActionMenuCell/ActionMenuCell";
import { Button } from "@/app/components/Button/Button";
import { DataTable } from "@/app/components/DataTable/DataTable";
import { ColumnDefinition } from "@/app/components/DataTable/types";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { Proyect } from "@/app/mappings/proyects/proyects.types";

/**
 * Main list view for the SIP projects catalog.
 *
 * It reads projects from the global store, exposes create/view/delete actions
 * and toggles the card layout whenever a cardAdapt configuration is available.
 */
const ProyectList = () => {

    const {
        proyects,
        openDelete,
        setOpenDelete,
        handleView,
        handleEdit,
        handleNew,
        handleAskDelete,
        handleConfirmDelete,
        handeReport,
        toRemove,
        removing,
        currentPagePermissions,
        isMobile
    } = useProyectList();


    /**
     * Column definitions reused by the table and the cards layout.
     * Wrapped in useMemo to keep referential stability between renders.
     */
    const columns: ColumnDefinition<Proyect>[] = useMemo(() => {

        if (isMobile) return ([{ key: 'proyectKey', label: 'LLAVE DEL PROYECTO' }, {
            key: 'seeproyect' as unknown as keyof Proyect,
            label: "",
            render: (row) => (

                <div className="flex gap-2 justify-end">
                    {currentPagePermissions?.currentproyect && <Button size="small" variant="ghost" hideIcon onClick={() => handleView(row)}>Ver Proyecto</Button>}

                </div>
            ),

        },

        {
            key: "actions" as unknown as keyof Proyect,
            label: "",
            render: (row) => (
                <div className="flex justify-end pr-2">
                    <ActionMenuCell row={row} onEdit={() => handleEdit(row)} onDelete={() => handleAskDelete(row)} />
                </div>
            ),
            cellClass: 'w-20 text-right',
            headerClass: 'w-20 text-right',
            invisible: false,
        },])
        return ([
            { key: 'name', label: 'PROYECTO' },
            { key: 'client', label: 'CLIENTE' },
            { key: 'proyectKey', label: 'LLAVE DEL PROYECTO' },
            {
                key: 'manager' as any,
                label: 'ENCARGADO',
                render: (row) => row.collaborators?.[0]?.fullname ?? '—',
            },
            {
                key: 'seeproyect' as unknown as keyof Proyect,
                label: "",
                render: (row) => (

                    <div className="flex gap-2 justify-end">
                        {currentPagePermissions?.currentproyect && <Button size="small" variant="ghost" hideIcon onClick={() => handleView(row)}>Ver Proyecto</Button>}

                    </div>
                ),
                cellClass: 'w-56 text-right',
                headerClass: 'w-56 text-right',
            },

            {
                key: "actions" as unknown as keyof Proyect,
                label: "",
                render: (row) => (
                    <div className="flex justify-end pr-2">
                        <ActionMenuCell row={row} onEdit={() => handleEdit(row)} onDelete={() => handleAskDelete(row)} />
                    </div>
                ),

                invisible: false,
            },

        ])
    }, [currentPagePermissions, isMobile, handleAskDelete, handleEdit, handleView]);
    return (
        <>
            <div className="overflow-auto">
                <DataTable
                    actionLabel="Nuevo Proyecto"
                    onTableActionClick={handleNew}
                    showButton={currentPagePermissions?.create}
                    showDownloadTable={false}
                    showViewSwitcher
                    showCalendar={false}
                    useCardsView={true}
                    showFilter={false}
                    tables={[{
                        hidetitle: true,
                        data: proyects,
                        columns,
                        enableSelection: false,
                        title: 'Proyectos',
                        enableCollaps: false,
                        defaultSortKey: 'name',
                        defaultSortDirection: 'asc',
                        cardAdapt: {
                            titleKey: 'proyectKey' as any,
                            labelKey: 'name' as any,
                            // descriptionKey: 'client' as any,
                            imageKey: (p: any) => p.imageUrl,
                            onPrimaryAction: (p: Proyect) => handleView(p),
                            onSecondaryAction: (p: Proyect) => handeReport(p),
                            primaryLabel: 'Ver Proyecto',
                            secondaryLabel: 'Nuevo Reporte',
                            showPrimaryButton: true,
                            showSecondaryButton: currentPagePermissions?.createreport,
                            enableImagePreview: false,
                            actionMenuProps: (row) => ({
                                row,
                                onEdit: handleEdit,
                                onDelete: handleAskDelete,
                            }),
                        }
                    }]}
                />
            </div>

            <PopUp
                open={openDelete}
                title={"Eliminar Proyecto"}
                content={`Esta acción confirmará la eliminación del ${toRemove?.name ?? 'proyecto'}\nUna vez confirmado, no podrás revertir el cambio.`}
                onClose={() => setOpenDelete(false)}
                primaryButtonText={removing ? 'Eliminando…' : 'Eliminar'}
                secondaryButtonText="Cancelar"
                onPrimaryButtonClick={handleConfirmDelete}
                onSecondaryButtonClick={() => setOpenDelete(false)}
                showPrimaryButton
                showSecondaryButton
            // disablePrimaryButton={removing}
            />
        </>
    );
};
export default ProyectList;
