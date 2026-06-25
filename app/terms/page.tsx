import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Terms of Service | Creator Opportunities Hub",
  description:
    "Read the Creator Opportunities Hub Terms of Service. These terms govern your use of our platform as a creator or brand.",
};

const LAST_UPDATED = "25 June 2025";

const SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: `By accessing or using Creator Opportunities Hub (the "Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Platform.

We may update these Terms from time to time. Continued use of the Platform after changes constitutes acceptance of the updated Terms.`,
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    content: `You must be at least 16 years old to use the Platform. By using the Platform, you represent that you meet this age requirement and that all information you provide is accurate and complete.`,
  },
  {
    id: "accounts",
    title: "3. Accounts",
    content: `You are responsible for maintaining the security of your account credentials. Do not share your password. You are responsible for all activity that occurs under your account.

We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or pose a security risk to other users.`,
  },
  {
    id: "creator-terms",
    title: "4. Creator Terms",
    content: `As a creator, you may apply for opportunities posted by brands. By applying, you agree to:
• Provide accurate information about your audience, platforms, and past work
• Not misrepresent your follower counts or engagement metrics
• Engage honestly and professionally with brands
• Only apply for opportunities you genuinely intend to pursue

We do not guarantee that you will be accepted for any opportunity or that any brand will respond to your application.`,
  },
  {
    id: "brand-terms",
    title: "5. Brand Terms",
    content: `As a brand, you may post opportunities for creators to apply to. By posting, you agree to:
• Provide accurate, complete information about the opportunity including real budgets
• Not post spam, misleading, or illegal opportunities
• Review applications in good faith
• Not collect personal data from creators beyond what is necessary for the opportunity
• Honour any commitments made to creators you accept

We reserve the right to remove any opportunity listing at our discretion.`,
  },
  {
    id: "prohibited",
    title: "6. Prohibited Conduct",
    content: `You must not:
• Post false, misleading, or fraudulent content
• Harass, abuse, or threaten other users
• Scrape, crawl, or extract data from the Platform without permission
• Use the Platform for any illegal purpose
• Attempt to gain unauthorised access to other accounts or our systems
• Use fake accounts or misrepresent your identity`,
  },
  {
    id: "content",
    title: "7. User Content",
    content: `You retain ownership of content you post on the Platform. By posting content, you grant us a non-exclusive, worldwide, royalty-free licence to display and use that content for the purpose of operating the Platform.

You are solely responsible for the content you post. We may remove content that violates these Terms without notice.`,
  },
  {
    id: "payments",
    title: "8. Payments & Transactions",
    content: `Creator Opportunities Hub facilitates connections between creators and brands but is not a party to any agreement between them. We do not process payments for creator-brand transactions. All payment disputes are between the creator and the brand directly.`,
  },
  {
    id: "disclaimer",
    title: "9. Disclaimer of Warranties",
    content: `The Platform is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or quality of any opportunity listing. We do not warrant that the Platform will be uninterrupted or error-free.`,
  },
  {
    id: "limitation",
    title: "10. Limitation of Liability",
    content: `To the fullest extent permitted by law, Creator Opportunities Hub shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform or any creator-brand transaction.`,
  },
  {
    id: "termination",
    title: "11. Termination",
    content: `You may delete your account at any time via Dashboard → Settings. We may terminate or suspend your account at any time for violations of these Terms. Upon termination, these Terms continue to apply to prior use of the Platform.`,
  },
  {
    id: "governing-law",
    title: "12. Governing Law",
    content: `These Terms are governed by applicable law. Any disputes shall be resolved through binding arbitration or in the courts of the jurisdiction where Creator Opportunities Hub is registered.`,
  },
  {
    id: "contact",
    title: "13. Contact",
    content: `For questions about these Terms, use the Contact page on this website.`,
  },
];

export default function TermsPage() {
  return (
    <PageShell label="Terms of Service">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            These Terms of Service govern your use of Creator Opportunities Hub.
            Please read them carefully before using the platform.
          </p>
        </div>
      </div>

      {/* Table of contents + content */}
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-4">
            <aside className="hidden lg:block">
              <nav className="sticky top-24" aria-label="Terms sections">
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

            <div className="lg:col-span-3">
              <div className="space-y-10">
                {SECTIONS.map((s) => (
                  <section key={s.id} id={s.id} aria-labelledby={`${s.id}-heading`}>
                    <h2 id={`${s.id}-heading`} className="text-lg font-bold text-gray-900">{s.title}</h2>
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
