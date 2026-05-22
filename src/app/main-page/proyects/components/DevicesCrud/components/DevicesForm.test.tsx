import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import DevicesForm from './DevicesForm';

const useDevicesFormMock = vi.fn();

vi.mock('@/app/components/FormsLayout/FormsLayout', () => ({
  __esModule: true,
  default: ({
    title,
    primaryLabel,
    onPrimaryClick,
    primaryDisabled,
    secondaryLabel,
    onSecondaryClick,
    children,
  }: any) => (
    <div>
      <h1>{title}</h1>
      <button type="button" onClick={onPrimaryClick} disabled={primaryDisabled}>
        {primaryLabel}
      </button>
      <button type="button" onClick={onSecondaryClick}>
        {secondaryLabel}
      </button>
      {children}
    </div>
  ),
}));

vi.mock('@/app/components/Button/Button', () => ({
  Button: ({ children, onClick, disabled }: any) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

vi.mock('@/app/components/Input/Input', () => ({
  Input: ({ label, placeholder, value = '', onChange, dataTestId }: any) => (
    <label>
      <span>{label}</span>
      <input
        data-testid={dataTestId}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </label>
  ),
}));

vi.mock('@/app/components/Select/Select', () => ({
  Select: ({ label, placeholder }: any) => (
    <div>
      <span>{label}</span>
      <span>{placeholder}</span>
    </div>
  ),
}));

vi.mock('@/app/components/Spinner/Spinner', () => ({
  Spinner: () => <div>Spinner</div>,
}));

vi.mock('../hooks/useDevicesForm', () => ({
  useDevicesForm: (scope: string) => useDevicesFormMock(scope),
}));

const baseState = {
  title: 'Registrar dispositivo',
  primaryLabel: 'Registrar dispositivo',
  onSubmit: vi.fn(),
  onCancel: vi.fn(),
  canSubmit: true,
  submitting: false,
  loadingFormInfo: false,
  formType: 'complete' as const,
  values: {
    equipmentId: 'equipment-1',
    typeOfEquipment: '',
    brand: 'Axis',
    model: 'Q6128',
    serial: 'SN-1',
    projectId: 'project-1',
    location: 'location-1',
    status: 'Operativo',
    description: 'Azotea',
  },
  equipmentOptions: [{ label: 'Camara PTZ', value: 'equipment-1' }],
  projectOptions: [{ label: 'PRJ-1', value: 'project-1' }],
  selectedProjectId: 'project-1',
  shouldLockProjectSelection: true,
  completeDisabled: false,
  showErrors: false,
  allowInlineGenericEquipment: true,
  isInlineGenericEquipmentMode: false,
  locationOptions: [{ label: 'Azotea', value: 'location-1' }],
  statusOptions: [{ label: 'Operativo', value: 'Operativo' }],
  refactionOptions: [],
  selectedDraftRefactionIds: [],
  assignedRefactions: [],
  onChange: vi.fn(),
  onToggleProjectEquipmentMode: vi.fn(),
  onSelectDraftRefactions: vi.fn(),
  onAssignDraftRefactions: vi.fn(),
  onRemoveAssignedRefaction: vi.fn(),
  showAddRefactionForm: false,
  newRefactionValues: {
    sku: '',
    stock: '',
    name: '',
    brand: '',
    model: '',
    serialNumber: '',
    status: '',
    characteristic: '',
    provider: '',
    website: '',
    phoneNumber: '',
  },
  onChangeNewRefaction: vi.fn(),
  onSaveNewRefaction: vi.fn(),
};

describe('DevicesForm', () => {
  it('muestra selector y boton ghost sin marca y modelo cuando no hay equipo seleccionado', () => {
    useDevicesFormMock.mockReturnValue({
      ...baseState,
      values: {
        ...baseState.values,
        equipmentId: '',
        brand: '',
        model: '',
      },
    });

    render(<DevicesForm scope="project" />);

    expect(screen.getByText('Agregar equipo')).toBeInTheDocument();
    expect(screen.getByText('Equipo*')).toBeInTheDocument();
    expect(screen.getByText('Selecciona equipo')).toBeInTheDocument();
    expect(screen.queryByText('Marca*')).toBeNull();
    expect(screen.queryByText('Modelo*')).toBeNull();
    expect(screen.queryByPlaceholderText('Captura el tipo de equipo')).toBeNull();
  });

  it('muestra marca y modelo cuando ya existe un equipo seleccionado', () => {
    useDevicesFormMock.mockReturnValue(baseState);

    render(<DevicesForm scope="project" />);

    expect(screen.getByText('Agregar equipo')).toBeInTheDocument();
    expect(screen.getByText('Marca*')).toBeInTheDocument();
    expect(screen.getByText('Modelo*')).toBeInTheDocument();
  });

  it('muestra selector de proyecto cuando el proyecto no viene fijo por contexto', () => {
    useDevicesFormMock.mockReturnValue({
      ...baseState,
      shouldLockProjectSelection: false,
    });

    render(<DevicesForm scope="inventory" />);

    expect(screen.getByText('Proyecto')).toBeInTheDocument();
    expect(screen.getByText('Selecciona proyecto')).toBeInTheDocument();
  });

  it('reemplaza el selector por input editable cuando el hook entra a modo inline', () => {
    useDevicesFormMock.mockReturnValue({
      ...baseState,
      isInlineGenericEquipmentMode: true,
      values: {
        ...baseState.values,
        equipmentId: '',
        typeOfEquipment: 'NVR',
        brand: 'Hikvision',
        model: 'DS-7608',
      },
    });

    render(<DevicesForm scope="project" />);

    expect(screen.getByText('Usar equipo existente')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Captura el tipo de equipo')).toBeInTheDocument();
    expect(screen.getByText('Marca*')).toBeInTheDocument();
    expect(screen.getByText('Modelo*')).toBeInTheDocument();
    expect(screen.queryByText('Selecciona equipo')).toBeNull();
  });
});
