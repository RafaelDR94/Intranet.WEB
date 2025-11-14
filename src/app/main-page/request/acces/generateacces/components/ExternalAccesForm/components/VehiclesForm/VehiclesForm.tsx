
import AddVehiclesForm from "./AddVehiclesForm/AddVehiclesForm";
import CollapsibleSection from "@/app/components/CollapsibleSection/CollapsibleSection";
import { Select } from "@/app/components/Select/Select";
import { Button } from "@/app/components/Button/Button";
import AddIcon from "@/assets/icons/acciones/plus.svg"
import ActionMenuCell from "@/app/components/ActionMenuCell/ActionMenuCell";
import useVehicleForm from "./hooks/useVehicleForm";
import { FormsInterface } from "../../types";

const VehiclesForm : React.FC<FormsInterface> = ({ canUpdateForm }) => {
    const {
        vehicles,
        systemVehicles,
        vehicleSelected,
        handleSelectVehicle,
        handleConfirmVehicle,
        handleAddVehicle,
        openVehicleForm,
        handleCancel,
        handleDelete
    } = useVehicleForm();

     return (
        <div>
            {!openVehicleForm && <div className="flex  gap-10">
                <Select
                    disabled={!canUpdateForm}
                    className="max-w-160"
                    selected={vehicleSelected ? [vehicleSelected] : []}
                    onChange={(values) => handleSelectVehicle(values[0] ?? "")}
                    options={systemVehicles}
                    placeholder="Selecciona un vehículo"
                />
                <Button onClick={handleConfirmVehicle} hideIcon disabled={!canUpdateForm}>
                    Agregar
                </Button>
            </div>}

            {openVehicleForm ? (
                <AddVehiclesForm formId="FirstVehicleForm" onCancel={handleCancel}    canUpdateForm={canUpdateForm}/>
            ) : (
                <div className="w-full">
                    {vehicles.map((vehicle) => (
                        <CollapsibleSection
                            key={vehicle.transport_id}
                            title={`${vehicle.plates} - ${vehicle.brand} ${vehicle.model}`}
                            defaultOpen={false}
                            rightContent={<ActionMenuCell row={vehicle} onDelete={handleDelete} permissions={{ delete: true }} />}

                        >
                            <AddVehiclesForm
                                formId={vehicle.transport_id}
                                currentTransport={vehicle}
                                canUpdateForm={canUpdateForm}
                            />
                        </CollapsibleSection>
                    ))}
                </div>
            )}

            <Button disabled={!canUpdateForm} icon={AddIcon} variant="outline" className="mt-5" onClick={handleAddVehicle}> Agregar otro vehículo</Button>
        </div>

    );
};

export default VehiclesForm;
