import * as React from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

export function Avatar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-secondary", className)} {...props} />;
}

export function AvatarFallback({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <span className={cn("text-sm font-semibold", className)}>{children ?? <User className="h-4 w-4" />}</span>;
}

export function AvatarImage({
  src,
  alt = "Avatar",
  className
}: {
  src?: string;
  alt?: string;
  className?: string;
}) {
  if (!src) return null;
  return <img src={src} alt={alt} className={cn("h-full w-full object-cover", className)} />;
}
