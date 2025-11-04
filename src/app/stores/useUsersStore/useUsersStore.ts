"use client";

import { devtools } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

import type { UsersState } from "./types";
import {
  createRole as createRoleRequest,
  createUser as createUserRequest,
  deleteUser as deleteUserRequest,
  fetchRoles as fetchRolesRequest,
  fetchUserById as fetchUserByIdRequest,
  fetchUsers as fetchUsersRequest,
  toggleActive as toggleActiveRequest,
  updateSignature as updateSignatureRequest,
  updateUser as updateUserRequest,
} from "./utilities";

const initialCollections: Pick<UsersState, "users" | "user" | "roles"> = {
  users: [],
  user: undefined,
  roles: [],
};

const initialFlags: Pick<
  UsersState,
  | "loading"
  | "loadingById"
  | "loadingRoles"
  | "creating"
  | "updating"
  | "deleting"
  | "creatingRole"
  | "changingSignature"
  | "togglingActive"
  | "successGet"
  | "successGetById"
  | "successPost"
  | "successPut"
  | "successDelete"
  | "successGetRoles"
  | "successPostRole"
  | "successChangeSignature"
  | "successToggleActive"
  | "error"
  | "warning"
> = {
  loading: false,
  loadingById: false,
  loadingRoles: false,
  creating: false,
  updating: false,
  deleting: false,
  creatingRole: false,
  changingSignature: false,
  togglingActive: false,
  successGet: false,
  successGetById: false,
  successPost: false,
  successPut: false,
  successDelete: false,
  successGetRoles: false,
  successPostRole: false,
  successChangeSignature: false,
  successToggleActive: false,
  error: undefined,
  warning: undefined,
};

export const useUsersStore = createWithEqualityFn<UsersState>()(
  devtools((set, get) => ({
    ...initialCollections,
    ...initialFlags,

    fetchUsers: (force = false) => fetchUsersRequest(set, get, force),
    forceFetchUsers: () => fetchUsersRequest(set, get, true),
    fetchUserById: (id: string, force = false) =>
      fetchUserByIdRequest(id, set, get, force),
    createUser: (payload) => createUserRequest(set, get, payload),
    updateUser: (payload) => updateUserRequest(set, get, payload),
    deleteUser: (id: string) => deleteUserRequest(set, get, id),
    fetchRoles: (force = false) => fetchRolesRequest(set, get, force),
    createRole: (payload) => createRoleRequest(set, get, payload),
    updateSignature: (payload) => updateSignatureRequest(set, get, payload),
    toggleActive: (payload) => toggleActiveRequest(set, get, payload),

    reset: () =>
      set({
        ...initialCollections,
        ...initialFlags,
      }),
    resetFlags: () =>
      set({
        ...initialFlags,
      }),
    resetUser: () => set({ user: undefined }),
    setCurrentUser: (user) => set({ user }),
  }))
);
