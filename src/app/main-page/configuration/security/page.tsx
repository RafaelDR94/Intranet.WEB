"use client";

import MfaSecurityPanel from "./components/MfaSecurityPanel/MfaSecurityPanel";
import Nip from "../userconfiguration/components/NIP/NIP";
import Password from "../userconfiguration/components/Password/Password";
import Signature from "../userconfiguration/components/Signature/Signature";

const SecurityPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-3 md:grid-cols-2">
        <Password />
        <Nip />
        <Signature />
      </div>

      <MfaSecurityPanel />
    </div>
  );
};

export default SecurityPage;
