import React, { useState } from 'react';
import { X, User, Bell, Shield, CreditCard, HelpCircle, Mail, Book, Share2, Plus, CheckCircle2, AlertCircle, Moon, Sun } from 'lucide-react';
import { UserPersona, Platform } from '../types';
import { PLATFORMS } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  persona: UserPersona;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

type Tab = 'profile' | 'accounts' | 'notifications' | 'billing' | 'help';

interface AccountLink {
    platformId: Platform;
    handle: string;
    connected: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, persona, theme, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [accounts, setAccounts] = useState<AccountLink[]>(
      PLATFORMS.map(p => ({ platformId: p.id, handle: '', connected: false }))
  );

  if (!isOpen) return null;

  const toggleConnect = (id: Platform) => {
      setAccounts(prev => prev.map(acc => {
          if (acc.platformId === id) {
              return { ...acc, connected: !acc.connected, handle: acc.connected ? '' : `@${persona.brandName.toLowerCase().replace(/\s/g, '')}` };
          }
          return acc;
      }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="animate-in fade-in slide-in-from-right duration-300">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-slate-800 dark:text-white">Brand Identity</h3>
               <button 
                  onClick={toggleTheme}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs transition-all hover:bg-slate-200 dark:hover:bg-slate-700"
               >
                 {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                 <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
               </button>
             </div>
             <div className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Brand Name</label>
                 <input type="text" defaultValue={persona.brandName} className="w-full border-2 border-slate-100 dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:border-indigo-500 outline-none transition-all" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Industry</label>
                 <input type="text" defaultValue={persona.industry} className="w-full border-2 border-slate-100 dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:border-indigo-500 outline-none transition-all" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Target Audience</label>
                 <textarea defaultValue={persona.targetAudience} className="w-full border-2 border-slate-100 dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:border-indigo-500 outline-none h-32 resize-none transition-all" />
               </div>
             </div>
             <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6 flex justify-end">
               <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">Save Identity</button>
             </div>
          </div>
        );
      case 'accounts':
        return (
          <div className="animate-in fade-in slide-in-from-right duration-300">
             <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Social Connections</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Link your business handles to enable direct publishing and live sync.</p>
             </div>
             <div className="space-y-3">
                {PLATFORMS.map(p => {
                    const status = accounts.find(acc => acc.platformId === p.id);
                    return (
                        <div key={p.id} className="bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl bg-slate-50 dark:bg-slate-800 ${p.color}`}>
                                    {p.icon}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-white">{p.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        {status?.connected ? status.handle : 'Not connected'}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => toggleConnect(p.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    status?.connected 
                                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100' 
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100'
                                }`}
                            >
                                {status?.connected ? 'Disconnect' : 'Connect Account'}
                            </button>
                        </div>
                    );
                })}
             </div>
          </div>
        );
      case 'help':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 uppercase tracking-wide">Help & Documentation</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Need assistance? Here is how to master the Strategist AI toolkit.</p>
            </div>

            <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
              <h4 className="font-bold flex items-center mb-2">
                <Mail size={18} className="mr-2" />
                Dedicated Support
              </h4>
              <p className="text-sm text-indigo-100 mb-4 font-medium">
                Our social media experts are available for 1-on-1 brand strategy calls for Pro users.
              </p>
              <a href="mailto:support@strategistai.com" className="inline-block bg-white text-indigo-600 text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors">
                Book a Strategy Call
              </a>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-80 text-slate-400">
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl mb-4 border border-slate-100 dark:border-slate-700">
               {activeTab === 'notifications' && <Bell size={40} className="text-indigo-400" />}
               {activeTab === 'billing' && <CreditCard size={40} className="text-indigo-400" />}
            </div>
            <p className="font-bold text-slate-600 dark:text-slate-300">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings</p>
            <p className="text-sm font-medium mt-1">This section is currently under construction.</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 dark:bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] max-w-4xl w-full overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-800">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">System Configuration</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Version 2.5.0 • Live</p>
          </div>
          <button onClick={onClose} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-2xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-72 bg-slate-50/30 dark:bg-slate-800/30 p-6 space-y-1.5 border-r border-slate-100 dark:border-slate-800 overflow-y-auto">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block px-2">General</span>
             <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3.5 rounded-2xl font-bold flex items-center gap-3 transition-all ${activeTab === 'profile' ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 shadow-md border border-indigo-100 dark:border-indigo-900/50' : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}
             >
               <User size={18} /> Identity Profile
             </button>
             <button 
                onClick={() => setActiveTab('accounts')}
                className={`w-full text-left px-4 py-3.5 rounded-2xl font-bold flex items-center gap-3 transition-all ${activeTab === 'accounts' ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 shadow-md border border-indigo-100 dark:border-indigo-900/50' : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}
             >
               <Share2 size={18} /> Social Connections
             </button>
             
             <div className="h-px bg-slate-200/50 dark:bg-slate-800 my-6"></div>
             <button 
                onClick={() => setActiveTab('help')}
                className={`w-full text-left px-4 py-3.5 rounded-2xl font-bold flex items-center gap-3 transition-all ${activeTab === 'help' ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 shadow-md border border-indigo-100 dark:border-indigo-900/50' : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}
             >
               <HelpCircle size={18} /> Support Center
             </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-8 overflow-y-auto bg-white dark:bg-slate-900 custom-scrollbar">
             {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};