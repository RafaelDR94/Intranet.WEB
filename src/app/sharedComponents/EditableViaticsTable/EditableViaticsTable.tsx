"use client";

import clsx from "clsx";
import React from "react";
import { Check, Plus } from "lucide-react";

import { useEditableViaticsTable } from "./hooks/useEditableViaticsTable";
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
} from "./styles";
import {
  EditableViaticsField,
  EditableViaticsRow,
  EditableViaticsTableProps,
} from "./types";
import { formatIntegerAmount, parseAmount } from "./utilities/helperFunction";
import { Button } from "@/app/components/Button/Button";

const editableFields: EditableViaticsField[] = [
  "nationalQuoted",
  "foreignQuoted",
  "people",
  "days",
  "subtotal",
  "observations",
];

const EMPTY_AMOUNT_VALUE = "00";
const EMPTY_OBSERVATION_VALUE = "Escribe aquí";

const defaultRowSubtotalCalculator = (row: EditableViaticsRow): number => {
  const national = parseAmount(row.nationalQuoted);
  const foreign = parseAmount(row.foreignQuoted);
  const people = parseAmount(row.people);
  const days = parseAmount(row.days);
  return (national + foreign) * people * days;
};

const normalizeText = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const getEmptyCellValue = (field: EditableViaticsField) =>
  field === "observations" ? EMPTY_OBSERVATION_VALUE : EMPTY_AMOUNT_VALUE;

const isEmptyDisplayValue = (field: EditableViaticsField, value: string) =>
  field === "observations"
    ? normalizeText(value) === normalizeText(EMPTY_OBSERVATION_VALUE)
    : value.trim() === EMPTY_AMOUNT_VALUE;

