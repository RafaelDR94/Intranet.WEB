import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
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
