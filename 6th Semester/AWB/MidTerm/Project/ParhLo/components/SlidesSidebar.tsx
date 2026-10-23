"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { ProjectDTO, SlideDTO, ResultDTO } from "@/lib/types";
import { GenerateAllButton } from "@/components/GenerateAllButton";
import { CheckCircle2, Clock } from "lucide-react";

interface SlidesSidebarProps {
  project: ProjectDTO;
  slides: SlideDTO[];
  selectedSlideId: string | null;
  results: ResultDTO[];
  onSelectSlide: (slideId: string) => void;
  onGenerateAll: () => void;
  generating: boolean;
}

export function SlidesSidebar({
  project,
  slides,
  selectedSlideId,
  results,
  onSelectSlide,
  onGenerateAll,
  generating
}: SlidesSidebarProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <h2 className="font-semibold text-slate-900 dark:text-white truncate">
          {project.title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {slides.length} slides
        </p>
      </div>

      {/* Generate All Button */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <GenerateAllButton
          total={slides.length}
          completed={results.length}
          loading={generating}
          onClick={onGenerateAll}
        />
      </div>

      {/* Slides List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {slides.map((slide) => {
            const hasResult = results.some((r) => r.slideId === slide._id);
            const isSelected = selectedSlideId === slide._id;

            return (
              <Button
                key={slide._id}
                variant={isSelected ? "default" : "ghost"}
                className="w-full justify-start h-auto py-2 px-3 text-left"
                onClick={() => onSelectSlide(slide._id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">Slide {slide.slideNumber}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {slide.rawText.substring(0, 50)}...
                  </div>
                </div>
                <div className="ml-2 flex-shrink-0">
                  {hasResult ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <Clock className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
