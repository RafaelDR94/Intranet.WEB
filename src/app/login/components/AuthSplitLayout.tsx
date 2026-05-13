"use client";

import Image from "next/image";
import React from "react";

import { loginStyles } from "../styles";

import logoDesktop from "@/assets/images/Walpapers/Wallpaper-1.png";
import logoMobile from "@/assets/images/Walpapers/wallpaper-mobile.png";

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
      <div className={loginStyles.formContainer}>
        <div className={loginStyles.formWrapper}>
          {header}
          {children}
        </div>
      </div>

      <div className={loginStyles.logoContainer}>
        <Image
          src={logoDesktop}
          alt="Fondo DR Security (desktop)"
          fill
          priority
          className={loginStyles.logo}
          sizes="(min-width: 768px) calc(100vw - 524px), 0px"
        />
        <Image
          src={logoMobile}
          alt="Fondo DR Security (mobile)"
          fill
          className="object-cover md:hidden"
          sizes="100vw"
        />
      </div>
    </div>
  );
};

export default AuthSplitLayout;
