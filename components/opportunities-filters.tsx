"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const COUNTRIES = [
  "All Countries", "United States", "United Kingdom", "Canada", "Australia",
  "Germany", "France", "India", "Brazil", "Japan", "UAE", "Singapore", "Netherlands",
];

interface FiltersProps {
  categories: { name: string; slug: string }[];
}

export function OpportunitiesFilters({ categories }: FiltersProps) {
  const router = useRouter();
  const params = useSearchParams();

  const currentSearch = params.get("search") || "";
  const currentCategory = params.get("category") || "";
  const currentCountry = params.get("country") || "";
  const currentBudget = params.get("budget") || "";

  const updateFilters = useCallback(
    (key: string, value: string) => {
      const sp = new URLSearchParams(params.toString());
      if (value) {
        sp.set(key, value);
      } else {
        sp.delete(key);
      }
      sp.delete("page"); // reset page on filter change
      router.push(`/opportunities?${sp.toString()}`);
    },
    [params, router]
  );

  return (
    <form
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const sp = new URLSearchParams();
        const search = (fd.get("search") as string) || "";
        const category = (fd.get("category") as string) || "";
        const country = (fd.get("country") as string) || "";
        const budget = (fd.get("budget") as string) || "";
        if (search) sp.set("search", search);
        if (category) sp.set("category", category);
        if (country) sp.set("country", country);
        if (budget) sp.set("budget", budget);
        router.push(`/opportunities?${sp.toString()}`);
      }}
    >
      <div className="lg:col-span-1">
        <input
          name="search"
          type="text"
          placeholder="Search opportunities..."
          defaultValue={currentSearch}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
        />
      </div>

      <select
        name="category"
        defaultValue={currentCategory}
        onChange={(e) => updateFilters("category", e.target.value)}
        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>{c.name}</option>
        ))}
      </select>

      <select
        name="country"
        defaultValue={currentCountry}
        onChange={(e) => updateFilters("country", e.target.value)}
        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
      >
        {COUNTRIES.map((c) => (
          <option key={c} value={c === "All Countries" ? "" : c}>{c}</option>
        ))}
      </select>

      <select
        name="budget"
        defaultValue={currentBudget}
        onChange={(e) => updateFilters("budget", e.target.value)}
        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
      >
        <option value="">Any Budget</option>
        <option value="0-1000">Under $1,000</option>
        <option value="1000-5000">$1,000 - $5,000</option>
        <option value="5000-10000">$5,000 - $10,000</option>
        <option value="10000-50000">$10,000 - $50,000</option>
        <option value="50000+">$50,000+</option>
      </select>

      <button
        type="submit"
        className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
      >
        Search
      </button>
    </form>
  );
}
