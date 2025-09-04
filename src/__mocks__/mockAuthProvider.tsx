import { ReactNode } from 'react';
import { AuthProvider } from '@/app/context/AuthContext/AuthContext';
import { useAuthStore } from '@/app/stores/useAuthStore/useAuthStore';
import type { User } from '@/app/context/AuthContext/types';

export const MockAuthProvider = ({ children }: { children: ReactNode }) => {
  const mockUser: User = {
    fullName: 'John Doe',
    employeeNumber: '12345',
    userName: 'jdoe',
    changePassword: false,
    idEmployee: 'emp-001',
    idUser: 'user-001',
    idRol: 'role-001',
    lifeToken: new Date(Date.now() + 3600 * 1000).toISOString(),
    rolName: 'Admin',
    token: 'mock-token',
    imageProfile: 'img.png',
    treeFirebase: '{"main-page":{"home":{"Acces":true}}}',
    nip: '0000',
    activeNIP: true,
    idWorkPosition: 'pos-001',
    workPositionName: 'Developer',
    idEnterprise: 'ent-001',
    idDepartment: 'dep-001',
    password: 'mock-password',
    signature: '',
  };

  useAuthStore.setState({
    user: mockUser,
    userRemebered: mockUser,
    token: 'mock-token',
    hasExpired: false,
    remeberMe: false,
    offlineMode: false,
  });

  return <AuthProvider>{children}</AuthProvider>;
};
