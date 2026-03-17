import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY!;

if (!apiKey) {
    throw new Error('Please define the GEMINI_API_KEY environment variable inside .env.local');
}

export const genAI = new GoogleGenerativeAI(apiKey);

// Expose a helper to easily get the most capable default model
export const getGeminiModel = (modelName: string = 'gemini-3-flash-preview') => {
    return genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
            temperature: 0.7,
        },
    });
};
