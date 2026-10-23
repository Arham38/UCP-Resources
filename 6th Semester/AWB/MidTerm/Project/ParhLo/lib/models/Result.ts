import mongoose, { Schema, type InferSchemaType } from "mongoose";

const ResultSchema = new Schema({
  slideId: { type: Schema.Types.ObjectId, ref: "Slide", unique: true, required: true },
  source: { type: String, enum: ["gemini", "local"], default: "gemini" },
  summary: { type: String, default: "" },
  explanation: { type: String, default: "" },
  mcqs: { type: Array, default: [] },
  trueFalse: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});

export type ResultDocument = InferSchemaType<typeof ResultSchema>;

export const Result = mongoose.models.Result || mongoose.model("Result", ResultSchema);
