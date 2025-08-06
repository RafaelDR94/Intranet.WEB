// src/app/components/DataTable/DataTableHeader.tsx
'use client'

import React from 'react'
import { Input } from '@/app/components/Input/Input'
import { Button } from '@/app/components/Button/Button'
import { TableLayoutProps } from './types'
import CalendarIcon from '@/assets/icons/System/System/calendar.svg'
import FilterIcon from '@/assets/icons/organization/filter-alt.svg'
import SearchIcon from '@/assets/icons/organization/search.svg'
import { tableLayoutStyles } from './styles'
const DataTableLayout: React.FC<TableLayoutProps> = ({
    onSearchChange,
    onCalendarClick,
    onFilterClick,
    onSearch,
    actionsRender,
    onTableActionClick,
    actionLabel = 'Agregar',
    showCalendar = true,
    showFilter = false,
    showButton = true,
}) => {
    return (


        <div className={tableLayoutStyles.headerdiv}>
            <Input
                placeholder="Buscar"
                inputSize='md'
                className={tableLayoutStyles.inputSyle}
                onChange={(e) => onSearchChange?.(e.target.value)}
                onClick={() => onSearch?.()}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onSearch?.()
                    }
                }}
                icon={SearchIcon}
            />
            {showCalendar && (
                <Button iconOnly={true} icon={CalendarIcon} variant="ghost" onClick={onCalendarClick} />
            )}

            {showFilter && (
                <Button iconOnly={true} icon={FilterIcon} variant="ghost" onClick={onFilterClick} />
            )}

            {showButton && !actionsRender && (
                <Button  variant="solid" size="large" className={tableLayoutStyles.buttonStyle} hideIcon={true} onClick={onTableActionClick}>
                    {actionLabel}
                </Button>
            )}

            {actionsRender?.()}
        </div>

    )
}
export default DataTableLayout