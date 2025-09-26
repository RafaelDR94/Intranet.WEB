import React from "react";

import { Button } from "../Button/Button";
import ContextMenu from "../ContextMenu/ContextMenu";
import { useIsMobile } from "../DataTable/components/DataTableLayout/hooks/useMediaQuery";

import { ActionMenuCellProps } from "./types";

import { useAuth } from "@/app/context/AuthContext/AuthContext";
import DeleteIcon from "@/assets/icons/acciones/trash.svg";
import EditIcon from "@/assets/icons/Editor/edit-pencil.svg";
import DotsIcon from "@/assets/icons/navegacion/more-horiz.svg";
import RightArrowIcon from "@/assets/icons/navegacion/nav-arrow-right.svg"

const ActionMenuCell = <T extends Record<string, unknown>>({
    row,
    onEdit,
    onDelete,
}: ActionMenuCellProps<T>) => {
    const isMobile = useIsMobile();
    const { currentPagePermissions } = useAuth();
    const menuItems: any[] = [];
    if (currentPagePermissions?.details||currentPagePermissions?.update)
        menuItems.push({
            label:currentPagePermissions?.details ? "Ver Detalle" : "Actualizar",
            icon: EditIcon,
            onClick: () => {
                onEdit(row);
            },
        });
    if (currentPagePermissions?.delete)
        menuItems.push({
            label: "Cancelar o eliminar",
            icon: DeleteIcon,
            danger: true,
            onClick: () => {
                onDelete(row);
            },
        });
    return (
        <ContextMenu
            alignRight
            autoFlip
            trigger={<Button size="xsmall" variant="ghost" icon={isMobile ? RightArrowIcon : DotsIcon} />}
            items={menuItems}
        />
    );
};
export default ActionMenuCell;
