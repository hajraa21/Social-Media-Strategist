import React, { useState, useMemo } from 'react';
import { MOCK_DAILY_STATS, MOCK_METRICS, PLATFORMS } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Layers } from 'lucide-react';
import { UserPersona, Platform } from '../types';

export const Dashboard: React.FC<DashboardProps> = ({ persona, onNavigate }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');

  // Derive reactive chart data based on selected platform to show visual changes
  const chartData = useMemo(() => {
    if (selectedPlatform === 'all') return MOCK_DAILY_STATS;
    // Generate deterministic variations for each platform to show the graph changing smoothly
    const multiplier = selectedPlatform.length * 0.15;
    return MOCK_DAILY_STATS.map(stat => ({
      ...stat,
      engagement: Math.floor(stat.engagement * (0.6 + multiplier))
    }));
  }, [selectedPlatform]);

  const selectedPlatformObj = selectedPlatform === 'all' ? null : PLATFORMS.find(p => p.id === selectedPlatform);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">
            Hi, {persona.brandName}!
          </h1>
          <p className="text-emerald-700 dark:text-emerald-400 text-sm font-semibold mt-1 transition-colors">Strategic oversight for your digital presence.</p>
        </div>
        <button 
          onClick={() => onNavigate('generator')}
          className="bg-emerald-950 dark:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center space-x-3 shadow-xl shadow-emerald-900/20 hover:bg-emerald-900 dark:hover:bg-emerald-600 transition-all hover:-translate-y-0.5"
        >
          <Plus size={20} />
          <span>New Manifest</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {MOCK_METRICS.map((metric, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">{metric.name}</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-emerald-950 dark:text-white transition-colors">{metric.value.toLocaleString()}</span>
              {metric.change !== 0 && (
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">+{metric.change}%</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-xl min-h-[400px] flex flex-col transition-colors">
          <div className="flex justify-between items-center mb-10">
            <div>
               <h3 className="font-black text-emerald-950 dark:text-white text-sm uppercase tracking-widest transition-colors">Engagement Velocity</h3>
               <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1">Global performance metrics for {selectedPlatform === 'all' ? 'All Channels' : selectedPlatformObj?.name}</p>
            </div>
            <div className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-800/50 uppercase tracking-widest transition-colors">Rolling 7D</div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="rgba(16, 185, 129, 0.05)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dx={-15} />
                <Tooltip 
                  contentStyle={{borderRadius: '20px', border: 'none', backgroundColor: '#022c22', color: '#fff', boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.25)', fontSize: '12px', fontWeight: 'bold'}} 
                  itemStyle={{color: '#34d399'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorEngage)" 
                  dot={{r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 3}} 
                  activeDot={{r: 8, strokeWidth: 0, fill: '#34d399'}}
                  animationDuration={800}
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-xl transition-colors">
           <h3 className="font-black text-emerald-950 dark:text-white text-sm mb-6 uppercase tracking-widest transition-colors">Channel Matrix</h3>
           <div className="space-y-3">
             <button 
               onClick={() => setSelectedPlatform('all')}
               className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${selectedPlatform === 'all' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800' : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
             >
               <div className="flex items-center space-x-4">
                 <div className="p-2.5 bg-emerald-950 dark:bg-emerald-800 text-white rounded-xl shadow-lg shadow-emerald-900/20"><Layers size={18} /></div>
                 <span className="text-xs font-black text-emerald-950 dark:text-white uppercase tracking-widest transition-colors">Aggregated Stream</span>
               </div>
             </button>
             {PLATFORMS.map((p) => (
               <button 
                 key={p.id} 
                 onClick={() => setSelectedPlatform(p.id)}
                 className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${selectedPlatform === p.id ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 shadow-sm' : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
               >
                 <div className="flex items-center space-x-4">
                   <div className={`p-2.5 rounded-xl transition-colors ${p.bgColor}`}>
                     <span className={p.color}>{p.icon}</span>
                   </div>
                   <span className={`text-xs font-black transition-colors uppercase tracking-widest ${selectedPlatform === p.id ? 'text-emerald-900 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>{p.name}</span>
                 </div>
               </button>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

interface DashboardProps {
  persona: UserPersona;
  onNavigate: (tab: string) => void;
}