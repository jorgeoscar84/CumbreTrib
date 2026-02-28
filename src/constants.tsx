import { 
  LayoutDashboard, 
  CheckSquare, 
  DollarSign, 
  Users, 
  Megaphone, 
  CalendarDays, 
  Settings,
  Briefcase,
  GraduationCap,
  Clock,
  UserCog,
  Target
} from 'lucide-react';

export const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
  { label: 'Estrategia', icon: Target, id: 'strategy' },
  { label: 'Planificación', icon: CheckSquare, id: 'planning' },
  { label: 'Cronograma', icon: Clock, id: 'timeline' },
  { label: 'Presupuesto', icon: DollarSign, id: 'budget' },
  { label: 'Equipo', icon: UserCog, id: 'team' },
  { label: 'Ponentes', icon: Users, id: 'speakers' },
  { label: 'Auspicios', icon: Briefcase, id: 'sponsors' },
  { label: 'Alianzas', icon: GraduationCap, id: 'alliances' },
  { label: 'Marketing', icon: Megaphone, id: 'marketing' },
];

export const INITIAL_STATS = {
  daysLeft: 475, // Approx to June 2026
  registeredAttendees: 0,
  targetAttendees: 2000,
  budgetSpent: 15000,
  budgetTotal: 120000,
  sponsorsConfirmed: 2,
  sponsorsTarget: 15
};

export const INITIAL_TASKS = [
  // A. Estrategia General
  { id: 1, category: 'Estrategia', title: 'Objetivos SMART definidos y documentados', status: 'done', priority: 'high', date: '2026-02-15' },
  { id: 2, category: 'Estrategia', title: 'KPIs establecidos con metas numéricas', status: 'done', priority: 'high', date: '2026-02-20' },
  { id: 3, category: 'Estrategia', title: 'Presupuesto maestro aprobado con contingencia', status: 'done', priority: 'critical', date: '2026-02-25' },
  { id: 4, category: 'Estrategia', title: 'Cronograma de planificación con milestones', status: 'done', priority: 'high', date: '2026-02-28' },
  
  // B. Contenido y Ponentes
  { id: 5, category: 'Ponentes', title: 'Jorge Ron confirmado como ponente principal', status: 'done', priority: 'critical', date: '2026-03-05' },
  { id: 6, category: 'Ponentes', title: 'Agenda de 2 días diseñada con tracks paralelos', status: 'pending', priority: 'high', date: '2026-04-05' },
  { id: 7, category: 'Ponentes', title: 'Contactar speakers bureaus internacionales', status: 'in-progress', priority: 'high', date: '2026-03-15' },
  
  // C. Marketing
  { id: 8, category: 'Marketing', title: 'Identidad visual del evento creada', status: 'done', priority: 'high', date: '2026-03-01' },
  { id: 9, category: 'Marketing', title: 'Landing page activa con registro', status: 'in-progress', priority: 'critical', date: '2026-03-10' },
  { id: 10, category: 'Marketing', title: 'Plan de marketing en 3 fases', status: 'pending', priority: 'high', date: '2026-04-01' },
  
  // D. Alianzas
  { id: 11, category: 'Alianzas', title: 'Lista de universidades target contactadas', status: 'in-progress', priority: 'high', date: '2026-03-20' },
  { id: 12, category: 'Alianzas', title: 'Convenio con el Colegio de Contadores', status: 'pending', priority: 'critical', date: '2026-04-15' },
  
  // E. Auspicios
  { id: 13, category: 'Auspicios', title: 'Paquetes de auspicio diseñados por niveles', status: 'done', priority: 'high', date: '2026-03-10' },
  { id: 14, category: 'Auspicios', title: 'Brochure comercial profesional listo', status: 'in-progress', priority: 'high', date: '2026-03-15' },
  
  // F. Logística
  { id: 15, category: 'Logística', title: 'Contrato del Centro de Convenciones firmado', status: 'done', priority: 'critical', date: '2026-03-15' },
  { id: 16, category: 'Logística', title: 'Proveedores AV y Catering contratados', status: 'pending', priority: 'high', date: '2026-04-20' },
  
  // G. Tecnología
  { id: 17, category: 'Tecnología', title: 'Plataforma de ticketing seleccionada', status: 'done', priority: 'medium', date: '2026-03-20' },
  
  // H. Legal
  { id: 18, category: 'Legal', title: 'Plan de contingencia elaborado', status: 'pending', priority: 'critical', date: '2026-04-20' },
  { id: 19, category: 'Legal', title: 'Permisos municipales obtenidos', status: 'pending', priority: 'high', date: '2026-05-15' },
  
  // I. Experiencia
  { id: 20, category: 'Experiencia', title: 'Kit de bienvenida/swag bag diseñado', status: 'pending', priority: 'medium', date: '2026-05-10' },
  
  // J. Post-Evento
  { id: 21, category: 'Post-Evento', title: 'Encuesta de satisfacción diseñada', status: 'pending', priority: 'medium', date: '2026-06-05' },
];

export const BUDGET_ITEMS = [
  { category: 'Venue y Espacios', allocated: 30000, spent: 5000, notes: 'Alquiler Centro de Convenciones' },
  { category: 'Ponentes (Honorarios/Viáticos)', allocated: 35000, spent: 0, notes: 'Incluye internacionales y Jorge Ron' },
  { category: 'Producción y AV', allocated: 25000, spent: 0, notes: 'Pantallas LED, Sonido, Streaming' },
  { category: 'Marketing y Publicidad', allocated: 15000, spent: 2000, notes: 'Ads, PR, Impresos' },
  { category: 'Catering', allocated: 20000, spent: 0, notes: 'Coffee breaks y almuerzos (2 días)' },
  { category: 'Tecnología', allocated: 5000, spent: 0, notes: 'App, Ticketing, Wi-Fi' },
  { category: 'Merchandising/Swag', allocated: 8000, spent: 0, notes: 'Kits de bienvenida' },
  { category: 'Personal y Seguridad', allocated: 5000, spent: 0, notes: 'Staff, seguridad privada, limpieza' },
  { category: 'Permisos y Seguros', allocated: 2000, spent: 0, notes: 'Municipales y Responsabilidad Civil' },
  { category: 'Contingencia (10%)', allocated: 15000, spent: 0, notes: 'Fondo de emergencia' },
];

export const SPEAKERS = [
  { id: 1, name: 'Jorge Ron', role: 'Keynote Principal', topic: 'Reforma Tributaria 2026', status: 'confirmed', type: 'national', image: 'https://picsum.photos/seed/jorge/200' },
  { id: 2, name: 'Experto Internacional IA', role: 'Keynote Tech', topic: 'IA en Finanzas', status: 'contacted', type: 'international', image: 'https://picsum.photos/seed/ia/200' },
  { id: 3, name: 'Presidente Colegio Contadores', role: 'Panelista', topic: 'Futuro de la Profesión', status: 'pending', type: 'national', image: 'https://picsum.photos/seed/presi/200' },
];

export const SPONSORS = [
  { id: 1, name: 'Banco del Pacífico', level: 'Diamante', amount: 15000, status: 'negotiation' },
  { id: 2, name: 'Software Contable X', level: 'Oro', amount: 8000, status: 'prospect' },
  { id: 3, name: 'Universidad Ecotec', level: 'Plata', amount: 4000, status: 'confirmed' },
];
