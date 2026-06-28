"use client";

import { useState, type FormEvent } from "react";

interface NewsletterFormProps {
  creatorCount: number;
}

type State = "idle" | "loading" | "success" | "error";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function NewsletterForm({ creatorCount }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldError, setFieldError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldError("");
    setErrorMsg("");

    const trimmed = email.trim();
    if (!trimmed) {
      setFieldError("Please enter your email address.");
      return;
    }
    if (!isValidEmail(trimmed)) {
      setFieldError("Please enter a valid email address.");
      return;
    }

    setState("loading");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const result: { success: boolean; error?: string } = await response.json();

      if (result.success) {
        setState("success");
        setEmail("");
      } else {
        setState("error");
        setErrorMsg(
          result.error === "Email already subscribed"
            ? "You're already subscribed — we'll keep the good stuff coming!"
            : result.error ?? "Something went wrong. Please try again."
        );
      }
    } catch {
      setState("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  }

  if (state === "success") {
    return (
      <div className="relative">
        <h2 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
          Never Miss an Opportunity
        </h2>
        <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-6 py-8 backdrop-blur-sm">
          <span className="text-4xl" aria-hidden="true">🎉</span>
          <p className="text-base font-bold text-white">You&apos;re subscribed!</p>
          <p className="text-sm text-white/75">
            We&apos;ll send you the best deals and creator opportunities every week.
          </p>
          <button
            type="button"
            onClick={() => setState("idle")}
            className="mt-2 rounded-lg border border-white/30 bg-white/10 px-5 py-2 text-xs font-semibold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            Subscribe another address
          </button>
        </div>
        <p className="mt-4 text-xs text-white/60">No spam. Unsubscribe anytime.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <h2 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
        Never Miss an Opportunity
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 sm:text-base">
        Join{" "}
        <span className="font-bold text-white">
          {creatorCount > 0 ? `${creatorCount.toLocaleString()}+` : "thousands of"}
        </span>{" "}
        creators and get the best brand deals, sponsorships and creator jobs
        delivered to your inbox every week.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-label="Newsletter subscription"
        className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
      >
        <div className="flex-1">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldError) setFieldError("");
            }}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={state === "loading"}
            aria-describedby={fieldError ? "newsletter-field-error" : undefined}
            aria-invalid={!!fieldError}
            className={`w-full rounded-xl border-2 bg-white/10 px-5 py-3.5 text-sm text-white placeholder-white/60 outline-none backdrop-blur-sm transition focus:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60 ${
              fieldError
                ? "border-red-400/60 focus:border-red-400"
                : "border-white/20 focus:border-white/40"
            }`}
          />
          {fieldError && (
            <p id="newsletter-field-error" className="mt-1.5 text-left text-xs text-red-300" role="alert">
              {fieldError}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={state === "loading"}
          className="shrink-0 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-700 shadow-lg transition hover:bg-slate-100 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700"
        >
          {state === "loading" ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Subscribing…
            </span>
          ) : (
            "Subscribe Free"
          )}
        </button>
      </form>

      {state === "error" && errorMsg && (
        <div
          className="mx-auto mt-4 max-w-md rounded-lg border border-red-400/30 bg-red-500/20 px-4 py-3 text-sm text-red-100"
          role="alert"
        >
          {errorMsg}
        </div>
      )}

      <p className="mt-4 text-xs text-white/60">
        No spam. Unsubscribe anytime. We respect your privacy.
      </p>
    </div>
  );
}
