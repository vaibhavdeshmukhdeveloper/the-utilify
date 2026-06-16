import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Mail, HelpCircle, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Utilify",
  description: "Get in touch with the Utilify team. Submit bug reports, feature requests, or business inquiries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Have a suggestion, found a bug, or just want to say hi? We would love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-8 rounded-[2rem] border-none bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center text-center">
              <Mail className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">Email Us</h3>
              <p className="text-sm text-muted-foreground mb-4">For help or feedback, drop us a line at:</p>
              <a href="mailto:vaibhavdeshmukhdeveloper@gmail.com" className="text-sm font-black text-primary hover:underline">
                vaibhavdeshmukhdeveloper@gmail.com
              </a>
            </Card>

            <Card className="p-8 rounded-[2rem] border-none bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center text-center">
              <HelpCircle className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">Common Qs</h3>
              <p className="text-sm text-muted-foreground mb-4">Chances are, your question has been answered in our:</p>
              <a href="/faq" className="text-sm font-black text-primary hover:underline">
                FAQ Section
              </a>
            </Card>

            <Card className="p-8 rounded-[2rem] border-none bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center text-center">
              <FileText className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">Open Source</h3>
              <p className="text-sm text-muted-foreground mb-4">View project status, release notes, and news in our:</p>
              <a href="/blog" className="text-sm font-black text-primary hover:underline">
                Blog
              </a>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
