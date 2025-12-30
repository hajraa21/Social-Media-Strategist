import React from 'react';
import { MOCK_DAILY_STATS, MOCK_METRICS } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Activity, Users, Eye, TrendingUp } from 'lucide-react';

export const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics Overview</h1>
          <p className="text-slate-500">Track your performance growth across all channels.</p>
        </div>
        <select className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500">
           <option>Last 30 Days</option>
           <option>Last 90 Days</option>
           <option>Year to Date</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_METRICS.map((metric, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div className={`p-2 rounded-lg ${
                 idx === 0 ? 'bg-blue-50 text-blue-600' :
                 idx === 1 ? 'bg-purple-50 text-purple-600' :
                 idx === 2 ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
               }`}>
                 {idx === 0 && <Users size={20} />}
                 {idx === 1 && <Activity size={20} />}
                 {idx === 2 && <Eye size={20} />}
                 {idx === 3 && <TrendingUp size={20} />}
               </div>
               <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
                 metric.change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
               }`}>
                 {metric.change >= 0 ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
                 {Math.abs(metric.change)}%
               </span>
            </div>
            <div>
               <p className="text-slate-500 text-sm font-medium">{metric.name}</p>
               <h3 className="text-2xl font-bold text-slate-900 mt-1">
                 {metric.value.toLocaleString()}{metric.unit}
               </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Engagement Growth Chart */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80 flex flex-col">
            <h3 className="font-semibold text-slate-800 mb-6">Engagement Growth</h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_DAILY_STATS}>
                  <defs>
                    <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                  />
                  <Area type="monotone" dataKey="engagement" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorEngagement)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Reach Chart */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80 flex flex-col">
            <h3 className="font-semibold text-slate-800 mb-6">Total Reach vs. Impressions</h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_DAILY_STATS}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                  />
                  <Legend />
                  <Bar dataKey="reach" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Reach" />
                  <Bar dataKey="engagement" fill="#93c5fd" radius={[4, 4, 0, 0]} name="Impressions (x10)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
};