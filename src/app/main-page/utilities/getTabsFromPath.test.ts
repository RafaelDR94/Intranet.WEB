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
    expect(result).toEqual([
      { label: 'Facturación', path: '/main-page/request/invoices' },
    ]);
  });

  it('returns empty array for unknown path', () => {
    const result = getTabsFromPath('/main-page/other');
    expect(result).toEqual([]);
  });
});
