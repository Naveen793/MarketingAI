import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Company } from '@/models/Company';
import { MarketingPlan } from '@/models/MarketingPlan';
import { Lead } from '@/models/Lead';
import { CampaignGoal } from '@/models/CampaignGoal';

export async function GET() {
    await connectToDatabase();
    
    const companies = await Company.find().lean();
    const plans = await MarketingPlan.find().lean();
    const leads = await Lead.find().lean();
    const goals = await CampaignGoal.find().lean();
    
    return NextResponse.json({
        companies: companies.map(c => ({ _id: c._id, name: c.companyName })),
        plans: plans.map(p => ({ _id: p._id, companyId: p.companyId })),
        leads: leads.map(l => ({ _id: l._id, name: l.pocName, companyId: l.companyId })),
        goals: goals.map(g => ({ _id: g._id, title: g.title, companyId: g.companyId }))
    });
}
