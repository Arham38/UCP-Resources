import mongoose, { Schema, type InferSchemaType } from "mongoose";

const SlideSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
  slideNumber: { type: Number, required: true },
  rawText: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

SlideSchema.index({ projectId: 1, slideNumber: 1 }, { unique: true });

export type SlideDocument = InferSchemaType<typeof SlideSchema>;

export const Slide = mongoose.models.Slide || mongoose.model("Slide", SlideSchema);
