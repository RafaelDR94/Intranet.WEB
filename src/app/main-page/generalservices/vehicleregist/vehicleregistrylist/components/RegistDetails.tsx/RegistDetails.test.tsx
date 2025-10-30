import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import RegistDetails from './RegistDetails';

(globalThis as any).React = React;

const handleDownloadDocument = vi.fn();
const handleDownloadResponsive = vi.fn();

const hookReturn = {
  currentAssignment: { vehicleassignments_id: 'A1' },
  departureDate: '2024-01-01T08:00:00Z',
  arrivalDate: '2024-01-01T20:00:00Z',
  hasArrival: true,
  hasDeparture: true,
  canGenerate: true,
  generatingType: null as null | 'arrival' | 'departure',
  generatingResponsive: false,
  handleDownloadDocument,
  handleDownloadResponsive,
};

vi.mock('./hooks/useRegisterDetails', () => ({
  __esModule: true,
  default: vi.fn(() => hookReturn),
}));

vi.mock('@/app/components/DetailsPanelLayout/DetailsPanelLayout', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children, onClose, open, renderActions }: any) =>
      React.createElement(
        'div',
        { 'data-testid': `details-layout-${String(open)}` },
        React.createElement(
          'button',
          { type: 'button', 'data-testid': 'close-panel', onClick: onClose },
          'close'
        ),
        renderActions?.(),
        children
      ),
  };
});

vi.mock('@/app/components/ButtonsNavigation/ButtonsNavigation', () => {
  const React = require('react');
  const ButtonsNavigation = ({ children }: any) =>
    React.createElement('div', { 'data-testid': 'buttons-nav' }, children);
  ButtonsNavigation.Item = ({ id, label }: any) =>
    React.createElement(
      'div',
      { 'data-testid': `nav-item-${id}` },
      label
    );
  return {
    __esModule: true,
    default: ButtonsNavigation,
  };
});

vi.mock('./components/Information/Information', () => ({
  __esModule: true,
  default: () => <div data-testid="information-component">info</div>,
}));

vi.mock('./components/DeparturePictures/DeparturePictures', () => ({
  __esModule: true,
  default: () => <div data-testid="departure-component">departure</div>,
}));

vi.mock('./components/ArrivePictures/ArrivePictures', () => ({
  __esModule: true,
  default: () => <div data-testid="arrive-component">arrive</div>,
}));

vi.mock('./components/Signatures/Signatures', () => ({
  __esModule: true,
  default: () => <div data-testid="signatures-component">signatures</div>,
}));

vi.mock('@/app/components/Button/Button', () => {
  const React = require('react');
  return {
    __esModule: true,
    Button: ({ children, onClick, icon: _icon, hideIcon: _hideIcon }: any) =>
      React.createElement(
        'button',
        { type: 'button', 'data-testid': `action-${children}`, onClick },
        children
      ),
  };
});

describe('RegistDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hookReturn.generatingType = null;
    hookReturn.generatingResponsive = false;
  });

  it('renders navigation items and action buttons', () => {
    render(<RegistDetails open onClose={vi.fn()} />);
    expect(screen.getByTestId('buttons-nav')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-info')).toHaveTextContent('Información');
    expect(screen.getByTestId('nav-item-arrive')).toHaveTextContent('Fotografía Salida');
    expect(screen.getByTestId('nav-item-departure')).toHaveTextContent('Fotografía Llegada');
    expect(screen.getByTestId('nav-item-signature')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('action-Salida'));
    expect(handleDownloadDocument).toHaveBeenCalledWith('departure');

    fireEvent.click(screen.getByTestId('action-Llegada'));
    expect(handleDownloadDocument).toHaveBeenCalledWith('arrival');

    fireEvent.click(screen.getByTestId('action-Responsiva'));
    expect(handleDownloadResponsive).toHaveBeenCalled();
  });

  it('calls onClose when requested', () => {
    const onClose = vi.fn();
    render(<RegistDetails open onClose={onClose} />);
    fireEvent.click(screen.getByTestId('close-panel'));
    expect(onClose).toHaveBeenCalled();
  });
});
