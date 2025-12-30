import React, { useState } from 'react';
import { UserPersona, Platform, GeneratedPost } from '../types';
import { PLATFORMS } from '../constants';
import { generateScheduleProposal } from '../services/geminiService';
import { ChevronLeft, ChevronRight, Plus, Sparkles, Bot, X, Filter, Calendar as CalendarIcon, Clock, BarChart2, Loader2, Wand2 } from 'lucide-react';

interface ScheduleProps {
  persona: UserPersona;
  posts: GeneratedPost[];
  onUpdatePosts: React.Dispatch<React.SetStateAction<GeneratedPost[]>>;
  onNavigate: (tab: string) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const Schedule: React.FC<ScheduleProps> = ({ persona, posts, onUpdatePosts, onNavigate }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPost, setSelectedPost] = useState<GeneratedPost | null>(null);
  
  // AI Scheduler Modal State
  const [isAISchedulerOpen, setIsAISchedulerOpen] = useState(false);
  const [aiRequest, setAiRequest] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  const handleAISchedule = async () => {
    if (!aiRequest.trim()) return;
    setIsGenerating(true);
    try {
      const proposal = await generateScheduleProposal(persona, aiRequest, currentDate);
      onUpdatePosts(prev => [...prev, ...proposal.posts]);
      setIsAISchedulerOpen(false);
      setAiRequest('');
      alert(`AI has proposed and added ${proposal.posts.length} new posts to your matrix.`);
    } catch (error) {
      alert("Failed to generate schedule proposal.");
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredPosts = posts.filter(post => 
    selectedPlatform === 'all' || post.platform === selectedPlatform
  );

  const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
  const daysInPrevMonth = prevMonth.getDate();
  const leadingDays = Array.from({ length: firstDay }).map((_, i) => ({
    day: daysInPrevMonth - firstDay + i + 1,
    currentMonth: false,
    date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, daysInPrevMonth - firstDay + i + 1)
  }));

  const currentMonthDays = Array.from({ length: daysInMonth }).map((_, i) => ({
    day: i + 1,
    currentMonth: true,
    date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1)
  }));

