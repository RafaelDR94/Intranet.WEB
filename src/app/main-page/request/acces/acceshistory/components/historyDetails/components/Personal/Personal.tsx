import { useMemo, useState } from "react";
import ImagesIcon from "@/assets/icons/Fotos y Videos/media-image-list.svg";
import ArrowDownIcon from "@/assets/icons/navegacion/nav-arrow-down.svg";
import usePersonal from "./hooks/usePersonal";
import ListContent from "../../../../../../../../components/ListContent/ListContent";
import { Button } from "@/app/components/Button/Button";
import InfoCards from "@/app/components/InfoCards/InfoCards";
import type { PersonalListItem } from "./hooks/usePersonal";

const Personal = () => {
  const { internalPersons, externalPersons, downloadImagesZip, getCardsForPerson } =
    usePersonal();

  const [selectedPerson, setSelectedPerson] = useState<PersonalListItem | null>(null);

  const handleToggleInfo = (person: PersonalListItem) => {
    setSelectedPerson((prevSelected) => {
      const isSamePerson =
        prevSelected?.id === person.id && prevSelected?.personType === person.personType;

      return isSamePerson ? null : person;
    });
  };

  const cards = useMemo(
    () => (selectedPerson ? getCardsForPerson(selectedPerson) : []),
    [getCardsForPerson, selectedPerson],
  );

  const renderInfoCards = (item: PersonalListItem) => {
    const isSelected =
      selectedPerson?.id === item.id && selectedPerson?.personType === item.personType;

    if (!isSelected || cards.length === 0) {
      return null;
    }

    return (
      <div className="mt-2">
        <InfoCards
          cards={cards}
          responsiveLayoutMatrix={{
            sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10], [10]],
            md: [[5, 5], [10], [5, 5], [10], [10]],
          }}
        />
      </div>
    );
  };

  return (
    <ListContent
      dataTable={internalPersons}
      dataTableSecondary={externalPersons}
      renderAction={(item: PersonalListItem) => (
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

          {item.personType === "external" && (
            <Button
              hideIcon
              variant="ghost"
              size="small"
              className="rounded-xl"
              onClick={() => downloadImagesZip(item)}
            >
              <ImagesIcon />
            </Button>
          )}
        </>
      )}
      renderDetails={renderInfoCards}
    />
  );
};

export default Personal;
