"use client";

import { useState, FormEvent } from "react";

export function NewsletterForm({ creatorCount }: { creatorCount: number }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: "success", text: "Successfully subscribed!" });
        setEmail("");
      } else {
        setMessage({ type: "error", text: result.error || "Failed to subscribe" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <h2 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
        Never Miss an Opportunity
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 sm:text-base">
        Join <span className="font-bold">{creatorCount.toLocaleString()}+</span> creators and get the best brand deals, sponsorships and
        creator jobs delivered to your inbox every week.
      </p>

      {message && (
        <div
          className={`mt-4 rounded-lg px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-emerald-500/20 text-emerald-100"
              : "bg-red-500/20 text-red-100"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
        <label htmlFor="email" className="sr-only">Email address</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-xl border-2 border-white/20 bg-white/10 px-5 py-3.5 text-sm text-white placeholder-white/60 outline-none backdrop-blur-sm transition focus:border-white/40 focus:bg-white/20"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-purple-700 shadow-lg transition hover:bg-gray-100 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Subscribing..." : "Subscribe Free"}
        </button>
      </form>

      <p className="mt-4 text-xs text-white/60">
        No spam. Unsubscribe anytime. We respect your privacy.
      </p>
    </div>
  );
}
