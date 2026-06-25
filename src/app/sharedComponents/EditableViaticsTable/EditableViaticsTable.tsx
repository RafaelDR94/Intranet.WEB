'use client';

import clsx from 'clsx';
import React from 'react';

import { useEditableViaticsTable } from './hooks/useEditableViaticsTable';
import {
  baseContainerClasses,
  bodyTextClasses,
  columnWidths,
  defaultLabels,
  inputClasses,
  labelHeaderClasses,
  labelHeaderClassesLeft,
  mutedBodyTextClasses,
  tableClasses,
} from './styles';
import { EditableViaticsRow, EditableViaticsTableProps } from './types';
import { formatIntegerAmount, parseAmount } from './utilities/helperFunction';

const editableFields: Array<keyof Omit<EditableViaticsRow, 'id'>> = [
  'nationalQuoted',
  'foreignQuoted',
  'people',
  'days',
  'subtotal',
  'observations',
];

const defaultRowSubtotalCalculator = (row: EditableViaticsRow): number => {
  const national = parseAmount(row.nationalQuoted);
  const foreign = parseAmount(row.foreignQuoted);
  const people = parseAmount(row.people);
  const days = parseAmount(row.days);
  return (national + foreign) * people * days;
};

export const EditableViaticsTable: React.FC<EditableViaticsTableProps> = ({
  value,
  defaultValue,
  onChange,
  onBlurCell,
  labels,
  totalOverride,
  readOnly = false,
  autoCalculate = true,
  rowSubtotalCalculator = defaultRowSubtotalCalculator,
  className,
  dataTestId,
}) => {
  const resolvedLabels = { ...defaultLabels, ...labels };

  const { rows, subtotal, updateRows } = useEditableViaticsTable({
    value,
    defaultValue: defaultValue ?? [],
    onChange,
  });

  const handleChange = (rowId: string, field: keyof Omit<EditableViaticsRow, 'id'>, nextValue: string) => {
    const nextRows = rows.map((row) => {
      if (row.id !== rowId) return row;
      const nextRow = { ...row, [field]: nextValue };
      if (autoCalculate && field !== 'observations' && field !== 'subtotal') {
        return {
          ...nextRow,
          subtotal: formatIntegerAmount(rowSubtotalCalculator(nextRow)),
        };
      }
      return nextRow;
    });
    updateRows(nextRows);
  };

  const totalText = totalOverride ?? formatIntegerAmount(subtotal);

  return (
    <section className={clsx(baseContainerClasses, className)} data-testid={dataTestId}>
      <div className="w-full overflow-x-auto">
        <table className={tableClasses}>
          <colgroup>
            <col className={columnWidths.concept} />
            <col className={columnWidths.nationalQuoted} />
            <col className={columnWidths.foreignQuoted} />
            <col className={columnWidths.people} />
            <col className={columnWidths.days} />
            <col className={columnWidths.subtotal} />
            <col className={columnWidths.observations} />
          </colgroup>
          <thead>
            <tr>
              <th className={clsx(labelHeaderClassesLeft, 'pb-0.5')} rowSpan={2}>{resolvedLabels.concept}</th>
              <th className={clsx(labelHeaderClasses, 'pb-0.5 text-center')} colSpan={2}>
                {resolvedLabels.perDiem}
              </th>
              <th className={clsx(labelHeaderClasses, 'pb-0.5 text-center')} rowSpan={2}>{resolvedLabels.people}</th>
              <th className={clsx(labelHeaderClasses, 'pb-0.5 text-center')} rowSpan={2}>{resolvedLabels.days}</th>
              <th className={clsx(labelHeaderClasses, 'pb-0.5 text-center')} rowSpan={2}>{resolvedLabels.subtotal}</th>
              <th className={clsx(labelHeaderClassesLeft, 'pb-0.5 text-center')} rowSpan={2}>{resolvedLabels.observations}</th>
            </tr>
            <tr className="border-b border-gray-30">
              <th className={clsx(labelHeaderClasses, 'pb-1 normal-case text-center')}>{resolvedLabels.nationalQuoted}</th>
              <th className={clsx(labelHeaderClasses, 'pb-1 normal-case text-center')}>{resolvedLabels.foreignQuoted}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="align-middle">
                <td className={clsx(bodyTextClasses, 'py-1 pr-2')}>{row.concept}</td>
                {editableFields.map((field) => (
                  <td key={`${row.id}-${field}`} className={clsx(field === 'observations' ? 'w-[24%]' : 'w-[10%]', field !== 'observations' && 'text-center', 'py-1 px-1')}>
                    <input
                      aria-label={`${row.concept}-${field}`}
                      className={clsx(inputClasses, field === 'observations' ? bodyTextClasses : mutedBodyTextClasses, field !== 'observations' && 'text-center')}
                      readOnly={readOnly}
                      value={row[field]}
                      onBlur={(event) => onBlurCell?.(row.id, field, event.target.value)}
                      onChange={(event) => handleChange(row.id, field, event.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4}></td>
              <td className="py-0.5 text-[14px] leading-5 font-medium text-gray-70 text-center">{resolvedLabels.subtotalSummary}</td>
              <td className="py-0.5 text-[14px] leading-5 font-medium text-gray-100 text-center">{formatIntegerAmount(subtotal)}</td>
              <td></td>
            </tr>
            <tr>
              <td colSpan={4}></td>
              <td className="py-0.5 text-[14px] leading-5 font-medium text-gray-70 text-center">{resolvedLabels.total}</td>
              <td className="py-0.5 text-[14px] leading-5 font-medium text-gray-100 text-center">{totalText}</td>
              <td className="py-0.5 text-[12px] leading-4 text-gray-60">{resolvedLabels.includesTax}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="mt-3 text-center text-[10px] font-semibold leading-[14px] text-blue-60">{resolvedLabels.note}</p>
    </section>
  );
};
