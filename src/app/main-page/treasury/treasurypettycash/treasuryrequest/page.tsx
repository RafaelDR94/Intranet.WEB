"use client"

import TreasuryVoucherBlue from "./components/VoucherBlue/VoucherBlue";
import TreasuryVoucherPink from "./components/VoucherPink/VoucherPink";

import { useAuth } from "@/app/context/AuthContext/AuthContext";
import useTutorialAutoRun from "@/tutorials/engine/useTutorialAutoRun";

const TreasuryRequest = () => {
  const { currentPagePermissions } = useAuth();
  const hasPink = Boolean(currentPagePermissions?.voucherpink);
  const hasBlue = Boolean(currentPagePermissions?.voucherblue);

  useTutorialAutoRun({
    moduleId: hasPink || hasBlue ? "treasury-pettycash-request" : "",
    tutorialId: hasPink
      ? "treasury-pettycash-request:pink"
      : hasBlue
        ? "treasury-pettycash-request:blue"
        : "",
  });

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
