import { describe, expect, it } from "vitest";

import { normalizeIntranetApiUrl } from "./normalizeIntranetApiUrl";

describe("normalizeIntranetApiUrl", () => {
  it("adds the global api prefix to relative controller paths", () => {
    expect(normalizeIntranetApiUrl("/Billings/TravelExpenses")).toBe(
      "/api/Billings/TravelExpenses",
    );
    expect(normalizeIntranetApiUrl("Employees/EmployeesActive")).toBe(
      "/api/Employees/EmployeesActive",
    );
  });

  it("does not duplicate the api prefix", () => {
    expect(normalizeIntranetApiUrl("/api/Reports/Proyects")).toBe(
      "/api/Reports/Proyects",
    );
  });

  it("preserves query strings and hashes", () => {
    expect(
      normalizeIntranetApiUrl(
        "/Reports/AllReports/ByIdProyect/project-1?idEmployee=employee-1#top",
      ),
    ).toBe(
      "/api/Reports/AllReports/ByIdProyect/project-1?idEmployee=employee-1#top",
    );
  });

  it("normalizes absolute backend URLs", () => {
    expect(
      normalizeIntranetApiUrl("https://api.example.com/Auth/Challenge/Start"),
    ).toBe("https://api.example.com/api/Auth/Challenge/Start");
  });
});
