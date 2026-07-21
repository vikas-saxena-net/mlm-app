import SectionHeading from "../components/SectionHeading";
import BinaryDiagram from "../components/BinaryDiagram";
import IncomeCard from "../components/IncomeCard";
import RankFundCard from "../components/RankFundCard";
import DataTable from "../components/DataTable";
import JoinBanner from "../components/JoinBanner";
import Icon from "../components/Icon";
import {
  incomeTypes,
  repurchaseIncomeTable,
  monthlyBonusTable,
  rankFunds,
  extraRewards,
  termsAndConditions,
} from "../data/businessPlan";

export default function BusinessPlan() {
  return (
    <div>
      <section className="bg-brand-ink py-16 relative overflow-hidden">
        <div className="absolute inset-0 tricolor-bar opacity-[0.05]" />
        <div className="relative max-w-5xl mx-auto px-4 md:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold tracking-wide text-orange-200">
            THE WORLD&apos;S BIGGEST EARNING PLATFORM
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl font-extrabold text-white">Business Plan</h1>
          <p className="mt-4 text-white/75 max-w-2xl mx-auto">
            A transparent, 10-stream compensation plan built for both first-time earners and long-term leaders —
            registration is 100% free.
          </p>
        </div>
      </section>

      {/* ID Activation */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <BinaryDiagram />
          <div>
            <SectionHeading
              eyebrow="Step 1"
              title="ID Activation"
              subtitle="Your business begins with a simple binary team — one Left, one Right. Balance them 1:1 to unlock matching income and every rank fund beyond."
            />
            <div className="mt-6 grid grid-cols-2 gap-4 max-w-sm">
              <div className="rounded-xl bg-orange-50 p-4">
                <p className="text-xs uppercase text-slate-500">Enrollment</p>
                <p className="text-2xl font-extrabold text-brand-orange">600 BV</p>
              </div>
              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-xs uppercase text-slate-500">Activation</p>
                <p className="text-2xl font-extrabold text-brand-green">1200 BV</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Income types */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeading
            eyebrow="Step 2"
            title="10 Types of Income"
            subtitle="Every activity in your business — selling, sponsoring, repurchasing, leading — is designed to pay you."
            align="center"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {incomeTypes.map(({ key, ...income }) => (
              <IncomeCard key={key} {...income} />
            ))}
          </div>
        </div>
      </section>

      {/* Repurchase income table */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <SectionHeading
            eyebrow="Repurchase Income"
            title="12% – 22% on Repurchase Business"
            subtitle="Your recurring monthly income scales with self and team business volume."
          />
          <div className="mt-8">
            <DataTable
              columns={["Self BV", "Team BV", "Income Rate"]}
              rows={repurchaseIncomeTable.map((r) => [`₹${r.selfBv.toLocaleString("en-IN")}`, `₹${r.teamBv.toLocaleString("en-IN")}`, r.rate])}
            />
          </div>
        </div>
      </section>

      {/* Monthly bonus table */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <SectionHeading
            eyebrow="Monthly Bonus"
            title="8% – 18% Monthly Bonus"
            subtitle="Calculated on combined Self Repurchase + Sponsor Repurchase business."
          />
          <div className="mt-8">
            <DataTable
              columns={["Self + Sponsor Repurchase", "Bonus Rate"]}
              rows={monthlyBonusTable.map((r) => [`₹${r.combined.toLocaleString("en-IN")}`, r.rate])}
            />
          </div>
        </div>
      </section>

      {/* Rank funds */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeading
            eyebrow="Step 3"
            title="Rank Funds & Rewards"
            subtitle="As your team grows, unlock progressively bigger rewards — from a Car Fund all the way to Royalty Income."
            align="center"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rankFunds.map((fund) => (
              <RankFundCard key={fund.key} fund={fund} />
            ))}
          </div>
        </div>
      </section>

      {/* Extra rewards */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <SectionHeading eyebrow="Bonus" title="Extra Income & Rewards" align="center" />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {extraRewards.map((r) => (
              <div key={r.title} className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
                  <Icon name="gift" className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-ink">{r.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">{r.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Terms */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <SectionHeading eyebrow="Fine Print" title="Terms & Conditions" align="center" />
          <ul className="mt-10 grid sm:grid-cols-2 gap-4">
            {termsAndConditions.map((t) => (
              <li key={t} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                <Icon name="check" className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <JoinBanner />
    </div>
  );
}
