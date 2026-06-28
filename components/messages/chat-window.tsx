"use client";

import { MessageBubble } from "./message-bubble";
import type { ChatListConversation } from "./chat-list";

interface MessageData {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

interface ChatWindowProps {
  conversation: ChatListConversation | null;
  messages: MessageData[];
  currentUserId: string;
  onBack: () => void;
  loading?: boolean;
}

export function ChatWindow({
  conversation,
  messages,
  currentUserId,
  onBack,
  loading,
}: ChatWindowProps) {
  if (!conversation) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-900/30 dark:to-cyan-900/30">
            <svg
              className="h-8 w-8 text-purple-500 dark:text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          </div>
          <h3 className="mt-4 text-sm font-bold text-gray-900 dark:text-gray-100">
            Select a conversation
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Choose a conversation from the list to start messaging.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 p-4">
        <button
          onClick={onBack}
          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-gray-800 sm:hidden"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 text-xs font-bold text-white">
          {conversation.otherPartyName[0]?.toUpperCase() ?? "?"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
            {conversation.otherPartyName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {conversation.opportunityTitle}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-[10px] text-gray-400 dark:text-gray-600">connected</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`flex gap-3 ${i % 2 === 1 ? "flex-row-reverse" : ""}`}>
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                <div
                  className={`h-10 animate-pulse rounded-2xl ${
                    i % 2 === 1 ? "w-48" : "w-64"
                  } bg-gray-200 dark:bg-gray-700`}
                />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg.message}
              timestamp={msg.created_at}
              isOwn={msg.sender_id === currentUserId}
            />
          ))
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            disabled
            className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 opacity-60 cursor-not-allowed"
          />
          <button
            disabled
            className="shrink-0 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-2.5 text-sm font-bold text-white opacity-60 cursor-not-allowed"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-600">
          <span>Reply</span>
          <div className="flex items-center gap-3">
            <button disabled className="opacity-60 cursor-not-allowed hover:text-purple-600 dark:hover:text-purple-400 transition">
              Archive
            </button>
            <button disabled className="opacity-60 cursor-not-allowed hover:text-red-600 dark:hover:text-red-400 transition">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
