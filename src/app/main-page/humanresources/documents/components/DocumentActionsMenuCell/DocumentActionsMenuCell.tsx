"use client";

import React from "react";
import { Button } from "@/app/components/Button/Button";
import ContextMenu from "@/app/components/ContextMenu/ContextMenu";
import DotsIcon from "@/assets/icons/navegacion/more-horiz.svg";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import type { DocumentActionsMenuCellProps } from "./types";
import { useDocumentActionsMenu } from "./hooks/useDocumentActionsMenu";

const DocumentActionsMenuCell: React.FC<DocumentActionsMenuCellProps> = ({
  row,
  onView,
  onDelete,
}) => {
  const isMobile = useIsMobile();
  const { menuItems, menuOpen, setMenuOpen } = useDocumentActionsMenu({
    row,
    onView,
    onDelete,
  });

  return (
    <ContextMenu
      alignRight
      autoFlip
      trigger={
        <Button
          size="xsmall"
          variant="ghost"
          icon={isMobile ? DotsIcon : DotsIcon}
        />
      }
      items={menuItems}
      isOpen={menuOpen}
      setIsOpen={setMenuOpen}
    />
  );
};

export default DocumentActionsMenuCell;
