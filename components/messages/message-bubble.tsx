"use client";

interface MessageBubbleProps {
  message: string;
  timestamp: string;
  isOwn: boolean;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function MessageBubble({ message, timestamp, isOwn }: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
          isOwn
            ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white"
            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message}</p>
        <p
          className={`mt-1 text-[10px] ${
            isOwn ? "text-purple-200" : "text-gray-400 dark:text-gray-600"
          }`}
        >
          {formatTime(timestamp)}
        </p>
      </div>
    </div>
  );
}
