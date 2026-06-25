"use client";

import { useState, type FormEvent } from "react";

const SUBJECTS = [
  "General Enquiry",
  "Creator Support",
  "Brand / Partnership",
  "Report a Listing",
  "Technical Issue",
  "Account & Billing",
  "Press & Media",
  "Other",
];

type FormState = "idle" | "submitting" | "success" | "error";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [state, setState] = useState<FormState>("idle");
  const [errorText, setErrorText] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<typeof form>>({});

  function validate(): boolean {
    const errors: Partial<typeof form> = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      errors.name = "Please enter your full name (at least 2 characters).";
    }
    if (!form.email.trim() || !isValidEmail(form.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!form.subject) {
      errors.subject = "Please select a subject.";
    }
    if (!form.message.trim() || form.message.trim().length < 20) {
      errors.message = "Please enter a message of at least 20 characters.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setState("submitting");
    setErrorText("");

    try {
      // No backend endpoint yet — simulate network delay and succeed gracefully.
      // When a real endpoint is available, replace this with a fetch() call.
      await new Promise<void>((resolve) => setTimeout(resolve, 900));
      setState("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setFieldErrors({});
    } catch {
      setState("error");
      setErrorText("Something went wrong. Please try again.");
    }
  }

  if (state === "success") {
    return (
      <div className="flex flex-col items-center rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-10 text-center">
        <span className="text-4xl" aria-hidden="true">✅</span>
        <h3 className="mt-4 text-lg font-bold text-emerald-800">Message sent!</h3>
        <p className="mt-2 text-sm text-emerald-700">
          Thanks for reaching out. We&apos;ll reply within 1–2 business days.
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-6 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Name */}
        <div className="sm:col-span-1">
          <label htmlFor="contact-name" className="block text-sm font-semibold text-gray-700">
            Full Name <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-purple-500/25 ${
              fieldErrors.name
                ? "border-red-300 focus:border-red-400"
                : "border-gray-200 focus:border-purple-400"
            }`}
            placeholder="Your name"
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            aria-invalid={!!fieldErrors.name}
          />
          {fieldErrors.name && (
            <p id="name-error" className="mt-1.5 text-xs text-red-600" role="alert">{fieldErrors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="sm:col-span-1">
          <label htmlFor="contact-email" className="block text-sm font-semibold text-gray-700">
            Email Address <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-purple-500/25 ${
              fieldErrors.email
                ? "border-red-300 focus:border-red-400"
                : "border-gray-200 focus:border-purple-400"
            }`}
            placeholder="you@example.com"
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            aria-invalid={!!fieldErrors.email}
          />
          {fieldErrors.email && (
            <p id="email-error" className="mt-1.5 text-xs text-red-600" role="alert">{fieldErrors.email}</p>
          )}
        </div>

        {/* Subject */}
        <div className="sm:col-span-2">
          <label htmlFor="contact-subject" className="block text-sm font-semibold text-gray-700">
            Subject <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <select
            id="contact-subject"
            value={form.subject}
            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
            className={`mt-1.5 w-full appearance-none rounded-xl border px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-purple-500/25 ${
              fieldErrors.subject
                ? "border-red-300 focus:border-red-400"
                : "border-gray-200 focus:border-purple-400"
            }`}
            aria-describedby={fieldErrors.subject ? "subject-error" : undefined}
            aria-invalid={!!fieldErrors.subject}
          >
            <option value="">Select a subject…</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {fieldErrors.subject && (
            <p id="subject-error" className="mt-1.5 text-xs text-red-600" role="alert">{fieldErrors.subject}</p>
          )}
        </div>

        {/* Message */}
        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className="block text-sm font-semibold text-gray-700">
            Message <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <textarea
            id="contact-message"
            rows={6}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className={`mt-1.5 w-full resize-y rounded-xl border px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-purple-500/25 ${
              fieldErrors.message
                ? "border-red-300 focus:border-red-400"
                : "border-gray-200 focus:border-purple-400"
            }`}
            placeholder="Describe your question or request in detail…"
            aria-describedby={fieldErrors.message ? "message-error" : undefined}
            aria-invalid={!!fieldErrors.message}
          />
          <div className="mt-1 flex items-center justify-between">
            {fieldErrors.message ? (
              <p id="message-error" className="text-xs text-red-600" role="alert">{fieldErrors.message}</p>
            ) : (
              <span />
            )}
            <p className="text-xs text-gray-400">{form.message.length} / 2000</p>
          </div>
        </div>
      </div>

      {state === "error" && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {errorText}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-xs text-gray-400">
          We never share your information with third parties.
        </p>
        <button
          type="submit"
          disabled={state === "submitting"}
          className="shrink-0 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-8 py-3 text-sm font-bold text-white shadow-md shadow-purple-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          {state === "submitting" ? "Sending…" : "Send Message"}
        </button>
      </div>
    </form>
  );
}
