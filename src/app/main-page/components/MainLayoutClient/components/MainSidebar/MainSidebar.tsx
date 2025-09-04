'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PersonalAvatar from '../../../../../components/PersonalAvatar/PersonalAvatar';
import { ToggleButton } from '../../../../../components/ToogleButton/ToogleButton';
import SubArrowIcon from '@/assets/icons/navegacion/long-arrow-down-right.svg';
import ArrowRightIcon from '@/assets/icons/navegacion/nav-arrow-right.svg';
import ArrowDownIcon from '@/assets/icons/navegacion/nav-arrow-down.svg';
// import WifiIcon from '@/assets/icons/Connectivity/wifi.svg';
import ThemeIcon from '@/assets/icons/System/System/darkmode.svg';
import HelpIcon from '@/assets/icons/acciones/help-circle.svg';
import LogoutIcon from '@/assets/icons/acciones/open-in-window.svg';
import LogoDr from '@/assets/images/LogosDR/DReDIT.png';
import { getShortenedName } from '../../../../../utilities/NamesUtilities/NamesUtilities';
import { sidebar, logoContainer, nav, link, subLink, footer } from './styles';
import { MainSidebarProps } from './types';

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

  return (
    <aside className={sidebar}>
      <div className={logoContainer}>
        <Image src={LogoDr} alt="DR Security Logo" width={150} height={150} />
      </div>
      <nav className={nav}>
        {routes
          .filter(route => {
            if (!route.subroutes) return validPermissionsbyroute(route.path);
            return route.subroutes.some(sub => validPermissionsbyroute(sub.path));
          })
          .map(route => {
            const Icon = route.icon;
            const isExpanded = expandedSection === route.path;
            const hasSubroutes = !!route.subroutes && route.subroutes.length > 0;
            return hasSubroutes ? (
              <div key={route.path}>
                <button
                  onClick={() => setExpandedSection(isExpanded ? null : route.path)}
                  className="w-full text-left px-3 py-2 rounded hover:bg-blue-90 flex justify-between items-center text-s2 font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <Icon />
                    <span>{route.label}</span>
                  </span>
                  {isExpanded ? <ArrowDownIcon /> : <ArrowRightIcon />}
                </button>
                {isExpanded && (
                  <div className="ml-6 space-y-1">
                    {route.subroutes
                      ?.filter(sub => validPermissionsbyroute(sub.path))
                      .map(sub => (
                        <Link key={sub.path} href={sub.path} className={subLink}>
                          <div className="flex items-center gap-2">
                            <SubArrowIcon />
                            <span>{sub.label}</span>
                          </div>
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={route.path} href={route.path} className={link}>
                <Icon />
                <span>{route.label}</span>
              </Link>
            );
          })}
      </nav>
      <div className={footer}>
        <div className="flex items-start gap-20">
          <PersonalAvatar size="xs" />
          <div className="flex flex-col gap-1 pt-1">
            {/* <div className="flex items-center gap-2">
              <WifiIcon />
              <ToggleButton
                checked={!offlineMode}
                onChange={checked => onToggleOffline(!checked)}
                label=""
              />
            </div> */}
            <div className="flex items-center gap-2">
              <ThemeIcon />
              <ToggleButton checked={theme === 'dark'} onChange={toggleTheme} label="" />
            </div>
          </div>
        </div>
        <div className="right">
          <p className="font-semibold text-s2 py-2">{getShortenedName(userFullName ?? '')}</p>
        </div>
        <div className="flex flex-col space-y-1 ">
          <Link
            href="https://drsecurity.atlassian.net/servicedesk/customer/portals"
            className="flex items-center gap-2 text-b3  font-regular hover:bg-blue-90  py-1 rounded"
          >
            <HelpIcon />
            Ayuda
          </Link>
          <button
            className="flex items-center gap-2 text-b3  font-regular hover:bg-blue-90  py-1 rounded"
            onClick={async () => {
              await logout();
              window.location.href = '/';
            }}
          >
            <LogoutIcon />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </aside>
  );
};
export default MainSidebar;
