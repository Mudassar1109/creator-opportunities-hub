"use client";

import { useState, useEffect } from "react";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getGreetingEmoji(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "\u2600\uFE0F";
  if (hour < 17) return "\u26C5";
  return "\uD83C\uDF19";
}

interface Props {
  fullName?: string | null;
  avatarUrl?: string | null;
  email?: string;
  role?: "creator" | "brand";
}

export function WelcomeBanner({ fullName, avatarUrl, email, role = "creator" }: Props) {
  const [greeting, setGreeting] = useState("");
  const [emoji, setEmoji] = useState("");

  useEffect(() => {
    setGreeting(getGreeting());
    setEmoji(getGreetingEmoji());
  }, []);

  const displayName = fullName || email?.split("@")[0] || (role === "brand" ? "Brand" : "Creator");
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const subtitle = role === "brand"
    ? "Here's what's happening with your brand opportunities today."
    : "Here's what's happening with your creator profile today.";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 p-6 shadow-lg shadow-purple-500/10 sm:p-8">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Avatar */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-white/30 bg-white/20 backdrop-blur-sm shadow-lg sm:h-16 sm:w-16">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full rounded-xl object-cover" />
          ) : (
            <span className="text-xl font-bold text-white sm:text-2xl">{initials || "?"}</span>
          )}
        </div>

        {/* Greeting text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white/80">
            {emoji} {greeting}
          </p>
          <h1 className="mt-0.5 text-xl font-extrabold tracking-tight text-white sm:text-2xl truncate">
            Welcome back{displayName ? `, ${displayName}` : ""}
          </h1>
          <p className="mt-1 text-sm text-white/70">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
