"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Zap } from "lucide-react";

interface GenerateAllButtonProps {
  total: number;
  completed: number;
  loading: boolean;
  onClick: () => void;
}

export function GenerateAllButton({
  total,
  completed,
  loading,
  onClick
}: GenerateAllButtonProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="space-y-3">
      <Button
        onClick={onClick}
        disabled={loading || completed === total}
        className="w-full gap-2"
        size="sm"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" />
            Generate All
          </>
        )}
      </Button>

      {total > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Progress</span>
            <span>
              {completed}/{total}
            </span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>
      )}
    </div>
  );
}
