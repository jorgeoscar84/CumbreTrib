import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { EventConfig } from '../types';

export interface University {
  id: number;
  name: string;
  status: 'pending' | 'contacted' | 'negotiation' | 'signed';
  students: number;
  contact: string;
}

interface AlliancesViewProps {
  universities: University[];
  setUniversities: React.Dispatch<React.SetStateAction<University[]>>;
  config: EventConfig;
  setConfig: React.Dispatch<React.SetStateAction<EventConfig>>;
}

export default function AlliancesView({ universities, setUniversities, config, setConfig }: AlliancesViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempUni, setTempUni] = useState<Partial<University>>({});
  
  // Student Target State (now using config)
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState(config.studentTarget);

  const handleDelete = (id: number) => {
    if (confirm('¿Eliminar esta alianza?')) {
      setUniversities(universities.filter(u => u.id !== id));
    }
  };

  const startEdit = (uni: University) => {
    setEditingId(uni.id);
    setTempUni({ ...uni });
  };

  const saveEdit = () => {
    if (editingId && tempUni.name) {
      setUniversities(universities.map(u => u.id === editingId ? { ...u, ...tempUni } as University : u));
      setEditingId(null);
      setTempUni({});
    }
  };

  const saveAdd = () => {
    if (tempUni.name) {
      const newUni: University = {
        id: Math.max(0, ...universities.map(u => u.id)) + 1,
        name: tempUni.name,
        status: tempUni.status || 'pending',
        students: Number(tempUni.students) || 0,
        contact: tempUni.contact || ''
      };
      setUniversities([...universities, newUni]);
      setIsAdding(false);
      setTempUni({});
    }
  };

  const totalStudents = universities.reduce((acc, u) => acc + (u.status === 'signed' ? u.students : 0), 0);
  const signedCount = universities.filter(u => u.status === 'signed').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-sm text-slate-500 mb-1">Universidades Aliadas</div>
          <div className="text-2xl font-bold text-slate-900">{signedCount} / {config.universityTarget}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-sm text-slate-500 mb-1">Estudiantes Confirmados</div>
          <div className="text-2xl font-bold text-indigo-600">{totalStudents}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative group">
          <div className="text-sm text-slate-500 mb-1">Meta Estudiantes</div>
          {isEditingTarget ? (
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                value={tempTarget}
                onChange={e => setTempTarget(Number(e.target.value))}
                className="w-24 border rounded px-2 py-1 text-lg font-bold"
                autoFocus
              />
              <button 
                onClick={() => { setConfig({...config, studentTarget: tempTarget}); setIsEditingTarget(false); }}
                className="bg-green-100 text-green-700 p-1 rounded"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-600">{config.studentTarget.toLocaleString()}</div>
              <button 
                onClick={() => { setTempTarget(config.studentTarget); setIsEditingTarget(true); }}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 transition-opacity"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-semibold text-slate-900">Gestión de Universidades</h3>
          <button 
            onClick={() => { setIsAdding(true); setTempUni({}); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Universidad
          </button>
        </div>

        {isAdding && (
          <div className="p-4 bg-indigo-50 border-b border-indigo-100 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-indigo-900 mb-1">Universidad</label>
                <input 
                  value={tempUni.name || ''} 
                  onChange={e => setTempUni({...tempUni, name: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-indigo-200"
                  placeholder="Nombre Institución"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-indigo-900 mb-1">Contacto</label>
                <input 
                  value={tempUni.contact || ''} 
                  onChange={e => setTempUni({...tempUni, contact: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-indigo-200"
                  placeholder="Nombre / Cargo"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-indigo-900 mb-1">Estudiantes</label>
                <input 
                  type="number"
                  value={tempUni.students || ''} 
                  onChange={e => setTempUni({...tempUni, students: Number(e.target.value)})}
                  className="w-full px-3 py-2 rounded-lg border border-indigo-200"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={saveAdd} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700"><Check className="w-5 h-5" /></button>
                <button onClick={() => setIsAdding(false)} className="bg-white text-slate-500 p-2 rounded-lg border border-slate-200 hover:bg-slate-50"><X className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        )}

        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Universidad</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Contacto</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Estudiantes</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Estado</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {universities.map((uni) => (
              <tr key={uni.id} className="hover:bg-slate-50 group">
                {editingId === uni.id ? (
                  <>
                    <td className="px-6 py-4">
                      <input 
                        value={tempUni.name} 
                        onChange={e => setTempUni({...tempUni, name: e.target.value})}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        value={tempUni.contact} 
                        onChange={e => setTempUni({...tempUni, contact: e.target.value})}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="number"
                        value={tempUni.students} 
                        onChange={e => setTempUni({...tempUni, students: Number(e.target.value)})}
                        className="w-20 border rounded px-2 py-1"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={tempUni.status}
                        onChange={e => setTempUni({...tempUni, status: e.target.value as University['status']})}
                        className="border rounded px-2 py-1 w-full"
                      >
                        <option value="pending">Pendiente</option>
                        <option value="contacted">Contactado</option>
                        <option value="negotiation">Negociación</option>
                        <option value="signed">Firmado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={saveEdit} className="text-green-600 hover:bg-green-50 p-1 rounded mr-1"><Check className="w-4 h-4" /></button>
                      <button onClick={() => setEditingId(null)} className="text-red-600 hover:bg-red-50 p-1 rounded"><X className="w-4 h-4" /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{uni.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{uni.contact}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{uni.students > 0 ? uni.students : '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full 
                        ${uni.status === 'signed' ? 'bg-green-100 text-green-700' : 
                          uni.status === 'negotiation' ? 'bg-blue-100 text-blue-700' : 
                          uni.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-slate-100 text-slate-600'}`}>
                        {uni.status === 'signed' ? 'Firmado' : 
                         uni.status === 'negotiation' ? 'En Negociación' : 
                         uni.status === 'contacted' ? 'Contactado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(uni)} className="text-slate-400 hover:text-indigo-600 p-1"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(uni.id)} className="text-slate-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
