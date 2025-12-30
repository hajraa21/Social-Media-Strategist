import { Platform, DailyStat, AnalyticsMetric, GeneratedPost } from './types';
import { Instagram, Linkedin, Twitter, Video, Hash } from 'lucide-react';
import React from 'react';

export const PLATFORMS: { id: Platform; name: string; icon: React.ReactNode; color: string; bgColor: string }[] = [
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: <Instagram size={16} />, 
    color: 'text-[#E4405F]',
    bgColor: 'bg-[#E4405F]/10'
  },
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    icon: <Linkedin size={16} />, 
    color: 'text-[#0A66C2]',
    bgColor: 'bg-[#0A66C2]/10'
  },
  { 
    id: 'twitter', 
    name: 'Twitter', 
    icon: <Twitter size={16} />, 
    color: 'text-[#1DA1F2]',
    bgColor: 'bg-[#1DA1F2]/10'
  },
  { 
    id: 'tiktok', 
    name: 'TikTok', 
    icon: <Video size={16} />, 
    color: 'text-[#000000] dark:text-white',
    bgColor: 'bg-black/10 dark:bg-white/10'
  },
  { 
    id: 'threads', 
    name: 'Threads', 
    icon: <Hash size={16} />, 
    color: 'text-[#000000] dark:text-white',
    bgColor: 'bg-black/10 dark:bg-white/10'
  },
];

export const MOCK_DAILY_STATS: DailyStat[] = [
  { day: 'Mon', engagement: 120, reach: 2400 },
  { day: 'Tue', engagement: 155, reach: 2100 },
  { day: 'Wed', engagement: 290, reach: 4500 },
  { day: 'Thu', engagement: 210, reach: 3200 },
  { day: 'Fri', engagement: 180, reach: 2800 },
  { day: 'Sat', engagement: 310, reach: 5100 },
  { day: 'Sun', engagement: 250, reach: 3900 },
];

export const MOCK_METRICS: AnalyticsMetric[] = [
  { name: 'Followers', value: 12450, change: 5.2, unit: '' },
  { name: 'Engagement', value: 4.8, change: 1.2, unit: '%' },
  { name: 'Views', value: 89000, change: 12.5, unit: '' },
  { name: 'Posts', value: 24, change: 0, unit: '' },
];

const today = new Date();
const getRelativeDate = (days: number) => {
  const d = new Date(today);
  d.setDate(today.getDate() + days);
  return d.getTime();
};

export const MOCK_SCHEDULED_POSTS: GeneratedPost[] = [
  {
    id: '1',
    platform: 'instagram',
    content: 'A peek behind the curtain! 🎬 #OfficeVibes',
    hashtags: ['bts', 'work'],
    rationale: 'Shows your brand personality',
    visualSuggestion: 'Friendly team photo',
    estimatedEngagement: 'Good',
    suggestedTime: '10:00 AM',
    status: 'scheduled',
    createdAt: getRelativeDate(0)
  },
  {
    id: '2',
    platform: 'linkedin',
    content: '3 helpful things we learned about AI this week. 🧵',
    hashtags: ['AI', 'Tips'],
    rationale: 'Helpful expert advice',
    visualSuggestion: 'Simple chart',
    estimatedEngagement: 'Average',
    suggestedTime: '09:00 AM',
    status: 'scheduled',
    createdAt: getRelativeDate(2)
  }
];

export const STRATEGIST_SYSTEM_INSTRUCTION = `
You are an elite social media strategist.
Your goal is to help users create posts that are professional, high-impact, and brand-consistent.
Analyze inputs and generate content that maximizes engagement for the specific platform.
Always provide strategic rationale for your choices.
`;