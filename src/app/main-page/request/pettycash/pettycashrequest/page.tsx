"use client";

import VoucherBlue from "./components/VoucherBlue/VoucherBlue";
import VoucherPink from "./components/VoucherPink/VoucherPink";
import { PettyCashProvider } from "./context/PettyCashContext";

import { useAuth } from "@/app/context/AuthContext/AuthContext";

const PettyCashRequest = () => {
  const { currentPagePermissions } = useAuth();
  
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
