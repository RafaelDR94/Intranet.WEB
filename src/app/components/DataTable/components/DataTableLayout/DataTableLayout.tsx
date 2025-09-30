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
import ListIcon from "@/assets/icons/Layout/table-rows.svg";
import GridIcon from "@/assets/icons/Layout/view-grid.svg";
import RefreshDouble from "@/assets/icons/acciones/refresh-double.svg";
import SearchIcon from "@/assets/icons/organization/search.svg";
import Filter from "@/app/components/Filter/Filter";

const DataTableLayout: React.FC<TableLayoutProps> = (props) => {
  const {
    handleDateRange,
    handleInputChange,
    handleSearchClick,
    handleInputKeyDown,
    onFilterClick,
    onFilterChange,
    actionsRender,
    onTableActionClick,
    actionLabel,
    showCalendar,
    showFilter,
    showButton,
    isDownloadOpen,
    setIsDownloadOpen,
    handleDownload,
    filterOptions,
    filterValue,
    filterTitle,
    showRefresh,
    onRefreshPage,
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
        <Filter
          title={filterTitle}
          options={filterOptions ?? []}
          selectedValue={filterValue ?? undefined}
          onChange={(value) => {
            onFilterChange?.(value);
            onFilterClick?.();
          }}
        />
      )}

      {showRefresh && <RefreshDouble />}

      {/* Toggle vista lista/tarjetas */}
      {props.showViewToggle && (
        <div className="ml-2 flex items-center gap-2">
          <Button
            iconOnly
            variant={props.isCardsView ? "ghost" : "outline"}
            icon={ListIcon}
            onClick={() => props.onToggleView?.(false)}
          />
          <Button
            iconOnly
            variant={props.isCardsView ? "outline" : "ghost"}
            icon={GridIcon}
            onClick={() => props.onToggleView?.(true)}
          />
        </div>
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
              {
                label: "PDF",
                onClick: () => handleDownload("pdf"),
                controlType: "radio",
                controlSide: "left",
              },
              {
                label: "Excel",
                onClick: () => handleDownload("excel"),
                controlType: "radio",
                controlSide: "left",
              },
            ]}
          />
        )}

        {/* ✅ Solo renderiza actionsRender en DESKTOP */}
        {!isMobile && actionsRender && (
          <div className="flex items-center gap-2">{actionsRender()}</div>
        )}

        {/* ✅ Botón primario por defecto SOLO si no hay actionsRender */}
        {showButton && !actionsRender && (
          <Button
            variant="solid"
            size="large"
            hideIcon
            onClick={onTableActionClick}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DataTableLayout;
