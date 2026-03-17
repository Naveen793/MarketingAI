import { NextResponse } from 'next/server';
import { Lead } from '@/models/Lead';
import { Company } from '@/models/Company';
import { MarketingPlan } from '@/models/MarketingPlan';
import { EmailThread } from '@/models/EmailThread';
import { generateOutreachEmail } from '@/lib/agents/outreachAgent';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { leadId, replyBody } = await req.json();

        if (!leadId || !replyBody) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const lead = await Lead.findById(leadId).lean();
        if (!lead) throw new Error("Lead not found");

        const company = await Company.findById(lead.companyId).lean();
        if (!company) throw new Error("Company not found");

        const plan = await MarketingPlan.findOne({ companyId: company._id }).sort({ createdAt: -1 }).lean();
        if (!plan) throw new Error("No marketing plan found for this company");

        // 1. Save the inbound reply
        await EmailThread.create({
            leadId,
            companyId: company._id,
            direction: 'inbound',
            subject: `Re: ${lead.pocName} / ${company.companyName}`, // A dummy subject for now or parse from history
            body: replyBody,
            sentAt: new Date(),
        });

        // Update lead status to 'replied' if it's not already closed
        if (!['closed_won', 'closed_lost'].includes(lead.status as string)) {
             await Lead.findByIdAndUpdate(leadId, { status: 'replied' });
        }

        // 2. Fetch the updated thread history to pass to the agent
        const threadHistory = await EmailThread.find({ leadId }).sort({ sentAt: 1 }).lean();

        // 3. Draft the next outbound response
        const emailDraft = await generateOutreachEmail(company, plan, lead, threadHistory);

        // 4. Save the drafted outbound email
        await EmailThread.create({
            leadId,
            companyId: company._id,
            direction: 'outbound',
            subject: emailDraft.subject,
            body: emailDraft.body,
            sentAt: new Date(),
        });

        return NextResponse.json({ success: true, message: "Reply logged and next response drafted" });
    } catch (e: any) {
        console.error("Email Reply API Error:", e);
        return NextResponse.json({ error: e.message || "Failed to process email reply" }, { status: 500 });
    }
}
