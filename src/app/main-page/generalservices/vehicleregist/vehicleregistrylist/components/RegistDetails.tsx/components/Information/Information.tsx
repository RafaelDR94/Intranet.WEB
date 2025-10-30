import React from "react";

import CheckBoxList from "@/app/components/CheckBoxList/CheckBoxList";

import useInformation from "./hooks/useInformation";
import type { TrackingInformation } from "./types";

const buildChecklistTitle = (baseTitle: string, suffix?: string) => {
  if (!suffix) return baseTitle;
  return `${baseTitle} (${suffix})`;
};

const Information: React.FC = () => {
  const {
    assignment,
    generalRows,
    departure,
    arrival,
    checklistDefinitions,
  } = useInformation();

  if (!assignment) {
    return (
      <div className="w-full text-center text-gray-70 text-b3">
        Selecciona un registro para ver la información.
      </div>
    );
  }

  const sections = [
    { id: "departure", label: "Salida", data: departure },
    { id: "arrival", label: "Llegada", data: arrival },
  ].filter((section): section is {
    id: string;
    label: string;
    data: TrackingInformation;
  } => Boolean(section.data));

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-2">
        {generalRows.map((row) => (
          <div key={row.label} className="flex flex-wrap items-baseline gap-2">
            <span className="text-gray-70 text-b4 font-medium">
              {row.label}:
            </span>
            <span className="text-gray-90 text-b3 font-semibold">
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {sections.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section) => (
            <div key={`${section.id}-metrics`} className="space-y-2">
              <div className="text-gray-70 text-b4 font-medium">
                Kilometraje {section.label}:{" "}
                <span className="text-gray-90 text-b3 font-semibold">
                  {section.data.mileage}
                </span>
              </div>
              <div className="text-gray-70 text-b4 font-medium">
                Combustible {section.label}:{" "}
                <span className="text-gray-90 text-b3 font-semibold">
                  {section.data.fuelLevel}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {sections.map((section) => (
        <div key={`${section.id}-details`} className="space-y-4">
          <div className="space-y-1">
            <div className="text-gray-70 text-b4 font-medium">
              Observaciones {section.label}:
            </div>
            <p className="text-gray-70 text-b4">{section.data.remarks}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <CheckBoxList
              title={buildChecklistTitle(
                checklistDefinitions.tools.title,
                sections.length > 1 ? section.label : undefined
              )}
              options={checklistDefinitions.tools.options.map((option) => ({
                label: option.label,
                value: option.value,
              }))}
              value={section.data.checklistValues.tools}
              // disabled
            />
            <CheckBoxList
              title={buildChecklistTitle(
                checklistDefinitions.documents.title,
                sections.length > 1 ? section.label : undefined
              )}
              options={checklistDefinitions.documents.options.map(
                (option) => ({
                  label: option.label,
                  value: option.value,
                })
              )}
              value={section.data.checklistValues.documents}
              // disabled
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Information;

