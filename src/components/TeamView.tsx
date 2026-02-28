import React, { useState } from 'react';
import { Plus, User, AlertTriangle, Trash2, Mail, Phone } from 'lucide-react';
import { TeamMember } from '../types';

interface CriticalPoint {
  id: number;
  text: string;
}

interface TeamViewProps {
  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
}

export default function TeamView({ teamMembers, setTeamMembers }: TeamViewProps) {
  const [criticalPoints, setCriticalPoints] = useState<CriticalPoint[]>([
    { id: 1, text: 'Delimitación estricta de responsabilidades entre el equipo interno y externo.' },
    { id: 2, text: 'Asignación de territorios para visitas a Universidades.' },
    { id: 3, text: 'Responsable legal de trámites (Secretaría de Gestión de Riesgos, GAD).' },
  ]);

  const [isAddingRole, setIsAddingRole] = useState(false);
  const [newRole, setNewRole] = useState<Partial<TeamMember>>({ name: '', role: '', email: '', phone: '', description: '' });

  const handleAddRole = () => {
    if (newRole.role && newRole.description && newRole.name) {
      setTeamMembers([...teamMembers, { id: Date.now(), ...newRole } as TeamMember]);
      setIsAddingRole(false);
      setNewRole({ name: '', role: '', email: '', phone: '', description: '' });
    }
  };

  const handleDeleteRole = (id: number) => {
    if (confirm('¿Eliminar este miembro del equipo?')) {
      setTeamMembers(teamMembers.filter(m => m.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Team Structure Section */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Estructura del Equipo</h2>
              <p className="text-slate-500 text-sm">Define los roles y responsabilidades para el evento.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAddingRole(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Miembro
          </button>
        </div>

        {isAddingRole && (
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-blue-900 mb-1">Nombre Completo *</label>
                <input 
                  value={newRole.name}
                  onChange={e => setNewRole({...newRole, name: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-blue-200"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-blue-900 mb-1">Rol / Cargo *</label>
                <input 
                  value={newRole.role}
                  onChange={e => setNewRole({...newRole, role: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-blue-200"
                  placeholder="Ej. Coordinador de Voluntarios"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-blue-900 mb-1">Email</label>
                <input 
                  type="email"
                  value={newRole.email}
                  onChange={e => setNewRole({...newRole, email: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-blue-200"
                  placeholder="juan@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-blue-900 mb-1">Teléfono</label>
                <input 
                  value={newRole.phone}
                  onChange={e => setNewRole({...newRole, phone: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-blue-200"
                  placeholder="0991234567"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-blue-900 mb-1">Responsabilidades *</label>
                <input 
                  value={newRole.description}
                  onChange={e => setNewRole({...newRole, description: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-blue-200"
                  placeholder="Descripción breve de funciones"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleAddRole} 
                disabled={!newRole.name || !newRole.role || !newRole.description}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Guardar Miembro
              </button>
              <button onClick={() => setIsAddingRole(false)} className="bg-white text-slate-500 px-4 py-2 rounded-lg border border-slate-200 text-sm hover:bg-slate-50">Cancelar</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map(member => (
            <div key={member.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-slate-900 font-bold text-lg">{member.name}</h3>
                  <span className="text-blue-600 font-medium text-sm">{member.role}</span>
                </div>
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                  {member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {member.email && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${member.email}`} className="hover:text-blue-600">{member.email}</a>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${member.phone}`} className="hover:text-blue-600">{member.phone}</a>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-slate-600 text-sm leading-relaxed">{member.description}</p>
              </div>

              <button 
                onClick={() => handleDeleteRole(member.id)}
                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Points Section */}
      <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-700" />
          <h3 className="text-lg font-bold text-yellow-900">Puntos Críticos a definir con la Agencia (Eventer)</h3>
        </div>
        <ul className="space-y-2">
          {criticalPoints.map(point => (
            <li key={point.id} className="flex items-start gap-2 text-yellow-800 text-sm">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-600 flex-shrink-0"></span>
              {point.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
