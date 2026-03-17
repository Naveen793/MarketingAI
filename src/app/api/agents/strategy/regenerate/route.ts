import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Company } from '@/models/Company';
import { MarketingPlan } from '@/models/MarketingPlan';
import { generateMarketingStrategy } from '@/lib/agents/strategyAgent';

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        
        const { companyId, focus } = await req.json();
        
        if (!companyId) {
             return NextResponse.json({ success: false, error: "Missing companyId" }, { status: 400 });
        }

        const company = await Company.findById(companyId);
        if (!company) {
             return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 });
        }

        let marketingPlan: any = null;
        let retries = 0;
        const maxRetries = 3;

        while (retries < maxRetries) {
            try {
                // Trigger Gemini Strategy Agent with the optional focus 
                const strategyJson = await generateMarketingStrategy(company, focus);

                // Map contentCalendar string tasks to object format
                if (strategyJson.contentCalendar) {
                    strategyJson.contentCalendar = strategyJson.contentCalendar.map((week: any) => ({
                        week: week.week,
                        tasks: week.tasks.map((t: any) => ({ 
                            title: typeof t === 'string' ? t : t.title, 
                            explanation: typeof t === 'string' ? '' : t.explanation,
                            completed: false 
                        }))
                    }));
                }

                // Save generated Marketing Plan (Link to Company)
                marketingPlan = await MarketingPlan.create({
                    companyId: company._id,
                    focus: focus || undefined,
                    ...strategyJson
                });
                
                break; // Success
            } catch (err: any) {
                retries++;
                console.warn(`Strategy regeneration failed (attempt ${retries}/${maxRetries}):`, err.message);
                if (retries >= maxRetries) {
                    throw new Error(`Failed after ${maxRetries} attempts. Last error: ${err.message}`);
                }
            }
        }

        return NextResponse.json({ success: true, planId: marketingPlan._id });

    } catch (error: any) {
        console.error("Strategy Agent Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
