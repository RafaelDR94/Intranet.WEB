import useExternalAccesForm from "./hooks/useExternalAccesForm";
import PersonsForm from "./components/PersonsForm/PersonsForm";
import Breadcrumbs from "@/app/components/Breadcrumbs/Breadcrumbs";
import VehiclesForm from "./components/VehiclesForm/VehiclesForm";
import ToolsForm from "./components/ToolsForm/ToolsForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
    
const ExternalAcccesForm = () => {
    const { UpdateAcces, canSubmit,currentAcces ,canUpdateForm} = useExternalAccesForm();
    if(currentAcces)return (

        <FormsLayout
            title="Registra Informción de Acceso"
            primaryLabel="Registrar Acceso"
            onPrimaryClick={UpdateAcces}
            primaryDisabled={!canSubmit}>
            <div className="space-y-6 p-2 sm:p-4 w-full">
                {/* Breadcrumbs con contenido controlado por el componente */}
                <Breadcrumbs dataTestId="proyectdetail-breadcrumbs" ariaLabel="Secciones del proyecto">
                    <Breadcrumbs.Item id="personsform" label="Pesonal" renderContent={<PersonsForm canUpdateForm={canUpdateForm} />} />
                    <Breadcrumbs.Item id="toolsform" label="Herramientas" renderContent={<ToolsForm />} />
                    <Breadcrumbs.Item id="vehicleform" label="Vehículos" renderContent={<VehiclesForm />} />
                </Breadcrumbs>
            </div>
        </FormsLayout>

    );
};

export default ExternalAcccesForm;
