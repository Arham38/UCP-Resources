"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MCQCard } from "@/components/MCQCard";
import { TrueFalseCard } from "@/components/TrueFalseCard";
import type { SlideDTO, ResultDTO } from "@/lib/types";
import { Loader2, Zap } from "lucide-react";
import { toast } from "sonner";

interface SlideDetailProps {
  slide: SlideDTO | null;
  result: ResultDTO | null;
  onResultUpdated: (result: ResultDTO) => void;
}

export function SlideDetail({ slide, result, onResultUpdated }: SlideDetailProps) {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!slide) return;

    try {
      setGenerating(true);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slideId: slide._id })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      onResultUpdated(data);
      toast.success("Content generated successfully!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate content";
      toast.error(message);
    } finally {
      setGenerating(false);
    }
  };

  if (!slide) {
    return (
      <div className="flex items-center justify-center h-full text-slate-600 dark:text-slate-400">
        Select a slide to view details
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8">
        {/* Breadcrumb */}
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Dashboard &gt; <span className="truncate">[Project]</span> &gt; Slide {slide.slideNumber}
        </div>

        {/* Raw Text Preview */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Slide Content
          </h3>
          <Card className="p-4 bg-slate-50 dark:bg-slate-800/50">
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {slide.rawText}
            </p>
          </Card>
        </div>

        <Separator />

        {/* Generate Button or Results */}
        {!result ? (
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400">
              No content generated yet. Click below to generate Roman Urdu explanations, MCQs, and
              True/False questions.
            </p>
            <Button
              onClick={handleGenerate}
              disabled={generating}
              size="lg"
              className="gap-2 w-full sm:w-auto"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Generate Roman Urdu Content
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Explanation Section */}
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Explanation
              </h3>
              <Card className="p-6">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {result.explanation}
                </p>
              </Card>
            </div>

            <Separator />

            {/* MCQs Section */}
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Multiple Choice Questions
              </h3>
              <div className="space-y-6">
                {result.mcqs.map((mcq, index) => (
                  <MCQCard key={index} mcq={mcq} questionNumber={index + 1} />
                ))}
              </div>
            </div>

            <Separator />

            {/* True/False Section */}
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                True / False
              </h3>
              <div className="space-y-4">
                {result.trueFalse.map((item, index) => (
                  <TrueFalseCard key={index} item={item} questionNumber={index + 1} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
