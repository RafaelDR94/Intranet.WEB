import React from 'react';
import { MainSidebarProps } from './types';
import MainSidebar from './MainSidebar';

export const MainSidebarCatalog = (props: MainSidebarProps) => (
  <div style={{ display: 'flex', height: '100vh' }}>
    <MainSidebar {...props} />
  </div>
);
export default MainSidebarCatalog;
