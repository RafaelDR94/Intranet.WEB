"use client";

import VoucherBlue from "./components/VoucherBlue/VoucherBlue";
import VoucherPink from "./components/VoucherPink/VoucherPink";
import { PettyCashProvider } from "./context/PettyCashContext";

const PettyCashRequest = () => {
  return (
    <PettyCashProvider>
      <div>
        <VoucherPink />
      </div>
      <div className="mt-5">
        <VoucherBlue />
      </div>
    </PettyCashProvider>
  );
};

export default PettyCashRequest;
