import { useState } from "react";
import SectionHeading from "../components/SectionHeading";
import Icon from "../components/Icon";

const initialForm = { name: "", phone: "", email: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm(initialForm);
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-orange-50 to-green-50 py-16">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <SectionHeading
            eyebrow="Get In Touch"
            title="Join HIO Health Today"
            subtitle="100% free registration. Fill in your details and our team will reach out to help you get started."
            align="center"
          />
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-16">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green text-white">
                  <Icon name="check" className="w-7 h-7" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-brand-ink">Thank you!</h3>
                <p className="mt-2 text-sm text-slate-500 max-w-sm">
                  Your details have been noted. Our team will contact you shortly to help you join HIO Health.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-sm font-bold text-brand-orange hover:underline"
                >
                  Submit another response
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Full Name" name="name" value={form.name} onChange={handleChange} required />
                  <Field label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
                </div>
                <Field label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} required />
                <div>
                  <label className="text-sm font-semibold text-brand-ink">Message</label>
                  <textarea
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-7 py-3 font-bold text-white shadow-md transition hover:bg-brand-orange-dark"
                >
                  Send Message
                  <Icon name="arrowRight" className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <InfoCard icon="phone" title="Call Us" text="+91 00000 00000" />
            <InfoCard icon="mail" title="Email Us" text="support@hiohealth.com" />
            <InfoCard
              icon="mapPin"
              title="Visit Us"
              text="Near Tahsil, Singahi Road, Neghasan, Dist. Lakhimpur Kheri, Uttar Pradesh - 262903"
            />
            <InfoCard icon="whatsapp" title="WhatsApp" text="Chat with our support team" />
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, name, type = "text", value, onChange, required }) {
  return (
    <div>
      <label className="text-sm font-semibold text-brand-ink" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
      />
    </div>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-100 p-5 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
        <Icon name={icon} className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-bold text-brand-ink text-sm">{title}</h4>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
