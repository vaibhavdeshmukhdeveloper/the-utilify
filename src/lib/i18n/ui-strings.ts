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
  bmiCalculator: {
    title: string;
    calculateButton: string;
    categories: {
      underweight: string;
      normal: string;
      overweight: string;
      obese1: string;
      obese2: string;
      obese3: string;
    };
    healthyRange: string;
    invalidInput: string;
    validationMessage: string;
  };
  dateCalculator: {
    years: string;
    months: string;
    weeks: string;
    days: string;
    businessDays: string;
    weekendDays: string;
    totalDays: string;
    projectedDate: string;
  };
  ageCalculator: {
    exactAge: string;
    years: string;
    months: string;
    days: string;
    nextBirthday: string;
    happyBirthday: string;
    birthdayIn: (m: number, d: number) => string;
    milestones: string;
  };
  investmentCalculator: {
    tabs: {
      endAmount: string;
      contribution: string;
      startingAmount: string;
      returnRate: string;
      length: string;
    };
    labels: {
      targetAmount: string;
      startingAmount: string;
      additionalContribution: string;
      durationYears: string;
      returnRate: string;
      advancedSettings: string;
      compoundInterval: string;
      contributionTiming: string;
      beginning: string;
      end: string;
      ofEach: string;
      month: string;
      year: string;
      frequencies: {
        annually: string;
        semiannually: string;
        quarterly: string;
        monthly: string;
        daily: string;
      };
      projectWealthButton: string;
      resetButton: string;
    };
    results: {
      totalFutureWealth: string;
      neededContribution: string;
      neededStartingAmount: string;
      neededReturnRate: string;
      neededLength: string;
      startingPrincipal: string;
      totalContributions: string;
      totalInterest: string;
      totalLoss: string;
      targetBalance: string;
      yearsAndMonths: (y: number, m: number) => string;
      yearsOnly: (y: number) => string;
      yearlyBreakdownTitle: string;
      projectionFor: (y: string) => string;
      shareLink: string;
      exportCsv: string;
      readyToPlanTitle: string;
      readyToPlanDesc: string;
      startPrompt: string;
    };
  };
  sipCalculator: {
    badge: string;
    monthlyAmount: string;
    years: string;
    rate: string;
    advancedSettings: string;
    compoundFrequency: string;
    annually: string;
    monthly: string;
    contributionTiming: string;
    beginning: string;
    end: string;
    calculateButton: string;
    totalEstimatedValue: string;
    totalInvested: string;
    wealthGain: string;
    totalLoss: string;
    yearlyProjection: string;
    yearlyProjectionDesc: string;
    shareLink: string;
    exportCsv: string;
    yearHeader: string;
    investedHeader: string;
    interestHeader: string;
    balanceHeader: string;
    yearPrefix: string;
    startPlanTitle: string;
    startPlanDesc: string;
    calculateNow: string;
    csvYear: string;
    csvInvested: string;
    csvInterest: string;
    csvBalance: string;
    negativeRateWarning: string;
  };
  fireCalculator: {
    annualExpenses: string;
    currentNetWorth: string;
    monthlySavings: string;
    expectedReturn: string;
    expectedInflation: string;
    swr: string;
    copyPlan: string;
    copied: string;
    fireTargetTitle: string;
    estimatedTimeToFire: string;
    years: string;
    currentProgress: string;
    annualPassiveIncome: string;
    realReturnRate: string;
    expectedRetirementDate: string;
    milestoneTiers: string;
    leanFire: string;
    standardFire: string;
    fatFire: string;
    baristaFire: string;
    resetButton: string;
    statusAlreadyMet: string;
    statusExceeds100: string;
    statusInvalidExpenses: string;
    statusNegativeSavings: string;
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
    bmiCalculator: {
      title: "Your Body Mass Index (BMI)",
      calculateButton: "Calculate BMI",
      categories: {
        underweight: "Underweight",
        normal: "Normal weight",
        overweight: "Overweight",
        obese1: "Obese Class I",
        obese2: "Obese Class II",
        obese3: "Obese Class III",
      },
      healthyRange: "Healthy BMI Range: 18.5 – 24.9",
      invalidInput: "Invalid Input",
      validationMessage: "Please enter positive numbers greater than zero for weight and height.",
    },
    dateCalculator: {
      years: "Years",
      months: "Months",
      weeks: "Weeks",
      days: "Days",
      businessDays: "Business Days",
      weekendDays: "Weekend Days",
      totalDays: "Total Days",
      projectedDate: "Projected Date",
    },
    ageCalculator: {
      exactAge: "Exact Age",
      years: "years",
      months: "months",
      days: "days",
      nextBirthday: "Next Birthday Countdown",
      happyBirthday: "🎉 Happy Birthday! today is the day!",
      birthdayIn: (m: number, d: number) => `Your birthday is in ${m} months and ${d} days.`,
      milestones: "Lived Cumulative Milestones",
    },
    investmentCalculator: {
      tabs: {
        endAmount: "End Amount",
        contribution: "Contribute Amount",
        startingAmount: "Starting Amount",
        returnRate: "Return Rate",
        length: "Invest Length",
      },
      labels: {
        targetAmount: "Your Target (End Amount)",
        startingAmount: "Starting Amount",
        additionalContribution: "Additional Contribution",
        durationYears: "Duration (Years)",
        returnRate: "Return Rate (%)",
        advancedSettings: "Advanced Compounding & Timing",
        compoundInterval: "Compounding Interval",
        contributionTiming: "Contribute at the",
        beginning: "beginning",
        end: "end",
        ofEach: "of each",
        month: "month",
        year: "year",
        frequencies: {
          annually: "Annually",
          semiannually: "Semiannually",
          quarterly: "Quarterly",
          monthly: "Monthly",
          daily: "Daily",
        },
        projectWealthButton: "Calculate Projection",
        resetButton: "Reset",
      },
      results: {
        totalFutureWealth: "Total Future Wealth",
        neededContribution: "Required Contribution",
        neededStartingAmount: "Required Starting Capital",
        neededReturnRate: "Required Annual Return",
        neededLength: "Required Time Horizon",
        startingPrincipal: "Starting Capital",
        totalContributions: "Total Contributions",
        totalInterest: "Total Interest Earned",
        totalLoss: "Total Loss",
        targetBalance: "Target End Balance",
        yearsAndMonths: (y: number, m: number) => m > 0 ? `${y} Years and ${m} Months` : `${y} Years`,
        yearsOnly: (y: number) => `${y} Years`,
        yearlyBreakdownTitle: "Yearly Breakdown",
        projectionFor: (y: string) => `Growth projection for ${y} years`,
        shareLink: "Share Link",
        exportCsv: "Export CSV",
        readyToPlanTitle: "Ready to plan?",
        readyToPlanDesc: "Enter your investment parameters and click Calculate Projection to see your wealth trajectory.",
        startPrompt: "Start by entering an amount",
      },
    },
    sipCalculator: {
      badge: "Systematic Investment Plan Compounding Simulator",
      monthlyAmount: "Monthly SIP Amount",
      years: "Years",
      rate: "Rate (%)",
      advancedSettings: "Advanced Settings",
      compoundFrequency: "Compounding Frequency",
      annually: "Annually",
      monthly: "Monthly",
      contributionTiming: "Contribution Timing",
      beginning: "Beginning",
      end: "End",
      calculateButton: "Calculate Growth",
      totalEstimatedValue: "Total Estimated Value",
      totalInvested: "Total Invested",
      wealthGain: "Wealth Gain",
      totalLoss: "Total Loss",
      yearlyProjection: "Yearly Projection",
      yearlyProjectionDesc: "See how your portfolio grows year after year",
      shareLink: "Share Link",
      exportCsv: "Export CSV",
      yearHeader: "Year",
      investedHeader: "Invested",
      interestHeader: "Interest",
      balanceHeader: "Balance",
      yearPrefix: "Year",
      startPlanTitle: "Start Your SIP Plan",
      startPlanDesc: "Enter your monthly contribution and expected returns on the left to generate your wealth projection.",
      calculateNow: "Calculate now",
      csvYear: "Year",
      csvInvested: "Invested Principal",
      csvInterest: "Interest Earned",
      csvBalance: "Total Balance",
      negativeRateWarning: "A negative return rate simulates portfolio capital loss / market downturn.",
    },
    fireCalculator: {
      annualExpenses: "Annual Living Expenses",
      currentNetWorth: "Current Net Worth",
      monthlySavings: "Monthly Savings",
      expectedReturn: "Expected Return (CAGR %)",
      expectedInflation: "Expected Inflation (%)",
      swr: "Safe Withdrawal Rate (SWR %)",
      copyPlan: "Share / Copy FIRE Plan",
      copied: "FIRE Plan Copied!",
      fireTargetTitle: "Target FIRE Number",
      estimatedTimeToFire: "Estimated Time to FIRE",
      years: "Years",
      currentProgress: "Current Progress",
      annualPassiveIncome: "Annual Passive Income",
      realReturnRate: "Real Return Rate (Inflation-Adjusted)",
      expectedRetirementDate: "Target Retirement Date",
      milestoneTiers: "FIRE Milestone Tiers",
      leanFire: "Lean FIRE (75% Spending)",
      standardFire: "Standard FIRE (100% Spending)",
      fatFire: "Fat FIRE (125% Spending)",
      baristaFire: "Barista FIRE (50% Spending)",
      resetButton: "Reset to Default",
      statusAlreadyMet: "🎉 Congratulations! Your current portfolio already meets or exceeds your FIRE target.",
      statusExceeds100: "Target horizon exceeds 100 years at your current contribution and growth rate.",
      statusInvalidExpenses: "Please specify your annual retirement living expenses.",
      statusNegativeSavings: "⚠️ With ongoing withdrawals or negative savings, your portfolio decreases and cannot reach the target.",
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
    bmiCalculator: {
      title: "Tu Índice de Masa Corporal (IMC)",
      calculateButton: "Calcular IMC",
      categories: {
        underweight: "Bajo peso",
        normal: "Peso normal",
        overweight: "Sobrepeso",
        obese1: "Obesidad Clase I",
        obese2: "Obesidad Clase II",
        obese3: "Obesidad Clase III",
      },
      healthyRange: "Rango de IMC saludable: 18.5 – 24.9",
      invalidInput: "Entrada Inválida",
      validationMessage: "Por favor ingresa números positivos mayores a cero para peso y altura.",
    },
    dateCalculator: {
      years: "Años",
      months: "Meses",
      weeks: "Semanas",
      days: "Días",
      businessDays: "Días laborables",
      weekendDays: "Días de fin de semana",
      totalDays: "Días totales",
      projectedDate: "Fecha proyectada",
    },
    ageCalculator: {
      exactAge: "Edad Exacta",
      years: "años",
      months: "meses",
      days: "días",
      nextBirthday: "Cuenta Regresiva para el Próximo Cumpleaños",
      happyBirthday: "🎉 ¡Feliz Cumpleaños! ¡Hoy es el día!",
      birthdayIn: (m: number, d: number) => `Tu cumpleaños es en ${m} meses y ${d} días.`,
      milestones: "Hitos Acumulados Vividos",
    },
    investmentCalculator: {
      tabs: {
        endAmount: "Monto Final",
        contribution: "Aporte Periódico",
        startingAmount: "Capital Inicial",
        returnRate: "Tasa de Retorno",
        length: "Plazo de Inversión",
      },
      labels: {
        targetAmount: "Tu Monto Objetivo (Final)",
        startingAmount: "Capital Inicial",
        additionalContribution: "Aporte Adicional",
        durationYears: "Duración (Años)",
        returnRate: "Tasa de Retorno (%)",
        advancedSettings: "Capitalización Avanzada y Tiempos",
        compoundInterval: "Frecuencia de Capitalización",
        contributionTiming: "Aportar al",
        beginning: "inicio",
        end: "final",
        ofEach: "de cada",
        month: "mes",
        year: "año",
        frequencies: {
          annually: "Anual",
          semiannually: "Semestral",
          quarterly: "Trimestral",
          monthly: "Mensual",
          daily: "Diario",
        },
        projectWealthButton: "Calcular Proyección",
        resetButton: "Restablecer",
      },
      results: {
        totalFutureWealth: "Patrimonio Futuro Total",
        neededContribution: "Aporte Periódico Necesario",
        neededStartingAmount: "Capital Inicial Necesario",
        neededReturnRate: "Tasa de Rendimiento Necesaria",
        neededLength: "Plazo de Inversión Necesario",
        startingPrincipal: "Capital Inicial",
        totalContributions: "Aportes Totales",
        totalInterest: "Interés Total Generado",
        totalLoss: "Pérdida Total",
        targetBalance: "Saldo Final Objetivo",
        yearsAndMonths: (y: number, m: number) => m > 0 ? `${y} Años y ${m} Meses` : `${y} Años`,
        yearsOnly: (y: number) => `${y} Años`,
        yearlyBreakdownTitle: "Desglose Año por Año",
        projectionFor: (y: string) => `Proyección de crecimiento para ${y} años`,
        shareLink: "Compartir Enlace",
        exportCsv: "Exportar CSV",
        readyToPlanTitle: "¿Listo para planificar?",
        readyToPlanDesc: "Ingresa los parámetros de tu inversión y haz clic en Calcular Proyección para ver la trayectoria.",
        startPrompt: "Comienza ingresando un monto",
      },
    },
    sipCalculator: {
      badge: "Simulador de Crecimiento Compuesto de Plan SIP",
      monthlyAmount: "Monto Mensual SIP",
      years: "Años",
      rate: "Tasa (%)",
      advancedSettings: "Configuración Avanzada",
      compoundFrequency: "Frecuencia de Capitalización",
      annually: "Anual",
      monthly: "Mensual",
      contributionTiming: "Momento del Aporte",
      beginning: "Inicio",
      end: "Fin",
      calculateButton: "Calcular Crecimiento",
      totalEstimatedValue: "Valor Total Estimado",
      totalInvested: "Capital Invertido",
      wealthGain: "Ganancia de Capital",
      totalLoss: "Pérdida Total",
      yearlyProjection: "Proyección Anual",
      yearlyProjectionDesc: "Descubre cómo evoluciona tu patrimonio año tras año",
      shareLink: "Compartir Enlace",
      exportCsv: "Exportar CSV",
      yearHeader: "Año",
      investedHeader: "Invertido",
      interestHeader: "Interés",
      balanceHeader: "Saldo Total",
      yearPrefix: "Año",
      startPlanTitle: "Inicia tu Plan SIP",
      startPlanDesc: "Ingresa tu aporte mensual y rentabilidad esperada a la izquierda para proyectar tu patrimonio.",
      calculateNow: "Calcular ahora",
      csvYear: "Año",
      csvInvested: "Capital Invertido",
      csvInterest: "Interés Generado",
      csvBalance: "Saldo Total",
      negativeRateWarning: "Una tasa de rentabilidad negativa simula pérdida de capital o caída del mercado.",
    },
    fireCalculator: {
      annualExpenses: "Gastos Anuales de Vida",
      currentNetWorth: "Patrimonio Neto Actual",
      monthlySavings: "Ahorro Mensual",
      expectedReturn: "Rentabilidad Esperada (CAGR %)",
      expectedInflation: "Inflación Esperada (%)",
      swr: "Tasa de Retiro Seguro (SWR %)",
      copyPlan: "Compartir / Copiar Plan FIRE",
      copied: "¡Plan FIRE Copiado!",
      fireTargetTitle: "Monto Objetivo FIRE",
      estimatedTimeToFire: "Tiempo Estimado para FIRE",
      years: "Años",
      currentProgress: "Progreso Actual",
      annualPassiveIncome: "Ingreso Pasivo Anual",
      realReturnRate: "Rentabilidad Real (Ajustada por Inflación)",
      expectedRetirementDate: "Fecha Objetivo de Retiro",
      milestoneTiers: "Niveles y Variantes FIRE",
      leanFire: "Lean FIRE (75% de Gasto)",
      standardFire: "Standard FIRE (100% de Gasto)",
      fatFire: "Fat FIRE (125% de Gasto)",
      baristaFire: "Barista FIRE (50% de Gasto)",
      resetButton: "Restablecer Valores",
      statusAlreadyMet: "🎉 ¡Felicitaciones! Tu patrimonio actual ya alcanza o supera tu objetivo FIRE.",
      statusExceeds100: "El horizonte estimado supera los 100 años con el ritmo de ahorro y rendimiento actual.",
      statusInvalidExpenses: "Por favor especifica tus gastos anuales de vida en el retiro.",
      statusNegativeSavings: "⚠️ Con retiros continuos o ahorro negativo, el patrimonio disminuye y no alcanzará el objetivo.",
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
    bmiCalculator: {
      title: "Seu Índice de Massa Corporal (IMC)",
      calculateButton: "Calcular IMC",
      categories: {
        underweight: "Abaixo do peso",
        normal: "Peso normal",
        overweight: "Sobrepeso",
        obese1: "Obesidade Grau I",
        obese2: "Obesidade Grau II",
        obese3: "Obesidade Grau III",
      },
      healthyRange: "Faixa de IMC saudável: 18.5 – 24.9",
      invalidInput: "Entrada Inválida",
      validationMessage: "Por favor insira números positivos maiores que zero para peso e altura.",
    },
    dateCalculator: {
      years: "Anos",
      months: "Meses",
      weeks: "Semanas",
      days: "Dias",
      businessDays: "Dias úteis",
      weekendDays: "Fins de semana",
      totalDays: "Dias totais",
      projectedDate: "Data projetada",
    },
    ageCalculator: {
      exactAge: "Idade Exata",
      years: "anos",
      months: "meses",
      days: "dias",
      nextBirthday: "Contagem Regressiva para o Próximo Aniversário",
      happyBirthday: "🎉 Feliz Aniversário! Hoje é o dia!",
      birthdayIn: (m: number, d: number) => `Seu aniversário é em ${m} meses e ${d} dias.`,
      milestones: "Marcos Cumulativos Vividos",
    },
    investmentCalculator: {
      tabs: {
        endAmount: "Montante Final",
        contribution: "Contribuição Periódica",
        startingAmount: "Capital Inicial",
        returnRate: "Taxa de Retorno",
        length: "Prazo de Investimento",
      },
      labels: {
        targetAmount: "Seu Montante Alvo (Final)",
        startingAmount: "Capital Inicial",
        additionalContribution: "Contribuição Adicional",
        durationYears: "Duração (Anos)",
        returnRate: "Taxa de Retorno (%)",
        advancedSettings: "Capitalização Avançada e Prazos",
        compoundInterval: "Frequência de Capitalização",
        contributionTiming: "Contribuir no",
        beginning: "início",
        end: "fim",
        ofEach: "de cada",
        month: "mês",
        year: "ano",
        frequencies: {
          annually: "Anual",
          semiannually: "Semestral",
          quarterly: "Trimestral",
          monthly: "Mensal",
          daily: "Diário",
        },
        projectWealthButton: "Calcular Projeção",
        resetButton: "Redefinir",
      },
      results: {
        totalFutureWealth: "Patrimônio Futuro Total",
        neededContribution: "Contribuição Periódica Necessária",
        neededStartingAmount: "Capital Inicial Necessário",
        neededReturnRate: "Taxa de Retorno Necessária",
        neededLength: "Prazo de Investimento Necessário",
        startingPrincipal: "Capital Inicial",
        totalContributions: "Contribuições Totais",
        totalInterest: "Total de Juros Acumulados",
        totalLoss: "Perda Total",
        targetBalance: "Saldo Final Alvo",
        yearsAndMonths: (y: number, m: number) => m > 0 ? `${y} Anos e ${m} Meses` : `${y} Anos`,
        yearsOnly: (y: number) => `${y} Anos`,
        yearlyBreakdownTitle: "Detalhamento Ano a Ano",
        projectionFor: (y: string) => `Projeção de crescimento para ${y} anos`,
        shareLink: "Compartilhar Link",
        exportCsv: "Exportar CSV",
        readyToPlanTitle: "Pronto para planejar?",
        readyToPlanDesc: "Insira os parâmetros do seu investimento e clique em Calcular Projeção para ver a evolução.",
        startPrompt: "Comece inserindo um valor",
      },
    },
    sipCalculator: {
      badge: "Simulador de Juros Compostos de Plano SIP",
      monthlyAmount: "Valor Mensal do Aporte SIP",
      years: "Anos",
      rate: "Taxa (%)",
      advancedSettings: "Configurações Avançadas",
      compoundFrequency: "Frequência de Capitalização",
      annually: "Anual",
      monthly: "Mensal",
      contributionTiming: "Momento do Aporte",
      beginning: "Início",
      end: "Fim",
      calculateButton: "Calcular Crescimento",
      totalEstimatedValue: "Valor Total Estimado",
      totalInvested: "Capital Investido",
      wealthGain: "Ganho Patrimonial",
      totalLoss: "Perda Total",
      yearlyProjection: "Projeção Ano a Ano",
      yearlyProjectionDesc: "Acompanhe como seu patrimônio evolui com o passar dos anos",
      shareLink: "Compartilhar Link",
      exportCsv: "Exportar CSV",
      yearHeader: "Ano",
      investedHeader: "Investido",
      interestHeader: "Juros",
      balanceHeader: "Saldo Total",
      yearPrefix: "Ano",
      startPlanTitle: "Inicie seu Plano SIP",
      startPlanDesc: "Insira seu aporte mensal e rentabilidade esperada à esquerda para gerar sua projeção.",
      calculateNow: "Calcular agora",
      csvYear: "Ano",
      csvInvested: "Capital Investido",
      csvInterest: "Juros Acumulados",
      csvBalance: "Saldo Total",
      negativeRateWarning: "Uma taxa de retorno negativa simula perda de capital ou desvalorização de mercado.",
    },
    fireCalculator: {
      annualExpenses: "Despesas Anuais de Custo de Vida",
      currentNetWorth: "Patrimônio Líquido Atual",
      monthlySavings: "Aporte Mensal",
      expectedReturn: "Rentabilidade Esperada (CAGR %)",
      expectedInflation: "Inflação Esperada (%)",
      swr: "Taxa Segura de Retirada (SWR %)",
      copyPlan: "Compartilhar / Copiar Plano FIRE",
      copied: "Plano FIRE Copiado!",
      fireTargetTitle: "Meta de Patrimônio FIRE",
      estimatedTimeToFire: "Tempo Estimado até o FIRE",
      years: "Anos",
      currentProgress: "Progresso Atual",
      annualPassiveIncome: "Renda Passiva Anual",
      realReturnRate: "Rentabilidade Real (Ajustada pela Inflação)",
      expectedRetirementDate: "Data Alvo de Aposentadoria",
      milestoneTiers: "Marcos e Modalidades FIRE",
      leanFire: "Lean FIRE (75% dos Gastos)",
      standardFire: "Standard FIRE (100% dos Gastos)",
      fatFire: "Fat FIRE (125% dos Gastos)",
      baristaFire: "Barista FIRE (50% dos Gastos)",
      resetButton: "Restaurar Padrão",
      statusAlreadyMet: "🎉 Parabéns! Seu patrimônio atual já atinge ou supera a sua meta FIRE.",
      statusExceeds100: "O horizonte estimado ultrapassa 100 anos com seu ritmo de poupança e rentabilidade atual.",
      statusInvalidExpenses: "Por favor informe suas despesas anuais de custo de vida na aposentadoria.",
      statusNegativeSavings: "⚠️ Com resgates contínuos ou poupança negativa, o patrimônio diminui e não atinge o objetivo.",
    },
  },
};

export function getUIStrings(locale: Locale): UIStrings {
  return uiStrings[locale] || uiStrings.en;
}

export const getUiStrings = getUIStrings;
