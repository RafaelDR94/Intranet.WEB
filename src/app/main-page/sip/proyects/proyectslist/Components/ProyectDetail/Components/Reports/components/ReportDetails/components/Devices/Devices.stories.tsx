import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Devices from "./Devices";
import { createSampleReport, sampleReports } from "../../../../testUtils/reportFixtures";
import { ReportsStoryProvider } from "../../../../testUtils/ReportsStoryProvider";

const meta: Meta<typeof Devices> = {
  title: "MAINPAGE/SIP/Proyects/ProyectDetail/Reports/ReportDetails/Devices",
  component: Devices,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lista los dispositivos asociados al reporte activo. Se apoya en `ReportsStoryProvider` para exponer la colección `reportDeviceView` que consume el componente interno de tabla." ,
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

type Story = StoryObj<typeof Devices>;

export const Default: Story = {
  render: () => <Devices />,
  parameters: {
    docs: {
      description: {
        story: "Renderiza la tabla con los dispositivos encontrados en `reportDeviceView` del reporte demo.",
      },
    },
  },
};

const noDevicesReport = createSampleReport({
  id: "REP-no-devices",
  reportDeviceView: [],
});

export const WithoutReportDevices: Story = {
  render: () => (
    <ReportsStoryProvider initialReport={noDevicesReport} reports={[noDevicesReport]}>
      <Devices />
    </ReportsStoryProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: "Ejemplo vacío: oculta la tabla y muestra el placeholder configurado para el módulo.",
      },
    },
  },
};

export const Mobile: Story = {
  render: () => <Devices />,
  parameters: {
    viewport: { defaultViewport: "mobile2" },
    docs: {
      description: {
        story: "La grilla se apila y habilita scroll horizontal cuando los campos exceden el ancho disponible en móviles.",
      },
    },
  },
};
