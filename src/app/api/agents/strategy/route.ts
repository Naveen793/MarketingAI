import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectToDatabase from '@/lib/mongodb';
import { Company } from '@/models/Company';
import { MarketingPlan } from '@/models/MarketingPlan';
import { generateMarketingStrategy } from '@/lib/agents/strategyAgent';

export async function POST(req: Request) {
    try {
        await connectToDatabase();

        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Parse request body (Company Onboarding Data)
        const body = await req.json();

        // 2. Save Company profile
        const company = await Company.create({
            ...body,
            userId
        });

        let marketingPlan: any = null;
        let retries = 0;
        const maxRetries = 3;

        while (retries < maxRetries) {
            try {
                // 3. Trigger Gemini Strategy Agent
                const strategyJson = await generateMarketingStrategy(company);

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

                // 4. Save generated Marketing Plan (Link to Company)
                marketingPlan = await MarketingPlan.create({
                    companyId: company._id,
                    name: body.strategyName,
                    ...strategyJson
                });
                
                break; // Success
            } catch (err: any) {
                retries++;
                console.warn(`Strategy generation failed (attempt ${retries}/${maxRetries}):`, err.message);
                if (retries >= maxRetries) {
                    throw new Error(`Failed after ${maxRetries} attempts. Last error: ${err.message}`);
                }
            }
        }

        // 5. Trigger Goals Agent (asynchronously, or we can await it here)
        // We'll call an internal helper or just let the dashboard fetch it later.

        return NextResponse.json({ success: true, companyId: company._id, planId: marketingPlan._id });

    } catch (error: any) {
        console.error("Strategy Agent Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
