/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  DollarSign, 
  Users, 
  Megaphone, 
  Briefcase,
  GraduationCap,
  Menu,
  Bell,
  Search,
  Plus,
  CalendarDays,
  Settings,
  ChevronDown
} from 'lucide-react';
import { NAV_ITEMS, INITIAL_TASKS, BUDGET_ITEMS, SPEAKERS, SPONSORS } from './constants';
import { Task, BudgetItem, Speaker, Sponsor, University, Campaign, MarketingMetric, EventConfig, TeamMember, Project } from './types';
import { useAuth, MOCK_USERS } from './context/AuthContext';
import { motion } from 'motion/react';
import Calendar from './components/Calendar';
import PlanningView from './components/PlanningView';
import BudgetView from './components/BudgetView';
import SpeakersView from './components/SpeakersView';
import SponsorsView from './components/SponsorsView';
import AlliancesView from './components/AlliancesView';
import MarketingView from './components/MarketingView';
import SettingsView from './components/SettingsView';
import TimelineView from './components/TimelineView';
import TeamView from './components/TeamView';
import StrategyView from './components/StrategyView';

// Components
const StatCard = ({ title, value, subtext, icon: Icon, trend }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-indigo-50 rounded-xl">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      {trend && (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <div className="text-2xl font-bold text-slate-900">{value}</div>
    {subtext && <div className="text-xs text-slate-400 mt-2">{subtext}</div>}
  </motion.div>
);

const TaskRow: React.FC<{ task: Task; onToggleStatus: (id: number) => void }> = ({ task, onToggleStatus }) => {
  const statusColors = {
    pending: 'bg-slate-100 text-slate-600',
    'in-progress': 'bg-blue-100 text-blue-700',
    done: 'bg-green-100 text-green-700'
  };

  const priorityColors = {
    low: 'text-slate-400',
    medium: 'text-yellow-500',
    high: 'text-orange-500',
    critical: 'text-red-500'
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority] === 'text-red-500' ? 'bg-red-500' : 'bg-slate-300'}`} />
        <div>
          <h4 className="text-sm font-medium text-slate-900">{task.title}</h4>
          <span className="text-xs text-slate-500">{task.category}</span>
        </div>
      </div>
      <button 
        onClick={() => onToggleStatus(task.id)}
        className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[task.status]} cursor-pointer hover:opacity-80 transition-opacity`}
        title="Clic para cambiar estado"
      >
        {task.status === 'in-progress' ? 'En Progreso' : task.status === 'done' ? 'Completado' : 'Pendiente'}
      </button>
    </div>
  );
};

