import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import React from "react";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PathnameContext, SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";

import ReportDetails from "./ReportDetails";
import { sampleReports } from "../../testUtils/reportFixtures";
import { ReportsStoryProvider } from "../../testUtils/ReportsStoryProvider";

import { PrincipalProvider } from "@/app/context/PrincipalContext/PrincipalContext";

type AppRouterInstance = React.ContextType<typeof AppRouterContext>;

const buildDecorator = (reportId: string) => {
  const mockRouter: AppRouterInstance = {
    back: () => action("router.back")(),
    forward: () => action("router.forward")(),
    push: (href: string) => action("router.push")(href),
    replace: (href: string) => action("router.replace")(href),
    refresh: () => action("router.refresh")(),
    prefetch: async (href: string) => action("router.prefetch")(href),
  };

  return (Story: any) => {
    const searchParams = new URLSearchParams(`reportId=${reportId}`);
    return (
      <AppRouterContext.Provider value={mockRouter}>
        <PathnameContext.Provider value="/main-page/proyects/proyects/proyectslist">
          <SearchParamsContext.Provider value={searchParams}>
            <PrincipalProvider>
              <ReportsStoryProvider initialReport={sampleReports[0]}>
                <Story />
              </ReportsStoryProvider>
            </PrincipalProvider>
          </SearchParamsContext.Provider>
        </PathnameContext.Provider>
      </AppRouterContext.Provider>
    );
  };
};

const meta: Meta<typeof ReportDetails> = {
  title: "MAINPAGE/proyects/Proyects/ProyectDetail/Reports/ReportDetails",
  component: ReportDetails,
  tags: ["autodocs"],
  decorators: [buildDecorator(sampleReports[0].id)],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Vista principal del detalle de un reporte. Orquesta las secciones (información general, actividades, dispositivos, refacciones, mapas y firmas) usando `ButtonsNavigation`. Cada pestaña monta su subcomponente y se habilita solamente cuando `useReportDetails` detecta datos disponibles en el store." +
          "\n\nLas historias usan `ReportsStoryProvider` para simular el estado de `useReportsStore` y el `PrincipalProvider` para habilitar alertas/contextos como en la aplicación real.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ReportDetails>;

export const Default: Story = {
  render: () => <ReportDetails />,
  parameters: {
    docs: {
      description: {
        story:
          "Escenario base con un reporte completo: las pestañas se muestran según la data (actividades, dispositivos, refacciones, mapas y firmas).",
      },
    },
  },
};

export const Mobile: Story = {
  render: () => <ReportDetails />,
  parameters: {
    viewport: { defaultViewport: "mobile2" },
    docs: {
      description: {
        story:
          "Visualización en un viewport móvil. `ButtonsNavigation` conserva el scroll horizontal y cada sección se apila manteniendo la experiencia táctil del módulo.",
      },
    },
  },
};
