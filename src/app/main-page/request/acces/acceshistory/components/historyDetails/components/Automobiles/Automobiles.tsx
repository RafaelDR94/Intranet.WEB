import { Button } from "@/app/components/Button/Button";
import useAutomobiles from "./hooks/useAutomobiles";
import InfoCards from "@/app/components/InfoCards/InfoCards";
import ImagesIcon from "@/assets/icons/Fotos y Videos/media-image-list.svg";

const Automobiles = () => {
  const {
    vehicles,
    loadingVehicles,
    cards,
    downloadImagesZip,
    current
  } = useAutomobiles();

  console.log('current ', current);

  return (
    <div className="space-y-4">
      <InfoCards
        cards={cards}
        responsiveLayoutMatrix={{
          sm: [[5, 5], [5]],
          md: [[5, 5], [10], [5, 5], [10], [10]],
        }}
      />
      <div className="flex items-center p-2 text-b4 text-gray-90 justify-between bg-white-100 rounded-2xl shadow-md">
        Galería de imágenes
        <Button
          hideIcon
          variant="ghost"
          size="small"
          className="rounded-xl"
          onClick={() => downloadImagesZip(current?.vehicles[0])}
        >
          <ImagesIcon />
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-c2 text-gray-70">
          {loadingVehicles
            ? "Cargando vehículos…"
            : `${vehicles.length} vehículos`}
        </p>
      </div>
    </div>
  );
};

export default Automobiles;
