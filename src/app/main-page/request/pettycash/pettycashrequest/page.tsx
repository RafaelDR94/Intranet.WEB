"use client"

import VoucherBlue from "./components/VoucherBlue/VoucherBlue";
import VoucherPink from "./components/VoucherPink/VoucherPink";
import { PettyCashProvider } from "./context/PettyCashContext";

import { useAuth } from "@/app/context/AuthContext/AuthContext";
import useTutorialAutoRun from "@/tutorials/engine/useTutorialAutoRun";

const PettyCashRequest = () => {
  const { currentPagePermissions } = useAuth();
  const hasPink = Boolean(currentPagePermissions?.voucherpink);
  const hasBlue = Boolean(currentPagePermissions?.voucherblue);
  useTutorialAutoRun({
    moduleId: hasPink || hasBlue ? "request-pettycash-request" : "",
    tutorialId: hasPink
      ? "request-pettycash-request:pink"
      : hasBlue
        ? "request-pettycash-request:blue"
        : "",
  });
  
  return (
    <PettyCashProvider>
      <div>
        {currentPagePermissions?.voucherpink && 
          <VoucherPink />
        }
      </div>
      <div className="mt-5">
        {currentPagePermissions?.voucherblue && 
          <VoucherBlue />
        }
      </div>
    </PettyCashProvider>
  );
};

export default PettyCashRequest;
