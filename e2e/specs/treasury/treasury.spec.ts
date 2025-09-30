import { test, expect } from "@playwright/test";

import { fastLogin } from "../../helpers/login-helpers";
import { initialTest } from "../../helpers/initial-helpers";

const email = process.env.E2E_USER_EMAIL ?? "katherine.negrete@drsecurity.net";
const password = process.env.E2E_USER_PASSWORD ?? "123qwe";

const pettyCashFunds = [
  {
    id: "fund-2024-05",
    year_month: "2024-05",
    assigned_amount: 10000,
    verified_amount: 4200,
    cash_on_hand: 2500,
    unverified_amount: 1500,
    pending_verification: 800,
    available_amount: 5500,
    date_created: "2024-05-01T00:00:00.000Z",
  },
] as const;

const pettyCashVouchers = [
  {
    id: "voucher-1",
    petty_cash_funds_id: "fund-2024-05",
    employee_id: "emp-1",
    voucher_type: "Vale Rosa",
    application_date: "2024-05-05T10:30:00.000Z",
    concept: "Taxi aeropuerto",
    amount: 1200.5,
    comments: "Traslado al aeropuerto",
    project: {
      id: "proj-1",
      name: "Proyecto Norte",
      proyectkey: "PN-01",
      client: "Cliente Uno",
    },
    petty_cash_funds: {
      id: "fund-2024-05",
      year_month: "2024-05",
      assigned_amount: 10000,
      verified_amount: 4200,
      cash_on_hand: 2500,
      unverified_amount: 1500,
      pending_verification: 800,
      available_amount: 5500,
      date_created: "2024-05-01T00:00:00.000Z",
    },
    xml: "/files/voucher-1.xml",
    pdf: "/files/voucher-1.pdf",
    uuid: "uuid-voucher-1",
    employeename: "Ana López",
    provider: "Transportes MX",
    rfc_emisor: "AAA010101AAA",
    rfc_receptor: "DRS010203AB1",
    subtotal: 1000,
    iva: 200.5,
    total: 1200.5,
    status: "Sin Factura",
  },
  {
    id: "voucher-2",
    petty_cash_funds_id: "fund-2024-05",
    employee_id: "emp-2",
    voucher_type: "Vale Azul",
    application_date: "2024-05-07T15:15:00.000Z",
    concept: "Hospedaje Monterrey",
    amount: 2750,
    comments: "Reunión regional",
    project: {
      id: "proj-2",
      name: "Proyecto Sur",
      proyectkey: "PS-07",
      client: "Cliente Dos",
    },
    petty_cash_funds: {
      id: "fund-2024-05",
      year_month: "2024-05",
      assigned_amount: 10000,
      verified_amount: 4200,
      cash_on_hand: 2500,
      unverified_amount: 1500,
      pending_verification: 800,
      available_amount: 5500,
      date_created: "2024-05-01T00:00:00.000Z",
    },
    xml: "/files/voucher-2.xml",
    pdf: "/files/voucher-2.pdf",
    uuid: "uuid-voucher-2",
    employeename: "Bruno Martínez",
    provider: "Hotel Sol",
    rfc_emisor: "BBB010101BBB",
    rfc_receptor: "DRS010203AB1",
    subtotal: 2360,
    iva: 390,
    total: 2750,
    status: "Validado",
  },
] as const;

