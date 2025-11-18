import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import ButtonsNavigation from "@/app/components/ButtonsNavigation/ButtonsNavigation";
import Information from "./components/Information/Information";
import Personal from "./components/Personal/Personal";
import Tools from "./components/Tools/Tools";
import { Button } from "@/app/components/Button/Button";
import StatusChanger from "./components/SatusChanger/StatusChanger";
import Comments from "./components/Comments/Comments";
import Automobiles from "./components/Automobiles/Automobiles";
import Label from "@/app/components/Label/Label";
import useHistoryDetails from "./hooks/useHistoryDetails";
interface HistoryDetailsProps {
  open: boolean;
  onClose: () => void;
}
const HistoryDetails: React.FC<HistoryDetailsProps> = ({ open, onClose }) => {
  const { canSeeEditButton, handleActiveChange, mapStatusToLabel, currentAcces, handleDownloadZIP, handleEditInformation } = useHistoryDetails();

  return (


    <DetailsPanelLayout
      open={open}
      onClose={onClose}
      actionButton={
        <Button size="medium" variant="solid" hideIcon onClick={handleDownloadZIP}>
          Descargar Documento
        </Button>
      }
      renderActions={() => <Label type={mapStatusToLabel(currentAcces?.status)} text={currentAcces?.status} />}

    >
      <StatusChanger />
      <ButtonsNavigation onActiveChange={handleActiveChange}>
        <ButtonsNavigation.Item
          label="Información"
          id="information"
          renderContent={<Information />}
        />
        <ButtonsNavigation.Item
          label="Personal"
          id="persons"
          renderContent={<Personal />}
        />
        <ButtonsNavigation.Item
          label="Herramienta"
          id="tools"
          renderContent={<Tools />}
        />
        <ButtonsNavigation.Item
          label="Automoviles"
          id="automobile"
          renderContent={<Automobiles />}
        />
        <ButtonsNavigation.Item
          label="Comentarios"
          id="comments"
          renderContent={<Comments />}
        />
      </ButtonsNavigation>
      {canSeeEditButton() && <div className="flex justify-end">
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
      </div>}


    </DetailsPanelLayout>

  );
};
export default HistoryDetails;
