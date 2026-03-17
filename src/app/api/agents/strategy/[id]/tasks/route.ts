import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { MarketingPlan } from '@/models/MarketingPlan';

export async function PATCH(
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

        const { weekIndex, taskIndex, completed } = await request.json();

        // Use positional operator to update the deeply nested array element
        const updatePath = `contentCalendar.${weekIndex}.tasks.${taskIndex}.completed`;

        const updatedPlan = await MarketingPlan.findByIdAndUpdate(
            planId,
            { $set: { [updatePath]: completed } },
            { new: true }
        );

        if (!updatedPlan) {
            return NextResponse.json({ success: false, error: "Plan not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Error updating task status:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
