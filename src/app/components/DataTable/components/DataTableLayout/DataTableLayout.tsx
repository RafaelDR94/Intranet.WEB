"use client";

import React from "react";

import { useDataTableLayout } from "./hooks/useDataTableLayout";
import { useIsMobile } from "./hooks/useMediaQuery";
import { useTableLayoutStyles } from "./styles";
import type { TableLayoutProps } from "./types";

import { Button } from "@/app/components/Button/Button";
import { Calendar } from "@/app/components/Calendar/Calendar";
import { ContextMenu } from "@/app/components/ContextMenu/ContextMenu";
import { Input } from "@/app/components/Input/Input";
import DownloadIcon from "@/assets/icons/acciones/download.svg";
import FilterIcon from "@/assets/icons/organization/filter-alt.svg";
import SearchIcon from "@/assets/icons/organization/search.svg";






const DataTableLayout: React.FC<TableLayoutProps> = (props) => {
  const {
    handleDateRange,
    handleInputChange,
    handleSearchClick,
    handleInputKeyDown,
    onFilterClick,
    actionsRender,
    onTableActionClick,
    actionLabel,
    showCalendar,
    showFilter,
    showButton,
    isDownloadOpen,
    setIsDownloadOpen,
    handleDownload,
  } = useDataTableLayout(props);
  const tableLayoutStyles = useTableLayoutStyles();
  const { downloadDisabled = false } = props;
  const isMobile = useIsMobile();

  return (
    <div className={tableLayoutStyles.headerdiv}>
      <Input
        placeholder="Buscar"
        inputSize={isMobile ? "md" : "sm"}
        className={tableLayoutStyles.inputSyle}
        onChange={(e) => handleInputChange(e.target.value)}
        onClick={handleSearchClick}
        onKeyDown={handleInputKeyDown}
        icon={SearchIcon}
      />

      {showCalendar && (
        <div className="mx-1">
          <Calendar onCalendarClick={handleDateRange} />
        </div>
      )}

      {showFilter && (
        <Button
          iconOnly
          icon={FilterIcon}
          variant="ghost"
          onClick={onFilterClick}
        />
      )}

      <div className={tableLayoutStyles.buttonsStyle}>
  {props.showDownloadTable && (
    <ContextMenu
      title="FORMATO"
      isOpen={isDownloadOpen}
      setIsOpen={setIsDownloadOpen}
      trigger={
        <div className="flex items-center space-x-2">
          <Button variant="ghost" hideIcon disabled={downloadDisabled}>
            Descargar
          </Button>
          <Button
            aria-label="Abrir menú de descarga"
            iconOnly
            icon={DownloadIcon}
            variant="outline"
            size={isMobile ? "small" : "medium"}
            disabled={downloadDisabled}
          />
        </div>
      }
      items={[
        { label: "PDF", onClick: () => handleDownload("pdf"), controlType: "radio", controlSide: "left" },
        { label: "Excel", onClick: () => handleDownload("excel"), controlType: "radio", controlSide: "left" },
      ]}
    />
  )}

  {/* ✅ Solo renderiza actionsRender en DESKTOP */}
  {!isMobile && actionsRender && (
    <div className="flex items-center gap-2">{actionsRender()}</div>
  )}

  {/* ✅ Botón primario por defecto SOLO si no hay actionsRender */}
  {showButton && !actionsRender && (
    <Button variant="solid" size="large" hideIcon onClick={onTableActionClick}>
      {actionLabel}
    </Button>
  )}
</div>

    </div>
  );
};

export default DataTableLayout;
