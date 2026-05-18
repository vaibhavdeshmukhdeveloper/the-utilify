import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Shield, Zap, Heart, Globe, Lock, Code } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Utilify",
  description: "Learn more about Utilify, our mission to provide free, high-quality online tools, and our commitment to user privacy and security.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden border-b bg-zinc-50 dark:bg-zinc-950">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          </div>

          <div className="container px-4 md:px-8 relative z-10 text-center">
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
              Our mission is to <br /><span className="text-primary italic">simplify your digital life.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We build powerful, easy-to-use online tools that help you get things done faster, without the clutter or the cost.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-24">
          <div className="container px-4 md:px-8 max-w-4xl mx-auto">
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <h2 className="text-3xl font-bold mb-8">Who We Are</h2>
              <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
                Utilify started with a simple observation: the internet is full of "utility" sites that are cluttered with ads, slow to load, and confusing to navigate. We decided to build an alternative - a suite of tools that are fast, beautiful, and respect your privacy.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">User-Centric Design</h3>
                  <p className="text-muted-foreground">Everything we build starts with the user experience. If it&apos;s not easy to use, it&apos;s not worth building.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Privacy First</h3>
                  <p className="text-muted-foreground">We never store your files. Everything is processed and deleted automatically within one hour.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Performance Driven</h3>
                  <p className="text-muted-foreground">Our backend is optimized for speed, ensuring your PDF conversions and image processing happen in seconds.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Globe className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Always Free</h3>
                  <p className="text-muted-foreground">The basic utility of the web should be free. We provide high-quality tools without requiring an account or payment.</p>
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-8 text-center">Our Core Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border text-center">
                  <h4 className="font-bold text-xl mb-4 text-primary">Simplicity</h4>
                  <p className="text-sm text-muted-foreground">No clutter, no distractions. Just the tool you need.</p>
                </div>
                <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border text-center">
                  <h4 className="font-bold text-xl mb-4 text-primary">Transparency</h4>
                  <p className="text-sm text-muted-foreground">Clear privacy policies and open communication.</p>
                </div>
                <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border text-center">
                  <h4 className="font-bold text-xl mb-4 text-primary">Quality</h4>
                  <p className="text-sm text-muted-foreground">Professional-grade processing for every file.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-8 text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-black mb-6">Ready to get things done?</h2>
            <p className="text-xl opacity-90 mb-10 leading-relaxed">
              Join thousands of users who trust Utilify for their daily productivity needs.
              No account required - just results.
            </p>
            <a href="/#tools">
              <button className="px-10 h-16 bg-white text-primary rounded-full text-lg font-bold hover:bg-zinc-100 transition-colors shadow-xl">
                Explore All Tools
              </button>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
