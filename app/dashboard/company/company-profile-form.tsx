"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/database.types";

interface BrandData {
  id: string;
  user_id: string;
  company_name: string;
  slug: string;
  website: string | null;
  industry: string | null;
  description: string | null;
  logo_url: string | null;
  is_active: boolean;
  is_verified: boolean;
}

interface Props {
  brand: BrandData | null;
  profile: Profile | null;
  userEmail: string;
  userId: string;
}

export function CompanyProfileForm({ brand, profile, userEmail, userId }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    company_name: brand?.company_name ?? profile?.full_name ?? "",
    website: brand?.website ?? profile?.website ?? "",
    industry: brand?.industry ?? "",
    description: brand?.description ?? "",
    contact_email: userEmail,
  });

  const completion = (() => {
    const fields = [
      formData.company_name,
      formData.website,
      formData.industry,
      formData.description,
      formData.contact_email,
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  })();

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const supabase = createClient();

    try {
      if (brand) {
        // Update existing brand
        const { error: updateError } = await supabase
          .from("brands")
          .update({
            company_name: formData.company_name,
            website: formData.website || "",
            industry: formData.industry || null,
            description: formData.description || null,
          })
          .eq("id", brand.id);

        if (updateError) throw updateError;
      } else {
        // Create new brand
        const slug = formData.company_name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        const { error: createError } = await supabase
          .from("brands")
          .insert({
            user_id: userId,
            company_name: formData.company_name,
            slug,
            website: formData.website || "",
            industry: formData.industry || null,
            description: formData.description || null,
            is_active: true,
          });

        if (createError) throw createError;
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save company profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Completion bar */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Profile Completion</span>
          <span className="text-sm font-bold text-purple-600">{completion}%</span>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 transition-all duration-700 ease-out"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-gray-900">Company Information</h2>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.company_name}
              onChange={(e) => updateField("company_name", e.target.value)}
              placeholder="e.g. Nike, Gymshark, MyBrand"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => updateField("website", e.target.value)}
              placeholder="https://yourbrand.com"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Industry</label>
            <select
              value={formData.industry}
              onChange={(e) => updateField("industry", e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              <option value="">Select industry</option>
              <option value="fashion">Fashion & Apparel</option>
              <option value="beauty">Beauty & Cosmetics</option>
              <option value="tech">Technology</option>
              <option value="fitness">Fitness & Health</option>
              <option value="food">Food & Beverage</option>
              <option value="travel">Travel & Lifestyle</option>
              <option value="gaming">Gaming & Esports</option>
              <option value="education">Education</option>
              <option value="finance">Finance</option>
              <option value="entertainment">Entertainment</option>
              <option value="ecommerce">E-commerce</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe your brand, products, and what you're looking for in creators..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
            />
          </div>

          {/* Contact Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
            <input
              type="email"
              value={formData.contact_email}
              onChange={(e) => updateField("contact_email", e.target.value)}
              placeholder="contact@yourbrand.com"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        </div>

        {/* Status messages */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-medium text-green-700">Company profile saved successfully!</p>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading || !formData.company_name}
            className="rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? "Saving..." : brand ? "Update Company" : "Create Company"}
          </button>
        </div>
      </form>
    </div>
  );
}
