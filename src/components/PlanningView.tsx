import React, { useState } from 'react';
import { Plus, Trash2, Edit2, X, Check, AlertCircle } from 'lucide-react';
import { Task } from '../types';

interface PlanningViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function PlanningView({ tasks, setTasks }: PlanningViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempTask, setTempTask] = useState<Partial<Task>>({});
  
  // Filters
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleStatusChange = (id: number, newStatus: Task['status']) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setTempTask({ ...task });
  };

  const saveEdit = () => {
    if (editingId && tempTask.title) {
      setTasks(tasks.map(t => t.id === editingId ? { ...t, ...tempTask } as Task : t));
      setEditingId(null);
      setTempTask({});
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTempTask({});
  };

  const startAdd = () => {
    setIsAdding(true);
    setTempTask({
      category: 'General',
      title: '',
      status: 'pending',
      priority: 'medium'
    });
  };

  const saveAdd = () => {
    if (tempTask.title) {
      const newTask: Task = {
        id: Math.max(0, ...tasks.map(t => t.id)) + 1,
        category: tempTask.category || 'General',
        title: tempTask.title || '',
        status: tempTask.status as Task['status'] || 'pending',
        priority: tempTask.priority as Task['priority'] || 'medium'
      };
      setTasks([...tasks, newTask]);
      setIsAdding(false);
      setTempTask({});
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-900">Planificación de Tareas</h2>
        
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Buscar tarea..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select 
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Todas las Categorías</option>
            <option value="Estrategia">Estrategia</option>
            <option value="Logística">Logística</option>
            <option value="Ponentes">Ponentes</option>
            <option value="Marketing">Marketing</option>
            <option value="Auspicios">Auspicios</option>
            <option value="Alianzas">Alianzas</option>
            <option value="Legal">Legal</option>
          </select>
          <select 
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Todos los Estados</option>
            <option value="pending">Pendiente</option>
            <option value="in-progress">En Progreso</option>
            <option value="done">Completado</option>
          </select>
          <button 
            onClick={startAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Nueva
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="p-4 bg-indigo-50 border-b border-indigo-100 animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-indigo-900 mb-1">Tarea</label>
              <input 
                type="text" 
                value={tempTask.title || ''} 
                onChange={e => setTempTask({...tempTask, title: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Descripción de la tarea..."
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-indigo-900 mb-1">Fecha</label>
              <input 
                type="date" 
                value={tempTask.date || ''} 
                onChange={e => setTempTask({...tempTask, date: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-indigo-900 mb-1">Categoría</label>
              <select 
                value={tempTask.category}
                onChange={e => setTempTask({...tempTask, category: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Estrategia">Estrategia</option>
                <option value="Logística">Logística</option>
                <option value="Ponentes">Ponentes</option>
                <option value="Marketing">Marketing</option>
                <option value="Auspicios">Auspicios</option>
                <option value="Alianzas">Alianzas</option>
                <option value="Legal">Legal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-indigo-900 mb-1">Prioridad</label>
              <select 
                value={tempTask.priority}
                onChange={e => setTempTask({...tempTask, priority: e.target.value as Task['priority']})}
                className="w-full px-3 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
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
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Tarea</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Fecha</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Categoría</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Prioridad</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Estado</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {filteredTasks.map(task => (
            <tr key={task.id} className="hover:bg-slate-50 group">
              {editingId === task.id ? (
                <>
                  <td className="px-6 py-4">
                    <input 
                      type="text" 
                      value={tempTask.title} 
                      onChange={e => setTempTask({...tempTask, title: e.target.value})}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="date" 
                      value={tempTask.date || ''} 
                      onChange={e => setTempTask({...tempTask, date: e.target.value})}
                      className="w-full px-2 py-1 border rounded text-xs"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={tempTask.category}
                      onChange={e => setTempTask({...tempTask, category: e.target.value})}
                      className="px-2 py-1 border rounded w-full"
                    >
                      <option value="Estrategia">Estrategia</option>
                      <option value="Logística">Logística</option>
                      <option value="Ponentes">Ponentes</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Auspicios">Auspicios</option>
                      <option value="Alianzas">Alianzas</option>
                      <option value="Legal">Legal</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={tempTask.priority}
                      onChange={e => setTempTask({...tempTask, priority: e.target.value as Task['priority']})}
                      className="px-2 py-1 border rounded w-full"
                    >
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                      <option value="critical">Crítica</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={tempTask.status}
                      onChange={e => setTempTask({...tempTask, status: e.target.value as Task['status']})}
                      className="px-2 py-1 border rounded w-full"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="in-progress">En Progreso</option>
                      <option value="done">Completado</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={saveEdit} className="text-green-600 hover:bg-green-50 p-1 rounded mr-1"><Check className="w-4 h-4" /></button>
                    <button onClick={cancelEdit} className="text-red-600 hover:bg-red-50 p-1 rounded"><X className="w-4 h-4" /></button>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{task.title}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{task.date || '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{task.category}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full 
                      ${task.priority === 'critical' ? 'bg-red-100 text-red-700' : 
                        task.priority === 'high' ? 'bg-orange-100 text-orange-700' : 
                        'bg-slate-100 text-slate-600'}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-none outline-none cursor-pointer
                        ${task.status === 'done' ? 'bg-green-100 text-green-700' : 
                          task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 
                          'bg-slate-100 text-slate-600'}`}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="in-progress">En Progreso</option>
                      <option value="done">Completado</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(task)} className="text-slate-400 hover:text-indigo-600 p-1"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(task.id)} className="text-slate-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
