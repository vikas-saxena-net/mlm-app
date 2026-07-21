import Hero from "../components/Hero";
import ProductCategories from "../components/ProductCategories";
import DreamsGrid from "../components/DreamsGrid";
import JoinBanner from "../components/JoinBanner";
import IncomeCard from "../components/IncomeCard";
import SectionHeading from "../components/SectionHeading";
import BinaryDiagram from "../components/BinaryDiagram";
import { incomeTypes } from "../data/businessPlan";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";

const highlights = [
  { icon: "shield", title: "100% Free Registration", text: "No hidden joining fee — start earning from day one." },
  { icon: "gift", title: "10 Income Streams", text: "From retail profit to royalty income across every rank." },
  { icon: "users", title: "Powerful Binary System", text: "A simple 1:1 Left/Right structure that rewards teamwork." },
  { icon: "bulb", title: "Life-Changing Rewards", text: "Cars, travel, homes and royalty for top achievers." },
];

export default function Home() {
  return (
    <div>
      <Hero />

      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h) => (
            <div key={h.title} className="flex items-start gap-4 rounded-2xl p-5 hover:bg-slate-50 transition">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                <Icon name={h.icon} className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-brand-ink text-sm">{h.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{h.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ProductCategories />

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading
              eyebrow="ID Activation"
              title="Simple Binary Structure"
              subtitle="Every member you sponsor is placed in your Left or Right team. Balance both legs 1:1 and earn matching income on every pair."
            />
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Icon name="check" className="w-4 h-4 text-brand-green shrink-0" /> Enrollment at 600 BV
              </li>
              <li className="flex items-center gap-2">
                <Icon name="check" className="w-4 h-4 text-brand-green shrink-0" /> Full activation at 1200 BV
              </li>
              <li className="flex items-center gap-2">
                <Icon name="check" className="w-4 h-4 text-brand-green shrink-0" /> ₹200 matching income per pair
              </li>
            </ul>
            <Link
              to="/business-plan"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-ink px-6 py-3 text-sm font-bold text-white transition hover:bg-black"
            >
              See Full Business Plan
              <Icon name="arrowRight" className="w-4 h-4" />
            </Link>
          </div>
          <BinaryDiagram />
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeading
            eyebrow="Earning Opportunities"
            title="10 Ways to Earn with HIO Health"
            subtitle="A complete rewards ecosystem — from your very first sale to royalty on company turnover."
            align="center"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {incomeTypes.slice(0, 8).map(({ key, ...income }) => (
              <IncomeCard key={key} {...income} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/business-plan"
              className="inline-flex items-center gap-2 rounded-full border-2 border-brand-orange px-7 py-3 text-sm font-bold text-brand-orange transition hover:bg-brand-orange hover:text-white"
            >
              View Complete Business Plan
              <Icon name="arrowRight" className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <DreamsGrid />
      <JoinBanner />
    </div>
  );
}
