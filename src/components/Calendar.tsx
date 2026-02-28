import React, { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { Task } from '../types';

interface CalendarProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function Calendar({ tasks, setTasks }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
  };

  const handleAddTask = () => {
    if (newTaskTitle && selectedDate) {
      const newTask: Task = {
        id: Math.max(0, ...tasks.map(t => t.id)) + 1,
        title: newTaskTitle,
        category: 'General',
        status: 'pending',
        priority: 'medium',
        date: selectedDate
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  const getTasksForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(task => task.date === dateStr);
  };

  const renderCalendarDays = () => {
    const days = [];
    // Empty cells for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-slate-50 border border-slate-100"></div>);
    }
    
    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayTasks = getTasksForDate(i);
      const isSelected = selectedDate === dateStr;
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), i).toDateString();

      days.push(
        <div 
          key={i} 
          onClick={() => handleDateClick(i)}
          className={`h-24 border border-slate-100 p-2 cursor-pointer transition-colors relative group
            ${isSelected ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-slate-50'}
            ${isToday ? 'bg-indigo-50/30' : ''}
          `}
        >
          <div className={`text-sm font-medium mb-1 flex justify-between items-center
            ${isToday ? 'text-indigo-600' : 'text-slate-700'}
          `}>
            <span>{i}</span>
            {isToday && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 rounded-full">Hoy</span>}
          </div>
          
          <div className="space-y-1 overflow-y-auto max-h-[calc(100%-24px)] custom-scrollbar">
            {dayTasks.map(task => (
              <div 
                key={task.id} 
                className={`text-[10px] px-1.5 py-0.5 rounded truncate border
                  ${task.status === 'done' ? 'bg-green-50 text-green-700 border-green-100 line-through opacity-60' : 
                    task.priority === 'critical' ? 'bg-red-50 text-red-700 border-red-100' :
                    'bg-white text-slate-600 border-slate-200 shadow-sm'}
                `}
                title={task.title}
              >
                {task.title}
              </div>
            ))}
          </div>

          {/* Add button on hover */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleDateClick(i);
              setIsAddingTask(true);
            }}
            className="absolute bottom-1 right-1 p-1 rounded-full bg-indigo-600 text-white transition-opacity hover:bg-indigo-700"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-slate-900">Calendario</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-full text-slate-500">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-slate-700 w-32 text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-full text-slate-500">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className="py-2 text-center text-xs font-semibold text-slate-500 uppercase">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1 auto-rows-fr">
        {renderCalendarDays()}
      </div>

      {/* Task Detail / Add Modal */}
      {(selectedDate || isAddingTask) && (
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-slate-900">
              {isAddingTask ? 'Nueva Tarea' : `Tareas del ${selectedDate}`}
            </h4>
            <button 
              onClick={() => {
                setSelectedDate(null);
                setIsAddingTask(false);
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {isAddingTask ? (
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Título de la tarea..."
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              />
              <button 
                onClick={handleAddTask}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                Agregar
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedDate && getTasksForDate(parseInt(selectedDate.split('-')[2])).length > 0 ? (
                getTasksForDate(parseInt(selectedDate.split('-')[2])).map(task => (
                  <div key={task.id} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        task.priority === 'critical' ? 'bg-red-500' : 
                        task.priority === 'high' ? 'bg-orange-500' : 
                        'bg-slate-300'
                      }`} />
                      <span className={`text-sm ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                        {task.title}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{task.category}</span>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-400 text-sm py-2">
                  No hay tareas para este día
                </div>
              )}
              <button 
                onClick={() => setIsAddingTask(true)}
                className="w-full mt-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50 py-2 rounded-lg transition-colors border border-dashed border-indigo-200"
              >
                + Agregar Tarea
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
