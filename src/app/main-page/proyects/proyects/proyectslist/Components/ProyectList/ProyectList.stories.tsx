import React, { useEffect } from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { PrincipalProvider } from '@/app/context/PrincipalContext/PrincipalContext';
import { useProyectsStore } from '@/app/stores/useProyectsStore/useProyectsStore';
import type { Proyect } from '@/app/mappings/proyects/proyects.types';

import ProyectList from './ProyectList';

type AppRouterInstance = React.ContextType<typeof AppRouterContext>;

const sampleDepartment = {
  department_id: 'dep-1',
  name: 'Operaciones',
  enterprise_id: 'ent-1',
  enterprice_name: 'DR Security',
};

const samplePosition = {
  workposition_id: 'wp-1',
  name: 'Supervisor',
};

const createEmployee = (id: string, fullname: string) => ({
  employee_id: id,
  employee_number: "EMP-",
  firstname: fullname.split(' ')[0] ?? fullname,
  secondname: '',
  lastname: fullname.split(' ')[1] ?? 'Apellido',
  motherlast_name: null,
  gender: 'O',
  email: "${id}@example.com",
  phone_number: '555-0101',
  extension: '100',
  image_url: '',
  manager_id: 'mgr-1',
  department: sampleDepartment,
  workposition: samplePosition,
  user: null,
  is_active: true,
  fullname,
});

const SAMPLE_PROJECTS: Proyect[] = [
  {
    id: 'PROY-001',
    name: 'Rehabilitacion Puerto Altamar',
    proyectKey: 'ALTM-2025',
    client: 'Semar',
    manager: createEmployee('emp-1', 'Laura Campos'),
    collaborators: [createEmployee('emp-2', 'Diego Torres'), createEmployee('emp-3', 'Ana Ruiz')],
  } as Proyect,
  {
    id: 'PROY-002',
    name: 'Instalacion CCTV Planta Norte',
    proyectKey: 'CCTV-NORTE',
    client: 'Global Manufacturing',
    manager: createEmployee('emp-4', 'Jorge Perez'),
    collaborators: [createEmployee('emp-5', 'Maria Diaz')],
  } as Proyect,
];

const StoreSetup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    useProyectsStore.setState((state:any) => ({
      ...state,
      proyects: SAMPLE_PROJECTS,
      loading: false,
      removing: false,
      successDelete: false,
      error: undefined,
      fetchProyects: async () => SAMPLE_PROJECTS,
      deleteProyect: async (id: string) => {
        action('deleteProyect')(id);
      },
      setCurrentProyect: (proyect) => action('setCurrentProyect')(proyect),
      resetFlags: () => {},
    }));

    return () => {
      useProyectsStore.getState().reset();
    };
  }, []);

  return <>{children}</>;
};

const mockRouter: AppRouterInstance = {
  back: () => action('router.back')(),
  forward: () => action('router.forward')(),
  push: (href: string) => action('router.push')(href),
  replace: (href: string) => action('router.replace')(href),
  prefetch: async (href: string) => action('router.prefetch')(href),
  refresh: () => action('router.refresh')(),
};

const meta: Meta<typeof ProyectList> = {
  title: 'MAINPAGE/proyects/Proyects/ProyectList',
  component: ProyectList,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <AppRouterContext.Provider value={mockRouter}>
        <PrincipalProvider>
          <StoreSetup>
            <Story />
          </StoreSetup>
        </PrincipalProvider>
      </AppRouterContext.Provider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ProyectList>;

export const Default: Story = {
  render: () => <ProyectList />,
};
