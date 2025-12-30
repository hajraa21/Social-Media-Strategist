export type Platform = 'instagram' | 'linkedin' | 'twitter' | 'threads' | 'tiktok';

export interface BrandVoiceGuide {
  tone: string;
  style: string;
  vocabulary: string[];
  emojiUsage: string;
  dos: string[];
  donts: string[];
  exampleRewrite: string;
}

export interface UserPersona {
  brandName: string;
  industry: string;
  targetAudience: string;
  tone: string;
  goals: string;
  contentPillars: string[];
  brandVoiceGuide?: BrandVoiceGuide;
}

export interface GeneratedPost {
  id: string;
  platform: Platform;
  content: string; // The main caption/text
  hashtags: string[];
  rationale: string;
  visualSuggestion: string;
  imageUrl?: string; // AI generated image URL
  estimatedEngagement: string;
  suggestedTime: string;
  status: 'draft' | 'scheduled' | 'published';
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface AnalyticsMetric {
  name: string;
  value: number;
  change: number; // Percentage
  unit: string;
}

export interface DailyStat {
  day: string;
  engagement: number;
  reach: number;
}