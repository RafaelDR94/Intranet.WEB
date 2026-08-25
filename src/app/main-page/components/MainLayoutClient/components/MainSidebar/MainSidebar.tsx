"use client"
'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

import PersonalAvatar from '../../../../../components/PersonalAvatar/PersonalAvatar';
import { ToggleButton } from '../../../../../components/ToogleButton/ToogleButton';
import { getShortenedName } from '../../../../../utilities/NamesUtilities/NamesUtilities';

import { sidebar, logoContainer, nav, link, activeLink, subLink, activeSubLink, footer, profileCard, actionButton } from './styles';
import { MainSidebarProps } from './types';

import HelpIcon from '@/assets/icons/acciones/help-circle.svg';
import LogoutIcon from '@/assets/icons/acciones/open-in-window.svg';
import SubArrowIcon from '@/assets/icons/navegacion/long-arrow-down-right.svg';
import ArrowDownIcon from '@/assets/icons/navegacion/nav-arrow-down.svg';
import ArrowRightIcon from '@/assets/icons/navegacion/nav-arrow-right.svg';
import WifiIcon from '@/assets/icons/Connectivity/wifi.svg';
import ThemeIcon from '@/assets/icons/System/System/darkmode.svg';
import LogoGc from '@/assets/images/LogosCG/LogoGC.png';
import ConfigurationLogo from '@/assets/icons/System/System/settings.svg'
import { useRouter, usePathname } from 'next/navigation';

export const MainSidebar: React.FC<MainSidebarProps> = ({
  offlineMode,
  onToggleOffline,
  theme,
  toggleTheme,
  userFullName,
  logout,
  validPermissionsbyroute,
  routes,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isRouteActive = (routePath: string) => {
    if (!pathname) return false;
    return pathname === routePath || (pathname.startsWith(routePath) && routePath !== '/main-page');
  };

  return (
    <aside className={sidebar} data-testid="sidebar">
      <div className={logoContainer}>
        <Image src={LogoGc} alt="Grupo Cantabria Logo" width={140} height={140} className="object-contain filter drop-shadow" />
      </div>
      <nav className={nav} data-testid="sidebar-nav" data-tour="sidebar-nav">
        {routes
          .filter(route => {
            if (!route.subroutes) return validPermissionsbyroute(route.path);
            return route.subroutes.some(sub => validPermissionsbyroute(sub.path));
          })
          .map(route => {
            const Icon = route.icon;
            const isExpanded = expandedSection === route.path;
            const hasSubroutes = !!route.subroutes && route.subroutes.length > 0;
            const parentActive = hasSubroutes && route.subroutes?.some(sub => isRouteActive(sub.path));
            const itemActive = !hasSubroutes && isRouteActive(route.path);

            return hasSubroutes ? (
              <div key={route.path} data-testid={`side:${route.path}`} className="mb-1">
                <button
                  onClick={() => setExpandedSection(isExpanded ? null : route.path)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all duration-200 flex justify-between items-center text-s2 font-semibold ${parentActive || isExpanded ? 'bg-white/10 text-white shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    <span>{route.label}</span>
                  </span>
                  {isExpanded ? <ArrowDownIcon className="w-4 h-4 shrink-0 text-white/60" /> : <ArrowRightIcon className="w-4 h-4 shrink-0 text-white/60" />}
                </button>
                {isExpanded && (
                  <div className="ml-4 pl-2 mt-1 border-l border-white/10 space-y-1">
                    {route.subroutes
                      ?.filter(sub => validPermissionsbyroute(sub.path))
                      .map(sub => {
                        const subIsActive = isRouteActive(sub.path);
                        return (
                          <Link
                            data-testid={`side:${sub.path}`}
                            key={sub.path}
                            href={sub.path}
                            className={`${subLink} ${subIsActive ? activeSubLink : ''}`}
                          >
                            <div className="flex items-center gap-2">
                              <SubArrowIcon className="w-3.5 h-3.5 shrink-0 opacity-60" />
                              <span>{sub.label}</span>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                )}
              </div>
            ) : (
              <Link
                data-testid={`side:${route.path}`}
                key={route.path}
                href={route.path}
                className={`${link} ${itemActive ? activeLink : ''}`}
              >
                <Icon className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                <span>{route.label}</span>
              </Link>
            );
          })}
      </nav>
      <div className={footer}>
        <div className={profileCard}>
          <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
            <PersonalAvatar size="xs" dataTestId="avatar" />
            <div className="flex flex-col min-w-0 flex-1">
              <p className="font-bold text-s2 text-white truncate w-full">
                {getShortenedName(userFullName ?? '')}
              </p>
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300/80">Online</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 pl-2 border-l border-white/10 shrink-0">
            <div className="flex items-center gap-1.5" title="Modo Offline">
              <WifiIcon className="w-4 h-4 shrink-0 text-white/70" />
              <ToggleButton
                checked={!offlineMode}
                onChange={checked => onToggleOffline(!checked)}
                label=""
                dataTour="offline-toggle"
              />
            </div>
            <div className="flex items-center gap-1.5" title="Tema Claro / Oscuro">
              <ThemeIcon className="w-4 h-4 shrink-0 text-white/70" />
              <ToggleButton
                checked={theme === 'dark'}
                onChange={toggleTheme}
                label=""
                dataTestId="theme-toggle"
                dataTour="theme-toggle"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <button
            className={actionButton}
            onClick={() => { router.push('/main-page/configuration') }}
            data-testid="sidebar-logout"
            data-tour="configuration-button"
          >
            <ConfigurationLogo className="w-4 h-4 shrink-0 opacity-80" />
            <span>Configuración</span>
          </button>
          <Link
            href="https://drsecurity.atlassian.net/servicedesk/customer/portals"
            className={actionButton}
            data-tour="sidebar-help-link"
          >
            <HelpIcon className="w-4 h-4 shrink-0 opacity-80" />
            <span>Ayuda</span>
          </Link>
          <button
            className={`${actionButton} hover:bg-rose-500/20 hover:text-rose-300`}
            onClick={async () => {
              await logout();
              window.location.href = '/';
            }}
            data-testid="sidebar-logout"
            data-tour="logout-button"
          >
            <LogoutIcon className="w-4 h-4 shrink-0 opacity-80" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
export default MainSidebar;
