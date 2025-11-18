import ImagesIcon from "@/assets/icons/Fotos y Videos/media-image-list.svg";
import usePersonal from "./hooks/usePersonal";
import ListContent from "../../../../../../../../components/ListContent/ListContent";
import { Button } from "@/app/components/Button/Button";

const Personal = () => {
  const {
    internalPersons,
    externalPersons,
    downloadImagesZip,
  } = usePersonal();

  return (
    <>
      <ListContent
        dataTable={internalPersons}
        dataTableSecondary={externalPersons}
        renderAction={(item) => (
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
      />

     
    </>
  );
};

export default Personal;
