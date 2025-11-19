import { useMemo, useState } from "react";

import ArrowDownIcon from "@/assets/icons/navegacion/nav-arrow-down.svg";
import ImagesIcon from "@/assets/icons/Fotos y Videos/media-image-list.svg";
import { Button } from "@/app/components/Button/Button";
import InfoCards from "@/app/components/InfoCards/InfoCards";
import ListContent from "@/app/components/ListContent/ListContent";
import useAutomobiles from "./hooks/useAutomobiles";
import type { AutomobilesListItem } from "./hooks/useAutomobiles";

const Automobiles = () => {
  const { vehicles, downloadImagesZip, getCardsForVehicle } = useAutomobiles();
  const [selectedVehicle, setSelectedVehicle] = useState<AutomobilesListItem | null>(null);

  const handleToggleInfo = (vehicle: AutomobilesListItem) => {
    setSelectedVehicle((prevSelected) => {
      const isSameVehicle = prevSelected?.id === vehicle.id;
      return isSameVehicle ? null : vehicle;
    });
  };

  const cards = useMemo(
    () => (selectedVehicle ? getCardsForVehicle(selectedVehicle) : []),
    [getCardsForVehicle, selectedVehicle],
  );

  const renderInfoCards = (item: AutomobilesListItem) => {
    const isSelected = selectedVehicle?.id === item.id;

    if (!isSelected || cards.length === 0) {
      return null;
    }

    return (
      <div className="mt-2">
        <InfoCards
          cards={cards}
          responsiveLayoutMatrix={{
            sm: [[5, 5], [5]],
            md: [[5, 5], [10], [5, 5], [10], [10]],
          }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <ListContent
        dataTable={vehicles}
        renderAction={(item: AutomobilesListItem) => (
          <>
            <Button
              hideIcon
              variant="ghost"
              size="small"
              className="rounded-xl"
              onClick={() => handleToggleInfo(item)}
            >
              <ArrowDownIcon />
            </Button>

            <Button
              hideIcon
              variant="ghost"
              size="small"
              className="rounded-xl"
              onClick={() => downloadImagesZip(item)}
            >
              <ImagesIcon />
            </Button>
          </>
        )}
        renderDetails={renderInfoCards}
      />
    </div>
  );
};

export default Automobiles;
