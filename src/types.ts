export type OrgRole = 'OWNER' | 'ADMIN' | 'MEMBER';
export type EventRole = 'DIRECTOR' | 'COORDINATOR' | 'VIEWER';

export type Permission = 
  | 'manage:org' // Org OWNER, ADMIN
  | 'create:event' // Org OWNER, ADMIN
  | 'manage:team' // Event DIRECTOR
  | 'manage:finances' // Event DIRECTOR
  | 'manage:config' // Event DIRECTOR
  | 'edit:planning' // Event DIRECTOR, COORDINATOR
  | 'delete:task' // Event DIRECTOR
  | 'edit:speakers' // Event DIRECTOR, COORDINATOR
  | 'edit:sponsors' // Event DIRECTOR, COORDINATOR
  | 'edit:alliances' // Event DIRECTOR, COORDINATOR
  | 'edit:marketing'; // Event DIRECTOR, COORDINATOR

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface OrgMember {
  userId: string;
  role: OrgRole;
}

export interface Organization {
  id: string;
  name: string;
  members: OrgMember[];
  projects: Project[];
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
  userId?: string;
  name: string;
  role: EventRole;
  customTitle?: string;
  email: string;
  phone: string;
  description: string;
}

export interface Subtask {
  id: number;
  title: string;
  completed: boolean;
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
  subtasks?: Subtask[];
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



export interface Project {
  id: string;
  name: string;
  organizationId: string;
  config: EventConfig;
  tasks: Task[];
  budgetItems: BudgetItem[];
  speakers: Speaker[];
  sponsors: Sponsor[];
  universities: University[];
  campaigns: Campaign[];
  marketingMetrics: MarketingMetric[];
  teamMembers: TeamMember[];
}
