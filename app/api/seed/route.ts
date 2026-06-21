/**
 * Seed endpoint — creates test data for the opportunities system.
 * Call GET /api/seed while logged in to populate the database.
 * DELETE THIS FILE after seeding.
 */
import { NextResponse } from "next/server";
import { createClient, getUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "You must be logged in to seed data" }, { status: 401 });
  }

  const supabase = await createClient();
  const results: string[] = [];

  // 1. Create a test brand for the current user
  const { data: existingBrand } = await supabase
    .from("brands")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  let brandId: string;

  if (existingBrand) {
    brandId = existingBrand.id;
    results.push(`Brand already exists: ${brandId}`);
  } else {
    const { data: brand, error: brandErr } = await supabase
      .from("brands")
      .insert({
        user_id: user.id,
        company_name: "CreatorHub Demo",
        slug: "creatorhub-demo",
        website: "https://creatorhub.example.com",
        industry: "Technology",
        description: "Demo brand for testing the CreatorHub marketplace platform.",
        company_size: "medium",
        country: "United States",
        is_active: true,
      })
      .select("id")
      .single();

    if (brandErr) {
      return NextResponse.json({ error: `Brand creation failed: ${brandErr.message}`, results }, { status: 500 });
    }
    brandId = brand.id;
    results.push(`Created brand: ${brandId}`);
  }

  // 2. Fetch category IDs
  const { data: categories } = await supabase.from("categories").select("id, slug");
  const catMap = Object.fromEntries((categories ?? []).map((c) => [c.slug, c.id]));
  results.push(`Found ${categories?.length ?? 0} categories`);

  // 3. Create test opportunities
  const opportunities = [
    {
      title: "Summer Fitness Campaign — Instagram Reels & TikTok",
      slug: `summer-fitness-campaign-${Date.now().toString(36)}`,
      description: "We're looking for fitness creators with engaged audiences to promote our new line of summer workout gear. Create 3 Instagram Reels and 2 TikToks showcasing our products in authentic workout scenarios. Content should feel natural and align with your existing fitness content style. We want creators who genuinely love fitness, not just paid promoters.",
      opportunity_type: "sponsorship" as const,
      budget_min: 2000,
      budget_max: 8000,
      budget_type: "range" as const,
      currency: "USD",
      country: "United States",
      location_type: "remote" as const,
      requirements: "Minimum 10K followers on Instagram or TikTok. Fitness/wellness niche preferred. Must have posted at least 10 fitness-related videos in the last 3 months.",
      deliverables: "3 Instagram Reels (30-60 seconds each), 2 TikTok videos (15-30 seconds each), 5 Instagram Stories with swipe-up links.",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      min_followers: 10000,
      platforms: ["instagram", "tiktok"],
      niches: ["fitness", "wellness", "lifestyle"],
      status: "active" as const,
      is_featured: true,
      is_remote: true,
      published_at: new Date().toISOString(),
      category_slugs: ["sponsorships", "brand-deals"],
    },
    {
      title: "Tech Review YouTube Series — Paid Partnership",
      slug: `tech-review-youtube-${Date.now().toString(36)}`,
      description: "Partner with us for a 4-part YouTube series reviewing the latest productivity software and tools. Each video should be 8-12 minutes with honest, in-depth reviews. We provide early access to all products and a dedicated support contact. This is a long-term partnership opportunity with potential for ongoing monthly collaboration.",
      opportunity_type: "brand_deal" as const,
      budget_min: 5000,
      budget_max: 15000,
      budget_type: "range" as const,
      currency: "USD",
      country: "United States",
      location_type: "remote" as const,
      requirements: "YouTube channel with 50K+ subscribers. Tech/software review niche. Average video views above 10K. Must have posted at least 5 tech reviews in the past 6 months.",
      deliverables: "4 YouTube videos (8-12 min each), 4 community posts, 8 Twitter/X posts promoting the videos.",
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      min_followers: 50000,
      platforms: ["youtube", "twitter"],
      niches: ["technology", "software", "productivity"],
      status: "active" as const,
      is_featured: true,
      is_remote: true,
      published_at: new Date().toISOString(),
      category_slugs: ["brand-deals", "sponsorships"],
    },
    {
      title: "Affiliate Program — Sustainable Fashion Brand",
      slug: `affiliate-sustainable-fashion-${Date.now().toString(36)}`,
      description: "Join our affiliate program and earn 25% commission on every sale you drive through your unique referral link. We're a sustainable fashion brand targeting Gen Z and millennials. Our average order value is $85. Top affiliates earn $3,000+/month. No minimum follower count — we care about engagement and authentic recommendations.",
      opportunity_type: "affiliate_program" as const,
      budget_min: null,
      budget_max: null,
      budget_type: "commission" as const,
      currency: "USD",
      country: "United Kingdom",
      location_type: "remote" as const,
      requirements: "Active social media presence. Must create authentic content featuring our products. No follower minimum, but engagement rate must be above 3%.",
      deliverables: "Minimum 2 posts per month featuring our products with affiliate link. At least 1 story or reel per week.",
      deadline: null,
      min_followers: 0,
      platforms: ["instagram", "tiktok", "youtube"],
      niches: ["fashion", "sustainability", "lifestyle"],
      status: "active" as const,
      is_featured: true,
      is_remote: true,
      published_at: new Date().toISOString(),
      category_slugs: ["affiliate-programs", "brand-deals"],
    },
    {
      title: "UGC Creator Needed — Skincare Product Launch",
      slug: `ugc-skincare-launch-${Date.now().toString(36)}`,
      description: "We need UGC creators for our upcoming skincare product launch. Create authentic, relatable content showing your skincare routine incorporating our new serum. Content will be used across our paid ads and organic channels. You don't need to post on your own channels — we just need the raw content files.",
      opportunity_type: "ugc" as const,
      budget_min: 500,
      budget_max: 2000,
      budget_type: "range" as const,
      currency: "USD",
      country: "United States",
      location_type: "remote" as const,
      requirements: "Experience creating UGC or beauty/skincare content. Must have good lighting and camera quality. Ability to deliver edited videos within 2 weeks.",
      deliverables: "5 short-form videos (15-30 seconds each), 10 high-quality photos, raw footage of application routine.",
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      min_followers: 0,
      platforms: ["tiktok", "instagram"],
      niches: ["beauty", "skincare", "lifestyle"],
      status: "active" as const,
      is_featured: false,
      is_remote: true,
      published_at: new Date().toISOString(),
      category_slugs: ["ugc-jobs"],
    },
    {
      title: "Brand Ambassador — Premium Coffee Company",
      slug: `ambassador-coffee-${Date.now().toString(36)}`,
      description: "Become the face of our premium single-origin coffee brand. This is a 6-month ambassador program where you'll integrate our coffee into your daily content. Monthly retainer plus free product. We're looking for lifestyle, food, or morning routine creators who can authentically showcase our coffee as part of their daily ritual.",
      opportunity_type: "ambassador_program" as const,
      budget_min: 1500,
      budget_max: 4000,
      budget_type: "monthly" as const,
      currency: "USD",
      country: "Canada",
      location_type: "remote" as const,
      requirements: "20K+ followers on any platform. Lifestyle, food, or morning routine content. Must be willing to commit to 6 months. Must be located in US or Canada.",
      deliverables: "4 posts per month, 8 stories per month, 1 long-form video per quarter. Attend 1 virtual brand event per quarter.",
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      min_followers: 20000,
      platforms: ["instagram", "youtube", "tiktok"],
      niches: ["food", "lifestyle", "morning routine"],
      status: "active" as const,
      is_featured: false,
      is_remote: true,
      published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      category_slugs: ["ambassador-programs", "sponsorships"],
    },
    {
      title: "Remote Video Editor — YouTube Channel",
      slug: `remote-video-editor-${Date.now().toString(36)}`,
      description: "We're a growing educational YouTube channel looking for a part-time remote video editor. You'll edit 2 videos per week (10-15 minutes each) with motion graphics, text overlays, and B-roll integration. Adobe Premiere Pro or DaVinci Resolve experience required. This is an ongoing freelance position, not a one-time project.",
      opportunity_type: "creator_job" as const,
      budget_min: 3000,
      budget_max: 5000,
      budget_type: "monthly" as const,
      currency: "USD",
      country: "United States",
      location_type: "remote" as const,
      requirements: "Proficiency in Adobe Premiere Pro or DaVinci Resolve. Experience editing YouTube videos. Basic motion graphics skills. Reliable internet and ability to meet weekly deadlines.",
      deliverables: "2 fully edited videos per week (10-15 min each), including thumbnails and chapter markers. Turnaround time: 48 hours per video.",
      deadline: null,
      min_followers: 0,
      platforms: ["youtube"],
      niches: ["education", "technology"],
      status: "active" as const,
      is_featured: false,
      is_remote: true,
      published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      category_slugs: ["creator-jobs", "remote-work"],
    },
    {
      title: "Travel Collaboration — Explore Bali with Fellow Creators",
      slug: `travel-collab-bali-${Date.now().toString(36)}`,
      description: "Join a group of 5 travel creators for a 7-day content creation trip through Bali. All expenses covered (flights, accommodation, activities). You'll create content at stunning locations including rice terraces, temples, and hidden beaches. This is a collaboration — you'll work alongside other creators, share techniques, and cross-promote.",
      opportunity_type: "collaboration" as const,
      budget_min: 0,
      budget_max: 0,
      budget_type: "negotiable" as const,
      currency: "USD",
      country: "Indonesia",
      location_type: "on_site" as const,
      requirements: "Travel/lifestyle niche. 30K+ followers. Must be available for 7 days in the specified period. Valid passport required. Comfortable with adventure activities.",
      deliverables: "10 Instagram posts, 15 stories, 2 YouTube vlogs (10+ min), 5 TikToks/Reels during the trip.",
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      min_followers: 30000,
      platforms: ["instagram", "youtube", "tiktok"],
      niches: ["travel", "lifestyle", "adventure"],
      status: "active" as const,
      is_featured: false,
      is_remote: false,
      published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      category_slugs: ["collaborations", "sponsorships"],
    },
    {
      title: "Gaming Sponsorship — Mobile Game Launch Campaign",
      slug: `gaming-sponsorship-mobile-${Date.now().toString(36)}`,
      description: "Sponsorship opportunity for mobile gaming creators. Promote our new RPG mobile game across your channels. We provide early access to the game, exclusive in-game codes for your audience, and a sponsorship fee based on your reach. Content should showcase gameplay, tips, and your genuine reactions.",
      opportunity_type: "sponsorship" as const,
      budget_min: 1000,
      budget_max: 5000,
      budget_type: "range" as const,
      currency: "USD",
      country: "United States",
      location_type: "remote" as const,
      requirements: "Gaming niche with focus on mobile games. Active on Twitch, YouTube, or TikTok. Must have played mobile games in content before.",
      deliverables: "2 gameplay videos, 1 live stream segment (30 min), 3 social media posts with game download link.",
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      min_followers: 5000,
      platforms: ["youtube", "tiktok", "twitch"],
      niches: ["gaming", "mobile gaming", "entertainment"],
      status: "active" as const,
      is_featured: false,
      is_remote: true,
      published_at: new Date().toISOString(),
      category_slugs: ["sponsorships", "brand-deals"],
    },
  ];

  for (const opp of opportunities) {
    const { category_slugs, ...oppData } = opp;

    const { data: inserted, error: oppErr } = await supabase
      .from("opportunities")
      .insert({
        brand_id: brandId,
        created_by: user.id,
        ...oppData,
      })
      .select("id, slug")
      .single();

    if (oppErr) {
      results.push(`FAILED to create "${opp.title}": ${oppErr.message}`);
      continue;
    }

    // Insert category links
    const catIds = category_slugs
      .map((s) => catMap[s])
      .filter(Boolean);

    if (catIds.length > 0) {
      await supabase.from("opportunity_categories").insert(
        catIds.map((catId) => ({
          opportunity_id: inserted.id,
          category_id: catId,
        }))
      );
    }

    results.push(`Created opportunity: "${opp.title}" (${inserted.slug})`);
  }

  // 4. Summary
  const { data: finalOpps } = await supabase.from("opportunities").select("id", { count: "exact" });
  const { data: finalBrands } = await supabase.from("brands").select("id", { count: "exact" });

  return NextResponse.json({
    success: true,
    results,
    summary: {
      total_brands: finalBrands?.length ?? 0,
      total_opportunities: finalOpps?.length ?? 0,
    },
  });
}
