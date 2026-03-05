"use client"
import GenerateAccesForm from "./components/GenerateAccesForm/GenerateAccesForm";
import ExternalAcccesForm from "./components/ExternalAccesForm/ExternalAccesForm";
import useGenerateAcces from "./hooks/useGenerateAcces";
import useTutorialAutoRun from "@/tutorials/engine/useTutorialAutoRun";
const GenerateAcccesPage = () => {
    const { idAcces, mode } = useGenerateAcces();
    useTutorialAutoRun({
        moduleId: "request-acces-generate",
        tutorialId: "request-acces-generate:main",
    });
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
