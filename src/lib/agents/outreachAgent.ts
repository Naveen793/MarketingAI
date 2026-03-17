import { getGeminiModel } from "@/lib/gemini";

export async function generateOutreachEmail(company: any, plan: any, lead: any, threadHistory?: any[]) {
    const model = getGeminiModel("gemini-3-flash-preview"); // Flash is fast enough for email drafting

    const prompt = `
  You are an expert B2B Sales Development Representative (SDR).
  Draft a highly personalized, high-converting cold outreach email (or reply) to this lead.
  
  OUR COMPANY:
  Name: ${company.companyName}
  Elevator Pitch: ${company.description}
  Tone: ${company.brandTone}
  Products we sell: ${company.productsToSell.map((p: any) => p.name).join(', ')}

  OUR COLD OUTREACH STRATEGY (from Marketing Plan):
  ${plan.emailScripts[0]?.body || 'Focus on value prop and keeping it under 150 words.'}

  THE TARGET LEAD:
  Name: ${lead.pocName}
  Target Company: ${lead.leadCompanyName}
  Industry: ${lead.industry}
  Specific Notes/Context: ${lead.notes || 'None'}
  
  ${threadHistory && threadHistory.length > 0 ? `CONVERSATION HISTORY:\n${threadHistory.map(msg => `[${msg.direction.toUpperCase()}]: ${msg.subject}\n${msg.body}`).join('\n\n')}\n\nYOUR TASK:\nThe lead has replied! Formulate a compelling response addressing their concerns or moving them to the next step (booking a call).` : `YOUR TASK:\nCombine our value proposition with the context of the Target Lead to draft a hyper-personalized email.\nIt must not look like a generic template. Use their name and company name naturally.\nEnd with a soft Call To Action (CTA).`}
  
  REQUIREMENTS:
  Return ONLY a raw JSON object with the subject and body. No markdown.
  {
    "subject": "The email subject line",
    "body": "The full email body text with proper line breaks\\n\\nLike this."
  }
  `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanJson = text.replace(/```json\n?/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanJson);
}
