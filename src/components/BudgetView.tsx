import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, DollarSign } from 'lucide-react';
import { BudgetItem } from '../types';
import { useAuth } from '../context/AuthContext';

interface BudgetViewProps {
  items: BudgetItem[];
  setItems: React.Dispatch<React.SetStateAction<BudgetItem[]>>;
}

export default function BudgetView({ items, setItems }: BudgetViewProps) {
  const { hasPermission } = useAuth();
  const canManageFinances = hasPermission('manage:finances');

  const [isAdding, setIsAdding] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [tempItem, setTempItem] = useState<Partial<BudgetItem>>({});

  const totalAllocated = items.reduce((acc, item) => acc + item.allocated, 0);
  const totalSpent = items.reduce((acc, item) => acc + item.spent, 0);

  const handleDelete = (index: number) => {
    if (!canManageFinances) return;
    if (confirm('¿Eliminar esta partida presupuestaria?')) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const startEdit = (index: number, item: BudgetItem) => {
    if (!canManageFinances) return;
    setEditingIdx(index);
    setTempItem({ ...item });
  };

  const saveEdit = () => {
    if (editingIdx !== null && tempItem.category) {
      setItems(items.map((item, i) => i === editingIdx ? { ...item, ...tempItem } as BudgetItem : item));
      setEditingIdx(null);
      setTempItem({});
    }
  };

  const saveAdd = () => {
    if (tempItem.category) {
      const newItem: BudgetItem = {
        category: tempItem.category || 'Nueva Partida',
        allocated: Number(tempItem.allocated) || 0,
        spent: Number(tempItem.spent) || 0,
        notes: tempItem.notes || ''
      };
      setItems([...items, newItem]);
      setIsAdding(false);
      setTempItem({});
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-sm text-slate-500 mb-1">Presupuesto Total</div>
          <div className="text-2xl font-bold text-slate-900">${totalAllocated.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-sm text-slate-500 mb-1">Ejecutado</div>
          <div className="text-2xl font-bold text-indigo-600">${totalSpent.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-sm text-slate-500 mb-1">Disponible</div>
          <div className="text-2xl font-bold text-green-600">${(totalAllocated - totalSpent).toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Detalle Presupuestario</h2>
          {canManageFinances && (
            <button 
              onClick={() => { setIsAdding(true); setTempItem({ category: '', allocated: 0, spent: 0, notes: '' }); }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nueva Partida
            </button>
          )}
        </div>

        {isAdding && (
          <div className="p-4 bg-indigo-50 border-b border-indigo-100 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-indigo-900 mb-1">Categoría</label>
                <input 
                  type="text" 
                  value={tempItem.category} 
                  onChange={e => setTempItem({...tempItem, category: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-indigo-200"
                  placeholder="Ej. Catering"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-indigo-900 mb-1">Asignado ($)</label>
                <input 
                  type="number" 
                  value={tempItem.allocated} 
                  onChange={e => setTempItem({...tempItem, allocated: Number(e.target.value)})}
                  className="w-full px-3 py-2 rounded-lg border border-indigo-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-indigo-900 mb-1">Gastado ($)</label>
                <input 
                  type="number" 
                  value={tempItem.spent} 
                  onChange={e => setTempItem({...tempItem, spent: Number(e.target.value)})}
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

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Categoría</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Asignado</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Ejecutado</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Notas</th>
                {canManageFinances && <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 group">
                  {editingIdx === idx ? (
                    <>
                      <td className="px-6 py-4">
                        <input 
                          type="text" 
                          value={tempItem.category} 
                          onChange={e => setTempItem({...tempItem, category: e.target.value})}
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="number" 
                          value={tempItem.allocated} 
                          onChange={e => setTempItem({...tempItem, allocated: Number(e.target.value)})}
                          className="w-24 px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="number" 
                          value={tempItem.spent} 
                          onChange={e => setTempItem({...tempItem, spent: Number(e.target.value)})}
                          className="w-24 px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="text" 
                          value={tempItem.notes} 
                          onChange={e => setTempItem({...tempItem, notes: e.target.value})}
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      {canManageFinances && (
                        <td className="px-6 py-4 text-right">
                          <button onClick={saveEdit} className="text-green-600 hover:bg-green-50 p-1 rounded mr-1"><Check className="w-4 h-4" /></button>
                          <button onClick={() => setEditingIdx(null)} className="text-red-600 hover:bg-red-50 p-1 rounded"><X className="w-4 h-4" /></button>
                        </td>
                      )}
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.category}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">${item.allocated.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-indigo-600 font-medium">${item.spent.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{item.notes}</td>
                      {canManageFinances && (
                        <td className="px-6 py-4 text-right transition-opacity">
                          <button onClick={() => startEdit(idx, item)} className="text-slate-400 hover:text-indigo-600 p-1"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(idx)} className="text-slate-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
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
