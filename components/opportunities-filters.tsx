"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const COUNTRIES = [
  "All Countries", "United States", "United Kingdom", "Canada", "Australia",
  "Germany", "France", "India", "Brazil", "Japan", "UAE", "Singapore", "Netherlands",
];

const BUDGET_RANGES = [
  { value: "0-1000", label: "Under $1,000" },
  { value: "1000-5000", label: "$1,000 - $5,000" },
  { value: "5000-10000", label: "$5,000 - $10,000" },
  { value: "10000-50000", label: "$10,000 - $50,000" },
  { value: "50000+", label: "$50,000+" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "budget_high", label: "Budget: High to Low" },
  { value: "budget_low", label: "Budget: Low to High" },
  { value: "deadline", label: "Deadline: Soonest" },
];

interface FiltersProps {
  categories: { name: string; slug: string }[];
}

function FilterSelect({
  name,
  defaultValue,
  onChange,
  children,
}: {
  name: string;
  defaultValue: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      onChange={onChange}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
    >
      {children}
    </select>
  );
}

function FilterInput({
  name,
  defaultValue,
  placeholder,
  icon,
}: {
  name: string;
  defaultValue: string;
  placeholder: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
        {icon}
      </div>
      <input
        name={name}
        type="text"
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-700 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
      />
    </div>
  );
}

export function OpportunitiesFilters({ categories }: FiltersProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentSearch = params.get("search") || "";
  const currentCategory = params.get("category") || "";
  const currentCountry = params.get("country") || "";
  const currentBudget = params.get("budget") || "";
  const currentSort = params.get("sort") || "newest";

  const updateFilters = useCallback(
    (key: string, value: string) => {
      const sp = new URLSearchParams(params.toString());
      if (value) {
        sp.set(key, value);
      } else {
        sp.delete(key);
      }
      sp.delete("page");
      router.push(`/opportunities?${sp.toString()}`);
    },
    [params, router]
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const sp = new URLSearchParams();
    const search = (fd.get("search") as string) || "";
    const category = (fd.get("category") as string) || "";
    const country = (fd.get("country") as string) || "";
    const budget = (fd.get("budget") as string) || "";
    const sort = (fd.get("sort") as string) || "newest";
    if (search) sp.set("search", search);
    if (category) sp.set("category", category);
    if (country) sp.set("country", country);
    if (budget) sp.set("budget", budget);
    if (sort && sort !== "newest") sp.set("sort", sort);
    router.push(`/opportunities?${sp.toString()}`);
    setMobileOpen(false);
  };

  const filterContent = (
    <>
      {/* Search */}
      <FilterInput
        name="search"
        defaultValue={currentSearch}
        placeholder="Search opportunities..."
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
      />

      {/* Category */}
      <FilterSelect name="category" defaultValue={currentCategory} onChange={(e) => updateFilters("category", e.target.value)}>
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>{c.name}</option>
        ))}
      </FilterSelect>

      {/* Country */}
      <FilterSelect name="country" defaultValue={currentCountry} onChange={(e) => updateFilters("country", e.target.value)}>
        {COUNTRIES.map((c) => (
          <option key={c} value={c === "All Countries" ? "" : c}>{c}</option>
        ))}
      </FilterSelect>

      {/* Budget */}
      <FilterSelect name="budget" defaultValue={currentBudget} onChange={(e) => updateFilters("budget", e.target.value)}>
        <option value="">Any Budget</option>
        {BUDGET_RANGES.map((r) => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </FilterSelect>

      {/* Sort */}
      <FilterSelect name="sort" defaultValue={currentSort} onChange={(e) => updateFilters("sort", e.target.value)}>
        {SORT_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </FilterSelect>
    </>
  );

  return (
    <>
      {/* Desktop filters */}
      <form
        onSubmit={handleSubmit}
        className="hidden items-end gap-3 lg:grid lg:grid-cols-6"
      >
        {filterContent}
        <button
          type="submit"
          className="flex h-[42px] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-sm shadow-indigo-500/20 transition-all duration-200 hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Search
        </button>
      </form>

      {/* Mobile toggle */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters &amp; Search
        </button>
      </div>

      {/* Mobile filter drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-xl">
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-bold text-slate-900">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Close filters"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer body */}
            <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
              {filterContent}
              <div className="mt-auto flex flex-col gap-3 pt-4">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm shadow-indigo-500/20 transition-all duration-200 hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Search Opportunities
                </button>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="text-center text-sm font-medium text-slate-500 hover:text-slate-700 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
