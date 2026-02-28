import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, User } from 'lucide-react';
import { Speaker } from '../types';

interface SpeakersViewProps {
  speakers: Speaker[];
  setSpeakers: React.Dispatch<React.SetStateAction<Speaker[]>>;
}

export default function SpeakersView({ speakers, setSpeakers }: SpeakersViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempSpeaker, setTempSpeaker] = useState<Partial<Speaker>>({});

  const handleDelete = (id: number) => {
    if (confirm('¿Eliminar este ponente?')) {
      setSpeakers(speakers.filter(s => s.id !== id));
    }
  };

  const startEdit = (speaker: Speaker) => {
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
        image: tempSpeaker.image || `https://picsum.photos/seed/${Math.random()}/200`
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
          <div key={speaker.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center relative group">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button onClick={() => startEdit(speaker)} className="p-1 bg-white rounded-full shadow hover:text-indigo-600"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(speaker.id)} className="p-1 bg-white rounded-full shadow hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
            
            {editingId === speaker.id ? (
              <div className="w-full space-y-3">
                <input 
                  value={tempSpeaker.name} 
                  onChange={e => setTempSpeaker({...tempSpeaker, name: e.target.value})}
                  className="w-full text-center font-bold border rounded px-2 py-1"
                  placeholder="Nombre"
                />
                <input 
                  value={tempSpeaker.role} 
                  onChange={e => setTempSpeaker({...tempSpeaker, role: e.target.value})}
                  className="w-full text-center text-sm border rounded px-2 py-1"
                  placeholder="Rol"
                />
                <input 
                  value={tempSpeaker.topic} 
                  onChange={e => setTempSpeaker({...tempSpeaker, topic: e.target.value})}
                  className="w-full text-center text-sm border rounded px-2 py-1"
                  placeholder="Tema"
                />
                <div className="flex gap-2 justify-center">
                  <select 
                    value={tempSpeaker.status}
                    onChange={e => setTempSpeaker({...tempSpeaker, status: e.target.value as Speaker['status']})}
                    className="text-xs border rounded px-2 py-1"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="contacted">Contactado</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="declined">Rechazado</option>
                  </select>
                  <select 
                    value={tempSpeaker.type}
                    onChange={e => setTempSpeaker({...tempSpeaker, type: e.target.value as Speaker['type']})}
                    className="text-xs border rounded px-2 py-1"
                  >
                    <option value="national">Nacional</option>
                    <option value="international">Internacional</option>
                  </select>
                </div>
                <div className="flex gap-2 justify-center mt-2">
                  <button onClick={saveEdit} className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs">Guardar</button>
                  <button onClick={() => setEditingId(null)} className="bg-slate-100 text-slate-600 px-3 py-1 rounded text-xs">Cancelar</button>
                </div>
              </div>
            ) : (
              <>
                <img src={speaker.image} alt={speaker.name} className="w-24 h-24 rounded-full object-cover mb-4 bg-slate-100" />
                <h3 className="text-lg font-bold text-slate-900">{speaker.name}</h3>
                <p className="text-indigo-600 text-sm font-medium mb-2">{speaker.role}</p>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{speaker.topic}</p>
                <div className="mt-auto flex gap-2 w-full">
                  <span className={`flex-1 py-2 rounded-lg text-xs font-medium 
                    ${speaker.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                      speaker.status === 'contacted' ? 'bg-blue-100 text-blue-700' : 
                      speaker.status === 'declined' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-600'}`}>
                    {speaker.status.toUpperCase()}
                  </span>
                  <span className="flex-1 py-2 rounded-lg text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                    {speaker.type === 'international' ? 'INTL' : 'NAC'}
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
        
        {isAdding ? (
          <div className="bg-white rounded-2xl shadow-sm border border-indigo-200 p-6 flex flex-col gap-3">
            <h3 className="text-center font-semibold text-indigo-900">Nuevo Ponente</h3>
            <input 
              value={tempSpeaker.name || ''} 
              onChange={e => setTempSpeaker({...tempSpeaker, name: e.target.value})}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Nombre Completo"
              autoFocus
            />
            <input 
              value={tempSpeaker.role || ''} 
              onChange={e => setTempSpeaker({...tempSpeaker, role: e.target.value})}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Rol (ej. Keynote)"
            />
            <input 
              value={tempSpeaker.topic || ''} 
              onChange={e => setTempSpeaker({...tempSpeaker, topic: e.target.value})}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Tema de ponencia"
            />
            <div className="flex gap-2">
              <select 
                value={tempSpeaker.type || 'national'}
                onChange={e => setTempSpeaker({...tempSpeaker, type: e.target.value as Speaker['type']})}
                className="w-1/2 border rounded px-2 py-2 text-sm"
              >
                <option value="national">Nacional</option>
                <option value="international">Internacional</option>
              </select>
              <select 
                value={tempSpeaker.status || 'pending'}
                onChange={e => setTempSpeaker({...tempSpeaker, status: e.target.value as Speaker['status']})}
                className="w-1/2 border rounded px-2 py-2 text-sm"
              >
                <option value="pending">Pendiente</option>
                <option value="contacted">Contactado</option>
                <option value="confirmed">Confirmado</option>
              </select>
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={saveAdd} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm">Guardar</button>
              <button onClick={() => setIsAdding(false)} className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-lg text-sm">Cancelar</button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => { setIsAdding(true); setTempSpeaker({}); }}
            className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors min-h-[300px]"
          >
            <Plus className="w-8 h-8 mb-2" />
            <span className="font-medium">Agregar Ponente</span>
          </button>
        )}
      </div>
    </div>
  );
}
