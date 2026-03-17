import { getGeminiModel } from "@/lib/gemini";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    try {
        const { idea, companyName } = await req.json();

        // 1. Generate the Caption and the Image Prompt
        const textModel = getGeminiModel("gemini-3-flash-preview");
        
        const textPrompt = `
        You are an expert Social Media Manager for ${companyName}.
        I have a high-level content idea for an Instagram post: "${idea.concept}" (Format: ${idea.format}, Target: ${idea.target}).
        
        Please provide two things in strict JSON format:
        1. 'caption': A highly engaging, conversion-optimized Instagram caption including emojis and 5-10 relevant hashtags.
        2. 'imagePrompt': A highly detailed, photorealistic image generation prompt that vividly describes the visual to accompany this post. Make it suitable for a high-end AI image generator.
        
        Respond ONLY with a raw JSON object:
        {
            "caption": "The full caption text...",
            "imagePrompt": "The specific image generation prompt..."
        }
        `;

        const textResult = await textModel.generateContent(textPrompt);
        let textResponse = textResult.response.text();
        textResponse = textResponse.replace(/```json\n?/g, '').replace(/```/g, '').trim();
        const contentData = JSON.parse(textResponse);

        // 2. Generate the Image using Nano Banana 2 (gemini-3.1-flash-image-preview / imagen)
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        
        // Primary attempt using Nano Banana model via REST to bypass any SDK limitations with images
        let base64Image = null;
        
        try {
            // "Nano Banana 2" (gemini-3.1-flash-image-preview) 
            const imgModel = genAI.getGenerativeModel({ model: "gemini-3.1-flash-image-preview" });
            const imgResult = await imgModel.generateContent(contentData.imagePrompt);
            const candidates = imgResult.response.candidates;
            
            if (candidates && candidates[0] && candidates[0].content.parts[0].inlineData) {
                base64Image = candidates[0].content.parts[0].inlineData.data;
            } else if (candidates && candidates[0] && candidates[0].content.parts[0].text) {
                 // Fallback if it returned text for some reason
                 console.log("Model returned text instead of inlineData");
            }
        } catch (imgError: any) {
            console.error("Nano Banana execution error:", imgError.message);
            // Fallback to Imagen 3 API Rest call if the SDK model string failed
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${process.env.GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        instances: [{ prompt: contentData.imagePrompt }],
                        parameters: { sampleCount: 1, aspectRatio: "1:1" }
                    })
                });
                const data = await response.json();
                if (data.predictions && data.predictions[0]) {
                    base64Image = data.predictions[0].bytesBase64Encoded;
                }
            } catch (fallbackError) {
                console.error("Imagen fallback error:", fallbackError);
                // Return a generated placeholder image if APIs fail due to rate limits
                console.log("Using placeholder image fallback due to API limits.");
            }
        }

        // If base64Image is still null, generate a fallback placeholder image
        const finalImage = base64Image 
            ? `data:image/jpeg;base64,${base64Image}` 
            : `https://placehold.co/1080x1080/1a1a1a/8b5cf6?text=${encodeURIComponent(idea.concept.split(' ').slice(0, 3).join('+'))}`;

        return NextResponse.json({
            success: true,
            caption: contentData.caption,
            imagePrompt: contentData.imagePrompt,
            image: finalImage,
        });

    } catch (error: any) {
        console.error("Create Post Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
