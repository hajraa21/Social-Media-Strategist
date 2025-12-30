import React, { useState } from 'react';
import { UserPersona, BrandVoiceGuide } from '../types';
import { analyzeBrandVoice } from '../services/geminiService';
import { Sparkles, Loader2, CheckCircle, XCircle, BookOpen, ArrowRight } from 'lucide-react';

interface BrandVoiceAnalyzerProps {
  persona: UserPersona;
  onUpdatePersona: (updatedPersona: UserPersona) => void;
}

export const BrandVoiceAnalyzer: React.FC<BrandVoiceAnalyzerProps> = ({ persona, onUpdatePersona }) => {
  const [inputPosts, setInputPosts] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [guide, setGuide] = useState<BrandVoiceGuide | null>(persona.brandVoiceGuide || null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputPosts.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    // Split by double newlines or just take the whole blob as an array of 1 if unclear, 
    // but the service handles the join. Let's split by newline for cleanliness if user pastes a list.
    // However, posts often contain newlines. Let's treat it as one large text blob 
    // but split loosely by '---' if the user follows instructions, or just pass as an array of one block 
    // to let Gemini parse it.
    const posts = [inputPosts]; 

    try {
      const result = await analyzeBrandVoice(posts);
      setGuide(result);
    } catch (err: any) {
      setError(err.message || "Failed to analyze voice.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (guide) {
      onUpdatePersona({
        ...persona,
        brandVoiceGuide: guide,
        tone: guide.tone // Optional: update the simple tone field too
      });
      alert("Brand voice saved to your persona!");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* Input Section */}
      <div className="lg:col-span-4 flex flex-col h-full space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Brand Voice Decoder</h2>
          <p className="text-slate-500">Paste your best performing posts to extract your unique DNA.</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Paste Past Content (3-5 Posts)
          </label>
          <textarea
            className="flex-1 w-full border border-slate-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm leading-relaxed"
            placeholder={`Example:\n\nJust launched our new feature! 🚀 It's been a wild ride...\n\n---\n\nHere's why most people fail at [Topic]...`}
            value={inputPosts}
            onChange={(e) => setInputPosts(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            disabled={!inputPosts.trim() || isAnalyzing}
            className="mt-4 w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Analyzing Patterns...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} className="text-yellow-400" />
                <span>Analyze Voice</span>
              </>
            )}
          </button>
          {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
        </div>
      </div>

      {/* Output Section */}
      <div className="lg:col-span-8 h-full">
        {guide ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-right duration-500">
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Your Brand Guide</h3>
                  <p className="text-xs text-indigo-600 font-medium">AI-Generated Analysis</p>
                </div>
              </div>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
              >
                Save to Persona
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8 flex-1">
              
              {/* Tone & Style */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Core Tone</h4>
                  <p className="text-xl font-semibold text-slate-800">{guide.tone}</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Writing Style</h4>
                  <p className="text-lg text-slate-700">{guide.style}</p>
                </div>
              </div>

              {/* Do's and Don'ts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="flex items-center text-green-700 font-bold mb-4">
                    <CheckCircle size={20} className="mr-2" />
                    Brand Do's
                  </h4>
                  <ul className="space-y-3">
                    {guide.dos.map((item, i) => (
                      <li key={i} className="flex items-start text-sm text-slate-700 bg-green-50 p-3 rounded-lg border border-green-100">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="flex items-center text-red-700 font-bold mb-4">
                    <XCircle size={20} className="mr-2" />
                    Brand Don'ts
                  </h4>
                  <ul className="space-y-3">
                    {guide.donts.map((item, i) => (
                      <li key={i} className="flex items-start text-sm text-slate-700 bg-red-50 p-3 rounded-lg border border-red-100">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 mr-2 shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Simulation */}
              <div className="border-t border-slate-100 pt-8">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Voice Simulation</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-dashed border-slate-300 rounded-lg opacity-60">
                    <span className="text-xs font-bold text-slate-400 block mb-1">Generic Input</span>
                    <p className="text-slate-600">"Check out our new product."</p>
                  </div>
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg relative">
                    <span className="text-xs font-bold text-indigo-400 block mb-1">Your Voice</span>
                    <p className="text-indigo-900 font-medium">"{guide.exampleRewrite}"</p>
                    <div className="absolute top-1/2 -left-3 transform -translate-y-1/2 bg-white rounded-full p-1 border border-slate-200 md:block hidden">
                      <ArrowRight size={14} className="text-indigo-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                 <div>
                   <span className="font-semibold text-slate-700">Vocabulary: </span>
                   <span className="text-slate-600">{guide.vocabulary.join(', ')}</span>
                 </div>
                 <div>
                   <span className="font-semibold text-slate-700">Emoji Usage: </span>
                   <span className="text-slate-600">{guide.emojiUsage}</span>
                 </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
              <BookOpen size={32} className="text-indigo-200" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Voice Guide Yet</h3>
            <p className="text-slate-500 max-w-md">
              Paste your content on the left to generate a comprehensive guide. This helps the AI write exactly like you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
