import React from 'react';

import MainTabs from './MainTabs';
import { MainTabsProps } from './types';

export const MainTabsCatalog = (props: MainTabsProps) => (
  <div style={{ width: '100%' }}>
    <MainTabs {...props} />
  </div>
);
export default MainTabsCatalog;
