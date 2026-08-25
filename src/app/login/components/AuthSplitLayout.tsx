"use client";

import React from "react";

import { loginStyles } from "../styles";

import BrandPanel from "./BrandPanel";

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
      <BrandPanel className="h-56 shrink-0 sm:h-64 md:hidden" />

      <div className={loginStyles.formContainer}>
        <div className={loginStyles.formWrapper}>
          {header}
          {children}
        </div>
      </div>

      <BrandPanel className="hidden flex-1 md:block" />
    </div>
  );
};

export default AuthSplitLayout;
