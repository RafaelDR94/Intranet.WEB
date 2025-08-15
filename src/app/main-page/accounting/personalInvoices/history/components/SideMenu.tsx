import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import InvoicesForm from "../../invoices/components/InvoicesForm/InvoicesForm";
import { HistoryRow } from "../page";
import { Button } from "@/app/components/Button/Button";
import Label from "@/app/components/Label/Label";
import XMLIcon from '@/assets/icons/Docs/privacy policy.svg'
import PDFIcon from '@/assets/icons/Docs/page.svg'
interface SideMenuProps {
    panelOpen: boolean;
    setPanelOpen: (open: boolean) => void;
    selected: HistoryRow | null;
}

const SideMenu: React.FC<SideMenuProps> = ({ panelOpen, setPanelOpen, selected }) => {
    return (
        <DetailsPanelLayout
            open={panelOpen}
            withinContainer
            onClose={() => setPanelOpen(false)}
            leftLabel={selected ? `Proyecto: ${selected.project}` : undefined}
            rightLabel={selected ? `Código: ${selected.requestCode}` : undefined}
            actionButton={
                <div className="flex items-center gap-2">
                    <Button size="large" variant="ghost" icon={XMLIcon} onClick={() => selected && window.open(selected.xml, '_blank')}>
                        XML
                    </Button>
                    <Button size="large" variant="ghost" icon={PDFIcon} onClick={() => selected && window.open(selected.pdf, '_blank')}>
                        PDF
                    </Button>
                </div>
            }
        >
            {selected ? (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="text-s2 font-semibold">Detalle de la Solicitud</div>
                        <Label type={selected.status} text={selected.status.toUpperCase()} />
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="text-b3">
                            <span className="text-gray-70">Proyecto:</span> {selected.project}
                        </div>
                        <div className="text-b3">
                            <span className="text-gray-70">Código de Solicitud:</span> {selected.requestCode}
                        </div>
                    </div>

                    <div className="text-b3 text-gray-70">
                        Acciones rápidas: usa los botones de arriba para abrir los archivos XML/PDF.
                    </div>
                                        <InvoicesForm layoutMatrix={[[10], [10], [10], [10]]} type="update" />
                </div>
                
            ) : (
                <div className="text-gray-70 text-b3">Selecciona un registro para ver el detalle.</div>
            )}
        </DetailsPanelLayout>
    )
}
export default SideMenu;