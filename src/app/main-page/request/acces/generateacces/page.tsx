'use client'
import GenerateAccesForm from "./components/GenerateAccesForm/GenerateAccesForm";
import ExternalAcccesForm from "./components/ExternalAccesForm/ExternalAccesForm";
import useGenerateAcces from "./hooks/useGenerateAcces";
const GenerateAcccesPage = () => {
    const { idAcces, mode } = useGenerateAcces();
    if (String(mode) == "renew") return (
        <>
            <GenerateAccesForm />
            <ExternalAcccesForm />
        </>
    )
    return (<>
        {(idAcces && String(mode) != "edit") ?
            <ExternalAcccesForm /> :
            <GenerateAccesForm />
        }
    </>
    )
}
export default GenerateAcccesPage;
