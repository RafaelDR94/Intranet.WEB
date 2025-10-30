import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Refactions from "./Refactions";
import { createSampleReport, sampleReports } from "../../../../testUtils/reportFixtures";
import { ReportsStoryProvider } from "../../../../testUtils/ReportsStoryProvider";

const meta: Meta<typeof Refactions> = {
  title: "MAINPAGE/SIP/Proyects/ProyectDetail/Reports/ReportDetails/Refactions",
  component: Refactions,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lista las refacciones consumidas en el servicio, agrupando marca, modelo y números de parte. Utiliza el estado de `useReportsStore` y comparte el mismo contenedor que los demás tabs del detalle.",
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

type Story = StoryObj<typeof Refactions>;

export const Default: Story = {
  render: () => <Refactions />,
  parameters: {
    docs: {
      description: {
        story: "Tabla con un registro de refacción cuando el reporte trae inventario asociado.",
      },
    },
  },
};

export const Compact: Story = {
  render: () => (
    <div className="max-w-xl">
      <Refactions />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Ejemplo en un contenedor angosto, útil para validar cortes responsivos en dashboards embebidos.",
      },
    },
  },
};

const noRefactionsReport = createSampleReport({
  id: "REP-no-refactions",
  refactions: [],
});

export const Empty: Story = {
  render: () => (
    <ReportsStoryProvider initialReport={noRefactionsReport} reports={[noRefactionsReport]}>
      <Refactions />
    </ReportsStoryProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: "Renderiza el mensaje sin datos cuando el reporte no registra refacciones.",
      },
    },
  },
};

export const Mobile: Story = {
  render: () => <Refactions />,
  parameters: {
    viewport: { defaultViewport: "mobile2" },
    docs: {
      description: {
        story: "Confirma que la tabla se vuelve deslizable horizontalmente y mantiene legibilidad en pantallas móviles.",
      },
    },
  },
};
