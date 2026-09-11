import type { Metadata, Viewport } from "next";
import { fontClassNames } from "@/lib/fonts";
import { brand, seo } from "@/lib/content";
import { organizationSchema } from "@/lib/structured-data";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { IntroProvider } from "@/components/providers/intro";
import { Preloader } from "@/components/fx/preloader";
import { Grain } from "@/components/fx/grain";
import { CursorGlow } from "@/components/fx/cursor-glow";
import { Header } from "@/components/layout/header";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: seo.title,
  description: seo.description,
  keywords: [
    "software studio",
    "web development",
    "mobile app development",
    "restaurant management system",
    "dental clinic software",
    "custom software",
    "Islamabad",
    "Pakistan",
  ],
  authors: [{ name: brand.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: brand.name,
    url: "/",
    title: seo.title,
    description: seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0b0a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontClassNames} h-full overflow-x-clip antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
      </head>
      <body className="min-h-full max-w-full overflow-x-clip bg-ink font-sans text-bone">
        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[110] focus-visible:rounded-full focus-visible:bg-accent focus-visible:px-4 focus-visible:py-2.5 focus-visible:text-[15px] focus-visible:font-semibold focus-visible:text-ink"
        >
          Skip to content
        </a>
        <IntroProvider>
          <SmoothScroll>
            <Preloader />
            <Header />
            {children}
            <CursorGlow />
            <Grain />
          </SmoothScroll>
        </IntroProvider>
      </body>
    </html>
  );
}
