import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Signatures from "./Signatures";
import { createSampleReport, sampleReports } from "../../../../testUtils/reportFixtures";
import { ReportsStoryProvider } from "../../../../testUtils/ReportsStoryProvider";

const meta: Meta<typeof Signatures> = {
  title: "MAINPAGE/proyects/Proyects/ProyectDetail/Reports/ReportDetails/Signatures",
  component: Signatures,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Muestra las firmas del colaborador y del cliente, reutilizando la data normalizada en el store. Complementa la vista principal indicando quién autorizó el servicio.",
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

type Story = StoryObj<typeof Signatures>;

export const Default: Story = {
  render: () => <Signatures />,
  parameters: {
    docs: {
      description: {
        story: "Presenta ambas firmas disponibles (empleado y cliente) con sus metadatos.",
      },
    },
  },
};

const missingClientSignature = createSampleReport({
  id: "REP-no-client-sign",
  clientsign: {},
});

export const OnlyEmployee: Story = {
  render: () => (
    <ReportsStoryProvider initialReport={missingClientSignature} reports={[missingClientSignature]}>
      <Signatures />
    </ReportsStoryProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: "Caso en el que sólo existe la firma del empleado: se aplican los fallback visuales para el bloque del cliente.",
      },
    },
  },
};

export const Mobile: Story = {
  render: () => <Signatures />,
  parameters: {
    viewport: { defaultViewport: "mobile2" },
    docs: {
      description: {
        story: "La disposición vertical se adapta al ancho reducido y mantiene el orden empleado → cliente.",
      },
    },
  },
};
