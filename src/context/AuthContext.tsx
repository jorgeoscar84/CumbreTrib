import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Role, Permission } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPERADMIN: [
    'manage:users', 'manage:finances', 'manage:config', 
    'edit:planning', 'delete:task', 'edit:speakers', 
    'edit:sponsors', 'edit:alliances', 'edit:marketing'
  ],
  ADMIN: [
    'manage:finances', 'manage:config', 
    'edit:planning', 'delete:task', 'edit:speakers', 
    'edit:sponsors', 'edit:alliances', 'edit:marketing'
  ],
  COLLABORATOR: [
    'edit:planning', 'edit:speakers', 'edit:alliances', 'edit:marketing'
  ]
};

export const MOCK_USERS: User[] = [
  { id: 1, name: 'Ana (Superadmin)', email: 'ana@event.com', role: 'SUPERADMIN' },
  { id: 2, name: 'Carlos (Admin)', email: 'carlos@event.com', role: 'ADMIN' },
  { id: 3, name: 'Luis (Colaborador)', email: 'luis@event.com', role: 'COLLABORATOR' },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default to Superadmin for initial load
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[0]);

  const login = (user: User) => setCurrentUser(user);
  const logout = () => setCurrentUser(null);

  const hasPermission = (permission: Permission): boolean => {
    if (!currentUser) return false;
    return ROLE_PERMISSIONS[currentUser.role].includes(permission);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
