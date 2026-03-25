import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Information from './Information';

(globalThis as any).React = React;

const originalCreateElement = document.createElement.bind(document);
let authEmployeeId = 'E1';

const useInformationReturn = {
  assignment: null as any,
  generalRows: [],
  departure: undefined,
  arrival: undefined,
  checklistDefinitions: {
    tools: { title: 'Herramientas', options: [] },
    documents: { title: 'Documentos', options: [] },
  },
};

vi.mock('./hooks/useInformation', () => ({
  __esModule: true,
  default: vi.fn(() => useInformationReturn),
  buildVehicleName: (assignment: any) => {
    const transport = assignment?.transport;
    const parts = [transport?.brand, transport?.model, transport?.UnitType];
    return parts.filter((x: any) => typeof x === 'string' && x.trim().length > 0).join(' ') || '--';
  },
}));

const useChangeDriverReturn = {
  popUpOpen: false,
  openPopUp: vi.fn(),
  closePopUp: vi.fn(),
  options: [{ label: 'Nuevo', value: '1' }],
  selected: [] as string[],
  setSelected: vi.fn(),
  canSubmit: false,
  changingDriver: false,
  handleSubmit: vi.fn(async () => undefined),
};

vi.mock('./hooks/useChangeDriver', () => ({
  __esModule: true,
  default: vi.fn(() => useChangeDriverReturn),
}));

const makeResponsive = vi.fn();
const showImage = vi.fn();

vi.mock('@/app/main-page/generalservices/vehicleregist/hooks/useVehicleDocuments', () => ({
  __esModule: true,
  default: () => ({
    makeResponsive,
  }),
}));

vi.mock('@/app/utilities/PDF/PDF', () => ({
  CreatePDF: (_data: unknown, resolve: (url: string) => void) => resolve('blob:pdf'),
}));

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({ user: { idEmployee: authEmployeeId } }),
}));

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalAlert: { showAlert: vi.fn() },
    usePrincipalLoading: { showSpinner: vi.fn(), hideSpinner: vi.fn() },
    usePrincipalImage: { showImage },
  }),
}));

vi.mock('@/app/components/CheckBoxList/CheckBoxList', () => ({
  __esModule: true,
  default: ({ title, value }: any) => (
    <div data-testid={`checkbox-${title}`}>{value.join(',')}</div>
  ),
}));

vi.mock('@/app/components/Select/Select', () => ({
  __esModule: true,
  Select: ({ label }: any) => <div data-testid={`select-${label}`} />,
}));

vi.mock('@/assets/icons/Fotos y Videos/media-image.svg', () => ({
  __esModule: true,
  default: () => <span data-testid="media-image-icon" />,
}));

vi.mock('@/app/components/InfoCards/InfoCards', () => ({
  __esModule: true,
  default: ({ cards }: any) => (
    <div data-testid="info-cards">
      {Array.isArray(cards)
        ? cards
            .flat()
            .filter((item: any) => item?.value != null && String(item.value).length > 0)
            .map((item: any, idx: number) => <span key={idx}>{String(item.value)}</span>)
        : null}
    </div>
  ),
}));

vi.mock('@/assets/icons/navegacion/nav-arrow-right.svg', () => ({
  __esModule: true,
  default: () => null,
}));

vi.mock('@/assets/icons/Docs/page.svg', () => ({
  __esModule: true,
  default: () => null,
}));

vi.mock('@/app/components/Button/Button', () => {
  const React = require('react');
  return {
    __esModule: true,
    Button: ({ children, onClick, disabled, dataTestId }: any) =>
      React.createElement(
        'button',
        {
          type: 'button',
          disabled,
          'data-testid': dataTestId ?? `btn-${children ?? ''}`,
          onClick,
        },
        children
      ),
  };
});

