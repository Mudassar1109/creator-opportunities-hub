"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOpportunity, updateOpportunity, type OpportunityFormData } from "@/lib/actions/opportunities";
import type { OpportunityType, BudgetType, LocationType } from "@/lib/database.types";

interface Props {
  brands: { id: string; company_name: string }[];
  categories: { id: string; name: string; slug: string }[];
  initialData?: Partial<OpportunityFormData> & { category_ids?: string[] };
  opportunityId?: string;
}

const OPPORTUNITY_TYPES: OpportunityType[] = [
  "brand_deal", "affiliate_program", "sponsorship", "ugc", "creator_job",
  "collaboration", "ambassador_program", "remote_work", "paid_campaign",
];

const BUDGET_TYPES: BudgetType[] = ["fixed", "range", "commission", "hourly", "monthly", "negotiable"];
const LOCATION_TYPES: LocationType[] = ["remote", "on_site", "hybrid"];

const PLATFORM_OPTIONS = ["YouTube", "TikTok", "Instagram", "Twitter/X", "Twitch", "LinkedIn", "Blog", "Podcast", "Facebook", "Threads"];
const NICHE_OPTIONS = ["Tech", "Beauty", "Fitness", "Gaming", "Food", "Travel", "Fashion", "Finance", "Education", "Lifestyle", "Health", "Sports", "Music", "Comedy", "Business"];

