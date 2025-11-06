import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout"
import ButtonsNavigation from "@/app/components/ButtonsNavigation/ButtonsNavigation"
interface HistoryDetailsProps {
    open: boolean,
    onClose: () => void
}
const HistoryDetails: React.FC<HistoryDetailsProps> = ({ open, onClose }) => {
    return (<DetailsPanelLayout open={open} onClose={onClose}>
        <ButtonsNavigation>
            <ButtonsNavigation.Item label="Información" id="information" renderContent={<>Información</>} />
            <ButtonsNavigation.Item label="Personal" id="persons" renderContent={<>Personal</>} />
            <ButtonsNavigation.Item label="Herramienta" id="tools" renderContent={<>Herramienta</>} />
        </ButtonsNavigation>
    </DetailsPanelLayout>)
}
export default HistoryDetails