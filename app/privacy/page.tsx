import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Privacy Policy | Creator Opportunities Hub",
  description:
    "Read the Creator Opportunities Hub Privacy Policy to understand how we collect, use, and protect your personal information.",
};

const LAST_UPDATED = "25 June 2025";

const SECTIONS = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    content: `We collect information you provide directly when you create an account, complete your profile, post or apply for opportunities, or contact us. This includes your name, email address, profile information (bio, platforms, follower counts, niches), and any content you submit through the platform.

We also collect information automatically when you use the platform, including log data (IP address, browser type, pages visited), device information, and usage data. We use cookies and similar technologies as described in our Cookie Policy.`,
  },
  {
    id: "how-we-use",
    title: "2. How We Use Your Information",
    content: `We use the information we collect to:
• Provide, operate, and improve the platform
• Match creators with relevant opportunities
• Process applications and facilitate brand-creator connections
• Send transactional emails and newsletters (where you have opted in)
• Detect and prevent fraud or misuse
• Comply with legal obligations`,
  },
  {
    id: "sharing",
    title: "3. Information Sharing",
    content: `We do not sell your personal information. We may share your information with:
• Brands or creators as necessary to facilitate a connection you have initiated (e.g., when you apply for an opportunity, the brand sees your profile)
• Service providers who process data on our behalf (e.g., Supabase for database hosting, email providers)
• Law enforcement when required by applicable law

We require all service providers to maintain the confidentiality and security of your information.`,
  },
  {
    id: "data-retention",
    title: "4. Data Retention",
    content: `We retain your account information for as long as your account is active. If you delete your account, we will delete or anonymise your personal data within 30 days, except where we are required to retain it for legal purposes.`,
  },
  {
    id: "your-rights",
    title: "5. Your Rights",
    content: `Depending on your location, you may have the right to:
• Access the personal data we hold about you
• Correct inaccurate or incomplete data
• Request deletion of your data
• Object to or restrict processing of your data
• Port your data to another service

To exercise any of these rights, contact us using the Contact page.`,
  },
  {
    id: "security",
    title: "6. Security",
    content: `We implement industry-standard security measures including encrypted connections (TLS), row-level security on our database, and regular security reviews. However, no online service is completely secure, and we cannot guarantee absolute security.`,
  },
  {
    id: "cookies",
    title: "7. Cookies",
    content: `We use cookies and similar tracking technologies. See our Cookie Policy for details on the types of cookies we use, their purposes, and how to control them.`,
  },
  {
    id: "third-party",
    title: "8. Third-Party Links",
    content: `The platform may contain links to third-party websites. We are not responsible for the privacy practices of those websites and encourage you to read their privacy policies.`,
  },
  {
    id: "children",
    title: "9. Children",
    content: `Our platform is not directed at children under 16. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, contact us and we will delete it.`,
  },
  {
    id: "changes",
    title: "10. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a notice on the platform. The date at the top of this page indicates when the policy was last updated.`,
  },
  {
    id: "contact",
    title: "11. Contact",
    content: `For privacy-related questions or requests, contact us through the Contact page on this website. We do not publish personal contact details.`,
  },
];

export default function PrivacyPage() {
  return (
    <PageShell label="Privacy Policy">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            This Privacy Policy explains how Creator Opportunities Hub (&quot;we&quot;,
            &quot;our&quot;, or &quot;us&quot;) collects, uses, and protects information about you
            when you use our platform.
          </p>
        </div>
      </div>

      {/* Table of contents + content */}
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-4">
            {/* TOC — sticky sidebar */}
            <aside className="hidden lg:block">
              <nav className="sticky top-24" aria-label="Privacy policy sections">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">Contents</p>
                <ol className="space-y-2">
                  {SECTIONS.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="text-sm text-gray-500 transition hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            {/* Body */}
            <div className="lg:col-span-3">
              <div className="space-y-10">
                {SECTIONS.map((s) => (
                  <section key={s.id} id={s.id} aria-labelledby={`${s.id}-heading`}>
                    <h2 id={`${s.id}-heading`} className="text-lg font-bold text-gray-900">
                      {s.title}
                    </h2>
                    <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-600">
                      {s.content}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
