import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  accent?: "default" | "teal" | "warning";
}

const accentClasses: Record<NonNullable<StatCardProps["accent"]>, string> = {
  default: "bg-[#0c0c0c]/8 text-[#0c0c0c]",
  teal: "bg-[#0d5c63]/12 text-[#0d5c63]",
  warning: "bg-amber-500/12 text-amber-700",
};

export function StatCard({ label, value, hint, icon: Icon, accent = "default" }: StatCardProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-[#0c0c0c]/10 bg-white p-5 shadow-sm">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#0c0c0c]/60">{label}</p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-[#0c0c0c]">
          {value}
        </p>
        {hint ? <p className="mt-1 text-xs text-[#0c0c0c]/50">{hint}</p> : null}
      </div>
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", accentClasses[accent])}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
    </div>
  );
}
