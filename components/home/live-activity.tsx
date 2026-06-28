"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ActivityItem {
  id: string;
  type: "opportunity_posted" | "application_submitted" | "brand_joined";
  title: string;
  subtitle: string;
  time: string;
  icon: string;
  color: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function getOpportunityIcon(type: string): { icon: string; color: string } {
  const map: Record<string, { icon: string; color: string }> = {
    brand_deal: { icon: "🤝", color: "from-blue-500/20 to-blue-600/20 border-blue-200" },
    sponsorship: { icon: "🎯", color: "from-indigo-500/20 to-indigo-600/20 border-indigo-200" },
    ugc: { icon: "🎬", color: "from-pink-500/20 to-pink-600/20 border-pink-200" },
    creator_job: { icon: "💼", color: "from-emerald-500/20 to-emerald-600/20 border-emerald-200" },
    affiliate_program: { icon: "🔗", color: "from-indigo-500/20 to-indigo-600/20 border-indigo-200" },
    collaboration: { icon: "🤜", color: "from-amber-500/20 to-amber-600/20 border-amber-200" },
    ambassador_program: { icon: "⭐", color: "from-rose-500/20 to-rose-600/20 border-rose-200" },
    remote_work: { icon: "🌍", color: "from-cyan-500/20 to-cyan-600/20 border-cyan-200" },
    paid_campaign: { icon: "📢", color: "from-violet-500/20 to-violet-600/20 border-violet-200" },
  };
  return map[type] ?? { icon: "📌", color: "from-slate-500/20 to-slate-600/20 border-slate-200" };
}

interface RawOpportunity {
  id: string;
  title: string;
  opportunity_type: string;
  published_at: string | null;
  brands: { company_name: string } | null;
}

interface RawApplication {
  id: string;
  created_at: string;
  opportunities: { title: string } | null;
  profiles: { full_name: string } | null;
}

interface RawBrand {
  id: string;
  company_name: string;
  created_at: string;
  industry: string | null;
}

interface LiveActivityProps {
  initialOpportunities: RawOpportunity[];
  initialApplications: RawApplication[];
  initialBrands: RawBrand[];
}

function buildActivityItems(
  opps: RawOpportunity[],
  apps: RawApplication[],
  brands: RawBrand[]
): ActivityItem[] {
  const items: ActivityItem[] = [];

  opps.forEach((o) => {
    if (!o.published_at) return;
    const { icon, color } = getOpportunityIcon(o.opportunity_type);
    items.push({
      id: `opp-${o.id}`,
      type: "opportunity_posted",
      title: `${o.brands?.company_name ?? "A brand"} posted an opportunity`,
      subtitle: o.title,
      time: timeAgo(o.published_at),
      icon,
      color,
    });
  });

  apps.forEach((a) => {
    items.push({
      id: `app-${a.id}`,
      type: "application_submitted",
      title: `${a.profiles?.full_name ?? "A creator"} applied`,
      subtitle: a.opportunities?.title ?? "an opportunity",
      time: timeAgo(a.created_at),
      icon: "✉️",
      color: "from-cyan-500/20 to-cyan-600/20 border-cyan-200",
    });
  });

  brands.forEach((b) => {
    items.push({
      id: `brand-${b.id}`,
      type: "brand_joined",
      title: `${b.company_name} joined the platform`,
      subtitle: b.industry ?? "New brand partner",
      time: timeAgo(b.created_at),
      icon: "🏢",
      color: "from-emerald-500/20 to-emerald-600/20 border-emerald-200",
    });
  });

  // Sort by recency
  return items.sort((a, b) => {
    const rank = (t: string) => {
      if (t === "Just now") return 0;
      if (t.endsWith("m ago")) return parseInt(t);
      if (t.endsWith("h ago")) return parseInt(t) * 60 + 1000;
      return parseInt(t) * 1440 + 100000;
    };
    return rank(a.time) - rank(b.time);
  }).slice(0, 10);
}

export function LiveActivity({ initialOpportunities, initialApplications, initialBrands }: LiveActivityProps) {
  const [items, setItems] = useState<ActivityItem[]>(() =>
    buildActivityItems(initialOpportunities, initialApplications, initialBrands)
  );

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("homepage-activity")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "opportunities", filter: "status=eq.active" },
        async (payload) => {
          const newOpp = payload.new as RawOpportunity;
          const { data: brand } = await supabase
            .from("brands")
            .select("company_name")
            .eq("id", (payload.new as { brand_id: string }).brand_id)
            .single();

          const { icon, color } = getOpportunityIcon(newOpp.opportunity_type);
          const newItem: ActivityItem = {
            id: `opp-${newOpp.id}`,
            type: "opportunity_posted",
            title: `${brand?.company_name ?? "A brand"} posted an opportunity`,
            subtitle: newOpp.title,
            time: "Just now",
            icon,
            color,
          };
          setItems((prev) => [newItem, ...prev].slice(0, 10));
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "applications" },
        async (payload) => {
          const newApp = payload.new as { id: string; opportunity_id: string; creator_id: string };
          const [{ data: opp }, { data: profile }] = await Promise.all([
            supabase.from("opportunities").select("title").eq("id", newApp.opportunity_id).single(),
            supabase.from("profiles").select("full_name").eq("id", newApp.creator_id).single(),
          ]);
          const newItem: ActivityItem = {
            id: `app-${newApp.id}`,
            type: "application_submitted",
            title: `${profile?.full_name ?? "A creator"} applied`,
            subtitle: opp?.title ?? "an opportunity",
            time: "Just now",
            icon: "✉️",
            color: "from-cyan-500/20 to-cyan-600/20 border-cyan-200",
          };
          setItems((prev) => [newItem, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-12 text-center">
        <span className="text-3xl" aria-hidden="true">📭</span>
        <p className="mt-3 text-sm font-medium text-slate-500">No activity yet — be the first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3" role="feed" aria-label="Live platform activity">
      {items.map((item, i) => (
        <div
          key={item.id}
          className={`animate-fade-up animate-fade-up-delay-${Math.min(i + 1, 6)} flex items-center gap-4 rounded-xl border bg-gradient-to-r p-3.5 transition hover:shadow-sm ${item.color}`}
          role="article"
        >
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 text-lg shadow-sm"
            aria-hidden="true"
          >
            {item.icon}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900 leading-tight">{item.title}</p>
            <p className="mt-0.5 truncate text-xs text-slate-500">{item.subtitle}</p>
          </div>
          <span className="shrink-0 text-xs font-medium text-slate-400 tabular-nums">{item.time}</span>
          {item.time === "Just now" && (
            <span
              className="animate-live-pulse h-2 w-2 shrink-0 rounded-full bg-emerald-500"
              aria-label="New activity"
            />
          )}
        </div>
      ))}
    </div>
  );
}
