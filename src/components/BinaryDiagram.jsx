import { idActivation } from "../data/businessPlan";

function Node({ label, tone }) {
  const tones = {
    you: "bg-gradient-to-br from-brand-orange to-pink-600",
    lead: "bg-brand-green",
    member: "bg-slate-400",
  };
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full text-white text-xs font-bold shadow-md ${tones[tone]}`}
      >
        {label}
      </div>
    </div>
  );
}

export default function BinaryDiagram() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
      <div className="flex flex-col items-center">
        <Node label="YOU" tone="you" />
        <div className="flex w-full max-w-sm justify-between px-2 -mt-1">
          <span className="h-8 w-px bg-slate-300 rotate-[24deg] origin-top" />
          <span className="h-8 w-px bg-slate-300 -rotate-[24deg] origin-top" />
        </div>
        <div className="flex w-full max-w-sm justify-between">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[11px] font-bold text-slate-500">LEFT</span>
            <Node label="L" tone="lead" />
          </div>
          <span className="self-center text-xs font-bold text-brand-orange">1 : 1</span>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[11px] font-bold text-slate-500">RIGHT</span>
            <Node label="R" tone="lead" />
          </div>
        </div>
        <div className="mt-4 flex w-full max-w-lg justify-between">
          {["L1", "L2", "R1", "R2"].map((l) => (
            <Node key={l} label={l} tone="member" />
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 text-center">
        <div className="rounded-xl bg-orange-50 py-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Enrollment</p>
          <p className="text-xl font-extrabold text-brand-orange">{idActivation.enrollment} BV</p>
        </div>
        <div className="rounded-xl bg-green-50 py-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Activation</p>
          <p className="text-xl font-extrabold text-brand-green">{idActivation.activation} BV</p>
        </div>
      </div>
    </div>
  );
}
