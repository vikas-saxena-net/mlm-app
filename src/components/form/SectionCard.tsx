import type { ReactNode } from "react";

interface SectionCardProps {
  step: number;
  title: string;
  subtitle?: string;
  optional?: boolean;
  children: ReactNode;
}

export default function SectionCard({ step, title, subtitle, optional, children }: SectionCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-orange text-sm font-bold text-white">
          {step}
        </span>
        <div>
          <h2 className="text-lg font-bold text-brand-ink flex items-center gap-2">
            {title}
            {optional && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                Optional
              </span>
            )}
          </h2>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </div>
  );
}
