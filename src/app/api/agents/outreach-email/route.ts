import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Lead } from '@/models/Lead';
import { Company } from '@/models/Company';
import { MarketingPlan } from '@/models/MarketingPlan';
import { EmailThread } from '@/models/EmailThread';
import { generateOutreachEmail } from '@/lib/agents/outreachAgent';

export async function POST(req: Request) {
    try {
        await connectToDatabase();

        // 1. Parse lead creation details
        const leadData = await req.json();

        let lead;
        let company;
        let plan;

        // 1. Resolve Lead Context
        if (leadData.leadId) {
            lead = await Lead.findById(leadData.leadId).lean();
            if (!lead) throw new Error("Lead not found");
        }

        // 2 & 3. Dynamically Resolve Contextual Company and Marketing Plan (passed via campaignId)
        if (leadData.campaignId) {
            plan = await MarketingPlan.findById(leadData.campaignId).lean();
            if (!plan) throw new Error("Campaign/Marketing Plan not found");
            
            company = await Company.findById(plan.companyId).lean();
            
        } else if (lead) {
             // General Outreach Mode for an existing lead
            company = await Company.findById(lead.companyId).lean();
            if (!company) throw new Error("Company context lost for this lead.");
            
            plan = await MarketingPlan.findOne({ companyId: company._id.toString() }).lean();
            
            // Fallback: If this old company has no plan, get the user's active/latest plan
            if (!plan && company.userId) {
                const userCompanies = await Company.find({ userId: company.userId }).select('_id').lean();
                const companyIds = userCompanies.map(c => c._id.toString());
                plan = await MarketingPlan.findOne({ companyId: { $in: companyIds } }).sort({ createdAt: -1 }).lean();
                
                if (plan) {
                     company = await Company.findById(plan.companyId).lean();
                }
            }
        } else {
            // Completely New Lead Flow (No leadId provided)
            company = await Company.findOne().lean();
            if (!company) throw new Error("Please complete Onboarding first.");
            
            plan = await MarketingPlan.findOne({ companyId: company._id.toString() }).lean();
            
            lead = await Lead.create({
                ...leadData,
                companyId: company._id,
                status: 'new'
            });
        }

        if (!plan || !company || !lead) throw new Error("A Marketing Plan has not been generated for your company yet! Go to the Action Strategy tab first.");

        // 4. Trigger Outreach Gemini Agent
        const emailDraft = await generateOutreachEmail(company, plan, lead);

        // 4. Save the drafted email to EmailThread (as a draft)
        // We haven't actually sent it yet via Resend. The Manager reviews it in the UI and clicks SEND.
        const thread = await EmailThread.create({
            leadId: lead._id.toString(),
            direction: 'outbound',
            subject: emailDraft.subject,
            body: emailDraft.body,
            sentiment: 'neutral'
        });

        return NextResponse.json({ success: true, leadId: lead._id, threadId: thread._id });

    } catch (error: any) {
        console.error("Outreach Agent Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
