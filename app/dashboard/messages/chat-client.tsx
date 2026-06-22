"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { sendMessage } from "@/lib/actions/messages";
import type { User } from "@supabase/supabase-js";

interface ConversationData {
  id: string;
  application_id: string;
  creator_id: string;
  brand_id: string;
  created_at: string;
  opportunity_title: string;
  other_party_name: string;
  last_message: string | null;
  last_message_time: string | null;
  unread_count: number;
}

interface MessageData {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

export function ChatInterface({ userId }: { userId: string }) {
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Load conversations
  useEffect(() => {
    async function loadConversations() {
      setLoading(true);
      try {
        // Get conversations where user is creator
        const { data: creatorConvs } = await supabase
          .from("conversations")
          .select(`
            id,
            application_id,
            creator_id,
            brand_id,
            created_at,
            applications(opportunity_id, opportunities(title)),
            brands(company_name),
            messages(id, message, sender_id, created_at)
          `)
          .eq("creator_id", userId)
          .order("created_at", { ascending: false });

        // Get conversations where user owns the brand
        const { data: userBrands } = await supabase
          .from("brands")
          .select("id")
          .eq("user_id", userId);

        const brandIds = userBrands?.map((b) => b.id) ?? [];

        let brandConvs: typeof creatorConvs = [];
        if (brandIds.length > 0) {
          const { data } = await supabase
            .from("conversations")
            .select(`
              id,
              application_id,
              creator_id,
              brand_id,
              created_at,
              applications(opportunity_id, creator_id, opportunities(title), profiles(full_name)),
              brands(company_name),
              messages(id, message, sender_id, created_at)
            `)
            .in("brand_id", brandIds)
            .order("created_at", { ascending: false });
          brandConvs = data ?? [];
        }

        // Merge and deduplicate
        const allConvs = [...(creatorConvs ?? []), ...brandConvs];
        const seen = new Set<string>();
        const uniqueConvs = allConvs.filter((c) => {
          if (seen.has(c.id)) return false;
          seen.add(c.id);
          return true;
        });

        // Transform into ConversationData
        const transformed: ConversationData[] = uniqueConvs.map((conv) => {
          const msgs = (conv.messages as MessageData[]) ?? [];
          const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;
          const opp = conv.applications as unknown as {
            opportunities: { title: string };
            profiles?: { full_name: string };
          } | null;
          const brand = conv.brands as unknown as { company_name: string } | null;

          const isCreator = conv.creator_id === userId;
          const otherName = isCreator
            ? (brand?.company_name ?? "Brand")
            : (opp?.profiles?.full_name ?? "Creator");

          return {
            id: conv.id,
            application_id: conv.application_id,
            creator_id: conv.creator_id,
            brand_id: conv.brand_id,
            created_at: conv.created_at,
            opportunity_title: opp?.opportunities?.title ?? "Opportunity",
            other_party_name: otherName,
            last_message: lastMsg?.message ?? null,
            last_message_time: lastMsg?.created_at ?? null,
            unread_count: 0,
          };
        });

        // Sort by last message time (most recent first)
        transformed.sort((a, b) => {
          const aTime = a.last_message_time ?? a.created_at;
          const bTime = b.last_message_time ?? b.created_at;
          return new Date(bTime).getTime() - new Date(aTime).getTime();
        });

        setConversations(transformed);
      } catch (err) {
        console.log("[ChatInterface] Error loading conversations:", err);
      }
      setLoading(false);
    }

    loadConversations();
  }, [userId, supabase]);

  // Load messages when conversation selected
  useEffect(() => {
    if (!selectedConvId) return;
    const convId = selectedConvId;

    async function loadMessages() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", convId)
        .order("created_at", { ascending: true });

      setMessages((data as MessageData[]) ?? []);
    }

    loadMessages();
  }, [selectedConvId, supabase]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!newMessage.trim() || !selectedConvId) return;

    setSending(true);
    const msg = newMessage.trim();
    setNewMessage("");

    // Optimistic update
    const optimisticMsg: MessageData = {
      id: `temp-${Date.now()}`,
      conversation_id: selectedConvId,
      sender_id: userId,
      message: msg,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    const result = await sendMessage(selectedConvId, msg);
    if (!result.success) {
      console.log("[Chat] Send failed:", result.error);
      // Remove optimistic message on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
      setNewMessage(msg); // restore input
    }

    setSending(false);
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

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  const selectedConv = conversations.find((c) => c.id === selectedConvId);

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      {/* Conversation List */}
      <div className={`flex flex-col border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 ${
        selectedConvId ? "hidden sm:flex sm:w-80" : "w-full sm:w-80"
      }`}>
        <div className="border-b border-gray-200 dark:border-gray-800 p-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Conversations</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
              No conversations yet. Conversations start when a brand accepts an application.
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                className={`w-full text-left p-4 border-b border-gray-100 dark:border-gray-800/50 transition hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  selectedConvId === conv.id ? "bg-purple-50 dark:bg-purple-900/20 border-l-2 border-l-purple-500" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                    {conv.other_party_name}
                  </p>
                  {conv.last_message_time && (
                    <span className="shrink-0 text-[10px] text-gray-400 dark:text-gray-600">
                      {timeAgo(conv.last_message_time)}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-purple-600 dark:text-purple-400 font-medium truncate">
                  {conv.opportunity_title}
                </p>
                {conv.last_message && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                    {conv.last_message}
                  </p>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Message Area */}
      <div className={`flex-1 flex flex-col ${!selectedConvId ? "hidden sm:flex" : "flex"}`}>
        {!selectedConvId ? (
          <div className="flex flex-1 items-center justify-center p-8">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-900/30 dark:to-cyan-900/30">
                <svg className="h-8 w-8 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              </div>
              <h3 className="mt-4 text-sm font-bold text-gray-900 dark:text-gray-100">Select a conversation</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Choose a conversation from the list to start messaging.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 p-4">
              <button
                onClick={() => setSelectedConvId(null)}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-gray-800 sm:hidden"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 text-xs font-bold text-white">
                {selectedConv?.other_party_name[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                  {selectedConv?.other_party_name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {selectedConv?.opportunity_title}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.sender_id === userId;
                  return (
                    <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                        isOwn
                          ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      }`}>
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                        <p className={`mt-1 text-[10px] ${isOwn ? "text-purple-200" : "text-gray-400 dark:text-gray-600"}`}>
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 dark:border-gray-800 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
                  disabled={sending}
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !newMessage.trim()}
                  className="shrink-0 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-purple-500/20 transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
