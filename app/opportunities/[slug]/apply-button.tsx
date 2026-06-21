"use client";

import { useState } from "react";
import { ApplyModal } from "@/components/apply-modal";

interface ApplyButtonProps {
  opportunityId: string;
  opportunityTitle: string;
  isActive: boolean;
}

export function ApplyButton({ opportunityId, opportunityTitle, isActive }: ApplyButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {isActive ? (
        <>
          <button
            onClick={() => setModalOpen(true)}
            className="w-full rounded-lg bg-purple-600 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Apply Now
          </button>
          <p className="mt-2 text-center text-xs text-gray-500">
            Submit your application to this opportunity
          </p>
          <ApplyModal
            opportunityId={opportunityId}
            opportunityTitle={opportunityTitle}
            open={modalOpen}
            onClose={() => setModalOpen(false)}
          />
        </>
      ) : (
        <>
          <button disabled className="w-full rounded-lg bg-gray-200 py-3 text-sm font-semibold text-gray-500 cursor-not-allowed">
            Applications Closed
          </button>
          <p className="mt-2 text-center text-xs text-gray-500">
            This opportunity is no longer accepting applications
          </p>
        </>
      )}
    </>
  );
}
