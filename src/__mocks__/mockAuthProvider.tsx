import { ReactNode, useMemo } from 'react';
import { AuthContext } from '@/app/context/AuthContext/AuthContext';
import { AuthContextType,User } from '@/app/context/AuthContext/types';

export const MockAuthProvider = ({ children }: { children: ReactNode }) => {
  const mockUser: User = {
    fullName: 'John Doe',
    employeeNumber: '12345',
    userName: 'jdoe',
    changePassword: false,
    idEmployee: 'emp-001',
    idUser: 'user-001',
    idRol: 'role-001',
    lifeToken: '3600',
    rolName: 'Admin',
    token: 'mock-token',
    imageProfile: 'img.png',
    treeFirebase: '{}',
    nip: '0000',
    activeNIP: true,
    idWorkPosition: 'pos-001',
    workPositionName: 'Developer',
    idEnterprise: 'ent-001',
    idDepartment: 'dep-001',
    password: 'mock-password',
    signature: '',
  };

  const value: AuthContextType = useMemo(() => ({
    user: mockUser,
    userRemebered: mockUser,
    token: 'mock-token',
    hasExpired: false,
    remeberMe: false,
    offlineMode: false,
    login: async () => {},
    logout: async () => {},
    verifyOTP: async () => {},
    askforOTPemail: async () => {},
    validLoggin: async () => true,
    validPermissionsbyroute: () => true,
    UpdateUser: async () => {},
    setHasExpired: () => {},
    handleRemeberMe: () => {},
    handleForgetUser: async () => {},
    handleOfflineMode: () => {},
    getRoutePermissions: () => [],
    updateUserPermissions: async () => {},
  }), []);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
