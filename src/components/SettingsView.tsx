import React, { useState } from 'react';
import { Save, Calendar, Users, DollarSign, Briefcase, GraduationCap, Lock } from 'lucide-react';
import { EventConfig } from '../types';
import { useAuth } from '../context/AuthContext';

interface SettingsViewProps {
  config: EventConfig;
  setConfig: React.Dispatch<React.SetStateAction<EventConfig>>;
}

export default function SettingsView({ config, setConfig }: SettingsViewProps) {
  const { hasPermission } = useAuth();
  const canManageConfig = hasPermission('manage:config');

  const [tempConfig, setTempConfig] = useState<EventConfig>({ ...config });
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (!canManageConfig) return;
    setConfig(tempConfig);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
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
        <h2 className="text-xl font-bold text-slate-900 mb-6">Configuración del Evento</h2>
        
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

          <div className="pt-6 border-t border-slate-100 flex justify-end">
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
