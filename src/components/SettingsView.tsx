import React, { useState, useRef } from 'react';
import { Save, Calendar, Users, DollarSign, Briefcase, GraduationCap, Lock, Download, Upload } from 'lucide-react';
import { EventConfig, Project, Task, TeamMember, Speaker, Sponsor, University, BudgetItem, Campaign, MarketingMetric } from '../types';
import { useAuth } from '../context/AuthContext';
import * as XLSX from 'xlsx';

interface SettingsViewProps {
  config: EventConfig;
  setConfig: React.Dispatch<React.SetStateAction<EventConfig>>;
  project?: Project;
  updateProject?: (updates: Partial<Project>) => void;
  onDeleteProject?: () => void;
}

export default function SettingsView({ config, setConfig, project, updateProject, onDeleteProject }: SettingsViewProps) {
  const { hasPermission, currentOrg, currentEvent } = useAuth();
  const canManageConfig = hasPermission('manage:config', currentOrg?.id, currentEvent?.id);

  const [tempConfig, setTempConfig] = useState<EventConfig>({ ...config });
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (!canManageConfig) return;
    setConfig(tempConfig);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExport = () => {
    if (!project) return;

    const wb = XLSX.utils.book_new();

    // 1. Config
    const configData = [
      { Clave: 'eventName', Valor: project.config.eventName },
      { Clave: 'eventDate', Valor: project.config.eventDate },
      { Clave: 'targetAttendees', Valor: project.config.targetAttendees },
      { Clave: 'sponsorsTarget', Valor: project.config.sponsorsTarget },
      { Clave: 'totalBudget', Valor: project.config.totalBudget },
      { Clave: 'universityTarget', Valor: project.config.universityTarget },
      { Clave: 'studentTarget', Valor: project.config.studentTarget },
      { Clave: 'sponsorTarget_Diamante', Valor: project.config.sponsorTargets.Diamante },
      { Clave: 'sponsorTarget_Oro', Valor: project.config.sponsorTargets.Oro },
      { Clave: 'sponsorTarget_Plata', Valor: project.config.sponsorTargets.Plata },
      { Clave: 'sponsorTarget_Bronce', Valor: project.config.sponsorTargets.Bronce },
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(configData), 'Configuracion');

    // 2. Team
    const teamData = project.teamMembers.map(m => ({
      ID: m.id, Nombre: m.name, Rol: m.role, Email: m.email, Telefono: m.phone, Descripcion: m.description
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(teamData), 'Equipo');

    // 3. Tasks
    const tasksData = project.tasks.map(t => ({
      ID: t.id, Categoria: t.category, Titulo: t.title, Descripcion: t.description || '', 
      Estado: t.status, Prioridad: t.priority, Fecha: t.date || '', AsignadoA_ID: t.assigneeId || ''
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(tasksData), 'Tareas');

    // 4. Speakers
    const speakersData = project.speakers.map(s => ({
      ID: s.id, Nombre: s.name, Rol: s.role, Tema: s.topic, Estado: s.status, Tipo: s.type,
      Email: s.email || '', Telefono: s.phone || '', Bio: s.bio || ''
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(speakersData), 'Ponentes');

    // 5. Sponsors
    const sponsorsData = project.sponsors.map(s => ({
      ID: s.id, Nombre: s.name, Nivel: s.level, Monto: s.amount, Estado: s.status,
      Contacto: s.contactName || '', Email: s.email || '', Telefono: s.phone || '', Web: s.website || ''
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sponsorsData), 'Auspiciantes');

    // 6. Universities
    const universitiesData = project.universities.map(u => ({
      ID: u.id, Nombre: u.name, Estado: u.status, Estudiantes: u.students, Contacto: u.contact,
      Email: u.email || '', Telefono: u.phone || '', Detalles: u.agreementDetails || ''
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(universitiesData), 'Universidades');

    // 7. Budget
    const budgetData = project.budgetItems.map(b => ({
      Categoria: b.category, Asignado: b.allocated, Gastado: b.spent, Notas: b.notes
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(budgetData), 'Presupuesto');

    // 8. Campaigns
    const campaignsData = project.campaigns.map(c => ({
      ID: c.id, Fase: c.phase, Fechas: c.dates, Estado: c.status, Canales: c.channels.join(', '), Progreso: c.progress
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(campaignsData), 'Campañas');

    // 9. Marketing Metrics
    const metricsData = project.marketingMetrics.map(m => ({
      ID: m.id, Nombre: m.name, Valor: m.value, Meta: m.target, Unidad: m.unit, Plataforma: m.platform, UltimaActualizacion: m.lastUpdated
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(metricsData), 'MetricasMarketing');

    XLSX.writeFile(wb, `Plantilla_${project.name.replace(/\s+/g, '_')}.xlsx`);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !updateProject) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });

        const updates: Partial<Project> = {};

        // 1. Config
        if (wb.Sheets['Configuracion']) {
          const configData = XLSX.utils.sheet_to_json<any>(wb.Sheets['Configuracion']);
          const newConfig: any = { sponsorTargets: {} };
          configData.forEach(row => {
            if (row.Clave.startsWith('sponsorTarget_')) {
              const level = row.Clave.replace('sponsorTarget_', '');
              newConfig.sponsorTargets[level] = Number(row.Valor) || 0;
            } else {
              newConfig[row.Clave] = ['eventName', 'eventDate'].includes(row.Clave) ? row.Valor : Number(row.Valor) || 0;
            }
          });
          updates.config = { ...config, ...newConfig };
          setTempConfig(updates.config as EventConfig);
        }

        // 2. Team
        if (wb.Sheets['Equipo']) {
          const teamData = XLSX.utils.sheet_to_json<any>(wb.Sheets['Equipo']);
          updates.teamMembers = teamData.map(row => ({
            id: Number(row.ID) || Date.now() + Math.random(),
            name: row.Nombre || '',
            role: row.Rol || '',
            email: row.Email || '',
            phone: row.Telefono || '',
            description: row.Descripcion || ''
          }));
        }

        // 3. Tasks
        if (wb.Sheets['Tareas']) {
          const tasksData = XLSX.utils.sheet_to_json<any>(wb.Sheets['Tareas']);
          updates.tasks = tasksData.map(row => ({
            id: Number(row.ID) || Date.now() + Math.random(),
            category: row.Categoria || 'General',
            title: row.Titulo || '',
            description: row.Descripcion || '',
            status: ['pending', 'in-progress', 'done'].includes(row.Estado) ? row.Estado : 'pending',
            priority: ['low', 'medium', 'high', 'critical'].includes(row.Prioridad) ? row.Prioridad : 'medium',
            date: row.Fecha || undefined,
            assigneeId: row.AsignadoA_ID ? Number(row.AsignadoA_ID) : undefined,
            subtasks: []
          }));
        }

        // 4. Speakers
        if (wb.Sheets['Ponentes']) {
          const speakersData = XLSX.utils.sheet_to_json<any>(wb.Sheets['Ponentes']);
          updates.speakers = speakersData.map(row => ({
            id: Number(row.ID) || Date.now() + Math.random(),
            name: row.Nombre || '',
            role: row.Rol || '',
            topic: row.Tema || '',
            status: ['pending', 'contacted', 'confirmed', 'declined'].includes(row.Estado) ? row.Estado : 'pending',
            type: ['national', 'international'].includes(row.Tipo) ? row.Tipo : 'national',
            email: row.Email || '',
            phone: row.Telefono || '',
            bio: row.Bio || ''
          }));
        }

        // 5. Sponsors
        if (wb.Sheets['Auspiciantes']) {
          const sponsorsData = XLSX.utils.sheet_to_json<any>(wb.Sheets['Auspiciantes']);
          updates.sponsors = sponsorsData.map(row => ({
            id: Number(row.ID) || Date.now() + Math.random(),
            name: row.Nombre || '',
            level: ['Diamante', 'Oro', 'Plata', 'Bronce'].includes(row.Nivel) ? row.Nivel : 'Bronce',
            amount: Number(row.Monto) || 0,
            status: ['prospect', 'contacted', 'negotiation', 'confirmed', 'paid'].includes(row.Estado) ? row.Estado : 'prospect',
            contactName: row.Contacto || '',
            email: row.Email || '',
            phone: row.Telefono || '',
            website: row.Web || ''
          }));
        }

        // 6. Universities
        if (wb.Sheets['Universidades']) {
          const universitiesData = XLSX.utils.sheet_to_json<any>(wb.Sheets['Universidades']);
          updates.universities = universitiesData.map(row => ({
            id: Number(row.ID) || Date.now() + Math.random(),
            name: row.Nombre || '',
            status: ['pending', 'contacted', 'negotiation', 'signed'].includes(row.Estado) ? row.Estado : 'pending',
            students: Number(row.Estudiantes) || 0,
            contact: row.Contacto || '',
            email: row.Email || '',
            phone: row.Telefono || '',
            agreementDetails: row.Detalles || ''
          }));
        }

        // 7. Budget
        if (wb.Sheets['Presupuesto']) {
          const budgetData = XLSX.utils.sheet_to_json<any>(wb.Sheets['Presupuesto']);
          updates.budgetItems = budgetData.map(row => ({
            category: row.Categoria || '',
            allocated: Number(row.Asignado) || 0,
            spent: Number(row.Gastado) || 0,
            notes: row.Notas || ''
          }));
        }

        // 8. Campaigns
        if (wb.Sheets['Campañas']) {
          const campaignsData = XLSX.utils.sheet_to_json<any>(wb.Sheets['Campañas']);
          updates.campaigns = campaignsData.map(row => ({
            id: Number(row.ID) || Date.now() + Math.random(),
            phase: row.Fase || '',
            dates: row.Fechas || '',
            status: ['active', 'pending', 'completed'].includes(row.Estado) ? row.Estado : 'pending',
            channels: row.Canales ? row.Canales.split(',').map((c: string) => c.trim()) : [],
            progress: Number(row.Progreso) || 0
          }));
        }

        // 9. Marketing Metrics
        if (wb.Sheets['MetricasMarketing']) {
          const metricsData = XLSX.utils.sheet_to_json<any>(wb.Sheets['MetricasMarketing']);
          updates.marketingMetrics = metricsData.map(row => ({
            id: Number(row.ID) || Date.now() + Math.random(),
            name: row.Nombre || '',
            value: Number(row.Valor) || 0,
            target: Number(row.Meta) || 0,
            unit: ['number', 'percent', 'currency'].includes(row.Unidad) ? row.Unidad : 'number',
            platform: ['instagram', 'facebook', 'linkedin', 'email', 'website', 'other'].includes(row.Plataforma) ? row.Plataforma : 'other',
            lastUpdated: row.UltimaActualizacion || new Date().toISOString().split('T')[0]
          }));
        }

        updateProject(updates);
        alert('Plantilla importada exitosamente.');
      } catch (error) {
        console.error('Error importing template:', error);
        alert('Hubo un error al importar la plantilla. Asegúrate de que el formato sea correcto.');
      }
    };
    reader.readAsBinaryString(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!canManageConfig) {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Acceso Restringido</h2>
        <p className="text-slate-500">No tienes permisos para modificar la configuración del evento.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Configuración del Evento</h2>
          <div className="flex gap-2">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar Plantilla
            </button>
            <div className="relative">
              <input 
                type="file" 
                accept=".xlsx, .xls" 
                onChange={handleImport}
                ref={fileInputRef}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Importar Plantilla"
              />
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
                <Upload className="w-4 h-4" />
                Importar Plantilla
              </button>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nombre del Evento</label>
            <input 
              type="text" 
              value={tempConfig.eventName}
              onChange={e => setTempConfig({...tempConfig, eventName: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Fecha del Evento</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                <input 
                  type="date" 
                  value={tempConfig.eventDate}
                  onChange={e => setTempConfig({...tempConfig, eventDate: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Meta de Asistentes</label>
              <div className="relative">
                <Users className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                <input 
                  type="number" 
                  value={tempConfig.targetAttendees}
                  onChange={e => setTempConfig({...tempConfig, targetAttendees: Number(e.target.value)})}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Presupuesto Total ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                <input 
                  type="number" 
                  value={tempConfig.totalBudget}
                  onChange={e => setTempConfig({...tempConfig, totalBudget: Number(e.target.value)})}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Meta de Auspiciantes (Total)</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                <input 
                  type="number" 
                  value={tempConfig.sponsorsTarget}
                  onChange={e => setTempConfig({...tempConfig, sponsorsTarget: Number(e.target.value)})}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Meta Universidades</label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                <input 
                  type="number" 
                  value={tempConfig.universityTarget}
                  onChange={e => setTempConfig({...tempConfig, universityTarget: Number(e.target.value)})}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Meta Estudiantes</label>
              <div className="relative">
                <Users className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                <input 
                  type="number" 
                  value={tempConfig.studentTarget}
                  onChange={e => setTempConfig({...tempConfig, studentTarget: Number(e.target.value)})}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Metas por Nivel de Auspicio</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(['Diamante', 'Oro', 'Plata', 'Bronce'] as const).map(level => (
                <div key={level}>
                  <label className="block text-xs font-medium text-slate-700 mb-1">{level}</label>
                  <input 
                    type="number" 
                    value={tempConfig.sponsorTargets[level]}
                    onChange={e => setTempConfig({
                      ...tempConfig, 
                      sponsorTargets: {
                        ...tempConfig.sponsorTargets,
                        [level]: Number(e.target.value)
                      }
                    })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
            {onDeleteProject && (
              <button 
                onClick={() => {
                  if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.')) {
                    onDeleteProject();
                  }
                }}
                className="text-red-600 hover:text-red-700 font-medium text-sm px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                Eliminar Proyecto
              </button>
            )}
            <button 
              onClick={handleSave}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-white transition-all ${
                isSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <Save className="w-5 h-5" />
              {isSaved ? 'Guardado Exitosamente' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
