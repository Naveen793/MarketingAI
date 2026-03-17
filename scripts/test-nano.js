import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "DUMMY"; // I'll use the one from env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function main() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-3-pro-image-preview" });
        const result = await model.generateContent("A cute banana");
        console.log("Success! Keys in response:", Object.keys(result.response));
        console.log("Candidates:", JSON.stringify(result.response.candidates, null, 2));
    } catch (e) {
        console.error("Error:", e.message);
    }
}

main();
