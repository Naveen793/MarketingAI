import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { MarketingPlan } from '@/models/MarketingPlan';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        
        const resolvedParams = await params;
        const planId = resolvedParams.id;

        if (!planId) {
            return NextResponse.json({ success: false, error: "Missing plan ID" }, { status: 400 });
        }

        const deletedPlan = await MarketingPlan.findByIdAndDelete(planId);

        if (!deletedPlan) {
            return NextResponse.json({ success: false, error: "Plan not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Campaign deleted successfully" });

    } catch (error: any) {
        console.error("Error deleting campaign:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
