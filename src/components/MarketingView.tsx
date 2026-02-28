import React, { useState } from 'react';
import { Megaphone, Users, Briefcase, Edit2, Check, X, Plus, Trash2, TrendingUp, Target, Globe, Mail, Instagram, Facebook, Linkedin } from 'lucide-react';
import { Campaign, MarketingMetric } from '../types';
import { useAuth } from '../context/AuthContext';

interface MarketingViewProps {
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  metrics: MarketingMetric[];
  setMetrics: React.Dispatch<React.SetStateAction<MarketingMetric[]>>;
}

export default function MarketingView({ campaigns, setCampaigns, metrics, setMetrics }: MarketingViewProps) {
  const { hasPermission } = useAuth();
  const canEditMarketing = hasPermission('edit:marketing');

  // Campaign State
  const [isAddingCampaign, setIsAddingCampaign] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState<number | null>(null);
  const [tempCampaign, setTempCampaign] = useState<Partial<Campaign>>({});

  // Metric State
  const [isAddingMetric, setIsAddingMetric] = useState(false);
  const [editingMetricId, setEditingMetricId] = useState<number | null>(null);
  const [tempMetric, setTempMetric] = useState<Partial<MarketingMetric>>({});

  // --- Campaign Handlers ---
  const startAddCampaign = () => {
    if (!canEditMarketing) return;
    setIsAddingCampaign(true);
    setTempCampaign({
      phase: '',
      dates: '',
      status: 'pending',
      channels: [],
      progress: 0
    });
  };

  const saveAddCampaign = () => {
    if (tempCampaign.phase) {
      const newCampaign: Campaign = {
        id: Math.max(0, ...campaigns.map(c => c.id)) + 1,
        phase: tempCampaign.phase,
        dates: tempCampaign.dates || '',
        status: tempCampaign.status as Campaign['status'] || 'pending',
        channels: tempCampaign.channels || [],
        progress: Number(tempCampaign.progress) || 0
      };
      setCampaigns([...campaigns, newCampaign]);
      setIsAddingCampaign(false);
      setTempCampaign({});
    }
  };

  const startEditCampaign = (campaign: Campaign) => {
    if (!canEditMarketing) return;
    setEditingCampaignId(campaign.id);
    setTempCampaign({ ...campaign });
  };

  const saveEditCampaign = () => {
    if (editingCampaignId) {
      setCampaigns(campaigns.map(c => c.id === editingCampaignId ? { ...c, ...tempCampaign } as Campaign : c));
      setEditingCampaignId(null);
      setTempCampaign({});
    }
  };

  const toggleChannel = (channel: string) => {
    const currentChannels = tempCampaign.channels || [];
    if (currentChannels.includes(channel)) {
      setTempCampaign({ ...tempCampaign, channels: currentChannels.filter(c => c !== channel) });
    } else {
      setTempCampaign({ ...tempCampaign, channels: [...currentChannels, channel] });
    }
  };

  // --- Metric Handlers ---
  const startAddMetric = () => {
    if (!canEditMarketing) return;
    setIsAddingMetric(true);
    setTempMetric({
      name: '',
      value: 0,
      target: 0,
      unit: 'number',
      platform: 'other',
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  const saveAddMetric = () => {
    if (tempMetric.name) {
      const newMetric: MarketingMetric = {
        id: Math.max(0, ...metrics.map(m => m.id)) + 1,
        name: tempMetric.name,
        value: Number(tempMetric.value) || 0,
        target: Number(tempMetric.target) || 0,
        unit: tempMetric.unit as MarketingMetric['unit'] || 'number',
        platform: tempMetric.platform as MarketingMetric['platform'] || 'other',
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setMetrics([...metrics, newMetric]);
      setIsAddingMetric(false);
      setTempMetric({});
    }
  };

  const startEditMetric = (metric: MarketingMetric) => {
    if (!canEditMarketing) return;
    setEditingMetricId(metric.id);
    setTempMetric({ ...metric });
  };

  const saveEditMetric = () => {
    if (editingMetricId && tempMetric.name) {
      setMetrics(metrics.map(m => m.id === editingMetricId ? { ...m, ...tempMetric, lastUpdated: new Date().toISOString().split('T')[0] } as MarketingMetric : m));
      setEditingMetricId(null);
      setTempMetric({});
    }
  };

  const deleteMetric = (id: number) => {
    if (!canEditMarketing) return;
    if (confirm('¿Eliminar esta métrica?')) {
      setMetrics(metrics.filter(m => m.id !== id));
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="w-5 h-5 text-pink-600" />;
      case 'facebook': return <Facebook className="w-5 h-5 text-blue-600" />;
      case 'linkedin': return <Linkedin className="w-5 h-5 text-blue-700" />;
      case 'email': return <Mail className="w-5 h-5 text-yellow-600" />;
      case 'website': return <Globe className="w-5 h-5 text-indigo-600" />;
      default: return <TrendingUp className="w-5 h-5 text-slate-600" />;
    }
  };

  const availableChannels = ['Instagram', 'Email', 'PR', 'Ads', 'Webinars', 'Visitas', 'SMS', 'Remarketing', 'TikTok'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column: Campaigns */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">Campañas Activas</h2>
          {canEditMarketing && (
            <button 
              onClick={startAddCampaign}
              className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-100 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Nueva Campaña
            </button>
          )}
        </div>
        
        {isAddingCampaign && (
          <div className="p-6 rounded-2xl border border-indigo-200 bg-white shadow-md animate-in fade-in">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <input 
                  value={tempCampaign.phase} 
                  onChange={e => setTempCampaign({...tempCampaign, phase: e.target.value})}
                  className="font-bold text-lg border rounded px-2 py-1 w-full mr-2"
                  placeholder="Nombre de la Fase / Campaña"
                  autoFocus
                />
                <div className="flex gap-1">
                  <button onClick={saveAddCampaign} className="bg-green-100 text-green-700 p-1 rounded"><Check className="w-4 h-4" /></button>
                  <button onClick={() => setIsAddingCampaign(false)} className="bg-red-100 text-red-700 p-1 rounded"><X className="w-4 h-4" /></button>
                </div>
              </div>
              <input 
                value={tempCampaign.dates} 
                onChange={e => setTempCampaign({...tempCampaign, dates: e.target.value})}
                className="text-sm text-slate-500 border rounded px-2 py-1 w-full"
                placeholder="Fechas (ej. Feb - Mar)"
              />
              <select 
                value={tempCampaign.status}
                onChange={e => setTempCampaign({...tempCampaign, status: e.target.value as Campaign['status']})}
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value="pending">Pendiente</option>
                <option value="active">Activa</option>
                <option value="completed">Completada</option>
              </select>
              
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-2">Canales:</label>
                <div className="flex flex-wrap gap-2">
                  {availableChannels.map(ch => (
                    <button
                      key={ch}
                      onClick={() => toggleChannel(ch)}
                      className={`px-2 py-1 rounded text-xs border ${
                        tempCampaign.channels?.includes(ch) 
                          ? 'bg-indigo-100 border-indigo-200 text-indigo-700' 
                          : 'bg-white border-slate-200 text-slate-500'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {campaigns.map((camp) => (
          <div key={camp.id} className={`p-6 rounded-2xl border transition-all ${camp.status === 'active' ? 'bg-white border-indigo-200 shadow-md' : 'bg-slate-50 border-slate-200 opacity-90'}`}>
            {editingCampaignId === camp.id ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <input 
                    value={tempCampaign.phase} 
                    onChange={e => setTempCampaign({...tempCampaign, phase: e.target.value})}
                    className="font-bold text-lg border rounded px-2 py-1 w-full mr-2"
                  />
                  <div className="flex gap-1">
                    <button onClick={saveEditCampaign} className="bg-green-100 text-green-700 p-1 rounded"><Check className="w-4 h-4" /></button>
                    <button onClick={() => setEditingCampaignId(null)} className="bg-red-100 text-red-700 p-1 rounded"><X className="w-4 h-4" /></button>
                  </div>
                </div>
                <input 
                  value={tempCampaign.dates} 
                  onChange={e => setTempCampaign({...tempCampaign, dates: e.target.value})}
                  className="text-sm text-slate-500 border rounded px-2 py-1 w-full"
                />
                <select 
                  value={tempCampaign.status}
                  onChange={e => setTempCampaign({...tempCampaign, status: e.target.value as Campaign['status']})}
                  className="w-full border rounded px-2 py-1 text-sm"
                >
                  <option value="pending">Pendiente</option>
                  <option value="active">Activa</option>
                  <option value="completed">Completada</option>
                </select>
                
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-2">Canales:</label>
                  <div className="flex flex-wrap gap-2">
                    {availableChannels.map(ch => (
                      <button
                        key={ch}
                        onClick={() => toggleChannel(ch)}
                        className={`px-2 py-1 rounded text-xs border ${
                          tempCampaign.channels?.includes(ch) 
                            ? 'bg-indigo-100 border-indigo-200 text-indigo-700' 
                            : 'bg-white border-slate-200 text-slate-500'
                        }`}
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Progreso: {tempCampaign.progress}%</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={tempCampaign.progress} 
                    onChange={e => setTempCampaign({...tempCampaign, progress: Number(e.target.value)})}
                    className="w-full"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={`font-bold text-lg ${camp.status === 'active' ? 'text-indigo-900' : 'text-slate-700'}`}>{camp.phase}</h3>
                    <p className="text-sm text-slate-500">{camp.dates}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full 
                      ${camp.status === 'active' ? 'bg-green-100 text-green-700' : 
                        camp.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-200 text-slate-600'}`}>
                      {camp.status.toUpperCase()}
                    </span>
                    {canEditMarketing && (
                      <button onClick={() => startEditCampaign(camp)} className="text-slate-400 hover:text-indigo-600"><Edit2 className="w-4 h-4" /></button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-sm font-medium text-slate-700">Canales Activos:</div>
                  <div className="flex gap-2 flex-wrap">
                    {camp.channels.map(channel => (
                      <span key={channel} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>
                
                {(camp.status === 'active' || camp.progress > 0) && (
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Progreso de Campaña</span>
                      <span className="font-medium text-indigo-600">{camp.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: `${camp.progress}%` }}></div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Right Column: Metrics */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-900">KPIs y Métricas</h3>
            {canEditMarketing && (
              <button 
                onClick={startAddMetric}
                className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-100 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Agregar KPI
              </button>
            )}
          </div>

          {isAddingMetric && (
            <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="col-span-2">
                  <label className="text-xs font-medium text-slate-500">Nombre del KPI</label>
                  <input 
                    value={tempMetric.name} 
                    onChange={e => setTempMetric({...tempMetric, name: e.target.value})}
                    className="w-full border rounded px-2 py-1.5 text-sm"
                    placeholder="Ej. Seguidores Instagram"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Valor Actual</label>
                  <input 
                    type="number"
                    value={tempMetric.value} 
                    onChange={e => setTempMetric({...tempMetric, value: Number(e.target.value)})}
                    className="w-full border rounded px-2 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Meta / Objetivo</label>
                  <input 
                    type="number"
                    value={tempMetric.target} 
                    onChange={e => setTempMetric({...tempMetric, target: Number(e.target.value)})}
                    className="w-full border rounded px-2 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Unidad</label>
                  <select 
                    value={tempMetric.unit} 
                    onChange={e => setTempMetric({...tempMetric, unit: e.target.value as any})}
                    className="w-full border rounded px-2 py-1.5 text-sm"
                  >
                    <option value="number">Numérico</option>
                    <option value="percent">Porcentaje (%)</option>
                    <option value="currency">Moneda ($)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Plataforma</label>
                  <select 
                    value={tempMetric.platform} 
                    onChange={e => setTempMetric({...tempMetric, platform: e.target.value as any})}
                    className="w-full border rounded px-2 py-1.5 text-sm"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="email">Email</option>
                    <option value="website">Web / Landing</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={saveAddMetric} className="flex-1 bg-indigo-600 text-white py-1.5 rounded text-sm">Guardar</button>
                <button onClick={() => setIsAddingMetric(false)} className="flex-1 bg-white border border-slate-300 text-slate-600 py-1.5 rounded text-sm">Cancelar</button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {metrics.map(metric => (
              <div key={metric.id} className="group relative p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all">
                {editingMetricId === metric.id ? (
                  <div className="space-y-3">
                    <input 
                      value={tempMetric.name} 
                      onChange={e => setTempMetric({...tempMetric, name: e.target.value})}
                      className="w-full font-medium border rounded px-2 py-1"
                    />
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs text-slate-500">Actual</label>
                        <input 
                          type="number"
                          value={tempMetric.value} 
                          onChange={e => setTempMetric({...tempMetric, value: Number(e.target.value)})}
                          className="w-full border rounded px-2 py-1"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-slate-500">Meta</label>
                        <input 
                          type="number"
                          value={tempMetric.target} 
                          onChange={e => setTempMetric({...tempMetric, target: Number(e.target.value)})}
                          className="w-full border rounded px-2 py-1"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button onClick={saveEditMetric} className="bg-green-600 text-white px-3 py-1 rounded text-xs">Guardar</button>
                      <button onClick={() => setEditingMetricId(null)} className="bg-slate-200 text-slate-600 px-3 py-1 rounded text-xs">Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                          {getPlatformIcon(metric.platform || 'other')}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{metric.name}</div>
                          <div className="text-xs text-slate-500">Act: {metric.lastUpdated}</div>
                        </div>
                      </div>
                      {canEditMarketing && (
                        <div className="flex gap-1 transition-opacity">
                          <button onClick={() => startEditMetric(metric)} className="p-1 hover:bg-white rounded text-slate-400 hover:text-indigo-600"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => deleteMetric(metric.id)} className="p-1 hover:bg-white rounded text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-end justify-between mb-2">
                      <div className="text-2xl font-bold text-slate-900">
                        {metric.unit === 'currency' ? '$' : ''}
                        {metric.value.toLocaleString()}
                        {metric.unit === 'percent' ? '%' : ''}
                      </div>
                      <div className="text-sm font-medium text-slate-500 mb-1">
                        Meta: {metric.unit === 'currency' ? '$' : ''}
                        {metric.target.toLocaleString()}
                        {metric.unit === 'percent' ? '%' : ''}
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          (metric.value / metric.target) >= 1 ? 'bg-green-500' : 'bg-indigo-600'
                        }`} 
                        style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                      />
                    </div>
                  </>
                )}
              </div>
            ))}

            {metrics.length === 0 && (
              <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay métricas configuradas</p>
                {canEditMarketing && (
                  <button onClick={startAddMetric} className="text-indigo-600 text-sm font-medium mt-2 hover:underline">
                    Agregar mi primer KPI
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
