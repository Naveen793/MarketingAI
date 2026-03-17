import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Lead } from '@/models/Lead';
import { Company } from '@/models/Company';
import { EmailThread } from '@/models/EmailThread';
import { getGeminiModel } from "@/lib/gemini";

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        
        const { leadId, prompt } = await req.json();
        
        const lead = await Lead.findById(leadId).lean();
        if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
        
        const company = await Company.findById(lead.companyId).lean();
        if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });
        
        const threadHistory = await EmailThread.find({ leadId: lead._id.toString() } as any).sort({ sentAt: 1 }).lean();
        const formattedHistory = threadHistory.map((t: any) => `[${t.direction.toUpperCase()}] ${t.body}`).join('\n\n');

        const model = getGeminiModel("gemini-3-flash-preview");
        
        const aiPrompt = `
        You are an expert B2B Sales Executive working for ${company.companyName}.
        Elevator Pitch: ${company.description}
        
        You are emailing: ${lead.pocName} at ${lead.leadCompanyName}.
        
        PREVIOUS THREAD HISTORY:
        ${formattedHistory || "No previous emails sent yet."}
        
        YOUR TASK:
        The manager has given you the following instruction for the next email:
        "${prompt}"
        
        Draft a highly persuasive, professional, context-aware email response based on the manager's prompt. 
        Always include a concise, relevant Subject Line.
        
        Return ONLY a raw JSON object formatted exactly like this. NO Markdown formatting, no code blocks.
        {
          "subject": "The email subject line",
          "body": "The drafted email response...\\n\\nCheers,\\nAgent."
        }
        `;

        const result = await model.generateContent(aiPrompt);
        const text = result.response.text();
        const cleanJson = text.replace(/```json\n?/g, '').replace(/```/g, '').trim();
        const parsedData = JSON.parse(cleanJson);

        // Save as outbound draft
        const thread = await EmailThread.create({
            leadId: lead._id.toString(),
            direction: 'outbound',
            subject: parsedData.subject,
            body: parsedData.body,
            sentiment: 'neutral'
        });

        return NextResponse.json({ success: true, threadId: thread._id });
        
    } catch (error: any) {
        console.error("Custom Email Agent Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
