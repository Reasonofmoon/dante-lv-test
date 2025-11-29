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

export const MODEL_NAME = "gemini-2.5-flash"; // Updated to latest standard model
// User requested "gemini-2.5-flash" or "gemini-2.5-pro". We will try to use the user's requested model string dynamically.
