
import AddVehiclesForm from "./AddVehiclesForm/AddVehiclesForm";
import CollapsibleSection from "@/app/components/CollapsibleSection/CollapsibleSection";
import { Select } from "@/app/components/Select/Select";
import { Button } from "@/app/components/Button/Button";
import AddIcon from "@/assets/icons/acciones/plus.svg"
import ActionMenuCell from "@/app/components/ActionMenuCell/ActionMenuCell";
import useVehicleForm from "./hooks/useVehicleForm";
const VehiclesForm = () => {
    const { externalpersons, systemexternalpersons, personSelected, handleSelectPerson, handleConfirmPerson, handleAddPerson, openPersonForm, handleCancel, handleDelete } = useVehicleForm();

    return (
        <div>
            {!openPersonForm && <div className="flex">
                <Select
                    selected={personSelected ? [personSelected] : []}
                    onChange={(values) => handleSelectPerson(values[0] ?? "")}
                    options={systemexternalpersons.map(person => ({ value: String(person.id), label: person.name + " " + person.lastname + " " + person.motherslastname }))}
                    placeholder="Selecciona una persona"
                />
                <Button onClick={handleConfirmPerson} hideIcon>
                    Seleccionar persona
                </Button>
            </div>}

            {openPersonForm ? (
                <AddVehiclesForm formId="FirstExternalAccesForm" onCancel={handleCancel} />
            ) : (
                <div className="w-full">
                    {externalpersons.map((person) => (
                        <CollapsibleSection
                            key={person.electorkey ?? person.id ?? `${person.name}-${person.lastname}-${person.motherslastname}`}
                            title={`${person.name} ${person.lastname} ${person.motherslastname}`}
                            defaultOpen={false}
                            rightContent={<ActionMenuCell row={person} onDelete={handleDelete} permissions={{ delete: true }} />}

                        >
                            <AddVehiclesForm
                                formId={person.electorkey ?? person.id}
                                currentexternalperson={person}
                            />
                        </CollapsibleSection>
                    ))}
                </div>
            )}

            <Button icon={AddIcon} variant="outline" onClick={handleAddPerson}> Agregar otra persona</Button>
        </div>

    );
};

export default VehiclesForm;
