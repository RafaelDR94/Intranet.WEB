import type {
  CreateUserPayload,
  RolePost,
  ToggleUserActivePayload,
  UpdateUserProfilePayload,
  UpdateUserPayload,
  UserEmployeeSummary,
  UserProfilePut,
  UserRole,
  UserSignaturePayload,
  UserType,
  UserPost,
  UserPut,
} from "@/app/mappings/users/user.types";

export type UpdateEmployeeNumberCardPayload = {
  /** Employee identifier. */
  idEmployee: string;
  /** Employee card number. */
  cardNumber: string;
  /** Employee phone number. */
  phoneNumber: string;
};

export type UpdateEmployeeDataSAPPayload = {
  /** User identifier. */
  idUser: string;
  /** SAP creditor/debtor code. */
  creditor_number: string;
  /** SAP client code. */
  client_code: string;
};

export type UsersState = {
  /** Users list as returned by the API */
  users: UserType[];
  /** Employees without an active user account */
  employeesWithoutActiveUser: UserEmployeeSummary[];
  /** Employees with an active user account */
  employeesWithActiveUser: UserEmployeeSummary[];
  /** Currently selected user (detail) */
  user?: UserType;
  /** Catalog of roles available for users */
  roles: UserRole[];

  /** Loading list flag */
  loading: boolean;
  /** Loading detail flag */
  loadingById: boolean;
  /** Loading employees without active user flag */
  loadingWithoutActiveUser: boolean;
  /** Loading employees with active user flag */
  loadingWithActiveUser: boolean;
  /** Loading roles flag */
  loadingRoles: boolean;
  /** Create request in progress */
  creating: boolean;
  /** Update request in progress */
  updating: boolean;
  /** Delete request in progress */
  deleting: boolean;
  /** Role creation request in progress */
  creatingRole: boolean;
  /** Signature update in progress */
  changingSignature: boolean;
  /** Toggle active status in progress */
  togglingActive: boolean;

  /** Success flags */
  successGet: boolean;
  successGetById: boolean;
  successGetWithoutActiveUser: boolean;
  successGetWithActiveUser: boolean;
  successPost: boolean;
  successPut: boolean;
  successDelete: boolean;
  successGetRoles: boolean;
  successPostRole: boolean;
  successChangeSignature: boolean;
  successToggleActive: boolean;

  /** Last error message */
  error?: string;
  /** Warning message returned by the API */
  warning?: string;

  /** Fetch full users list */
  fetchUsers: (force?: boolean) => Promise<void>;
  /** Fetch employees without an active user account */
  fetchEmployeesWithoutActiveUser: (
    force?: boolean,
  ) => Promise<UserEmployeeSummary[]>;
  /** Fetch employees with an active user account */
  fetchEmployeesWithActiveUser: (
    force?: boolean,
  ) => Promise<UserEmployeeSummary[]>;
  /** Fetch user by identifier */
  fetchUserById: (id: string, force?: boolean) => Promise<UserType | null>;
  /** Create a new user */
  createUser: (
    payload: CreateUserPayload | UserPost,
  ) => Promise<UserType | null>;
  /** Update an existing user */
  updateUser: (
    payload: UpdateUserPayload | UserPut,
  ) => Promise<UserType | null>;
  /** Update user profile information */
  updateUserProfile: (
    payload: UpdateUserProfilePayload | UserProfilePut,
  ) => Promise<UserType | null>;
  /** Update employee phone and card number */
  updateEmployeeNumberCard: (
    payload: UpdateEmployeeNumberCardPayload,
  ) => Promise<boolean>;
  /** Update employee SAP debtor and client data */
  updateEmployeeDataSAP: (
    payload: UpdateEmployeeDataSAPPayload,
  ) => Promise<boolean>;
  /** Delete an existing user */
  deleteUser: (id: string) => Promise<boolean>;
  /** Retrieve available roles */
  fetchRoles: (force?: boolean) => Promise<UserRole[]>;
  /** Create a new role */
  createRole: (payload: RolePost) => Promise<UserRole | null>;
  /** Update user signature */
  updateSignature: (payload: UserSignaturePayload) => Promise<string | null>;
  /** Enable or disable a user account */
  toggleActive: (payload: ToggleUserActivePayload) => Promise<boolean>;
  /** Force revalidation ignoring cache */
  forceFetchUsers: () => Promise<void>;
  /** Reset store to initial state */
  reset: () => void;
  /** Reset only flags and feedback messages */
  resetFlags: () => void;
  /** Clear selected user */
  resetUser: () => void;
  /** Manually assign current user */
  setCurrentUser: (user: UserType) => void;
};

export type Set = (
  partial: Partial<UsersState> | ((state: UsersState) => Partial<UsersState>),
) => void;

export type Get = () => UsersState;
