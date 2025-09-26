import React from 'react';

import MainSidebar from './MainSidebar';
import { MainSidebarProps } from './types';

export const MainSidebarCatalog = (props: MainSidebarProps) => (
  <div style={{ display: 'flex', height: '100vh' }}>
    <MainSidebar {...props} />
  </div>
);
export default MainSidebarCatalog;
