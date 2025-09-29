import { test, expect } from "@playwright/test";

import { fastLogin } from "../../helpers/login-helpers";
import { initialTest } from "../../helpers/initial-helpers";

const email = process.env.E2E_USER_EMAIL ?? "katherine.negrete@drsecurity.net";
const password = process.env.E2E_USER_PASSWORD ?? "123qwe";

const pettyCashVouchers = [
  {
    id: "pc-rosa",
    status: "Validado",
    employeename: "Katherine Negrete",
    voucher_type: "Vale Rosa",
    application_date: "2024-05-10T00:00:00.000Z",
    concept: "Taxi aeropuerto",
    amount: 1450.75,
    comments: "Traslado al aeropuerto",
    project: {
      id: "proj-1",
      name: "Proyecto Norte",
      proyectkey: "PN-01",
      client: "Cliente Uno",
    },
    petty_cash_funds: {
      id: "fund-1",
      year_month: "2024-05",
      assigned_amount: 5000,
      verified_amount: 1200,
      cash_on_hand: 800,
      unverified_amount: 0,
      pending_verification: 0,
      available_amount: 3800,
      date_created: "2024-05-01",
    },
    xml: "/files/pc-rosa.xml",
    pdf: "/files/pc-rosa.pdf",
    uuid: "uuid-pc-rosa",
    subtotal: 1200,
    iva: 250.75,
    total: 1450.75,
  },
  {
    id: "pc-azul",
    status: "En Proceso",
    employeename: "Katherine Negrete",
    voucher_type: "Vale Azul",
    application_date: "2024-04-04T00:00:00.000Z",
    concept: "Hospedaje corporativo",
    amount: 2850,
    comments: "Estancia Monterrey",
    project: {
      id: "proj-2",
      name: "Proyecto Sur",
      proyectkey: "PS-07",
      client: "Cliente Dos",
    },
    petty_cash_funds: {
      id: "fund-2",
      year_month: "2024-04",
      assigned_amount: 7500,
      verified_amount: 3200,
      cash_on_hand: 1800,
      unverified_amount: 200,
      pending_verification: 0,
      available_amount: 4300,
      date_created: "2024-04-01",
    },
    xml: "/files/pc-azul.xml",
    pdf: "/files/pc-azul.pdf",
    uuid: "uuid-pc-azul",
    subtotal: 2456,
    iva: 394,
    total: 2850,
  },
] as const;

const billingHistoryRows = [
  {
    id: "hist-1",
    billing_image_id: "img-1",
    billingdocument_id: "doc-1",
    project: {
      id: "proj-1",
      name: "Proyecto Norte",
      proyectKey: "PN-01",
      client: "Cliente Uno",
      collaborators: [],
      manager: null,
    },
    requisitionkey: "REQ-001",
    status: "valido",
    xml: "/files/hist-1.xml",
    pdf: "/files/hist-1.pdf",
    image: "/files/hist-1.png",
    comments: "Documento validado",
    dateCreate: "2024-05-01T00:00:00.000Z",
    certificationDate: "2024-05-02T00:00:00.000Z",
    uuid: "uuid-hist-1",
    description: {
      id: "desc-1",
      name: "Factura hospedaje",
    },
    category: {
      id: "cat-1",
      name: "Caja chica",
    },
    numpersons: 1,
    numnights: 2,
  },
];

test.describe("Petty Cash module", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      indexedDB.deleteDatabase("LoginDatabase");
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test("muestra historial de vales con búsqueda local", async ({ page }) => {
    await page.route(
      "**/Billings/UserDocumentsHistory/ByIdEmployee/**",
      async (route) => {
        if (route.request().method() === "OPTIONS") {
          await route.fulfill({ status: 200, body: "" });
          return;
        }

        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: billingHistoryRows }),
        });
      },
    );

    await page.route(
      "**/Billings/PettyCashVoucher/ByIdEmployee/**",
      async (route) => {
        if (route.request().method() === "OPTIONS") {
          await route.fulfill({ status: 200, body: "" });
          return;
        }

        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: pettyCashVouchers }),
        });
      },
    );

    await page.route("**/Billings/PettyCashVoucher/ById/**", async (route) => {
      if (route.request().method() === "OPTIONS") {
        await route.fulfill({ status: 200, body: "" });
        return;
      }

      const url = new URL(route.request().url());
      const id = url.pathname.split("/").pop();
      const voucher =
        pettyCashVouchers.find((item) => item.id === id) ??
        pettyCashVouchers[0];

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: voucher }),
      });
    });

    await page.setViewportSize({ width: 1280, height: 780 });

    await fastLogin(page, email, password);
    await initialTest(page);

    const requestMenu = page.getByTestId("side:/main-page/request");
    await requestMenu.click();

    const pettyCashMenu = page.getByTestId("side:/main-page/request/pettycash");
    await expect(pettyCashMenu).toBeVisible();
    await Promise.all([
      page.waitForURL(
        /\/main-page\/request\/pettycash(?:\/pettycashrequest)?\/?(?:\?.*)?$/,
      ),
      pettyCashMenu.click(),
    ]);

    const requestTab = page.getByTestId(
      "tab:/main-page/request/pettycash/pettycashrequest",
    );
    await expect(requestTab).toBeVisible();
    await Promise.all([
      page.waitForURL(
        /\/main-page\/request\/pettycash\/pettycashrequest\/?(?:\?.*)?$/,
      ),
      requestTab.click(),
    ]);

    await expect(page.getByText("GASTOS DEDUCIBLES (Vale Rosa)")).toBeVisible();
    await expect(
      page.getByText("GASTOS NO DEDUCIBLES (Vale Azul)"),
    ).toBeVisible();

    const historyTab = page.getByTestId(
      "tab:/main-page/request/pettycash/pettycashhistory",
    );
    await expect(historyTab).toBeVisible();

    await Promise.all([
      page.waitForURL(
        /\/main-page\/request\/pettycash\/pettycashhistory\/?(?:\?.*)?$/,
      ),
      historyTab.click(), // <- importante: await dentro del Promise.all
    ]);

    // opcional pero muy útil: esperar la respuesta mockeada del historial
    await page.waitForResponse(
      (res) =>
        /Billings\/UserDocumentsHistory\/ByIdEmployee\//.test(res.url()) &&
        res.request().method() === "GET" &&
        res.ok(),
    );

    // y/o verifica algo propio de la vista Historial para confirmar que renderizó
    await expect(page.getByText("Documento validado")).toBeVisible();
  });
});
