import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import ButtonsNavigation from "@/app/components/ButtonsNavigation/ButtonsNavigation";
import Information from "./components/Information/Information";
import Personal from "./components/Personal/Personal";
import Tools from "./components/Tools/Tools";
import { Button } from "@/app/components/Button/Button";
import Label from "@/app/components/Label/Label";

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
      renderActions={() => <Label text="" />}
    >
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
      </ButtonsNavigation>
    </DetailsPanelLayout>
  );
};
export default HistoryDetails;
