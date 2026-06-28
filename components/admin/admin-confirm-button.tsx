"use client";

import { useState } from "react";

interface Props {
  label: string;
  variant?: "default" | "danger";
  onConfirm?: () => void;
  confirmLabel?: string;
  confirmDescription?: string;
  disabled?: boolean;
}

export function AdminConfirmButton({
  label,
  variant = "default",
  onConfirm,
  confirmLabel = "Confirm",
  confirmDescription = "Are you sure you want to perform this action?",
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm?.();
    setOpen(false);
  };

  const baseClass =
    "rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors";
  const defaultClass =
    "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800";
  const dangerClass =
    "border-red-200 dark:border-red-900/30 bg-white dark:bg-gray-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20";

  return (
    <>
      <button
        disabled={disabled}
        onClick={() => setOpen(true)}
        className={`${baseClass} ${variant === "danger" ? dangerClass : defaultClass} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-xl">
            <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
              variant === "danger"
                ? "bg-red-50 dark:bg-red-900/20"
                : "bg-purple-50 dark:bg-purple-900/20"
            }`}>
              {variant === "danger" ? (
                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              ) : (
                <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              )}
            </div>
            <h3 className="text-center text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{confirmLabel}</h3>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">{confirmDescription}</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition ${
                  variant === "danger"
                    ? "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-red-900/30"
                    : "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 dark:shadow-purple-900/30"
                }`}
              >
                {label}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
