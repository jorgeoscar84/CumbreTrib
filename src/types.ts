export type Role = 'SUPERADMIN' | 'ADMIN' | 'COLLABORATOR';

export type Permission = 
  | 'manage:users' // Superadmin only
  | 'manage:finances' // Superadmin, Admin
  | 'manage:config' // Superadmin, Admin
  | 'edit:planning' // All
  | 'delete:task' // Superadmin, Admin
  | 'edit:speakers' // All
  | 'edit:sponsors' // Superadmin, Admin
  | 'edit:alliances' // All
  | 'edit:marketing'; // All

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface AgendaItem {
  id: number;
  day: 1 | 2;
  time: string;
  title: string;
  type: 'keynote' | 'panel' | 'break' | 'networking' | 'workshop';
  speaker?: string;
  location?: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  description: string;
}

export interface Task {
  id: number;
  category: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  date?: string; // YYYY-MM-DD
  assigneeId?: number; // References TeamMember.id
}

export interface BudgetItem {
  category: string;
  allocated: number;
  spent: number;
  notes: string;
}

export interface Speaker {
  id: number;
  name: string;
  role: string;
  topic: string;
  status: 'pending' | 'contacted' | 'confirmed' | 'declined';
  type: 'national' | 'international';
  image?: string;
  email?: string;
  phone?: string;
  bio?: string;
}

export interface Sponsor {
  id: number;
  name: string;
  level: 'Diamante' | 'Oro' | 'Plata' | 'Bronce';
  amount: number;
  status: 'prospect' | 'contacted' | 'negotiation' | 'confirmed' | 'paid';
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;
}

export interface University {
  id: number;
  name: string;
  status: 'pending' | 'contacted' | 'negotiation' | 'signed';
  students: number;
  contact: string;
  email?: string;
  phone?: string;
  agreementDetails?: string;
}

export interface Campaign {
  id: number;
  phase: string;
  dates: string;
  status: 'active' | 'pending' | 'completed';
  channels: string[];
  progress: number;
}

export interface EventConfig {
  eventName: string;
  eventDate: string;
  targetAttendees: number;
  sponsorsTarget: number; // Total sponsors target
  totalBudget: number;
  universityTarget: number;
  studentTarget: number;
  sponsorTargets: {
    Diamante: number;
    Oro: number;
    Plata: number;
    Bronce: number;
  };
}

export interface MarketingMetric {
  id: number;
  name: string;
  value: number;
  target: number;
  unit: 'number' | 'percent' | 'currency';
  platform: 'instagram' | 'facebook' | 'linkedin' | 'email' | 'website' | 'other';
  lastUpdated: string;
}
