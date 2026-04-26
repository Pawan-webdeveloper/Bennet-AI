import connectDB from "@/app/lib/db";
import Settings from "@/model/settings.model";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, ownerId } = await req.json();
    if (!message || !ownerId) {
      return NextResponse.json(
        { message: "Message and Owner id is required" },
        { status: 400 },
      );
    }

    await connectDB();
    const setting = await Settings.findOne({ ownerId });
    if (!setting) {
      return NextResponse.json(
        { message: "Your Chatbot is not configured yet" },
        { status: 400 },
      );
    }
    const KNOWLEDGE = `
        business name- ${setting.businessName || "not provided" }
        support email- ${setting.supportEmail || "not provided" }
        knowledge- ${setting.knowledge || "not provided" }`

    const prompt = `
        You are a professional customer support assistant for this business
        
        Use ONLY the information provided below to answer customer questions.
        You may rephrase,summarize or interpret the information if needed.
        Do NOT invent new policies,prices, or promises.
        
        if the customer question is completely unrelated to the information, or cannot be reasonably answered with it, reply exactly with : "Please Contact Support".
        --------------------------------
        Business INformation:
        ${KNOWLEDGE}
        --------------------
        Customer Questions: 
        ${message}
        ---------------
        Answer :
        
        ------------
        `;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const response = NextResponse.json(res.text)

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return response

  } catch (error) {
    const response = NextResponse.json(
        { message: `Chat error ${error}`},
        { status: 500 },
      );
      response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return response
  }
}

export const OPTIONS = async()=> {
  return NextResponse.json(null,{
    status: 201,
    headers: {
      "Access-Control-Allow-Origin"
      : "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }
  })
}