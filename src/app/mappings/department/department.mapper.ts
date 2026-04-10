import type {
  DepartmentEnterprise,
  DepartmentPosition,
  DepartmentPost,
  DepartmentType,
} from "./department.types";

const toString = (value: unknown, fallback = ""): string =>
  value == null ? fallback : String(value);

const toArray = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : value ? [value] : [];

const mapDepartmentEnterprise = (value: unknown): DepartmentEnterprise => {
  const record = (value ?? {}) as Record<string, unknown>;
  return {
    enterprise_id: toString(record.enterprise_id ?? record.id ?? record.enterpriseId),
    name: toString(record.name ?? record.enterprise_name ?? record.enterpriseName),
  };
};

const mapDepartmentPosition = (value: unknown): DepartmentPosition => {
  const record = (value ?? {}) as Record<string, unknown>;
  return {
    name: toString(
      record.name ??
        record.position_name ??
        record.workposition_name ??
        record.workposition ??
        record.work_position ??
        record.workPosition,
    ),
  };
};

export const mapDepartment = (value: unknown): DepartmentType => {
  const dep = (value ?? {}) as Record<string, unknown>;
  const description = toString(
    dep.description ?? dep.department_description ?? dep.departmentDescription,
  );
  const enterprises = toArray(dep.enterprises ?? dep.Enterprise ?? dep.enterprise)
    .map(mapDepartmentEnterprise)
    .filter((item) => Boolean(item.enterprise_id || item.name));
  const positions = toArray(
    dep.positions ?? dep.work_positions ?? dep.workPositions ?? dep.workpositions,
  )
    .map(mapDepartmentPosition)
    .filter((item) => Boolean(item.name));

  return {
    department_id: toString(dep.department_id ?? dep.id ?? dep.departmentId),
    name: toString(dep.name),
    enterprise_id: toString(dep.enterprise_id ?? dep.enterpriseId),
    enterprice_name: toString(
      dep.enterprice_name ?? dep.enterprise_name ?? dep.enterpriseName,
    ),
    description: description || undefined,
    enterprises: enterprises.length ? enterprises : undefined,
    positions: positions.length ? positions : undefined,
  };
};

export const mapDepartments = (deps: unknown[]): DepartmentType[] =>
  deps.map(mapDepartment);

export const mapDepartmentPost = (payload: DepartmentPost): DepartmentPost => ({
  name: toString(payload.name).trim(),
  description: payload.description ? toString(payload.description).trim() : undefined,
  enterprise_id: toString(payload.enterprise_id).trim(),
  workpositions: toArray(payload.workpositions)
    .map((item) => toString(item).trim())
    .filter(Boolean),
});
