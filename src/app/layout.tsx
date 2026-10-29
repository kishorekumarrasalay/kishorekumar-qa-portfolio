import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import QaAssistant from "@/components/QaAssistant";
import SiteControls from "@/components/SiteControls";
import ThemeProvider from "@/components/ThemeProvider";
import { portfolioData } from "@/data/portfolio";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  preload: true,
});

const { site, social } = portfolioData;

const SITE_URL = "https://kishorekumarrasalay-02.vercel.app";
const OG_IMAGE = `${SITE_URL}/profile.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: site.meta.title,
    template: `%s | ${site.name}`,
  },
  description: site.meta.description,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: site.meta.title,
    description: site.meta.description,
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    url: SITE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 400,
        height: 400,
        alt: `${site.name} — Manual QA Tester & Aspiring SDET`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.meta.title,
    description: site.meta.description,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Removed maximumScale:1 / userScalable:false to allow pinch-zoom accessibility
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
  ],
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  url: SITE_URL,
  email: social.email,
  sameAs: [social.linkedin, social.github],
  image: OG_IMAGE,
  description: site.meta.description,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hyderabad",
    addressRegion: "Telangana",
    addressCountry: "IN",
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
      className={`${inter.variable} ${sora.variable} scroll-smooth font-sans`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="relative min-h-screen antialiased">
        <ThemeProvider>
          <SiteControls />
          <div className="relative z-10">{children}</div>
          <QaAssistant />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
