"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TrueFalseQuestion } from "@/lib/types";
import { HelpCircle } from "lucide-react";

interface TrueFalseCardProps {
  item: TrueFalseQuestion;
  questionNumber: number;
}

export function TrueFalseCard({ item, questionNumber }: TrueFalseCardProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
            Statement {questionNumber}
          </p>
          <p className="text-base font-medium text-slate-900 dark:text-white">
            {item.statement}
          </p>
        </div>
        <button
          onClick={() => setRevealed(!revealed)}
          className="flex-shrink-0 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title="Click to reveal answer"
        >
          {revealed ? (
            <Badge
              className={`${
                item.answer
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {item.answer ? "True" : "False"}
            </Badge>
          ) : (
            <HelpCircle className="h-6 w-6 text-slate-400" />
          )}
        </button>
      </div>
    </Card>
  );
}
