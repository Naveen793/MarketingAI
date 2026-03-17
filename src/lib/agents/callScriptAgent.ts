import { getGeminiModel } from "@/lib/gemini";

export async function generateCallScript(company: any, lead: any, threadHistory: any[]) {
    const model = getGeminiModel("gemini-3-flash-preview");

    const formattedHistory = threadHistory.map((t: any) => `[${t.direction.toUpperCase()}] ${t.body}`).join('\n\n');

    const prompt = `
  You are an elite B2B Sales Closer.
  The prospect agreed to a call (or showed high interest). Write a highly effective, tailored call script for this specific prospect.
  
  OUR COMPANY:
  Name: ${company.companyName}
  Elevator Pitch: ${company.description}
  
  THE PROSPECT:
  Name: ${lead.pocName}
  Target Company: ${lead.leadCompanyName}
  Industry: ${lead.industry}
  
  EMAIL THREAD HISTORY (Context of what was discussed so far):
  ${formattedHistory}
  
  YOUR TASK:
  Design a call script that includes:
  1. An opening (building rapport based on their emails or industry).
  2. The Hook (Why they took the call).
  3. Discovery Questions (3-4 sharp questions to uncover their specific pain points).
  4. The Pitch (How our product solves their specific pain, referencing past emails).
  5. Anticipated Objections & Rebuttals.
  6. The Close (Clear next steps).

  RETURN FORMAT:
  Return the script as raw Markdown. No JSON this time. Do not wrap in markdown code blocks (\`\`\`markdown). Just return the markdown text directly.
  `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // Clean up if it still wraps in markdown blocks
    if (text.startsWith("\`\`\`markdown")) {
        text = text.replace(/^\`\`\`markdown\n?/, '').replace(/\n?\`\`\`$/, '');
    }

    return text;
}
