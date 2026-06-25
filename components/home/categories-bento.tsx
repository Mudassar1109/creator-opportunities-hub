import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  count: number;
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  "Brand Deals":         "from-blue-500 to-blue-700",
  "Affiliate Programs":  "from-purple-500 to-purple-700",
  "Sponsorships":        "from-indigo-500 to-indigo-700",
  "UGC Jobs":            "from-pink-500 to-rose-600",
  "Creator Jobs":        "from-emerald-500 to-teal-600",
  "Collaborations":      "from-amber-500 to-orange-600",
  "Ambassador Programs": "from-rose-500 to-red-600",
  "Remote Work":         "from-cyan-500 to-sky-600",
};

function getGradient(name: string, colorHex: string | null): string {
  return CATEGORY_GRADIENTS[name] ?? (colorHex ? `from-[${colorHex}] to-[${colorHex}]/80` : "from-purple-500 to-purple-700");
}

export function CategoriesBento({ categories }: { categories: Category[] }) {
  if (categories.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-16">
        <span className="text-4xl" aria-hidden="true">📂</span>
        <p className="mt-4 text-base font-semibold text-gray-500">No categories available yet.</p>
      </div>
    );
  }

  return (
    <>
      {categories.map((cat, i) => {
        const gradient = getGradient(cat.name, cat.color);
        const delay = Math.min(i + 1, 6);

        return (
          <Link
            key={cat.id}
            href={`/opportunities?category=${cat.slug}`}
            className={`animate-fade-up animate-fade-up-delay-${delay} group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
            aria-label={`Browse ${cat.name} — ${cat.count} opportunities`}
          >
            {/* Background glow on hover */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/10 blur-xl" />
              <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/10 blur-xl" />
            </div>

            <span className="relative text-3xl" aria-hidden="true">{cat.icon ?? "📌"}</span>

            <h3 className="relative mt-3 text-sm font-bold text-white">{cat.name}</h3>

            <div className="relative mt-1 flex items-center justify-between">
              <p className="text-xs font-medium text-white/70">
                {cat.count > 0 ? `${cat.count} listing${cat.count !== 1 ? "s" : ""}` : "No listings yet"}
              </p>
              <svg
                className="h-4 w-4 translate-x-0 text-white/60 transition-transform duration-200 group-hover:translate-x-1"
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
