export default function SectionHeading({ eyebrow, title, subtitle, align = "left", light = false }) {
  const alignClass = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";
  return (
    <div className={`flex flex-col ${alignClass} max-w-2xl`}>
      {eyebrow && (
        <span
          className={`text-xs font-semibold tracking-[0.2em] uppercase mb-2 ${
            light ? "text-orange-200" : "text-brand-orange"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2 className={`text-3xl md:text-4xl font-bold ${light ? "text-white" : "text-brand-ink"}`}>{title}</h2>
      <span className="section-title" />
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed ${light ? "text-white/80" : "text-slate-600"}`}>{subtitle}</p>
      )}
    </div>
  );
}
