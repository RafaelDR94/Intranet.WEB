"use client";

import { Button } from "@/app/components/Button/Button";
import InfoCards from "@/app/components/InfoCards/InfoCards";
import EditIcon from "@/assets/icons/Editor/edit-pencil.svg";

import useInformationAssignment from "./hooks/useInformationAssignment";
import type { InternalDeviceInformationProps } from "./types";

const InformationAssignment = ({
  device,
  deviceId,
  onEdit,
}: InternalDeviceInformationProps) => {
  const { assignedLabel, cards, handleEdit } = useInformationAssignment({
    device,
    deviceId,
    onEdit,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <span className="text-label text-blue-60">
          Asignado a: {assignedLabel}
        </span>
        <Button
          size="small"
          variant="ghost"
          icon={EditIcon}
          className="gap-2"
          onClick={handleEdit}
        >
          Editar Información
        </Button>
      </div>

      <InfoCards
        cards={cards}
        maxWidthClassName="max-w-4xl"
        dataTestId="internal-device-assignment-info-cards"
        responsiveLayoutMatrix={{
          sm: [[10], [10], [10], [10], [10], [10]],
          md: [[5, 5], [5, 5], [10], [10], [10], [10], [10]],
        }}
      />
    </div>
  );
};

export default InformationAssignment;
