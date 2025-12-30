
import { GoogleGenAI, Type } from "@google/genai";
import { UserPersona, GeneratedPost, Platform, BrandVoiceGuide } from "../types";
import { STRATEGIST_SYSTEM_INSTRUCTION } from "../constants";

// Initialize the client
// NOTE: We assume process.env.API_KEY is available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Update to supported models: gemini-3-flash-preview for text, gemini-2.5-flash-image for images
const MODEL_TEXT = 'gemini-3-flash-preview';
const MODEL_IMAGE = 'gemini-2.5-flash-image';

/**
 * Generates a social media post based on the user's persona and specific request.
 */
export const generatePost = async (
  persona: UserPersona,
  platform: Platform,
  topic: string,
  context?: string,
  refinement?: { originalContent: string; feedback: string }
): Promise<GeneratedPost> => {
  
  const voiceInstructions = persona.brandVoiceGuide 
    ? `
      STRICTLY ADHERE TO THIS BRAND VOICE:
      Tone: ${persona.brandVoiceGuide.tone}
      Style: ${persona.brandVoiceGuide.style}
      Vocabulary: ${persona.brandVoiceGuide.vocabulary.join(', ')}
      Do's: ${persona.brandVoiceGuide.dos.join(', ')}
      Don'ts: ${persona.brandVoiceGuide.donts.join(', ')}
    ` 
    : `Brand Tone: ${persona.tone}`;

  let prompt = '';

  if (refinement) {
    prompt = `
    Refine the following ${platform} post based on user feedback.
    
    Original Topic: "${topic}"
    Previous Content: "${refinement.originalContent}"
    Feedback/Instructions: "${refinement.feedback}"
    
    Target Audience: ${persona.targetAudience}
    Industry: ${persona.industry}
    Goals: ${persona.goals}
    ${voiceInstructions}

    The output must be a structured JSON object with the same schema as a new post.
    `;
  } else {
    prompt = `
    Generate a ${platform} post about: "${topic}".
    Additional Context: ${context || 'None'}

    Target Audience: ${persona.targetAudience}
    Industry: ${persona.industry}
    Goals: ${persona.goals}
    ${voiceInstructions}

    The output must be a structured JSON object.
    `;
  }

  // Define responseSchema following recommended structure
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      content: { type: Type.STRING, description: "The main caption or text content of the post. Use platform-appropriate formatting (line breaks, emojis)." },
      hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of optimized hashtags." },
      rationale: { type: Type.STRING, description: "Strategic reasoning for the hook, structure, and tone choices." },
      visualSuggestion: { type: Type.STRING, description: "A detailed description of the image or video to accompany this post." },
      estimatedEngagement: { type: Type.STRING, description: "Predicted engagement metrics (e.g., 'High - approx 200 likes')." },
      suggestedTime: { type: Type.STRING, description: "Best time to post based on general best practices." }
    },
    required: ["content", "hashtags", "rationale", "visualSuggestion", "estimatedEngagement", "suggestedTime"],
    propertyOrdering: ["content", "hashtags", "rationale", "visualSuggestion", "estimatedEngagement", "suggestedTime"]
  };

  try {
    const result = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: prompt,
      config: {
        systemInstruction: STRATEGIST_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7, // Balance creativity and adherence
      }
    });

    const parsed = JSON.parse(result.text || "{}");
    
    return {
      id: Date.now().toString(),
      platform,
      status: 'draft',
      createdAt: Date.now(),
      ...parsed
    };

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Failed to generate content. Please check your API key and try again.");
  }
};

/**
 * Generates an AI image based on a prompt.
 */
