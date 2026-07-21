import Icon from "./Icon";

export default function IncomeCard({ title, range, description, icon }) {
  return (
    <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:border-brand-orange/30">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors">
        <Icon name={icon} className="w-6 h-6" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-brand-ink">{title}</h3>
      {range && <p className="mt-1 text-sm font-bold text-brand-green">{range}</p>}
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}
