import Icon from "../components/Icon";
import SectionHeading from "../components/SectionHeading";
import JoinBanner from "../components/JoinBanner";
import product from "../assets/img/product.png";

const categories = [
  {
    key: "health",
    icon: "heart",
    title: "Health Care",
    description:
      "Nutraceutical formulations crafted to support weight management, metabolism, immunity and everyday vitality — backed by GMP-certified manufacturing.",
    points: ["Rich in antioxidants", "Improves metabolism", "Supports lean muscle & balanced cravings", "Lab tested, no fillers"],
  },
  {
    key: "personal",
    icon: "sparkle",
    title: "Personal Care",
    description:
      "Natural personal care essentials for skin, hair and daily grooming — gentle formulations for the whole family.",
    points: ["Skin & hair care essentials", "Naturally derived ingredients", "Everyday grooming range", "Dermatologically mindful"],
  },
  {
    key: "agri",
    icon: "leaf",
    title: "Agri Care",
    description:
      "Organic agri-inputs that help farmers grow healthier, more sustainable crops while improving soil health over time.",
    points: ["Organic crop nutrition", "Soil health support", "Sustainable farming inputs", "Farmer-friendly pricing"],
  },
];

const badges = [
  { icon: "shield", label: "GMP Certified" },
  { icon: "check", label: "ISO Certified" },
  { icon: "sparkle", label: "No Fillers" },
  { icon: "target", label: "Lab Tested" },
];

export default function Products() {
  return (
    <div>
      <section className="bg-gradient-to-br from-orange-50 to-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <SectionHeading
              eyebrow="From Nature, For Nature"
              title="Our Products"
              subtitle="HIO Health products span three categories — Health Care, Personal Care and Agri Care — every one crafted with quality and purity at its core."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              {badges.map((b) => (
                <span
                  key={b.label}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-brand-ink shadow-sm border border-slate-100"
                >
                  <Icon name={b.icon} className="w-4 h-4 text-brand-green" />
                  {b.label}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <img src={product} alt="HIO Health product bottle" className="w-full max-w-sm drop-shadow-2xl" />
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-16">
          {categories.map((cat, i) => (
            <div
              key={cat.key}
              className={`grid lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <div className="rounded-3xl bg-slate-50 border border-slate-100 p-10 flex items-center justify-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-brand-orange to-brand-green text-white">
                  <Icon name={cat.icon} className="w-14 h-14" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-brand-ink">{cat.title}</h3>
                <p className="mt-4 text-slate-600 leading-relaxed">{cat.description}</p>
                <ul className="mt-6 grid sm:grid-cols-2 gap-3">
                  {cat.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
                      <Icon name="check" className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <JoinBanner />
    </div>
  );
}
