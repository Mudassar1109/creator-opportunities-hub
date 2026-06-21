"use client";

import { useState } from "react";
import { withdrawApplication } from "@/lib/actions/applications";

export function WithdrawButton({ applicationId }: { applicationId: string }) {
  const [withdrawing, setWithdrawing] = useState(false);

  async function handleWithdraw() {
    if (!confirm("Are you sure you want to withdraw this application?")) return;
    setWithdrawing(true);
    const result = await withdrawApplication(applicationId);
    setWithdrawing(false);
    if (!result.success) {
      alert(result.error || "Failed to withdraw application.");
    }
  }

  return (
    <button
      onClick={handleWithdraw}
      disabled={withdrawing}
      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {withdrawing ? "..." : "Withdraw"}
    </button>
  );
}
