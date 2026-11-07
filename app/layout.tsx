import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { CursorGlow } from "@/components/ui/cursor-glow";
import { HOURS, LOCATIONS, SITE } from "@/lib/site";

const syne = localFont({
  src: "../public/fonts/Syne-Variable.woff2",
  variable: "--font-syne",
  weight: "400 800",
  display: "swap",
  preload: true
});

const spaceGrotesk = localFont({
  src: "../public/fonts/SpaceGrotesk-Variable.woff2",
  variable: "--font-space",
  weight: "300 700",
  display: "swap",
  preload: true
});

const plexMono = localFont({
  src: [
    { path: "../public/fonts/IBMPlexMono-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/IBMPlexMono-500.woff2", weight: "500", style: "normal" }
  ],
  variable: "--font-plex",
  display: "swap",
  preload: false
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://motorcityautospa.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Motor City Auto Spa — Ceramic Coating & Paint Protection | Royal Oak, MI",
    template: "%s | Motor City Auto Spa"
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: siteUrl }],
  generator: "Next.js",
  keywords: [
    "ceramic coating Royal Oak",
    "XPEL paint protection film Detroit",
    "Icon Rocklear Michigan",
    "Opti-Coat Pro Royal Oak",
    "dry ice undercarriage blasting",
    "paint correction Royal Oak",
    "window tinting Royal Oak MI",
    "auto detailing Royal Oak",
    "Motor City Auto Spa"
  ],
  category: "automotive",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: SITE.name,
    title: "Motor City Auto Spa — Uncompromising Automotive Perfection",
    description:
      "Icon Rocklear composite coating, XPEL paint protection film, Opti-Coat Pro ceramic and dry ice underbody restoration. Two Royal Oak, Michigan studios.",
    images: [
      {
        url: "/media/hero-poster.jpg",
        width: 1280,
        height: 720,
        alt: "Water beading on a ceramic-coated black paint surface at Motor City Auto Spa"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Motor City Auto Spa — Royal Oak, MI",
    description:
      "Paint protection, ceramic coating and concours-level correction. Two Royal Oak studios. Factory-trained XPEL installers.",
    images: ["/media/hero-poster.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 }
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }]
  }
};

export const viewport: Viewport = {
  themeColor: "#0D0E10",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDetailing",
  "@id": `${siteUrl}/#business`,
  name: SITE.name,
  alternateName: "Motor City AutoSpa",
  description: SITE.description,
  url: siteUrl,
  telephone: SITE.phone,
  email: SITE.email,
  image: `${siteUrl}/media/hero-poster.jpg`,
  logo: `${siteUrl}/icon.svg`,
  priceRange: "$$$",
  currenciesAccepted: "USD",
  paymentAccepted: "Cash, Credit Card, Debit Card",
  address: {
    "@type": "PostalAddress",
    streetAddress: LOCATIONS[0].address,
    addressLocality: "Royal Oak",
    addressRegion: "MI",
    postalCode: LOCATIONS[0].postalCode,
    addressCountry: "US"
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: LOCATIONS[0].latitude,
    longitude: LOCATIONS[0].longitude
  },
  areaServed: ["Royal Oak", "Birmingham", "Troy", "Ferndale", "Detroit", "Bloomfield Hills"],
  openingHoursSpecification: HOURS.filter((day) => day.open).map((day) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: day.day,
    opens: day.open,
    closes: day.close
  })),
  sameAs: [SITE.social.instagram, SITE.social.facebook],
  department: LOCATIONS.map((location) => ({
    "@type": "AutoDetailing",
    name: location.name,
    telephone: location.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: location.address,
      addressLocality: location.city,
      addressRegion: location.state,
      postalCode: location.postalCode,
      addressCountry: "US"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: location.latitude,
      longitude: location.longitude
    },
    openingHoursSpecification: HOURS.filter((day) => day.open).map((day) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: day.day,
      opens: day.open,
      closes: day.close
    }))
  })),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Paint Protection & Detailing",
    itemListElement: [
      "Icon Rocklear Composite Coating",
      "XPEL Paint Protection Film",
      "Opti-Coat Pro Ceramic Coating",
      "Dry Ice Undercarriage Blasting",
      "Paint Correction & Wet Sanding",
      "High-Heat Rejection Window Tinting"
    ].map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name }
    }))
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${spaceGrotesk.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ScrollProgress />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <CursorGlow />
        <div className="grain-overlay" aria-hidden="true" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
