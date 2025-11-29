import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { apiKey, modelName, prompt } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key is required' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName || 'gemini-2.5-flash' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: unknown) {
    console.error('Gemini API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate content';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
