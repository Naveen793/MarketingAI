import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Lead } from '@/models/Lead';
import { Company } from '@/models/Company';
import { EmailThread } from '@/models/EmailThread';
import { generateCallScript } from '@/lib/agents/callScriptAgent';

export async function POST(req: Request) {
    try {
        const { leadId } = await req.json();
        if (!leadId) throw new Error("Missing leadId");

        await connectToDatabase();

        const lead = await Lead.findById(leadId);
        if (!lead) throw new Error("Lead not found");

        const company = await Company.findById(lead.companyId).lean();
        if (!company) throw new Error("Company context lost");

        const threadHistory = await EmailThread.find({ leadId: lead._id.toString() } as any).sort({ sentAt: 1 }).lean();

        // Trigger AI Agent to generate script
        const scriptMarkdown = await generateCallScript(company, lead, threadHistory);

        // Save to Lead profile so it's always ready
        lead.callScript = scriptMarkdown;
        lead.status = 'call_scheduled';
        await lead.save();

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Call Script Agent Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
