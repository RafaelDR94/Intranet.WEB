"use client"
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
import WifiIcon from '@/assets/icons/Connectivity/wifi.svg';
import ThemeIcon from '@/assets/icons/System/System/darkmode.svg';
import LogoGc from '@/assets/images/LogosCG/LogoGC.png';
import ConfigurationLogo from '@/assets/icons/System/System/settings.svg';


const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  offlineMode,
  onToggleOffline,
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
      data-testid="mobile-sidebar"
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-95 lg:hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* Overlay */}
      <div
        data-testid="mobile-overlay"
        onClick={handleOverlayClick}
        className={`absolute inset-0 bg-black/50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Panel */}
      <div
        data-testid="mobile-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal"
        className={`fixed inset-0 h-dvh w-screen bg-[#071927] text-white shadow-2xl backdrop-blur-2xl
              transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
              flex flex-col overflow-y-auto pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <Image src={LogoGc} alt="Grupo Cantabria Logo" width={120} height={120} priority className="object-contain filter drop-shadow" />
          <button
            data-testid="mobile-closesidebar"
            onClick={onClose}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-150 active:scale-95"
            aria-label="Cerrar menú"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Navegación */}
        <nav className="px-3 py-4 overflow-y-auto flex-1 space-y-1.5" data-tour="sidebar-nav">
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
                    data-testid={`mobile:${route.path}`}
                    key={route.path}
                    href={route.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3.5 h-11 rounded-xl transition-all duration-200 ${active
                        ? 'bg-gradient-to-r from-blue-500/25 to-blue-600/10 text-white font-bold border-l-4 border-blue-400 shadow-sm'
                        : 'text-white/70 hover:text-white hover:bg-white/10 font-semibold'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[15px]">{route.label}</span>
                  </Link>
                );
              }

              return (
                <div key={route.path} className="mb-1" data-testid={`mobile:${route.path}`}>
                  <button
                    onClick={() => setExpanded(open ? null : route.path)}
                    className={`w-full flex items-center justify-between px-3.5 h-11 rounded-xl transition-all duration-200 ${open ? 'bg-white/10 text-white font-bold' : 'text-white/70 hover:text-white hover:bg-white/5 font-semibold'
                      }`}
                    aria-expanded={open}
                    type="button"
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="text-[15px]">{route.label}</span>
                    </span>
                    {open ? <ArrowDownIcon aria-hidden className="w-4 h-4 text-white/60" /> : <ArrowRightIcon aria-hidden className="w-4 h-4 text-white/60" />}
                  </button>
                  <div className={`${open ? 'block' : 'hidden'} pl-4 ml-2 border-l border-white/10 mt-1 space-y-1`}>
                    {route.subroutes!
                      .filter(s => validPermissionsbyroute(s.path))
                      .map(s => {
                        const active = isActive(s.path);
                        return (
                          <Link
                            data-testid={`mobile:${s.path}`}
                            key={s.path}
                            href={s.path}
                            onClick={onClose}
                            className={`flex items-center gap-2.5 px-3 h-10 rounded-lg text-b3 transition-all duration-150 ${active
                                ? 'bg-blue-500/20 text-blue-300 font-bold border-l-2 border-blue-400'
                                : 'text-white/70 hover:text-white hover:bg-white/10 font-medium'
                              }`}
                          >
                            <SubArrowIcon aria-hidden className="w-3.5 h-3.5 opacity-60" />
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
        <div className="px-4 py-4 border-t border-white/10 flex flex-col gap-3">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-3 min-w-0">
              <PersonalAvatar size="xs" dataTestId="avatar-mobile" />
              <div className="min-w-0">
                <p className="text-sm font-bold truncate max-w-[130px]">{userFullName ?? ''}</p>
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300/80">Online</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 pl-2 border-l border-white/10">
              <div className="flex items-center gap-1.5" title="Modo Offline">
                <WifiIcon aria-hidden className="w-4 h-4 text-white/70" />
                <ToggleButton
                  checked={!offlineMode}
                  onChange={(checked) => onToggleOffline(!checked)}
                  label=""
                  dataTour="offline-toggle"
                />
              </div>
              <div className="flex items-center gap-1.5" title="Tema Claro / Oscuro">
                <ThemeIcon aria-hidden className="w-4 h-4 text-white/70" />
                <ToggleButton
                  checked={theme === 'dark'}
                  onChange={toggleTheme}
                  label=""
                  dataTestId="theme-toggle-mobile"
                  dataTour="theme-toggle"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Link
              href="/main-page/configuration"
              onClick={onClose}
              className="flex items-center gap-2.5 h-10 px-3 rounded-xl text-b3 font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              data-tour="configuration-button"
            >
              <ConfigurationLogo className="w-4 h-4 opacity-80" /> <span>Configuración</span>
            </Link>
            <Link
              href="https://drsecurity.atlassian.net/servicedesk/customer/portals"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 h-10 px-3 rounded-xl text-b3 font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              data-testid="help-link"
              data-tour="sidebar-help-link"
            >
              <HelpIcon className="w-4 h-4 opacity-80" /> <span>Ayuda</span>
            </Link>
            <button
              data-testid="sidebar-mobile-logout"
              onClick={async () => {
                await logout();
                window.location.href = '/';
              }}
              className="flex items-center gap-2.5 h-10 px-3 rounded-xl text-b3 font-medium text-white/70 hover:text-white hover:bg-rose-500/20 hover:text-rose-300 w-full text-left transition-colors"
              type="button"
              data-tour="logout-button"
            >
              <LogoutIcon className="w-4 h-4 opacity-80" /> <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MobileSidebar
