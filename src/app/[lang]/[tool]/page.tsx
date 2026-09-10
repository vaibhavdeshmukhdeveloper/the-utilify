import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { JsonLd } from "@/components/JsonLd";
import {
  toolTranslations,
  SUPPORTED_LANGUAGES,
  Language,
  getToolTranslation,
} from "@/lib/i18n/translations";

const MergePdfClient = dynamic(() => import("@/app/merge-pdf/MergePdfClient"));
const SplitPdfClient = dynamic(() => import("@/app/split-pdf/SplitPdfClient"));
const BackgroundRemoverClient = dynamic(() => import("@/app/background-remover/BackgroundRemoverClient"));
const ImageCompressorClient = dynamic(() => import("@/app/image-compressor/ImageCompressorClient"));
const PdfToImageClient = dynamic(() => import("@/app/pdf-to-image/PdfToImageClient"));
const SipCalculatorClient = dynamic(() => import("@/app/sip-calculator/SipCalculatorClient"));
const InvestmentCalculatorClient = dynamic(() => import("@/app/investment-calculator/InvestmentCalculatorClient"));
const FireCalculatorClient = dynamic(() => import("@/app/fire-calculator/FireCalculatorClient"));
const BmiCalculatorClient = dynamic(() => import("@/app/bmi-calculator/BmiCalculatorClient"));
const AgeCalculatorClient = dynamic(() => import("@/app/age-calculator/AgeCalculatorClient"));
const UnitConverterClient = dynamic(() => import("@/app/unit-converter/UnitConverterClient"));
const PxToRemClient = dynamic(() => import("@/app/px-to-rem/PxToRemClient"));
const Base64Client = dynamic(() => import("@/app/base64/Base64Client"));
const QrGeneratorClient = dynamic(() => import("@/app/qr-generator/QrGeneratorClient"));
const PasswordGeneratorClient = dynamic(() => import("@/app/password-generator/PasswordGeneratorClient"));
const JsonFormatterClient = dynamic(() => import("@/app/json-formatter/JsonFormatterClient"));
const DateCalculatorClient = dynamic(() => import("@/app/date-calculator/DateCalculatorClient"));
const WordCounterClient = dynamic(() => import("@/app/word-counter/WordCounterClient"));
const ColorPaletteClient = dynamic(() => import("@/app/color-palette/ColorPaletteClient"));

const TOOL_COMPONENTS: Record<string, React.ComponentType<any>> = {
  "merge-pdf": MergePdfClient,
  "split-pdf": SplitPdfClient,
  "background-remover": BackgroundRemoverClient,
  "image-compressor": ImageCompressorClient,
  "pdf-to-image": PdfToImageClient,
  "sip-calculator": SipCalculatorClient,
  "investment-calculator": InvestmentCalculatorClient,
  "fire-calculator": FireCalculatorClient,
  "bmi-calculator": BmiCalculatorClient,
  "age-calculator": AgeCalculatorClient,
  "unit-converter": UnitConverterClient,
  "px-to-rem": PxToRemClient,
  "base64": Base64Client,
  "qr-generator": QrGeneratorClient,
  "password-generator": PasswordGeneratorClient,
  "json-formatter": JsonFormatterClient,
  "date-calculator": DateCalculatorClient,
  "word-counter": WordCounterClient,
  "color-palette": ColorPaletteClient,
};

interface PageProps {
  params: Promise<{ lang: string; tool: string }>;
}

export async function generateStaticParams() {
  const params: { lang: string; tool: string }[] = [];
  for (const lang of SUPPORTED_LANGUAGES) {
    const availableTools = Object.keys(toolTranslations[lang]);
    for (const tool of availableTools) {
      if (TOOL_COMPONENTS[tool]) {
        params.push({ lang, tool });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, tool } = await params;
  if (!SUPPORTED_LANGUAGES.includes(lang as Language)) return {};

  const translation = getToolTranslation(tool, lang as Language);
  if (!translation) return {};

  const baseUrl = "https://www.theutilify.com";
  const localizedUrl = `${baseUrl}/${lang}/${tool}`;

  return {
    title: translation.title,
    description: translation.description,
    alternates: {
      canonical: `/${lang}/${tool}`,
      languages: {
        en: `${baseUrl}/${tool}`,
        es: `${baseUrl}/es/${tool}`,
        pt: `${baseUrl}/pt/${tool}`,
        "x-default": `${baseUrl}/${tool}`,
      },
    },
    openGraph: {
      title: translation.title,
      description: translation.description,
      url: localizedUrl,
      siteName: "Utilify",
      locale: lang === "es" ? "es_ES" : "pt_BR",
      type: "website",
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(translation.name)}&category=${encodeURIComponent(translation.category)}&badge=100%25%20Gratis`,
          width: 1200,
          height: 630,
          alt: translation.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: translation.title,
      description: translation.description,
    },
  };
}

export default async function LocalizedToolPage({ params }: PageProps) {
  const { lang, tool } = await params;
  if (!SUPPORTED_LANGUAGES.includes(lang as Language)) {
    notFound();
  }

  const translation = getToolTranslation(tool, lang as Language);
  const Component = TOOL_COMPONENTS[tool];

  if (!translation || !Component) {
    notFound();
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: translation.name,
    description: translation.description,
    inLanguage: lang,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "USD",
    },
    featureList: translation.features,
  };

  return (
    <>
      <JsonLd data={schema} />
      <Component
        customTitle={translation.name}
        customDescription={translation.description}
        customHowToUse={translation.howToUse}
        customFaqs={translation.faqs}
      />
    </>
  );
}