describe('Information component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    makeResponsive.mockReset();
    authEmployeeId = 'E1';
    useInformationReturn.assignment = null;
    useInformationReturn.generalRows = [];
    useInformationReturn.departure = undefined;
    useInformationReturn.arrival = undefined;
    useChangeDriverReturn.popUpOpen = false;
    useChangeDriverReturn.canSubmit = false;
    useChangeDriverReturn.openPopUp.mockClear();
    useChangeDriverReturn.closePopUp.mockClear();
    useChangeDriverReturn.handleSubmit.mockClear();

    document.createElement = vi.fn(((tag: string) => {
      const element = originalCreateElement(tag);
      if (tag === 'a') {
        Object.defineProperty(element, 'click', {
          configurable: true,
          value: vi.fn(),
        });
      }
      return element;
    }) as typeof document.createElement);
  });

  afterAll(() => {
    document.createElement = originalCreateElement;
  });

  it('renders placeholder when no assignment', () => {
    render(<Information />);
    expect(
      screen.getByText(/Selecciona un registro/i)
    ).toBeInTheDocument();
  });

  it('renders data when assignment available', () => {
    useInformationReturn.assignment = {
      id: 'A1',
      departure_date: '2026-03-19T10:00:00Z',
      arrival_date: '2026-03-19T11:00:00Z',
      destination: 'Oficina',
      name: 'Alice',
      transport: { plates: 'ABC-123', brand: 'Nissan', model: 'Versa', UnitType: 'Sedan' },
      vehicle_reassignment: [],
    };
    useInformationReturn.generalRows = [
      { label: 'Destino', value: 'Oficina' },
    ];
    useInformationReturn.departure = {
      mileage: '123',
      fuelLevel: '1/2',
      remarks: 'Todo bien',
      checklistValues: { tools: ['jack'], documents: ['card'] },
      raw: {},
    };
    useInformationReturn.arrival = {
      mileage: '456',
      fuelLevel: '3/4',
      remarks: 'Sin novedad',
      checklistValues: { tools: ['jack'], documents: ['card'] },
      raw: {},
    };

    render(<Information />);

    expect(screen.getByText(/Fecha Salida/i)).toBeInTheDocument();
    expect(screen.getByText(/Fecha Llegada/i)).toBeInTheDocument();
    expect(screen.getByText(/Informaci/i)).toBeInTheDocument();
    expect(screen.getByText('Historial')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('456')).toBeInTheDocument();
    expect(screen.getAllByTestId(/checkbox-/).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/Hacer cambio de conductor/i)).toBeInTheDocument();
    expect(screen.getByTestId('change-driver-open')).toBeInTheDocument();
    expect(screen.getByTestId('info-cards')).toBeInTheDocument();
  });

  it('opens change driver popup when clicking icon button', () => {
    useInformationReturn.assignment = { id: 'A1', employee_id: 'E1' };

    render(<Information />);

    fireEvent.click(screen.getByTestId('change-driver-open'));
    expect(useChangeDriverReturn.openPopUp).toHaveBeenCalled();
  });

  it('disables change driver button when current user is not driver', () => {
    authEmployeeId = 'E999';
    useInformationReturn.assignment = {
      id: 'A1',
      vehicleassignments_id: 'A1',
      employee_id: 'E1',
      name: 'Alice',
      transport: { transport_id: 'T1' },
      vehicle_reassignment: [],
    };

    render(<Information />);

    const button = screen.getByTestId('change-driver-open') as HTMLButtonElement;
    expect(button.disabled).toBe(true);

    fireEvent.click(button);
    expect(useChangeDriverReturn.openPopUp).not.toHaveBeenCalled();
  });

  it('disables change driver button when pending reassignment exists', () => {
    useInformationReturn.assignment = {
      id: 'A1',
      vehicleassignments_id: 'A1',
      employee_id: 'E1',
      name: 'Alice',
      transport: { transport_id: 'T1' },
      vehicle_reassignment: [
        {
          id: 'R1',
          status: 'Pendiente',
          date_created: '2026-03-19T11:12:35.843',
          previous_employee_name: 'Prev',
          id_new_employee: 'E2',
          new_employee_name: 'New',
        },
      ],
    };

    render(<Information />);

    const button = screen.getByTestId('change-driver-open') as HTMLButtonElement;
    expect(button.disabled).toBe(true);

    fireEvent.click(button);
    expect(useChangeDriverReturn.openPopUp).not.toHaveBeenCalled();
  });

  it('downloads responsiva when clicking icon on accepted row', async () => {
    useInformationReturn.assignment = {
      id: 'A1',
      vehicleassignments_id: 'A1',
      employee_id: 'E1',
      name: 'Alice',
      transport: { transport_id: 'T1', plates: 'ABC-123', brand: 'Nissan', model: 'Versa', UnitType: 'Sedan' },
      departure_date: '2026-03-19T10:00:00Z',
      arrival_date: '2026-03-19T11:00:00Z',
      vehicle_reassignment: [
        {
          id: 'R1',
          id_vehicle_assignment: 'A1',
          id_previous_employee: null,
          previous_employee_name: null,
          id_new_employee: 'E1',
          new_employee_name: 'Alice',
          id_status: 'S1',
          status: 'Aceptado',
          comment: null,
          date_created: '2026-03-19T10:00:00Z',
        },
      ],
    };

    makeResponsive.mockResolvedValueOnce({});

    render(<Information />);

    fireEvent.click(screen.getByRole('button', { name: /Historial/i }));

    fireEvent.click(screen.getByRole('button', { name: /Descargar responsiva/i }));

    // wait a tick
    await Promise.resolve();

    expect(makeResponsive).toHaveBeenCalledWith(
      expect.objectContaining({
        employeeId: 'E1',
        vehicleId: 'T1',
        signatureUrl: '',
      }),
    );
  });

  it('opens evidence carousel when clicking evidences button on accepted row', () => {
    useInformationReturn.assignment = {
      id: 'A1',
      vehicleassignments_id: 'A1',
      employee_id: 'E1',
      name: 'Alice',
      transport: { transport_id: 'T1' },
      vehicle_reassignment: [
        {
          id: 'R1',
          id_vehicle_assignment: 'A1',
          id_previous_employee: null,
          previous_employee_name: null,
          id_new_employee: 'E1',
          new_employee_name: 'Alice',
          id_status: 'S1',
          status: 'Aceptado',
          comment: null,
          date_created: '2026-03-19T10:00:00Z',
          front_image: 'front.png',
          back_image: 'back.png',
          right_side_image: 'right.png',
          left_side_image: 'left.png',
          circulation_card_image: 'license.png',
          signature: 'signature.png',
        },
      ],
    };

    render(<Information />);

    fireEvent.click(screen.getByRole('button', { name: /Historial/i }));
    fireEvent.click(screen.getByRole('button', { name: /Ver evidencias/i }));

    expect(showImage).toHaveBeenCalledWith(
      expect.objectContaining({
        initialIndex: 0,
        items: expect.arrayContaining([
          expect.objectContaining({ image: 'front.png' }),
          expect.objectContaining({ image: 'back.png' }),
          expect.objectContaining({ image: 'right.png' }),
          expect.objectContaining({ image: 'left.png' }),
          expect.objectContaining({ image: 'license.png' }),
          expect.objectContaining({ image: 'signature.png' }),
        ]),
      }),
    );
  });
});