export const EditableViaticsTable: React.FC<EditableViaticsTableProps> = ({
  value,
  defaultValue,
  onChange,
  onBlurCell,
  labels,
  totalOverride,
  readOnly = false,
  allowAddConcept = true,
  autoCalculate = true,
  rowSubtotalCalculator = defaultRowSubtotalCalculator,
  className,
  dataTestId,
}) => {
  const resolvedLabels = { ...defaultLabels, ...labels };
  const [isAddingConcept, setIsAddingConcept] = React.useState(false);
  const [newConcept, setNewConcept] = React.useState("");

  const { rows, subtotal, updateRows } = useEditableViaticsTable({
    value,
    defaultValue: defaultValue ?? [],
    onChange,
  });

  const updateCellValue = (
    rowId: string,
    field: EditableViaticsField,
    nextValue: string,
    shouldAutoCalculate = true,
  ) => {
    const nextRows = rows.map((row) => {
      if (row.id !== rowId) return row;
      const nextRow = { ...row, [field]: nextValue };
      if (
        shouldAutoCalculate &&
        autoCalculate &&
        field !== "observations" &&
        field !== "subtotal"
      ) {
        return {
          ...nextRow,
          subtotal: formatIntegerAmount(rowSubtotalCalculator(nextRow)),
        };
      }
      return nextRow;
    });
    updateRows(nextRows);
  };

  const handleChange = (
    rowId: string,
    field: EditableViaticsField,
    nextValue: string,
  ) => {
    updateCellValue(rowId, field, nextValue);
  };

  const handleFocus = (
    rowId: string,
    field: EditableViaticsField,
    value: string,
  ) => {
    if (readOnly || !isEmptyDisplayValue(field, value)) return;
    updateCellValue(rowId, field, "", false);
  };

  const handleBlur = (
    rowId: string,
    field: EditableViaticsField,
    value: string,
    input: HTMLInputElement,
  ) => {
    const nextValue = value.trim() ? value : getEmptyCellValue(field);

    if (nextValue !== value) {
      input.value = nextValue;
      updateCellValue(rowId, field, nextValue, false);
    }

    onBlurCell?.(rowId, field, nextValue);
  };

  const handleStartAddConcept = () => {
    setIsAddingConcept(true);
  };

  const handleNewConceptChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewConcept(event.target.value);
  };

  const handleAddConcept = () => {
    const concept = newConcept.trim();
    if (!concept) return;

    updateRows([
      ...rows,
      {
        id: `custom-${Date.now()}`,
        concept,
        nationalQuoted: EMPTY_AMOUNT_VALUE,
        foreignQuoted: EMPTY_AMOUNT_VALUE,
        people: EMPTY_AMOUNT_VALUE,
        days: EMPTY_AMOUNT_VALUE,
        subtotal: EMPTY_AMOUNT_VALUE,
        observations: EMPTY_OBSERVATION_VALUE,
      },
    ]);
    setNewConcept("");
    setIsAddingConcept(false);
  };

  const handleNewConceptKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddConcept();
    }

    if (event.key === "Escape") {
      setNewConcept("");
      setIsAddingConcept(false);
    }
  };

  const totalText = totalOverride ?? formatIntegerAmount(subtotal);
  const showAddConcept = allowAddConcept && !readOnly;

  return (
    <section
      className={clsx(baseContainerClasses, className)}
      data-testid={dataTestId}
    >
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
              <th
                className={clsx(labelHeaderClassesLeft, "pb-0.5")}
                rowSpan={2}
              >
                {resolvedLabels.concept}
              </th>
              <th
                className={clsx(labelHeaderClasses, "pb-0.5 text-center")}
                colSpan={2}
              >
                {resolvedLabels.perDiem}
              </th>
              <th
                className={clsx(labelHeaderClasses, "pb-0.5 text-center")}
                rowSpan={2}
              >
                {resolvedLabels.people}
              </th>
              <th
                className={clsx(labelHeaderClasses, "pb-0.5 text-center")}
                rowSpan={2}
              >
                {resolvedLabels.days}
              </th>
              <th
                className={clsx(labelHeaderClasses, "pb-0.5 text-center")}
                rowSpan={2}
              >
                {resolvedLabels.subtotal}
              </th>
              <th
                className={clsx(labelHeaderClassesLeft, "pb-0.5 text-center")}
                rowSpan={2}
              >
                {resolvedLabels.observations}
              </th>
            </tr>
            <tr className="border-gray-30 border-b">
              <th
                className={clsx(
                  labelHeaderClasses,
                  "pb-1 text-center normal-case",
                )}
              >
                {resolvedLabels.nationalQuoted}
              </th>
              <th
                className={clsx(
                  labelHeaderClasses,
                  "pb-1 text-center normal-case",
                )}
              >
                {resolvedLabels.foreignQuoted}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="align-middle">
                <td className={clsx(bodyTextClasses, "py-1 pr-2")}>
                  {row.concept}
                </td>
                {editableFields.map((field) => (
                  <td
                    key={`${row.id}-${field}`}
                    className={clsx(
                      field === "observations" ? "w-[24%]" : "w-[10%]",
                      field !== "observations" && "text-center",
                      "px-1 py-1",
                    )}
                  >
                    <input
                      aria-label={`${row.concept}-${field}`}
                      className={clsx(
                        inputClasses,
                        field === "observations"
                          ? bodyTextClasses
                          : mutedBodyTextClasses,
                        field !== "observations" && "text-center",
                      )}
                      readOnly={readOnly}
                      value={row[field]}
                      onFocus={() => handleFocus(row.id, field, row[field])}
                      onBlur={(event) =>
                        handleBlur(
                          row.id,
                          field,
                          row[field],
                          event.currentTarget,
                        )
                      }
                      onChange={(event) =>
                        handleChange(row.id, field, event.target.value)
                      }
                      maxLength={field === "observations" ? 40 : 5}
                    />
                  </td>
                ))}
              </tr>
            ))}
            {showAddConcept ? (
              <tr className="align-middle">
                <td className="py-2 pr-2">
                  {isAddingConcept ? (
                    <div className="flex items-center gap-2">
                      <input
                        aria-label={resolvedLabels.newConceptPlaceholder}
                        className="border-gray-40 bg-white-100 text-gray-80 h-10 w-full max-w-[210px] rounded-md border px-3 text-[14px] leading-5 transition-colors outline-none"
                        placeholder={resolvedLabels.newConceptPlaceholder}
                        value={newConcept}
                        onChange={handleNewConceptChange}
                        onKeyDown={handleNewConceptKeyDown}
                        maxLength={5}
                        autoFocus
                      />
                      <Button
                        variant="solid"
                        icon={Check}
                        onClick={handleAddConcept}
                        disabled={!newConcept.trim()}
                        aria-label="Confirmar concepto"
                      ></Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      icon={Plus}
                      onClick={handleStartAddConcept}
                    >
                      {resolvedLabels.addConcept}
                    </Button>
                  )}
                </td>
                <td colSpan={6}></td>
              </tr>
            ) : null}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4}></td>
              <td className="text-gray-70 py-0.5 text-center text-[14px] leading-5 font-medium">
                {resolvedLabels.subtotalSummary}
              </td>
              <td className="py-0.5 text-center text-[14px] leading-5 font-medium text-gray-100">
                {formatIntegerAmount(subtotal)}
              </td>
              <td></td>
            </tr>
            <tr>
              <td colSpan={4}></td>
              <td className="text-gray-70 py-0.5 text-center text-[14px] leading-5 font-medium">
                {resolvedLabels.total}
              </td>
              <td className="py-0.5 text-center text-[14px] leading-5 font-medium text-gray-100">
                {totalText}
              </td>
              <td className="text-gray-60 py-0.5 text-[12px] leading-4">
                {resolvedLabels.includesTax}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="text-blue-60 mt-3 text-center text-[10px] leading-[14px] font-semibold">
        {resolvedLabels.note}
      </p>
    </section>
  );
};
