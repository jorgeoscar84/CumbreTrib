import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, User, Mail, Phone, FileText } from 'lucide-react';
import { Speaker } from '../types';
import { useAuth } from '../context/AuthContext';

interface SpeakersViewProps {
  speakers: Speaker[];
  setSpeakers: React.Dispatch<React.SetStateAction<Speaker[]>>;
}

export default function SpeakersView({ speakers, setSpeakers }: SpeakersViewProps) {
  const { hasPermission } = useAuth();
  const canEditSpeakers = hasPermission('edit:speakers');

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempSpeaker, setTempSpeaker] = useState<Partial<Speaker>>({});

  const handleDelete = (id: number) => {
    if (!canEditSpeakers) return;
    if (confirm('¿Eliminar este ponente?')) {
      setSpeakers(speakers.filter(s => s.id !== id));
    }
  };

  const startEdit = (speaker: Speaker) => {
    if (!canEditSpeakers) return;
    setEditingId(speaker.id);
    setTempSpeaker({ ...speaker });
  };

  const saveEdit = () => {
    if (editingId && tempSpeaker.name) {
      setSpeakers(speakers.map(s => s.id === editingId ? { ...s, ...tempSpeaker } as Speaker : s));
      setEditingId(null);
      setTempSpeaker({});
    }
  };

  const saveAdd = () => {
    if (tempSpeaker.name) {
      const newSpeaker: Speaker = {
        id: Math.max(0, ...speakers.map(s => s.id)) + 1,
        name: tempSpeaker.name,
        role: tempSpeaker.role || 'Ponente',
        topic: tempSpeaker.topic || 'Tema por definir',
        status: tempSpeaker.status as Speaker['status'] || 'pending',
        type: tempSpeaker.type as Speaker['type'] || 'national',
        image: tempSpeaker.image || `https://picsum.photos/seed/${Math.random()}/200`,
        email: tempSpeaker.email,
        phone: tempSpeaker.phone,
        bio: tempSpeaker.bio
      };
      setSpeakers([...speakers, newSpeaker]);
      setIsAdding(false);
      setTempSpeaker({});
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {speakers.map(speaker => (
          <div key={speaker.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col relative group">
            {canEditSpeakers && (
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
                <button onClick={() => startEdit(speaker)} className="p-1 bg-white rounded-full shadow hover:text-indigo-600"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(speaker.id)} className="p-1 bg-white rounded-full shadow hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            )}
            
            {editingId === speaker.id ? (
              <div className="w-full space-y-3">
                <input 
                  value={tempSpeaker.name || ''} 
                  onChange={e => setTempSpeaker({...tempSpeaker, name: e.target.value})}
                  className="w-full font-bold border rounded px-2 py-1"
                  placeholder="Nombre"
                />
                <input 
                  value={tempSpeaker.role || ''} 
                  onChange={e => setTempSpeaker({...tempSpeaker, role: e.target.value})}
                  className="w-full text-sm border rounded px-2 py-1"
                  placeholder="Rol"
                />
                <input 
                  value={tempSpeaker.topic || ''} 
                  onChange={e => setTempSpeaker({...tempSpeaker, topic: e.target.value})}
                  className="w-full text-sm border rounded px-2 py-1"
                  placeholder="Tema"
                />
                <input 
                  type="email"
                  value={tempSpeaker.email || ''} 
                  onChange={e => setTempSpeaker({...tempSpeaker, email: e.target.value})}
                  className="w-full text-sm border rounded px-2 py-1"
                  placeholder="Email"
                />
                <input 
                  value={tempSpeaker.phone || ''} 
                  onChange={e => setTempSpeaker({...tempSpeaker, phone: e.target.value})}
                  className="w-full text-sm border rounded px-2 py-1"
                  placeholder="Teléfono"
                />
                <textarea 
                  value={tempSpeaker.bio || ''} 
                  onChange={e => setTempSpeaker({...tempSpeaker, bio: e.target.value})}
                  className="w-full text-sm border rounded px-2 py-1 h-20 resize-none"
                  placeholder="Biografía breve"
                />
                <div className="flex gap-2 justify-center">
                  <select 
                    value={tempSpeaker.status}
                    onChange={e => setTempSpeaker({...tempSpeaker, status: e.target.value as Speaker['status']})}
                    className="text-xs border rounded px-2 py-1 flex-1"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="contacted">Contactado</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="declined">Rechazado</option>
                  </select>
                  <select 
                    value={tempSpeaker.type}
                    onChange={e => setTempSpeaker({...tempSpeaker, type: e.target.value as Speaker['type']})}
                    className="text-xs border rounded px-2 py-1 flex-1"
                  >
                    <option value="national">Nacional</option>
                    <option value="international">Internacional</option>
                  </select>
                </div>
                <div className="flex gap-2 justify-center mt-2">
                  <button onClick={saveEdit} className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded text-xs font-medium">Guardar</button>
                  <button onClick={() => setEditingId(null)} className="flex-1 bg-slate-100 text-slate-600 px-3 py-2 rounded text-xs font-medium">Cancelar</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center text-center mb-4">
                  <img src={speaker.image} alt={speaker.name} className="w-24 h-24 rounded-full object-cover mb-4 bg-slate-100" />
                  <h3 className="text-lg font-bold text-slate-900">{speaker.name}</h3>
                  <p className="text-indigo-600 text-sm font-medium mb-1">{speaker.role}</p>
                  <p className="text-slate-500 text-sm line-clamp-2">{speaker.topic}</p>
                </div>

                <div className="space-y-2 mb-4 text-sm text-slate-600">
                  {speaker.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <a href={`mailto:${speaker.email}`} className="hover:text-indigo-600 truncate">{speaker.email}</a>
                    </div>
                  )}
                  {speaker.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <a href={`tel:${speaker.phone}`} className="hover:text-indigo-600 truncate">{speaker.phone}</a>
                    </div>
                  )}
                  {speaker.bio && (
                    <div className="flex items-start gap-2 mt-2">
                      <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
                      <p className="text-xs line-clamp-3 leading-relaxed">{speaker.bio}</p>
                    </div>
                  )}
                </div>

                <div className="mt-auto flex gap-2 w-full pt-4 border-t border-slate-100">
                  <span className={`flex-1 py-2 rounded-lg text-xs font-medium text-center
                    ${speaker.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                      speaker.status === 'contacted' ? 'bg-blue-100 text-blue-700' : 
                      speaker.status === 'declined' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-600'}`}>
                    {speaker.status.toUpperCase()}
                  </span>
                  <span className="flex-1 py-2 rounded-lg text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200 text-center">
                    {speaker.type === 'international' ? 'INTL' : 'NAC'}
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
        
        {isAdding ? (
          <div className="bg-white rounded-2xl shadow-sm border border-indigo-200 p-6 flex flex-col gap-3">
            <h3 className="text-center font-semibold text-indigo-900 mb-2">Nuevo Ponente</h3>
            <input 
              value={tempSpeaker.name || ''} 
              onChange={e => setTempSpeaker({...tempSpeaker, name: e.target.value})}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nombre Completo *"
              autoFocus
            />
            <input 
              value={tempSpeaker.role || ''} 
              onChange={e => setTempSpeaker({...tempSpeaker, role: e.target.value})}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Rol (ej. Keynote)"
            />
            <input 
              value={tempSpeaker.topic || ''} 
              onChange={e => setTempSpeaker({...tempSpeaker, topic: e.target.value})}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Tema de ponencia"
            />
            <input 
              type="email"
              value={tempSpeaker.email || ''} 
              onChange={e => setTempSpeaker({...tempSpeaker, email: e.target.value})}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Email"
            />
            <input 
              value={tempSpeaker.phone || ''} 
              onChange={e => setTempSpeaker({...tempSpeaker, phone: e.target.value})}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Teléfono"
            />
            <textarea 
              value={tempSpeaker.bio || ''} 
              onChange={e => setTempSpeaker({...tempSpeaker, bio: e.target.value})}
              className="w-full border rounded px-3 py-2 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Biografía breve"
            />
            <div className="flex gap-2">
              <select 
                value={tempSpeaker.type || 'national'}
                onChange={e => setTempSpeaker({...tempSpeaker, type: e.target.value as Speaker['type']})}
                className="w-1/2 border rounded px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="national">Nacional</option>
                <option value="international">Internacional</option>
              </select>
              <select 
                value={tempSpeaker.status || 'pending'}
                onChange={e => setTempSpeaker({...tempSpeaker, status: e.target.value as Speaker['status']})}
                className="w-1/2 border rounded px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="pending">Pendiente</option>
                <option value="contacted">Contactado</option>
                <option value="confirmed">Confirmado</option>
              </select>
            </div>
            <div className="flex gap-2 mt-2">
              <button 
                onClick={saveAdd} 
                disabled={!tempSpeaker.name}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Guardar
              </button>
              <button onClick={() => setIsAdding(false)} className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-lg text-sm font-medium hover:bg-slate-200">Cancelar</button>
            </div>
          </div>
        ) : (
          canEditSpeakers && (
            <button 
              onClick={() => { setIsAdding(true); setTempSpeaker({}); }}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors min-h-[300px]"
            >
              <Plus className="w-8 h-8 mb-2" />
              <span className="font-medium">Agregar Ponente</span>
            </button>
          )
        )}
      </div>
    </div>
  );
}
