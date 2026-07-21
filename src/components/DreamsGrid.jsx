import Icon from "./Icon";
import SectionHeading from "./SectionHeading";

const dreams = [
  { icon: "storefront", label: "Good Food" },
  { icon: "compass", label: "World Travel" },
  { icon: "home", label: "Dream House" },
  { icon: "car", label: "Own Car" },
  { icon: "crown", label: "Fine Jewelry" },
  { icon: "heart", label: "Good Health" },
];

export default function DreamsGrid() {
  return (
    <section className="py-20 bg-brand-ink relative overflow-hidden">
      <div className="absolute inset-0 tricolor-bar opacity-[0.06]" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeading
          eyebrow="Our Dreams"
          title="Everything You Work For, Within Reach"
          subtitle="From everyday joys to lifelong milestones — our business plan is designed to help you fund the life you dream of."
          align="center"
          light
        />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {dreams.map((d) => (
            <div
              key={d.label}
              className="flex flex-col items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-8 text-center backdrop-blur transition hover:bg-white/10"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-orange to-brand-green text-white">
                <Icon name={d.icon} className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-white">{d.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
