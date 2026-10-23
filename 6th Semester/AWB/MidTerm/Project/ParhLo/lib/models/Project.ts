import mongoose, { Schema, type InferSchemaType } from "mongoose";

const ProjectSchema = new Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true, trim: true },
  filename: { type: String, required: true },
  slideCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export type ProjectDocument = InferSchemaType<typeof ProjectSchema>;

export const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);
