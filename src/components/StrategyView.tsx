import React, { useState } from 'react';
import { Target, TrendingUp, CheckCircle, Plus, Trash2, Save } from 'lucide-react';

export default function StrategyView() {
  const [objectives, setObjectives] = useState([
    { id: 1, text: 'Posicionar la cumbre como el evento tributario #1 de Ecuador', status: 'defined' },
    { id: 2, text: 'Alcanzar 1,500-2,000 asistentes (70% universitarios)', status: 'defined' },
    { id: 3, text: 'Generar 50 leads comerciales de alto valor', status: 'pending' },
    { id: 4, text: 'Conseguir 10-15 auspiciantes', status: 'defined' },
  ]);

  const [kpis, setKpis] = useState([
    { id: 1, metric: 'Asistentes Registrados', target: '2,000', current: '0' },
    { id: 2, metric: 'Ingresos por Auspicios', target: '$120,000', current: '$27,000' },
    { id: 3, metric: 'Alianzas Universitarias', target: '10', current: '2' },
    { id: 4, metric: 'NPS Post-Evento', target: '> 80', current: '-' },
  ]);

  const [isAddingObj, setIsAddingObj] = useState(false);
  const [newObj, setNewObj] = useState('');

  const addObjective = () => {
    if (newObj) {
      setObjectives([...objectives, { id: Date.now(), text: newObj, status: 'pending' }]);
      setNewObj('');
      setIsAddingObj(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-indigo-900 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-800 rounded-full transform translate-x-1/3 -translate-y-1/3 opacity-50"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Estrategia General del Evento</h2>
          <p className="text-indigo-200 max-w-2xl">
            Definición de objetivos SMART, KPIs y lineamientos estratégicos para la Cumbre Tributaria Ecuador 2026.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Objectives Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg text-green-600">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Objetivos SMART</h3>
            </div>
            <button 
              onClick={() => setIsAddingObj(true)}
              className="text-sm text-indigo-600 font-medium hover:bg-indigo-50 px-3 py-1 rounded-lg transition-colors"
            >
              + Añadir
            </button>
          </div>

          <div className="space-y-3">
            {isAddingObj && (
              <div className="flex gap-2 mb-4 animate-in fade-in">
                <input 
                  value={newObj}
                  onChange={e => setNewObj(e.target.value)}
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Nuevo objetivo..."
                  autoFocus
                />
                <button onClick={addObjective} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700">
                  <Save className="w-4 h-4" />
                </button>
              </div>
            )}

            {objectives.map(obj => (
              <div key={obj.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                <CheckCircle className={`w-5 h-5 mt-0.5 ${obj.status === 'defined' ? 'text-green-500' : 'text-slate-300'}`} />
                <span className="text-slate-700 text-sm leading-relaxed flex-1">{obj.text}</span>
                <button 
                  onClick={() => setObjectives(objectives.filter(o => o.id !== obj.id))}
                  className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* KPIs Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">KPIs de Medición</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {kpis.map(kpi => (
              <div key={kpi.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">{kpi.metric}</div>
                <div className="flex items-end gap-2">
                  <span className="text-xl font-bold text-slate-900">{kpi.current}</span>
                  <span className="text-xs text-slate-400 mb-1">/ {kpi.target}</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategic Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-100">
          <h4 className="font-bold text-purple-900 mb-2">Experiencia</h4>
          <p className="text-sm text-purple-700">Enfoque en networking de alto valor y contenido práctico aplicable.</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-2xl border border-orange-100">
          <h4 className="font-bold text-orange-900 mb-2">Innovación</h4>
          <p className="text-sm text-orange-700">Integración de IA y Fintech en la agenda académica.</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-50 to-white p-6 rounded-2xl border border-cyan-100">
          <h4 className="font-bold text-cyan-900 mb-2">Comunidad</h4>
          <p className="text-sm text-cyan-700">Creación de red post-evento de profesionales tributarios.</p>
        </div>
      </div>
    </div>
  );
}
