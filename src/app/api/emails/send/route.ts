import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { EmailThread } from '@/models/EmailThread';
import { Lead } from '@/models/Lead';
import { resend } from '@/lib/resend';

export async function POST(req: Request) {
    try {
        await connectToDatabase();

        // Support FormData (from standard HTML forms) or JSON
        let threadId, leadId;
        const contentType = req.headers.get("content-type") || "";

        if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            threadId = formData.get("threadId");
            leadId = formData.get("leadId");
        } else {
            const body = await req.json();
            threadId = body.threadId;
            leadId = body.leadId;
        }

        if (!threadId || !leadId) {
            throw new Error("Missing threadId or leadId");
        }

        const thread = await EmailThread.findById(threadId);
        const lead = await Lead.findById(leadId);

        if (!thread || !lead) {
            throw new Error("Thread or Lead not found");
        }

        // FIRE TO RESEND API
        // Using a verified testing domain in Resend. In production, use your own domain.
        const { data, error } = await resend.emails.send({
            from: 'MarketAI Pro <onboarding@resend.dev>',
            to: [lead.pocEmail], // Send securely to lead
            subject: thread.subject,
            text: thread.body,
        });

        if (error) {
            console.error("Resend API Error:", error);
            throw new Error(error.message);
        }

        // Update DB
        thread.messageId = data?.id;
        await thread.save();

        // Mark lead as contacted!
        lead.status = 'contacted';
        await lead.save();

        // Redirect user back to the lead profile
        return NextResponse.redirect(new URL(`/leads/${lead._id}`, req.url), 303);

    } catch (error: any) {
        console.error("Send Email Error:", error);
        // On error, let's just return JSON for now
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
