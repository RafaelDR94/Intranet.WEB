import { shallow } from "zustand/shallow";
import useAccessRequestStore from "@/app/stores/useAccesRequestStore/useAccesRequestStore";
import { useExternalPersonsStore } from "@/app/stores/useExternalPersonsStore/useExternalPersonsStore";
import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalPersonModel } from "@/app/mappings/externalperson/externalperson.types";
import useQuery from "@/app/hooks/useQuery/useQuery";
const usePersonsForm = () => {
    const {all} = useQuery();
    const enterpriseId=all.enterpriseId
    const hasInitExternalperson = useRef(false);
    const [personSelected, setPersonSelected] = useState("");
    const [openPersonForm, setOpenPersonForm] = useState(false);
    const { externalpersons, addPerson, removeExternalPerson } = useAccessRequestStore((s) => ({
        externalpersons: s.externalpersons,
        addPerson: s.addExternalPerson,
        removeExternalPerson: s.removeExternalPerson
    }), shallow);
    const { systemexternalpersons, fetchExternalPersons } = useExternalPersonsStore((s) => ({
        systemexternalpersons: s.externalPersons,
        fetchExternalPersons: s.fetchExternalPersonsByEnterprise,
    }), shallow);

    useEffect(() => {
        if (systemexternalpersons?.length == 0 && !hasInitExternalperson.current) {
            hasInitExternalperson.current = true;
            if(enterpriseId) fetchExternalPersons(String(enterpriseId), true);
        }
    }, [systemexternalpersons, fetchExternalPersons, enterpriseId]);

    const handleSelectPerson = (selected: string) => {
        setPersonSelected(selected);
    }
    const handleConfirmPerson = () => {
        const selectedperson = systemexternalpersons.filter(person => personSelected == String(person.id))
        if (selectedperson) addPerson(selectedperson[0]);
        setPersonSelected("");
    }
    const handleAddPerson = () => {
        setOpenPersonForm(true);
    }
    const handleCancel = () => {
        setOpenPersonForm(false);
    }
    const handleDelete = (person: ExternalPersonModel) => {
        removeExternalPerson(person.id);
    }
    const filteredSystemExternalPersons = useMemo(() => {
        const selectedIds = new Set(externalpersons.map(p => String(p.id)));
        return systemexternalpersons.filter(p => !selectedIds.has(String(p.id)));
    }, [systemexternalpersons, externalpersons]);
    useEffect(() => {
        if (externalpersons.length > 0) {
            setOpenPersonForm(false);
        }

    }, [externalpersons])

    return ({
        systemexternalpersons: filteredSystemExternalPersons,
        externalpersons,
        personSelected,
        handleSelectPerson,
        handleConfirmPerson,
        handleAddPerson,
        handleCancel,
        handleDelete,
        openPersonForm
    })
}
export default usePersonsForm;
