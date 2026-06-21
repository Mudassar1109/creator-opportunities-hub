"use client";

import { useState } from "react";
import { updateApplicationStatus } from "@/lib/actions/applications";

interface Props {
  applicationId: string;
  currentStatus: string;
}

export function ApplicantActions({ applicationId, currentStatus }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleStatus(status: "under_review" | "accepted" | "rejected") {
    setLoading(true);
    const result = await updateApplicationStatus(applicationId, status);
    setLoading(false);
    if (!result.success) alert(result.error);
  }

  if (currentStatus === "accepted" || currentStatus === "rejected" || currentStatus === "withdrawn") {
    return null;
  }

  return (
    <div className="flex items-center gap-1 shrink-0">
      {currentStatus === "pending" && (
        <button
          onClick={() => handleStatus("under_review")}
          disabled={loading}
          className="rounded-lg border border-purple-200 px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-50 disabled:opacity-50"
        >
          {loading ? "..." : "Review"}
        </button>
      )}
      <button
        onClick={() => handleStatus("accepted")}
        disabled={loading}
        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
      >
        Accept
      </button>
      <button
        onClick={() => handleStatus("rejected")}
        disabled={loading}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
