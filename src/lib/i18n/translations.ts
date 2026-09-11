export type Language = "es" | "pt";

export const SUPPORTED_LANGUAGES: Language[] = ["es", "pt"];

export interface ToolTranslation {
  slug: string;
  name: string;
  title: string;
  description: string;
  category: string;
  summaryDefinition?: string;
  features: string[];
  howToUse: { step: string; description: string }[];
  faqs: { question: string; answer: string }[];
}

export interface HubTranslation {
  lang: Language;
  langName: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  searchPlaceholder: string;
  allCategories: string;
  categories: {
    pdf: string;
    image: string;
    calculators: string;
    developer: string;
  };
  privacyTitle: string;
  privacySubtitle: string;
  launchTool: string;
}

export const hubTranslations: Record<Language, HubTranslation> = {
  es: {
    lang: "es",
    langName: "Español",
    heroBadge: "100% Gratis • Sin Registro • Privacidad Total",
    heroTitle: "Herramientas en Línea Gratuitas y Privadas",
    heroSubtitle: "La suite definitiva de utilidades para PDF, edición de imágenes, calculadoras financieras y herramientas para desarrolladores. Ejecución directa en tu navegador.",
    searchPlaceholder: "Buscar herramientas (ej. unir pdf, comprimir, quitar fondo)...",
    allCategories: "Todas las Herramientas",
    categories: {
      pdf: "Herramientas PDF",
      image: "Edición de Imágenes",
      calculators: "Calculadoras",
      developer: "Desarrollo y Texto",
    },
    privacyTitle: "Arquitectura con Cero Retención de Datos",
    privacySubtitle: "Tus documentos e imágenes se procesan en la memoria de tu navegador o en transmisiones RAM transitorias. Nunca almacenamos tus archivos en servidores.",
    launchTool: "Abrir Herramienta",
  },
  pt: {
    lang: "pt",
    langName: "Português",
    heroBadge: "100% Grátis • Sem Cadastro • Privacidade Total",
    heroTitle: "Ferramentas Online Gratuitas e Privadas",
    heroSubtitle: "A suite definitiva de utilitários para PDF, processamento de imagens, calculadoras financeiras e ferramentas para desenvolvedores. Execução direta no seu navegador.",
    searchPlaceholder: "Pesquisar ferramentas (ex. juntar pdf, comprimir, remover fundo)...",
    allCategories: "Todas as Ferramentas",
    categories: {
      pdf: "Ferramentas PDF",
      image: "Processamento de Imagens",
      calculators: "Calculadoras",
      developer: "Desenvolvimento e Texto",
    },
    privacyTitle: "Arquitetura com Zero Retenção de Dados",
    privacySubtitle: "Seus documentos e imagens são processados na memória do seu navegador ou em fluxos RAM temporários. Nunca salvamos seus arquivos em servidores.",
    launchTool: "Abrir Ferramenta",
  },
};

