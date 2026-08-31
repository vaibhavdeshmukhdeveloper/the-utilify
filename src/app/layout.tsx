import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.theutilify.com"),
  title: {
    default: "Utilify - Free Online Utility & Productivity Tools Suite",
    template: "%s | Utilify",
  },
  description: "A professional-grade, privacy-first suite of free online utilities. Split, merge, and convert PDFs, remove background with AI, compress images, and calculate financials in seconds.",
  keywords: [
    "online tools",
    "pdf to image",
    "merge pdf",
    "split pdf",
    "ai background remover",
    "image compressor",
    "json formatter",
    "sip calculator",
    "investment calculator",
    "bmi calculator",
    "password generator",
    "qr code generator",
    "free online utilities"
  ],
  authors: [{ name: "The Utilify Editorial Team", url: "https://www.theutilify.com/about" }],
  creator: "The Utilify Team",
  publisher: "Utilify",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Utilify - Free Online Utility & Productivity Tools Suite",
    description: "A professional-grade, privacy-first suite of free online utilities. Split, merge, and convert PDFs, remove background with AI, compress images, and calculate financials in seconds.",
    url: "https://www.theutilify.com",
    siteName: "Utilify",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://www.theutilify.com/api/og?title=Free%20Online%20Utility%20%26%20Productivity%20Tools&category=Utilify%20Suite&badge=100%25%20Free%20%E2%80%A2%20Zero%20Data%20Retention",
        width: 1200,
        height: 630,
        alt: "Utilify - Free Online Productivity & Utility Suite",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Utilify - Free Online Utility & Productivity Tools Suite",
    description: "Professional-grade, privacy-first free online utilities. Fast, client-side, zero file retention.",
    images: [
      "https://www.theutilify.com/api/og?title=Free%20Online%20Utility%20%26%20Productivity%20Tools&category=Utilify%20Suite&badge=100%25%20Free%20%E2%80%A2%20Zero%20Data%20Retention",
    ],
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "J4toVdS11NHqtlWUwoDiHulzd2YyK-mYS7HxQzuOurA",
    yandex: process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION || "31ab4f299bc6b423",
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
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
      className={`${inter.variable} ${outfit.variable} h-full antialiased font-sans`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="The Utilify Blog RSS Feed"
          href="https://www.theutilify.com/feed.xml"
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6366007730203648"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Google Ads Tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-936767269"
          strategy="afterInteractive"
        />
        <Script id="google-ads-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-936767269');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
