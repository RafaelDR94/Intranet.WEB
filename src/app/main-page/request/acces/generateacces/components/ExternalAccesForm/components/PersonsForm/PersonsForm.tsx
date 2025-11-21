import usePersonsForm from "./hooks/usePersonsForm";

import AddExternalPersonForm from "./components/AddExternalPersonForm/AddExternalPersonForm";
import CollapsibleSection from "@/app/components/CollapsibleSection/CollapsibleSection";
import { Select } from "@/app/components/Select/Select";
import { Button } from "@/app/components/Button/Button";
import AddIcon from "@/assets/icons/acciones/plus.svg"
import ActionMenuCell from "@/app/components/ActionMenuCell/ActionMenuCell";
import { FormsInterface } from "../../types";

const PersonsForm: React.FC<FormsInterface> = ({ canUpdateForm }) => {
    const { externalpersons, systemexternalpersons, personSelected, handleSelectPerson, handleConfirmPerson, handleAddPerson, openPersonForm, handleCancel, handleDelete } = usePersonsForm();

    return (
        <div>
            {!openPersonForm && <div className="flex  gap-10">
                <Select
                    disabled={!canUpdateForm}
                    className="max-w-160"
                    selected={personSelected ? [personSelected] : []}
                    onChange={(values) => handleSelectPerson(values[0] ?? "")}
                    options={systemexternalpersons.map(person => ({ value: String(person.id), label: person.name + " " + person.lastname + " " + person.motherslastname }))}
                    placeholder="Selecciona una persona"
                />
                <Button onClick={handleConfirmPerson} hideIcon disabled={!canUpdateForm || !personSelected}>
                    Agregar
                </Button>
            </div>}

            {openPersonForm ? (
                <AddExternalPersonForm formId="FirstExternalAccesForm" onCancel={handleCancel}    canUpdateForm={canUpdateForm}/>
            ) : (
                <div className="w-full">
                    {externalpersons.map((person) => (
                        <CollapsibleSection
                            key={person.electorkey ?? person.id ?? `${person.name}-${person.lastname}-${person.motherslastname}`}
                            title={`${person.name} ${person.lastname} ${person.motherslastname}`}
                            defaultOpen={false}
                            rightContent={<ActionMenuCell row={person} onDelete={handleDelete} permissions={{ delete: true }} />}

                        >
                            <AddExternalPersonForm
                                formId={person.electorkey ?? person.id}
                                currentexternalperson={person}
                                canUpdateForm={canUpdateForm}
                            />
                        </CollapsibleSection>
                    ))}
                </div>
            )}

            <Button disabled={!canUpdateForm} icon={AddIcon} variant="outline" className="mt-5" onClick={handleAddPerson}> Agregar otra persona</Button>
        </div>

    );
};

export default PersonsForm;
