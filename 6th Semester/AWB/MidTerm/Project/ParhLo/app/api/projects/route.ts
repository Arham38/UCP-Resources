import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { getAuthenticatedUser } from "@/lib/auth";
import { Project } from "@/lib/models/Project";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const projects = await Project.find({ userId: user.id }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ projects: JSON.parse(JSON.stringify(projects)) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch projects.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
