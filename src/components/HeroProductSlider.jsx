import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import products from "../data/products.json";

export default function HeroProductSlider({ autoPlayMs = 4500 }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = products.length;
  const product = products[index];

  useEffect(() => {
    if (paused || count <= 1) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), autoPlayMs);
    return () => clearInterval(id);
  }, [paused, count, autoPlayMs]);

  return (
    <div
      className="relative rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Link to={`/products#${product.id}`} className="relative block group">
        <div className="relative h-72 sm:h-80 w-full bg-white">
          {products.map((p, i) => (
            <img
              key={p.id}
              src={p.image}
              alt={p.name}
              className={`absolute inset-0 h-full w-full object-contain p-6 transition-opacity duration-700 group-hover:scale-105 group-hover:duration-300 ${
                i === index ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            />
          ))}
        </div>

        <div className="relative border-t border-slate-100 bg-white px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-brand-ink leading-tight group-hover:text-brand-orange transition-colors">
                {product.name}
              </h3>
              <p className="text-[11px] font-semibold text-slate-400">{product.size}</p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <span className="rounded-md bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-600">
                DP&nbsp;<span className="text-brand-ink">₹{product.dpValue}</span>
              </span>
              <span className="rounded-md bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-600">
                DV&nbsp;<span className="text-brand-ink">{product.dvValue}</span>
              </span>
            </div>
          </div>
        </div>
      </Link>

      {count > 1 && (
        <div className="relative flex items-center justify-center gap-2 border-t border-slate-100 bg-white py-3">
          {products.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${p.name}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-brand-orange" : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
