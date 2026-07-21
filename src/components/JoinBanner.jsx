import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function JoinBanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-brand-orange to-brand-green">
      <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white">
          Ready to Follow. Focus. Direction?
        </h2>
        <p className="mt-3 text-white/90 max-w-2xl mx-auto">
          Registration is 100% free. Start your HIO Health journey today and unlock 10 ways to earn.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-bold text-brand-ink shadow-lg transition hover:-translate-y-0.5"
          >
            Join Free Now
            <Icon name="arrowRight" className="w-4 h-4" />
          </Link>
          <Link
            to="/business-plan"
            className="inline-flex items-center gap-2 rounded-full border-2 border-white px-7 py-3.5 font-bold text-white transition hover:bg-white/10"
          >
            Explore Business Plan
          </Link>
        </div>
      </div>
    </section>
  );
}
