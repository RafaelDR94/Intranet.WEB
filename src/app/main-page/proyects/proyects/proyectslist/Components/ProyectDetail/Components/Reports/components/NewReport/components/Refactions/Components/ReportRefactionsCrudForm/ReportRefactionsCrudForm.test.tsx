import { render } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ReportRefactionsCrudForm from './ReportRefactionsCrudForm';

const {
  queryState,
  inventoryState,
  reportState,
  refactionsFormSpy,
  inventoryStoreMock,
  reportStoreMock,
} = vi.hoisted(() => {
  const queryState = {
    all: {} as Record<string, string | null | undefined>,
    updateQuery: vi.fn(),
  };

  const inventoryState = {
    sparePartsByProyect: [] as Array<{
      id: string;
      sku: string;
      stock: number;
      name: string;
      brand: string;
      model: string;
      serialNumber: string;
      characteristic: string;
      provider: string;
      website: string;
      phoneNumber: string;
    }>,
    fetchSparePartsByProyectId: vi.fn(),
  };

  const reportState = {
    report: {
      proyect: { id: 'PROY-1' },
      idSpareParts: [] as string[],
      refactions: [] as Array<{
        description: string;
        brand: string;
        model: string;
        serialnumber: string;
        partnumber: string;
      }>,
    } as any,
    updateRefactions: vi.fn(),
  };

  const refactionsFormSpy = vi.fn();
  const inventoryStoreMock = Object.assign(
    (selector?: any) => (selector ? selector(inventoryState) : inventoryState),
    {
      getState: () => inventoryState,
    },
  );
  const reportStoreMock = Object.assign(
    (selector?: any) => (selector ? selector(reportState) : reportState),
    {
      getState: () => reportState,
    },
  );

  return {
    queryState,
    inventoryState,
    reportState,
    refactionsFormSpy,
    inventoryStoreMock,
    reportStoreMock,
  };
});

vi.mock('@/app/hooks/useQuery/useQuery', () => ({
  __esModule: true,
  default: () => queryState,
}));

vi.mock('@/app/stores/useProyectInventoryStore/useProyectInventoryStore', () => ({
  __esModule: true,
  default: inventoryStoreMock,
}));

vi.mock('@/app/stores/useReportBuilderStore/useReportBuilderStore', () => ({
  __esModule: true,
  default: reportStoreMock,
}));

vi.mock('@/app/main-page/proyects/components/RefactionsCrud/components/RefactionsForm', () => ({
  __esModule: true,
  default: (props: any) => {
    refactionsFormSpy(props);
    return <div data-testid="project-refactions-form" />;
  },
}));

describe('ReportRefactionsCrudForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryState.all = {};
    inventoryState.sparePartsByProyect = [];
    reportState.report = {
      proyect: { id: 'PROY-1' },
      idSpareParts: [],
      refactions: [],
    } as any;
  });

  it('traduce un alta a query params CRUD y monta el formulario reutilizable', () => {
    render(<ReportRefactionsCrudForm selectedRowId="__new__" onClose={vi.fn()} />);

    expect(queryState.updateQuery).toHaveBeenCalledWith({
      crudView: 'form',
      crudMode: 'create',
      crudItemId: null,
      onlyproveedor: null,
    });
    expect(refactionsFormSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        scope: 'project',
      }),
    );
  });

  it('traduce una edicion a query params CRUD con el id seleccionado', () => {
    render(<ReportRefactionsCrudForm selectedRowId="SP-22" onClose={vi.fn()} />);

    expect(queryState.updateQuery).toHaveBeenCalledWith({
      crudView: 'form',
      crudMode: 'edit',
      crudItemId: 'SP-22',
      onlyproveedor: null,
    });
  });

  it('agrega idSpareParts y refactions al cerrar un alta creada desde el reporte', async () => {
    const onClose = vi.fn();
    inventoryState.sparePartsByProyect = [
      {
        id: 'SP-1',
        sku: 'PN-1',
        stock: 2,
        name: 'Base existente',
        brand: 'Base',
        model: 'M1',
        serialNumber: 'SER-1',
        characteristic: '',
        provider: '',
        website: '',
        phoneNumber: '',
      },
    ];
    inventoryState.fetchSparePartsByProyectId.mockImplementation(async () => {
      inventoryState.sparePartsByProyect = [
        ...inventoryState.sparePartsByProyect,
        {
          id: 'SP-2',
          sku: 'PN-2',
          stock: 1,
          name: 'Nueva refaccion',
          brand: 'Bosch',
          model: 'M2',
          serialNumber: 'SER-2',
          characteristic: '',
          provider: '',
          website: '',
          phoneNumber: '',
        },
      ];
      return inventoryState.sparePartsByProyect;
    });
    reportState.report = {
      proyect: { id: 'PROY-1' },
      idSpareParts: ['SP-1'],
      refactions: [
        {
          description: 'Base existente',
          brand: 'Base',
          model: 'M1',
          serialnumber: 'SER-1',
          partnumber: 'PN-1',
        },
      ],
    } as any;
    queryState.all = {
      crudView: 'form',
      crudMode: 'create',
    };

    const { rerender } = render(
      <ReportRefactionsCrudForm selectedRowId="__new__" onClose={onClose} />,
    );

    queryState.all = {
      crudView: null,
      crudMode: null,
      crudItemId: null,
    };

    rerender(<ReportRefactionsCrudForm selectedRowId="__new__" onClose={onClose} />);

    await Promise.resolve();
    await Promise.resolve();

    expect(reportState.updateRefactions).toHaveBeenCalledWith(
      [
        {
          description: 'Base existente',
          brand: 'Base',
          model: 'M1',
          serialnumber: 'SER-1',
          partnumber: 'PN-1',
        },
        {
          description: 'Nueva refaccion',
          brand: 'Bosch',
          model: 'M2',
          serialnumber: 'SER-2',
          partnumber: 'PN-2',
        },
      ],
      ['SP-1', 'SP-2'],
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('actualiza solo el snapshot textual al cerrar una edicion', async () => {
    const onClose = vi.fn();
    inventoryState.sparePartsByProyect = [
      {
        id: 'SP-22',
        sku: 'PN-22',
        stock: 1,
        name: 'Refaccion editada',
        brand: 'Makita',
        model: 'MK-22',
        serialNumber: 'SER-22',
        characteristic: '',
        provider: '',
        website: '',
        phoneNumber: '',
      },
    ];
    inventoryState.fetchSparePartsByProyectId.mockResolvedValue(inventoryState.sparePartsByProyect);
    reportState.report = {
      proyect: { id: 'PROY-1' },
      idSpareParts: ['SP-22'],
      refactions: [
        {
          description: 'Refaccion anterior',
          brand: 'Makita',
          model: 'MK-20',
          serialnumber: 'SER-20',
          partnumber: 'PN-20',
        },
      ],
    } as any;
    queryState.all = {
      crudView: 'form',
      crudMode: 'edit',
      crudItemId: 'SP-22',
    };

    const { rerender } = render(
      <ReportRefactionsCrudForm selectedRowId="SP-22" onClose={onClose} />,
    );

    queryState.all = {
      crudView: null,
      crudMode: null,
      crudItemId: null,
    };

    rerender(<ReportRefactionsCrudForm selectedRowId="SP-22" onClose={onClose} />);

    await Promise.resolve();
    await Promise.resolve();

    expect(reportState.updateRefactions).toHaveBeenCalledWith(
      [
        {
          description: 'Refaccion editada',
          brand: 'Makita',
          model: 'MK-22',
          serialnumber: 'SER-22',
          partnumber: 'PN-22',
        },
      ],
      ['SP-22'],
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
