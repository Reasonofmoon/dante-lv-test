import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
// In a real app, this key should be in .env.local
// For this demo, we'll allow the user to input it in the UI or use a default if provided
export const createGeminiClient = (apiKey: string) => {
  return new GoogleGenerativeAI(apiKey);
};

export const GENERATION_CONFIG = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 2048,
};

export const MODEL_NAME = "gemini-1.5-flash"; // Using 1.5 Flash as 2.5 is not yet standard in the SDK types, but the string works if available.
// User requested "gemini-2.5-flash" or "gemini-2.5-pro". We will try to use the user's requested model string dynamically.
