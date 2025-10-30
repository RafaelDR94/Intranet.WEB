import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PathnameContext, SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";

import ReportsTable from "./ReportsTable";
import { sampleReports } from "./testUtils/reportFixtures";
import { ReportsStoryProvider } from "./testUtils/ReportsStoryProvider";

import { PrincipalProvider } from "@/app/context/PrincipalContext/PrincipalContext";

type AppRouterInstance = React.ContextType<typeof AppRouterContext>;

const searchParams = new URLSearchParams("id=PROY-1");

const mockRouter: AppRouterInstance = {
  back: () => action("router.back")(),
  forward: () => action("router.forward")(),
  push: (href: string) => action("router.push")(href),
  replace: (href: string) => action("router.replace")(href),
  refresh: () => action("router.refresh")(),
  prefetch: async (href: string) => action("router.prefetch")(href),
};

const meta: Meta<typeof ReportsTable> = {
  title: "MAINPAGE/SIP/Proyects/ProyectDetail/Reports/ReportsTable",
  component: ReportsTable,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <AppRouterContext.Provider value={mockRouter}>
        <PathnameContext.Provider value="/main-page/sip/proyects/proyectslist">
          <SearchParamsContext.Provider value={searchParams}>
            <PrincipalProvider>
              <Story />
            </PrincipalProvider>
          </SearchParamsContext.Provider>
        </PathnameContext.Provider>
      </AppRouterContext.Provider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ReportsTable>;

export const Default: Story = {
  render: () => (
    <ReportsStoryProvider>
      <ReportsTable />
    </ReportsStoryProvider>
  ),
};

export const WithOpenDetail: Story = {
  render: () => (
    <ReportsStoryProvider initialReport={sampleReports[0]}>
      <ReportsTable />
    </ReportsStoryProvider>
  ),
};
