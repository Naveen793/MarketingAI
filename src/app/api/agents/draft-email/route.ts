import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { message, systemContext } = await req.json();

        if (!message || !systemContext) {
            return NextResponse.json({ error: "Missing message or context" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ 
            model: "gemini-3-flash-preview",
            systemInstruction: systemContext
        });

        const result = await model.generateContent(message);
        const responseText = result.response.text();

        return NextResponse.json({ response: responseText });

    } catch (error) {
        console.error("Draft Email Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
