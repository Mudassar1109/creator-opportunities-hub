import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Cookie Policy | Creator Opportunities Hub",
  description:
    "Learn how Creator Opportunities Hub uses cookies and similar tracking technologies on our platform.",
};

const LAST_UPDATED = "25 June 2025";

const COOKIE_TYPES = [
  {
    name: "Strictly Necessary",
    purpose: "Required for the platform to function. These cannot be disabled.",
    examples: "Authentication session cookies, security tokens, CSRF protection.",
    retention: "Session / up to 7 days",
    canDisable: false,
  },
  {
    name: "Functional",
    purpose: "Remember your preferences and settings to improve your experience.",
    examples: "Theme preference (light/dark mode), language settings.",
    retention: "Up to 1 year",
    canDisable: true,
  },
  {
    name: "Analytics",
    purpose: "Help us understand how users interact with the platform so we can improve it.",
    examples: "Page views, feature usage, error rates. Data is aggregated and anonymised.",
    retention: "Up to 2 years",
    canDisable: true,
  },
];

export default function CookiesPage() {
  return (
    <PageShell label="Cookie Policy">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Cookie Policy
          </h1>
          <p className="mt-3 text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            This Cookie Policy explains what cookies are, how we use them on Creator
            Opportunities Hub, and your choices regarding their use.
          </p>
        </div>
      </div>

      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-12">

          {/* What are cookies */}
          <section aria-labelledby="what-heading">
            <h2 id="what-heading" className="text-lg font-bold text-gray-900">What are cookies?</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Cookies are small text files placed on your device by websites you visit. They are widely
              used to make websites work efficiently, remember your preferences, and provide information
              to site owners. We also use similar technologies such as local storage and session storage.
            </p>
          </section>

          {/* How we use them */}
          <section aria-labelledby="how-heading">
            <h2 id="how-heading" className="text-lg font-bold text-gray-900">How we use cookies</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              We use cookies and similar technologies to keep you logged in, remember your preferences,
              understand how the platform is used, and improve performance.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
              <table className="w-full text-sm" role="table">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Type</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Purpose</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Retention</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Can disable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {COOKIE_TYPES.map((c) => (
                    <tr key={c.name}>
                      <td className="px-5 py-4 font-semibold text-gray-900">{c.name}</td>
                      <td className="px-5 py-4 text-gray-600">
                        <p>{c.purpose}</p>
                        <p className="mt-1 text-xs text-gray-400">{c.examples}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-600">{c.retention}</td>
                      <td className="px-5 py-4">
                        {c.canDisable ? (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">Yes</span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Third-party */}
          <section aria-labelledby="third-party-heading">
            <h2 id="third-party-heading" className="text-lg font-bold text-gray-900">Third-party cookies</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Some features of the platform rely on third-party services (such as our authentication and
              database provider, Supabase) which may set their own cookies. We do not control these
              cookies. Please refer to the relevant third-party privacy policies for details.
            </p>
          </section>

          {/* Your choices */}
          <section aria-labelledby="choices-heading">
            <h2 id="choices-heading" className="text-lg font-bold text-gray-900">Your choices</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              You can control cookies through your browser settings. Most browsers allow you to refuse
              or delete cookies. Note that disabling strictly necessary cookies will prevent the
              platform from working correctly.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Links to cookie management instructions for common browsers:
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-600">
              {[
                { name: "Google Chrome", url: "https://support.google.com/chrome/answer/95647" },
                { name: "Mozilla Firefox", url: "https://support.mozilla.org/kb/enable-and-disable-cookies-website-preferences" },
                { name: "Safari", url: "https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" },
                { name: "Microsoft Edge", url: "https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" },
              ].map((b) => (
                <li key={b.name}>
                  <a
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
                  >
                    {b.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* Changes */}
          <section aria-labelledby="changes-heading">
            <h2 id="changes-heading" className="text-lg font-bold text-gray-900">Changes to this policy</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              We may update this Cookie Policy from time to time. We will notify you of any significant
              changes by updating the date at the top of this page.
            </p>
          </section>

          {/* Contact */}
          <section aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="text-lg font-bold text-gray-900">Contact</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              For questions about our use of cookies, use the{" "}
              <a href="/contact" className="text-purple-600 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 rounded">
                Contact page
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
