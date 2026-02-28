import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, OrgRole, EventRole, Permission, Organization, Project } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  hasPermission: (permission: Permission, orgId?: string, eventId?: string) => boolean;
  currentOrg: Organization | null;
  setCurrentOrg: (org: Organization | null) => void;
  currentEvent: Project | null;
  setCurrentEvent: (event: Project | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ORG_ROLE_PERMISSIONS: Record<OrgRole, Permission[]> = {
  OWNER: ['manage:org', 'create:event'],
  ADMIN: ['manage:org', 'create:event'],
  MEMBER: []
};

const EVENT_ROLE_PERMISSIONS: Record<EventRole, Permission[]> = {
  DIRECTOR: ['manage:team', 'manage:finances', 'manage:config', 'edit:planning', 'delete:task', 'edit:speakers', 'edit:sponsors', 'edit:alliances', 'edit:marketing'],
  COORDINATOR: ['edit:planning', 'edit:speakers', 'edit:sponsors', 'edit:alliances', 'edit:marketing'],
  VIEWER: []
};

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Ana (Owner)', email: 'ana@event.com' },
  { id: 'u2', name: 'Carlos (Admin/Director)', email: 'carlos@event.com' },
  { id: 'u3', name: 'Luis (Member/Coordinator)', email: 'luis@event.com' },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[0]);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [currentEvent, setCurrentEvent] = useState<Project | null>(null);

  const login = (user: User) => setCurrentUser(user);
  const logout = () => setCurrentUser(null);

  const hasPermission = (permission: Permission, orgId?: string, eventId?: string): boolean => {
    if (!currentUser) return false;

    // Check Org Permissions
    if (orgId && currentOrg && currentOrg.id === orgId) {
      const orgMember = currentOrg.members?.find(m => m.userId === currentUser.id);
      if (orgMember && ORG_ROLE_PERMISSIONS[orgMember.role].includes(permission)) {
        return true;
      }
    }

    // Check Event Permissions
    if (eventId && currentEvent && currentEvent.id === eventId) {
      const teamMember = currentEvent.teamMembers?.find(m => m.userId === currentUser.id);
      if (teamMember && EVENT_ROLE_PERMISSIONS[teamMember.role].includes(permission)) {
        return true;
      }
    }

    return false;
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, hasPermission, currentOrg, setCurrentOrg, currentEvent, setCurrentEvent }}>
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
