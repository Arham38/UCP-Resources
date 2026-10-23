"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ProjectDTO } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Trash2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface ProjectCardProps {
  project: ProjectDTO;
  onDeleted: () => void;
}

export function ProjectCard({ project, onDeleted }: ProjectCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/project/${project._id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      toast.success("Project deleted successfully");
      onDeleted();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete project";
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow flex flex-col h-full">
      <div className="flex-1 mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-white truncate">
          {project.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-1">
          {project.filename}
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
          <span>📊 {project.slideCount} slides</span>
          <span>📅 {formatDate(project.createdAt)}</span>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Link href={`/project/${project._id}`} className="flex-1">
          <Button variant="default" className="w-full gap-1">
            Open
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
        <Button
          variant="outline"
          size="icon"
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
