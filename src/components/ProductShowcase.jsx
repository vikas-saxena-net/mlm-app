import { Link } from "react-router-dom";
import Icon from "./Icon";

const PANEL_TONES = [
  { bg: "from-orange-50 to-orange-100/40", ribbon: "bg-brand-orange" },
  { bg: "from-green-50 to-green-100/40", ribbon: "bg-brand-green" },
];

export default function ProductShowcase({ product, index }) {
  const tone = PANEL_TONES[index % PANEL_TONES.length];

  return (
    <div
      id={product.id}
      className="scroll-mt-28 rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden"
    >
      <div className={`relative flex items-center justify-center bg-gradient-to-br ${tone.bg} p-8 md:p-12`}>
        <span
          className={`absolute top-5 left-5 inline-flex items-center gap-1.5 rounded-full ${tone.ribbon} px-3 py-1 text-[11px] font-bold text-white shadow-sm`}
        >
          <Icon name="sparkle" className="w-3.5 h-3.5" />
          {product.category}
        </span>
        <img
          src={product.image}
          alt={product.name}
          className="h-64 md:h-80 w-full max-w-sm object-contain drop-shadow-xl"
        />
      </div>

      <div className="p-6 md:p-10">
        <h3 className="text-2xl md:text-3xl font-extrabold text-brand-ink">{product.name}</h3>
        <p className="mt-1 text-sm font-semibold text-slate-400">{product.size}</p>

        <div className="mt-5 grid grid-cols-2 gap-3 max-w-xs">
          <div className="rounded-xl bg-orange-50 py-3 text-center">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">DP</p>
            <p className="text-lg font-extrabold text-brand-orange">{product.dpValue}</p>
          </div>
          <div className="rounded-xl bg-green-50 py-3 text-center">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">BV</p>
            <p className="text-lg font-extrabold text-brand-green">{product.bvValue}</p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-slate-600">{product.description}</p>

        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Key Benefits</p>
          <ul className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {product.benefits.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-700"
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-green/15 text-brand-green mt-0.5">
                  <Icon name="check" className="w-3 h-3" />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        {product.usage && product.usage.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">How to Use</p>
            <ul className="mt-3 space-y-2">
              {product.usage.map((u) => (
                <li
                  key={u}
                  className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-700"
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange mt-0.5">
                    <Icon name="drop" className="w-3 h-3" />
                  </span>
                  {u}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link
          to="/join"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-orange-dark"
        >
          Join Free to Order
          <Icon name="arrowRight" className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
