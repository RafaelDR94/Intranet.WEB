'use client'
import GenerateAccesForm from "./components/GenerateAccesForm/GenerateAccesForm";
import ExternalAcccesForm from "./components/ExternalAccesForm/ExternalAccesForm";
import useGenerateAcces from "./hooks/useGenerateAcces";
const GenerateAcccesPage = () => {
    const { idAcces } = useGenerateAcces();
    return (<>
        {idAcces ?
            <ExternalAcccesForm /> :
            <GenerateAccesForm />
        }
    </>
    )
}
export default GenerateAcccesPage;
