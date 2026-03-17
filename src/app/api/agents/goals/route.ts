import connectToDatabase from '@/lib/mongodb';
import { MarketingPlan } from '@/models/MarketingPlan';
import { CampaignGoal } from '@/models/CampaignGoal';
import { getGeminiModel } from '@/lib/gemini';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const { companyId, planId } = await req.json();

        const plan = await MarketingPlan.findById(planId);
        if (!plan) throw new Error("Marketing plan not found");

        const model = getGeminiModel();
        const prompt = `
      You are an expert Performance Marketing Director.
      Look at this marketing plan and generate 3-5 SMART Campaign Goals for the company.
      
      MARKETING PLAN DATA:
      ${JSON.stringify(plan)}
      
      REQUIREMENTS:
      Return ONLY a raw JSON array of goals. Do NOT use markdown.
      
      Format for each goal object:
      {
        "title": "string",
        "category": "revenue" | "leads" | "social" | "ads" | "email",
        "targetValue": 1000,
        "unit": "string (e.g. leads, $, followers)",
        "deadline": "2026-12-31T00:00:00.000Z",
        "milestones": [
          { "label": "string", "targetValue": 250, "dueDate": "2026-06-30T00:00:00.000Z" }
        ]
      }
    `;

        const result = await model.generateContent(prompt);
        const cleanJson = result.response.text().replace(/```json\n?/g, '').replace(/```/g, '').trim();
        const goalsArray = JSON.parse(cleanJson);

        // Save goals into DB
        const savedGoals = await Promise.all(
            goalsArray.map((g: any) =>
                CampaignGoal.create({ companyId, ...g })
            )
        );

        return NextResponse.json({ success: true, goals: savedGoals });

    } catch (err: any) {
        console.error("Goals Agent Error:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
