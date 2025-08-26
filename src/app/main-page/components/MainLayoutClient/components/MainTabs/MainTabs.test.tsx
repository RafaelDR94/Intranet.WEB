import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/assets/icons/acciones/menu.svg', () => ({ default: () => <svg data-testid="menu" /> }));
vi.mock('@/assets/icons/Comunicacion/bell.svg', () => ({ default: () => <svg data-testid="bell" /> }));
vi.mock('@/app/components/PersonalAvatar/PersonalAvatar', () => ({ default: () => <div>Avatar</div> }));
import MainTabs from './MainTabs';

const tabs = [
  { label: 'Tab1', path: '/a' },
  { label: 'Tab2', path: '/b' },
];

describe('MainTabs', () => {
  it('renders tabs', () => {
    render(<MainTabs tabs={tabs} pathname="/a" validPermissionsbyroute={() => true} />);
    expect(screen.getByText('Tab1')).toBeInTheDocument();
  });
});
