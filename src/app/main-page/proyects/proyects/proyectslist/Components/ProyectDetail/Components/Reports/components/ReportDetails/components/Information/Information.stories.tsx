import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Information from "./Information";
import { createSampleReport, sampleReports } from "../../../../testUtils/reportFixtures";
import { ReportsStoryProvider } from "../../../../testUtils/ReportsStoryProvider";

const meta: Meta<typeof Information> = {
  title: "MAINPAGE/proyects/Proyects/ProyectDetail/Reports/ReportDetails/Information",
  component: Information,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Sección resumen que presenta metadatos clave del reporte (tipo, categoría, ticket, diagnósticos y soluciones) y enlaza con los mapas disponibles. Depende de `useReportsStore` para mostrar sólo la información habilitada por el modelo." ,
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

type Story = StoryObj<typeof Information>;

export const Default: Story = {
  render: () => <Information />,
  parameters: {
    docs: {
      description: {
        story: "Muestra todos los campos habilitados del reporte demo, incluyendo diagnóstico y solución.",
      },
    },
  },
};

const minimalReport = createSampleReport({
  id: "REP-minimal",
  model: {
    maps: false,
    diagnostic: false,
    solution: false,
    refactions: false,
    clientsign: true,
    ticket: true,
  },
  diagnostic: "",
  solution: "",
});

export const Minimal: Story = {
  render: () => (
    <ReportsStoryProvider initialReport={minimalReport} reports={[minimalReport]}>
      <Information />
    </ReportsStoryProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: "Recorta la información al mínimo cuando el modelo del reporte deshabilita secciones opcionales.",
      },
    },
  },
};

export const Mobile: Story = {
  render: () => <Information />,
  parameters: {
    viewport: { defaultViewport: "mobile2" },
    docs: {
      description: {
        story: "Distribuye el layout en una sola columna y mantiene la jerarquía de títulos en pantallas pequeñas.",
      },
    },
  },
};
