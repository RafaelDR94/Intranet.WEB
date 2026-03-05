"use client"

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSearchParams } from "next/navigation";

import useMainTab from "./hooks/useMainTab";
import { container, tabsWrapper } from "./styles";
import { MainTabsProps } from "./types";

import Notification from "../Notification/Notification";
import PersonalAvatar from "@/app/components/PersonalAvatar/PersonalAvatar";
import HelpButton from "@/components/help/HelpButton";
import TutorialCenterModal from "@/components/help/TutorialCenterModal";
import MenuIcon from "@/assets/icons/acciones/menu.svg";
import Bell from "@/assets/icons/Comunicacion/bell.svg";
import BellNotification from "@/assets/icons/Comunicacion/bell-notification.svg";
import LogoDr from "@/assets/images/LogosDR/DReDIT.png";

/**
 * Top navigation tabs for MainLayout. Highlights active tab based on current path and `id` query.
 */
export const MainTabs: React.FC<MainTabsProps> = ({
  tabs,
  pathname,
  validPermissionsbyroute,
  hasNotification = false,
  pendingNotifications = [],
  onOpenPending,
  onDismissPending,
  onOpenMobileMenu,
}) => {
  const { filtered, isMobile, isActive } = useMainTab({ tabs, pathname, validPermissionsbyroute });
  const searchParams = useSearchParams();
  const BellIcon = hasNotification ? BellNotification : Bell;
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [helpOpen, setHelpOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const tutorialModuleId = React.useMemo(() => {
    if (!pathname) return "main-page";
    const view = searchParams.get("view");
    const label = searchParams.get("label")?.toLowerCase();
    const isFilesView = label?.startsWith("archivos");
    const isBillableFilesView = view === "billablefiles";
    const isDetailView = view === "detail";
    const hasAuthorizationId =
      Boolean(searchParams.get("authorization_id")) || Boolean(searchParams.get("id"));
    const authorizationKind = searchParams.get("kind")?.toLowerCase() ?? "";
    const hasOwnRequisitionId = Boolean(searchParams.get("id"));
    if (pathname.includes("/main-page/operations/requisitions/requisitionListPage")) {
      if (isBillableFilesView) return "operations-requisitions-billablefiles";
      if (isFilesView) return "operations-requisitions-files";
      if (isDetailView) return "operations-requisitions-detail";
      return "operations-requisitions-list";
    }
    if (pathname.includes("/main-page/operations/requisitions/requisitionsPage")) {
      return "operations-requisitions-form";
    }
    if (pathname.includes("/main-page/request/ownrequisitions/requisitions")) {
      return hasOwnRequisitionId
        ? "request-ownrequisitions-detail"
        : "request-ownrequisitions-list";
    }
    if (pathname.includes("/main-page/request/ownrequisitions/billablefiles")) {
      return "request-ownrequisitions-billablefiles";
    }
    if (pathname.includes("/main-page/authorizations/authorizationslist")) {
      if (!hasAuthorizationId) return "authorizations-list";
      if (authorizationKind.includes("requis")) return "authorizations-requisition-detail";
      return "authorizations-vale-detail";
    }
    if (pathname.includes("/main-page/treasury/treasurypettycash/treasurycontrol")) {
      return "treasury-pettycash-control";
    }
    if (pathname.includes("/main-page/treasury/treasurypettycash/treasuryrequest")) {
      return "treasury-pettycash-request";
    }
    if (pathname.includes("/main-page/request/pettycash/pettycashrequest")) {
      return "request-pettycash-request";
    }
    if (pathname.includes("/main-page/request/pettycash/pettycashhistory")) {
      return "request-pettycash-history";
    }
    if (pathname.includes("/main-page/request/documents/managementdocuments")) {
      return "request-documents-management";
    }
    if (pathname.includes("/main-page/request/documents/operationaldocuments")) {
      return "request-documents-operational";
    }
    if (pathname.includes("/main-page/request/acces/generateacces")) {
      return "request-acces-generate";
    }
    if (pathname.includes("/main-page/request/acces/acceshistory")) {
      return "request-acces-history";
    }
    if (pathname.includes("/main-page/request/acces/registerenterprise")) {
      return "request-acces-register";
    }
    if (pathname.includes("/main-page/accounting/invoices/validateinvoices")) {
      return "accounting-validateinvoices";
    }
    if (pathname.includes("/main-page/accounting/invoices/sat")) {
      return "accounting-invoices-sat";
    }
    if (pathname.includes("/main-page/sip/proyects/newproyect")) {
      return "sip-newproyect";
    }
    if (pathname.includes("/main-page/generalservices/vehicleregist/vehicleregistry")) {
      return "generalservices-vehicleregistry";
    }
    if (pathname.includes("/main-page/generalservices/vehicleregist/vehicleregistrylist")) {
      return "generalservices-vehicleregistrylist";
    }
    if (pathname.includes("/main-page/humanresources/documents/documentregistry")) {
      return "humanresources-documentregistry";
    }
    if (pathname.includes("/main-page/humanresources/documents/managementdocuments")) {
      return "humanresources-managementdocuments";
    }
    if (pathname.includes("/main-page/humanresources/documents/operationaldocuments")) {
      return "humanresources-operationaldocuments";
    }
    if (pathname.includes("/main-page/administration/usersmanagment/createemployee")) {
      return "administration-createemployee";
    }
    if (pathname.includes("/main-page/administration/usersmanagment/employeesList")) {
      return "administration-employeeslist";
    }
    return "main-page";
  }, [pathname, searchParams]);

  React.useEffect(() => {
    if (!menuOpen) return;
    const handleOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [menuOpen]);

  const handleOpenNotification = (notification: typeof pendingNotifications[number]) => {
    onOpenPending?.(notification);
  };

  const handleDismissNotification = (notificationId: string) => {
    onDismissPending?.(notificationId);
  };

  const NotificationBell = (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        data-testid="top-bar-notifications"
        data-tour="notifications-bell"
        aria-label="Notificaciones"
        onClick={() => setMenuOpen(prev => !prev)}
        className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-10 focus:outline-none focus:ring-2 focus:ring-blue-40"
      >
        <BellIcon />
      </button>
      {menuOpen && (
        <div className="absolute right-0 mt-2 z-[60] w-[280px] max-w-[92vw]">
          {pendingNotifications.length === 0 ? (
            <div className="rounded-md border border-gray-10 bg-white-100 px-3 py-2 text-c2 text-gray-60 shadow-300">
              Sin notificaciones pendientes
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {pendingNotifications.map((notification) => (
                <Notification
                  key={notification.id}
                  title={notification.title}
                  description={notification.body}
                  createdAt={notification.createdAt}
                  avatarSrc={notification.avatarSrc}
                  onAction={() => handleOpenNotification(notification)}
                  onClose={() => handleDismissNotification(notification.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
  const HelpAction = (
    <HelpButton onClick={() => setHelpOpen(true)} />
  );

  const HeaderActions = (
    <div className="flex items-center gap-2">
      {HelpAction}
      {NotificationBell}
    </div>
  );

  // Topbar movil (logo + hamburguesa). Se muestra siempre en <lg
  const MobileTopbar = (
    <div className="lg:hidden sticky top-0 z-[45] h-[78px] bg-[#04283A] text-white flex items-center justify-between px-4">
      <div>
        <Image src={LogoDr} alt="DR Security TopBar" width={90} height={55} />
      </div>
      <div className="flex items-center">
        <div className="mr-3">{isMobile ? HeaderActions : null}</div>
        <PersonalAvatar size="tiny" dataTestId="top-bar-Avatar" />
        <button
          data-testid="open-mobile-menu"
          data-tour="mobile-menu-button"
          onClick={onOpenMobileMenu}
          className="h-10 w-10 ml-2 flex items-center justify-center rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
          aria-label="Abrir menu"
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

      <nav data-testid="main-tabs" data-tour="main-tabs" className={container}>
        <div className={tabsWrapper}>
          {filtered.map((tab, index) => (
            <React.Fragment key={tab.path}>
              {index > 0 && (
                <div className="h-4 border-l border-gray-20 mx-3" />
              )}
              <Link
                data-testid={`tab:${tab.path}`}
                href={tab.path}
                className={`transition-colors ${isActive(tab.path)
                  ? `${isMobile ? "text-b3" : "text-s1"} text-gray-100`
                  : `${isMobile ? "text-b3" : "text-s1"} text-gray-70 hover:text-gray-80`
                  }`}
              >
                {tab.label}
              </Link>
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center">
          {!isMobile ? HeaderActions : null}
        </div>
      </nav>
      <div className="h-px bg-gray-20 mt-3 mx-6" />
      {helpOpen ? (
        <TutorialCenterModal
          open={helpOpen}
          onClose={() => setHelpOpen(false)}
          moduleId={tutorialModuleId}
        />
      ) : null}
    </>
  );
};
export default MainTabs;
