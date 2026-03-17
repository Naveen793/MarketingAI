import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Lead } from '@/models/Lead';
import { EmailThread } from '@/models/EmailThread';
import { Company } from '@/models/Company';
import { generateReplyEmail } from '@/lib/agents/replyAgent';

export async function POST(req: Request) {
    try {
        const payload = await req.json();

        // Quick validation to ensure it's a Resend Webhook payload
        if (!payload.type || payload.type !== "email.received") {
            return NextResponse.json({ success: true, message: "Ignored non-receive webhook." });
        }

        const emailData = payload.data;
        const fromEmail = emailData.from.toLowerCase();

        await connectToDatabase();

        // 1. Find the Lead by email (in production, match by thread Message-ID headers to be exact)
        const lead = await Lead.findOne({ pocEmail: fromEmail });

        if (!lead) {
            console.warn("Received email from unknown lead:", fromEmail);
            return NextResponse.json({ success: true, message: "Lead not found" });
        }

        // 2. Save the Inbound Email
        const inboundThread: any = await EmailThread.create({
            leadId: lead._id.toString(),
            direction: 'inbound',
            subject: emailData.subject,
            body: emailData.text || emailData.html || "No content",
            messageId: emailData.id,
            sentiment: 'neutral' // will be updated by Agent
        });

        // 3. Fetch context for the Agent
        const company = await Company.findById(lead.companyId).lean();
        const threadHistory = await EmailThread.find({ leadId: lead._id.toString() } as any).sort({ sentAt: 1 }).lean();

        if (!company) throw new Error("Company context lost");

        // 4. Trigger Reply Agent (Sentiment Analysis & Draft Generation)
        const replyData = await generateReplyEmail(inboundThread.body, threadHistory, company, lead);

        // Update inbound sentiment
        inboundThread.sentiment = replyData.sentiment;
        await inboundThread.save();

        // Map AI sentiment to Lead Status
        lead.status = replyData.sentiment === 'interested' ? 'replied' : (replyData.sentiment === 'unsubscribed' ? 'closed_lost' : replyData.sentiment);
        await lead.save();

        // 5. If they didn't unsubscribe, save the new drafted outbound response
        if (replyData.sentiment !== 'unsubscribed') {
            await EmailThread.create({
                leadId: lead._id.toString(),
                direction: 'outbound',
                subject: replyData.subject,
                body: replyData.body,
                sentiment: 'neutral' // It's a draft
            });
        }

        // Success response to Resend
        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Inbound Webhook Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
