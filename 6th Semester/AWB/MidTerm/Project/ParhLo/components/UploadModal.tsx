"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { parsePPTX } from "@/lib/pptx-parser";
import { toast } from "sonner";
import { Loader2, File } from "lucide-react";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (projectId: string) => void;
}

export function UploadModal({ open, onOpenChange, onSuccess }: UploadModalProps) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [slideCount, setSlideCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const fileName = selectedFile.name.toLowerCase();
    const isPptx = fileName.endsWith(".pptx");
    const isPpt = fileName.endsWith(".ppt");

    if (!isPptx && !isPpt) {
      toast.error("Please select a .ppt or .pptx file");
      return;
    }

    if (isPpt) {
      toast.error("Legacy .ppt files are not supported yet. Please convert to .pptx.");
      return;
    }

    if (selectedFile.size > 20 * 1024 * 1024) {
      toast.error("File size must be 20MB or less");
      return;
    }

    setFile(selectedFile);

    // Parse to get slide count
    try {
      setParsing(true);
      const slides = await parsePPTX(selectedFile);
      setSlideCount(slides.length);
      toast.success(`Found ${slides.length} slides`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to parse file";
      toast.error(message);
      setFile(null);
      setSlideCount(0);
    } finally {
      setParsing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a project title");
      return;
    }

    if (!file) {
      toast.error("Please select a PPTX file");
      return;
    }

    try {
      setLoading(true);

      // Parse PPTX
      const slides = await parsePPTX(file);

      if (slides.length === 0) {
        toast.error("No readable slide text found in the file");
        return;
      }

      // Upload to server
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          filename: file.name,
          slides
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      toast.success("Project uploaded successfully!");
      onSuccess(data.projectId);

      // Reset form
      setTitle("");
      setFile(null);
      setSlideCount(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload New Project</DialogTitle>
          <DialogDescription>
            Upload a PowerPoint file to generate Roman Urdu content
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              placeholder="e.g., Physics Lecture 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading || parsing}
            />
          </div>

          {/* File Input */}
          <div className="space-y-2">
            <Label htmlFor="file">PowerPoint File (.pptx, max 20MB)</Label>
            <div className="relative">
              <input
                ref={fileInputRef}
                id="file"
                type="file"
                accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                onChange={handleFileSelect}
                disabled={loading || parsing}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center hover:border-slate-400 dark:hover:border-slate-600 transition-colors">
                <File className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {file ? file.name : "Click to select or drag and drop"}
                </p>
                {slideCount > 0 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {slideCount} slides detected
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          {parsing && (
            <div className="space-y-2">
              <p className="text-sm text-slate-600 dark:text-slate-300">Analyzing slides...</p>
              <Progress value={undefined} className="h-2" />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading || parsing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || parsing || !file || !title.trim()}
              className="flex-1 gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
