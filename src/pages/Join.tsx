import RegistrationForm from "../components/registration/RegistrationForm";

export default function Join() {
  return (
    <section className="bg-gradient-to-br from-orange-50 to-green-50 px-4 py-14 md:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-white border border-orange-200 px-4 py-1.5 text-xs font-bold tracking-wide text-brand-orange shadow-sm">
            100% FREE REGISTRATION
          </span>
          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold text-brand-ink">Join Free</h1>
          <p className="mt-3 text-slate-600 max-w-xl mx-auto">
            Fill in your details below to create your HIO Health account and start your journey today.
          </p>
        </div>

        <RegistrationForm />
      </div>
    </section>
  );
}
