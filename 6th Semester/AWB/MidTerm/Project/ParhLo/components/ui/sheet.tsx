"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

const SheetContext = React.createContext<{ open: boolean; setOpen: (open: boolean) => void } | null>(null);

export function Sheet({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) {
  return <SheetContext.Provider value={{ open, setOpen: onOpenChange }}>{children}</SheetContext.Provider>;
}

export function SheetContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(SheetContext);
  if (!ctx?.open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className={cn("fixed inset-x-0 bottom-0 max-h-[85vh] rounded-t-lg border bg-card p-4 shadow-xl", className)}>
        <Button className="absolute right-3 top-3" variant="ghost" size="icon" onClick={() => ctx.setOpen(false)} aria-label="Close sheet">
          <X className="h-4 w-4" />
        </Button>
        {children}
      </div>
    </div>
  );
}

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 pr-10", className)} {...props} />;
}

export function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />;
}
