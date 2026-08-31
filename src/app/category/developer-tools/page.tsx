import { Metadata } from "next";
import { CategoryHubLayout, CategoryToolItem, CategoryFaqItem } from "@/components/CategoryHubLayout";

export const metadata: Metadata = {
  title: "Free Web Developer Utilities & Formatters Suite | Utilify",
  description: "Free developer tools: JSON formatter & validator, cryptographically secure password generator, QR code generator, Base64 encoder/decoder, diff checker, and lorem ipsum generator. 100% private and client-side.",
  alternates: {
    canonical: "/category/developer-tools",
  },
  openGraph: {
    title: "Free Web Developer Utilities & Formatters Suite | Utilify",
    description: "Format JSON, generate strong passwords, create custom QR codes, check diffs, and encode Base64 in your browser with zero latency.",
    url: "https://www.theutilify.com/category/developer-tools",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Developer Utilities Suite | Utilify",
    description: "Client-side JSON formatters, security generators, diff checkers, and Base64 encoders.",
  },
};

const devTools: CategoryToolItem[] = [
  {
    title: "JSON Formatter & Validator",
    description: "Validate JSON syntax, pretty-print with custom indentation, detect syntax errors with line/column highlighting, and minify API payloads.",
    href: "/json-formatter",
    badge: "Essential",
    features: [
      "2-space, 4-space, and tab indentation",
      "Exact syntax error diagnostics",
      "100% client-side privacy - secrets stay local",
    ],
  },
  {
    title: "Password Generator",
    description: "Generate cryptographically secure random passwords with customizable character sets and live entropy security scoring.",
    href: "/password-generator",
    badge: "Security",
    features: [
      "Uses crypto.getRandomValues()",
      "Entropy and crack time estimator",
      "Zero network transmission",
    ],
  },
  {
    title: "QR Code Generator",
    description: "Generate high-resolution vector QR codes for websites, Wi-Fi network credentials, emails, and plain text with custom color palettes.",
    href: "/qr-generator",
    badge: "Vector",
    features: [
      "Custom foreground & background colors",
      "Wi-Fi and URL support",
      "Lossless PNG download",
    ],
  },
  {
    title: "Base64 Encoder & Decoder",
    description: "Convert UTF-8 text and binary files to Base64 strings, and decode Base64 data back to raw formats with instant preview.",
    href: "/base64",
    badge: "Encoding",
    features: [
      "Bidirectional text and file conversion",
      "Full UTF-8 character support",
      "Fast client-side decoding",
    ],
  },
  {
    title: "Diff Checker",
    description: "Compare two chunks of text, source code, or JSON side-by-side or unified inline to visually inspect additions, removals, and modifications.",
    href: "/diff-checker",
    badge: "Code",
    features: [
      "Side-by-side split & inline views",
      "Character-level difference highlighting",
      "Line count change metrics",
    ],
  },
  {
    title: "Text Case Converter",
    description: "Convert strings between UPPERCASE, lowercase, Title Case, camelCase, PascalCase, snake_case, and kebab-case instantly.",
    href: "/text-converter",
    badge: "Formatting",
    features: [
      "Supports 8+ programmatic casings",
      "Real-time word and character stats",
      "One-click clipboard copy",
    ],
  },
  {
    title: "Lorem Ipsum Generator",
    description: "Generate customizable dummy placeholder copy for mockups, prototypes, and UI testing in paragraphs, sentences, or words.",
    href: "/lorem-ipsum",
    badge: "Typography",
    features: [
      "Custom paragraph & sentence counts",
      "Optional HTML tag wrapping",
      "Instant copy to clipboard",
    ],
  },
];

const devFaqs: CategoryFaqItem[] = [
  {
    question: "Is it safe to paste confidential API keys or credentials into the JSON Formatter and Base64 Decoder?",
    answer: "Yes. All developer tools on Utilify execute 100% locally in your browser's JavaScript engine. No data, API keys, JWT tokens, or payloads are sent to any remote server or logged in telemetry.",
  },
  {
    question: "How does the Password Generator ensure random strength?",
    answer: "We use the browser's native window.crypto.getRandomValues() CSPRNG (Cryptographically Secure Pseudo-Random Number Generator), rather than predictable Math.random() calls.",
  },
  {
    question: "Can I embed these developer tools as widgets into my own developer blog or documentation?",
    answer: "Yes! Utilify provides an Embed Widget feature on every tool page so you can embed interactive calculators and formatters with one click.",
  },
];

export default function DeveloperToolsCategoryPage() {
  return (
    <CategoryHubLayout
      categoryName="Developer Utilities"
      categorySlug="developer-tools"
      headline="Free Web Developer Utilities &amp; Formatters"
      subheadline="Client-side JSON formatters, security generators, diff checkers, and encoding utilities for modern engineers."
      description="The ultimate free suite of client-side developer utilities: JSON validator, password generator, Base64 converter, diff checker, and QR generator."
      tools={devTools}
      faqs={devFaqs}
      detailedContent={
        <div>
          <h2>Built by Developers, for Developers</h2>
          <p>
            Modern software engineering requires rapid debugging tools for formatting JSON responses, comparing git diffs, generating mock data, and verifying encoding schemas.
          </p>
          <p>
            Utilify offers lightweight, zero-latency, client-side developer utilities without bloated ads, tracking scripts, or data capture.
          </p>
        </div>
      }
    />
  );
}
