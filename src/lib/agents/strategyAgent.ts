import { getGeminiModel } from "@/lib/gemini";
import type { ICompany } from "@/models/Company";

export async function generateMarketingStrategy(company: ICompany, focus?: string) {
    const model = getGeminiModel("gemini-3-flash-preview");

    const prompt = `
  You are an elite Chief Marketing Officer (CMO) and Growth Hacker. 
  Generate a comprehensive B2B Marketing & Sales Strategy Plan for the following company.
  
  COMPANY PROFILE:
  Name: ${company.companyName}
  Industry: ${company.industry}
  Description: ${company.description}
  Target Audience: ${company.targetAudience}
  Geographies: ${company.geographies}
  Competitors: ${company.competitors}
  Brand Tone: ${company.brandTone}
  ${focus ? `\n  CRITICAL CAMPAIGN FOCUS: This strategy must be specifically tailored for the following campaign/goal: "${focus}"\n` : ''}
  Products to Sell:
  ${company.productsToSell.map(p => `- ${p.name} (${p.price}): ${p.description}. USP: ${p.usp}`).join('\n')}
  
  YOUR TASK:
  Return ONLY a valid, raw JSON object representing the exact TypeScript interface IMarketingPlan below. Do NOT use markdown codeblocks (no \`\`\`json). Just the JSON string.
  
  REQUIRED JSON STRUCTURE:
  {
    "social": {
      "instagram": {
        "postsPerWeek": "string",
        "reelsPerWeek": "string",
        "contentIdeas": [{ "id": "1", "concept": "string", "format": "image|reel|carousel", "target": "string" }],
        "captionTemplates": ["string"],
        "hashtagSets": ["string"]
      },
      "facebook": {
        "postsPerWeek": "string",
        "adStrategy": "string",
        "audienceTargeting": "string",
        "adCopyIdeas": [{ "headline": "string", "description": "string" }]
      },
      "linkedin": {
        "postsPerWeek": "string",
        "outreachStrategy": "string",
        "postIdeas": [{ "id": "1", "concept": "string" }]
      },
      "other": [{ "platform": "string", "strategy": "string" }]
    },
    "emailScripts": [
      { "purpose": "cold outreach", "subject": "string", "body": "string containing a comprehensive, multi-paragraph professional email of at least 150 words" },
      { "purpose": "follow up", "subject": "string", "body": "string containing a comprehensive, multi-paragraph professional email of at least 150 words" }
    ],
    "smsScripts": [{ "purpose": "string", "message": "string" }],
    "paidMedia": {
      "totalMonthlyBudgetRecommended": 10000,
      "googleAds": {
        "monthlyBudget": 5000,
        "campaignTypes": ["Search", "Display"],
        "keywords": ["string"],
        "negativeKeywords": ["string"],
        "estimatedCPC": 2.5,
        "estimatedMonthlyClicks": 1000,
        "estimatedConversions": 50,
        "adCopyIdeas": [{ "headline": "string", "description": "string" }],
        "landingPageRecommendations": "string"
      },
      "metaAds": {
        "monthlyBudget": 5000,
        "audienceTargeting": { "interests": ["string"], "demographics": "string", "lookalike": "string" },
        "adFormats": ["Reel", "Carousel"],
        "estimatedReach": 50000,
        "estimatedCPM": 15.0,
        "creativeIdeas": ["string"]
      },
      "otherChannels": [{ "channel": "string", "monthlyBudget": 0, "strategy": "string", "estimatedROI": "string" }]
    },
    "contentCalendar": [
      { "week": "Week 1", "tasks": [{ "title": "string", "explanation": "string detailing exactly what to do and how to execute this task" }] }
    ]
  }
  `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean up potential markdown formatting if the model disobeys
    const cleanJson = text.replace(/```json\n?/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanJson);
}
