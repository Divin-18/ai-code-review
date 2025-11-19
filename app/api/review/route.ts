import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize the client
// We explicitly pass the key to ensure Next.js server-side env vars are read correctly
const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "Code snippet is required." },
        { status: 400 }
      );
    }

    const prompt = `
      You are an expert Senior Software Engineer and Code Reviewer.
      Review the following code snippet.
      
      Your review must include:
      1. 🔴 **Critical Issues**: Bugs, security vulnerabilities, or logic errors.
      2. 🟡 **Improvements**: Performance optimization, readability, or best practices.
      3. 🟢 **Refactored Code**: Provide the corrected version of the code using best practices.
      
      Format the output in clean Markdown.
      
      Code to review:
      \`\`\`
      ${code}
      \`\`\`
    `;

    // Using the specific structure and model you requested
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt, // passing the prompt string directly as per your example
    });

    // The new SDK response structure usually provides text access directly
    const review = response.text; 

    return NextResponse.json({ review });

  } catch (error) {
    console.error("Error analyzing code:", error);
    return NextResponse.json(
      { error: "Failed to analyze code. Please try again." },
      { status: 500 }
    );
  }
}