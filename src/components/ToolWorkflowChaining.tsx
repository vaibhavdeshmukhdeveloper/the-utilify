"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, ArrowUpRight } from "lucide-react";
import { getLanguageFromPathname, getCanonicalToolSlug, getLocalizedPath } from "@/lib/i18n/translations";

interface WorkflowStep {
  badge: string;
  title: string;
  description: string;
  actionText: string;
  targetHref: string;
}

export function ToolWorkflowChaining() {
  const pathname = usePathname();
  const slug = getCanonicalToolSlug(pathname || "");
  const currentLang = getLanguageFromPathname(pathname);

  const getWorkflowStep = (): WorkflowStep | null => {
    // Spanish Workflows
    if (currentLang === "es") {
      switch (slug) {
        case "background-remover":
          return {
            badge: "Paso 2: Optimizar Imagen",
            title: "¿Deseas comprimir este recorte transparente para páginas web?",
            description: "Reduce el tamaño PNG hasta un 80% manteniendo la transparencia nítida.",
            actionText: "Abrir Compresor de Imágenes",
            targetHref: "/es/image-compressor",
          };
        case "image-compressor":
          return {
            badge: "Herramienta Complementaria",
            title: "¿Necesitas quitar el fondo de tus imágenes?",
            description: "Aísla el sujeto principal en segundos con inteligencia artificial en memoria.",
            actionText: "Quitar Fondo con IA",
            targetHref: "/es/background-remover",
          };
        case "split-pdf":
          return {
            badge: "Paso 2: Convertir Páginas",
            title: "¿Deseas convertir tus páginas PDF extraídas en imágenes PNG?",
            description: "Renderiza imágenes vectoriales en alta nitidez a 150 DPI listas para compartir.",
            actionText: "Convertir PDF a Imágenes",
            targetHref: "/es/pdf-to-image",
          };
        case "merge-pdf":
          return {
            badge: "Herramienta Complementaria",
            title: "¿Necesitas extraer páginas específicas de un documento extenso?",
            description: "Aísla anexos, firmas y capítulos individuales en segundos.",
            actionText: "Dividir PDF",
            targetHref: "/es/split-pdf",
          };
        case "pdf-to-image":
          return {
            badge: "Paso 2: Optimización",
            title: "¿Quieres reducir el tamaño de estas imágenes antes de enviarlas?",
            description: "Comprime imágenes JPG, PNG y WebP localmente con control de calidad.",
            actionText: "Comprimir Imágenes",
            targetHref: "/es/image-compressor",
          };
        case "sip-calculator":
          return {
            badge: "Planificación Financiera",
            title: "¿Deseas proyectar un capital inicial sumado a aportes mensuales?",
            description: "Calcula el crecimiento compuesto con múltiples frecuencias de capitalización.",
            actionText: "Calculadora de Inversiones",
            targetHref: "/es/investment-calculator",
          };
        case "investment-calculator":
          return {
            badge: "Planificación Financiera",
            title: "¿Buscas calcular tu meta de retiro anticipado e independencia financiera?",
            description: "Proyecta tu número FIRE con la regla del 4% y retorno real ajustado por inflación.",
            actionText: "Calculadora FIRE",
            targetHref: "/es/fire-calculator",
          };
        case "fire-calculator":
          return {
            badge: "Planificación Financiera",
            title: "¿Deseas modelar distintos objetivos de ahorro y frecuencias de capitalización?",
            description: "Resuelve monto final, aportes necesarios, tasa de retorno o plazo en años.",
            actionText: "Calculadora de Inversiones",
            targetHref: "/es/investment-calculator",
          };
        case "bmi-calculator":
          return {
            badge: "Salud y Tiempo",
            title: "¿Quieres conocer tu edad cronológica exacta en años, meses y días?",
            description: "Calcula el tiempo exacto vivido y los días para tu próximo cumpleaños.",
            actionText: "Calculadora de Edad",
            targetHref: "/es/age-calculator",
          };
        case "password-generator":
          return {
            badge: "Flujo de Seguridad",
            title: "¿Quieres compartir contraseñas o enlaces Wi-Fi con código QR?",
            description: "Genera códigos QR de alta resolución con colores y corrección de error.",
            actionText: "Generar Código QR",
            targetHref: "/es/qr-generator",
          };
        case "qr-generator":
          return {
            badge: "Flujo de Diseño",
            title: "¿Quieres elegir colores de marca con contraste accesible WCAG?",
            description: "Genera paletas armónicas y comprueba la legibilidad AA y AAA.",
            actionText: "Generador de Paleta de Colores",
            targetHref: "/es/color-palette",
          };
        case "color-palette":
          return {
            badge: "Flujo de Diseño",
            title: "¿Listo para usar tus colores personalizados en un código QR?",
            description: "Crea códigos QR en PNG y SVG con tus colores HEX.",
            actionText: "Generar Código QR",
            targetHref: "/es/qr-generator",
          };
        case "json-formatter":
          return {
            badge: "Flujo de Desarrollo",
            title: "¿Necesitas codificar o decodificar cadenas Base64 en tus payloads?",
            description: "Convierte texto UTF-8 y archivos binarios a Base64 en el navegador.",
            actionText: "Codificador Base64",
            targetHref: "/es/base64",
          };
        case "base64":
          return {
            badge: "Flujo de Desarrollo",
            title: "¿Necesitas validar y formatear cadenas JSON decodificadas?",
            description: "Embellece, minimiza e inspecciona estructuras JSON al instante.",
            actionText: "Formateador de JSON",
            targetHref: "/es/json-formatter",
          };
        case "unit-converter":
          return {
            badge: "Diseño y Desarrollo",
            title: "¿Trabajas con CSS? Convierte píxeles a REM y genera clamp() fluido.",
            description: "Calcula escalas tipográficas responsive y consulta tokens de Tailwind.",
            actionText: "Conversor PX a REM",
            targetHref: "/es/px-to-rem",
          };
        case "px-to-rem":
          return {
            badge: "Utilidad de Medición",
            title: "¿Necesitas convertir unidades de longitud, peso, temperatura o volumen?",
            description: "Convierte entre el sistema métrico e imperial con alta precisión.",
            actionText: "Conversor de Unidades",
            targetHref: "/es/unit-converter",
          };
        case "word-counter":
          return {
            badge: "Flujo de Contenido",
            title: "¿Deseas convertir tu texto o compartirlo mediante un código QR?",
            description: "Crea un código QR instantáneo para compartir enlaces o textos.",
            actionText: "Generador de Código QR",
            targetHref: "/es/qr-generator",
          };
        case "date-calculator":
          return {
            badge: "Utilidad de Calendario",
            title: "¿Quieres calcular tu edad cronológica exacta en años, meses y días?",
            description: "Conoce tu edad al minuto y la cuenta regresiva para tu próximo cumpleaños.",
            actionText: "Calculadora de Edad",
            targetHref: "/es/age-calculator",
          };
        case "age-calculator":
          return {
            badge: "Utilidad de Calendario",
            title: "¿Necesitas calcular la diferencia entre dos fechas o sumar días?",
            description: "Mide intervalos de tiempo con desglose de días y semanas laborales.",
            actionText: "Calculadora de Fechas",
            targetHref: "/es/date-calculator",
          };
        default:
          return null;
      }
    }

    // Portuguese Workflows
    if (currentLang === "pt") {
      switch (slug) {
        case "background-remover":
          return {
            badge: "Passo 2: Otimizar Imagem",
            title: "Deseja comprimir esta imagem com fundo transparente para web?",
            description: "Reduza o tamanho do PNG em até 80% sem perder a nitidez das bordas.",
            actionText: "Abrir Compressor de Imagens",
            targetHref: "/pt/image-compressor",
          };
        case "image-compressor":
          return {
            badge: "Ferramenta Complementar",
            title: "Precisa remover o fundo de fotos ou produtos?",
            description: "Isole o objeto principal em segundos com inteligência artificial.",
            actionText: "Remover Fundo com IA",
            targetHref: "/pt/background-remover",
          };
        case "split-pdf":
          return {
            badge: "Passo 2: Conversão Visual",
            title: "Deseja converter as páginas extraídas em imagens PNG?",
            description: "Gere imagens nítidas a 150 DPI de qualquer página do documento.",
            actionText: "Converter PDF em Imagens",
            targetHref: "/pt/pdf-to-image",
          };
        case "merge-pdf":
          return {
            badge: "Ferramenta Complementar",
            title: "Precisa extrair páginas específicas de um PDF volumoso?",
            description: "Isole anexos, contratos e blocos de assinatura rapidamente.",
            actionText: "Dividir PDF",
            targetHref: "/pt/split-pdf",
          };
        case "pdf-to-image":
          return {
            badge: "Passo 2: Otimização",
            title: "Deseja reduzir o tamanho das imagens geradas antes de enviar?",
            description: "Comprima JPG, PNG e WebP localmente com ajuste de qualidade.",
            actionText: "Comprimir Imagens",
            targetHref: "/pt/image-compressor",
          };
        case "sip-calculator":
          return {
            badge: "Planejamento Financeiro",
            title: "Deseja simular um aporte inicial junto com depósitos mensais?",
            description: "Projete o crescimento com capitalização diária, mensal ou anual.",
            actionText: "Calculadora de Investimentos",
            targetHref: "/pt/investment-calculator",
          };
        case "investment-calculator":
          return {
            badge: "Planejamento Financeiro",
            title: "Quer calcular sua meta de independência financeira e aposentadoria antecipada?",
            description: "Projete seu número FIRE pela regra dos 4% com retorno real descontando a inflação.",
            actionText: "Calculadora FIRE",
            targetHref: "/pt/fire-calculator",
          };
        case "fire-calculator":
          return {
            badge: "Planejamento Financeiro",
            title: "Deseja simular diferentes metas de investimento e frequências de juros?",
            description: "Calcule montante final, aportes necessários, taxa de retorno ou prazo.",
            actionText: "Calculadora de Investimentos",
            targetHref: "/pt/investment-calculator",
          };
        case "bmi-calculator":
          return {
            badge: "Saúde e Tempo",
            title: "Deseja descobrir sua idade cronológica exata em anos, meses e dias?",
            description: "Veja o tempo exato vivido e a contagem regressiva para o próximo aniversário.",
            actionText: "Calculadora de Idade",
            targetHref: "/pt/age-calculator",
          };
        case "password-generator":
          return {
            badge: "Fluxo de Segurança",
            title: "Precisa compartilhar credenciais ou links Wi-Fi via QR Code?",
            description: "Crie códigos QR em alta resolução com cores personalizadas.",
            actionText: "Criar Código QR",
            targetHref: "/pt/qr-generator",
          };
        case "qr-generator":
          return {
            badge: "Fluxo de Design",
            title: "Quer criar paletas de cores com alto contraste WCAG?",
            description: "Gere harmonias cromáticas e valide a legibilidade AA e AAA.",
            actionText: "Gerador de Paleta de Cores",
            targetHref: "/pt/color-palette",
          };
        case "color-palette":
          return {
            badge: "Fluxo de Design",
            title: "Pronto para aplicar suas cores personalizadas em um QR Code?",
            description: "Crie códigos QR em PNG e SVG com seus códigos HEX.",
            actionText: "Criar Código QR",
            targetHref: "/pt/qr-generator",
          };
        case "json-formatter":
          return {
            badge: "Fluxo de Desenvolvimento",
            title: "Precisa codificar ou decodificar strings Base64 nos seus dados?",
            description: "Converta textos UTF-8 e arquivos binários em Base64 no navegador.",
            actionText: "Codificador Base64",
            targetHref: "/pt/base64",
          };
        case "base64":
          return {
            badge: "Fluxo de Desenvolvimento",
            title: "Precisa validar e formatar strings JSON decodificadas?",
            description: "Formate, minifique e inspecione objetos JSON instantaneamente.",
            actionText: "Formatador de JSON",
            targetHref: "/pt/json-formatter",
          };
        case "unit-converter":
          return {
            badge: "Design e Front-End",
            title: "Trabalhando com CSS? Converta pixels em REM e gere clamp() fluido.",
            description: "Crie escalas tipográficas responsivas e consulte a tabela do Tailwind.",
            actionText: "Conversor PX para REM",
            targetHref: "/pt/px-to-rem",
          };
        case "px-to-rem":
          return {
            badge: "Utilitário de Medição",
            title: "Precisa converter unidades de comprimento, peso, temperatura ou volume?",
            description: "Converta entre medidas métricas e imperiais com precisão científica.",
            actionText: "Conversor de Unidades",
            targetHref: "/pt/unit-converter",
          };
        case "word-counter":
          return {
            badge: "Fluxo de Conteúdo",
            title: "Deseja transformar seu texto ou compartilhá-lo via QR Code?",
            description: "Gere um código QR instantâneo para compartilhar links ou textos.",
            actionText: "Gerador de Código QR",
            targetHref: "/pt/qr-generator",
          };
        case "date-calculator":
          return {
            badge: "Utilidade de Calendário",
            title: "Deseja calcular sua idade cronológica exata com contagem regressiva?",
            description: "Descubra sua idade ao minuto e os dias para seu próximo aniversário.",
            actionText: "Calculadora de Idade",
            targetHref: "/pt/age-calculator",
          };
        case "age-calculator":
          return {
            badge: "Utilidade de Calendário",
            title: "Precisa calcular intervalos ou adicionar dias entre duas datas?",
            description: "Calcule a duração exata com detalhamento em dias e semanas.",
            actionText: "Calculadora de Datas",
            targetHref: "/pt/date-calculator",
          };
        default:
          return null;
      }
    }

    // Default English Workflows
    switch (slug) {
      case "background-remover":
        return {
          badge: "Step 2: Optimize Asset",
          title: "Want to compress this transparent cutout for faster web loading?",
          description: "Reduce PNG file size by up to 80% without losing transparent edges or clarity.",
          actionText: "Open Image Compressor",
          targetHref: "/image-compressor",
        };
      case "image-compressor":
        return {
          badge: "Complementary Tool",
          title: "Need to remove background backdrops from your images?",
          description: "Use our in-memory AI background remover to isolate subjects in seconds.",
          actionText: "Try AI Background Remover",
          targetHref: "/background-remover",
        };
      case "split-pdf":
        return {
          badge: "Step 2: Visual Conversion",
          title: "Want to convert your extracted PDF pages into high-res PNG or JPG images?",
          description: "Render crystal-clear vector images from any PDF page without losing sharpness.",
          actionText: "Convert PDF to Image",
          targetHref: "/pdf-to-image",
        };
      case "merge-pdf":
        return {
          badge: "Complementary Tool",
          title: "Need to extract specific page ranges from a large PDF binder?",
          description: "Isolate individual exhibits, addendums, and signature blocks in seconds.",
          actionText: "Use Split PDF",
          targetHref: "/split-pdf",
        };
      case "pdf-to-image":
        return {
          badge: "Step 2: Asset Optimization",
          title: "Want to shrink these rendered image files before sharing?",
          description: "Compress JPG, PNG, and WebP images locally with customizable quality sliders.",
          actionText: "Compress Image Files",
          targetHref: "/image-compressor",
        };
      case "markdown-to-pdf":
        return {
          badge: "Step 2: Content Audit",
          title: "Want to verify word counts, character limits, and reading times?",
          description: "Audit your technical documentation or resume before sending it to hiring managers.",
          actionText: "Open Word Counter",
          targetHref: "/word-counter",
        };
      case "json-formatter":
        return {
          badge: "Developer Workflow",
          title: "Need to compare two JSON payloads or API responses side-by-side?",
          description: "Highlight missing keys, schema variations, and data diffs with visual color coding.",
          actionText: "Compare in Diff Checker",
          targetHref: "/diff-checker",
        };
      case "base64":
        return {
          badge: "Developer Workflow",
          title: "Need to format and validate decoded JSON strings?",
          description: "Pretty-print, validate syntax, and inspect nested claims instantly.",
          actionText: "Format JSON",
          targetHref: "/json-formatter",
        };
      case "diff-checker":
        return {
          badge: "Developer Workflow",
          title: "Working with JSON data? Format and validate payloads before comparing.",
          description: "Pretty-print messy JSON payloads to get clean, readable text diffs.",
          actionText: "Open JSON Formatter",
          targetHref: "/json-formatter",
        };
      case "sip-calculator":
        return {
          badge: "Financial Planning",
          title: "Want to model a one-time lump sum investment alongside your monthly SIP?",
          description: "Calculate compounding growth, maturity value, and annualized portfolio returns.",
          actionText: "Launch Investment Calculator",
          targetHref: "/investment-calculator",
        };
      case "investment-calculator":
        return {
          badge: "Financial Planning",
          title: "Want to calculate your early retirement target and Financial Independence number?",
          description: "Model your FIRE number using the 4% Safe Withdrawal Rule and inflation-adjusted returns.",
          actionText: "Launch FIRE Calculator",
          targetHref: "/fire-calculator",
        };
      case "fire-calculator":
        return {
          badge: "Financial Planning",
          title: "Want to solve for required monthly savings, return rate, or investment horizon?",
          description: "Use our 5-target Investment Calculator with daily, monthly, and annual compounding.",
          actionText: "Launch Investment Calculator",
          targetHref: "/investment-calculator",
        };
      case "bmi-calculator":
        return {
          badge: "Health & Milestones",
          title: "Want to calculate your exact chronological age down to the second?",
          description: "Track your lived milestones in weeks, days, and hours plus next birthday countdown.",
          actionText: "Open Age Calculator",
          targetHref: "/age-calculator",
        };
      case "px-to-rem":
        return {
          badge: "Design Workflow",
          title: "Need to generate accessible color palettes and test WCAG contrast ratios?",
          description: "Create harmonic palettes and verify AA/AAA text contrast compliance.",
          actionText: "Open Color Palette Generator",
          targetHref: "/color-palette",
        };
      case "lorem-ipsum":
        return {
          badge: "Writing Utility",
          title: "Want to check word count, character limits, and reading time on your copy?",
          description: "Analyze keyword density, reading duration, and social post limits in real time.",
          actionText: "Open Word Counter",
          targetHref: "/word-counter",
        };
      case "pdf-to-jpg":
        return {
          badge: "Step 2: Asset Optimization",
          title: "Want to compress your extracted JPG images for faster sharing?",
          description: "Reduce JPEG file size by up to 80% while preserving visual sharpness.",
          actionText: "Open Compress JPEG",
          targetHref: "/compress-jpeg",
        };
      case "compress-png":
      case "compress-jpeg":
      case "compress-webp":
        return {
          badge: "Complementary Tool",
          title: "Need to remove the background from your product or portrait image?",
          description: "Isolate subjects into transparent PNGs or pure white studio backdrops with AI.",
          actionText: "Try AI Background Remover",
          targetHref: "/background-remover",
        };
      case "make-signature-transparent":
      case "white-background-product-photos":
        return {
          badge: "Step 2: Optimize File Size",
          title: "Want to compress your processed image for fast web or document use?",
          description: "Shrink PNG, JPEG, and WebP file sizes without losing visual quality.",
          actionText: "Open Image Compressor",
          targetHref: "/image-compressor",
        };
      case "business-days-calculator":
        return {
          badge: "Calendar Utility",
          title: "Need full calendar date intervals or exact chronological age calculations?",
          description: "Calculate exact years, months, weeks, and days between any two dates.",
          actionText: "Open Date Calculator",
          targetHref: "/date-calculator",
        };
      case "password-generator":
        return {
          badge: "Security Workflow",
          title: "Need to share Wi-Fi credentials or secure links offline via QR Code?",
          description: "Generate high-resolution printable QR codes with custom colors and error correction.",
          actionText: "Generate QR Code",
          targetHref: "/qr-generator",
        };
      case "qr-generator":
        return {
          badge: "Design Workflow",
          title: "Want to create matching brand colors with high WCAG contrast?",
          description: "Generate beautiful color harmonies and test readability against light and dark backdrops.",
          actionText: "Open Color Palette Generator",
          targetHref: "/color-palette",
        };
      case "color-palette":
        return {
          badge: "Design Workflow",
          title: "Ready to test your brand colors on custom QR codes?",
          description: "Generate branded QR codes using custom foreground and background hex codes.",
          actionText: "Create Branded QR Code",
          targetHref: "/qr-generator",
        };
      case "unit-converter":
        return {
          badge: "Developer Utility",
          title: "Working on code or database naming? Convert variable casing seamlessly.",
          description: "Convert strings across camelCase, snake_case, PascalCase, kebab-case, and Title Case.",
          actionText: "Open Text Case Converter",
          targetHref: "/text-converter",
        };
      case "text-converter":
        return {
          badge: "Writing Utility",
          title: "Need to audit word counts, reading duration, and social character limits?",
          description: "Analyze paragraphs, sentence counts, and reading pace in real-time.",
          actionText: "Open Word Counter",
          targetHref: "/word-counter",
        };
      case "word-counter":
        return {
          badge: "Writing Utility",
          title: "Need dummy copy for wireframes, UI mockups, or layout testing?",
          description: "Generate custom paragraphs of formatted Lorem Ipsum placeholder text.",
          actionText: "Generate Lorem Ipsum",
          targetHref: "/lorem-ipsum",
        };
      case "date-calculator":
        return {
          badge: "Calendar Utility",
          title: "Want to calculate your exact chronological age in years, months, and days?",
          description: "Find your precise age and countdown days until your next birthday milestone.",
          actionText: "Open Age Calculator",
          targetHref: "/age-calculator",
        };
      case "age-calculator":
        return {
          badge: "Calendar Utility",
          title: "Need to calculate business days or add/subtract time intervals between dates?",
          description: "Measure duration between two calendar dates with day-of-week breakdown.",
          actionText: "Open Date Calculator",
          targetHref: "/date-calculator",
        };
      default:
        return null;
    }
  };

  const workflow = getWorkflowStep();
  if (!workflow) return null;

  const targetUrl = getLocalizedPath(workflow.targetHref, currentLang);

  return (
    <div className="w-full mt-8 p-6 md:p-8 rounded-[2rem] bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-[11px] font-black uppercase tracking-wider">
          <Zap className="h-3.5 w-3.5" /> {workflow.badge}
        </div>
        <h4 className="text-lg font-black text-foreground tracking-tight">{workflow.title}</h4>
        <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">{workflow.description}</p>
      </div>

      <Link href={targetUrl} className="shrink-0 w-full sm:w-auto">
        <button className="w-full sm:w-auto px-5 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer">
          {workflow.actionText} <ArrowUpRight className="h-4 w-4" />
        </button>
      </Link>
    </div>
  );
}
