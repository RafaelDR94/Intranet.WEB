import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import EmployeeName from "./EmployeeName";
import { createSampleReport, sampleReports } from "../../../../testUtils/reportFixtures";
import { ReportsStoryProvider } from "../../../../testUtils/ReportsStoryProvider";

const meta: Meta<typeof EmployeeName> = {
  title: "MAINPAGE/proyects/Proyects/ProyectDetail/Reports/ReportDetails/EmployeeName",
  component: EmployeeName,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Encabezado compacto que muestra a la persona asignada al reporte y su puesto. Se reutiliza en varias secciones (actividades, dispositivos) para mantener contexto del responsable." ,
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

type Story = StoryObj<typeof EmployeeName>;

export const Default: Story = {
  render: () => <EmployeeName />,
  parameters: {
    docs: {
      description: {
        story: "Muestra el nombre completo, puesto y ruta de imagen del responsable definido en el reporte demo.",
      },
    },
  },
};

const fallbackPositionReport = createSampleReport({
  id: "REP-no-position",
  workposition: { ...sampleReports[0].workposition, name: "" },
});

export const WithoutWorkPosition: Story = {
  render: () => (
    <ReportsStoryProvider initialReport={fallbackPositionReport} reports={[fallbackPositionReport]}>
      <EmployeeName />
    </ReportsStoryProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: "Demuestra los fallback de texto cuando no existe puesto registrado en el backend.",
      },
    },
  },
};

export const Mobile: Story = {
  render: () => <EmployeeName />,
  parameters: {
    viewport: { defaultViewport: "mobile2" },
    docs: {
      description: {
        story: "En móviles conserva la jerarquía tipográfica pero ajusta tamaños para encajar en la cabecera responsive.",
      },
    },
  },
};
