import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Utilify - Free Online Utility & Productivity Tools Suite",
    description: "Professional-grade, privacy-first free online utilities. Fast, client-side, zero file retention.",
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
