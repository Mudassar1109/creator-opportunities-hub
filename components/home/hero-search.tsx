"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const CATEGORIES = [
  "All Categories",
  "Brand Deals",
  "Affiliate Programs",
  "Sponsorships",
  "UGC Jobs",
  "Creator Jobs",
  "Collaborations",
  "Ambassador Programs",
  "Remote Work",
];

const COUNTRIES = [
  "All Countries",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Netherlands",
  "Spain",
  "India",
  "Brazil",
  "Mexico",
  "Japan",
  "South Korea",
  "Singapore",
  "Worldwide",
];

export function HeroSearch() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [country, setCountry] = useState("All Countries");

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("search", keyword.trim());
    if (category && category !== "All Categories") params.set("category", category.toLowerCase().replace(/ /g, "-"));
    if (country && country !== "All Countries") params.set("country", country);
    router.push(`/opportunities?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSearch}
      className="mx-auto w-full max-w-4xl"
      role="search"
      aria-label="Search opportunities"
    >
      <div className="glass-card-light flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center lg:rounded-3xl lg:p-4">
        {/* Keyword */}
        <div className="relative flex-1">
          <label htmlFor="hero-keyword" className="sr-only">Search keyword</label>
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-purple-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            id="hero-keyword"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Brand deals, UGC, sponsorships…"
            className="w-full rounded-xl border border-transparent bg-white/60 py-3 pl-11 pr-4 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-400/25"
          />
        </div>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-gray-200 sm:block" aria-hidden="true" />

        {/* Category */}
        <div className="relative min-w-[160px]">
          <label htmlFor="hero-category" className="sr-only">Category</label>
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
          <select
            id="hero-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full appearance-none rounded-xl border border-transparent bg-white/60 py-3 pl-9 pr-8 text-sm font-medium text-gray-700 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-400/25"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-gray-200 sm:block" aria-hidden="true" />

        {/* Country */}
        <div className="relative min-w-[150px]">
          <label htmlFor="hero-country" className="sr-only">Country</label>
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
          </svg>
          <select
            id="hero-country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full appearance-none rounded-xl border border-transparent bg-white/60 py-3 pl-9 pr-8 text-sm font-medium text-gray-700 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-400/25"
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Search
        </button>
      </div>

      {/* Quick filters */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {["Brand Deals", "UGC Jobs", "Sponsorships", "Remote Work", "Creator Jobs"].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => {
              setCategory(tag);
              router.push(`/opportunities?category=${tag.toLowerCase().replace(/ /g, "-")}`);
            }}
            className="rounded-full border border-white/30 bg-white/20 px-3.5 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm transition hover:bg-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            {tag}
          </button>
        ))}
      </div>
    </form>
  );
}
