import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions - Utilify",
  description: "Got questions about Utilify? Read our answers regarding file storage limits, security protocols, AdSense, and browser processing capabilities.",
};

const faqs = [
  {
    q: "Is Utilify really 100% free?",
    a: "Yes! Utilify is completely free to use. There are no hidden subscription costs, limits on processing volume, or payment gates. We keep the platform free by running simple non-intrusive advertisements."
  },
  {
    q: "Are my uploaded files safe and secure?",
    a: "Absolutely. We are privacy-first. Files you upload for background removal or PDF actions are held in transient memory (RAM) and processed securely, then instantly deleted. We never store them on persistent drives."
  },
  {
    q: "Which operations run in the browser vs. the server?",
    a: "To guarantee your absolute privacy, most of our tools—including calculators (BMI, Investment, SIP, Age, Date), generators (Password, QR, Lorem Ipsum), text converters (Case Converter, Base64, Diff Checker), and design utilities (Color Palette)—run 100% locally in your web browser client-side. Only heavy operations requiring specialized server environments (such as AI background removal, image compression, and PDF splitting/merging/conversion/compilation) run securely on our transient backend servers, where files are held strictly in RAM and deleted instantly after processing."
  },
  {
    q: "Do I need to sign up for an account?",
    a: "No! There is no account registration or login required. You get immediate, unhindered access to all of our 20 utilities with a single click."
  },
  {
    q: "Can I use these tools on my mobile phone?",
    a: "Yes! The entire Utilify website is responsive and built with a premium mobile-first design. All tools (including drag-and-drop file uploaders) work beautifully on Android and iOS devices."
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              FAQ Help Center
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Find instant answers to the most common questions about the Utilify platform.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="p-8 rounded-[2rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950/40">
                <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-50">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
