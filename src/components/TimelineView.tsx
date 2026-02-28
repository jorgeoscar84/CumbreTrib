import React, { useState } from 'react';
import { Plus, Calendar as CalendarIcon, CheckCircle2, Circle, Edit2, X, Check } from 'lucide-react';
import { Task } from '../types';

interface TimelineViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function TimelineView({ tasks, setTasks }: TimelineViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempTask, setTempTask] = useState<Partial<Task>>({});

  // Helper to get phase/month name
  const getPhaseName = (dateStr: string) => {
    if (!dateStr) return 'Sin Fecha';
    const date = new Date(dateStr);
    const month = date.getMonth(); // 0-11
    const year = date.getFullYear();
    
    // Custom grouping for Feb-Mar
    if (year === 2026 && (month === 1 || month === 2)) {
      return 'Febrero - Marzo';
    }
    
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${monthNames[month]} ${year}`;
  };

  // Group tasks by phase
  const groupedTasks = tasks.reduce((acc, task) => {
    const phase = task.date ? getPhaseName(task.date) : 'Sin Fecha';
    if (!acc[phase]) {
      acc[phase] = [];
    }
    acc[phase].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  // Sort phases
  const phaseOrder = ['Febrero - Marzo', 'Abril 2026', 'Mayo 2026', 'Junio 2026', 'Post-Evento'];
  const sortedPhases = Object.keys(groupedTasks).sort((a, b) => {
    const idxA = phaseOrder.indexOf(a);
    const idxB = phaseOrder.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  const handleSaveTask = () => {
    if (tempTask.title && tempTask.date) {
      if (editingId) {
        // Edit existing
        setTasks(tasks.map(t => t.id === editingId ? { ...t, ...tempTask } as Task : t));
        setEditingId(null);
      } else {
        // Add new
        const newTask: Task = {
          id: Math.max(0, ...tasks.map(t => t.id)) + 1,
          title: tempTask.title!,
          date: tempTask.date!,
          category: tempTask.category || 'General',
          status: 'pending',
          priority: 'medium'
        };
        setTasks([...tasks, newTask]);
        setIsAdding(false);
      }
      setTempTask({});
    }
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setTempTask({ ...task });
    setIsAdding(true); // Reuse the add form for editing
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    setTempTask({});
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Cronograma de Ejecución</h2>
          <p className="text-slate-500 text-sm">Las tareas se agrupan automáticamente según la fecha asignada.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
            Fases / Meses
          </button>
          <button 
            onClick={() => { setIsAdding(true); setTempTask({ category: 'General' }); }}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {editingId ? 'Editar Tarea' : 'Añadir Tarea'}
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 animate-in fade-in">
          <h3 className="font-semibold text-indigo-900 mb-4">{editingId ? 'Editar Tarea' : 'Nueva Tarea en Cronograma'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-indigo-900 mb-1">Tarea</label>
              <input 
                value={tempTask.title || ''}
                onChange={e => setTempTask({...tempTask, title: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-indigo-200"
                placeholder="Descripción de la tarea"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-indigo-900 mb-1">Fecha (Define la Fase)</label>
              <input 
                type="date"
                value={tempTask.date || ''}
                onChange={e => setTempTask({...tempTask, date: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-indigo-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-indigo-900 mb-1">Categoría</label>
              <select 
                value={tempTask.category || 'General'}
                onChange={e => setTempTask({...tempTask, category: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-indigo-200"
              >
                <option value="General">General</option>
                <option value="Estrategia">Estrategia</option>
                <option value="Logística">Logística</option>
                <option value="Marketing">Marketing</option>
                <option value="Ponentes">Ponentes</option>
                <option value="Auspicios">Auspicios</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Alianzas">Alianzas</option>
                <option value="Legal">Legal</option>
                <option value="Experiencia">Experiencia</option>
                <option value="Post-Evento">Post-Evento</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveTask} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                {editingId ? 'Actualizar' : 'Guardar'}
              </button>
              <button onClick={cancelEdit} className="px-3 py-2 text-slate-500 hover:bg-slate-200 rounded-lg">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-slate-200">
        {sortedPhases.map((phase, idx) => (
          <div key={phase} className="relative pl-12">
            <div className="absolute left-2 top-0 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white shadow-sm transform -translate-x-1/2"></div>
            
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-xl font-bold text-slate-900">{phase}</h3>
              {idx === 0 && <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">Fase Actual</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupedTasks[phase].map(task => (
                <div 
                  key={task.id} 
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative"
                >
                  <div className="flex items-start gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setTasks(tasks.map(t => t.id === task.id ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t));
                      }}
                      className={`mt-1 transition-colors ${task.status === 'done' ? 'text-green-500 hover:text-green-600' : 'text-slate-300 hover:text-slate-400'}`}
                    >
                      {task.status === 'done' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </button>
                    <div className="flex-1 cursor-pointer" onClick={() => startEdit(task)}>
                      <h4 className={`font-medium ${task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                        {task.title}
                      </h4>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1 block">
                        {task.category}
                      </span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2">
                      <button onClick={() => startEdit(task)} className="p-1 hover:text-indigo-600">
                        <Edit2 className="w-4 h-4 text-slate-400 hover:text-indigo-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
