import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  count: number;
}

const CATEGORY_ACCENT: Record<string, { icon: string; ring: string; text: string }> = {
  "Brand Deals":         { icon: "🤝", ring: "ring-blue-200", text: "text-blue-600" },
  "Affiliate Programs":  { icon: "🔗", ring: "ring-indigo-200", text: "text-indigo-600" },
  "Sponsorships":        { icon: "🎯", ring: "ring-indigo-200", text: "text-indigo-600" },
  "UGC Jobs":            { icon: "🎬", ring: "ring-pink-200", text: "text-pink-600" },
  "Creator Jobs":        { icon: "💼", ring: "ring-emerald-200", text: "text-emerald-600" },
  "Collaborations":      { icon: "🤜", ring: "ring-amber-200", text: "text-amber-600" },
  "Ambassador Programs": { icon: "⭐", ring: "ring-rose-200", text: "text-rose-600" },
  "Remote Work":         { icon: "🌍", ring: "ring-cyan-200", text: "text-cyan-600" },
};

function getAccent(name: string): { icon: string; ring: string; text: string } {
  return CATEGORY_ACCENT[name] ?? { icon: "📌", ring: "ring-slate-200", text: "text-slate-600" };
}

export function CategoriesBento({ categories }: { categories: Category[] }) {
  if (categories.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16">
        <span className="text-4xl" aria-hidden="true">📂</span>
        <p className="mt-4 text-base font-semibold text-slate-500">No categories available yet.</p>
      </div>
    );
  }

  return (
    <>
      {categories.map((cat, i) => {
        const accent = getAccent(cat.name);
        const delay = Math.min(i + 1, 6);

        return (
          <Link
            key={cat.id}
            href={`/opportunities?category=${cat.slug}`}
            className={`animate-fade-up animate-fade-up-delay-${delay} group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            aria-label={`Browse ${cat.name} \u2014 ${cat.count} opportunities`}
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 ${accent.ring} bg-white text-xl shadow-sm`}
              aria-hidden="true"
            >
              {cat.icon ?? accent.icon}
            </span>

            <h3 className="mt-4 text-sm font-bold text-slate-900">{cat.name}</h3>

            <p className="mt-1 text-xs text-slate-500">
              {cat.count > 0 ? `${cat.count} listing${cat.count !== 1 ? "s" : ""}` : "No listings yet"}
            </p>

            <div className="mt-auto flex items-center gap-1 pt-3">
              <span className={`text-xs font-semibold ${accent.text}`}>Browse</span>
              <svg
                className={`h-3.5 w-3.5 ${accent.text} translate-x-0 transition-transform duration-200 group-hover:translate-x-1`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>
        );
      })}
    </>
  );
}