export default function App() {
  const { currentUser, login, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProjectMenu, setShowProjectMenu] = useState(false);

  // Application State
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Cumbre Tributaria Ecuador',
      config: {
        eventName: 'Cumbre Tributaria Ecuador',
        eventDate: '2026-06-15',
        targetAttendees: 2000,
        sponsorsTarget: 15,
        totalBudget: 120000,
        universityTarget: 5,
        studentTarget: 1500,
        sponsorTargets: {
          Diamante: 2,
          Oro: 5,
          Plata: 8,
          Bronce: 10
        }
      },
      tasks: INITIAL_TASKS as Task[],
      budgetItems: BUDGET_ITEMS,
      speakers: SPEAKERS as Speaker[],
      sponsors: SPONSORS as Sponsor[],
      universities: [
        { id: 1, name: 'ESPOL', status: 'signed', students: 150, contact: 'Decano Facultad Economía', email: 'decano@espol.edu.ec', phone: '0991234567' },
        { id: 2, name: 'Universidad de Guayaquil', status: 'negotiation', students: 300, contact: 'Director Carrera CPA', email: 'cpa@ug.edu.ec', phone: '0987654321' },
        { id: 3, name: 'UEES', status: 'contacted', students: 0, contact: 'Coordinador Vinculación', email: 'vinculacion@uees.edu.ec', phone: '0976543210' },
        { id: 4, name: 'Universidad Católica', status: 'signed', students: 120, contact: 'Jefe de Carrera', email: 'carrera@ucsg.edu.ec', phone: '0965432109' },
        { id: 5, name: 'UTEG', status: 'pending', students: 0, contact: 'Pendiente', email: '', phone: '' },
      ],
      campaigns: [
        { id: 1, phase: 'Fase 1: Expectativa', dates: 'Feb - Mar', status: 'active', channels: ['Instagram', 'Email', 'PR'], progress: 45 },
        { id: 2, phase: 'Fase 2: Conversión', dates: 'Abr - May', status: 'pending', channels: ['Ads', 'Webinars', 'Visitas'], progress: 0 },
        { id: 3, phase: 'Fase 3: Último Impulso', dates: 'Junio', status: 'pending', channels: ['SMS', 'Remarketing'], progress: 0 },
      ],
      marketingMetrics: [
        { id: 1, name: 'Alcance en Redes', value: 0, target: 50000, unit: 'number', platform: 'instagram', lastUpdated: new Date().toISOString().split('T')[0] },
        { id: 2, name: 'Leads Landing Page', value: 0, target: 2000, unit: 'number', platform: 'website', lastUpdated: new Date().toISOString().split('T')[0] },
        { id: 3, name: 'Tasa de Apertura Email', value: 0, target: 25, unit: 'percent', platform: 'email', lastUpdated: new Date().toISOString().split('T')[0] },
      ],
      teamMembers: [
        { id: 1, name: 'Jorge Ron', role: 'Director General', email: 'jorge@eventer.com', phone: '0990000001', description: 'Supervisa todo, toma decisiones finales, relaciones institucionales de alto nivel.' },
        { id: 2, name: 'María Pérez', role: 'Coord. Logística', email: 'maria@eventer.com', phone: '0990000002', description: 'Gestión del venue, proveedores, montaje, transporte, catering, equipo AV.' },
        { id: 3, name: 'Carlos López', role: 'Dir. Marketing', email: 'carlos@eventer.com', phone: '0990000003', description: 'Estrategia digital/offline, campañas, PR y medios.' },
        { id: 4, name: 'Ana Silva', role: 'Coord. Ponentes', email: 'ana@eventer.com', phone: '0990000004', description: 'Contacto speakers, diseño de agenda, materiales.' },
        { id: 5, name: 'Luis Torres', role: 'Coord. Comercial', email: 'luis@eventer.com', phone: '0990000005', description: 'Venta de paquetes de patrocinio, relación con auspiciantes.' },
        { id: 6, name: 'Elena Gómez', role: 'Coord. Alianzas', email: 'elena@eventer.com', phone: '0990000006', description: 'Relación con universidades, colegios profesionales y gremios.' },
        { id: 7, name: 'Pedro Ruiz', role: 'Coord. Experiencia', email: 'pedro@eventer.com', phone: '0990000007', description: 'Registro, acreditación, kit de bienvenida, atención al público.' },
        { id: 8, name: 'Sofía Castro', role: 'Coord. Tecnología', email: 'sofia@eventer.com', phone: '0990000008', description: 'Plataforma de ticketing, app, streaming, Wi-Fi.' },
        { id: 9, name: 'Diego Vega', role: 'Coord. Legal', email: 'diego@eventer.com', phone: '0990000009', description: 'Permisos municipales, plan de contingencia, seguros.' },
      ]
    }
  ]);
  const [currentProjectId, setCurrentProjectId] = useState<string>('1');

  const currentProject = projects.find(p => p.id === currentProjectId) || projects[0];

  const updateCurrentProject = (updates: Partial<Project>) => {
    setProjects(projects.map(p => p.id === currentProjectId ? { ...p, ...updates } : p));
  };

  const createNewProject = () => {
    const newId = Date.now().toString();
    const newProject: Project = {
      id: newId,
      name: 'Nuevo Proyecto',
      config: {
        eventName: 'Nuevo Proyecto',
        eventDate: new Date().toISOString().split('T')[0],
        targetAttendees: 0,
        sponsorsTarget: 0,
        totalBudget: 0,
        universityTarget: 0,
        studentTarget: 0,
        sponsorTargets: { Diamante: 0, Oro: 0, Plata: 0, Bronce: 0 }
      },
      tasks: [],
      budgetItems: [],
      speakers: [],
      sponsors: [],
      universities: [],
      campaigns: [],
      marketingMetrics: [],
      teamMembers: []
    };
    setProjects([...projects, newProject]);
    setCurrentProjectId(newId);
  };

  const deleteCurrentProject = () => {
    if (projects.length <= 1) return;
    const newProjects = projects.filter(p => p.id !== currentProjectId);
    setProjects(newProjects);
    setCurrentProjectId(newProjects[0].id);
    setActiveTab('dashboard');
  };

  // State accessors for current project
  const eventConfig = currentProject.config;
  const setEventConfig = (config: EventConfig | ((prev: EventConfig) => EventConfig)) => {
    updateCurrentProject({ config: typeof config === 'function' ? config(currentProject.config) : config });
    if (typeof config !== 'function' || (config as any).eventName) {
      updateCurrentProject({ name: typeof config === 'function' ? config(currentProject.config).eventName : config.eventName });
    }
  };

  const tasks = currentProject.tasks;
  const setTasks = (tasks: Task[] | ((prev: Task[]) => Task[])) => {
    updateCurrentProject({ tasks: typeof tasks === 'function' ? tasks(currentProject.tasks) : tasks });
  };

  const budgetItems = currentProject.budgetItems;
  const setBudgetItems = (budgetItems: BudgetItem[] | ((prev: BudgetItem[]) => BudgetItem[])) => {
    updateCurrentProject({ budgetItems: typeof budgetItems === 'function' ? budgetItems(currentProject.budgetItems) : budgetItems });
  };

  const speakers = currentProject.speakers;
  const setSpeakers = (speakers: Speaker[] | ((prev: Speaker[]) => Speaker[])) => {
    updateCurrentProject({ speakers: typeof speakers === 'function' ? speakers(currentProject.speakers) : speakers });
  };

  const sponsors = currentProject.sponsors;
  const setSponsors = (sponsors: Sponsor[] | ((prev: Sponsor[]) => Sponsor[])) => {
    updateCurrentProject({ sponsors: typeof sponsors === 'function' ? sponsors(currentProject.sponsors) : sponsors });
  };

  const universities = currentProject.universities;
  const setUniversities = (universities: University[] | ((prev: University[]) => University[])) => {
    updateCurrentProject({ universities: typeof universities === 'function' ? universities(currentProject.universities) : universities });
  };

  const campaigns = currentProject.campaigns;
  const setCampaigns = (campaigns: Campaign[] | ((prev: Campaign[]) => Campaign[])) => {
    updateCurrentProject({ campaigns: typeof campaigns === 'function' ? campaigns(currentProject.campaigns) : campaigns });
  };

  const marketingMetrics = currentProject.marketingMetrics;
  const setMarketingMetrics = (marketingMetrics: MarketingMetric[] | ((prev: MarketingMetric[]) => MarketingMetric[])) => {
    updateCurrentProject({ marketingMetrics: typeof marketingMetrics === 'function' ? marketingMetrics(currentProject.marketingMetrics) : marketingMetrics });
  };

  const teamMembers = currentProject.teamMembers;
  const setTeamMembers = (teamMembers: TeamMember[] | ((prev: TeamMember[]) => TeamMember[])) => {
    updateCurrentProject({ teamMembers: typeof teamMembers === 'function' ? teamMembers(currentProject.teamMembers) : teamMembers });
  };

  // Derived Stats
  const budgetSpent = budgetItems.reduce((acc, item) => acc + item.spent, 0);
  const sponsorsConfirmed = sponsors.filter(s => s.status === 'confirmed' || s.status === 'paid').length;
  
  // Calculate days remaining
  const calculateDaysRemaining = () => {
    const today = new Date();
    const eventDate = new Date(eventConfig.eventDate);
    const diffTime = Math.abs(eventDate.getTime() - today.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  const daysRemaining = calculateDaysRemaining();

  const handleTaskToggle = (id: number) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'done' ? 'pending' : 'done';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Días Restantes" 
                value={daysRemaining} 
                subtext={`Evento: ${new Date(eventConfig.eventDate).toLocaleDateString()}`} 
                icon={CalendarDays} 
              />
              <StatCard 
                title="Presupuesto Ejecutado" 
                value={`$${budgetSpent.toLocaleString()}`} 
                subtext={`de $${eventConfig.totalBudget.toLocaleString()}`} 
                icon={DollarSign}
                trend={Math.round((budgetSpent / eventConfig.totalBudget) * 100)}
              />
              <StatCard 
                title="Asistentes Meta" 
                value={eventConfig.targetAttendees.toLocaleString()} 
                subtext="0 registrados (Fase Previa)" 
                icon={Users} 
              />
              <StatCard 
                title="Auspiciantes" 
                value={`${sponsorsConfirmed} / ${eventConfig.sponsorsTarget}`} 
                subtext={`En negociación: ${sponsors.filter(s => s.status === 'negotiation').length}`} 
                icon={Briefcase} 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Tasks Column */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-900">Planificación Estratégica</h2>
                    <button onClick={() => setActiveTab('planning')} className="text-sm text-indigo-600 font-medium hover:text-indigo-700">Ver todo</button>
                  </div>
                  <div>
                    {tasks.slice(0, 5).map(task => (
                      <TaskRow key={task.id} task={task} onToggleStatus={handleTaskToggle} />
                    ))}
                  </div>
                </div>
                <Calendar tasks={tasks} setTasks={setTasks} />
              </div>

              {/* Quick Actions / Budget Summary */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Resumen Presupuestal</h2>
                  <div className="space-y-4">
                    {budgetItems.slice(0, 5).map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">{item.category}</span>
                          <span className="font-medium text-slate-900">${item.spent.toLocaleString()} / ${item.allocated.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${Math.min((item.spent / item.allocated) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-indigo-900 rounded-2xl shadow-sm p-6 text-white">
                  <h2 className="text-lg font-semibold mb-2">Próximo Hito Crítico</h2>
                  <p className="text-indigo-200 text-sm mb-4">Cierre de Keynote Internacional</p>
                  <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium">Confirmar Speaker IA</div>
                      <div className="text-xs text-indigo-300">Vence en 15 días</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'strategy':
        return <StrategyView />;
      case 'planning':
        return <PlanningView tasks={tasks} setTasks={setTasks} teamMembers={teamMembers} />;
      case 'timeline':
        return <TimelineView tasks={tasks} setTasks={setTasks} teamMembers={teamMembers} />;
      case 'team':
        return <TeamView teamMembers={teamMembers} setTeamMembers={setTeamMembers} />;
      case 'budget':
        return <BudgetView items={budgetItems} setItems={setBudgetItems} />;
      case 'speakers':
        return <SpeakersView speakers={speakers} setSpeakers={setSpeakers} />;
      case 'sponsors':
        return <SponsorsView sponsors={sponsors} setSponsors={setSponsors} config={eventConfig} setConfig={setEventConfig} />;
      case 'alliances':
        return <AlliancesView universities={universities} setUniversities={setUniversities} config={eventConfig} setConfig={setEventConfig} />;
      case 'marketing':
        return <MarketingView campaigns={campaigns} setCampaigns={setCampaigns} metrics={marketingMetrics} setMetrics={setMarketingMetrics} />;
      case 'settings':
        return <SettingsView 
          config={eventConfig} 
          setConfig={setEventConfig} 
          project={currentProject}
          updateProject={updateCurrentProject}
          onDeleteProject={projects.length > 1 ? deleteCurrentProject : undefined} 
        />;
      default:
        return <div className="p-12 text-center text-slate-500">Módulo en construcción</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}
      >
        <div className="h-16 flex items-center justify-center border-b border-slate-100">
          {isSidebarOpen ? (
            <div className="font-bold text-xl text-indigo-900 tracking-tight">Eventer</div>
          ) : (
            <div className="font-bold text-xl text-indigo-600">EV</div>
          )}
        </div>
        
        {isSidebarOpen && (
          <div className="p-4 border-b border-slate-100 relative">
            <button 
              onClick={() => setShowProjectMenu(!showProjectMenu)}
              className="w-full flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-6 h-6 bg-indigo-100 rounded flex items-center justify-center text-indigo-600 font-bold text-xs flex-shrink-0">
                  {currentProject.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-slate-700 truncate">{currentProject.name}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
            </button>
            
            {showProjectMenu && (
              <div className="absolute top-full left-4 right-4 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1">
                {projects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setCurrentProjectId(p.id); setShowProjectMenu(false); }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 ${currentProjectId === p.id ? 'text-indigo-600 font-medium' : 'text-slate-700'}`}
                  >
                    <div className="w-5 h-5 bg-slate-100 rounded flex items-center justify-center text-slate-500 font-bold text-xs flex-shrink-0">
                      {p.name.charAt(0)}
                    </div>
                    <span className="truncate">{p.name}</span>
                  </button>
                ))}
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      createNewProject();
                      setShowProjectMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Nuevo Proyecto
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        <nav className="p-4 space-y-2 flex flex-col h-[calc(100%-4rem)]">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                activeTab === item.id 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
            </button>
          ))}
          
          <div className="mt-auto pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                activeTab === 'settings' 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="font-medium text-sm">Configuración</span>}
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center gap-2 text-slate-400 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 w-64">
              <Search className="w-4 h-4" />
              <input type="text" placeholder="Buscar..." className="bg-transparent border-none outline-none text-sm w-full" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 pl-4 border-l border-slate-200 hover:opacity-80 transition-opacity"
              >
                <div className="text-right hidden md:block">
                  <div className="text-sm font-medium text-slate-900">{currentUser?.name.split(' ')[0]}</div>
                  <div className="text-xs text-slate-500">{currentUser?.role}</div>
                </div>
                <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                  {currentUser?.name.charAt(0)}
                </div>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
                  <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cambiar Usuario</div>
                  {MOCK_USERS.map(user => (
                    <button
                      key={user.id}
                      onClick={() => { login(user); setShowUserMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${currentUser?.id === user.id ? 'text-indigo-600 font-medium bg-indigo-50/50' : 'text-slate-700'}`}
                    >
                      {user.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {activeTab === 'settings' ? 'Configuración' : NAV_ITEMS.find(i => i.id === activeTab)?.label}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {eventConfig.eventName} — {new Date(eventConfig.eventDate).getFullYear()}
              </p>
            </div>
            {activeTab !== 'dashboard' && activeTab !== 'settings' && (
              <button 
                onClick={() => {
                  // This button could trigger the "Add" action of the active view
                  // For now we can just let the views handle their own add actions
                }}
                className="hidden bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nuevo Item
              </button>
            )}
          </div>

          {renderContent()}
        </div>
      </main>
    </div>
  );
}
