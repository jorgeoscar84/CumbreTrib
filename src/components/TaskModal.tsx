import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, User, Flag, AlignLeft, CheckSquare, Plus, Trash2 } from 'lucide-react';
import { Task, TeamMember } from '../types';
import { useAuth } from '../context/AuthContext';

interface TaskModalProps {
  task: Task;
  teamMembers: TeamMember[];
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default function TaskModal({ task, teamMembers, onClose, onSave, onDelete }: TaskModalProps) {
  const { hasPermission } = useAuth();
  const canEdit = hasPermission('edit:planning');
  const canDelete = hasPermission('delete:task');

  const [editedTask, setEditedTask] = useState<Task>(task);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleSave = () => {
    onSave(editedTask);
    setIsEditing(false);
  };

  const priorityColors = {
    low: 'bg-slate-100 text-slate-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700'
  };

  const statusColors = {
    pending: 'bg-slate-100 text-slate-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    done: 'bg-green-100 text-green-700'
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${statusColors[editedTask.status]}`}>
              <CheckSquare className="w-5 h-5" />
            </div>
            {isEditing ? (
              <input 
                value={editedTask.title}
                onChange={e => setEditedTask({...editedTask, title: e.target.value})}
                className="text-xl font-bold text-slate-900 border-b border-indigo-200 focus:border-indigo-500 outline-none bg-transparent px-1"
                autoFocus
              />
            ) : (
              <h2 className="text-xl font-bold text-slate-900">{editedTask.title}</h2>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status & Priority */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Estado</label>
                {isEditing ? (
                  <select 
                    value={editedTask.status}
                    onChange={e => setEditedTask({...editedTask, status: e.target.value as Task['status']})}
                    className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="in-progress">En Progreso</option>
                    <option value="done">Completado</option>
                  </select>
                ) : (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[editedTask.status]}`}>
                    {editedTask.status === 'in-progress' ? 'En Progreso' : editedTask.status === 'done' ? 'Completado' : 'Pendiente'}
                  </span>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Prioridad</label>
                {isEditing ? (
                  <select 
                    value={editedTask.priority}
                    onChange={e => setEditedTask({...editedTask, priority: e.target.value as Task['priority']})}
                    className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                    <option value="critical">Crítica</option>
                  </select>
                ) : (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${priorityColors[editedTask.priority]}`}>
                    <Flag className="w-3.5 h-3.5" />
                    {editedTask.priority === 'low' ? 'Baja' : editedTask.priority === 'medium' ? 'Media' : editedTask.priority === 'high' ? 'Alta' : 'Crítica'}
                  </span>
                )}
              </div>
            </div>

            {/* Date & Assignee */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Fecha Límite</label>
                {isEditing ? (
                  <input 
                    type="date"
                    value={editedTask.date || ''}
                    onChange={e => setEditedTask({...editedTask, date: e.target.value})}
                    className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-slate-700 text-sm">
                    <CalendarIcon className="w-4 h-4 text-slate-400" />
                    {editedTask.date ? new Date(editedTask.date).toLocaleDateString() : 'Sin fecha'}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Asignado a</label>
                {isEditing ? (
                  <select 
                    value={editedTask.assigneeId || ''}
                    onChange={e => setEditedTask({...editedTask, assigneeId: e.target.value ? Number(e.target.value) : undefined})}
                    className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  >
                    <option value="">Sin asignar</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.id}>{member.name}</option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center gap-2 text-slate-700 text-sm">
                    <User className="w-4 h-4 text-slate-400" />
                    {editedTask.assigneeId ? teamMembers.find(m => m.id === editedTask.assigneeId)?.name : 'Sin asignar'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Categoría</label>
            {isEditing ? (
              <input 
                value={editedTask.category}
                onChange={e => setEditedTask({...editedTask, category: e.target.value})}
                className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                placeholder="Ej. Logística, Marketing..."
              />
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-sm font-medium">
                {editedTask.category}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <AlignLeft className="w-4 h-4" />
              Descripción
            </label>
            {isEditing ? (
              <textarea 
                value={editedTask.description || ''}
                onChange={e => setEditedTask({...editedTask, description: e.target.value})}
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm min-h-[120px] resize-y"
                placeholder="Añade más detalles sobre esta tarea..."
              />
            ) : (
              <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700 min-h-[100px] whitespace-pre-wrap">
                {editedTask.description || <span className="text-slate-400 italic">Sin descripción.</span>}
              </div>
            )}
          </div>

          {/* Subtasks */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              Subtareas
            </label>
            <div className="space-y-2">
              {(editedTask.subtasks || []).map((subtask, index) => (
                <div key={subtask.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={(e) => {
                      const newSubtasks = [...(editedTask.subtasks || [])];
                      newSubtasks[index].completed = e.target.checked;
                      setEditedTask({ ...editedTask, subtasks: newSubtasks });
                      if (!isEditing) {
                        onSave({ ...editedTask, subtasks: newSubtasks });
                      }
                    }}
                    disabled={!canEdit && !isEditing}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                  />
                  {isEditing ? (
                    <input
                      type="text"
                      value={subtask.title}
                      onChange={(e) => {
                        const newSubtasks = [...(editedTask.subtasks || [])];
                        newSubtasks[index].title = e.target.value;
                        setEditedTask({ ...editedTask, subtasks: newSubtasks });
                      }}
                      className="flex-1 px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:border-indigo-500"
                      placeholder="Descripción de la subtarea"
                    />
                  ) : (
                    <span className={`text-sm flex-1 ${subtask.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                      {subtask.title || <span className="italic text-slate-400">Sin título</span>}
                    </span>
                  )}
                  {isEditing && (
                    <button
                      onClick={() => {
                        const newSubtasks = (editedTask.subtasks || []).filter((_, i) => i !== index);
                        setEditedTask({ ...editedTask, subtasks: newSubtasks });
                      }}
                      className="p-1 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (
                <button
                  onClick={() => {
                    const newSubtasks = [...(editedTask.subtasks || []), { id: Date.now(), title: '', completed: false }];
                    setEditedTask({ ...editedTask, subtasks: newSubtasks });
                  }}
                  className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Añadir subtarea
                </button>
              )}
              {(!editedTask.subtasks || editedTask.subtasks.length === 0) && !isEditing && (
                <div className="text-sm text-slate-400 italic">No hay subtareas.</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between rounded-b-2xl">
          {canDelete ? (
            <button 
              onClick={() => {
                if(confirm('¿Estás seguro de eliminar esta tarea?')) {
                  onDelete(editedTask.id);
                  onClose();
                }
              }}
              className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Eliminar Tarea
            </button>
          ) : <div></div>}

          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button 
                  onClick={() => {
                    setEditedTask(task);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  Guardar Cambios
                </button>
              </>
            ) : (
              canEdit && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  Editar Tarea
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
