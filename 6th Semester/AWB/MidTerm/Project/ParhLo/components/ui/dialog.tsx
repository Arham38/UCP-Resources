"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

type DialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) {
  return <DialogContext.Provider value={{ open, setOpen: onOpenChange }}>{children}</DialogContext.Provider>;
}

export function DialogTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactElement }) {
  const ctx = React.useContext(DialogContext);
  if (!ctx) return children;
  return React.cloneElement(children, { onClick: () => ctx.setOpen(true) });
}

export function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(DialogContext);
  if (!ctx?.open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={cn("relative w-full max-w-lg rounded-lg border bg-card p-6 shadow-xl", className)}>
        <Button className="absolute right-3 top-3" variant="ghost" size="icon" onClick={() => ctx.setOpen(false)} aria-label="Close dialog">
          <X className="h-4 w-4" />
        </Button>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 space-y-1", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-xl font-semibold", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}
