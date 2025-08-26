// app/layouts/components/MainTabs/MainTabs.tsx
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { container, tabsWrapper } from "./styles";
import { MainTabsProps } from "./types";
import MenuIcon from "@/assets/icons/acciones/menu.svg";
import LogoDr from "@/assets/images/LogosDR/DReDIT.png";
import Bell from "@/assets/icons/Comunicacion/bell.svg";
import PersonalAvatar from "@/app/components/PersonalAvatar/PersonalAvatar";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";

export const MainTabs: React.FC<MainTabsProps> = ({
  tabs,
  pathname,
  validPermissionsbyroute,
  onOpenMobileMenu,
}) => {
  const clean = (v: string) => v.replaceAll("/", "");
  const isActive = (path: string) => clean(pathname) === clean(path);
  const filtered = tabs.filter((tab) => validPermissionsbyroute(tab.path));
  const isMobile = useIsMobile();

  // Topbar móvil (logo + hamburguesa). Se muestra siempre en <lg
  const MobileTopbar = (
    <div className="lg:hidden sticky top-0 z-[45] h-[78px] bg-[#04283A] text-white flex items-center justify-between px-4">
      <div>
        <Image src={LogoDr} alt="DR Security" width={90} height={55} />
      </div>
      <div className="flex items-center">
        <div className="mr-3">
          <Bell />
        </div>
        <PersonalAvatar size="tiny" />
        <button
          onClick={onOpenMobileMenu}
          className="h-10 w-10 ml-2 flex items-center justify-center rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
          aria-label="Abrir menú"
        >
          <MenuIcon aria-hidden />
        </button>
      </div>
    </div>
  );

  if (filtered.length === 0) {
    return <>{MobileTopbar}</>;
  }

  return (
    <>
      {MobileTopbar}

      <nav className={container}>
        <div className={tabsWrapper}>
          {filtered.map((tab, index) => (
            <React.Fragment key={tab.path}>
              {index > 0 && (
                <div className="h-4 border-l border-gray-20 mx-3" />
              )}
              <Link
                href={tab.path}
                className={`transition-colors ${
                  isActive(tab.path)
                    ? `${isMobile ? "text-b3" : "text-s1"} text-gray-100`
                    : `${isMobile ? "text-b3" : "text-s1"} text-gray-70 hover:text-gray-80`
                }`}
              >
                {tab.label}
              </Link>
            </React.Fragment>
          ))}
        </div>
      </nav>
      <div className="h-px bg-gray-20 mt-3 mx-6" />
    </>
  );
};
export default MainTabs;
