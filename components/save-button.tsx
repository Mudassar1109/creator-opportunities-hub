"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "coh_saved_opportunities";

function getSavedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function toggleSavedId(id: string): string[] {
  const ids = getSavedIds();
  const idx = ids.indexOf(id);
  if (idx === -1) {
    ids.push(id);
  } else {
    ids.splice(idx, 1);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  return ids;
}

export function SaveButton({ opportunityId }: { opportunityId?: string }) {
  const id = opportunityId ?? "default";
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(getSavedIds().includes(id));
  }, [id]);

  function handleClick() {
    const ids = toggleSavedId(id);
    setSaved(ids.includes(id));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center rounded-xl border px-3.5 py-2.5 text-xs font-semibold shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
        saved
          ? "border-indigo-200 bg-indigo-50 text-indigo-600"
          : "border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
      }`}
      aria-label={saved ? "Remove from saved" : "Save opportunity"}
    >
      <svg
        className="h-4 w-4"
        fill={saved ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
    </button>
  );
}
