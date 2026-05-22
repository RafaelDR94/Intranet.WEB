import { render } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ReportDevicesCrudForm from './ReportDevicesCrudForm';

const queryState = {
  all: {} as Record<string, string | null | undefined>,
  updateQuery: vi.fn(),
};

const devicesFormSpy = vi.fn();

vi.mock('@/app/hooks/useQuery/useQuery', () => ({
  __esModule: true,
  default: () => queryState,
}));

vi.mock('@/app/main-page/proyects/components/DevicesCrud/components/DevicesForm', () => ({
  __esModule: true,
  default: (props: any) => {
    devicesFormSpy(props);
    return <div data-testid="project-devices-form" />;
  },
}));

describe('ReportDevicesCrudForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryState.all = {};
  });

  it('traduce un alta a query params CRUD y monta el formulario reutilizable', () => {
    render(<ReportDevicesCrudForm selectedRowId="__new__" onClose={vi.fn()} />);

    expect(queryState.updateQuery).toHaveBeenCalledWith({
      crudView: 'form',
      crudMode: 'create',
      crudItemId: null,
      type: 'complete',
    });
    expect(devicesFormSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        scope: 'project',
      }),
    );
  });

  it('traduce una edicion a query params CRUD con el id seleccionado', () => {
    render(<ReportDevicesCrudForm selectedRowId="DEV-22" onClose={vi.fn()} />);

    expect(queryState.updateQuery).toHaveBeenCalledWith({
      crudView: 'form',
      crudMode: 'edit',
      crudItemId: 'DEV-22',
      type: 'complete',
    });
  });

  it('cierra el flujo local cuando el formulario reutilizable limpia crudView', () => {
    const onClose = vi.fn();
    queryState.all = {
      crudView: 'form',
      crudMode: 'edit',
      crudItemId: 'DEV-22',
      type: 'complete',
    };

    const { rerender } = render(
      <ReportDevicesCrudForm selectedRowId="DEV-22" onClose={onClose} />,
    );

    queryState.all = {
      crudView: null,
      crudMode: null,
      crudItemId: null,
      type: 'complete',
    };

    rerender(<ReportDevicesCrudForm selectedRowId="DEV-22" onClose={onClose} />);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
