"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateApplicationStatus } from "@/lib/actions/applications";

interface Props {
  applicationId: string;
  currentStatus: string;
}

export function ApplicantActions({ applicationId, currentStatus }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleStatus(status: "under_review" | "accepted" | "rejected") {
    console.log("[ApplicantActions] handleStatus called with:", status);
    console.log("[ApplicantActions] Application ID:", applicationId);
    
    setLoading(true);
    try {
      const result = await updateApplicationStatus(applicationId, status);
      console.log("[ApplicantActions] Server action result:", result);
      
      if (result.success) {
        console.log("[ApplicantActions] Refreshing router...");
        router.refresh();
      } else {
        console.log("[ApplicantActions] Error:", result.error);
        alert(result.error);
      }
    } catch (error) {
      console.error("[ApplicantActions] Exception:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (currentStatus === "accepted" || currentStatus === "rejected" || currentStatus === "withdrawn") {
    return null;
  }

  return (
    <div className="flex items-center gap-1 shrink-0">
      {currentStatus === "pending" && (
        <button
          type="button"
          onClick={() => handleStatus("under_review")}
          disabled={loading}
          className="rounded-lg border border-purple-200 px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-50 disabled:opacity-50"
        >
          {loading ? "..." : "Review"}
        </button>
      )}
      <button
        type="button"
        onClick={() => handleStatus("accepted")}
        disabled={loading}
        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
      >
        Accept
      </button>
      <button
        type="button"
        onClick={() => handleStatus("rejected")}
        disabled={loading}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
