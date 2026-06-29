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
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-indigo-600">
          Never Miss an Opportunity
        </h2>
        <div className="mx-auto mt-8 flex max-w-sm flex-col items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-8">
          <svg className="h-12 w-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-base font-bold text-emerald-800">You&apos;re subscribed!</p>
          <p className="text-sm text-emerald-600">
            We&apos;ll send you the best deals and creator opportunities every week.
          </p>
          <button
            type="button"
            onClick={() => setState("idle")}
            className="mt-2 rounded-xl border border-emerald-200 bg-white px-5 py-2 text-xs font-bold text-emerald-700 shadow-sm hover:bg-emerald-50 transition"
          >
            Subscribe another address
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">
        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-slate-900">
        Never Miss an Opportunity
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500 sm:text-base">
        Join{" "}
        <span className="font-bold text-indigo-600">
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
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
          {fieldError && (
            <p id="newsletter-field-error" className="mt-1.5 text-left text-xs text-rose-500" role="alert">
              {fieldError}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={state === "loading"}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "loading" ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Subscribing...
            </span>
          ) : (
            "Subscribe Free"
          )}
        </button>
      </form>

      {state === "error" && errorMsg && (
        <div
          className="mx-auto mt-4 max-w-md rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          role="alert"
        >
          {errorMsg}
        </div>
      )}

      <p className="mt-4 text-xs text-slate-400">
        No spam. Unsubscribe anytime. We respect your privacy.
      </p>
    </div>
  );
}
