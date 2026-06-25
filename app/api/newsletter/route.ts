import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check for existing subscription
    const { data: existing } = await supabase
      .from("newsletter_subscriptions")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Email already subscribed" },
        { status: 409 }
      );
    }

    // Create new subscription
    const { error } = await supabase.from("newsletter_subscriptions").insert({
      email: email.toLowerCase(),
      subscribed_at: new Date().toISOString(),
      is_active: true,
    });

    if (error) {
      console.error("Error subscribing to newsletter:", error);
      return NextResponse.json(
        { success: false, error: "Failed to subscribe" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
