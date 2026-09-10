import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { hubTranslations, toolTranslations } from "@/lib/i18n/translations";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Herramientas en Línea Gratuitas y Privadas | Utilify Español",
  description: "Suite gratuita de herramientas para unir y dividir PDF, quitar fondo de fotos con IA, comprimir imágenes y calcular finanzas en español.",
  alternates: {
    canonical: "/es",
    languages: {
      "es": "https://www.theutilify.com/es",
      "pt": "https://www.theutilify.com/pt",
      "en": "https://www.theutilify.com",
      "x-default": "https://www.theutilify.com",
    },
  },
  openGraph: {
    title: "Herramientas en Línea Gratuitas y Privadas | Utilify Español",
    description: "Suite gratuita de herramientas para PDF, imágenes y calculadoras sin registro y con total privacidad.",
    url: "https://www.theutilify.com/es",
    siteName: "Utilify",
    locale: "es_ES",
    type: "website",
  },
};

export default function SpanishHubPage() {
  const t = hubTranslations.es;
  const tools = Object.values(toolTranslations.es);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": t.heroTitle,
    "description": t.heroSubtitle,
    "url": "https://www.theutilify.com/es",
    "inLanguage": "es",
    "publisher": {
      "@type": "Organization",
      "name": "Utilify",
      "url": "https://www.theutilify.com",
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd data={schema} />
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 border-b bg-card/50 relative overflow-hidden text-center">
          <div className="container max-w-4xl mx-auto px-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider mb-6">
              <Sparkles className="h-3.5 w-3.5" /> {t.heroBadge}
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-foreground">
              {t.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-muted-foreground">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-green-500" /> Cero almacenamiento</span>
              <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-500" /> 100% en tu navegador</span>
              <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-primary" /> Sin marcas de agua</span>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-16 container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Card
                key={tool.slug}
                className="p-6 rounded-3xl border hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                      {tool.category}
                    </span>
                    <span className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      {t.launchTool} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-foreground group-hover:text-primary transition-colors">
                    {tool.name}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <div className="pt-6 mt-4 border-t">
                  <Link
                    href={`/es/${tool.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
                  >
                    {t.launchTool} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Privacy Section */}
        <section className="py-16 bg-muted/30 border-t text-center">
          <div className="container max-w-3xl mx-auto px-4 space-y-4">
            <h3 className="text-2xl font-black text-foreground">{t.privacyTitle}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.privacySubtitle}
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
