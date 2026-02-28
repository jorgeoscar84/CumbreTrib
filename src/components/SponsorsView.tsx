import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { Sponsor, EventConfig } from '../types';

interface SponsorsViewProps {
  sponsors: Sponsor[];
  setSponsors: React.Dispatch<React.SetStateAction<Sponsor[]>>;
  config: EventConfig;
  setConfig: React.Dispatch<React.SetStateAction<EventConfig>>;
}

export default function SponsorsView({ sponsors, setSponsors, config, setConfig }: SponsorsViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempSponsor, setTempSponsor] = useState<Partial<Sponsor>>({});
  
  // Targets state (using config)
  const [isEditingTargets, setIsEditingTargets] = useState(false);
  const [tempTargets, setTempTargets] = useState({...config.sponsorTargets});

  const handleDelete = (id: number) => {
    if (confirm('¿Eliminar este auspiciante?')) {
      setSponsors(sponsors.filter(s => s.id !== id));
    }
  };

  const startEdit = (sponsor: Sponsor) => {
    setEditingId(sponsor.id);
    setTempSponsor({ ...sponsor });
  };

  const saveEdit = () => {
    if (editingId && tempSponsor.name) {
      setSponsors(sponsors.map(s => s.id === editingId ? { ...s, ...tempSponsor } as Sponsor : s));
      setEditingId(null);
      setTempSponsor({});
    }
  };

  const saveAdd = () => {
    if (tempSponsor.name) {
      const newSponsor: Sponsor = {
        id: Math.max(0, ...sponsors.map(s => s.id)) + 1,
        name: tempSponsor.name,
        level: tempSponsor.level as Sponsor['level'] || 'Bronce',
        amount: Number(tempSponsor.amount) || 0,
        status: tempSponsor.status as Sponsor['status'] || 'prospect'
      };
      setSponsors([...sponsors, newSponsor]);
      setIsAdding(false);
      setTempSponsor({});
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Gestión de Auspiciantes</h2>
          <button 
            onClick={() => { setIsAdding(true); setTempSponsor({}); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Auspiciante
          </button>
        </div>

        {isAdding && (
          <div className="p-4 bg-indigo-50 border-b border-indigo-100 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-indigo-900 mb-1">Empresa</label>
                <input 
                  type="text" 
                  value={tempSponsor.name || ''} 
                  onChange={e => setTempSponsor({...tempSponsor, name: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-indigo-200"
                  placeholder="Nombre Empresa"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-indigo-900 mb-1">Nivel</label>
                <select 
                  value={tempSponsor.level || 'Bronce'}
                  onChange={e => setTempSponsor({...tempSponsor, level: e.target.value as Sponsor['level']})}
                  className="w-full px-3 py-2 rounded-lg border border-indigo-200"
                >
                  <option value="Diamante">Diamante</option>
                  <option value="Oro">Oro</option>
                  <option value="Plata">Plata</option>
                  <option value="Bronce">Bronce</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-indigo-900 mb-1">Monto ($)</label>
                <input 
                  type="number" 
                  value={tempSponsor.amount || ''} 
                  onChange={e => setTempSponsor({...tempSponsor, amount: Number(e.target.value)})}
                  className="w-full px-3 py-2 rounded-lg border border-indigo-200"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={saveAdd} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Guardar</button>
                <button onClick={() => setIsAdding(false)} className="px-3 py-2 text-slate-500 hover:bg-slate-200 rounded-lg">Cancelar</button>
              </div>
            </div>
          </div>
        )}

        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Empresa</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Nivel</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Monto</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Estado</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sponsors.map(sponsor => (
              <tr key={sponsor.id} className="hover:bg-slate-50 group">
                {editingId === sponsor.id ? (
                  <>
                    <td className="px-6 py-4">
                      <input 
                        value={tempSponsor.name} 
                        onChange={e => setTempSponsor({...tempSponsor, name: e.target.value})}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={tempSponsor.level}
                        onChange={e => setTempSponsor({...tempSponsor, level: e.target.value as Sponsor['level']})}
                        className="border rounded px-2 py-1 w-full"
                      >
                        <option value="Diamante">Diamante</option>
                        <option value="Oro">Oro</option>
                        <option value="Plata">Plata</option>
                        <option value="Bronce">Bronce</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="number"
                        value={tempSponsor.amount} 
                        onChange={e => setTempSponsor({...tempSponsor, amount: Number(e.target.value)})}
                        className="w-24 border rounded px-2 py-1"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={tempSponsor.status}
                        onChange={e => setTempSponsor({...tempSponsor, status: e.target.value as Sponsor['status']})}
                        className="border rounded px-2 py-1 w-full"
                      >
                        <option value="prospect">Prospecto</option>
                        <option value="contacted">Contactado</option>
                        <option value="negotiation">Negociación</option>
                        <option value="confirmed">Confirmado</option>
                        <option value="paid">Pagado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={saveEdit} className="text-green-600 hover:bg-green-50 p-1 rounded mr-1"><Check className="w-4 h-4" /></button>
                      <button onClick={() => setEditingId(null)} className="text-red-600 hover:bg-red-50 p-1 rounded"><X className="w-4 h-4" /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{sponsor.name}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full border
                        ${sponsor.level === 'Diamante' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 
                          sponsor.level === 'Oro' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                          'bg-slate-50 text-slate-600 border-slate-200'}`}>
                        {sponsor.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">${sponsor.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full 
                        ${sponsor.status === 'confirmed' || sponsor.status === 'paid' ? 'bg-green-100 text-green-700' : 
                          sponsor.status === 'negotiation' ? 'bg-purple-100 text-purple-700' : 
                          'bg-slate-100 text-slate-600'}`}>
                        {sponsor.status === 'negotiation' ? 'Negociación' : 
                         sponsor.status === 'confirmed' ? 'Confirmado' : 
                         sponsor.status === 'paid' ? 'Pagado' : 'Prospecto'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(sponsor)} className="text-slate-400 hover:text-indigo-600 p-1"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(sponsor.id)} className="text-slate-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Metas de Patrocinio</h3>
            <button 
              onClick={() => {
                if (isEditingTargets) {
                  setConfig({...config, sponsorTargets: tempTargets});
                  setIsEditingTargets(false);
                } else {
                  setTempTargets({...config.sponsorTargets});
                  setIsEditingTargets(true);
                }
              }}
              className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
            >
              {isEditingTargets ? 'Guardar' : 'Editar Metas'}
            </button>
          </div>
          
          <div className="space-y-4">
            {(['Diamante', 'Oro', 'Plata', 'Bronce'] as const).map(level => {
              const count = sponsors.filter(s => s.level === level && (s.status === 'confirmed' || s.status === 'paid')).length;
              const target = config.sponsorTargets[level];
              const percent = (count / target) * 100;
              const color = level === 'Diamante' ? 'bg-cyan-400' : level === 'Oro' ? 'bg-yellow-400' : level === 'Plata' ? 'bg-slate-400' : 'bg-orange-400';
              
              return (
                <div key={level}>
                  <div className="flex justify-between text-sm mb-1 text-slate-300">
                    <span>{level}</span>
                    {isEditingTargets ? (
                      <input 
                        type="number" 
                        value={tempTargets[level]}
                        onChange={e => setTempTargets({...tempTargets, [level]: Number(e.target.value)})}
                        className="w-12 bg-white/10 border border-white/20 rounded px-1 text-right text-white text-xs"
                      />
                    ) : (
                      <span>{count} / {target}</span>
                    )}
                  </div>
                  {!isEditingTargets && (
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${Math.min(percent, 100)}%` }}></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