export function OpportunityForm({ brands, categories, initialData, opportunityId }: Props) {
  const router = useRouter();
  const isEditing = !!opportunityId;

  const [form, setForm] = useState({
    brand_id: initialData?.brand_id || brands[0]?.id || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    opportunity_type: initialData?.opportunity_type || "brand_deal",
    budget_min: initialData?.budget_min?.toString() || "",
    budget_max: initialData?.budget_max?.toString() || "",
    budget_type: initialData?.budget_type || "fixed",
    currency: initialData?.currency || "USD",
    country: initialData?.country || "",
    location_type: initialData?.location_type || "remote",
    requirements: initialData?.requirements || "",
    deliverables: initialData?.deliverables || "",
    deadline: initialData?.deadline || "",
    min_followers: initialData?.min_followers?.toString() || "0",
    platforms: initialData?.platforms || [],
    niches: initialData?.niches || [],
    is_featured: initialData?.is_featured || false,
    is_remote: initialData?.is_remote ?? true,
    category_ids: initialData?.category_ids || [],
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleArrayItem(field: "platforms" | "niches" | "category_ids", item: string) {
    setForm((prev) => {
      const arr = prev[field] as string[];
      return { ...prev, [field]: arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item] };
    });
  }

  async function handleSubmit(status: "draft" | "active") {
    setError("");
    setSubmitting(true);

    const data: OpportunityFormData = {
      brand_id: form.brand_id,
      title: form.title,
      description: form.description,
      opportunity_type: form.opportunity_type as OpportunityType,
      budget_min: form.budget_min ? Number(form.budget_min) : null,
      budget_max: form.budget_max ? Number(form.budget_max) : null,
      budget_type: form.budget_type as BudgetType,
      currency: form.currency,
      country: form.country,
      location_type: form.location_type as LocationType,
      requirements: form.requirements,
      deliverables: form.deliverables,
      deadline: form.deadline,
      min_followers: Number(form.min_followers) || 0,
      platforms: form.platforms,
      niches: form.niches,
      is_featured: form.is_featured,
      is_remote: form.is_remote,
      category_ids: form.category_ids,
      status,
    };

    let result;
    if (isEditing) {
      result = await updateOpportunity(opportunityId, data);
    } else {
      result = await createOpportunity(data);
    }

    setSubmitting(false);

    if (result.success) {
      router.push("/dashboard/opportunities");
    } else {
      setError(result.error || "Something went wrong.");
    }
  }

  const inputClass = "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Brand */}
      <div>
        <label className={labelClass}>Brand</label>
        <select value={form.brand_id} onChange={(e) => update("brand_id", e.target.value)} className={inputClass}>
          {brands.map((b) => <option key={b.id} value={b.id}>{b.company_name}</option>)}
        </select>
      </div>

      {/* Title */}
      <div>
        <label className={labelClass}>Title *</label>
        <input type="text" value={form.title} onChange={(e) => update("title", e.target.value)} className={inputClass} placeholder="e.g., Summer Campaign for Fitness Brand" required />
      </div>

      {/* Type */}
      <div>
        <label className={labelClass}>Opportunity Type</label>
        <select value={form.opportunity_type} onChange={(e) => update("opportunity_type", e.target.value)} className={inputClass}>
          {OPPORTUNITY_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description *</label>
        <textarea rows={5} value={form.description} onChange={(e) => update("description", e.target.value)} className={inputClass + " resize-none"} placeholder="Describe the opportunity in detail..." required />
      </div>

      {/* Budget */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <label className={labelClass}>Budget Type</label>
          <select value={form.budget_type} onChange={(e) => update("budget_type", e.target.value)} className={inputClass}>
            {BUDGET_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Min Budget</label>
          <input type="number" value={form.budget_min} onChange={(e) => update("budget_min", e.target.value)} className={inputClass} placeholder="0" />
        </div>
        <div>
          <label className={labelClass}>Max Budget</label>
          <input type="number" value={form.budget_max} onChange={(e) => update("budget_max", e.target.value)} className={inputClass} placeholder="0" />
        </div>
        <div>
          <label className={labelClass}>Currency</label>
          <select value={form.currency} onChange={(e) => update("currency", e.target.value)} className={inputClass}>
            {["USD", "EUR", "GBP", "CAD", "AUD", "INR", "JPY", "SGD", "AED"].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Location */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Country</label>
          <input type="text" value={form.country} onChange={(e) => update("country", e.target.value)} className={inputClass} placeholder="United States" />
        </div>
        <div>
          <label className={labelClass}>Location Type</label>
          <select value={form.location_type} onChange={(e) => update("location_type", e.target.value)} className={inputClass}>
            {LOCATION_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Min Followers</label>
          <input type="number" value={form.min_followers} onChange={(e) => update("min_followers", e.target.value)} className={inputClass} placeholder="0" />
        </div>
      </div>

      {/* Deadline */}
      <div>
        <label className={labelClass}>Deadline</label>
        <input type="date" value={form.deadline} onChange={(e) => update("deadline", e.target.value)} className={inputClass} />
      </div>

      {/* Requirements */}
      <div>
        <label className={labelClass}>Requirements</label>
        <textarea rows={3} value={form.requirements} onChange={(e) => update("requirements", e.target.value)} className={inputClass + " resize-none"} placeholder="What do creators need to qualify?" />
      </div>

      {/* Deliverables */}
      <div>
        <label className={labelClass}>Deliverables</label>
        <textarea rows={3} value={form.deliverables} onChange={(e) => update("deliverables", e.target.value)} className={inputClass + " resize-none"} placeholder="What content does the creator need to produce?" />
      </div>

      {/* Platforms */}
      <div>
        <label className={labelClass}>Platforms Required</label>
        <div className="flex flex-wrap gap-2">
          {PLATFORM_OPTIONS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => toggleArrayItem("platforms", p)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                form.platforms.includes(p) ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Niches */}
      <div>
        <label className={labelClass}>Target Niches</label>
        <div className="flex flex-wrap gap-2">
          {NICHE_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => toggleArrayItem("niches", n)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                form.niches.includes(n) ? "bg-cyan-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className={labelClass}>Categories</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleArrayItem("category_ids", c.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                form.category_ids.includes(c.id) ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_remote} onChange={(e) => update("is_remote", e.target.checked)} className="rounded border-gray-300" />
          Remote friendly
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_featured} onChange={(e) => update("is_featured", e.target.checked)} className="rounded border-gray-300" />
          Featured listing
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => handleSubmit("draft")}
          disabled={submitting || !form.title || !form.description}
          className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save as Draft"}
        </button>
        <button
          type="button"
          onClick={() => handleSubmit("active")}
          disabled={submitting || !form.title || !form.description}
          className="flex-1 rounded-lg bg-purple-600 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
        >
          {submitting ? "Publishing..." : isEditing ? "Update & Publish" : "Publish Now"}
        </button>
      </div>
    </div>
  );
}
