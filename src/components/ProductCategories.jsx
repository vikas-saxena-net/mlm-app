import { productCategories } from "../data/businessPlan";
import Icon from "./Icon";
import SectionHeading from "./SectionHeading";

const iconMap = { health: "heart", personal: "sparkle", agri: "leaf" };
const colorMap = {
  health: "from-brand-orange to-orange-400",
  personal: "from-brand-green to-emerald-400",
  agri: "from-emerald-600 to-brand-green",
};

export default function ProductCategories() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeading
          eyebrow="What We Offer"
          title="Our Product Categories"
          subtitle="Natural, quality-tested products across three categories — built From Nature, For Nature."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {productCategories.map((cat) => (
            <div
              key={cat.key}
              className="relative overflow-hidden rounded-2xl border border-slate-100 p-8 shadow-sm transition hover:shadow-lg"
            >
              <div
                className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${colorMap[cat.key]} text-white`}
              >
                <Icon name={iconMap[cat.key]} className="w-7 h-7" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-brand-ink">{cat.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{cat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
