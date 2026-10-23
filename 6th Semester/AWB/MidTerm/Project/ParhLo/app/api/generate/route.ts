import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongoose";
import { getAuthenticatedUser } from "@/lib/auth";
import { geminiModel } from "@/lib/gemini";
import { Project } from "@/lib/models/Project";
import { Slide } from "@/lib/models/Slide";
import { Result } from "@/lib/models/Result";
import type { MCQ, TrueFalseQuestion } from "@/lib/types";

type GeneratedContent = {
  summary: string;
  explanation: string;
  mcqs: MCQ[];
  trueFalse: TrueFalseQuestion[];
};

function cleanJson(text: string) {
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

function normalizeAnswer(answer: unknown): "a" | "b" | "c" | "d" {
  const value = String(answer ?? "").toLowerCase().trim()[0];
  return value === "a" || value === "b" || value === "c" || value === "d" ? value : "a";
}

function validateGeneratedContent(input: unknown): GeneratedContent {
  const data = input as Partial<GeneratedContent>;
  return {
    summary: String(data.summary ?? ""),
    explanation: String(data.explanation ?? ""),
    mcqs: Array.isArray(data.mcqs)
      ? data.mcqs.slice(0, 3).map((mcq) => ({
          question: String((mcq as MCQ).question ?? ""),
          options: Array.isArray((mcq as MCQ).options)
            ? (mcq as MCQ).options.slice(0, 4).map(String)
            : [],
          answer: normalizeAnswer((mcq as MCQ).answer)
        }))
      : [],
    trueFalse: Array.isArray(data.trueFalse)
      ? data.trueFalse.slice(0, 3).map((item) => ({
          statement: String((item as TrueFalseQuestion).statement ?? ""),
          answer: Boolean((item as TrueFalseQuestion).answer)
        }))
      : []
  };
}

export async function POST(req: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await req.json()) as { slideId?: string };
    const { slideId } = body;
    if (!slideId || !mongoose.Types.ObjectId.isValid(slideId)) {
      return NextResponse.json({ error: "Valid slideId is required." }, { status: 400 });
    }

    await connectDB();
    const slide = await Slide.findById(slideId);
    if (!slide) return NextResponse.json({ error: "Slide not found." }, { status: 404 });

    const project = await Project.findOne({ _id: slide.projectId, userId: user.id });
    if (!project) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const cached = await Result.findOne({ slideId: slide._id }).lean();
    const fallbackCached = Boolean(
      cached && typeof cached.explanation === "string" && /local fallback mode/i.test(cached.explanation)
    );

    if (cached && !fallbackCached) return NextResponse.json(JSON.parse(JSON.stringify(cached)));

    if (cached && fallbackCached) {
      await Result.deleteOne({ _id: cached._id });
    }

    const prompt = `System context: "You are an educational assistant for Pakistani students."

User prompt:
"Given this lecture slide content, generate the following in Roman Urdu
(Pakistani Roman Urdu language, easy to understand for university students):

1. SUMMARY: One-line Roman Urdu summary
2. EXPLANATION: A clear explanation in 3-5 sentences in Roman Urdu
3. MCQs: 3 multiple choice questions with 4 options each
4. TRUE/FALSE: 3 true/false statements

Slide content:
${slide.rawText}

Respond ONLY with valid JSON, no markdown, no backticks, no explanation outside JSON:
{
  "summary": "One-line Roman Urdu summary...",
  "explanation": "Roman Urdu explanation here...",
  "mcqs": [
    {"question": "...", "options": ["a) ...","b) ...","c) ...","d) ..."], "answer": "a"},
    {"question": "...", "options": ["a) ...","b) ...","c) ...","d) ..."], "answer": "b"},
    {"question": "...", "options": ["a) ...","b) ...","c) ...","d) ..."], "answer": "c"}
  ],
  "trueFalse": [
    {"statement": "...", "answer": true},
    {"statement": "...", "answer": false},
    {"statement": "...", "answer": true}
  ]
}"`;

    const response = await geminiModel.generateContent(prompt);
    const raw = response.response.text();
    const content = validateGeneratedContent(JSON.parse(cleanJson(raw)));

    const result = await Result.create({
      slideId: slide._id,
      source: "gemini",
      summary: content.summary,
      explanation: content.explanation,
      mcqs: content.mcqs,
      trueFalse: content.trueFalse
    });

    return NextResponse.json(JSON.parse(JSON.stringify(result)));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation failed.";
    const aiUnavailable = /quota|rate|429|resource has been exhausted|api key|gemini/i.test(message);
    return NextResponse.json(
      { error: aiUnavailable ? "Gemini free quota exceeded. Please wait and retry." : message },
      { status: aiUnavailable ? 429 : 500 }
    );
  }
}
