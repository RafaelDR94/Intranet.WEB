"use client";

import React from "react";
import Image from "next/image";

import { loginStyles } from "../styles";
import BrandPanel from "./BrandPanel";
import LoginLogo from "@/assets/images/LogosCG/Login.png";

type AuthSplitLayoutProps = {
  header?: React.ReactNode;
  children: React.ReactNode;
};

const AuthSplitLayout: React.FC<AuthSplitLayoutProps> = ({
  header,
  children,
}) => {
  return (
    <div className={loginStyles.page}>
      <div className="absolute inset-0 z-0">
        <BrandPanel className="h-full w-full" />
      </div>

      <div className={loginStyles.formContainer}>
        <div className="mb-6 flex justify-center">
          <Image
            src={LoginLogo}
            alt="Grupo Cantabria Logo"
            width={140}
            height={140}
            className="drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
            priority
          />
        </div>

        <div className={loginStyles.formWrapper}>
          {header}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthSplitLayout;
