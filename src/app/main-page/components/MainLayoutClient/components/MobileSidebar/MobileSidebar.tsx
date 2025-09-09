// app/layouts/components/MobileSidebar/MobileSidebar.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';


import useMobileSideBar from './hooks/useMobileSideBar';
import { MobileSidebarProps } from './types';

import PersonalAvatar from '@/app/components/PersonalAvatar/PersonalAvatar';
import { ToggleButton } from '@/app/components/ToogleButton/ToogleButton';
import HelpIcon from '@/assets/icons/acciones/help-circle.svg';
import LogoutIcon from '@/assets/icons/acciones/open-in-window.svg';
import SubArrowIcon from '@/assets/icons/navegacion/long-arrow-down-right.svg';
import ArrowDownIcon from '@/assets/icons/navegacion/nav-arrow-down.svg';
import ArrowRightIcon from '@/assets/icons/navegacion/nav-arrow-right.svg';
// import WifiIcon from '@/assets/icons/Connectivity/wifi.svg';
import ThemeIcon from '@/assets/icons/System/System/darkmode.svg';
import LogoDr from '@/assets/images/LogosDR/DReDIT.png';


const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  // offlineMode,
  // onToggleOffline,
  theme,
  toggleTheme,
  userFullName,
  logout,
  validPermissionsbyroute,
  routes,
}) => {
  const { expanded, setExpanded, isActive, handleOverlayClick, panelRef } = useMobileSideBar({ isOpen, onClose })


  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 lg:hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* Overlay */}
      <div
        onClick={handleOverlayClick}
        className={`absolute inset-0 bg-black/50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal"
        className={`fixed inset-0 h-dvh w-screen bg-[#04283A] text-white shadow-xl
              transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
              flex flex-col overflow-y-auto pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <Image src={LogoDr} alt="DR Security" width={110} height={110} priority   />
          <button
            onClick={onClose}
            className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label="Cerrar menú"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Navegación */}
        <nav className="px-2 overflow-y-auto flex-1">
          {routes
            .filter(r => (!r.subroutes ? validPermissionsbyroute(r.path) : r.subroutes!.some(s => validPermissionsbyroute(s.path))))
            .map(route => {
              const Icon = route.icon;
              const hasSubs = !!route.subroutes?.length;
              const open = expanded === route.path;

              if (!hasSubs) {
                const active = isActive(route.path);
                return (
                  <Link
                    key={route.path}
                    href={route.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 h-11 rounded-md mb-1 ${active ? 'bg-white/10' : 'hover:bg-white/5'}`}
                  >
                    <Icon />
                    <span className="text-[15px] font-medium">{route.label}</span>
                  </Link>
                );
              }

              return (
                <div key={route.path} className="mb-1">
                  <button
                    onClick={() => setExpanded(open ? null : route.path)}
                    className="w-full flex items-center justify-between px-3 h-11 rounded-md hover:bg-white/5"
                    aria-expanded={open}
                    type="button"
                  >
                    <span className="flex items-center gap-3">
                      <Icon />
                      <span className="text-[15px] font-semibold">{route.label}</span>
                    </span>
                    {open ? <ArrowDownIcon aria-hidden /> : <ArrowRightIcon aria-hidden />}
                  </button>
                  <div className={`${open ? 'block' : 'hidden'} pl-7`}>
                    {route.subroutes!
                      .filter(s => validPermissionsbyroute(s.path))
                      .map(s => {
                        const active = isActive(s.path);
                        return (
                          <Link
                            key={s.path}
                            href={s.path}
                            onClick={onClose}
                            className={`flex items-center gap-2 px-3 h-10 rounded-md mb-1 ${active ? 'bg-white/10' : 'hover:bg-white/5'}`}
                          >
                            <SubArrowIcon aria-hidden />
                            <span className="text-[14px]">{s.label}</span>
                          </Link>
                        );
                      })}
                  </div>
                </div>
              );
            })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <PersonalAvatar size="xs" />
              <div>
                <p className="text-sm font-medium truncate max-w-[140px]">{userFullName ?? ''}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {/* <div className="flex items-center gap-2">
                <WifiIcon aria-hidden />
                <ToggleButton checked={!offlineMode} onChange={c => onToggleOffline(!c)} label="" />
              </div> */}
              <div className="flex items-center gap-2">
                <ThemeIcon aria-hidden />
                <ToggleButton checked={theme === 'dark'} onChange={toggleTheme} label="" />
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Link
              href="https://drsecurity.atlassian.net/servicedesk/customer/portals"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 h-10 px-2 rounded hover:bg-white/5"
            >
              <HelpIcon /> <span>Ayuda</span>
            </Link>
            <button
              onClick={async () => {
                await logout();
                window.location.href = '/';
              }}
              className="flex items-center gap-2 h-10 px-2 rounded hover:bg-white/5 w-full text-left"
              type="button"
            >
              <LogoutIcon /> <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MobileSidebar