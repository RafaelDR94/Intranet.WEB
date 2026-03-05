"use client"

import ControlCards from "./components/ControlCards/ControlCards";
import ControlTable from "./components/ControlTable/ControlTable";
import useTutorialAutoRun from "@/tutorials/engine/useTutorialAutoRun";

const TreasuryControl = () => {
    useTutorialAutoRun({
        moduleId: "treasury-pettycash-control",
        tutorialId: "treasury-pettycash-control:main",
    });
    return (
        <>
            <ControlCards />
            <ControlTable />
        </>
    )
}

export default TreasuryControl;
