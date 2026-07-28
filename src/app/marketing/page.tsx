import React from "react";
import { Metadata } from "next";

import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { MarketingFeatures } from "@/components/marketing/MarketingFeatures";
import { MarketingHowItWorks } from "@/components/marketing/MarketingHowItWorks";
import { MarketingEducationCategories } from "@/components/marketing/MarketingEducationCategories";
import { MarketingStatistics } from "@/components/marketing/MarketingStatistics";
import { MarketingPlatformPreview } from "@/components/marketing/MarketingPlatformPreview";
import { MarketingWhyUs } from "@/components/marketing/MarketingWhyUs";
import { MarketingFAQ } from "@/components/marketing/MarketingFAQ";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const metadata: Metadata = {
  title: "SientoOps - YouTube'da Başarıya Giden Yol",
  description: "Sıfırdan profesyonelliğe uzanan video eğitimleri, PDF rehberleri ve uygulamalı workshoplarla içerik üreticiliğini öğrenin.",
  keywords: ["youtube eğitimi", "içerik üreticiliği", "video düzenleme", "youtube seo", "kanal kurulumu"],
  openGraph: {
    title: "SientoOps - YouTube'da Başarıya Giden Yol",
    description: "Sıfırdan profesyonelliğe uzanan video eğitimleri, PDF rehberleri ve uygulamalı workshoplarla içerik üreticiliğini öğrenin.",
    type: "website",
    locale: "tr_TR",
    url: "https://sientoops.com",
    images: [
      {
        url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200&h=630&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "SientoOps Academy Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SientoOps - YouTube'da Başarıya Giden Yol",
    description: "Sıfırdan profesyonelliğe uzanan video eğitimleri, PDF rehberleri ve uygulamalı workshoplarla içerik üreticiliğini öğrenin.",
    images: ["https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200&h=630&auto=format&fit=crop"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function MarketingLandingPage() {
  return (
    <div className="dark min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <MarketingNavbar />
      
      <main>
        <MarketingHero />
        <MarketingFeatures />
        <MarketingHowItWorks />
        <MarketingEducationCategories />
        <MarketingStatistics />
        <MarketingPlatformPreview />
        <MarketingWhyUs />
        <MarketingFAQ />
        <MarketingCTA />
      </main>

      <MarketingFooter />
    </div>
  );
}
