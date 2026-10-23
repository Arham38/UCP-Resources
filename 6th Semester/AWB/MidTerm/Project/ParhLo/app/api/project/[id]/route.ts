import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongoose";
import { getAuthenticatedUser } from "@/lib/auth";
import { Project } from "@/lib/models/Project";
import { Slide } from "@/lib/models/Slide";
import { Result } from "@/lib/models/Result";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_req: Request, { params }: Params) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid project id." }, { status: 400 });
  }

  try {
    await connectDB();
    const project = await Project.findOne({ _id: params.id, userId: user.id }).lean();
    if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });

    const slides = await Slide.find({ projectId: params.id }).sort({ slideNumber: 1 }).lean();
    const results = await Result.find({
      slideId: { $in: slides.map((slide) => slide._id) }
    }).lean();

    return NextResponse.json(JSON.parse(JSON.stringify({ project, slides, results })));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch project.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid project id." }, { status: 400 });
  }

  try {
    await connectDB();
    const project = await Project.findOne({ _id: params.id, userId: user.id });
    if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });

    const slides = await Slide.find({ projectId: project._id }).select("_id").lean();
    await Result.deleteMany({ slideId: { $in: slides.map((slide) => slide._id) } });
    await Slide.deleteMany({ projectId: project._id });
    await Project.deleteOne({ _id: project._id });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete project.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