export const toolTranslations: Record<Language, Record<string, ToolTranslation>> = {
  es: {
    "merge-pdf": {
      slug: "merge-pdf",
      name: "Unir PDF",
      title: "Unir PDF Gratis Online - Combinar Archivos PDF en Segundos | Utilify",
      description: "Une múltiples documentos PDF en un solo archivo organizado de forma rápida, gratuita y segura. Sin límites de archivos y con total privacidad.",
      category: "PDF",
      features: ["Combinar ilimitados archivos PDF", "Reordenar páginas fácilmente", "Procesamiento en memoria seguro", "Sin marcas de agua"],
      howToUse: [
        { step: "Subir archivos PDF", description: "Selecciona o arrastra los documentos PDF que deseas combinar." },
        { step: "Organizar orden", description: "Reordena tus archivos arrastrándolos a la secuencia correcta." },
        { step: "Descargar PDF unido", description: "Haz clic en unir y descarga tu documento combinado al instante." },
      ],
      faqs: [
        { question: "¿Es gratis unir archivos PDF?", answer: "Sí, 100% gratis sin límites diarios ni marcas de agua." },
        { question: "¿Se guardan mis documentos?", answer: "No. Los archivos se procesan en la memoria RAM y se eliminan de inmediato." },
      ],
    },
    "split-pdf": {
      slug: "split-pdf",
      name: "Dividir PDF",
      title: "Dividir PDF Gratis Online - Extraer Páginas de Archivos PDF | Utilify",
      description: "Extrae páginas individuales o rangos específicos de tus archivos PDF gratis en línea. Ideal para contratos y extractos bancarios.",
      category: "PDF",
      features: ["Extraer rangos personalizados (ej. 1-3, 5)", "Separar páginas individuales", "Cero almacenamiento en disco", "Descarga instantánea"],
      howToUse: [
        { step: "Subir PDF", description: "Selecciona el documento PDF que deseas dividir." },
        { step: "Indicar páginas", description: "Escribe las páginas o rangos que deseas extraer (ej. 1-5, 8)." },
        { step: "Descargar", description: "Descarga el nuevo PDF con las páginas seleccionadas." },
      ],
      faqs: [
        { question: "¿Puedo extraer varias páginas a la vez?", answer: "Sí, puedes especificar cualquier combinación de páginas o rangos separados por comas." },
        { question: "¿Mis datos financieros están seguros?", answer: "Totalmente. El procesamiento es transitorio y confidencial." },
      ],
    },
    "background-remover": {
      slug: "background-remover",
      name: "Quitar Fondo con IA",
      title: "Quitar Fondo de Imágenes Gratis con IA - Fondo Transparente | Utilify",
      description: "Elimina el fondo de fotos, personas y productos automáticamente con inteligencia artificial de alta precisión. Descarga en PNG transparente en alta resolución.",
      category: "Imágenes",
      features: ["Segmentación neuronal con IA", "Exportación en PNG transparente en alta resolución", "Pincel interactivo para retoques", "Sin créditos ni suscripciones"],
      howToUse: [
        { step: "Subir foto", description: "Arrastra tu imagen (JPG, PNG o WebP) a la herramienta." },
        { step: "Recorte automático", description: "La inteligencia artificial aísla el sujeto principal en segundos." },
        { step: "Descargar PNG", description: "Descarga tu imagen con fondo transparente lista para usar." },
      ],
      faqs: [
        { question: "¿La descarga es en alta resolución?", answer: "Sí, a diferencia de otros sitios, exportamos la resolución original completa sin costo." },
        { question: "¿Funciona con productos y firmas?", answer: "Sí, el modelo reconoce personas, ropa, accesorios y objetos complejos." },
      ],
    },
    "image-compressor": {
      slug: "image-compressor",
      name: "Comprimir Imágenes",
      title: "Comprimir Imágenes Gratis Online - Reducir Tamaño JPG, PNG y WebP | Utilify",
      description: "Reduce el tamaño de tus fotos e imágenes hasta un 80% sin perder calidad visual. Compresión 100% local en tu navegador con descarga en ZIP.",
      category: "Imágenes",
      features: ["Compresión en tu navegador", "Soporta JPG, PNG y WebP", "Descarga individual o en lote ZIP", "Contador de ahorro en tiempo real"],
      howToUse: [
        { step: "Subir imágenes", description: "Selecciona una o varias imágenes de tu dispositivo." },
        { step: "Ajustar calidad", description: "Elige el nivel de compresión deseado con el control deslizante." },
        { step: "Descargar optimizadas", description: "Descarga tus imágenes individuales o en un archivo ZIP." },
      ],
      faqs: [
        { question: "¿Mis fotos se suben a un servidor?", answer: "No. Toda la compresión se realiza en el navegador de tu computadora o teléfono." },
        { question: "¿Conserva la transparencia PNG?", answer: "Sí, la transparencia del canal alfa se mantiene intacta." },
      ],
    },
    "sip-calculator": {
      slug: "sip-calculator",
      name: "Calculadora SIP",
      title: "Calculadora SIP Online - Interés Compuesto y Crecimiento de Inversiones | Utilify",
      description: "Calcula el rendimiento futuro de tus inversiones periódicas (SIP) y fondos indexados con fórmulas de interés compuesto y Step-Up.",
      category: "Calculadoras",
      features: ["Proyección de interés compuesto", "Simulación Step-Up anual", "Gráficos interactivos", "Fórmulas matemáticas detalladas"],
      howToUse: [
        { step: "Ingresar monto mensual", description: "Indica la cantidad que planeas invertir cada mes." },
        { step: "Tasa y plazo", description: "Establece el retorno anual esperado y los años de inversión." },
        { step: "Ver proyección", description: "Examina el capital acumulado y las ganancias compuestas." },
      ],
      faqs: [
        { question: "¿Qué es una inversión SIP?", answer: "Es un plan de inversión sistemática donde inviertes una suma fija periódicamente para promediar costos." },
        { question: "¿Cómo influye el Step-Up?", answer: "Incrementar tu aporte un 10% cada año acelera exponencialmente tu fondo final." },
      ],
    },
    "bmi-calculator": {
      slug: "bmi-calculator",
      name: "Calculadora de IMC",
      title: "Calculadora de IMC Gratis - Índice de Masa Corporal y Peso Saludable | Utilify",
      description: "Calcula tu Índice de Masa Corporal (IMC) al instante con el sistema métrico o imperial y descubre tu rango de peso saludable según la OMS.",
      category: "Calculadoras",
      features: ["Sistema métrico e imperial", "Clasificación oficial de la OMS", "Cálculo de peso saludable", "100% privado y confidencial"],
      howToUse: [
        { step: "Elige unidades", description: "Selecciona sistema métrico (kg/cm) o imperial (lb/in)." },
        { step: "Ingresa datos", description: "Escribe tu peso y estatura actuales." },
        { step: "Consulta tu IMC", description: "Visualiza tu categoría corporal y recomendaciones de peso." },
      ],
      faqs: [
        { question: "¿Qué significa el IMC?", answer: "Es una métrica estándar de la OMS que relaciona peso y altura para evaluar categorías nutricionales." },
        { question: "¿Aplica para atletas?", answer: "El IMC calcula promedios generales y no distingue directamente entre grasa y masa muscular." },
      ],
    },
    "qr-generator": {
      slug: "qr-generator",
      name: "Generador de Código QR",
      title: "Generador de Código QR Gratis - Crear QR para Wi-Fi, URL y Contactos | Utilify",
      description: "Crea códigos QR personalizados en alta resolución para páginas web, redes Wi-Fi, tarjetas vCard y correos. Descarga en PNG o vector SVG.",
      category: "Desarrollo",
      features: ["Códigos QR para Wi-Fi, URLs y vCard", "Niveles de corrección de error L/M/Q/H", "Colores personalizables", "Descargas en PNG y SVG"],
      howToUse: [
        { step: "Seleccionar tipo", description: "Elige si deseas compartir un enlace, red Wi-Fi o tarjeta de contacto." },
        { step: "Personalizar", description: "Ingresa los datos y ajusta los colores y nivel de corrección." },
        { step: "Descargar", description: "Obtén tu código QR en formato PNG o SVG para impresión." },
      ],
      faqs: [
        { question: "¿Los códigos QR expiran?", answer: "No. Son códigos QR estáticos que funcionan permanentemente sin límite de escaneos." },
        { question: "¿Qué resolución tienen?", answer: "Se descargan en alta definición y en SVG vectorial para imprimir en cualquier tamaño." },
      ],
    },
    "password-generator": {
      slug: "password-generator",
      name: "Generador de Contraseñas",
      title: "Generador de Contraseñas Seguras Online - Entropía Criptográfica | Utilify",
      description: "Genera contraseñas robustas e invulnerables con la API criptográfica nativa del navegador. Personaliza longitud, símbolos y números.",
      category: "Desarrollo",
      features: ["Criptografía local con crypto.getRandomValues", "Medidor de entropía en bits", "Generación de frases de paso", "Cero almacenamiento"],
      howToUse: [
        { step: "Elegir longitud", description: "Selecciona la cantidad de caracteres deseada (recomendado 16+)." },
        { step: "Opciones de caracteres", description: "Activa mayúsculas, minúsculas, números y símbolos." },
        { step: "Copiar contraseña", description: "Copia la contraseña segura generada al instante." },
      ],
      faqs: [
        { question: "¿Dónde se generan las contraseñas?", answer: "100% en tu dispositivo mediante algoritmos criptográficos del navegador." },
        { question: "¿Cuántos bits de entropía son recomendables?", answer: "128 bits o más garantiza protección total contra ataques de fuerza bruta." },
      ],
    },
    "json-formatter": {
      slug: "json-formatter",
      name: "Formateador de JSON",
      title: "Formateador y Validador de JSON Online - Pretty Print y Minify | Utilify",
      description: "Valida, formatea, embellece y minimiza datos JSON en tiempo real con detección de errores de sintaxis, ordenamiento de claves y números de línea.",
      category: "Desarrollo",
      features: ["Validación sintáctica en tiempo real", "Indentación personalizable (2/4 espacios o tabs)", "Minificación para optimizar APIs", "Copia con un clic"],
      howToUse: [
        { step: "Pegar JSON", description: "Pega tu código o carga un archivo JSON." },
        { step: "Validar y formatear", description: "El editor señala cualquier error de sintaxis al instante." },
        { step: "Copiar o descargar", description: "Exporta tu JSON embellecido o comprimido." },
      ],
      faqs: [
        { question: "¿Mi JSON se envía a un servidor?", answer: "No. Todo el análisis y formateo se ejecuta localmente en JavaScript." },
        { question: "¿Soporta grandes volúmenes de datos?", answer: "Sí, optimizado para procesar grandes payloads de API sin congelar el navegador." },
      ],
    },
    "date-calculator": {
      slug: "date-calculator",
      name: "Calculadora de Fechas",
      title: "Calculadora de Fechas y Días Hábiles Online | Utilify",
      description: "Calcula la diferencia exacta entre dos fechas o suma y resta días, semanas y meses para planificar proyectos y plazos de entrega.",
      category: "Calculadoras",
      features: ["Diferencia en días, semanas y meses", "Suma y resta de días", "Enlaces compartibles", "100% precisa"],
      howToUse: [
        { step: "Seleccionar fechas", description: "Elige la fecha inicial y la fecha final." },
        { step: "Calcular", description: "Obtén la duración total y desglose de tiempo." },
        { step: "Compartir", description: "Copia un enlace permanente con tu cálculo." },
      ],
      faqs: [
        { question: "¿Toma en cuenta años bisiestos?", answer: "Sí, todos los cálculos astronómicos y bisiestos se procesan con exactitud." },
        { question: "¿Puedo sumar días a una fecha?", answer: "Sí, usa la pestaña de sumar/restar para proyectar fechas de entrega." },
      ],
    },
    "word-counter": {
      slug: "word-counter",
      name: "Contador de Palabras",
      title: "Contador de Palabras y Caracteres Online - Tiempo de Lectura | Utilify",
      description: "Cuenta palabras, caracteres, oraciones y párrafos en tiempo real. Analiza el tiempo estimado de lectura y límites para redes sociales.",
      category: "Desarrollo",
      features: ["Conteo en vivo de palabras y caracteres", "Tiempo de lectura y oratoria", "Límites para redes sociales", "Análisis de palabras clave"],
      howToUse: [
        { step: "Escribir o pegar texto", description: "Coloca tu borrador en el editor." },
        { step: "Revisar métricas", description: "Consulta las estadísticas de extensión y lectura." },
        { step: "Ajustar longitud", description: "Monitorea barras de progreso para Twitter, LinkedIn e Instagram." },
      ],
      faqs: [
        { question: "¿Cómo calcula el tiempo de lectura?", answer: "Se basa en el promedio estándar de 200 a 250 palabras por minuto." },
        { question: "¿Es privado el texto que analizo?", answer: "Completamente. Tu texto nunca sale de tu navegador." },
      ],
    },
    "color-palette": {
      slug: "color-palette",
      name: "Generador de Paleta de Colores",
      title: "Generador de Paletas de Colores Online - Armonías y Contraste WCAG | Utilify",
      description: "Genera paletas de colores armónicas o extráelas desde tus imágenes. Verifica el contraste accesible según las normas WCAG.",
      category: "Imágenes",
      features: ["Extracción desde imágenes", "Esquemas complementarios y análogos", "Verificación de contraste WCAG", "Exportación a CSS y Tailwind"],
      howToUse: [
        { step: "Generar o subir", description: "Presiona la barra espaciadora para generar o sube tu logo." },
        { step: "Revisar contraste", description: "Comprueba las etiquetas de accesibilidad AA y AAA." },
        { step: "Copiar códigos", description: "Exporta en valores HEX, RGB o variables CSS." },
      ],
      faqs: [
        { question: "¿Qué son los contrastes WCAG?", answer: "Son pautas internacionales que garantizan que el texto sea legible para todas las personas." },
        { question: "¿Puedo exportar para Tailwind CSS?", answer: "Sí, genera tokens de diseño listos para pegar en tu configuración." },
      ],
    },
    "pdf-to-image": {
      slug: "pdf-to-image",
      name: "PDF a Imágenes",
      title: "Convertir PDF a Imágenes PNG Gratis Online | Utilify",
      description: "Convierte páginas de documentos PDF en imágenes PNG de alta resolución (150 DPI) gratis en tu navegador. Descarga en un archivo ZIP sin registros.",
      category: "PDF",
      features: ["Conversión a 150 DPI de alta nitidez", "Descarga de páginas en archivo ZIP", "Cero almacenamiento en servidor", "100% gratuito"],
      howToUse: [
        { step: "Subir PDF", description: "Selecciona el documento PDF que deseas convertir." },
        { step: "Procesar páginas", description: "El sistema convierte cada página en una imagen PNG en alta definición." },
        { step: "Descargar ZIP", description: "Descarga todas las imágenes empaquetadas en un archivo ZIP." },
      ],
      faqs: [
        { question: "¿Qué resolución tienen las imágenes exportadas?", answer: "Se exportan a 150 DPI con texto e ilustraciones completamente nítidos." },
        { question: "¿Mis archivos se guardan en la nube?", answer: "No. El procesamiento es transitorio en la memoria y se elimina al instante." },
      ],
    },
    "investment-calculator": {
      slug: "investment-calculator",
      name: "Calculadora de Inversiones",
      title: "Calculadora de Crecimiento de Inversiones e Interés Compuesto | Utilify",
      description: "Proyecta el crecimiento de tu capital inicial sumado a aportaciones mensuales recurrentes con interés compuesto diario, mensual, trimestral o anual.",
      category: "Calculadoras",
      features: ["Capital inicial y aportes periódicos", "Frecuencias diaria, mensual, trimestral y anual", "Desglose año por año en tabla y CSV", "Visualización de riqueza futura"],
      howToUse: [
        { step: "Capital inicial", description: "Ingresa la suma de dinero con la que inicias tu inversión." },
        { step: "Aportes y rentabilidad", description: "Define el aporte mensual, tasa de interés anual y plazo en años." },
        { step: "Ver proyección", description: "Analiza el capital acumulado, los intereses ganados y exporta a CSV." },
      ],
      faqs: [
        { question: "¿Cuál es la diferencia con la Calculadora SIP?", answer: "La calculadora de inversiones modela un capital inicial fuerte combinado con depósitos mensuales y múltiples frecuencias de capitalización." },
        { question: "¿Cómo influye la frecuencia de capitalización?", answer: "A mayor frecuencia de reinversión (por ejemplo diaria o mensual vs anual), mayor es el rendimiento compuesto final." },
      ],
    },
    "fire-calculator": {
      slug: "fire-calculator",
      name: "Calculadora FIRE",
      title: "Calculadora FIRE - Libertad Financiera y Retiro Anticipado | Utilify",
      description: "Calcula tu número FIRE para alcanzar la independencia financiera y el retiro anticipado con la regla del 4% y retorno real ajustado por inflación.",
      category: "Calculadoras",
      features: ["Cálculo del número FIRE con regla del 4%", "Tiers Lean FIRE (75%) y Fat FIRE (125%)", "Ajuste por inflación según ecuación de Fisher", "Tiempo estimado para jubilarse"],
      howToUse: [
        { step: "Gastos anuales", description: "Ingresa tus gastos anuales estimados durante la jubilación." },
        { step: "Ahorro y rentabilidad", description: "Configura tu patrimonio actual, ahorro mensual e inflación esperada." },
        { step: "Revisar objetivos", description: "Descubre tu fecha meta de retiro y los hitos Lean, Estándar y Fat FIRE." },
      ],
      faqs: [
        { question: "¿Qué es la regla del 4%?", answer: "Establece que puedes retirar el 4% de tu cartera en el primer año y ajustarlo por inflación anualmente con alta probabilidad de no agotar los fondos en 30 años." },
        { question: "¿Cómo se calcula el número FIRE?", answer: "Se calcula dividiendo tus gastos anuales entre tu tasa de retiro seguro (por ejemplo gastos × 25 para el 4%)." },
      ],
    },
    "age-calculator": {
      slug: "age-calculator",
      name: "Calculadora de Edad",
      title: "Calculadora de Edad Exacta Online - Años, Meses, Días y Minutos | Utilify",
      description: "Calcula tu edad cronológica exacta en años, meses, días, horas y segundos. Descubre la cuenta regresiva para tu próximo cumpleaños y estadísticas de vida.",
      category: "Calculadoras",
      features: ["Edad cronológica exacta en tiempo real", "Cuenta regresiva para el próximo cumpleaños", "Desglose en semanas, días, horas y minutos", "Precisión con años bisiestos"],
      howToUse: [
        { step: "Fecha de nacimiento", description: "Selecciona tu día, mes y año de nacimiento." },
        { step: "Fecha de comparación", description: "Usa la fecha actual o selecciona una fecha objetivo en el calendario." },
        { step: "Ver estadísticas", description: "Observa tu edad en vivo con desglose completo de tiempo vivido." },
      ],
      faqs: [
        { question: "¿Calcula con precisión los años bisiestos?", answer: "Sí, contabiliza los 366 días de cada año bisiesto transcurrido." },
        { question: "¿Puedo calcular la edad en una fecha pasada o futura?", answer: "Sí, puedes cambiar la fecha objetivo para saber qué edad tenías o tendrás en cualquier momento." },
      ],
    },
    "unit-converter": {
      slug: "unit-converter",
      name: "Conversor de Unidades",
      title: "Conversor de Unidades Online - Longitud, Peso, Temperatura y Volumen | Utilify",
      description: "Convierte entre unidades de medida métricas e imperiales al instante: metros, pies, kilogramos, libras, grados Celsius, Fahrenheit, litros y galones.",
      category: "Desarrollo",
      features: ["Conversión métrica e imperial", "Longitud, peso, temperatura, área y volumen", "Tabla comparativa de todas las unidades", "Alta precisión matemática"],
      howToUse: [
        { step: "Seleccionar magnitud", description: "Elige entre longitud, peso, temperatura, área o volumen." },
        { step: "Ingresar valor", description: "Escribe la cantidad que deseas convertir." },
        { step: "Ver equivalencias", description: "Consulta el resultado y la tabla con todas las unidades correspondientes." },
      ],
      faqs: [
        { question: "¿Cómo se calcula la temperatura?", answer: "Aplica las fórmulas exactas de Celsius a Fahrenheit (°F = °C × 1.8 + 32) y Kelvin." },
        { question: "¿Las conversiones son estándar internacional?", answer: "Sí, se basan en las constantes oficiales del Sistema Internacional de Unidades (SI)." },
      ],
    },
    "px-to-rem": {
      slug: "px-to-rem",
      name: "Conversor PX a REM",
      title: "Conversor PX a REM Online - Tipografía Fluida CSS clamp() y Tailwind | Utilify",
      description: "Convierte píxeles (px) a unidades relativas REM, EM y PT al instante. Genera código CSS clamp() para tipografía fluida y consulta tokens de Tailwind.",
      category: "Desarrollo",
      features: ["Conversión bidireccional PX ↔ REM", "Generador de tipografía fluida CSS clamp()", "Tabla de tokens de Tailwind CSS v4", "Accesibilidad web WCAG"],
      howToUse: [
        { step: "Tamaño base raíz", description: "Confirma el tamaño base de la fuente (por defecto 16px)." },
        { step: "Ingresar píxeles", description: "Escribe el valor en px para obtener su equivalente en rem." },
        { step: "Copiar clamp()", description: "Copia la función CSS clamp() para textos responsive sin media queries." },
      ],
      faqs: [
        { question: "¿Por qué usar REM en vez de PX?", answer: "Las unidades REM respetan las preferencias de accesibilidad y zoom del navegador del usuario." },
        { question: "¿Cómo funciona la fórmula de clamp()?", answer: "Calcula una función lineal fluida entre el ancho mínimo y máximo de pantalla." },
      ],
    },
    "base64": {
      slug: "base64",
      name: "Codificador Base64",
      title: "Codificador y Decodificador Base64 Gratis Online | Utilify",
      description: "Codifica y decodifica texto y archivos binarios a formato Base64 con soporte completo para caracteres UTF-8. 100% privado en tu navegador.",
      category: "Desarrollo",
      features: ["Codificación y decodificación instantánea", "Soporte completo de caracteres UTF-8", "Arrastrar y soltar archivos", "Sin enviar datos a servidores"],
      howToUse: [
        { step: "Pegar o arrastrar", description: "Pega tu texto o arrastra un archivo al área de trabajo." },
        { step: "Convertir", description: "Obtén la cadena Base64 o el texto descifrado en tiempo real." },
        { step: "Copiar o descargar", description: "Copia el resultado en tu portapapeles con un clic." },
      ],
      faqs: [
        { question: "¿Es seguro decodificar datos confidenciales?", answer: "Sí, todo se procesa localmente en JavaScript en tu equipo; ningún dato se envía a la red." },
        { question: "¿Soporta caracteres especiales y emojis?", answer: "Sí, usamos TextEncoder y TextDecoder para garantizar compatibilidad total con UTF-8." },
      ],
    },
  },
  pt: {
    "merge-pdf": {
      slug: "merge-pdf",
      name: "Juntar PDF",
      title: "Juntar PDF Grátis Online - Combinar Arquivos PDF em Segundos | Utilify",
      description: "Combine múltiplos documentos PDF em um único arquivo organizado de forma rápida, gratuita e segura. Sem limites de arquivos e com total privacidade.",
      category: "PDF",
      features: ["Combinar arquivos PDF ilimitados", "Reordenar páginas facilmente", "Processamento em memória seguro", "Sem marcas d'água"],
      howToUse: [
        { step: "Enviar arquivos PDF", description: "Selecione ou arraste os documentos PDF que deseja juntar." },
        { step: "Organizar a ordem", description: "Reordene seus arquivos arrastando-os para a posição correta." },
        { step: "Baixar PDF combinado", description: "Clique em juntar e baixe seu documento unificado na hora." },
      ],
      faqs: [
        { question: "É gratuito juntar arquivos PDF?", answer: "Sim, 100% gratuito sem limites diários ou marcas d'água." },
        { question: "Meus documentos ficam salvos?", answer: "Não. Os arquivos são processados na memória RAM e excluídos imediatamente." },
      ],
    },
    "split-pdf": {
      slug: "split-pdf",
      name: "Dividir PDF",
      title: "Dividir PDF Grátis Online - Separar e Extrair Páginas de PDF | Utilify",
      description: "Extraia páginas específicas ou intervalos de páginas dos seus arquivos PDF gratuitamente online. Perfeito para contratos e extratos.",
      category: "PDF",
      features: ["Extrair intervalos personalizados (ex. 1-3, 5)", "Separar páginas individuais", "Zero armazenamento em disco", "Download instantâneo"],
      howToUse: [
        { step: "Enviar PDF", description: "Selecione o documento PDF que você quer dividir." },
        { step: "Definir páginas", description: "Digite os números das páginas ou intervalos que deseja extrair (ex. 1-5, 8)." },
        { step: "Baixar", description: "Faça o download do novo PDF com as páginas isoladas." },
      ],
      faqs: [
        { question: "Posso extrair várias páginas ao mesmo tempo?", answer: "Sim, você pode indicar qualquer combinação de páginas separadas por vírgula." },
        { question: "Meus dados bancários estão seguros?", answer: "Com certeza. Todo o processamento é temporário e confidencial." },
      ],
    },
    "background-remover": {
      slug: "background-remover",
      name: "Remover Fundo com IA",
      title: "Remover Fundo de Imagem Grátis com IA - Fundo Transparente | Utilify",
      description: "Remova o fundo de fotos, pessoas e produtos automaticamente com inteligência artificial de alta precisão. Baixe em PNG transparente em alta resolução.",
      category: "Imagens",
      features: ["Segmentação neural com IA", "Exportação em PNG transparente em alta definição", "Pincel interativo para retoques", "Sem créditos ou assinaturas"],
      howToUse: [
        { step: "Enviar foto", description: "Arraste sua imagem (JPG, PNG ou WebP) para a ferramenta." },
        { step: "Recorte automático", description: "A inteligência artificial isola o objeto principal em poucos segundos." },
        { step: "Baixar PNG", description: "Baixe sua foto com fundo transparente pronta para uso." },
      ],
      faqs: [
        { question: "O download mantém a alta resolução?", answer: "Sim, preservamos a resolução original sem reduzir a qualidade ou cobrar créditos." },
        { question: "Funciona com produtos e assinaturas?", answer: "Sim, a IA reconhece pessoas, roupas, calçados, joias e assinaturas no papel." },
      ],
    },
    "image-compressor": {
      slug: "image-compressor",
      name: "Comprimir Imagens",
      title: "Comprimir Imagens Grátis Online - Reduzir Tamanho JPG, PNG e WebP | Utilify",
      description: "Reduza o tamanho das suas imagens em até 80% sem perda visível de qualidade. Compressão 100% no seu navegador com download em lote ZIP.",
      category: "Imagens",
      features: ["Compressão no seu navegador", "Suporta JPG, PNG e WebP", "Download individual ou em pacote ZIP", "Contador de economia em tempo real"],
      howToUse: [
        { step: "Enviar imagens", description: "Selecione uma ou mais imagens do seu celular ou computador." },
        { step: "Ajustar qualidade", description: "Escolha o nível de compressão desejado usando a barra deslizante." },
        { step: "Baixar otimizadas", description: "Baixe as imagens comprimidas uma a uma ou tudo em um único ZIP." },
      ],
      faqs: [
        { question: "Minhas fotos vão para um servidor?", answer: "Não. A compressão roda 100% no seu próprio navegador via Canvas." },
        { question: "Mantém o fundo transparente em PNG?", answer: "Sim, a transparência de 32 bits é totalmente preservada." },
      ],
    },
    "sip-calculator": {
      slug: "sip-calculator",
      name: "Calculadora SIP",
      title: "Calculadora SIP Online - Juros Compostos e Crescimento de Investimentos | Utilify",
      description: "Calcule o retorno de investimentos mensais recorrentes (SIP) e fundos indexados com fórmulas de juros compostos e Step-Up.",
      category: "Calculadoras",
      features: ["Projeção de juros compostos", "Simulação Step-Up anual", "Gráficos visuais interativos", "Fórmulas matemáticas explicadas"],
      howToUse: [
        { step: "Valor mensal", description: "Digite quanto pretende investir todo mês." },
        { step: "Taxa e prazo", description: "Informe a rentabilidade anual estimada e o prazo em anos." },
        { step: "Ver projeção", description: "Analise o montante final acumulado e o total de juros gerados." },
      ],
      faqs: [
        { question: "O que é investimento SIP?", answer: "É um aporte mensal sistemático para aproveitar o efeito dos juros compostos ao longo do tempo." },
        { question: "Qual a vantagem do Step-Up?", answer: "Aumentar seu aporte em 10% a cada ano eleva drasticamente o seu patrimônio final." },
      ],
    },
    "bmi-calculator": {
      slug: "bmi-calculator",
      name: "Calculadora de IMC",
      title: "Calculadora de IMC Grátis - Índice de Massa Corporal e Peso Ideal | Utilify",
      description: "Calcule seu Índice de Massa Corporal (IMC) na hora no sistema métrico ou imperial e veja sua faixa de peso ideal segundo a OMS.",
      category: "Calculadoras",
      features: ["Sistema métrico e imperial", "Tabela oficial da OMS", "Cálculo de peso saudável", "100% confidencial"],
      howToUse: [
        { step: "Escolha a unidade", description: "Selecione sistema métrico (kg/cm) ou imperial (lb/in)." },
        { step: "Insira suas medidas", description: "Digite seu peso e altura atuais." },
        { step: "Veja seu IMC", description: "Descubra sua classificação corporal e peso recomendado." },
      ],
      faqs: [
        { question: "Como funciona o IMC?", answer: "É uma fórmula internacional da OMS que divide o peso pelo quadrado da altura." },
        { question: "Serve para atletas?", answer: "O IMC estima médias populacionais e não diferencia massa muscular de gordura corporal." },
      ],
    },
    "qr-generator": {
      slug: "qr-generator",
      name: "Gerador de Código QR",
      title: "Gerador de Código QR Grátis - Criar QR Code para Wi-Fi, Link e Contatos | Utilify",
      description: "Crie códigos QR em alta resolução para sites, redes Wi-Fi, cartões vCard e emails. Baixe em PNG ou vetor SVG.",
      category: "Desenvolvimento",
      features: ["QR Codes para Wi-Fi, links e vCard", "Níveis de correção de erro L/M/Q/H", "Cores personalizadas", "Exportação em PNG e SVG"],
      howToUse: [
        { step: "Tipo de dado", description: "Escolha se quer compartilhar um link, Wi-Fi ou contato." },
        { step: "Personalizar", description: "Digite os dados e defina cores e nível de correção." },
        { step: "Baixar", description: "Baixe seu QR Code em PNG ou SVG para impressão." },
      ],
      faqs: [
        { question: "Os códigos QR perdem a validade?", answer: "Não. São códigos estáticos permanentes que podem ser lidos infinitas vezes." },
        { question: "Posso imprimir em materiais gráficos?", answer: "Sim, o formato SVG vetorizado permite ampliar sem perder nitidez." },
      ],
    },
    "password-generator": {
      slug: "password-generator",
      name: "Gerador de Senhas",
      title: "Gerador de Senhas Seguras Online - Entropia Criptográfica | Utilify",
      description: "Gere senhas fortes e aleatórias com a API criptográfica nativa do navegador. Escolha comprimento, símbolos e números.",
      category: "Desenvolvimento",
      features: ["Criptografia local com crypto.getRandomValues", "Medidor de entropia em bits", "Geração de frases seguras", "Zero armazenamento"],
      howToUse: [
        { step: "Tamanho da senha", description: "Defina a quantidade de caracteres (recomendado 16+)." },
        { step: "Tipos de caracteres", description: "Marque maiúsculas, minúsculas, dígitos e símbolos." },
        { step: "Copiar senha", description: "Copie a senha forte gerada com um clique." },
      ],
      faqs: [
        { question: "Onde as senhas são criadas?", answer: "100% no seu navegador usando funções criptográficas do dispositivo." },
        { question: "Quantos bits de entropia são ideais?", answer: "Pelo menos 128 bits garantem imunidade contra ataques de força bruta." },
      ],
    },
    "json-formatter": {
      slug: "json-formatter",
      name: "Formatador de JSON",
      title: "Formatador e Validador de JSON Online - Pretty Print e Minify | Utilify",
      description: "Valide, formate e reduza dados JSON em tempo real com identificação de erros de sintaxe, ordenação de chaves e números de linha.",
      category: "Desenvolvimento",
      features: ["Validação sintática em tempo real", "Indentação ajustável (2/4 espaços ou tabs)", "Minificação de payloads para APIs", "Cópia rápida"],
      howToUse: [
        { step: "Colar JSON", description: "Cole o texto ou envie um arquivo JSON." },
        { step: "Validar e formatar", description: "O editor destaca qualquer erro de digitação imediatamente." },
        { step: "Copiar ou baixar", description: "Exporte o JSON formatado ou comprimido." },
      ],
      faqs: [
        { question: "O JSON é enviado para algum servidor?", answer: "Não. A validação e a formatação acontecem localmente em JavaScript." },
        { question: "Suporta arquivos grandes?", answer: "Sim, a engine é otimizada para manipular grandes estruturas de dados sem travar." },
      ],
    },
    "date-calculator": {
      slug: "date-calculator",
      name: "Calculadora de Datas",
      title: "Calculadora de Datas e Dias Úteis Online | Utilify",
      description: "Calcule a diferença exata entre duas datas ou some e subtraia dias, semanas e meses para prazos de projetos.",
      category: "Calculadoras",
      features: ["Diferença em dias, semanas e meses", "Soma e subtração de dias", "Links compartilháveis", "Cálculos precisos"],
      howToUse: [
        { step: "Escolher datas", description: "Selecione a data de início e a data de término." },
        { step: "Calcular", description: "Veja a duração total e o detalhamento temporal." },
        { step: "Compartilhar", description: "Copie um link com o cálculo pronto para enviar." },
      ],
      faqs: [
        { question: "Considera anos bissextos?", answer: "Sim, todos os dias extras de anos bissextos são calculados corretamente." },
        { question: "Posso somar dias para saber uma data futura?", answer: "Sim, basta usar a aba de somar/subtrair para projetar prazos de entrega." },
      ],
    },
    "word-counter": {
      slug: "word-counter",
      name: "Contador de Palavras",
      title: "Contador de Palavras e Caracteres Online - Tempo de Leitura | Utilify",
      description: "Conte palavras, caracteres, frases e parágrafos em tempo real. Veja estimativas de tempo de leitura e limites para redes sociais.",
      category: "Desenvolvimento",
      features: ["Contagem instantânea", "Tempo de leitura e fala", "Limites para redes sociais", "Análise de frequência de termos"],
      howToUse: [
        { step: "Digitar ou colar texto", description: "Cole sua redação ou artigo no campo de texto." },
        { step: "Conferir métricas", description: "Veja o total de palavras, caracteres e tempo de fala." },
        { step: "Ajustar tamanho", description: "Acompanhe os limites de caracteres para Twitter, LinkedIn e Instagram." },
      ],
      faqs: [
        { question: "Como é calculado o tempo de leitura?", answer: "Usa como base a velocidade média de 200 a 250 palavras por minuto." },
        { question: "O texto enviado é mantido em segredo?", answer: "Sim. Nada é enviado para a nuvem; tudo fica no seu dispositivo." },
      ],
    },
    "color-palette": {
      slug: "color-palette",
      name: "Gerador de Paleta de Cores",
      title: "Gerador de Paletas de Cores Online - Harmonias e Contraste WCAG | Utilify",
      description: "Gere paletas de cores harmônicas ou extraia cores de fotos. Teste o contraste de acessibilidade de acordo com as normas WCAG.",
      category: "Imagens",
      features: ["Extração de fotos", "Esquemas complementares e análogos", "Verificação de contraste WCAG", "Exportação para CSS e Tailwind"],
      howToUse: [
        { step: "Gerar ou enviar", description: "Pressione espaço para gerar ou envie uma foto ou logo." },
        { step: "Verificar contraste", description: "Confira as notas de acessibilidade AA e AAA." },
        { step: "Copiar códigos", description: "Exporte em valores HEX, RGB ou classes CSS." },
      ],
      faqs: [
        { question: "O que é contraste WCAG?", answer: "São diretrizes que garantem que textos fiquem legíveis para pessoas com baixa visão." },
        { question: "Posso exportar para Tailwind CSS?", answer: "Sim, gere tokens prontos para usar no seu arquivo de estilos." },
      ],
    },
    "pdf-to-image": {
      slug: "pdf-to-image",
      name: "PDF para Imagens",
      title: "Converter PDF para Imagens PNG Grátis Online | Utilify",
      description: "Converta páginas de documentos PDF em imagens PNG de alta resolução (150 DPI) gratuitamente. Baixe em arquivo ZIP sem cadastro.",
      category: "PDF",
      features: ["Conversão a 150 DPI de alta nitidez", "Download de páginas em pacote ZIP", "Zero armazenamento em disco", "100% gratuito"],
      howToUse: [
        { step: "Enviar PDF", description: "Selecione o documento PDF que deseja converter." },
        { step: "Processar páginas", description: "A ferramenta extrai cada página em imagem PNG de alta qualidade." },
        { step: "Baixar ZIP", description: "Baixe todas as imagens reunidas em um único arquivo ZIP." },
      ],
      faqs: [
        { question: "Qual a resolução das imagens geradas?", answer: "São geradas a 150 DPI com texto e gráficos em perfeita nitidez." },
        { question: "Meus arquivos são salvos?", answer: "Não. Os documentos são processados apenas na memória e descartados em seguida." },
      ],
    },
    "investment-calculator": {
      slug: "investment-calculator",
      name: "Calculadora de Investimentos",
      title: "Calculadora de Crescimento de Investimentos e Juros Compostos | Utilify",
      description: "Projete o crescimento do seu capital inicial somado a aportes mensais recorrentes com juros compostos diários, mensais, trimestrais ou anuais.",
      category: "Calculadoras",
      features: ["Capital inicial e aportes recorrentes", "Capitalização diária, mensal, trimestral e anual", "Tabela ano a ano e exportação para CSV", "Simulação de patrimônio futuro"],
      howToUse: [
        { step: "Patrimônio inicial", description: "Digite o montante com o qual você está começando a investir." },
        { step: "Aportes e rentabilidade", description: "Indique o depósito mensal, a rentabilidade anual estimada e o prazo." },
        { step: "Ver projeção", description: "Confira o saldo total acumulado, os juros recebidos e baixe a planilha CSV." },
      ],
      faqs: [
        { question: "Qual a diferença para a Calculadora SIP?", answer: "A calculadora de investimentos permite simular um grande aporte inicial associado a depósitos mensais e intervalos de capitalização variados." },
        { question: "Qual o impacto da frequência dos juros?", answer: "Quanto mais frequente a capitalização (como diária ou mensal), maior será o rendimento final acumulado." },
      ],
    },
    "fire-calculator": {
      slug: "fire-calculator",
      name: "Calculadora FIRE",
      title: "Calculadora FIRE - Independência Financeira e Aposentadoria Antecipada | Utilify",
      description: "Calcule seu número FIRE para conquistar a independência financeira e se aposentar mais cedo pela regra dos 4% com correção de inflação.",
      category: "Calculadoras",
      features: ["Cálculo do número FIRE pela regra dos 4%", "Faixas Lean FIRE (75%) e Fat FIRE (125%)", "Retorno real descontando inflação (Fisher)", "Projeção de anos até a independência"],
      howToUse: [
        { step: "Despesas anuais", description: "Informe seu custo de vida anual estimado na aposentadoria." },
        { step: "Aportes e rendimento", description: "Defina seu patrimônio atual, economia mensal e taxa de inflação." },
        { step: "Analisar metas", description: "Veja quantos anos faltam para atingir suas metas Lean, Standard e Fat FIRE." },
      ],
      faqs: [
        { question: "O que é a regra dos 4%?", answer: "Com base no Trinity Study, retirar 4% da carteira no primeiro ano e corrigir pela inflação dá 95%+ de chance de nunca faltar dinheiro em 30 anos." },
        { question: "Como calcular o patrimônio necessário?", answer: "Multiplique seu gasto anual de aposentadoria por 25 para ter a meta exata de independência financeira." },
      ],
    },
    "age-calculator": {
      slug: "age-calculator",
      name: "Calculadora de Idade",
      title: "Calculadora de Idade Exata Online - Anos, Meses, Dias e Minutos | Utilify",
      description: "Descubra sua idade cronológica exata em anos, meses, dias, horas e segundos. Veja a contagem regressiva para seu próximo aniversário e tempo vivido.",
      category: "Calculadoras",
      features: ["Idade cronológica exata ao vivo", "Contagem regressiva para o próximo aniversário", "Detalhamento em semanas, dias, horas e minutos", "Cálculo preciso com anos bissextos"],
      howToUse: [
        { step: "Data de nascimento", description: "Informe o dia, mês e ano em que você nasceu." },
        { step: "Data de referência", description: "Compare com o dia de hoje ou selecione uma data no futuro ou passado." },
        { step: "Ver resultados", description: "Acompanhe sua idade em tempo real e o tempo total de vida." },
      ],
      faqs: [
        { question: "Considera os dias de anos bissextos?", answer: "Sim, os dias 29 de fevereiro são contabilizados com rigor." },
        { question: "Posso calcular minha idade em uma data futura?", answer: "Sim, basta alterar a data de comparação para projetar sua idade exata." },
      ],
    },
    "unit-converter": {
      slug: "unit-converter",
      name: "Conversor de Unidades",
      title: "Conversor de Unidades Online - Comprimento, Peso, Temperatura e Volume | Utilify",
      description: "Converta unidades métricas e imperiais em tempo real: metros, pés, polegadas, quilos, libras, Celsius, Fahrenheit, litros e galões.",
      category: "Desenvolvimento",
      features: ["Conversão métrica e imperial", "Comprimento, peso, temperatura, área e volume", "Quadro com todas as conversões simultâneas", "Precisão matemática rigorosa"],
      howToUse: [
        { step: "Escolher categoria", description: "Selecione comprimento, peso, temperatura, área ou volume." },
        { step: "Digitar valor", description: "Insira o número que deseja converter." },
        { step: "Ver equivalências", description: "Confira o resultado instantâneo e a lista com todas as unidades." },
      ],
      faqs: [
        { question: "Como funciona a conversão de temperatura?", answer: "Utiliza as fórmulas exatas entre Celsius, Fahrenheit e Kelvin." },
        { question: "Os fatores de conversão são oficiais?", answer: "Sim, seguem rigorosamente os padrões do Sistema Internacional de Unidades." },
      ],
    },
    "px-to-rem": {
      slug: "px-to-rem",
      name: "Conversor PX para REM",
      title: "Conversor PX para REM Online - Tipografia Fluida CSS clamp() e Tailwind | Utilify",
      description: "Converta pixels (px) em unidades relativas REM, EM e PT na hora. Crie código CSS clamp() para tipografia responsiva e veja a tabela do Tailwind.",
      category: "Desenvolvimento",
      features: ["Conversão bidirecional PX ↔ REM", "Gerador de CSS clamp() para design fluido", "Tabela de tokens do Tailwind CSS v4", "Acessibilidade WCAG"],
      howToUse: [
        { step: "Definir tamanho base", description: "Confirme a fonte base do navegador (padrão 16px)." },
        { step: "Digitar pixels", description: "Insira o tamanho em px para ver a conversão em rem." },
        { step: "Copiar clamp()", description: "Copie o código CSS clamp() pronto para aplicar em fontes fluidas." },
      ],
      faqs: [
        { question: "Por que usar REM e não PX?", answer: "O REM respeita o tamanho de fonte configurado pelo usuário no navegador, essencial para acessibilidade." },
        { question: "Como funciona a função clamp()?", answer: "Ela define um tamanho mínimo, uma escala proporcional ao viewport (vw) e um teto máximo." },
      ],
    },
    "base64": {
      slug: "base64",
      name: "Codificador Base64",
      title: "Codificador e Decodificador Base64 Grátis Online | Utilify",
      description: "Codifique e decodifique textos e arquivos em Base64 com suporte total a caracteres UTF-8. 100% privado e executado no seu navegador.",
      category: "Desenvolvimento",
      features: ["Codificação e decodificação instantânea", "Suporte integral a caracteres UTF-8", "Arrastar e soltar arquivos", "Sem envio de dados para a nuvem"],
      howToUse: [
        { step: "Colar ou arrastar", description: "Cole seu texto ou arraste um arquivo para o campo correspondente." },
        { step: "Converter", description: "Veja a conversão para Base64 ou a decodificação em texto puro." },
        { step: "Copiar resultado", description: "Copie a saída com um clique direto para a área de transferência." },
      ],
      faqs: [
        { question: "É seguro para senhas ou chaves de API?", answer: "Sim, todo o processamento roda localmente no seu computador sem comunicação com servidores." },
        { question: "Suporta acentos e emojis?", answer: "Sim, a codificação é compatível com UTF-8 nativo." },
      ],
    },
  },
};

export function getToolTranslation(toolSlug: string, lang: Language): ToolTranslation | null {
  return toolTranslations[lang]?.[toolSlug] || null;
}

export function getLanguageFromPathname(pathname?: string | null): Language | "en" {
  if (!pathname) return "en";
  if (pathname.startsWith("/es/") || pathname === "/es") return "es";
  if (pathname.startsWith("/pt/") || pathname === "/pt") return "pt";
  return "en";
}

export function getLocalizedPath(path: string, targetLang: Language | "en"): string {
  const cleanPath = path.replace(/^\/(es|pt)(\/|$)/, "/");
  const toolSlug = cleanPath.replace(/^\//, "").split("/")[0].split("?")[0];

  if (targetLang === "en") {
    return cleanPath || "/";
  }

  // If tool exists in target language translations, link directly to it
  if (toolSlug && toolTranslations[targetLang]?.[toolSlug]) {
    return `/${targetLang}/${toolSlug}`;
  }

  // Default to language hub
  return `/${targetLang}`;
}

export function getCanonicalToolSlug(pathnameOrSlug: string): string {
  return pathnameOrSlug
    .replace(/^\//, "")
    .replace(/^(es|pt)\//, "")
    .split("?")[0]
    .split("/")[0];
}
