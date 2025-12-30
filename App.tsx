import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ContentGenerator } from './components/ContentGenerator';
import { ChatAssistant } from './components/ChatAssistant';
import { BrandVoiceAnalyzer } from './components/BrandVoiceAnalyzer';
import { Schedule } from './components/Schedule';
import { Analytics } from './components/Analytics';
import { SettingsModal } from './components/SettingsModal';
import { UserPersona, GeneratedPost } from './types';
import { MOCK_SCHEDULED_POSTS } from './constants';

export default function App() {
  const [persona, setPersona] = useState<UserPersona | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const [posts, setPosts] = useState<GeneratedPost[]>(MOCK_SCHEDULED_POSTS);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  // Update document class when theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleOnboardingComplete = (data: UserPersona) => {
    setPersona(data);
  };

  const handleUpdatePersona = (updated: UserPersona) => {
    setPersona(updated);
  };

  const handleAddPost = (newPost: GeneratedPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  if (!persona) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard persona={persona} onNavigate={setActiveTab} />;
      case 'generator':
        return <ContentGenerator persona={persona} onAddPost={handleAddPost} />;
      case 'brand-voice':
        return <BrandVoiceAnalyzer persona={persona} onUpdatePersona={handleUpdatePersona} />;
      case 'chat':
        return <ChatAssistant persona={persona} posts={posts} />;
      case 'schedule':
        return <Schedule persona={persona} posts={posts} onUpdatePosts={setPosts} onNavigate={setActiveTab} />;
      case 'analytics':
         return <Analytics />;
      default:
        return <Dashboard persona={persona} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="theme-transition">
      <Layout 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        brandName={persona.brandName}
        onOpenSettings={() => setIsSettingsOpen(true)}
      >
        {renderContent()}
      </Layout>
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        persona={persona} 
        theme={theme}
        toggleTheme={toggleTheme}
      />
    </div>
  );
}