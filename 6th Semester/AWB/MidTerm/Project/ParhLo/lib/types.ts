export type ParsedSlide = {
  slideNumber: number;
  rawText: string;
};

export type ProjectDTO = {
  _id: string;
  userId: string;
  title: string;
  filename: string;
  slideCount: number;
  createdAt: string;
};

export type SlideDTO = {
  _id: string;
  projectId: string;
  slideNumber: number;
  rawText: string;
  createdAt: string;
};

export type MCQ = {
  question: string;
  options: string[];
  answer: "a" | "b" | "c" | "d";
};

export type TrueFalseQuestion = {
  statement: string;
  answer: boolean;
};

export type ResultDTO = {
  _id: string;
  slideId: string;
  source?: "gemini" | "local";
  summary?: string;
  explanation: string;
  mcqs: MCQ[];
  trueFalse: TrueFalseQuestion[];
  createdAt: string;
};
