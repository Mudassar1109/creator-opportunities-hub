"use client";

import { useState } from "react";

export default function SeedPage() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function seed() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/seed");
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setResult(`Error: ${e}`);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Database Seeder</h1>
        <p className="text-sm text-gray-600 mb-6">
          Click the button below to seed test data. You must be logged in first.
          This creates a test brand and 8 test opportunities.
        </p>
        <button
          onClick={seed}
          disabled={loading}
          className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 mb-6"
        >
          {loading ? "Seeding..." : "Seed Database"}
        </button>

        {result && (
          <pre className="rounded-lg bg-white border border-gray-200 p-4 text-xs text-gray-800 overflow-auto max-h-[600px]">
            {result}
          </pre>
        )}

        <div className="mt-6 text-sm text-gray-500">
          <p>After seeding, visit:</p>
          <ul className="mt-2 space-y-1">
            <li><a href="/opportunities" className="text-purple-600 hover:underline">/opportunities</a> — Marketplace</li>
            <li><a href="/dashboard/opportunities" className="text-purple-600 hover:underline">/dashboard/opportunities</a> — Brand dashboard</li>
            <li><a href="/api/diagnose" className="text-purple-600 hover:underline">/api/diagnose</a> — Database diagnostic</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
