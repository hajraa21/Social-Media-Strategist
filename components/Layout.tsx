import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  PenTool, 
  Calendar, 
  MessageSquare, 
  BarChart2, 
  Settings,
  BookOpen,
  Menu,
  X,
  Heart
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  brandName: string;
  onOpenSettings?: () => void;
}

const SidebarItem = ({ 
  icon, 
  label, 
  active, 
  onClick
}: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? `bg-emerald-950 dark:bg-emerald-900 shadow-lg text-white` 
        : `text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-900 dark:hover:text-emerald-400`
    }`}
  >
    <div className={`p-2 rounded-lg transition-colors duration-200 ${active ? 'bg-emerald-800 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
        {icon}
    </div>
    <span className={`text-sm font-semibold tracking-tight`}>{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, brandName, onOpenSettings }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChangeMobile = (tab: string) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-300">
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-emerald-950/40 dark:bg-black/60 z-[60] md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-64 bg-white dark:bg-slate-900 flex flex-col transition-transform duration-300 md:translate-x-0 md:static md:shrink-0 border-r border-slate-200 dark:border-slate-800
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-950 dark:bg-emerald-800 rounded-xl flex items-center justify-center text-emerald-400 shadow-md">
              <Heart size={20} fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-emerald-950 dark:text-white tracking-tight">Strategist</span>
          </div>
          <button className="md:hidden text-slate-400 p-2" onClick={() => setIsMobileMenuOpen(false)}><X size={20} /></button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <SidebarItem 
            icon={<LayoutDashboard size={18} />} 
            label="Home" 
            active={activeTab === 'dashboard'} 
            onClick={() => handleTabChangeMobile('dashboard')} 
          />
          <SidebarItem 
            icon={<PenTool size={18} />} 
            label="Create Post" 
            active={activeTab === 'generator'} 
            onClick={() => handleTabChangeMobile('generator')} 
          />
          <SidebarItem 
            icon={<BookOpen size={18} />} 
            label="My Brand" 
            active={activeTab === 'brand-voice'} 
            onClick={() => handleTabChangeMobile('brand-voice')} 
          />
          <SidebarItem 
            icon={<Calendar size={18} />} 
            label="Calendar" 
            active={activeTab === 'schedule'} 
            onClick={() => handleTabChangeMobile('schedule')} 
          />
          <SidebarItem 
            icon={<MessageSquare size={18} />} 
            label="Helpful Chat" 
            active={activeTab === 'chat'} 
            onClick={() => handleTabChangeMobile('chat')} 
          />
          <SidebarItem 
            icon={<BarChart2 size={18} />} 
            label="Results" 
            active={activeTab === 'analytics'} 
            onClick={() => handleTabChangeMobile('analytics')} 
          />

          <div className="pt-8 px-2">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-800/50">
               <p className="text-xs text-emerald-900 dark:text-emerald-400 font-bold mb-3 leading-snug">Boost engagement with AI scheduling.</p>
               <button 
                onClick={onOpenSettings}
                className="w-full bg-emerald-950 dark:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-emerald-900 dark:hover:bg-emerald-600 transition-colors"
               >
                 Connect Now
               </button>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button onClick={onOpenSettings} className="flex items-center space-x-3 text-slate-500 dark:text-slate-400 px-4 py-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-900 dark:hover:text-emerald-400 w-full transition-all text-sm font-semibold">
            <Settings size={18} />
            <span>Settings</span>
          </button>
          <div className="flex items-center space-x-3 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 mt-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 dark:bg-emerald-800 flex items-center justify-center text-xs font-bold text-white uppercase">
              {brandName.substring(0, 1)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-emerald-950 dark:text-white truncate">{brandName}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
        <header className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
          <span className="font-bold text-emerald-950 dark:text-white">Strategist</span>
          <button className="text-emerald-900 dark:text-emerald-400 bg-emerald-50 dark:bg-slate-800 p-2 rounded-lg" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={20} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto p-6 md:p-10">{children}</div>
        </div>
      </main>
    </div>
  );
};