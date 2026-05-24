import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Utilify",
  description: "Read our terms of service. Simple, fair, and open guidelines for using the free Utilify tools platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Clear, simple rules for using the Utilify platform.
            </p>
          </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-zinc-600 dark:text-zinc-300">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing or using the Utilify website, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">2. Fair Use</h2>
              <p className="leading-relaxed">
                Utilify is intended for personal and commercial productivity purposes. You may not use our services for automated scraping, mass API calls, flooding server memory, or attempting to compromise server security in any way.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">3. Disclaimer of Warranties</h2>
              <p className="leading-relaxed">
                Utilify is provided &quot;as is&quot; and without any warranty of any kind, either express or implied. We do not guarantee that our tools will always be online, error-free, or compatible with every file type. You use our tools at your own risk.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">4. Modifications</h2>
              <p className="leading-relaxed">
                We reserve the right to modify these terms or discontinue any tool or service at any time without notice. Your continued use of the website following any changes constitutes acceptance of the new terms.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
