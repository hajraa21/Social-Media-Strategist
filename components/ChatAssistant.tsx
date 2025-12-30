import React, { useState, useRef, useEffect } from 'react';
import { UserPersona, ChatMessage, GeneratedPost } from '../types';
import { chatWithStrategist } from '../services/geminiService';
import { MOCK_METRICS } from '../constants';
import { Send, Bot, User, Loader2, Sparkles, TrendingUp, Zap } from 'lucide-react';

interface ChatAssistantProps {
  persona: UserPersona;
  posts: GeneratedPost[];
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ persona, posts }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Welcome, ${persona.brandName}. I'm synced to your digital matrix. How shall we evolve your strategy today?`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      
      const upcomingPosts = posts
        .filter(p => p.createdAt >= Date.now())
        .sort((a, b) => a.createdAt - b.createdAt)
        .slice(0, 5)
        .map(p => `- ${new Date(p.createdAt).toLocaleDateString()} [${p.platform}]: ${p.content} (Est. Engagement: ${p.estimatedEngagement})`)
        .join('\n');

      const metricsSummary = MOCK_METRICS
        .map(m => `- ${m.name}: ${m.value}${m.unit} (${m.change >= 0 ? '+' : ''}${m.change}%)`)
        .join('\n');

      const contextData = `
        CURRENT METRICS:
        ${metricsSummary}

        UPCOMING SCHEDULE (Next 5 posts):
        ${upcomingPosts || "No upcoming posts scheduled."}
      `;

      const responseText = await chatWithStrategist(persona, history, userMsg.text, contextData);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Neural link interrupted. Re-connecting to matrix...",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white dark:bg-slate-900 rounded-[40px] border border-emerald-50 dark:border-slate-800 shadow-[0_32px_80px_-16px_rgba(16,185,129,0.1)] overflow-hidden animate-in fade-in zoom-in duration-500 transition-colors">
      {/* Header */}
      <div className="px-8 py-6 border-b border-emerald-50 dark:border-slate-800 bg-emerald-50/10 dark:bg-slate-800/50 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-emerald-950 dark:bg-emerald-800 rounded-2xl flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/20 relative">
            <Bot size={24} />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-black text-slate-800 dark:text-white text-lg leading-tight uppercase tracking-tight">AI ADVISOR</h3>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black tracking-widest flex items-center uppercase mt-0.5">
              Live Connection • Neural Link
            </p>
          </div>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800">
              <TrendingUp size={12} />
              <span>Dimensions Trends</span>
            </button>
            <button className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800">
              <Zap size={12} />
              <span>Audit Matrix</span>
            </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-emerald-50/5 dark:bg-slate-950/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-4`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-colors ${
                msg.role === 'user' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800' : 'bg-emerald-950 dark:bg-emerald-800 text-white'
              }`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`p-6 rounded-[30px] text-sm leading-relaxed shadow-sm font-bold transition-all ${
                msg.role === 'user' 
                  ? 'bg-white dark:bg-slate-800 border border-emerald-50 dark:border-emerald-800 text-slate-700 dark:text-slate-200 rounded-tr-none' 
                  : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-950 dark:text-emerald-50 rounded-tl-none border border-emerald-100 dark:border-emerald-900/30'
              }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%] items-start gap-4">
              <div className="w-10 h-10 bg-emerald-950 dark:bg-emerald-800 text-white rounded-2xl flex items-center justify-center shrink-0">
                <Bot size={20} />
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-[30px] rounded-tl-none border border-emerald-50 dark:border-emerald-800 shadow-sm flex items-center gap-3">
                <Loader2 className="animate-spin text-emerald-500" size={24} />
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Synthesizing...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-8 border-t border-emerald-50 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Query the strategist matrix..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-6 pr-20 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 outline-none h-24 resize-none text-emerald-950 dark:text-white font-bold transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-inner"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="absolute bottom-4 right-4 w-12 h-12 bg-emerald-950 dark:bg-emerald-700 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-950/20 hover:bg-emerald-900 dark:hover:bg-emerald-600 transition-all active:scale-90 disabled:opacity-20 disabled:grayscale"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6">
           <button 
            onClick={() => handleSend("Analyze my upcoming week's strategy")}
            className="text-[10px] font-black text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 uppercase tracking-widest flex items-center gap-2 transition-colors"
           >
             <Sparkles size={12} />
             Analyze Week
           </button>
           <button 
            onClick={() => handleSend("How can I improve my LinkedIn engagement?")}
            className="text-[10px] font-black text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 uppercase tracking-widest flex items-center gap-2 transition-colors"
           >
             <Sparkles size={12} />
             Improve LinkedIn
           </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;