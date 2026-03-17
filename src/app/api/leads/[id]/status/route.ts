import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Lead } from "@/models/Lead";
import { auth } from "@/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const resolvedParams = await params;
        const { status } = await req.json();
        
        const validStatuses = ['new', 'contacted', 'replied', 'objection', 'call_scheduled', 'closed_won', 'closed_lost'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        await connectToDatabase();

        const updatedLead = await Lead.findByIdAndUpdate(
            resolvedParams.id,
            { status },
            { new: true }
        );

        if (!updatedLead) {
            return NextResponse.json({ error: "Lead not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, lead: updatedLead });
    } catch (error: any) {
        console.error("Error updating lead status:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
