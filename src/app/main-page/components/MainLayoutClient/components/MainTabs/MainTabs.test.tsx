import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Static assets
vi.mock('@/assets/icons/acciones/menu.svg', () => ({ default: () => <svg data-testid="menu" /> }));
vi.mock('@/assets/icons/Comunicacion/bell.svg', () => ({ default: () => <svg data-testid="bell" /> }));
vi.mock('@/app/components/PersonalAvatar/PersonalAvatar', () => ({ default: () => <div>Avatar</div> }));

// Next mocks
vi.mock('next/image', () => ({ default: (props: any) => <img alt={props.alt} /> }));
vi.mock('next/link', () => ({ default: (props: any) => <a href={props.href} {...props} /> }));

let mockQS = ''
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(mockQS),
}))

// Responsive hook
vi.mock('@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery', () => ({
  useIsMobile: () => false,
}))

import MainTabs from './MainTabs';

const tabs = [
  { label: 'Tab1', path: '/a' },
  { label: 'Tab2', path: '/b' },
];

describe('MainTabs', () => {
  beforeEach(() => { mockQS = '' })
  it('renders tabs', () => {
    render(<MainTabs tabs={tabs} pathname="/a" validPermissionsbyroute={() => true} />);
    expect(screen.getByText('Tab1')).toBeInTheDocument();
  });

  it('filters tabs by permissions', () => {
    render(
      <MainTabs
        tabs={[{ label: 'A', path: '/a' }, { label: 'B', path: '/b' }]}
        pathname="/a"
        validPermissionsbyroute={(p) => p === '/a'}
      />
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.queryByText('B')).toBeNull();
  });

  it('applies active class based on id presence', () => {
    mockQS = '';
    const { rerender } = render(
      <MainTabs
        tabs={[{ label: 'List', path: '/r' }, { label: 'Detail', path: '/r?id' }]}
        pathname="/r"
        validPermissionsbyroute={() => true}
      />
    );
    const list = screen.getByText('List');
    const detail = screen.getByText('Detail');
    expect(list.className).toMatch(/text-gray-100/);
    expect(detail.className).toMatch(/text-gray-70/);

    mockQS = 'id=1';
    rerender(
      <MainTabs
        tabs={[{ label: 'List', path: '/r' }, { label: 'Detail', path: '/r?id' }]}
        pathname="/r"
        validPermissionsbyroute={() => true}
      />
    );
    expect(screen.getByText('List').className).toMatch(/text-gray-70/);
    expect(screen.getByText('Detail').className).toMatch(/text-gray-100/);
  });
});
