import { Language } from "./translations";

export type Locale = Language | "en";

export interface UIStrings {
  nav: {
    home: string;
    about: string;
    blog: string;
    contact: string;
    searchPlaceholder: string;
    exploreTools: string;
    switchLanguage: string;
  };
  toolLayout: {
    embedWidget: string;
    keyTakeawayTitle: string;
    pricingLabel: string;
    pricingValue: string;
    privacyLabel: string;
    privacyValue: string;
    accountLabel: string;
    accountValue: string;
    executionLabel: string;
    executionValue: string;
    howToUsePrefix: string;
    faqTitle: string;
    tutorialsBadge: string;
    tutorialsTitle: string;
    tutorialsSubtitle: string;
    readGuide: string;
    relatedToolsTitle: string;
    breadcrumbHome: string;
    defaultSummaryTemplate: (title: string, description: string) => string;
  };
  fileUploader: {
    dragAndDrop: string;
    clickToBrowse: string;
    pasteWith: string;
    processingComplete: string;
    readyForDownload: string;
    downloadResult: string;
    convertAnother: string;
    startProcessing: string;
    processing: string;
    selectFileError: string;
    pasteSuccess: string;
  };
  ratingWidget: {
    rateThisTool: string;
    ratingsCount: string;
    averageRating: string;
    thankYou: string;
    submitting: string;
    labels: Record<number, string>;
  };
  crossPromo: {
    badge: string;
    ctaButton: string;
    getItOn: string;
    googlePlay: string;
  };
  footer: {
    pitch: string;
    developerApps: string;
    colPdfImage: string;
    colCalculators: string;
    colDevText: string;
    colCompany: string;
    categoryHubs: string;
    softwareAlternatives: string;
    multilingualEditions: string;
    privacyPolicy: string;
    termsOfService: string;
    allRightsReserved: string;
    madeWithLove: string;
  };
}

