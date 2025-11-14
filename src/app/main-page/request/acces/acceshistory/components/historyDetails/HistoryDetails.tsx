import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import ButtonsNavigation from "@/app/components/ButtonsNavigation/ButtonsNavigation";
import Information from "./components/Information/Information";
import Personal from "./components/Personal/Personal";
import Tools from "./components/Tools/Tools";
import Automobiles from "./components/Automobiles/Automobiles";
import { Button } from "@/app/components/Button/Button";
import StatusChanger from "./components/SatusChanger/StatusChanger";
import Comments from "./components/Comments/Comments";

interface HistoryDetailsProps {
  open: boolean;
  onClose: () => void;
}
const HistoryDetails: React.FC<HistoryDetailsProps> = ({ open, onClose }) => {

  return (


      <DetailsPanelLayout
        open={open}
        onClose={onClose}
        actionButton={
          <Button size="medium" variant="solid" hideIcon>
            Descargar Documento
          </Button>
        }
      >
        <StatusChanger/>
        <ButtonsNavigation>
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
      </DetailsPanelLayout>

  );
};
export default HistoryDetails;