  const totalCells = 42;
  const remainingCells = totalCells - (leadingDays.length + currentMonthDays.length);
  const trailingDays = Array.from({ length: remainingCells }).map((_, i) => ({
    day: i + 1,
    currentMonth: false,
    date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i + 1)
  }));

  const allCalendarDays = [...leadingDays, ...currentMonthDays, ...trailingDays];

  return (
    <div className="h-full flex flex-col space-y-8 relative animate-in fade-in duration-700">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-8">
          <div>
            <h2 className="text-4xl font-black text-emerald-950 dark:text-white tracking-tighter transition-colors">Content Matrix</h2>
            <p className="text-emerald-700 dark:text-emerald-500 font-bold mt-1 text-[10px] uppercase tracking-[0.25em] transition-colors">
                Strategic Deployment Engine
            </p>
          </div>
          <div className="relative group">
              <button className="flex items-center space-x-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-950 dark:text-white hover:bg-emerald-50 dark:hover:bg-slate-800 transition-all shadow-sm">
                  <Filter size={14} />
                  <span>{selectedPlatform === 'all' ? 'All Channels' : PLATFORMS.find(p => p.id === selectedPlatform)?.name}</span>
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl hidden group-hover:block z-20 p-2 animate-in zoom-in duration-200">
                 <button onClick={() => setSelectedPlatform('all')} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-emerald-950 dark:text-white hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                    Global Stream
                 </button>
                 {PLATFORMS.map(p => (
                     <button key={p.id} onClick={() => setSelectedPlatform(p.id)} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-emerald-950 dark:text-white hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-xl flex items-center gap-3 transition-colors">
                         <span className={p.color}>{p.icon}</span>
                         {p.name}
                     </button>
                 ))}
              </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsAISchedulerOpen(true)}
            className="flex items-center space-x-3 bg-emerald-950 dark:bg-emerald-800 text-white px-7 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-emerald-950/20 hover:bg-emerald-900 dark:hover:bg-emerald-700 transition-all hover:-translate-y-0.5"
          >
            <Sparkles size={18} />
            <span>AI Scheduler</span>
          </button>
          <button 
            onClick={() => onNavigate('generator')}
            className="flex items-center space-x-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-900 dark:text-emerald-400 px-7 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            <Plus size={18} />
            <span className="hidden md:inline">Quick Draft</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-2xl flex-1 flex flex-col overflow-hidden transition-colors">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/30 dark:bg-slate-800/20">
          <div className="flex items-center space-x-10">
            <h3 className="text-3xl font-black text-emerald-950 dark:text-white tracking-tighter min-w-[220px]">
              {monthName} {year}
            </h3>
            <div className="flex items-center space-x-2 border border-slate-200 dark:border-slate-700 rounded-2xl p-1.5 bg-white dark:bg-slate-800 shadow-sm">
              <button onClick={() => changeMonth(-1)} className="p-2.5 hover:bg-emerald-50 dark:hover:bg-slate-700 rounded-xl text-emerald-950 dark:text-white transition-all active:scale-90">
                <ChevronLeft size={22} />
              </button>
              <button onClick={() => changeMonth(1)} className="p-2.5 hover:bg-emerald-50 dark:hover:bg-slate-700 rounded-xl text-emerald-950 dark:text-white transition-all active:scale-90">
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
          <div className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100/40 dark:bg-emerald-900/40 px-5 py-2.5 rounded-full border border-emerald-100 dark:border-emerald-800 uppercase tracking-widest hidden md:block">
            {filteredPosts.length} Active Deployments
          </div>
        </div>

        <div className="flex-1 flex flex-col h-full bg-slate-100 dark:bg-slate-800 gap-[1px]">
          <div className="grid grid-cols-7 bg-white dark:bg-slate-900 shrink-0 border-b border-slate-100 dark:border-slate-800">
            {DAYS.map(day => (
              <div key={day} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
                {day}
              </div>
            ))}
          </div>

          <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-[1px] bg-slate-200 dark:bg-slate-800">
            {allCalendarDays.map((dayObj, idx) => {
              const dateTimestamp = new Date(dayObj.date).setHours(0,0,0,0);
              const isToday = new Date().setHours(0,0,0,0) === dateTimestamp;

              const dayPosts = filteredPosts.filter(p => {
                const pDate = new Date(p.createdAt).setHours(0,0,0,0);
                return pDate === dateTimestamp;
              });

              return (
                <div key={idx} className={`bg-white dark:bg-slate-900 p-2.5 relative group hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-all flex flex-col overflow-hidden ${!dayObj.currentMonth ? 'bg-slate-50 dark:bg-slate-950 opacity-25' : ''}`}>
                  <div className="flex justify-between items-start mb-1.5 shrink-0 px-1 pt-1">
                    <span className={`text-[12px] font-black w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                      isToday ? 'bg-emerald-950 dark:bg-emerald-600 text-white shadow-xl shadow-emerald-950/20 scale-110' : 'text-slate-400 group-hover:text-emerald-900 dark:group-hover:text-white'
                    }`}>
                      {dayObj.day}
                    </span>
                  </div>
                  
                  <div className="flex-1 flex content-start flex-wrap gap-1.5 px-1 pb-1 overflow-hidden">
                    {dayPosts.map(post => {
                      const platform = PLATFORMS.find(p => p.id === post.platform);
                      return (
                        <button 
                          key={post.id}
                          onClick={() => setSelectedPost(post)}
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-white shadow-md hover:scale-125 hover:z-10 transition-all cursor-pointer bg-emerald-700 dark:bg-emerald-800`}
                          title={`${platform?.name}`}
                        >
                           {React.cloneElement(platform?.icon as React.ReactElement<any>, { size: 14 })}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Scheduler Overlay */}
      {isAISchedulerOpen && (
        <div className="fixed inset-0 bg-emerald-950/60 dark:bg-black/80 backdrop-blur-xl z-[150] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl max-w-lg w-full p-10 animate-in zoom-in duration-300 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-2xl font-black text-emerald-950 dark:text-white">AI Content Planning</h3>
               <button onClick={() => setIsAISchedulerOpen(false)} className="p-2 text-slate-400 hover:text-emerald-900 dark:hover:text-white">
                 <X size={24} />
               </button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6 leading-relaxed">
              Describe your campaign or goal for the current period. Our Strategist will propose a multi-platform schedule.
            </p>
            <textarea
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 h-40 outline-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/50 text-slate-900 dark:text-white font-semibold transition-all"
              placeholder="e.g. Schedule 3 posts for next week focused on our new spring launch, mixing lifestyle and product shots..."
              value={aiRequest}
              onChange={(e) => setAiRequest(e.target.value)}
            />
            <button 
              onClick={handleAISchedule}
              disabled={!aiRequest.trim() || isGenerating}
              className="w-full mt-6 bg-emerald-950 dark:bg-emerald-700 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-emerald-900 dark:hover:bg-emerald-600 transition-all disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
              {isGenerating ? 'Synthesizing Strategy...' : 'Propose Matrix'}
            </button>
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-emerald-950/40 dark:bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[48px] shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-800">
            <div className={`p-8 text-white flex justify-between items-center shrink-0 bg-emerald-950 dark:bg-emerald-900`}>
               <div className="flex items-center gap-4 font-black uppercase tracking-widest text-xs">
                 <CalendarIcon size={20} />
                 <span>Strategic Deployment Details</span>
               </div>
               <button onClick={() => setSelectedPost(null)} className="hover:bg-white/10 rounded-2xl p-2.5 transition-all active:scale-90">
                 <X size={24} />
               </button>
            </div>
            
            <div className="p-10 overflow-y-auto space-y-10 flex-1 custom-scrollbar">
               <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5">Manifest Content</h4>
                  <div className="bg-emerald-50/30 dark:bg-slate-800/50 p-8 rounded-[32px] border border-emerald-100 dark:border-emerald-900/50 shadow-inner">
                    <p className="text-emerald-950 dark:text-white text-xl leading-relaxed font-bold">{selectedPost.content}</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-5">
                 <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">
                      <CalendarIcon size={16} className="mr-3"/> Release Date
                    </div>
                    <p className="font-black text-emerald-950 dark:text-white text-sm">
                      {new Date(selectedPost.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    </p>
                 </div>
                 <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">
                      <Clock size={16} className="mr-3"/> Target Slot
                    </div>
                    <p className="font-black text-emerald-950 dark:text-white text-sm">
                      {selectedPost.suggestedTime}
                    </p>
                 </div>
               </div>

               <div className="bg-emerald-950 dark:bg-slate-800 p-8 rounded-[32px] relative shadow-2xl">
                  <div className="flex items-center text-[10px] font-black text-emerald-400 mb-4 uppercase tracking-widest">
                    <Bot size={20} className="mr-4"/> Strategic Rationale
                  </div>
                  <p className="text-sm text-emerald-50 leading-relaxed font-semibold italic">
                    "{selectedPost.rationale}"
                  </p>
               </div>
            </div>
            
            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-4 shrink-0">
               <button onClick={() => setSelectedPost(null)} className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-black text-slate-500 hover:bg-slate-100 transition-all uppercase tracking-widest">
                 Dismiss
               </button>
               <button className="px-8 py-4 bg-emerald-950 dark:bg-emerald-700 text-white rounded-2xl text-xs font-black hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-950/10 uppercase tracking-widest">
                 Modify Entry
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};