import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, beforeEach, vi } from 'vitest';

import VehicleRegistry from './page';

(globalThis as any).React = React;

const submitHandler = vi.fn();
const submitRef = { current: submitHandler };

const hookResponse = {
  title: 'Registro',
  submitLabel: 'Enviar',
  submitRef,
  formReady: false,
  formIsCompleted: false,
  setFormReady: vi.fn(),
  fields: [],
  formVersion: 0,
  syncFormValues: vi.fn(),
  formId: 'departure-form',
  responsiveLayoutMatrix: [],
  handleSubmit: vi.fn(),
  currentView: 'form' as 'form' | 'pictures',
  handleNext: vi.fn(),
  handleBack: vi.fn(),
};

vi.mock('./hooks/useVehicleRegistry', () => ({
  __esModule: true,
  default: vi.fn(() => hookResponse),
}));

vi.mock('@/app/components/DynamicForm/DynamicForm', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: () => React.createElement('div', { 'data-testid': 'dynamic-form' }, 'form'),
  };
});

vi.mock('@/app/components/FormsLayout/FormsLayout', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) =>
      React.createElement('div', { 'data-testid': 'forms-layout' }, children),
  };
});

vi.mock('@/app/components/Button/Button', () => {
  const React = require('react');
  return {
    __esModule: true,
    Button: ({ children, hideIcon: _hideIcon, ...rest }: any) =>
      React.createElement('button', { type: 'button', 'data-testid': 'toggle-button', ...rest }, children),
  };
});

vi.mock('./componentes/ImagesComponent/ImagesComponent', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: () => React.createElement('div', { 'data-testid': 'images-component' }, 'images'),
  };
});

describe('VehicleRegistry page', () => {
  beforeEach(() => {
    hookResponse.currentView = 'form';
  });

  it('renders the dynamic form view when currentView is form', () => {
    render(<VehicleRegistry />);
    expect(screen.getByTestId('forms-layout')).toBeInTheDocument();
    expect(screen.getByTestId('dynamic-form')).toBeInTheDocument();
    expect(screen.queryByTestId('images-component')).not.toBeInTheDocument();
  });

  it('renders the images component when currentView is pictures', () => {
    hookResponse.currentView = 'pictures';
    render(<VehicleRegistry />);
    expect(screen.getByTestId('images-component')).toBeInTheDocument();
    expect(screen.queryByTestId('dynamic-form')).not.toBeInTheDocument();
  });
});
