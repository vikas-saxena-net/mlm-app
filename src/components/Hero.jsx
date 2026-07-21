import { Link } from "react-router-dom";
import Icon from "./Icon";
import product from "../assets/img/product.png";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50/40 to-green-50/40">
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-orange/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-brand-green/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-14 pb-20 md:pt-20 md:pb-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white border border-orange-200 px-4 py-1.5 text-xs font-bold tracking-wide text-brand-orange shadow-sm">
            <Icon name="sparkle" className="w-4 h-4" />
            100% FREE REGISTRATION
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-brand-ink">
            Be Healthy. <span className="text-brand-green">We Wealthy.</span>
            <br /> We Happy. <span className="text-brand-orange">Achieve Your Dreams.</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-xl">
            HIO Health brings you natural Health Care, Personal Care & Agri Care products — paired with the
            world&apos;s most rewarding earning platform. Follow. Focus. Direction.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/join"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-7 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-brand-orange-dark"
            >
              Join Free Today
              <Icon name="arrowRight" className="w-4 h-4" />
            </Link>
            <Link
              to="/business-plan"
              className="inline-flex items-center gap-2 rounded-full border-2 border-brand-green px-7 py-3.5 font-bold text-brand-green transition hover:bg-brand-green hover:text-white"
            >
              View Business Plan
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            <Stat value="25-50%" label="Retail Income" />
            <Stat value="12-22%" label="Repurchase Income" />
            <Stat value="10" label="Income Streams" />
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-200/50 to-green-200/50 blur-2xl scale-90" />
          <img
            src={product}
            alt="HIO Health ReGen Kaya nutraceutical capsules"
            className="relative w-full max-w-md drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }) {
  return (
    <div className="rounded-xl bg-white/80 backdrop-blur border border-slate-100 px-3 py-3 text-center shadow-sm">
      <p className="text-lg font-extrabold text-brand-ink">{value}</p>
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  );
}
