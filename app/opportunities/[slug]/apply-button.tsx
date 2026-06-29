"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApplyModal } from "@/components/apply-modal";
import { createClient } from "@/lib/supabase/client";

interface ApplyButtonProps {
  opportunityId: string;
  opportunityTitle: string;
  isActive: boolean;
  slug: string;
}

export function ApplyButton({ opportunityId, opportunityTitle, isActive, slug }: ApplyButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  async function handleApplyClick() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/login?redirect=/opportunities/${slug}`);
      return;
    }
    setModalOpen(true);
  }

  if (isActive) {
    return (
      <>
        <button
          onClick={handleApplyClick}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Apply Now
        </button>
        <p className="mt-2 text-center text-xs font-medium text-slate-500">
          Submit your application to this opportunity
        </p>
        <ApplyModal
          opportunityId={opportunityId}
          opportunityTitle={opportunityTitle}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <button
        disabled
        className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-slate-100 px-6 py-3 text-sm font-bold text-slate-400"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Applications Closed
      </button>
      <p className="mt-2 text-center text-xs font-medium text-slate-500">
        This opportunity is no longer accepting applications
      </p>
    </>
  );
}
