import Icon from "../components/Icon";
import SectionHeading from "../components/SectionHeading";
import JoinBanner from "../components/JoinBanner";
import ProductShowcase from "../components/ProductShowcase";
import products from "../data/products.json";

const categories = [
  {
    key: "health",
    icon: "heart",
    title: "Health Care",
    description: "Nutraceuticals and herbal formulations for immunity, metabolism and everyday vitality.",
  },
  {
    key: "personal",
    icon: "sparkle",
    title: "Personal Care",
    description: "Gentle, naturally derived essentials for skin, hair and daily grooming.",
  },
  {
    key: "agri",
    icon: "leaf",
    title: "Agri Care",
    description: "Organic agri-inputs that support healthier crops and better soil.",
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
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <SectionHeading
            eyebrow="From Nature, For Nature"
            title="Our Products"
            subtitle="HIO Health products span three categories — Health Care, Personal Care and Agri Care — every one crafted with quality and purity at its core."
            align="center"
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
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
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <SectionHeading
            eyebrow="Featured Products"
            title="Explore Our Range"
            subtitle="Pricing shown is Distributor Price (DP) and Distributor Value (DV)."
            align="center"
          />
          <div className="mt-12 space-y-10">
            {products.map((product, i) => (
              <ProductShowcase key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <SectionHeading eyebrow="What We Offer" title="Our Product Categories" align="center" />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {categories.map((cat) => (
              <div
                key={cat.key}
                className="rounded-2xl bg-white border border-slate-100 p-8 text-center shadow-sm transition hover:shadow-md hover:-translate-y-1"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-orange to-brand-green text-white">
                  <Icon name={cat.icon} className="w-8 h-8" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-brand-ink">{cat.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{cat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <JoinBanner />
    </div>
  );
}
