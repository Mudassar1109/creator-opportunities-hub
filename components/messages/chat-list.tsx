"use client";

import { useState, useMemo } from "react";

export interface ChatListConversation {
  id: string;
  otherPartyName: string;
  opportunityTitle: string;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
}

interface ChatListProps {
  conversations: ChatListConversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading?: boolean;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function ChatList({ conversations, selectedId, onSelect, loading }: ChatListProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filtered = useMemo(() => {
    let result = conversations;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.otherPartyName.toLowerCase().includes(q) ||
          c.opportunityTitle.toLowerCase().includes(q) ||
          (c.lastMessage && c.lastMessage.toLowerCase().includes(q))
      );
    }
    if (filter === "unread") {
      result = result.filter((c) => c.unreadCount > 0);
    }
    return result;
  }, [conversations, search, filter]);

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="border-b border-gray-200 dark:border-gray-800 p-3">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800 px-3 py-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
            filter === "all"
              ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
            filter === "unread"
              ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          Unread
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-1 p-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl p-3">
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-3 w-36 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-center">
            <svg
              className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
            </svg>
            <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
              {search || filter === "unread"
                ? "No conversations match your search."
                : "No conversations yet."}
            </p>
          </div>
        ) : (
          filtered.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`w-full text-left border-b border-gray-100 dark:border-gray-800/50 p-4 transition hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                selectedId === conv.id
                  ? "bg-purple-50 dark:bg-purple-900/20 border-l-2 border-l-purple-500"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 text-xs font-bold text-white">
                    {conv.otherPartyName[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                      {conv.otherPartyName}
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium truncate">
                      {conv.opportunityTitle}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  {conv.lastMessageTime && (
                    <span className="text-[10px] text-gray-400 dark:text-gray-600">
                      {timeAgo(conv.lastMessageTime)}
                    </span>
                  )}
                  {conv.unreadCount > 0 && (
                    <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                      {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
              {conv.lastMessage && (
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 truncate pl-13">
                  {conv.lastMessage}
                </p>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
