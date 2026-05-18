import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Shield, EyeOff, Lock, FileKey } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Utilify",
  description: "Read our privacy policy. We commit to a privacy-first approach: zero tracking, no persistent storage, and automatic file cleanup.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Utilify, privacy is not a feature - it is our core foundation. We process your data securely and delete it instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border flex flex-col items-center text-center">
              <EyeOff className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-bold mb-1">Zero File Storage</h3>
              <p className="text-xs text-muted-foreground">Files are only processed in-memory and are never written to persistent hard drives.</p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border flex flex-col items-center text-center">
              <Lock className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-bold mb-1">SSL Encrypted</h3>
              <p className="text-xs text-muted-foreground">All communication between your browser and our server is secured with bank-grade SSL.</p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border flex flex-col items-center text-center">
              <FileKey className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-bold mb-1">No Signups</h3>
              <p className="text-xs text-muted-foreground">We do not require usernames, passwords, or personal details to use our services.</p>
            </div>
          </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-zinc-600 dark:text-zinc-300">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">1. Information We Collect</h2>
              <p className="leading-relaxed">
                Utilify does not collect any personally identifiable information (PII) or user files. Files uploaded for compression, splitting, merging, or background removal are held transiently in RAM during the processing phase and are completely deleted immediately after the task is completed.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">2. How We Process Files</h2>
              <p className="leading-relaxed">
                Some operations (such as compound interest calculations and JSON validation) run 100% inside your own web browser. Heavy operations (such as AI background removal and PDF processing) run on transient, secure sandbox cloud instances that have zero persistent storage.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">3. Cookies & Analytics</h2>
              <p className="leading-relaxed">
                We may use privacy-centric analytics (such as Google Analytics with anonymized IPs) to measure traffic levels and optimize web performance. These systems only track anonymized metrics like browser version, page load speeds, and generic country location.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">4. Advertising Partners</h2>
              <p className="leading-relaxed">
                We may serve non-intrusive advertisements (such as Google AdSense) to support server costs. Ad networks may use cookies to serve relevant advertisements based on your search history. You can opt out of personalized advertising by visiting your Google Ad Settings.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
