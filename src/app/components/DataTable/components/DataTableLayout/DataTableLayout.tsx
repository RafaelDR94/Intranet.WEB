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
  } = useDataTableLayout(props);

  return (
    <div className={tableLayoutStyles.headerdiv}>
      <Input
        placeholder="Buscar"
        inputSize="md"
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
        <Button
          iconOnly
          icon={FilterIcon}
          variant="ghost"
          onClick={onFilterClick}
        />
      )}

      {showButton && !actionsRender && (
        <Button
          variant="solid"
          size="large"
          className={tableLayoutStyles.buttonStyle}
          hideIcon
          onClick={onTableActionClick}
        >
          {actionLabel}
        </Button>
      )}

      {actionsRender?.()}
    </div>
  );
};

export default DataTableLayout;
