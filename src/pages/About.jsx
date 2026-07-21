import SectionHeading from "../components/SectionHeading";
import JoinBanner from "../components/JoinBanner";
import Icon from "../components/Icon";
import logo from "../assets/img/logo.jpeg";

const values = [
  { icon: "leaf", title: "From Nature, For Nature", text: "Every product starts with natural ingredients and honest formulation." },
  { icon: "shield", title: "Quality First", text: "GMP & ISO certified manufacturing, lab-tested, no unnecessary fillers." },
  { icon: "users", title: "People First", text: "A business plan built to reward genuine effort — from your first sale onward." },
  { icon: "compass", title: "Follow. Focus. Direction.", text: "Clear guidance and a transparent plan so every member knows their next step." },
];

export default function About() {
  return (
    <div>
      <section className="bg-gradient-to-br from-orange-50 to-green-50 py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
          <img src={logo} alt="HIO Health" className="h-20 w-auto mx-auto object-contain" />
          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-brand-ink">About HIO Health</h1>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            HIO Health Pvt. Ltd. is a direct-selling company bringing natural Health Care, Personal Care and Agri
            Care products to families and farmers across India, paired with a rewarding business opportunity for
            every member.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12">
          <div>
            <SectionHeading eyebrow="Our Mission" title="Be Healthy. We Wealthy. We Happy." />
            <p className="mt-4 text-slate-600 leading-relaxed">
              We believe good health and financial independence should go hand in hand. Our mission is to deliver
              trustworthy, natural products while giving every member a genuine, transparent path to build their own
              income — whether that&apos;s a first retail sale or a lifelong leadership career.
            </p>
          </div>
          <div>
            <SectionHeading eyebrow="Our Vision" title="Achieve Your Dreams" />
            <p className="mt-4 text-slate-600 leading-relaxed">
              From everyday essentials to life-changing rewards — cars, travel, homes and royalty income — we
              envision a community where consistent effort is met with unlimited earning potential, built on a
              simple, powerful binary system.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeading eyebrow="What We Stand For" title="Our Values" align="center" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                  <Icon name={v.icon} className="w-6 h-6" />
                </div>
                <h3 className="mt-4 font-bold text-brand-ink text-sm">{v.title}</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <SectionHeading eyebrow="Company Details" title="HIO Health Pvt. Ltd." align="center" />
          <p className="mt-4 text-sm text-slate-500">
            Near Tahsil, Singahi Road, Neghasan, District Lakhimpur Kheri, Uttar Pradesh - 262903
            <br />
            FSSAI License No. 10825999000777
          </p>
        </div>
      </section>

      <JoinBanner />
    </div>
  );
}
