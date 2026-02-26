import type { Department, Enterprise } from '@/app/mappings/enterprises/enterprises.types'
import type { EmployeeType } from '@/app/mappings/employees/employee.types'
import type { UserRole, UserType } from '@/app/mappings/users/user.types'
import type { WorkPositionType } from '@/app/mappings/workposition/workposition.types'
import type {
  Authorization,
  AuthorizationStatus,
  AuthorizationType,
} from '@/app/mappings/authorizations/authorizations.types'
import type { Proyect } from '@/app/mappings/proyects/proyects.types'

const buildRole = (id: string, name: string): UserRole => ({
  id,
  name,
  description: null,
  isActive: true,
})

const buildUser = (id: string, username: string, employeeId: string): UserType => ({
  user_id: id,
  username,
  email: `${username}@example.com`,
  email_confirmed: true,
  phone_number: null,
  phone_number_confirmed: true,
  two_factor_enabled: false,
  lockout_enabled: false,
  access_failed_count: 0,
  lockout_end: null,
  change_password: false,
  signature: null,
  is_active: true,
  employee_id: employeeId,
  idemployee: employeeId,
  role_id: 'role-user',
  role: buildRole('role-user', 'Usuario'),
  roles: [buildRole('role-user', 'Usuario')],
  permissions: [],
})

const buildWorkPosition = (id: string, name: string): WorkPositionType => ({
  workposition_id: id,
  name,
})

const buildAuthorizationType = (id: string, name: string): AuthorizationType => ({
  id,
  name,
})

const buildAuthorizationStatus = (name: string): AuthorizationStatus => ({
  id: `status-${name.toLowerCase().replace(/\s+/g, '-')}`,
  name,
  type: 'Authorization',
  is_active: true,
})

const buildProyect = (
  id: string,
  name: string,
  proyectKey: string,
  client: string,
  manager: EmployeeType,
  collaborators: EmployeeType[] = [],
): Proyect => ({
  id,
  name,
  proyectKey,
  client,
  manager,
  collaborators,
})

const buildDepartment = (
  id: string,
  name: string,
  enterpriseId: string,
  enterpriseName: string,
): Department => ({
  department_id: id,
  name,
  enterprise_id: enterpriseId,
  enterprice_name: enterpriseName,
})

const buildEnterprise = (id: string, name: string, departments: Department[]): Enterprise => ({
  enterprise_id: id,
  name,
  departments,
  is_external: false,
})

const buildEmployee = (
  id: string,
  firstname: string,
  lastname: string,
  department: Department,
  workposition: WorkPositionType,
): EmployeeType => ({
  id,
  employee_id: id,
  employee_number: id.padStart(4, '0'),
  firstname,
  secondname: '',
  lastname,
  gtstype: 'GTS',
  motherlast_name: null,
  gender: 'N/A',
  email: `${firstname.toLowerCase()}.${lastname.toLowerCase()}@example.com`,
  phone_number: '',
  extension: '',
  image_url: '',
  manager_id: '',
  department: {
    department_id: department.department_id,
    name: department.name,
    enterprise_id: department.enterprise_id,
    enterprice_name: department.enterprice_name,
  },
  workposition,
  user: buildUser(`user-${id}`, `${firstname.toLowerCase()}.${lastname.toLowerCase()}`, id),
  is_active: true,
  fullname: `${firstname} ${lastname}`.trim(),
})

const enterpriseADept = buildDepartment('dep-001', 'Finanzas', 'ent-001', 'DR Security')
const enterpriseBDept = buildDepartment('dep-002', 'Operaciones', 'ent-002', 'DR Labs')

export const mockEnterprises: Enterprise[] = [
  buildEnterprise('ent-001', 'DR Security', [enterpriseADept]),
  buildEnterprise('ent-002', 'DR Labs', [enterpriseBDept]),
]

const workpositionAnalyst = buildWorkPosition('wp-001', 'Analista')
const workpositionManager = buildWorkPosition('wp-002', 'Gerente')

export const mockEmployees: EmployeeType[] = [
  buildEmployee('ebac4024-3064-4528-9c60-c4178933c80d', 'Luis', 'Ramirez', enterpriseADept, workpositionAnalyst),
  buildEmployee('ebac4024-3064-4528-9c60-c4178933c80d', 'Carla', 'Santos', enterpriseADept, workpositionManager),
  buildEmployee('ebac4024-3064-4528-9c60-c4178933c80d', 'Daniel', 'Vega', enterpriseBDept, workpositionAnalyst),
]

const mockProyect = buildProyect(
  'proj-001',
  'Proyecto Demo',
  'PROY-001',
  'DR Security',
  mockEmployees[0],
  [mockEmployees[1], mockEmployees[2]],
)

const buildAuthorization = (
  id: string,
  kind: AuthorizationType,
  status: AuthorizationStatus,
  applicant: EmployeeType,
  authorizer: EmployeeType,
  enterprise: Enterprise,
  department?: Department,
  comment?: string,
): Authorization => ({
  authorization_id: id,
  applicant,
  authorizer,
  enterprise,
  department,
  kind,
  dateCreated: new Date('2026-02-01T10:00:00.000Z').toISOString(),
  status,
  proyect: mockProyect,
  event_id: `${id}`,
  comment,
})

let authorizations: Authorization[] = [
  buildAuthorization(
    '44d65651-7a6d-4ce6-9dc9-380558c65b5d',
    buildAuthorizationType('kind-vale-rosa', 'Vale Rosa'),
    buildAuthorizationStatus('Pendiente'),
    mockEmployees[0],
    mockEmployees[1],
    mockEnterprises[0],
    mockEnterprises[0].departments[0],
  ),
  buildAuthorization(
    'e41b33f0-2f6a-4030-be4b-3fb7eacd7c59',
    buildAuthorizationType('kind-vale-azul', 'Vale azul'),
    buildAuthorizationStatus('Rechazada'),
    mockEmployees[2],
    mockEmployees[1],
    mockEnterprises[1],
    mockEnterprises[1].departments[0],
    'Factura incompleta.',
  ),
  buildAuthorization(
    '030ecefd-4cac-4a2a-9411-e57c9925b003',
    buildAuthorizationType('kind-requisicion', 'Requisición'),
    buildAuthorizationStatus('Pendiente'),
    mockEmployees[2],
    mockEmployees[1],
    mockEnterprises[1],
    mockEnterprises[1].departments[0],
  ),
 
]

export const listMockAuthorizations = (): Authorization[] => [...authorizations]

export const setMockAuthorizations = (next: Authorization[]): void => {
  authorizations = [...next]
}

export const findEmployeeById = (id: string): EmployeeType | undefined =>
  mockEmployees.find((employee) => employee.employee_id === id || employee.id === id)

export const findEnterpriseById = (id: string): Enterprise | undefined =>
  mockEnterprises.find((enterprise) => enterprise.enterprise_id === id)

export const findDepartmentById = (id: string): Department | undefined => {
  for (const enterprise of mockEnterprises) {
    const match = enterprise.departments.find((department) => department.department_id === id)
    if (match) return match
  }
  return undefined
}

export const createFallbackEmployee = (id: string): EmployeeType =>
  buildEmployee(id, 'Sin', 'Asignar', enterpriseADept, workpositionAnalyst)

export const createFallbackEnterprise = (id: string): Enterprise =>
  buildEnterprise(id, 'Enterprise', [])
