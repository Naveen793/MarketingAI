import connectToDatabase from "@/lib/mongodb";
import { CampaignGoal } from "@/models/CampaignGoal";
import { Company } from "@/models/Company";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDatabase();
        // Assuming single-user for now
        const companies = await Company.find().lean();
        if (!companies.length) return NextResponse.json([]);
        const companyId = companies[0]._id;

        const goals = await CampaignGoal.find({ companyId: companyId.toString() } as any).sort({ deadline: 1 }).lean();
        return NextResponse.json(goals);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
