import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { getAuthenticatedUser } from "@/lib/auth";
import { Project } from "@/lib/models/Project";
import { Slide } from "@/lib/models/Slide";
import type { ParsedSlide } from "@/lib/types";

export async function POST(req: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await req.json()) as {
      title?: string;
      filename?: string;
      slides?: ParsedSlide[];
    };

    const title = body.title?.trim();
    const filename = body.filename?.trim();
    const slides = Array.isArray(body.slides) ? body.slides : [];

    if (!title || !filename) {
      return NextResponse.json({ error: "Title and filename are required." }, { status: 400 });
    }

    if (slides.length === 0) {
      return NextResponse.json({ error: "No readable slide text was found." }, { status: 400 });
    }

    await connectDB();
    const project = await Project.create({
      userId: user.id,
      title,
      filename,
      slideCount: slides.length
    });

    await Slide.insertMany(
      slides.map((slide) => ({
        projectId: project._id,
        slideNumber: slide.slideNumber,
        rawText: slide.rawText
      }))
    );

    return NextResponse.json({ projectId: project._id.toString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
