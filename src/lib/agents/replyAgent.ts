import { getGeminiModel } from "@/lib/gemini";

export async function generateReplyEmail(inboundText: string, threadHistory: any[], company: any, lead: any) {
  const model = getGeminiModel("gemini-3-flash-preview");

  const formattedHistory = threadHistory.map((t: any) => `[${t.direction.toUpperCase()}] ${t.body}`).join('\n\n');

  const prompt = `
  You are an expert B2B Sales Executive.
  You just received a reply from a prospect. Your job is to analyze their sentiment and draft a response.
  
  OUR COMPANY:
  Name: ${company.companyName}
  Elevator Pitch: ${company.description}
  
  THE PROSPECT:
  Name: ${lead.pocName}
  Company: ${lead.leadCompanyName}
  
  PREVIOUS THREAD (Context):
  ${formattedHistory}
  
  THEIR LATEST REPLY:
  ${inboundText}
  
  YOUR TASK:
  1. Determine the sentiment of their reply. Must be ONE of: 'interested', 'objection', 'not_now', 'unsubscribed', 'neutral'
  2. Draft a context-aware, highly persuasive response. 
     - If it's an objection, handle it professionally using our value proposition.
     - If they are interested, try to push for a quick 10-minute discovery call (unless they already booked one).
     - If they ask to unsubscribe, leave the body blank.
     
  Return ONLY a raw JSON object formatted exactly like this. NO Markdown formatting.
  {
    "sentiment": "interested|objection|not_now|unsubscribed|neutral",
    "subject": "Re: [Their subject or your previous subject]",
    "body": "The drafted email response...\\n\\nCheers,\\nAgent."
  }
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleanJson = text.replace(/```json\n?/g, '').replace(/```/g, '').trim();

  return JSON.parse(cleanJson);
}
