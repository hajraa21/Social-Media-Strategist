import React, { useState } from 'react';
import { UserPersona } from '../types';
import { ArrowRight, CheckCircle2, Sparkles, Loader2, X, Heart } from 'lucide-react';
import { generateTargetAudienceSuggestion, generateContentPillarsSuggestion } from '../services/geminiService';

interface OnboardingProps {
  onComplete: (persona: UserPersona) => void;
}

const TONE_OPTIONS = ['Professional', 'Friendly', 'Funny', 'Inspiring', 'Helpful', 'Bold', 'Luxury', 'Calm', 'Custom'];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserPersona>({
    brandName: '',
    industry: '',
    targetAudience: '',
    tone: 'Professional',
    goals: 'Brand Awareness',
    contentPillars: []
  });

  const [customToneInput, setCustomToneInput] = useState('');
  const [pillarInput, setPillarInput] = useState('');
  
  const [isLoadingAudience, setIsLoadingAudience] = useState(false);
  const [isLoadingPillars, setIsLoadingPillars] = useState(false);

  const handleNext = () => {
    if (step === 1 && (!formData.brandName || !formData.industry)) return;
    if (step === 3) {
      const finalTone = formData.tone === 'Custom' ? customToneInput : formData.tone;
      onComplete({ ...formData, tone: finalTone || formData.tone });
      return;
    }
    setStep(s => s + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (step === 3 && pillarInput) {
        addPillar(pillarInput);
      } else {
        handleNext();
      }
    }
  };

  const addPillar = (pillar: string) => {
    if (pillar.trim() && !formData.contentPillars.includes(pillar.trim())) {
      setFormData(prev => ({ ...prev, contentPillars: [...prev.contentPillars, pillar.trim()] }));
      setPillarInput('');
    }
  };

  const handleSuggestAudience = async () => {
    if (!formData.brandName || !formData.industry) return;
    setIsLoadingAudience(true);
    try {
      const suggestion = await generateTargetAudienceSuggestion(formData.brandName, formData.industry, formData.tone);
      if (suggestion) setFormData(prev => ({ ...prev, targetAudience: suggestion }));
    } finally {
      setIsLoadingAudience(false);
    }
  };

  const handleSuggestPillars = async () => {
    if (!formData.brandName || !formData.industry) return;
    setIsLoadingPillars(true);
    try {
      const pillars = await generateContentPillarsSuggestion(formData.brandName, formData.industry, formData.tone, formData.targetAudience);
      setFormData(prev => ({
          ...prev,
          contentPillars: Array.from(new Set([...prev.contentPillars, ...pillars.slice(0, 3)]))
      }));
    } finally {
      setIsLoadingPillars(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
        <div className="bg-emerald-950 p-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-emerald-800 rounded-2xl flex items-center justify-center text-emerald-400 shadow-2xl mb-6 ring-4 ring-emerald-900/50">
            <Heart size={32} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Social Strategist</h1>
          <p className="text-emerald-200/60 text-sm mt-2 max-w-xs">Building your high-impact brand presence in three simple steps.</p>
        </div>

        <div className="px-10 py-5 flex gap-3">
            {[1, 2, 3].map(s => <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-emerald-600' : 'bg-slate-100 dark:bg-slate-800'}`} />)}
        </div>

        <div className="p-10 flex-1">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-500 uppercase tracking-widest mb-3">Brand Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-100/50 focus:border-emerald-600 outline-none text-emerald-950 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-all font-semibold"
                    value={formData.brandName}
                    onChange={e => setFormData({...formData, brandName: e.target.value})}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. Elevate Studios"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-500 uppercase tracking-widest mb-3">Industry Focus</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-100/50 focus:border-emerald-600 outline-none text-emerald-950 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-all font-semibold"
                    value={formData.industry}
                    onChange={e => setFormData({...formData, industry: e.target.value})}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. Fintech, SaaS, Wellness"
                  />
                </div>
              </div>
              <button disabled={!formData.brandName || !formData.industry} onClick={handleNext} className="w-full bg-emerald-950 text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all hover:bg-emerald-900 active:scale-95 disabled:opacity-30 shadow-xl shadow-emerald-950/20">
                <span>Continue Setup</span>
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-emerald-900 dark:text-emerald-500 uppercase tracking-widest">Target Audience</label>
                  <button onClick={handleSuggestAudience} disabled={isLoadingAudience} className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 flex items-center bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full transition-colors border border-emerald-100 dark:border-emerald-800">
                    {isLoadingAudience ? <Loader2 className="animate-spin mr-2" size={12} /> : <Sparkles size={12} className="mr-2" />}
                    Auto-Generate
                  </button>
                </div>
                <textarea 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-100/50 focus:border-emerald-600 outline-none h-32 resize-none text-emerald-950 dark:text-white font-semibold leading-relaxed"
                  value={formData.targetAudience}
                  onChange={e => setFormData({...formData, targetAudience: e.target.value})}
                  placeholder="Describe your ideal customers..."
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-500 uppercase tracking-widest mb-3">Brand Voice Tone</label>
                <div className="grid grid-cols-3 gap-2">
                    {TONE_OPTIONS.map(opt => (
                        <button 
                            key={opt}
                            onClick={() => setFormData({...formData, tone: opt})}
                            className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${formData.tone === opt ? 'bg-emerald-950 text-white border-emerald-950 shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-emerald-600'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
                {formData.tone === 'Custom' && (
                  <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                    <input 
                      type="text"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-600 outline-none text-emerald-950 dark:text-white font-semibold placeholder:text-slate-300 dark:placeholder:text-slate-600"
                      placeholder="Specify your unique brand tone..."
                      value={customToneInput}
                      onChange={(e) => setCustomToneInput(e.target.value)}
                      autoFocus
                    />
                  </div>
                )}
              </div>

              <button onClick={handleNext} className="w-full bg-emerald-950 text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all hover:bg-emerald-900 active:scale-95 shadow-xl shadow-emerald-950/20">
                <span>Next Step</span>
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div>
                <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-500 uppercase tracking-widest mb-3">Primary Objective</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-100/50 focus:border-emerald-600 outline-none text-emerald-950 dark:text-white font-semibold"
                  value={formData.goals}
                  onChange={e => setFormData({...formData, goals: e.target.value})}
                  placeholder="e.g. Lead generation, Community growth"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-emerald-900 dark:text-emerald-500 uppercase tracking-widest">Content Topics</label>
                  <button onClick={handleSuggestPillars} disabled={isLoadingPillars} className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 flex items-center bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800">
                    {isLoadingPillars ? <Loader2 className="animate-spin mr-2" size={12} /> : <Sparkles size={12} className="mr-2" />}
                    AI Ideas
                  </button>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-600 outline-none text-emerald-950 dark:text-white font-semibold text-sm"
                      value={pillarInput}
                      onChange={e => setPillarInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Add a topic..."
                    />
                  </div>
                  <button 
                    onClick={() => addPillar(pillarInput)} 
                    className="bg-emerald-950 text-white px-6 h-[58px] rounded-2xl font-bold hover:bg-emerald-900 transition-all flex items-center justify-center shadow-lg shadow-emerald-950/10 active:scale-95 shrink-0"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar p-1">
                  {formData.contentPillars.map(p => (
                    <span key={p} className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100 px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-3 border border-emerald-100 dark:border-emerald-800 shadow-sm">
                      <span>{p}</span>
                      <button onClick={() => setFormData(prev => ({...prev, contentPillars: prev.contentPillars.filter(i => i !== p)}))} className="text-emerald-400 hover:text-emerald-900 transition-colors">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  {formData.contentPillars.length === 0 && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 italic py-2">No topics added yet. Try AI Ideas!</p>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button onClick={handleNext} className="w-full bg-emerald-950 text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 shadow-2xl shadow-emerald-950/30 hover:bg-emerald-900 active:scale-95">
                  <span>Complete Setup</span>
                  <CheckCircle2 size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};