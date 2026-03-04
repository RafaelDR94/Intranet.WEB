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
        path: '/main-page/operations/requisitions/requisitionListPage?id=123&label=Archivos&requisitionsLabel=Archivos',
      },
    ]);
  });

  it('adds detail tab when operations requisition list has an id without label', () => {
    const result = getTabsFromPath(
      '/main-page/operations/requisitions/requisitionListPage',
      '?id=123',
    );

    expect(result).toEqual([
      { label: 'Requisiciones', path: '/main-page/operations/requisitions/requisitionsPage' },
      { label: 'Listado Beneficiarios', path: '/main-page/operations/requisitions/requisitionListPage' },
      {
        label: 'Detalle Requisición',
        path: '/main-page/operations/requisitions/requisitionListPage?id=123&label=Detalle+Requisici%C3%B3n&view=detail',
      },
    ]);
  });

  it('adds billable files tab when personal requisitions detail includes an id and billable view', () => {
    const result = getTabsFromPath(
      '/main-page/accounting/personalInvoices/requisitions',
      '?id=123&label=Detalle%20Requisici%C3%B3n&view=billablefiles',
    );

    expect(result).toEqual([
      {
        label: 'Detalle Requisición',
        path: '/main-page/accounting/personalInvoices/requisitions?id=123&label=Detalle+Requisici%C3%B3n',
      },
      {
        label: 'Carga de Archivos Facturables',
        path: '/main-page/accounting/personalInvoices/requisitions?id=123&label=Detalle+Requisici%C3%B3n&view=billablefiles',
      },
    ]);
  });

  it('does not add billable files tab if view is not billablefiles', () => {
    const result = getTabsFromPath(
      '/main-page/accounting/personalInvoices/requisitions',
      '?id=123&label=Detalle%20Requisici%C3%B3n',
    );

    expect(result).toEqual([
      {
        label: 'Detalle Requisición',
        path: '/main-page/accounting/personalInvoices/requisitions?id=123&label=Detalle+Requisici%C3%B3n',
      },
    ]);
  });

  it('adds requisition detail tab when navigating to billable files with requisition context', () => {
    const result = getTabsFromPath(
      '/main-page/accounting/billablefiles/billablefiles',
      '?id=456&label=Requisici%C3%B3n%20Juan',
    );

    expect(result).toEqual([
      {
        label: 'Carga de Archivos Facturables',
        path: '/main-page/accounting/billablefiles/billablefiles',
      },
      {
        label: 'Requisición Juan',
        path: '/main-page/accounting/personalInvoices/requisitions?id=456&label=Requisici%C3%B3n+Juan',
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
      path: '/main-page/operations/requisitions/requisitionListPage?id=777&label=Archivos+Bruno&requisitionsLabel=Archivos+Bruno',
    });
  });

  it('only keeps the first name in person-based labels', () => {
    const result = getTabsFromPath(
      '/main-page/operations/requisitions/requisitionListPage',
      '?id=888&label=Requisiciones%20Bruno%20Mendoza',
    );

    expect(result[2]).toEqual({
      label: 'Requisiciones Bruno',
      path: '/main-page/operations/requisitions/requisitionListPage?id=888&label=Requisiciones+Bruno&requisitionsLabel=Requisiciones+Bruno',
    });
  });

  it('does not add files tab when requisition list has no id', () => {
    const result = getTabsFromPath('/main-page/operations/requisitions/requisitionListPage');

    expect(result).toEqual([
      { label: 'Requisiciones', path: '/main-page/operations/requisitions/requisitionsPage' },
      { label: 'Listado Beneficiarios', path: '/main-page/operations/requisitions/requisitionListPage' },
    ]);
  });

  it('adds requisitions and detail tabs when viewing requisition detail', () => {
    const result = getTabsFromPath(
      '/main-page/operations/requisitions/requisitionListPage',
      '?id=555&idEmployee=777&label=Detalle%20Requisici%C3%B3n&requisitionsLabel=Requisiciones%20Bruno%20Mendoza&view=detail',
    );

    expect(result).toEqual([
      { label: 'Requisiciones', path: '/main-page/operations/requisitions/requisitionsPage' },
      { label: 'Listado Beneficiarios', path: '/main-page/operations/requisitions/requisitionListPage' },
      {
        label: 'Requisiciones Bruno',
        path: '/main-page/operations/requisitions/requisitionListPage?id=777&label=Requisiciones+Bruno&idEmployee=777&requisitionsLabel=Requisiciones+Bruno',
      },
      {
        label: 'Detalle Requisición',
        path: '/main-page/operations/requisitions/requisitionListPage?id=555&label=Detalle+Requisici%C3%B3n&view=detail&idEmployee=777&requisitionsLabel=Requisiciones+Bruno',
      },
    ]);
  });
});
