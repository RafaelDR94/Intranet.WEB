import { useState } from "react";
import ImagesIcon from "@/assets/icons/Fotos y Videos/media-image-list.svg";
import ArrowDownIcon from "@/assets/icons/navegacion/nav-arrow-down.svg";
import usePersonal from "./hooks/usePersonal";
import ListContent from "../../../../../../../../components/ListContent/ListContent";
import { Button } from "@/app/components/Button/Button";
import InfoCards from "@/app/components/InfoCards/InfoCards";

const Personal = () => {
  const { internalPersons, externalPersons, downloadImagesZip, cards } =
    usePersonal();

  // Estado para mostrar/ocultar InfoCards
  const [showInfo, setShowInfo] = useState(false);

  const toggleInfo = () => {
    setShowInfo((prev) => !prev);
  };

  return (
    <>
      <ListContent
        dataTable={internalPersons}
        dataTableSecondary={externalPersons}
        renderAction={(item) => (
          <>
            <Button
              hideIcon
              variant="ghost"
              size="small"
              className="rounded-xl"
              onClick={toggleInfo}
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
      />

      <div className="mt-3">
        {showInfo && (
          <InfoCards
            cards={cards}
            responsiveLayoutMatrix={{
              sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10], [10]],
              md: [[5, 5], [10], [5, 5], [10], [10]],
            }}
          />
        )}
      </div>
    </>
  );
};

export default Personal;
