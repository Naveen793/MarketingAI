import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Lead } from '@/models/Lead';
import { Company } from '@/models/Company';
import { generateCallDebrief } from '@/lib/agents/callDebriefAgent';

export async function POST(req: Request) {
    try {
        const { leadId, rawNotes } = await req.json();
        if (!leadId || !rawNotes) throw new Error("Missing leadId or rawNotes");

        await connectToDatabase();

        const lead = await Lead.findById(leadId);
        if (!lead) throw new Error("Lead not found");

        const company = await Company.findById(lead.companyId).lean();
        if (!company) throw new Error("Company context lost");

        // Trigger AI Agent to analyze the raw notes
        const debrief = await generateCallDebrief(rawNotes, company, lead);

        // Update Lead with debrief history and closing recommendation
        lead.callDebriefHistory.push({
            summary: debrief.summary,
            nextSteps: debrief.nextSteps,
            date: new Date()
        });

        lead.closingRecommendation = debrief.closingRecommendation;

        // Update status based on recommendation
        if (debrief.closingRecommendation === 'Close Now') lead.status = 'closed_won';
        else if (debrief.closingRecommendation === 'Walk Away') lead.status = 'closed_lost';
        // If 'Nurture', keep it as call_scheduled or maybe custom status

        await lead.save();

        return NextResponse.json({ success: true, debrief });

    } catch (error: any) {
        console.error("Call Debrief Agent Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