export const uiStrings: Record<Locale, UIStrings> = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      blog: "Blog",
      contact: "Contact",
      searchPlaceholder: "Search...",
      exploreTools: "Explore Tools",
      switchLanguage: "Select Language",
    },
    toolLayout: {
      embedWidget: "Embed Widget",
      keyTakeawayTitle: "Key Takeaway & Quick Summary",
      pricingLabel: "Pricing",
      pricingValue: "100% Free Forever",
      privacyLabel: "Privacy",
      privacyValue: "Zero Retention",
      accountLabel: "Account",
      accountValue: "No Sign-Up",
      executionLabel: "Execution",
      executionValue: "Instant / In-Memory",
      howToUsePrefix: "How to Use",
      faqTitle: "Frequently Asked Questions",
      tutorialsBadge: "Comprehensive Tutorials",
      tutorialsTitle: "In-Depth Guides & Walkthroughs",
      tutorialsSubtitle: "Master advanced techniques, workflows, and industry best practices.",
      readGuide: "Read Guide",
      relatedToolsTitle: "Related Tools",
      breadcrumbHome: "Home",
      defaultSummaryTemplate: (title, description) =>
        `${title} is a free, privacy-first online utility designed to ${description.toLowerCase().replace(/^(a|an|the)\s+/, "")}. It processes files with zero data retention, instant speed, no watermarks, and no sign-up or subscription required.`,
    },
    fileUploader: {
      dragAndDrop: "Drag & drop your files here, click to browse",
      clickToBrowse: "click to browse",
      pasteWith: ", or paste with",
      processingComplete: "Processing Complete!",
      readyForDownload: "Your file is ready for download.",
      downloadResult: "Download Result",
      convertAnother: "Convert another file",
      startProcessing: "Start Processing",
      processing: "Processing...",
      selectFileError: "Please select a file first",
      pasteSuccess: "Pasted image from clipboard",
    },
    ratingWidget: {
      rateThisTool: "Rate this tool",
      ratingsCount: "ratings",
      averageRating: "Average Rating",
      thankYou: "Thank you for rating!",
      submitting: "Submitting...",
      labels: {
        1: "1 - Could be better",
        2: "2 - Needs improvement",
        3: "3 - Good utility",
        4: "4 - Very helpful!",
        5: "5 - Outstanding! ⭐",
      },
    },
    crossPromo: {
      badge: "Mobile Companion App",
      ctaButton: "Get App for Android",
      getItOn: "Get it on",
      googlePlay: "Google Play",
    },
    footer: {
      pitch: "Fast, elegant, and 100% secure online utilities designed to simplify your digital life. No signups, no fees - just instant results.",
      developerApps: "More Apps by Developer",
      colPdfImage: "PDF & Image Tools",
      colCalculators: "Financial & Health Calculators",
      colDevText: "Developer & Text Utilities",
      colCompany: "Company & Legal",
      categoryHubs: "Tool Category Hubs",
      softwareAlternatives: "Free Software Alternatives",
      multilingualEditions: "Global & Multilingual Editions",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      allRightsReserved: "All rights reserved.",
      madeWithLove: "for a simpler web.",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      about: "Acerca de",
      blog: "Blog",
      contact: "Contacto",
      searchPlaceholder: "Buscar herramientas...",
      exploreTools: "Explorar Herramientas",
      switchLanguage: "Cambiar Idioma",
    },
    toolLayout: {
      embedWidget: "Incrustar Widget",
      keyTakeawayTitle: "Conclusión Clave y Resumen Rápido",
      pricingLabel: "Precio",
      pricingValue: "100% Gratis Siempre",
      privacyLabel: "Privacidad",
      privacyValue: "Cero Retención",
      accountLabel: "Cuenta",
      accountValue: "Sin Registro",
      executionLabel: "Ejecución",
      executionValue: "Instantánea en Memoria",
      howToUsePrefix: "Cómo usar",
      faqTitle: "Preguntas Frecuentes",
      tutorialsBadge: "Tutoriales Completos",
      tutorialsTitle: "Guías y Tutoriales Detallados",
      tutorialsSubtitle: "Domina técnicas avanzadas, flujos de trabajo y mejores prácticas.",
      readGuide: "Leer Guía",
      relatedToolsTitle: "Herramientas Relacionadas",
      breadcrumbHome: "Inicio",
      defaultSummaryTemplate: (title, description) =>
        `${title} es una herramienta en línea gratuita y privada diseñada para ${description.toLowerCase().replace(/^(un|una|el|la)\s+/, "")}. Procesa archivos con cero retención de datos, velocidad instantánea, sin marcas de agua y sin necesidad de registro.`,
    },
    fileUploader: {
      dragAndDrop: "Arrastra y suelta tus archivos aquí, o haz clic para buscar",
      clickToBrowse: "haz clic para buscar",
      pasteWith: ", o pega con",
      processingComplete: "¡Procesamiento Completado!",
      readyForDownload: "Tu archivo está listo para descargar.",
      downloadResult: "Descargar Resultado",
      convertAnother: "Procesar otro archivo",
      startProcessing: "Iniciar Procesamiento",
      processing: "Procesando...",
      selectFileError: "Por favor selecciona un archivo primero",
      pasteSuccess: "Imagen pegada desde el portapapeles",
    },
    ratingWidget: {
      rateThisTool: "Califica esta herramienta",
      ratingsCount: "votos",
      averageRating: "Calificación Promedio",
      thankYou: "¡Gracias por tu calificación!",
      submitting: "Enviando...",
      labels: {
        1: "1 - Podría mejorar",
        2: "2 - Necesita mejoras",
        3: "3 - Buena herramienta",
        4: "4 - ¡Muy útil!",
        5: "5 - ¡Sobresaliente! ⭐",
      },
    },
    crossPromo: {
      badge: "App Móvil Complementaria",
      ctaButton: "Descargar para Android",
      getItOn: "Disponible en",
      googlePlay: "Google Play",
    },
    footer: {
      pitch: "Herramientas en línea rápidas, elegantes y 100% seguras diseñadas para simplificar tu vida digital. Sin registro ni cargos, resultados inmediatos.",
      developerApps: "Más Apps del Desarrollador",
      colPdfImage: "Herramientas PDF e Imágenes",
      colCalculators: "Calculadoras Financieras y Salud",
      colDevText: "Utilidades para Desarrolladores",
      colCompany: "Compañía y Legal",
      categoryHubs: "Centros de Categorías",
      softwareAlternatives: "Alternativas Gratuitas de Software",
      multilingualEditions: "Ediciones Globales e Idiomas",
      privacyPolicy: "Política de Privacidad",
      termsOfService: "Términos de Servicio",
      allRightsReserved: "Todos los derechos reservados.",
      madeWithLove: "por una web más simple.",
    },
  },
  pt: {
    nav: {
      home: "Início",
      about: "Sobre",
      blog: "Blog",
      contact: "Contato",
      searchPlaceholder: "Pesquisar ferramentas...",
      exploreTools: "Explorar Ferramentas",
      switchLanguage: "Alterar Idioma",
    },
    toolLayout: {
      embedWidget: "Incorporar Widget",
      keyTakeawayTitle: "Resumo Rápido e Principais Destaques",
      pricingLabel: "Preço",
      pricingValue: "100% Grátis Sempre",
      privacyLabel: "Privacidade",
      privacyValue: "Zero Retenção",
      accountLabel: "Conta",
      accountValue: "Sem Cadastro",
      executionLabel: "Execução",
      executionValue: "Instantânea na Memória",
      howToUsePrefix: "Como usar",
      faqTitle: "Perguntas Frequentes",
      tutorialsBadge: "Tutoriais Completos",
      tutorialsTitle: "Guias e Tutoriais Detalhados",
      tutorialsSubtitle: "Domine técnicas avançadas, fluxos de trabalho e melhores práticas.",
      readGuide: "Ler Guia",
      relatedToolsTitle: "Ferramentas Relacionadas",
      breadcrumbHome: "Início",
      defaultSummaryTemplate: (title, description) =>
        `${title} é um utilitário online gratuito e privado projetado para ${description.toLowerCase().replace(/^(um|uma|o|a)\s+/, "")}. Processa arquivos com zero retenção de dados, velocidade instantânea, sem marcas d'água e sem necessidade de cadastro.`,
    },
    fileUploader: {
      dragAndDrop: "Arraste e solte seus arquivos aqui, ou clique para navegar",
      clickToBrowse: "clique para navegar",
      pasteWith: ", ou cole com",
      processingComplete: "Processamento Concluído!",
      readyForDownload: "Seu arquivo está pronto para download.",
      downloadResult: "Baixar Resultado",
      convertAnother: "Converter outro arquivo",
      startProcessing: "Iniciar Processamento",
      processing: "Processando...",
      selectFileError: "Por favor selecione um arquivo primeiro",
      pasteSuccess: "Imagem colada da área de transferência",
    },
    ratingWidget: {
      rateThisTool: "Avalie esta ferramenta",
      ratingsCount: "avaliações",
      averageRating: "Classificação Média",
      thankYou: "Obrigado por avaliar!",
      submitting: "Enviando...",
      labels: {
        1: "1 - Poderia ser melhor",
        2: "2 - Precisa de melhorias",
        3: "3 - Bom utilitário",
        4: "4 - Muito útil!",
        5: "5 - Excelente! ⭐",
      },
    },
    crossPromo: {
      badge: "App Móvel Complementar",
      ctaButton: "Baixar para Android",
      getItOn: "Disponível no",
      googlePlay: "Google Play",
    },
    footer: {
      pitch: "Ferramentas online rápidas, elegantes e 100% seguras criadas para simplificar sua rotina digital. Sem cadastros ou assinaturas, com resultados instantâneos.",
      developerApps: "Mais Apps do Desenvolvedor",
      colPdfImage: "Ferramentas PDF e Imagens",
      colCalculators: "Calculadoras Financeiras e Saúde",
      colDevText: "Utilitários para Desenvolvedores",
      colCompany: "Empresa e Legal",
      categoryHubs: "Centros de Categorias",
      softwareAlternatives: "Alternativas Gratuitas a Softwares",
      multilingualEditions: "Edições Globais e Idiomas",
      privacyPolicy: "Política de Privacidade",
      termsOfService: "Termos de Serviço",
      allRightsReserved: "Todos os direitos reservados.",
      madeWithLove: "por uma web mais simples.",
    },
  },
};

export function getUIStrings(locale: Locale): UIStrings {
  return uiStrings[locale] || uiStrings.en;
}

export const getUiStrings = getUIStrings;
