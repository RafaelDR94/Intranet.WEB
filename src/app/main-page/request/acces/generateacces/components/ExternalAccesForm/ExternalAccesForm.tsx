import useExternalAccesForm from "./hooks/useExternalAccesForm";
import PersonsForm from "./components/PersonsForm/PersonsForm";
import Breadcrumbs from "@/app/components/Breadcrumbs/Breadcrumbs";
import VehiclesForm from "./components/VehiclesForm/VehiclesForm";
import ToolsForm from "./components/ToolsForm/ToolsForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";

const ExternalAcccesForm = () => {
    const { UpdateAcces, canSubmit, currentAcces, canUpdateForm, mode } = useExternalAccesForm();
    const formatDate = (iso?: string) => {
        if (!iso) return '';
        const d = new Date(iso);
        if (isNaN(d.getTime())) return iso;
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    }
    if (currentAcces) return (

        <FormsLayout
            title={mode ? "Detalle de acceso" : "Registra Informción de Acceso"}
            primaryLabel="Registrar Acceso"
            onPrimaryClick={UpdateAcces}
            showPrimaryButton={!mode}
            primaryDisabled={!canSubmit || !canUpdateForm}>


            {!mode &&
                <div className="w-full">
                    <div className="flex flex-col gap-3 text-gray-90">
                        <div className="flex flex-col md:flex-row md:items-center md:gap-10">
                            <p className="text-body-md"><span className="font-semibold">Fecha Inicio:</span> {formatDate(currentAcces?.start_date)}</p>
                            <p className="text-body-md"><span className="font-semibold">Fecha Final:</span> {formatDate(currentAcces?.end_date)}</p>
                            <p className="text-body-md"><span className="font-semibold">Ubicación:</span> {currentAcces?.location?.address}</p>
                            <p className="text-body-md"><span className="font-semibold">Empresa solicitante:</span> {currentAcces?.external_enterprise?.name}</p>
                        </div>

                        <p className="text-body-md"><span className="font-semibold">Motivo de visita:</span> {currentAcces?.motive}</p>
                    </div>
                </div>
            }


            <div className="space-y-6 p-2 sm:p-4 w-full">
                {/* Breadcrumbs con contenido controlado por el componente */}
                <Breadcrumbs dataTestId="proyectdetail-breadcrumbs" ariaLabel="Secciones del proyecto">
                    <Breadcrumbs.Item id="personsform" label="Personal" renderContent={<PersonsForm canUpdateForm={canUpdateForm} />} />
                    <Breadcrumbs.Item id="toolsform" label="Herramientas" renderContent={<ToolsForm canUpdateForm={canUpdateForm} />} />
                    <Breadcrumbs.Item id="vehicleform" label="Vehículos" renderContent={<VehiclesForm canUpdateForm={canUpdateForm} />} />
                </Breadcrumbs>
            </div>
        </FormsLayout>

    );
};

export default ExternalAcccesForm;
