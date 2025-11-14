import ImagesIcon from "@/assets/icons/Fotos y Videos/media-image-list.svg";
import usePersonal from "./hooks/usePersonal";
import ListContent from "../../../../../../../../components/ListContent/ListContent";
import { Button } from "@/app/components/Button/Button";

const Personal = () => {
  const {
    internalPersons,
    externalPersons,
    handleEditInformation,
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

      <div className="flex justify-end">
        <div className="flex justify-end">
          <Button
            size="medium"
            variant="outline"
            hideIcon
            style={{ marginBlock: "10px" }}
            onClick={handleEditInformation}
          >
            Editar Información
          </Button>
        </div>
      </div>
    </>
  );
};

export default Personal;
