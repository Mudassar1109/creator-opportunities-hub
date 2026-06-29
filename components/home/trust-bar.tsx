/**
 * TrustBar — Real-time trust indicators displayed directly below the hero.
 * Shows live counts from the database. No fake data.
 */

interface TrustBarProps {
  totalBrands: number;
  totalCreators: number;
  publishedOpportunities: number;
  totalApplications: number;
  verifiedBrands: number;
}

export function TrustBar({
  totalBrands,
  totalCreators,
  publishedOpportunities,
  totalApplications,
  verifiedBrands,
}: TrustBarProps) {
  const items = [
    {
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      value: verifiedBrands,
      label: "Verified Brands",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      value: totalCreators,
      label: "Active Creators",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      value: publishedOpportunities,
      label: "Live Opportunities",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      value: totalApplications,
      label: "Applications Sent",
      color: "text-cyan-600",
      bg: "bg-cyan-50",
    },
  ];

  return (
    <section
      className="border-b border-slate-100 bg-white"
      aria-label="Platform trust indicators"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 divide-x divide-slate-100 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 px-4 py-4 sm:px-6 sm:py-5"
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.bg} ${item.color}`}>
                {item.icon}
              </div>
              <div>
                <dd className={`text-base font-extrabold tabular-nums ${item.color} sm:text-lg`}>
                  {item.value > 1000
                    ? `${(item.value / 1000).toFixed(0)}K+`
                    : item.value > 0
                      ? `${item.value}+`
                      : '0'}
                </dd>
                <dt className="text-[11px] font-medium text-slate-500 sm:text-xs">{item.label}</dt>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
