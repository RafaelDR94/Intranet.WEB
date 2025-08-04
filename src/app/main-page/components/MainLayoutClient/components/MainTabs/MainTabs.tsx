'use client';
import React from 'react';
import Link from 'next/link';
import { container, tabsWrapper } from './styles';
import { MainTabsProps } from './types';

export const MainTabs: React.FC<MainTabsProps> = ({ tabs, pathname, validPermissionsbyroute }) => {
  const clean = (v: string) => v.replaceAll('/', '');
  const isActive = (path: string) => clean(pathname) === clean(path);
  const filtered = tabs.filter(tab => validPermissionsbyroute(tab.path));

  if (filtered.length === 0) return null;

  return (
    <>
      <nav className={container}>
        <div className={tabsWrapper}>
          {filtered.map((tab, index) => (
            <React.Fragment key={tab.path}>
              {index > 0 && <div className="h-4 border-l border-gray-20 mx-3" />}
              <Link
                href={tab.path}
                className={`transition-colors ${isActive(tab.path) ? 'text-gray-100' : 'text-gray-70 hover:text-gray-80'}`}
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