export const generateMedia = async (prompt: string): Promise<string> => {
  try {
    // Fixed contents format for image generation models according to SDK guidelines
    const response = await ai.models.generateContent({
      model: MODEL_IMAGE,
      contents: { parts: [{ text: `Create a professional social media visual for: ${prompt}` }] },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    // Iterate through candidates and parts to find the image part
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image data returned from model");
  } catch (error) {
    console.error("Media Generation Error:", error);
    throw new Error("Failed to generate AI media.");
  }
};

/**
 * Analyzes past social media posts to create a Brand Voice Guide.
 */
export const analyzeBrandVoice = async (pastPosts: string[]): Promise<BrandVoiceGuide> => {
  const prompt = `
    Analyze the following social media posts to create a detailed Brand Voice Guide.
    
    Past Posts for Analysis:
    ${pastPosts.join('\n---\n')}
    
    Your task is to extract the unique verbal signature of this brand.
    Determine the tone, writing style, recurring vocabulary, emoji usage patterns, and specific rules (Do's and Don'ts).
    Finally, rewrite the generic sentence "Check out our new product" into this specific brand voice as an example.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      tone: { type: Type.STRING, description: "3-5 adjectives describing the overall tone (e.g., 'Witty, irreverent, smart')." },
      style: { type: Type.STRING, description: "Description of sentence structure and flow (e.g., 'Short punchy sentences with frequent line breaks')." },
      vocabulary: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of characteristic words or phrases often used." },
      emojiUsage: { type: Type.STRING, description: "Rules regarding emoji usage (e.g., 'Minimal, only use 🚀 and 🔥')." },
      dos: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 3-5 things the brand ALWAYS does." },
      donts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 3-5 things the brand NEVER does." },
      exampleRewrite: { type: Type.STRING, description: "Rewrite of 'Check out our new product' in this brand voice." }
    },
    required: ["tone", "style", "vocabulary", "emojiUsage", "dos", "donts", "exampleRewrite"]
  };

  try {
    const result = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: prompt,
      config: {
        systemInstruction: STRATEGIST_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5, // Lower temperature for analytical precision
      }
    });

    return JSON.parse(result.text || "{}") as BrandVoiceGuide;

  } catch (error) {
    console.error("Voice Analysis Error:", error);
    throw new Error("Failed to analyze brand voice.");
  }
};

/**
 * Chat with the strategist (free-form conversation) with full app context.
 */
export const chatWithStrategist = async (
  persona: UserPersona,
  history: { role: 'user' | 'model'; text: string }[],
  newMessage: string,
  contextData?: string
): Promise<string> => {
  
  let personaContext = `
    Current User Persona:
    Brand: ${persona.brandName}
    Industry: ${persona.industry}
    Tone: ${persona.tone}
  `;

  if (persona.brandVoiceGuide) {
    personaContext += `
    \nESTABLISHED BRAND VOICE GUIDE:
    Style: ${persona.brandVoiceGuide.style}
    Do's: ${persona.brandVoiceGuide.dos.join(', ')}
    Don't's: ${persona.brandVoiceGuide.donts.join(', ')}
    `;
  }

  // Inject real-time app data (schedule, analytics) into the system prompt context
  if (contextData) {
    personaContext += `\n\nREAL-TIME APP DATA (Use this to answer user questions):\n${contextData}`;
  }

  // We'll append the persona context to the system instruction dynamically
  const dynamicSystemInstruction = `${STRATEGIST_SYSTEM_INSTRUCTION}\n\n${personaContext}`;

  try {
    const chat = ai.chats.create({
      model: MODEL_TEXT,
      config: {
        systemInstruction: dynamicSystemInstruction,
      }
    });

    // Chat sendMessage with named message parameter
    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I'm having trouble thinking right now.";

  } catch (error) {
    console.error("Chat Error:", error);
    return "I apologize, I encountered an error connecting to my thought engine.";
  }
};

/**
 * Suggests a target audience based on industry and brand name.
 */
export const generateTargetAudienceSuggestion = async (brandName: string, industry: string, tone: string): Promise<string> => {
  const prompt = `Identify the ideal target audience for a brand named "${brandName}" in the "${industry}" industry with a "${tone}" tone. Be specific about demographics, psychographics, and pain points. Keep it under 50 words and write it as a direct description.`;
  
  try {
    const result = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: prompt,
      config: { temperature: 0.7 }
    });
    return result.text?.trim() || "";
  } catch (error) {
    console.error("Audience Suggestion Error:", error);
    return "";
  }
};

/**
 * Suggests content pillars based on brand details.
 */
export const generateContentPillarsSuggestion = async (brandName: string, industry: string, tone: string, audience: string): Promise<string[]> => {
  const prompt = `Generate 6 specific, engaging content pillars (topics) for a "${industry}" brand named "${brandName}". 
  Target Audience: ${audience}.
  Tone: ${tone}.
  Return ONLY a JSON array of strings, e.g. ["Industry Trends", "Behind the Scenes"].`;

  const responseSchema = {
    type: Type.ARRAY,
    items: { type: Type.STRING }
  };

  try {
    const result = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: prompt,
      config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.7
      }
    });
    
    return JSON.parse(result.text || "[]");
  } catch (error) {
    console.error("Pillars Suggestion Error:", error);
    return [];
  }
};

/**
 * Generates a schedule of posts based on user request and calendar context.
 */
export const generateScheduleProposal = async (
  persona: UserPersona, 
  request: string, 
  currentDate: Date
): Promise<{ explanation: string; posts: GeneratedPost[] }> => {
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  
  const prompt = `
    You are a professional social media manager scheduling content for "${persona.brandName}" (${persona.industry}).
    Current Calendar View: ${monthName} ${year}.
    
    User Request: "${request}"
    
    Task:
    1. Create a schedule of posts that fits the user's request.
    2. Assign specific dates. If the user asks for a specific month (e.g. "January"), schedule for that month in ${year} (or ${year + 1} if appropriate).
    3. Provide a brief explanation of the schedule strategy.
    
    Brand Voice: ${persona.tone}
    Target Audience: ${persona.targetAudience}

    Return a JSON object.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      explanation: { type: Type.STRING, description: "Brief explanation of why these dates and topics were chosen." },
      posts: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            platform: { type: Type.STRING, description: "instagram, linkedin, twitter, tiktok, or threads" },
            day: { type: Type.INTEGER, description: "Day of the month (1-31)" },
            month: { type: Type.STRING, description: "Full Month name (e.g. January)" },
            year: { type: Type.INTEGER, description: "Year (e.g. 2025)" },
            content: { type: Type.STRING, description: "Draft caption or topic summary" },
            suggestedTime: { type: Type.STRING, description: "e.g. 10:00 AM" },
            rationale: { type: Type.STRING, description: "Why this post works here" }
          },
          required: ["platform", "day", "month", "year", "content", "suggestedTime", "rationale"]
        }
      }
    },
    required: ["explanation", "posts"]
  };

  try {
    const result = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: prompt,
      config: {
        systemInstruction: STRATEGIST_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7
      }
    });

    const parsed = JSON.parse(result.text || "{}");
    
    // Map the simplified response to the full GeneratedPost type
    const posts: GeneratedPost[] = (parsed.posts || []).map((p: any) => {
      // Determine date
      let postYear = p.year || year;
      let postMonthIndex = currentDate.getMonth();

      if (p.month) {
        // Try to parse month name
        const parsedIndex = new Date(`${p.month} 1, 2000`).getMonth();
        if (!isNaN(parsedIndex)) {
            postMonthIndex = parsedIndex;
        }
      }
      
      const date = new Date(postYear, postMonthIndex, p.day);

      return {
        id: Math.random().toString(36).substr(2, 9),
        platform: p.platform.toLowerCase(),
        content: p.content,
        hashtags: [], 
        rationale: p.rationale,
        visualSuggestion: "AI Generated",
        estimatedEngagement: "Predicted High",
        suggestedTime: p.suggestedTime,
        status: 'scheduled',
        createdAt: date.getTime()
      };
    });

    return {
      explanation: parsed.explanation,
      posts: posts
    };

  } catch (error) {
    console.error("Schedule Proposal Error:", error);
    throw new Error("Failed to generate schedule.");
  }
};
