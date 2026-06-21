"use client";

import { useState } from "react";
import { deleteOpportunity, publishOpportunity } from "@/lib/actions/opportunities";

interface Props {
  opportunityId: string;
  status: string;
}

export function OpportunityActions({ opportunityId, status }: Props) {
  const [loading, setLoading] = useState(false);

  async function handlePublish() {
    if (!confirm("Publish this opportunity? It will be visible to all creators.")) return;
    setLoading(true);
    const result = await publishOpportunity(opportunityId);
    setLoading(false);
    if (!result.success) alert(result.error);
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this opportunity? This cannot be undone.")) return;
    setLoading(true);
    const result = await deleteOpportunity(opportunityId);
    setLoading(false);
    if (!result.success) alert(result.error);
  }

  return (
    <div className="flex items-center gap-1">
      {status === "draft" && (
        <button
          onClick={handlePublish}
          disabled={loading}
          className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "..." : "Publish"}
        </button>
      )}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        {loading ? "..." : "Delete"}
      </button>
    </div>
  );
}
