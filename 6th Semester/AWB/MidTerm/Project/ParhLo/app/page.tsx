"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, HelpCircle, ListChecks } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="px-4 py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
            SlideIQ
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
            Apni PPT slides ko Roman Urdu mein samjhein
          </p>
          <p className="mt-4 text-base text-slate-500 dark:text-slate-400">
            Instantly generate Roman Urdu explanations, MCQs, and True/False questions for your
            lecture slides powered by AI.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/login">
              <Button size="lg" className="px-8">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Why SlideIQ?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <BookOpen className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Roman Urdu Explanation
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Clear, easy-to-understand explanations in Roman Urdu for every slide of your PPT.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <ListChecks className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Multiple Choice Questions
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                AI-generated MCQs with 4 options each to test your understanding of the content.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <HelpCircle className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                True / False Questions
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Quick-check true/false statements to reinforce key concepts from each slide.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 px-4 py-8">
        <div className="mx-auto max-w-6xl text-center text-slate-600 dark:text-slate-400">
          <p>&copy; 2024 SlideIQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
