"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProjectCard } from "@/components/ProjectCard";
import { UploadModal } from "@/components/UploadModal";
import { Button } from "@/components/ui/button";
import type { ProjectDTO } from "@/lib/types";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setProjects(data.projects || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch projects";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (projectId: string) => {
    setIsUploadOpen(false);
    // Redirect after a short delay to allow modal to close
    setTimeout(() => {
      window.location.href = `/project/${projectId}`;
    }, 300);
  };

  const handleProjectDeleted = () => {
    fetchProjects();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Navbar />

      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                My Projects
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Manage and analyze your lecture slide decks
              </p>
            </div>
            <Button
              onClick={() => setIsUploadOpen(true)}
              size="lg"
              className="gap-2 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Upload New PPT
            </Button>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                No projects yet. Upload your first PPT to get started!
              </p>
              <Button onClick={() => setIsUploadOpen(true)}>
                Upload First Project
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onDeleted={handleProjectDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}
