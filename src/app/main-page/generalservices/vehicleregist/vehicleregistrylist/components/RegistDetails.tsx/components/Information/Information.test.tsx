import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Information from './Information';

(globalThis as any).React = React;

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
}));

vi.mock('@/app/components/CheckBoxList/CheckBoxList', () => ({
  __esModule: true,
  default: ({ title, value }: any) => (
    <div data-testid={`checkbox-${title}`}>{value.join(',')}</div>
  ),
}));

describe('Information component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useInformationReturn.assignment = null;
    useInformationReturn.generalRows = [];
    useInformationReturn.departure = undefined;
    useInformationReturn.arrival = undefined;
  });

  it('renders placeholder when no assignment', () => {
    render(<Information />);
    expect(
      screen.getByText(/Selecciona un registro/i)
    ).toBeInTheDocument();
  });

  it('renders data when assignment available', () => {
    useInformationReturn.assignment = { id: 'A1' };
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

    expect(screen.getByText(/Destino/i)).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('456')).toBeInTheDocument();
    expect(screen.getAllByTestId(/checkbox-/).length).toBeGreaterThanOrEqual(2);
  });
});
