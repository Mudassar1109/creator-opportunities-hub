import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Creator Opportunities Hub | Find Brand Deals, Sponsorships & Creator Jobs",
  description:
    "Discover sponsorships, affiliate programs, brand deals, collaborations and creator jobs from companies worldwide. The #1 platform for content creators to find paid opportunities.",
  keywords: [
    "creator opportunities",
    "brand deals",
    "sponsorships",
    "affiliate programs",
    "influencer marketing",
    "creator jobs",
    "UGC opportunities",
    "ambassador programs",
    "content creator",
    "YouTuber",
    "TikTok creator",
    "Instagram creator",
    "streamer",
    "blogger",
    "freelancer",
    "remote creator work",
    "paid campaigns",
    "collaboration requests",
  ],
  authors: [{ name: "Creator Opportunities Hub" }],
  creator: "Creator Opportunities Hub",
  publisher: "Creator Opportunities Hub",
  openGraph: {
    title: "Creator Opportunities Hub | Find Brand Deals, Sponsorships & Creator Jobs",
    description:
      "Discover sponsorships, affiliate programs, brand deals, collaborations and creator jobs from companies worldwide.",
    url: "https://creatoropportunitieshub.com",
    siteName: "Creator Opportunities Hub",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Creator Opportunities Hub | Find Brand Deals, Sponsorships & Creator Jobs",
    description:
      "Discover sponsorships, affiliate programs, brand deals, collaborations and creator jobs from companies worldwide.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
