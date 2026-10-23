"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { MCQ } from "@/lib/types";
import { ChevronDown, CheckCircle2, XCircle } from "lucide-react";

interface MCQCardProps {
  mcq: MCQ;
  questionNumber: number;
}

export function MCQCard({ mcq, questionNumber }: MCQCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleShowAnswer = () => {
    setRevealed(true);
    setSelectedOption(mcq.answer);
  };

  return (
    <Card className="p-6 space-y-4">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
          Question {questionNumber}
        </p>
        <p className="text-base font-medium text-slate-900 dark:text-white">{mcq.question}</p>
      </div>

      <div className="space-y-2">
        {mcq.options.map((option, idx) => {
          const optionLetter = String.fromCharCode(97 + idx); // a, b, c, d
          const isCorrect = revealed && optionLetter === mcq.answer;
          const isWrong = revealed && selectedOption === optionLetter && optionLetter !== mcq.answer;

          return (
            <button
              key={idx}
              onClick={() => !revealed && setSelectedOption(optionLetter)}
              disabled={revealed}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                revealed
                  ? isCorrect
                    ? "border-green-500 bg-green-50 dark:bg-green-950"
                    : isWrong
                      ? "border-red-500 bg-red-50 dark:bg-red-950"
                      : "border-slate-200 dark:border-slate-700"
                  : selectedOption === optionLetter
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="font-medium text-slate-700 dark:text-slate-300 min-w-fit">
                  {optionLetter.toUpperCase()})
                </span>
                <span className="text-slate-700 dark:text-slate-300">{option.replace(/^[a-d]\)\s*/, "")}</span>
                {isCorrect && <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 ml-auto flex-shrink-0" />}
                {isWrong && <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 ml-auto flex-shrink-0" />}
              </div>
            </button>
          );
        })}
      </div>

      {!revealed && (
        <Button
          onClick={handleShowAnswer}
          variant="outline"
          className="w-full gap-2 mt-4"
        >
          Show Answer
          <ChevronDown className="h-4 w-4" />
        </Button>
      )}
    </Card>
  );
}
