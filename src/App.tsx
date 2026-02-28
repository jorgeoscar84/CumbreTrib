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
  Settings
} from 'lucide-react';
import { NAV_ITEMS, INITIAL_TASKS, BUDGET_ITEMS, SPEAKERS, SPONSORS } from './constants';
import { Task, BudgetItem, Speaker, Sponsor, University, Campaign, MarketingMetric, EventConfig } from './types';
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Application State
  const [eventConfig, setEventConfig] = useState<EventConfig>({
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
  });

  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS as Task[]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(BUDGET_ITEMS);
  const [speakers, setSpeakers] = useState<Speaker[]>(SPEAKERS as Speaker[]);
  const [sponsors, setSponsors] = useState<Sponsor[]>(SPONSORS as Sponsor[]);
  const [universities, setUniversities] = useState<University[]>([
    { id: 1, name: 'ESPOL', status: 'signed', students: 150, contact: 'Decano Facultad Economía' },
    { id: 2, name: 'Universidad de Guayaquil', status: 'negotiation', students: 300, contact: 'Director Carrera CPA' },
    { id: 3, name: 'UEES', status: 'contacted', students: 0, contact: 'Coordinador Vinculación' },
    { id: 4, name: 'Universidad Católica', status: 'signed', students: 120, contact: 'Jefe de Carrera' },
    { id: 5, name: 'UTEG', status: 'pending', students: 0, contact: 'Pendiente' },
  ]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: 1, phase: 'Fase 1: Expectativa', dates: 'Feb - Mar', status: 'active', channels: ['Instagram', 'Email', 'PR'], progress: 45 },
    { id: 2, phase: 'Fase 2: Conversión', dates: 'Abr - May', status: 'pending', channels: ['Ads', 'Webinars', 'Visitas'], progress: 0 },
    { id: 3, phase: 'Fase 3: Último Impulso', dates: 'Junio', status: 'pending', channels: ['SMS', 'Remarketing'], progress: 0 },
  ]);
  const [marketingMetrics, setMarketingMetrics] = useState<MarketingMetric[]>([
    { id: 1, name: 'Alcance en Redes', value: 0, target: 50000, unit: 'number', platform: 'instagram', lastUpdated: new Date().toISOString().split('T')[0] },
    { id: 2, name: 'Leads Landing Page', value: 0, target: 2000, unit: 'number', platform: 'website', lastUpdated: new Date().toISOString().split('T')[0] },
    { id: 3, name: 'Tasa de Apertura Email', value: 0, target: 25, unit: 'percent', platform: 'email', lastUpdated: new Date().toISOString().split('T')[0] },
  ]);

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
        return <PlanningView tasks={tasks} setTasks={setTasks} />;
      case 'timeline':
        return <TimelineView tasks={tasks} setTasks={setTasks} />;
      case 'team':
        return <TeamView />;
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
        return <SettingsView config={eventConfig} setConfig={setEventConfig} />;
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
            <div className="font-bold text-xl text-indigo-900 tracking-tight">Cumbre<span className="text-indigo-600">Trib</span></div>
          ) : (
            <div className="font-bold text-xl text-indigo-600">CT</div>
          )}
        </div>
        
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
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <div className="text-sm font-medium text-slate-900">Admin Evento</div>
                <div className="text-xs text-slate-500">Organizador Principal</div>
              </div>
              <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                AE
              </div>
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

