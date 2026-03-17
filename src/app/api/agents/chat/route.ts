import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import connectToDatabase from "@/lib/mongodb";
import { MarketingPlan } from "@/models/MarketingPlan";
import { Company } from "@/models/Company";
import { auth } from "@/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { planId, history, message } = await req.json();

        if (!planId || !message) {
            return NextResponse.json({ error: "Missing planId or message" }, { status: 400 });
        }

        await connectToDatabase();

        const plan = await MarketingPlan.findById(planId).lean();
        if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });

        const company = await Company.findById(plan.companyId).lean();
        if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

        // Build a robust system prompt including context of the generated strategy
        const systemPrompt = `You are "Marketing Geni", an expert AI marketing consultant. 
You are speaking with the manager of ${company.companyName}.
Company Industry: ${company.industry}
Company Description: ${company.description}
Their Target Audience: ${company.targetAudience}

We have already generated a comprehensive marketing strategy for them.
Here is the raw JSON of their current Marketing Plan:
${JSON.stringify(plan, null, 2)}

Your Goal: Answer any questions the user has specifically about this strategy. 
If they want to rewrite an email, generate a new one based on these constraints. 
If they ask for Facebook ad ideas, reference the plan and expand on it.
If the user says something random, very short, or nonsensical (like "0" or "hello"), politely and briefly ask how you can assist them with their marketing strategy today, rather than reciting a large summary of the plan.
Provide actionable, highly specific advice. Format your output in clean Markdown.
Be encouraging, professional, and reference the strategy where applicable.
Keep responses concise but highly valuable. Do not hallucinate data outside of their industry.`;

        const model = genAI.getGenerativeModel({ 
            model: "gemini-3-flash-preview",
            systemInstruction: systemPrompt 
        });

        const chat = model.startChat({
            history: history
        });

        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        return NextResponse.json({ response: responseText });

    } catch (error) {
        console.error("Marketing Geni Chat Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
