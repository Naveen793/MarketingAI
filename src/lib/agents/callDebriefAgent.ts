import { getGeminiModel } from "@/lib/gemini";

export async function generateCallDebrief(callNotes: string, company: any, lead: any) {
    const model = getGeminiModel("gemini-3-flash-preview");

    const prompt = `
  You are a highly analytical Sales Manager.
  Analyze the raw notes taken by the sales rep during a meeting with a prospect.

  OUR COMPANY:
  Name: ${company.companyName}
  
  THE PROSPECT:
  Name: ${lead.pocName}
  Company: ${lead.leadCompanyName}
  
  SALES REP RAW CALL NOTES:
  ${callNotes}
  
  YOUR TASK:
  1. Summarize the call clearly (Key takeaways, Prospect's pain points).
  2. Define strict Next Steps for the Sales Rep.
  3. Determine the likelihood of closing this deal based on the notes. Give a Closing Recommendation: "Close Now", "Nurture", or "Walk Away".
  
  REQUIREMENTS:
  Return ONLY a raw JSON object formatted exactly like this. NO Markdown formatting.
  {
    "summary": "Clear, concise summary of the call...",
    "nextSteps": "1. Send proposal\\n2. Follow up in 3 days...",
    "closingRecommendation": "Close Now|Nurture|Walk Away"
  }
  `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanJson = text.replace(/```json\n?/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanJson);
}
