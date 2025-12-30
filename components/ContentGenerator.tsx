
import React, { useState } from 'react';
import { UserPersona, GeneratedPost, Platform } from '../types';
import { generatePost, generateMedia } from '../services/geminiService';
import { PLATFORMS } from '../constants';
import { Wand2, Copy, CalendarCheck, Loader2, RefreshCw, MessageSquarePlus, Image as ImageIcon, X, AlertCircle, Sparkles } from 'lucide-react';

interface ContentGeneratorProps {
  persona: UserPersona;
  onAddPost: (newPost: GeneratedPost) => void;
}

export const ContentGenerator: React.FC<ContentGeneratorProps> = ({ persona, onAddPost }) => {
  const [topic, setTopic] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('instagram');
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingMedia, setIsGeneratingMedia] = useState(false);
  const [result, setResult] = useState<GeneratedPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scheduled, setScheduled] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const generated = await generatePost(persona, selectedPlatform, topic, context);
      setResult(generated);
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!topic || isLoading) return;
    handleGenerate();
  };

  const handleGenerateImage = async () => {
    if (!result) return;
    setIsGeneratingMedia(true);
    try {
      const imageUrl = await generateMedia(result.visualSuggestion);
      setResult(prev => prev ? { ...prev, imageUrl } : null);
    } catch (err: any) {
      setError('Could not make image');
    } finally {
      setIsGeneratingMedia(false);
    }
  };

  const handleSchedule = () => {
    if (!result) return;
    onAddPost({ ...result, status: 'scheduled', createdAt: Date.now() });
    setScheduled(true);
    setTimeout(() => setScheduled(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full animate-in fade-in duration-500">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-emerald-950 dark:text-white tracking-tight transition-colors">Content Forge</h2>
          <p className="text-emerald-700 dark:text-emerald-500 text-sm font-medium mt-1 transition-colors">Transform ideas into high-performance social assets.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 transition-colors">
          <div>
            <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-500 uppercase tracking-widest mb-4 transition-colors">Target Platform</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlatform(p.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all space-y-2 ${
                    selectedPlatform === p.id 
                      ? 'bg-emerald-950 dark:bg-emerald-800 border-emerald-950 dark:border-emerald-800 text-white shadow-xl shadow-emerald-900/20' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-emerald-500 dark:hover:border-emerald-400'
                  }`}
                >
                  <span className={selectedPlatform === p.id ? 'text-white' : p.color}>{p.icon}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-tighter ${selectedPlatform === p.id ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-500 uppercase tracking-widest mb-3 transition-colors">Topic / Hook</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What are we talking about?"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-950 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 rounded-2xl p-4 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/50 outline-none transition-all font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-500 uppercase tracking-widest mb-3 transition-colors">Additional Intelligence</label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Keywords, specific angles, or special instructions..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-950 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 rounded-2xl p-4 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/50 outline-none h-32 resize-none transition-all font-semibold leading-relaxed"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!topic || isLoading}
            className="w-full bg-emerald-950 dark:bg-emerald-700 text-white py-5 rounded-2xl font-bold shadow-xl shadow-emerald-950/20 flex items-center justify-center space-x-3 transition-all hover:bg-emerald-900 dark:hover:bg-emerald-600 active:scale-95 disabled:opacity-30"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            <span>{isLoading ? 'Synthesizing...' : 'Generate Neural Draft'}</span>
          </button>
        </div>
      </div>

      <div className="h-full">
        {result ? (
          <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-xl h-full flex flex-col overflow-hidden animate-in zoom-in duration-300 transition-colors">
             <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-emerald-50/20 dark:bg-slate-800/20">
               <div className="flex items-center space-x-3">
                 <div className="p-2 bg-emerald-950 dark:bg-emerald-700 text-white rounded-lg">
                    {PLATFORMS.find(p => p.id === result.platform)?.icon}
                 </div>
                 <span className="font-bold text-emerald-950 dark:text-white text-sm uppercase tracking-widest transition-colors">Neural Draft</span>
               </div>
               <div className="flex items-center space-x-2">
                 <button 
                    onClick={handleRegenerate} 
                    disabled={isLoading} 
                    className="flex items-center space-x-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                    title="Regenerate Content"
                 >
                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                    <span>Regenerate</span>
                 </button>
                 <button onClick={() => { navigator.clipboard.writeText(result.content); alert('Copied!'); }} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-emerald-900 dark:hover:text-white transition-colors shadow-sm" title="Copy"><Copy size={18} /></button>
                 <button onClick={handleSchedule} className={`p-2.5 rounded-xl border transition-all shadow-sm ${scheduled ? 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-200' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-emerald-900 dark:hover:text-white'}`} title="Schedule"><CalendarCheck size={18} /></button>
               </div>
             </div>
             
             <div className="p-8 overflow-y-auto flex-1 space-y-8 custom-scrollbar transition-colors">
                {result.imageUrl ? (
                  <div className="rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-lg">
                    <img src={result.imageUrl} alt="AI Preview" className="w-full h-auto object-cover" />
                  </div>
                ) : (
                  <button onClick={handleGenerateImage} disabled={isGeneratingMedia} className="w-full border-2 border-dashed border-emerald-100 dark:border-emerald-900 bg-emerald-50/20 dark:bg-emerald-900/10 rounded-3xl py-14 flex flex-col items-center justify-center gap-4 text-emerald-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all group">
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        {isGeneratingMedia ? <Loader2 className="animate-spin text-emerald-500" size={32} /> : <ImageIcon size={32} />}
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.2em]">{isGeneratingMedia ? 'Generating Visual...' : 'Add AI Visual'}</span>
                  </button>
                )}

                <div className="space-y-6">
                  <div className="whitespace-pre-wrap text-emerald-950 dark:text-white text-lg font-semibold leading-relaxed tracking-tight transition-colors">{result.content}</div>
                  <div className="flex flex-wrap gap-2">
                    {result.hashtags.map((tag, i) => <span key={i} className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/50">#{tag.replace('#', '')}</span>)}
                  </div>
                </div>

                <div className="bg-emerald-950 dark:bg-slate-800 p-6 rounded-[24px] border border-emerald-900 dark:border-slate-700 shadow-inner relative group transition-colors">
                  <div className="flex items-center text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">
                    <Sparkles size={12} className="mr-2" /> Strategic Reasoning
                  </div>
                  <p className="text-xs text-emerald-100 dark:text-slate-300 font-medium italic leading-relaxed">"{result.rationale}"</p>
                </div>
             </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-emerald-50/20 dark:bg-slate-900 rounded-[40px] border-2 border-dashed border-emerald-100 dark:border-emerald-900 p-12 text-center transition-colors">
            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl shadow-sm flex items-center justify-center mb-8 text-emerald-100 dark:text-emerald-900 ring-8 ring-emerald-50/50 dark:ring-slate-800">
               <MessageSquarePlus size={40} />
            </div>
            <h3 className="text-2xl font-bold text-emerald-950 dark:text-white mb-3 tracking-tight transition-colors">System Ready</h3>
            <p className="text-emerald-700/60 dark:text-slate-500 max-w-sm text-sm font-medium leading-relaxed transition-colors">
              Define your parameters in the forge to initiate content synthesis. Our Strategist will produce optimized drafts in seconds.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