const pettyCashVoucherDetails = {
  "voucher-1": {
    id: "voucher-1",
    petty_cash_funds: pettyCashVouchers[0].petty_cash_funds,
    employee_id: "emp-1",
    status: "Sin Factura",
    employeename: "Ana López",
    voucher_type: "Vale Rosa",
    application_date: "2024-05-05T10:30:00.000Z",
    concept: "Taxi aeropuerto",
    amount: 1200.5,
    comments: "Traslado al aeropuerto",
    project: pettyCashVouchers[0].project,
    xml: "/files/voucher-1.xml",
    pdf: "/files/voucher-1.pdf",
    uuid: "uuid-voucher-1",
    rfc_emisor: "AAA010101AAA",
    rfc_receptor: "DRS010203AB1",
    subtotal: 1000,
    iva: 200.5,
    total: 1200.5,
    conceptos: [
      {
        clave_sat: "G01",
        clavesat_description: "Gastos en general",
        cantidad: 1,
        valor_unitario: 1200.5,
        importe: 1200.5,
      },
    ],
  },
  "voucher-2": {
    id: "voucher-2",
    petty_cash_funds: pettyCashVouchers[1].petty_cash_funds,
    employee_id: "emp-2",
    status: "Validado",
    employeename: "Bruno Martínez",
    voucher_type: "Vale Azul",
    application_date: "2024-05-07T15:15:00.000Z",
    concept: "Hospedaje Monterrey",
    amount: 2750,
    comments: "Reunión regional",
    project: pettyCashVouchers[1].project,
    xml: "/files/voucher-2.xml",
    pdf: "/files/voucher-2.pdf",
    uuid: "uuid-voucher-2",
    rfc_emisor: "BBB010101BBB",
    rfc_receptor: "DRS010203AB1",
    subtotal: 2360,
    iva: 390,
    total: 2750,
    conceptos: [
      {
        clave_sat: "D01",
        clavesat_description: "Servicios profesionales",
        cantidad: 3,
        valor_unitario: 916.67,
        importe: 2750,
      },
    ],
  },
} as const;

test.describe("Treasury module", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      indexedDB.deleteDatabase("LoginDatabase");
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test("muestra resumen y tabla de control de tesorería", async ({ page }) => {
    await page.route("**/Billings/PettyCashFundByDate?**", async (route) => {
      if (route.request().method() === "OPTIONS") {
        await route.fulfill({ status: 200, body: "" });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: pettyCashFunds }),
      });
    });

    await page.route("**/Billings/PettyCashVoucher?IsActive=true**", async (route) => {
      if (route.request().method() === "OPTIONS") {
        await route.fulfill({ status: 200, body: "" });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: pettyCashVouchers }),
      });
    });

    await page.route("**/Billings/PettyCashVoucher/ById/**", async (route) => {
      if (route.request().method() === "OPTIONS") {
        await route.fulfill({ status: 200, body: "" });
        return;
      }

      const url = new URL(route.request().url());
      const id = url.pathname.split("/").pop() ?? "";
      const detail = pettyCashVoucherDetails[id as keyof typeof pettyCashVoucherDetails];
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: detail ?? pettyCashVoucherDetails["voucher-1"] }),
      });
    });

    await page.setViewportSize({ width: 1280, height: 780 });

    await fastLogin(page, email, password);
    await initialTest(page);

    const treasuryMenu = page.getByTestId("side:/main-page/treasury");
    await treasuryMenu.click();

    const pettyCashMenu = page.getByTestId("side:/main-page/treasury/treasurypettycash");
    await expect(pettyCashMenu).toBeVisible();

    await Promise.all([
      page.waitForURL(/\/main-page\/treasury\/treasurypettycash(?:\/treasurycontrol)?\/?(?:\?.*)?$/),
      pettyCashMenu.click(),
    ]);

    const controlTab = page.getByTestId(
      "tab:/main-page/treasury/treasurypettycash/treasurycontrol",
    );
    await expect(controlTab).toBeVisible();
    await Promise.all([
      page.waitForURL(
        /\/main-page\/treasury\/treasurypettycash\/treasurycontrol\/?(?:\?.*)?$/,
      ),
      controlTab.click(),
    ]);

    await page.waitForResponse(
      (res) =>
        /Billings\/PettyCashFundByDate/.test(res.url()) &&
        res.request().method() === "GET" &&
        res.ok(),
    );

    await page.waitForResponse(
      (res) =>
        /Billings\/PettyCashVoucher\?IsActive=true/.test(res.url()) &&
        res.request().method() === "GET" &&
        res.ok(),
    );

    await expect(page.getByText("Monto comprobado")).toBeVisible();
    await expect(page.getByText("Ana López")).toBeVisible();
    await expect(page.getByText(/\$1,200\.50/)).toBeVisible();

    const sinFacturaLabel = page.getByText("SIN FACTURA");
    await expect(sinFacturaLabel).toBeVisible();
    await expect(sinFacturaLabel).toHaveClass(/border-alert-orange-100/);
  });
});
