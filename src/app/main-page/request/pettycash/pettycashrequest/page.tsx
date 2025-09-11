"use client";

import VoucherBlue from "./components/VoucherBlue/VoucherBlue";
import VoucherPink from "./components/VoucherPink/VoucherPink";
import { PettyCashProvider } from "./context/PettyCashProvider";

const PettyCashRequest = () => {
  return (
    <PettyCashProvider>
      <VoucherPink />
      <VoucherBlue />
    </PettyCashProvider>
  );
};

export default PettyCashRequest;
