import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";

const SipCalculatorClient = dynamic(() => import("@/app/sip-calculator/SipCalculatorClient"));
const InvestmentCalculatorClient = dynamic(() => import("@/app/investment-calculator/InvestmentCalculatorClient"));
const BmiCalculatorClient = dynamic(() => import("@/app/bmi-calculator/BmiCalculatorClient"));
const PasswordGeneratorClient = dynamic(() => import("@/app/password-generator/PasswordGeneratorClient"));
const QrGeneratorClient = dynamic(() => import("@/app/qr-generator/QrGeneratorClient"));
const WordCounterClient = dynamic(() => import("@/app/word-counter/WordCounterClient"));
const JsonFormatterClient = dynamic(() => import("@/app/json-formatter/JsonFormatterClient"));
const UnitConverterClient = dynamic(() => import("@/app/unit-converter/UnitConverterClient"));
const DiffCheckerClient = dynamic(() => import("@/app/diff-checker/DiffCheckerClient"));
const Base64Client = dynamic(() => import("@/app/base64/Base64Client"));
const TextConverterClient = dynamic(() => import("@/app/text-converter/TextConverterClient"));
const ColorPaletteClient = dynamic(() => import("@/app/color-palette/ColorPaletteClient"));
const LoremIpsumClient = dynamic(() => import("@/app/lorem-ipsum/LoremIpsumClient"));
const DateCalculatorClient = dynamic(() => import("@/app/date-calculator/DateCalculatorClient"));
const AgeCalculatorClient = dynamic(() => import("@/app/age-calculator/AgeCalculatorClient"));

const EMBEDDABLE_TOOLS: Record<string, { title: string; component: React.ComponentType }> = {
  "sip-calculator": { title: "SIP Calculator", component: SipCalculatorClient },
  "investment-calculator": { title: "Investment Calculator", component: InvestmentCalculatorClient },
  "bmi-calculator": { title: "BMI Calculator", component: BmiCalculatorClient },
  "password-generator": { title: "Password Generator", component: PasswordGeneratorClient },
  "qr-generator": { title: "QR Code Generator", component: QrGeneratorClient },
  "word-counter": { title: "Word Counter", component: WordCounterClient },
  "json-formatter": { title: "JSON Formatter", component: JsonFormatterClient },
  "unit-converter": { title: "Unit Converter", component: UnitConverterClient },
  "diff-checker": { title: "Diff Checker", component: DiffCheckerClient },
  "base64": { title: "Base64 Encoder/Decoder", component: Base64Client },
  "text-converter": { title: "Text Case Converter", component: TextConverterClient },
  "color-palette": { title: "Color Palette Generator", component: ColorPaletteClient },
  "lorem-ipsum": { title: "Lorem Ipsum Generator", component: LoremIpsumClient },
  "date-calculator": { title: "Date Calculator", component: DateCalculatorClient },
  "age-calculator": { title: "Age Calculator", component: AgeCalculatorClient },
};

export function generateStaticParams() {
  return Object.keys(EMBEDDABLE_TOOLS).map((tool) => ({
    tool,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tool: string }>;
}): Promise<Metadata> {
  const { tool } = await params;
  const toolInfo = EMBEDDABLE_TOOLS[tool];

  if (!toolInfo) {
    return {
      title: "Embed Tool | Utilify",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `Embed ${toolInfo.title} | Utilify`,
    description: `Embeddable interactive ${toolInfo.title} widget powered by The Utilify.`,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool } = await params;
  const toolInfo = EMBEDDABLE_TOOLS[tool];

  if (!toolInfo) {
    notFound();
  }

  const Component = toolInfo.component;
  return <Component />;
}
