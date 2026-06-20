"use client";

/**
 * Profile Form — Client component for editing creator profile
 *
 * Handles: avatar upload, all profile fields, platform/niche selection,
 * country/city, social URLs, follower counts, validation, save state.
 */

import { useState, useRef, type FormEvent } from "react";
import type { Profile } from "@/lib/database.types";
import { saveProfile, uploadAvatar, type ProfileFormData, type ActionResult } from "@/app/dashboard/profile/actions";

// ─── Constants ──────────────────────────────────────────────

const PLATFORMS = [
  "YouTube",
  "TikTok",
  "Instagram",
  "Twitter/X",
  "LinkedIn",
  "Twitch",
  "Facebook",
  "Pinterest",
  "Snapchat",
  "Other",
] as const;

const NICHES = [
  "Fashion & Beauty",
  "Fitness & Health",
  "Technology",
  "Gaming",
  "Travel",
  "Food & Cooking",
  "Education",
  "Finance & Business",
  "Lifestyle",
  "Music",
  "Sports",
  "Parenting & Family",
  "Comedy & Entertainment",
  "Art & Design",
  "Science",
  "Sustainability",
] as const;

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "Spain", "Italy", "Netherlands", "Sweden", "Norway",
  "Denmark", "Finland", "Brazil", "Mexico", "Argentina", "Colombia",
  "Japan", "South Korea", "India", "Indonesia", "Philippines",
  "Thailand", "Vietnam", "Singapore", "UAE", "Saudi Arabia",
  "South Africa", "Nigeria", "Kenya", "Egypt", "Turkey", "Pakistan",
  "New Zealand", "Ireland", "Poland", "Portugal", "Other",
] as const;

// ─── Props ──────────────────────────────────────────────────

interface Props {
  profile: Profile | null;
  userEmail: string;
}

