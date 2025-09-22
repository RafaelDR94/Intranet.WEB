'use client'

import TreasuryVoucherBlue from "./components/VoucherBlue/VoucherBlue";
import TreasuryVoucherPink from "./components/VoucherPink/VoucherPink";
import { useAuth } from "@/app/context/AuthContext/AuthContext";



const TreasuryRequest = () => {
  const { currentPagePermissions } = useAuth();

  return (
    <>
      {currentPagePermissions?.voucherpink && (
        <TreasuryVoucherPink />
      )}
      {currentPagePermissions?.voucherblue && (
        <TreasuryVoucherBlue />
      )}
    </>
  );
};

export default TreasuryRequest;
