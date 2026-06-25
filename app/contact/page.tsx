import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { ContactForm } from "@/app/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact | Creator Opportunities Hub",
  description:
    "Get in touch with the Creator Opportunities Hub team. We're here to help creators and brands get the most out of the platform.",
};

const FAQ = [
  {
    q: "How long does it take to get a response?",
    a: "We aim to respond to all enquiries within 1–2 business days. For urgent matters please mark your subject as 'Urgent'.",
  },
  {
    q: "I'm a brand — how do I list an opportunity?",
    a: "Create a brand account, complete your company profile, then use the 'Post Opportunity' button in your dashboard.",
  },
  {
    q: "I'm a creator — how do I apply for deals?",
    a: "Sign up as a Creator, complete your profile, and hit Apply on any opportunity. Your profile is your application.",
  },
  {
    q: "Can I report a suspicious listing?",
    a: "Yes. Use the contact form with the subject 'Report a Listing' and include the opportunity title or URL.",
  },
  {
    q: "How do I delete my account?",
    a: "Go to Dashboard → Settings → Account and use the Delete Account option, or contact us directly.",
  },
];

export default function ContactPage() {
  return (
    <PageShell label="Contact">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-cyan-600 px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-white/5 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-2xl">
          <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/90">
            Get in Touch
          </span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            We&apos;re here to help
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            Have a question, a partnership enquiry, or feedback on the platform?
            Send us a message and we&apos;ll get back to you.
          </p>
        </div>
      </section>

      {/* Contact grid */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">

            {/* Left — info */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold text-gray-900">General Information</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                Creator Opportunities Hub is an online platform. All support is
                handled digitally. We do not publish a physical address or
                personal contact details.
              </p>

              {/* Channel cards */}
              <div className="mt-8 space-y-4">
                {[
                  {
                    icon: "✉️",
                    title: "Email Support",
                    body: "Use the contact form. We reply within 1–2 business days.",
                    color: "bg-purple-50 border-purple-200",
                  },
                  {
                    icon: "🐦",
                    title: "Twitter / X",
                    body: "For quick questions, reach us on social media.",
                    color: "bg-cyan-50 border-cyan-200",
                  },
                  {
                    icon: "💼",
                    title: "LinkedIn",
                    body: "Partnership and business development enquiries.",
                    color: "bg-indigo-50 border-indigo-200",
                  },
                  {
                    icon: "📸",
                    title: "Instagram",
                    body: "Follow us for creator tips and platform updates.",
                    color: "bg-pink-50 border-pink-200",
                  },
                ].map((c) => (
                  <div
                    key={c.title}
                    className={`flex items-start gap-4 rounded-xl border p-4 ${c.color}`}
                  >
                    <span className="text-xl" aria-hidden="true">{c.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{c.title}</p>
                      <p className="mt-0.5 text-xs text-gray-500">{c.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-xs text-gray-400">
                Business hours: Monday – Friday, 9:00–18:00 UTC.
                We do not provide phone or WhatsApp support.
              </p>
            </div>

            {/* Right — form */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-bold text-gray-900">Send a Message</h2>
                <p className="mt-1 text-sm text-gray-500">
                  All fields are required. We never share your information with third parties.
                </p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="faq-heading">
        <div className="mx-auto max-w-3xl">
          <h2 id="faq-heading" className="mb-10 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <dl className="space-y-6">
            {FAQ.map((item) => (
              <div key={item.q} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <dt className="text-sm font-bold text-gray-900">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-gray-500">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </PageShell>
  );
}
