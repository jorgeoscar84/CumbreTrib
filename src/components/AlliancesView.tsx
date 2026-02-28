import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, Mail, Phone, FileText, User } from 'lucide-react';
import { EventConfig, University } from '../types';
import { useAuth } from '../context/AuthContext';

interface AlliancesViewProps {
  universities: University[];
  setUniversities: React.Dispatch<React.SetStateAction<University[]>>;
  config: EventConfig;
  setConfig: React.Dispatch<React.SetStateAction<EventConfig>>;
}

export default function AlliancesView({ universities, setUniversities, config, setConfig }: AlliancesViewProps) {
  const { hasPermission } = useAuth();
  const canEditAlliances = hasPermission('edit:alliances');

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempUni, setTempUni] = useState<Partial<University>>({});
  
  // Student Target State (now using config)
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState(config.studentTarget);

  const handleDelete = (id: number) => {
    if (!canEditAlliances) return;
    if (confirm('¿Eliminar esta alianza?')) {
      setUniversities(universities.filter(u => u.id !== id));
    }
  };

  const startEdit = (uni: University) => {
    if (!canEditAlliances) return;
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
        contact: tempUni.contact || '',
        email: tempUni.email,
        phone: tempUni.phone,
        agreementDetails: tempUni.agreementDetails
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
              {canEditAlliances && (
                <button 
                  onClick={() => { setTempTarget(config.studentTarget); setIsEditingTarget(true); }}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 transition-opacity"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-semibold text-slate-900">Gestión de Universidades</h3>
          {canEditAlliances && (
            <button 
              onClick={() => { setIsAdding(true); setTempUni({}); }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nueva Universidad
            </button>
          )}
        </div>

        {isAdding && (
          <div className="p-4 bg-indigo-50 border-b border-indigo-100 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-indigo-900 mb-1">Universidad *</label>
                <input 
                  value={tempUni.name || ''} 
                  onChange={e => setTempUni({...tempUni, name: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nombre Institución"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-indigo-900 mb-1">Estudiantes</label>
                <input 
                  type="number"
                  value={tempUni.students || ''} 
                  onChange={e => setTempUni({...tempUni, students: Number(e.target.value)})}
                  className="w-full px-3 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-indigo-900 mb-1">Estado</label>
                <select 
                  value={tempUni.status || 'pending'}
                  onChange={e => setTempUni({...tempUni, status: e.target.value as University['status']})}
                  className="w-full px-3 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="pending">Pendiente</option>
                  <option value="contacted">Contactado</option>
                  <option value="negotiation">Negociación</option>
                  <option value="signed">Firmado</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-indigo-900 mb-1">Contacto</label>
                <input 
                  value={tempUni.contact || ''} 
                  onChange={e => setTempUni({...tempUni, contact: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nombre / Cargo"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-indigo-900 mb-1">Email</label>
                <input 
                  type="email"
                  value={tempUni.email || ''} 
                  onChange={e => setTempUni({...tempUni, email: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Email"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-indigo-900 mb-1">Teléfono</label>
                <input 
                  type="text"
                  value={tempUni.phone || ''} 
                  onChange={e => setTempUni({...tempUni, phone: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Teléfono"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-medium text-indigo-900 mb-1">Detalles del Acuerdo</label>
                <textarea 
                  value={tempUni.agreementDetails || ''} 
                  onChange={e => setTempUni({...tempUni, agreementDetails: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20 resize-none"
                  placeholder="Beneficios, compromisos, etc."
                />
              </div>

              <div className="md:col-span-4 flex gap-2 justify-end mt-2">
                <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-200 rounded-lg text-sm font-medium">Cancelar</button>
                <button 
                  onClick={saveAdd} 
                  disabled={!tempUni.name}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Universidad & Acuerdo</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Contacto</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Estudiantes</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Estado</th>
                {canEditAlliances && <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {universities.map((uni) => (
                <tr key={uni.id} className="hover:bg-slate-50 group">
                  {editingId === uni.id ? (
                    <td colSpan={canEditAlliances ? 5 : 4} className="p-4 bg-slate-50">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                          <input 
                            value={tempUni.name || ''} 
                            onChange={e => setTempUni({...tempUni, name: e.target.value})}
                            className="w-full border rounded px-2 py-1 mb-2 text-sm"
                            placeholder="Universidad"
                          />
                          <textarea 
                            value={tempUni.agreementDetails || ''} 
                            onChange={e => setTempUni({...tempUni, agreementDetails: e.target.value})}
                            className="w-full border rounded px-2 py-1 text-sm h-20 resize-none"
                            placeholder="Detalles del Acuerdo"
                          />
                        </div>
                        <div>
                          <input 
                            value={tempUni.contact || ''} 
                            onChange={e => setTempUni({...tempUni, contact: e.target.value})}
                            className="w-full border rounded px-2 py-1 mb-2 text-sm"
                            placeholder="Nombre Contacto"
                          />
                          <input 
                            type="email"
                            value={tempUni.email || ''} 
                            onChange={e => setTempUni({...tempUni, email: e.target.value})}
                            className="w-full border rounded px-2 py-1 mb-2 text-sm"
                            placeholder="Email"
                          />
                          <input 
                            value={tempUni.phone || ''} 
                            onChange={e => setTempUni({...tempUni, phone: e.target.value})}
                            className="w-full border rounded px-2 py-1 text-sm"
                            placeholder="Teléfono"
                          />
                        </div>
                        <div>
                          <input 
                            type="number"
                            value={tempUni.students || ''} 
                            onChange={e => setTempUni({...tempUni, students: Number(e.target.value)})}
                            className="w-full border rounded px-2 py-1 mb-2 text-sm"
                            placeholder="Estudiantes"
                          />
                          <select 
                            value={tempUni.status}
                            onChange={e => setTempUni({...tempUni, status: e.target.value as University['status']})}
                            className="border rounded px-2 py-1 w-full mb-4 text-sm"
                          >
                            <option value="pending">Pendiente</option>
                            <option value="contacted">Contactado</option>
                            <option value="negotiation">Negociación</option>
                            <option value="signed">Firmado</option>
                          </select>
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => setEditingId(null)} className="text-slate-500 hover:bg-slate-200 px-3 py-1 rounded text-sm">Cancelar</button>
                            <button onClick={saveEdit} className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded text-sm font-medium">Guardar</button>
                          </div>
                        </div>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{uni.name}</div>
                        {uni.agreementDetails && (
                          <div className="flex items-start gap-2 mt-2 text-slate-500">
                            <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <p className="text-xs line-clamp-2">{uni.agreementDetails}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {uni.contact && (
                          <div className="flex items-center gap-1 text-sm text-slate-900 mb-1">
                            <User className="w-3 h-3 text-slate-400" /> {uni.contact}
                          </div>
                        )}
                        {uni.email && (
                          <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                            <Mail className="w-3 h-3" /> <a href={`mailto:${uni.email}`} className="hover:text-indigo-600 truncate">{uni.email}</a>
                          </div>
                        )}
                        {uni.phone && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Phone className="w-3 h-3" /> <a href={`tel:${uni.phone}`} className="hover:text-indigo-600 truncate">{uni.phone}</a>
                          </div>
                        )}
                        {!uni.contact && !uni.email && !uni.phone && <span className="text-sm text-slate-400">-</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 align-top pt-5">{uni.students > 0 ? uni.students : '-'}</td>
                      <td className="px-6 py-4 align-top pt-5">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap
                          ${uni.status === 'signed' ? 'bg-green-100 text-green-700' : 
                            uni.status === 'negotiation' ? 'bg-blue-100 text-blue-700' : 
                            uni.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-slate-100 text-slate-600'}`}>
                          {uni.status === 'signed' ? 'Firmado' : 
                           uni.status === 'negotiation' ? 'En Negociación' : 
                           uni.status === 'contacted' ? 'Contactado' : 'Pendiente'}
                        </span>
                      </td>
                      {canEditAlliances && (
                        <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity align-top pt-4 whitespace-nowrap">
                          <button onClick={() => startEdit(uni)} className="text-slate-400 hover:text-indigo-600 p-1"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(uni.id)} className="text-slate-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      )}
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
