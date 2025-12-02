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
      {
        label: 'Archivos',
        path: '/main-page/operations/requisitions/requisitionListPage?id=123&label=Archivos',
      },
    ]);
  });

  it('keeps provided label in operations requisition file tab path', () => {
    const result = getTabsFromPath(
      '/main-page/operations/requisitions/requisitionListPage',
      '?id=777&label=Archivos%20Bruno',
    );

    expect(result[2]).toEqual({
      label: 'Archivos Bruno',
      path: '/main-page/operations/requisitions/requisitionListPage?id=777&label=Archivos+Bruno',
    });
  });

  it('only keeps the first name in person-based labels', () => {
    const result = getTabsFromPath(
      '/main-page/operations/requisitions/requisitionListPage',
      '?id=888&label=Requisiciones%20Bruno%20Mendoza',
    );

    expect(result[2]).toEqual({
      label: 'Requisiciones Bruno',
      path: '/main-page/operations/requisitions/requisitionListPage?id=888&label=Requisiciones+Bruno',
    });
  });

  it('does not add files tab when requisition list has no id', () => {
    const result = getTabsFromPath('/main-page/operations/requisitions/requisitionListPage');

    expect(result).toEqual([
      { label: 'Requisiciones', path: '/main-page/operations/requisitions/requisitionsPage' },
      { label: 'Listado Beneficiarios', path: '/main-page/operations/requisitions/requisitionListPage' },
    ]);
  });
});
