import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Activities from "./Activities";
import { createSampleReport, sampleReports } from "../../../../testUtils/reportFixtures";
import { ReportsStoryProvider } from "../../../../testUtils/ReportsStoryProvider";

const meta: Meta<typeof Activities> = {
  title: "MAINPAGE/SIP/Proyects/ProyectDetail/Reports/ReportDetails/Activities",
  component: Activities,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Combina `EmployeeName` con `ActivitiesViewer` para desplegar la bitácora del reporte activo. El hook `useActivities` calcula los ítems a partir de `useReportsStore`, manteniendo coherencia con el estado usado en la vista principal.",
      },
    },
  },
  decorators: [
    (Story) => (
      <ReportsStoryProvider initialReport={sampleReports[0]}>
        <Story />
      </ReportsStoryProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Activities>;

export const Default: Story = {
  render: () => <Activities />,
  parameters: {
    docs: {
      description: {
        story: "Muestra la cabecera con el colaborador responsable y el carrusel de actividades del reporte demo.",
      },
    },
  },
};

const emptyActivitiesReport = createSampleReport({
  id: "REP-empty-activities",
  activities: [],
});

export const Empty: Story = {
  render: () => (
    <ReportsStoryProvider initialReport={emptyActivitiesReport} reports={[emptyActivitiesReport]}>
      <Activities />
    </ReportsStoryProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: "Estado sin actividades: el visor queda vacío pero conserva la capa de cabecera y layout.",
      },
    },
  },
};

export const Mobile: Story = {
  render: () => <Activities />,
  parameters: {
    viewport: { defaultViewport: "mobile2" },
    docs: {
      description: {
        story: "Vista móvil: `ActivitiesViewer` reduce columnas y habilita el carrusel táctil previsto para el módulo.",
      },
    },
  },
};
