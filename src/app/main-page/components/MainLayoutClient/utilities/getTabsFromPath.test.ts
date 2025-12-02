import { describe, it, expect } from 'vitest';

import { getTabsFromPath } from './getTabsFromPath';

describe('getTabsFromPath utility', () => {
  it('returns tabs for home section', () => {
    const result = getTabsFromPath('/main-page/home');
    expect(result).toEqual([
      { label: 'Comunicados', path: '/main-page/home/announcements' },
      { label: 'Información Importante', path: '/main-page/home/important-information' },
    ]);
  });

  it('returns tabs for request section', () => {
    const result = getTabsFromPath('/main-page/request');
    expect(result).toEqual([]);
  });

  it('returns empty array for unknown path', () => {
    const result = getTabsFromPath('/main-page/other');
    expect(result).toEqual([]);
  });

  it('adds files tab when operations requisition list has an id', () => {
    const result = getTabsFromPath(
      '/main-page/operations/requisitions/requisitionListPage',
      '?id=123&label=Archivos',
    );

    expect(result).toEqual([
      { label: 'Requisiciones', path: '/main-page/operations/requisitions/requisitionsPage' },
      { label: 'Listado Beneficiarios', path: '/main-page/operations/requisitions/requisitionListPage' },
      { label: 'Archivos', path: '/main-page/operations/requisitions/requisitionListPage?id=123' },
    ]);
  });

  it('does not add files tab when requisition list has no id', () => {
    const result = getTabsFromPath('/main-page/operations/requisitions/requisitionListPage');

    expect(result).toEqual([
      { label: 'Requisiciones', path: '/main-page/operations/requisitions/requisitionsPage' },
      { label: 'Listado Beneficiarios', path: '/main-page/operations/requisitions/requisitionListPage' },
    ]);
  });
});