export function ProfileForm({ profile, userEmail }: Props) {
  // ── Form state ──
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [username, setUsername] = useState(profile?.username ?? "");
  const [headline, setHeadline] = useState(profile?.headline ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [country, setCountry] = useState(profile?.country ?? "");
  const [city, setCity] = useState(profile?.city ?? "");
  const [website, setWebsite] = useState(profile?.website ?? "");
  const [platforms, setPlatforms] = useState<string[]>(profile?.platforms ?? []);
  const [niches, setNiches] = useState<string[]>(profile?.niches ?? []);
  const [followerCount, setFollowerCount] = useState(profile?.follower_count?.toString() ?? "0");
  const [youtubeUrl, setYoutubeUrl] = useState(profile?.youtube_url ?? "");
  const [tiktokUrl, setTiktokUrl] = useState(profile?.tiktok_url ?? "");
  const [instagramUrl, setInstagramUrl] = useState(profile?.instagram_url ?? "");
  const [twitterUrl, setTwitterUrl] = useState(profile?.twitter_url ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedin_url ?? "");
  const [isPublic, setIsPublic] = useState(profile?.is_public ?? true);

  // ── UI state ──
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url ?? null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Avatar upload ──
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setAvatarError(null);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await uploadAvatar(formData);

      if (res.success && res.avatarUrl) {
        setAvatarUrl(res.avatarUrl);
      } else {
        setAvatarError(res.error ?? "Upload failed");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setAvatarError(
        message.includes("Body exceeded")
          ? "File is too large. Maximum size is 5 MB."
          : message
      );
    } finally {
      setUploading(false);
      // Reset file input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  // ── Toggle helpers ──
  function togglePlatform(p: string) {
    setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  function toggleNiche(n: string) {
    setNiches((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));
  }

  // ── Submit ──
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setResult(null);

    const data: ProfileFormData = {
      full_name: fullName,
      username,
      headline,
      bio,
      country,
      city,
      website,
      platforms,
      niches,
      follower_count: parseInt(followerCount) || 0,
      youtube_url: youtubeUrl,
      tiktok_url: tiktokUrl,
      instagram_url: instagramUrl,
      twitter_url: twitterUrl,
      linkedin_url: linkedinUrl,
      is_public: isPublic,
    };

    const res = await saveProfile(data);
    setSaving(false);
    setResult(res);

    if (res.success) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // ── Field error helper ──
  const fieldErr = (field: string) => result?.fieldErrors?.[field];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ── Alerts ─────────────────────────────────── */}
      {result?.success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Profile saved successfully!
        </div>
      )}
      {result?.error && !result.success && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {result.error}
        </div>
      )}

      {/* ── Avatar ─────────────────────────────────── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Profile Photo</h2>
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 overflow-hidden rounded-full bg-gray-100 ring-2 ring-gray-200">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-gray-500">
                {(fullName || "?")[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload Photo"}
            </button>
            <p className="mt-1 text-xs text-gray-600">JPG, PNG, WebP or GIF. Max 5 MB.</p>
            {avatarError && <p className="mt-1 text-xs text-red-600">{avatarError}</p>}
          </div>
        </div>
      </section>

      {/* ── Basic Info ─────────────────────────────── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Basic Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Full Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Full Name *</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${fieldErr("full_name") ? "border-red-400" : "border-gray-300"}`}
              placeholder="Jane Doe"
            />
            {fieldErr("full_name") && <p className="mt-1 text-xs text-red-600">{fieldErr("full_name")}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Username *</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${fieldErr("username") ? "border-red-400" : "border-gray-300"}`}
              placeholder="janedoe"
            />
            {fieldErr("username") && <p className="mt-1 text-xs text-red-600">{fieldErr("username")}</p>}
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={userEmail}
              disabled
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500"
            />
          </div>

          {/* Headline */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${fieldErr("headline") ? "border-red-400" : "border-gray-300"}`}
              placeholder="Fitness creator with 500K followers"
              maxLength={120}
            />
            <p className="mt-1 text-xs text-gray-500">{headline.length}/120</p>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            maxLength={1000}
            className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${fieldErr("bio") ? "border-red-400" : "border-gray-300"}`}
            placeholder="Tell brands about your content, audience, and what makes you unique..."
          />
          <p className="mt-1 text-xs text-gray-500">{bio.length}/1000</p>
        </div>
      </section>

      {/* ── Location ───────────────────────────────── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Location</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
              placeholder="Los Angeles"
            />
          </div>
        </div>
      </section>

      {/* ── Platforms ──────────────────────────────── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-lg font-semibold text-gray-900">Platforms</h2>
        <p className="mb-4 text-sm text-gray-600">Select the platforms where you create content.</p>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => {
            const active = platforms.includes(p);
            return (
              <button
                key={p}
                type="button"
                onClick={() => togglePlatform(p)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  active
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Follower Count ─────────────────────────── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Audience Size</h2>
        <div className="max-w-xs">
          <label className="mb-1 block text-sm font-medium text-gray-700">Total Followers (across platforms)</label>
          <input
            type="number"
            min={0}
            value={followerCount}
            onChange={(e) => setFollowerCount(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${fieldErr("follower_count") ? "border-red-400" : "border-gray-300"}`}
          />
          {fieldErr("follower_count") && <p className="mt-1 text-xs text-red-600">{fieldErr("follower_count")}</p>}
        </div>
      </section>

      {/* ── Niches ─────────────────────────────────── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-lg font-semibold text-gray-900">Content Niches</h2>
        <p className="mb-4 text-sm text-gray-600">Select the topics you create content about.</p>
        <div className="flex flex-wrap gap-2">
          {NICHES.map((n) => {
            const active = niches.includes(n);
            return (
              <button
                key={n}
                type="button"
                onClick={() => toggleNiche(n)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  active
                    ? "border-purple-600 bg-purple-50 text-purple-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {n}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Social Links ───────────────────────────── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Social Links & Portfolio</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Website */}
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Website / Portfolio</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${fieldErr("website") ? "border-red-400" : "border-gray-300"}`}
              placeholder="https://yourwebsite.com"
            />
            {fieldErr("website") && <p className="mt-1 text-xs text-red-600">{fieldErr("website")}</p>}
          </div>

          {/* YouTube */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">YouTube</label>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${fieldErr("youtube_url") ? "border-red-400" : "border-gray-300"}`}
              placeholder="https://youtube.com/@channel"
            />
            {fieldErr("youtube_url") && <p className="mt-1 text-xs text-red-600">{fieldErr("youtube_url")}</p>}
          </div>

          {/* TikTok */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">TikTok</label>
            <input
              type="url"
              value={tiktokUrl}
              onChange={(e) => setTiktokUrl(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${fieldErr("tiktok_url") ? "border-red-400" : "border-gray-300"}`}
              placeholder="https://tiktok.com/@user"
            />
            {fieldErr("tiktok_url") && <p className="mt-1 text-xs text-red-600">{fieldErr("tiktok_url")}</p>}
          </div>

          {/* Instagram */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Instagram</label>
            <input
              type="url"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${fieldErr("instagram_url") ? "border-red-400" : "border-gray-300"}`}
              placeholder="https://instagram.com/user"
            />
            {fieldErr("instagram_url") && <p className="mt-1 text-xs text-red-600">{fieldErr("instagram_url")}</p>}
          </div>

          {/* Twitter/X */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Twitter / X</label>
            <input
              type="url"
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${fieldErr("twitter_url") ? "border-red-400" : "border-gray-300"}`}
              placeholder="https://x.com/user"
            />
            {fieldErr("twitter_url") && <p className="mt-1 text-xs text-red-600">{fieldErr("twitter_url")}</p>}
          </div>

          {/* LinkedIn */}
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">LinkedIn</label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${fieldErr("linkedin_url") ? "border-red-400" : "border-gray-300"}`}
              placeholder="https://linkedin.com/in/user"
            />
            {fieldErr("linkedin_url") && <p className="mt-1 text-xs text-red-600">{fieldErr("linkedin_url")}</p>}
          </div>
        </div>
      </section>

      {/* ── Visibility ─────────────────────────────── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Public Profile</h2>
            <p className="text-sm text-gray-600">Allow brands to find and view your profile.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            className={`relative h-6 w-11 rounded-full transition-colors ${isPublic ? "bg-blue-600" : "bg-gray-300"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${isPublic ? "translate-x-5" : ""}`}
            />
          </button>
        </div>
      </section>

      {/* ── Submit ─────────────────────────────────── */}
      <div className="flex items-center justify-end gap-4 pb-8">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" fill="currentColor" className="opacity-75" />
              </svg>
              Saving...
            </span>
          ) : (
            "Save Profile"
          )}
        </button>
      </div>
    </form>
  );
}
