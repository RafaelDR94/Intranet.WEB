"use client";

import React from "react";
import { Input } from "@/app/components/Input/Input";
import { Button } from "@/app/components/Button/Button";
import type { TableLayoutProps } from "./types";
import FilterIcon from "@/assets/icons/organization/filter-alt.svg";
import SearchIcon from "@/assets/icons/organization/search.svg";
import { tableLayoutStyles } from "./styles";
import { Calendar } from "@/app/components/Calendar/Calendar";
import { useDataTableLayout } from "./hooks/useDataTableLayout";
import DownloadIcon from "@/assets/icons/acciones/download.svg";
import { ContextMenu } from "@/app/components/ContextMenu/ContextMenu";
import { useIsMobile } from "./hooks/useMediaQuery";

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
    handleDownload
  } = useDataTableLayout(props);

  const { downloadDisabled = false } = props;
  const isMobile = useIsMobile()

  return (
    <div className={tableLayoutStyles.headerdiv}>
      <Input
        placeholder="Buscar"
        inputSize={isMobile ? 'md' : 'sm'}
        className={tableLayoutStyles.inputSyle}
        onChange={(e) => handleInputChange(e.target.value)}
        onClick={handleSearchClick}
        onKeyDown={handleInputKeyDown}
        icon={SearchIcon}
      />

      {showCalendar && (
        <div className="mx-2">
          <Calendar onCalendarClick={handleDateRange} />
        </div>
      )}

      {showFilter && (
        <Button iconOnly icon={FilterIcon} variant="ghost" onClick={onFilterClick} />
      )}

      <div className={tableLayoutStyles.buttonsStyle}>
        {props.showDownloadTable && (

          <ContextMenu
            title="FORMATO"
            isOpen={isDownloadOpen}
            setIsOpen={setIsDownloadOpen}
            trigger={
              <div className="flex items-center space-x-2">
                <Button variant="ghost" disabled={downloadDisabled}>
                  Descargar
                </Button>
                <Button
                  aria-label="Abrir menú de descarga"
                  iconOnly
                  icon={DownloadIcon}
                  variant="outline"
                  disabled={downloadDisabled}
                />

              </div>

            }
            items={[
              { label: "PDF", onClick: () => handleDownload("pdf"), controlType: 'radio' ,controlSide: 'left'},
              { label: "Excel", onClick: () => handleDownload("excel"), controlType: 'radio',controlSide: 'left' },
            ]}
          />

        )}

        {showButton && !actionsRender && (
          <Button variant="solid" size="large" hideIcon onClick={onTableActionClick}>
            {actionLabel}
          </Button>
        )}
      </div>

      {actionsRender?.()}
    </div>
  );
};

export default DataTableLayout;
