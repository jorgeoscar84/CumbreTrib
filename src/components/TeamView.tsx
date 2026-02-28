import React, { useState } from 'react';
import { Plus, User, AlertTriangle, Trash2 } from 'lucide-react';

interface TeamMember {
  id: number;
  role: string;
  description: string;
}

interface CriticalPoint {
  id: number;
  text: string;
}

export default function TeamView() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 1, role: 'Director General', description: 'Supervisa todo, toma decisiones finales, relaciones institucionales de alto nivel.' },
    { id: 2, role: 'Coord. Logística', description: 'Gestión del venue, proveedores, montaje, transporte, catering, equipo AV.' },
    { id: 3, role: 'Dir. Marketing', description: 'Estrategia digital/offline, campañas, PR y medios.' },
    { id: 4, role: 'Coord. Ponentes', description: 'Contacto speakers, diseño de agenda, materiales.' },
    { id: 5, role: 'Coord. Comercial', description: 'Venta de paquetes de patrocinio, relación con auspiciantes.' },
    { id: 6, role: 'Coord. Alianzas', description: 'Relación con universidades, colegios profesionales y gremios.' },
    { id: 7, role: 'Coord. Experiencia', description: 'Registro, acreditación, kit de bienvenida, atención al público.' },
    { id: 8, role: 'Coord. Tecnología', description: 'Plataforma de ticketing, app, streaming, Wi-Fi.' },
    { id: 9, role: 'Coord. Legal', description: 'Permisos municipales, plan de contingencia, seguros.' },
  ]);

  const [criticalPoints, setCriticalPoints] = useState<CriticalPoint[]>([
    { id: 1, text: 'Delimitación estricta de responsabilidades entre el equipo interno y externo.' },
    { id: 2, text: 'Asignación de territorios para visitas a Universidades.' },
    { id: 3, text: 'Responsable legal de trámites (Secretaría de Gestión de Riesgos, GAD).' },
  ]);

  const [isAddingRole, setIsAddingRole] = useState(false);
  const [newRole, setNewRole] = useState({ role: '', description: '' });

  const handleAddRole = () => {
    if (newRole.role && newRole.description) {
      setTeamMembers([...teamMembers, { id: Date.now(), ...newRole }]);
      setIsAddingRole(false);
      setNewRole({ role: '', description: '' });
    }
  };

  const handleDeleteRole = (id: number) => {
    if (confirm('¿Eliminar este rol?')) {
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
            Agregar Rol
          </button>
        </div>

        {isAddingRole && (
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-blue-900 mb-1">Rol / Cargo</label>
                <input 
                  value={newRole.role}
                  onChange={e => setNewRole({...newRole, role: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-blue-200"
                  placeholder="Ej. Coordinador de Voluntarios"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-blue-900 mb-1">Responsabilidades</label>
                <input 
                  value={newRole.description}
                  onChange={e => setNewRole({...newRole, description: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-blue-200"
                  placeholder="Descripción breve de funciones"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddRole} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">Guardar Rol</button>
              <button onClick={() => setIsAddingRole(false)} className="bg-white text-slate-500 px-4 py-2 rounded-lg border border-slate-200 text-sm hover:bg-slate-50">Cancelar</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map(member => (
            <div key={member.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative">
              <h3 className="text-blue-900 font-bold text-lg mb-2">{member.role}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{member.description}</p>
              <button 
                onClick={() => handleDeleteRole(member.id)}
                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
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
