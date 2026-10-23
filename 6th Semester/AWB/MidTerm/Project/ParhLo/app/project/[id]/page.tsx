"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { SlidesSidebar } from "@/components/SlidesSidebar";
import { SlideDetail } from "@/components/SlideDetail";
import { GenerateAllButton } from "@/components/GenerateAllButton";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { ProjectDTO, SlideDTO, ResultDTO } from "@/lib/types";
import { Menu } from "lucide-react";
import { toast } from "sonner";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<ProjectDTO | null>(null);
  const [slides, setSlides] = useState<SlideDTO[]>([]);
  const [results, setResults] = useState<ResultDTO[]>([]);
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const upsertResult = (incoming: ResultDTO) => {
    setResults((prev) => {
      const existingIdx = prev.findIndex((r) => r.slideId === incoming.slideId || r._id === incoming._id);
      if (existingIdx === -1) return [...prev, incoming];
      const next = [...prev];
      next[existingIdx] = incoming;
      return next;
    });
  };

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  useEffect(() => {
    if (slides.length > 0 && !selectedSlideId) {
      setSelectedSlideId(slides[0]._id);
    }
  }, [slides, selectedSlideId]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/project/${projectId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setProject(data.project);
      setSlides(data.slides);
      setResults(data.results);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load project";
      toast.error(message);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAll = async () => {
    try {
      setGenerating(true);
      let generated = 0;
      let quotaDelayed = 0;

      for (const slide of slides) {
        const resultExists = results.some((r) => r.slideId === slide._id);
        if (resultExists) {
          generated++;
          continue;
        }

        try {
          let success = false;

          for (let attempt = 1; attempt <= 3; attempt++) {
            const res = await fetch("/api/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ slideId: slide._id })
            });

            if (res.ok) {
              const newResult = await res.json();
              upsertResult(newResult);
              generated++;
              success = true;
              break;
            }

            if (res.status === 429 && attempt < 3) {
              quotaDelayed++;
              toast.info("Gemini quota busy. Waiting 60s, phir retry...");
              await sleep(60000);
              continue;
            }

            const data = await res.json().catch(() => ({ error: "Failed to generate slide content" }));
            throw new Error(data.error || "Failed to generate slide content");
          }

          if (!success) continue;
        } catch {
          // Continue with next slide even if one fails
        }
      }

      const base = `Generated content for ${generated}/${slides.length} slides`;
      if (quotaDelayed > 0) {
        toast.success(`${base} (quota retries: ${quotaDelayed})`);
      } else {
        toast.success(base);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Generation failed";
      toast.error(message);
    } finally {
      setGenerating(false);
    }
  };

  const handleResultUpdated = (updatedResult: ResultDTO) => {
    upsertResult(updatedResult);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Navbar />
        <div className="flex items-center justify-center h-screen text-slate-600 dark:text-slate-400">
          Loading project...
        </div>
      </div>
    );
  }

  const selectedSlide = slides.find((s) => s._id === selectedSlideId);
  const selectedResult = selectedSlide
    ? results.find((r) => r.slideId === selectedSlide._id)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex-col">
          <SlidesSidebar
            project={project!}
            slides={slides}
            selectedSlideId={selectedSlideId}
            results={results}
            onSelectSlide={setSelectedSlideId}
            onGenerateAll={handleGenerateAll}
            generating={generating}
          />
        </div>

        {/* Mobile Sheet */}
        <Button
          variant="outline"
          size="icon"
          className="md:hidden absolute left-4 top-20 z-40"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <Menu className="h-4 w-4" />
        </Button>

        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetContent className="w-72 p-0">
            <SlidesSidebar
              project={project!}
              slides={slides}
              selectedSlideId={selectedSlideId}
              results={results}
              onSelectSlide={(slideId) => {
                setSelectedSlideId(slideId);
                setMobileSidebarOpen(false);
              }}
              onGenerateAll={handleGenerateAll}
              generating={generating}
            />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <SlideDetail
            slide={selectedSlide || null}
            result={selectedResult || null}
            onResultUpdated={handleResultUpdated}
          />
        </div>
      </div>
    </div>
  );
}
