import React from 'react';
import Link from '../../components/LocaleLink';

const seo = {
  title: 'Calculadora de Dinero TikTok – Estima tus Ganancias',
  description:
    'Estima tus ganancias de TikTok con nuestra calculadora gratis. Conoce ingresos potenciales según visualizaciones, seguidores, interacción y patrocinios.',
  ogLocale: 'es_ES',
};

const metricsGuide = [
  {
    name: 'Seguidores',
    tag: 'Alcance de Audiencia',
    description:
      'Total de cuentas que siguen al creador en TikTok. Refleja tamaño de audiencia y prueba social, aplicando un multiplicador de escala secundario.',
  },
  {
    name: 'Me gusta totales',
    tag: 'Me gusta acumulados',
    description: 'Total acumulado de me gusta en todos los videos públicos actualmente visibles en el perfil.',
  },
  {
    name: 'Videos totales',
    tag: 'Videos publicados',
    description: 'Cantidad total de videos públicos publicados en la cuenta.',
  },
  {
    name: 'Siguiendo',
    tag: 'Cuentas seguidas',
    description: 'Número total de perfiles a los que sigue el creador.',
  },
  {
    name: 'Vistas Prom. Est.',
    tag: 'Vistas por video',
    description:
      'Promedio de vistas por video de publicaciones públicas recientes, o estimado a partir de seguidores cuando no hay datos de videos recientes.',
  },
  {
    name: 'Engagement',
    tag: 'Tasa de interacción',
    description:
      'Suma de me gusta, comentarios y compartidos dividida entre las vistas totales de la muestra reciente (o estimada en modo de respaldo).',
  },
];

const cpmTiers = [
  {
    tier: 'Mercados Tier 1',
    regions: 'US, CA, UK, GB, AU, NZ, DE',
    min: '$22.00',
    avg: '$30.00',
    max: '$42.00',
    featured: true,
  },
  {
    tier: 'Mercados Tier 2',
    regions: 'FR, ES, IT, PT, BR, MX, SG, NL, BE, SE, NO, DK, FI, IE, CH',
    min: '$16.00',
    avg: '$22.00',
    max: '$32.00',
    featured: false,
  },
  {
    tier: 'Tier 3 / Predeterminado Global',
    regions: 'Resto de regiones o cuando el perfil no expone código de región',
    min: '$12.00',
    avg: '$18.00',
    max: '$26.00',
    featured: false,
  },
];

const followerScaleTiers = [
  { range: 'Hasta 10.000 seguidores', factor: '1.00x' },
  { range: '10.001 a 100.000 seguidores', factor: '1.02x' },
  { range: '100.001 a 500.000 seguidores', factor: '1.08x' },
  { range: '500.001 a 2.000.000 seguidores', factor: '1.12x' },
  { range: 'Más de 2.000.000 seguidores', factor: '1.18x' },
];

const channelRows = [
  {
    feature: 'Fuente de Pago',
    sponsorships: 'Marcas externas, anunciantes o agencias de marketing',
    rewards: 'TikTok (ByteDance) directamente al saldo de creador dentro de la app',
  },
  {
    feature: 'Métrica de Precio / Pago',
    sponsorships: 'Tarifa negociada con referencia de CPM de patrocinio (costo por 1.000 vistas)',
    rewards: 'RPM variable de la plataforma (ingresos por 1.000 vistas calificadas) fijado por TikTok',
  },
  {
    feature: 'Reglas de Duración',
    sponsorships: 'Cualquier duración acordada en el brief de la marca',
    rewards: 'Debe cumplir la duración mínima y las reglas de originalidad de TikTok',
  },
  {
    feature: 'Mínimo de Seguidores',
    sponsorships: 'Sin mínimo obligatorio; depende de afinidad de marca y alcance',
    rewards: 'Exige cumplir los requisitos oficiales de seguidores y vistas en 30 días',
  },
  {
    feature: '¿Modelado por KalkulatorTik?',
    sponsorships: 'Sí — Modelado por nuestra Calculadora de Dinero de TikTok principal',
    rewards: 'No — Requiere datos privados internos de vistas calificadas y RPM',
    isStatusRow: true,
  },
];

const factors = [
  {
    num: '01',
    title: 'Demografía Verificada de Audiencia',
    body: 'Los códigos de región del perfil son solo una aproximación. Las marcas suelen pedir capturas de TikTok Studio con países, edades y distribución por género.',
  },
  {
    num: '02',
    title: 'Categoría o Nicho de Contenido',
    body: 'Sectores de alta intención comercial —finanzas personales, software, B2B, cuidado de la piel, fitness y tecnología— suelen cobrar tarifas superiores al entretenimiento general.',
  },
  {
    num: '03',
    title: 'Entregables y Producción',
    body: 'Una mención de 15 segundos en un vlog cotidiano exige menos producción que un tutorial con guion de 60 segundos, iluminación de estudio o grabación en exteriores.',
  },
  {
    num: '04',
    title: 'Derechos de Uso y Licencias',
    body: 'La tarifa base cubre la publicación orgánica en el perfil del creador. Reutilizar el video en sitios web, correos o anuncios pagados requiere un cargo por licencia.',
  },
  {
    num: '05',
    title: 'Spark Ads y Amplificación Pagada',
    body: 'Compartir un código de Spark Ads (whitelisting) permite pautar con la identidad del creador y suele facturarse por bloques de 30, 60 o 90 días.',
  },
  {
    num: '06',
    title: 'Exclusividad de Categoría',
    body: 'Comprometerse a no promocionar competidores durante un periodo limita otros ingresos por patrocinio y justifica una prima por exclusividad.',
  },
  {
    num: '07',
    title: 'Paquetes de Varios Videos',
    body: 'Contratar de tres a cinco publicaciones patrocinadas suele abrir un descuento moderado por video a cambio de un presupuesto total garantizado.',
  },
  {
    num: '08',
    title: 'Temporalidad y Poder de Negociación',
    body: 'Temporadas comerciales pico, plazos ajustados, alta demanda del creador y conversiones comprobadas modifican los precios finales acordados.',
  },
];

const creatorRows = [
  {
    metric: 'Seguidores Totales',
    creatorA: '500.000 seguidores',
    creatorB: '50.000 seguidores',
    insight: 'El Creador A tiene 10× más seguidores que el Creador B.',
  },
  {
    metric: 'Factor de Escala de Seguidores',
    creatorA: '1.08x (nivel >100K)',
    creatorB: '1.02x (nivel >10K)',
    insight: 'El Creador A recibe un multiplicador de escala mayor.',
  },
  {
    metric: 'Vistas Promedio por Video',
    creatorA: '8.000 vistas por video',
    creatorB: '65.000 vistas por video',
    insight: 'El Creador B logra más de 8× vistas por publicación.',
  },
  {
    metric: 'Tasa de Engagement',
    creatorA: '1,20 % de interacción',
    creatorB: '9,40 % de interacción',
    insight: 'La audiencia del Creador B da me gusta, comenta y comparte activamente.',
  },
  {
    metric: 'Factor de Engagement',
    creatorA: '0.924x',
    creatorB: '1.088x',
    insight: 'El alto engagement eleva el multiplicador CPM del Creador B.',
  },
  {
    metric: 'Nivel de Región del Perfil',
    creatorA: 'Tier 3 / Global ($18.00 CPM base prom.)',
    creatorB: 'Tier 1 / EE. UU. ($30.00 CPM base prom.)',
    insight: 'Las referencias regionales separan aún más el CPM base.',
  },
  {
    metric: 'CPM Ajustado del Modelo',
    creatorA: '$17.96 (Rango: $11.98 – $25.95)',
    creatorB: '$33.29 (Rango: $24.41 – $46.61)',
    insight: 'La interacción activa y el nivel de mercado casi duplican el CPM.',
  },
  {
    metric: 'Valor Estimado de Patrocinio',
    creatorA: '$143.68 por video ($95.84 – $207.60)',
    creatorB: '$2,163.85 por video ($1,586.65 – $3,029.65)',
    insight: 'Las vistas reales y la interacción impulsan la estimación más alta.',
    highlight: true,
  },
];

const faqItems = [
  {
    id: 'faq-1',
    question: '1. ¿Qué estima una calculadora de dinero de TikTok?',
    schemaAnswer:
      'Una calculadora de dinero de TikTok como KalkulatorTik estima las ganancias comerciales potenciales por patrocinio de marca para un único video patrocinado en un perfil público de TikTok, ofreciendo un valor base en USD y un rango según alcance, engagement y CPM regional.',
    answer: (
      <p>
        Una calculadora de dinero de TikTok como <strong>KalkulatorTik</strong> estima las{' '}
        <strong>ganancias potenciales por patrocinio comercial de marca para un solo video patrocinado</strong> en un
        perfil público. En lugar de simular repartos de anuncios internos, ofrece una referencia principal en dólares
        estadounidenses (USD) por video junto con un rango estimado según alcance público, engagement y CPM regional.
      </p>
    ),
  },
  {
    id: 'faq-2',
    question: '2. ¿Esta estimación es igual a los pagos de TikTok Creator Rewards?',
    schemaAnswer:
      'No. Los patrocinios de marca y el Programa TikTok Creator Rewards son fuentes de ingreso distintas. Creator Rewards paga directamente desde TikTok por vistas calificadas en videos originales de 1+ minuto (requiere al menos 10.000 seguidores, 100.000 vistas en 30 días, 18+ años o 19+ en Corea del Sur, buen historial y país elegible). Nuestra calculadora estima tarifas privadas de patrocinio.',
    answer: (
      <p>
        <strong>No.</strong> Los patrocinios de marca y el Programa TikTok Creator Rewards son ingresos completamente
        distintos. Creator Rewards paga directamente desde TikTok por vistas calificadas en videos originales de{' '}
        <code>1+ minuto</code> y exige <code>10.000</code> seguidores, <code>100.000</code> vistas en los últimos 30
        días, edad <code>18+</code> (<code>19+</code> en Corea del Sur), buen estado y región admitida. Esta herramienta
        calcula <strong>tarifas privadas con marcas</strong> sin mínimo fijo de seguidores.
      </p>
    ),
  },
  {
    id: 'faq-3',
    question: '3. ¿Cómo se calcula la estimación de patrocinio en KalkulatorTik?',
    schemaAnswer:
      'Nuestra calculadora divide las vistas promedio por video entre 1.000 y multiplica por un CPM ajustado. A partir de rangos regionales internos ($12–$42 entre Tier 1 y Tier 3, con medias de $18–$30), aplica un factor de engagement (0.90x a 1.20x) y un factor de seguidores (1.00x a 1.18x), limitando el CPM final entre $7.00 y $80.00.',
    answer: (
      <p>
        Dividimos las <strong>Vistas Promedio por Video</strong> entre <code>1.000</code> y multiplicamos por un{' '}
        <strong>CPM Ajustado (Costo por Mil)</strong>. Partiendo de niveles regionales internos (<code>$12&ndash;$42</code>{' '}
        en Tier 1&ndash;Tier 3 con bases medias de <code>$18&ndash;$30</code>), aplicamos un multiplicador de engagement
        (<code>0.90x</code> a <code>1.20x</code>) y uno por seguidores (<code>1.00x</code> a <code>1.18x</code>),
        acotando el CPM entre <code>$7.00</code> y <code>$80.00</code>.
      </p>
    ),
  },
  {
    id: 'faq-4',
    question: '4. ¿Importan más los seguidores o las vistas para las tarifas de patrocinio?',
    schemaAnswer:
      'Las vistas promedio por video suelen importar más para fijar el precio de un video patrocinado porque muestran cuántas personas probablemente lo verán. Los seguidores aportan prueba social y un pequeño aumento de escala, pero un perfil con vistas constantes supera a una cuenta grande con pocas vistas recientes.',
    answer: (
      <p>
        <strong>Las vistas promedio por video suelen importar más</strong> porque reflejan cuántas personas es probable
        que vean la colaboración. Los seguidores siguen aportando respaldo social y un ajuste menor de escala, pero una
        cuenta más pequeña con vistas constantes supera a una grande con bajo alcance reciente.
      </p>
    ),
  },
  {
    id: 'faq-5',
    question: '5. ¿Puedo calcular ganancias de patrocinio usando solo un nombre de usuario?',
    schemaAnswer:
      'Sí. KalkulatorTik funciona como calculadora de dinero de TikTok por usuario: basta el @handle de cualquier cuenta pública para obtener las estadísticas y métricas públicas necesarias.',
    answer: (
      <p>
        <strong>Sí.</strong> Como KalkulatorTik funciona como <strong>calculadora por nombre de usuario</strong>, solo
        necesitas el handle (con o sin <code>@</code>) de cualquier perfil <strong>Público</strong> para extraer
        automáticamente sus estadísticas y calcular la estimación por video.
      </p>
    ),
  },
  {
    id: 'faq-6',
    question: '6. ¿La calculadora pide contraseña o inicio de sesión de TikTok?',
    schemaAnswer:
      'Nunca. KalkulatorTik no solicita contraseñas, correos electrónicos, códigos 2FA ni acceso a TikTok Studio. Todo opera con datos públicos. Consulta nuestra Política de Privacidad para más detalles.',
    answer: (
      <p>
        <strong>Nunca.</strong> KalkulatorTik no solicita tu contraseña de TikTok, correo, códigos de verificación ni
        acceso privado. Todo funciona con datos públicos. Consulta nuestra{' '}
        <Link to="/privacy" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Política de Privacidad
        </Link>{' '}
        para conocer los detalles.
      </p>
    ),
  },
  {
    id: 'faq-7',
    question: '7. ¿Es gratis usar KalkulatorTik?',
    schemaAnswer:
      'Sí. KalkulatorTik es gratuito en línea, sin suscripciones ni tarjetas de crédito. Se aplican límites estándar de servidor contra abuso automatizado. Puedes ver más respuestas en nuestra página de Preguntas Frecuentes.',
    answer: (
      <p>
        <strong>Sí.</strong> KalkulatorTik es gratis en línea, sin suscripciones ni registro obligatorio. Aplicamos
        límites estándar de servidor para mantener la estabilidad. Encuentra más detalles en nuestra{' '}
        <Link to="/faq" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          página de Preguntas Frecuentes
        </Link>
        .
      </p>
    ),
  },
  {
    id: 'faq-8',
    question: '8. ¿Se pueden analizar perfiles privados de TikTok?',
    schemaAnswer:
      'No. KalkulatorTik solo accede a datos públicos visibles en TikTok. Si conoces manualmente los totales de una cuenta privada, puedes probar nuestra Calculadora de Engagement de TikTok o Calculadora de CPM de TikTok.',
    answer: (
      <p>
        <strong>No.</strong> KalkulatorTik solo accede a métricas visibles públicamente. Si conoces manualmente los
        números de una cuenta privada, puedes probarlos en nuestra{' '}
        <Link
          to="/tiktok-engagement-calculator"
          className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800"
        >
          Calculadora de Engagement de TikTok
        </Link>{' '}
        o{' '}
        <Link
          to="/tiktok-cpm-calculator"
          className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800"
        >
          Calculadora de CPM de TikTok
        </Link>
        .
      </p>
    ),
  },
  {
    id: 'faq-9',
    question: '9. ¿Por qué los datos de un perfil pueden no estar disponibles al buscar?',
    schemaAnswer:
      'Puede fallar si el usuario está mal escrito, cambió de handle, la cuenta es privada o suspendida, o TikTok limita temporalmente las consultas automáticas durante picos de tráfico.',
    answer: (
      <p>
        Una búsqueda puede fallar por un error tipográfico, cambio reciente de usuario, cuenta privada o suspendida, o
        límites temporales de TikTok durante tráfico intenso. Revisa el usuario e inténtalo de nuevo tras unos segundos.
      </p>
    ),
  },
  {
    id: 'faq-10',
    question: '10. ¿Qué ocurre si no están disponibles las vistas de videos recientes?',
    schemaAnswer:
      'Si cargan las estadísticas principales (seguidores, me gusta y videos) pero faltan vistas recientes, KalkulatorTik activa un modelo de respaldo: 8 % de seguidores desde 12.500+ seguidores (10 % entre 10.000 y 12.499, mínimo 1.000 por debajo) y engagement estimado desde me gusta totales o valores por nivel.',
    answer: (
      <p>
        Si cargan los datos principales pero falta la lista de videos recientes, KalkulatorTik cambia al{' '}
        <strong>modelo de estimación de respaldo</strong>: estima vistas al <code>8%</code> de seguidores desde{' '}
        <code>12.500+</code> (<code>10%</code> entre <code>10.000</code> y <code>12.499</code>, mínimo{' '}
        <code>1.000</code> debajo de <code>10.000</code>) y calcula el engagement con me gusta totales, videos y
        seguidores o valores predeterminados.
      </p>
    ),
  },
  {
    id: 'faq-11',
    question: '11. ¿El monto de patrocinio estimado está garantizado?',
    schemaAnswer:
      'No. Todas las cifras de KalkulatorTik son referencias educativas no vinculantes. Las tarifas reales dependen del interés comercial de la marca, nicho, audiencia, entregables y negociación.',
    answer: (
      <p>
        <strong>No.</strong> Todas las cifras son referencias educativas orientativas y no ingresos garantizados ni
        ofertas oficiales. El monto real depende de cada marca, tu nicho, audiencia, complejidad y negociación.
      </p>
    ),
  },
  {
    id: 'faq-12',
    question: '12. ¿Cómo pueden usar los creadores esta estimación al negociar con marcas?',
    schemaAnswer:
      'Usa el promedio como base para un video patrocinado orgánico estándar, sube hacia el rango superior cuando incluya Spark Ads, derechos de uso o exclusividad, y ofrece un descuento moderado en paquetes de varios videos.',
    answer: (
      <div className="space-y-2">
        <p>
          Toma el promedio y el rango como <strong>base inicial para un video patrocinado orgánico estándar</strong>:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            Usa la <strong>estimación promedio</strong> para validar ofertas entrantes y evitar cobrar de menos.
          </li>
          <li>
            Acércate o supera el <strong>extremo superior</strong> si solicitan Spark Ads, licencias de 30–90 días,
            exclusividad o producción compleja.
          </li>
          <li>
            Ofrece un ajuste moderado hacia el <strong>extremo inferior</strong> cuando una marca contrata un paquete de
            3 o 5 videos.
          </li>
        </ul>
      </div>
    ),
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://www.kalkulatortik.com/#faq',
  inLanguage: 'es',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.schemaAnswer },
  })),
};

const copy = {
  intro: {
    title: '¿Qué es una Calculadora de Dinero de TikTok?',
    description:
      'Una Calculadora de Dinero de TikTok es una herramienta de valoración que estima cuánto puede cobrar un perfil público por un video patrocinado—y ayuda a marcas a evaluar tarifas justas.',
    p1: (
      <>
        En lugar de adivinar cuánto puede generar una cuenta con marcas, esta{' '}
        <strong className="font-semibold text-slate-900">calculadora de dinero de TikTok</strong> analiza señales
        públicas visibles&mdash;como <strong className="font-semibold text-slate-900">vistas promedio por video</strong>,{' '}
        <strong className="font-semibold text-slate-900">tasa de engagement</strong>,{' '}
        <strong className="font-semibold text-slate-900">región del perfil</strong> y{' '}
        <strong className="font-semibold text-slate-900">escala de seguidores</strong>&mdash;para estimar una tarifa
        en USD por video junto con su rango de negociación.
      </>
    ),
    p2: 'Tanto si eres creador preparando tu tarifa comercial como si eres marca comparando perfiles antes de una campaña, KalkulatorTik te ofrece una referencia transparente con cualquier usuario público sin iniciar sesión.',
  },
  howToUse: {
    title: 'Cómo Usar la Calculadora de Dinero de TikTok',
    description:
      'Calcula estimaciones de patrocinio en TikTok por nombre de usuario en tres pasos rápidos y sin registro.',
    actionLabel: 'Ir a la Calculadora Arriba \u2191',
    steps: [
      {
        badge: 'PASO 01',
        title: 'Ingresa el Usuario y Calcula',
        body: (
          <>
            Introduce cualquier usuario público de TikTok arriba (ej. <code>khaby.lame</code> o <code>@mrbeast</code>)
            &mdash;el <code>@</code> inicial se quita solo&mdash;y haz clic en{' '}
            <strong>Calcular Valor de Patrocinio</strong>.
          </>
        ),
      },
      {
        badge: 'PASO 02',
        title: 'Revisa el Perfil y la Fuente',
        body: (
          <>
            Verifica en la barra superior si las cifras provienen de <strong>videos recientes en vivo</strong> o{' '}
            <strong>modo de respaldo</strong>, y revisa el valor estimado, CPM y las 6 métricas.
          </>
        ),
      },
      {
        badge: 'PASO 03',
        title: 'Aplica a las Condiciones del Acuerdo',
        body: (
          <>
            <strong>Creadores:</strong> Usa el promedio como base antes de sumar Spark Ads, licencias o exclusividad.{' '}
            <strong>Marcas:</strong> Contrasta tarifas con alcance e interacción real.
          </>
        ),
      },
    ],
    troubleshootingTitle: 'Solución de Problemas y Actualización Manual de Caché',
    troubleshootingP1: (
      <>
        <strong className="text-slate-900">Cuentas Públicas y Límites:</strong> Solo pueden analizarse perfiles
        públicos. Ante pausas temporales de TikTok, espera unos segundos y reintenta.
      </>
    ),
    troubleshootingP2: (
      <>
        <strong className="text-slate-900">Caché de 1 Hora y Datos Nuevos:</strong> Los resultados se guardan hasta 1
        hora. Si tus métricas acaban de subir, usa <strong>Refresh Data</strong> en la{' '}
        <Link to="/calculator" className="font-semibold text-teal-700 underline underline-offset-2">
          Vista Independiente con Refresco
        </Link>
        .
      </>
    ),
    footerNote: 'A continuación detallamos cada tarjeta de valoración y los seis indicadores públicos del Paso 02.',
  },
  results: {
    title: 'Rendimiento del Perfil y Valor Estimado de Patrocinio',
    description:
      'Cada consulta convierte señales públicas de TikTok en un desglose estimado de tarifa y patrocinio por video.',
    primaryEyebrow: 'Resultado Principal de Valoración',
    usdBadge: 'Referencia USD',
    primaryTitle: 'Valor Estimado de Patrocinio por Video',
    primaryLead: (
      <>
        La cifra principal en dólares es la{' '}
        <strong className="font-semibold text-slate-900">tarifa base estimada por un video patrocinado</strong>,
        acompañada de dos referencias de apoyo:
      </>
    ),
    rangeTitle: 'Rango Estimado de Patrocinio',
    rangeBody:
      'Menciones breves o paquetes de varios videos suelen acercarse al mínimo; nichos competitivos o entregables extra tienden al máximo.',
    cpmTitle: 'CPM de Referencia del Modelo',
    cpmBody:
      'Tarifa bruta asumida por cada 1.000 vistas tras ajustar por nivel regional, engagement y escala de seguidores.',
    cacheNote: 'Los datos reflejan información pública al consultar (o en caché hasta 1 hora).',
    profileOverviewTitle: 'Resumen del Perfil Público',
    profileOverviewBadge: 'Señales de Identidad',
    profileOverviewBody: (
      <>
        Muestra los datos públicos disponibles&mdash;nombre visible, <code>@handle</code>, insignia de verificación,
        biografía pública, región (si está visible), ID de TikTok y fecha de creación.
      </>
    ),
    metricsTitle: 'Resumen de Cuenta y Referencias de Actividad',
    metricsBadge: '6 Indicadores Públicos',
    howToReadTitle: 'Cómo Interpretar los Resultados',
    howToReadBody: (
      <>
        Usa esta estimación como punto de partida práctico para negociar, nunca como tarifa fija ni ingreso garantizado.{' '}
        <strong className="text-slate-900">Creadores</strong> pueden añadir licencias o exclusividad;{' '}
        <strong className="text-slate-900">marcas y agencias</strong> pueden verificar si un presupuesto coincide con
        el alcance y la interacción pública.
      </>
    ),
    limitationsBadge: 'Limitaciones de la Estimación',
    limitationsBody:
      'Este cálculo utiliza únicamente datos públicos visibles. No inspecciona analíticas privadas de TikTok Studio, edad del público, retención ni patrones artificiales. Si faltan vistas recientes, aplica el modelo de respaldo.',
  },
  calculation: {
    title: 'Cómo Estima el Valor la Calculadora de Dinero de TikTok',
    description:
      'En lugar de una puntuación opaca, KalkulatorTik aplica un modelo transparente paso a paso para estimar lo que un creador podría cobrar por video patrocinado.',
    eqBadge: 'Ecuación Central de Valoración',
    eqTitle: 'La Fórmula Base de Patrocinio',
    eqBody:
      'Basada en Costo por Mil (CPM): la tarifa por cada 1.000 visualizaciones. Calcular CPM ajustado mínimo, promedio y máximo entrega la cifra base y el rango.',
    eqPart1: 'Vistas Promedio \u00F7 1.000',
    eqPart2: 'CPM Ajustado',
    eqPart3: 'Tarifa Estimada por Video',
    step1Title: 'Paso 1: Calcular Vistas Promedio y Tasa de Engagement',
    step1Desc: 'Al consultar un usuario público, se analizan hasta 30 videos públicos recientes con conteo de vistas:',
    avgViewsTitle: 'Vistas Promedio por Video',
    avgViewsDesc: 'Calcula la media aritmética simple entre los videos públicos recientes (> 0 vistas):',
    avgViewsFormula: 'Vistas Prom. = Suma de Vistas Recientes \u00F7 Videos Analizados',
    engTitle: 'Tasa de Engagement',
    engDesc: 'Mide las interacciones públicas totales frente a las vistas de los videos muestreados:',
    engFormula: 'Engagement (%) = ((Me gusta + Comentarios + Compartidos) \u00F7 Vistas) \u00D7 100',
    step2Title: 'Paso 2: Selección del Nivel Base de CPM (Supuestos del Modelo)',
    step2Desc:
      'Según el código de región expuesto en el perfil, KalkulatorTik asigna un rango base en USD (por defecto Tier 3 si falta región):',
    tableCaption: 'Supuestos internos de CPM base de KalkulatorTik (USD por 1.000 vistas).',
    thTier: 'Nivel de Mercado',
    thCountries: 'Códigos de Región',
    thMin: 'Base Mín.',
    thAvg: 'Base Prom.',
    thMax: 'Base Máx.',
    step2Note: (
      <>
        <strong>Nota Metodológica:</strong> Estos niveles son referencias internas de KalkulatorTik y no tarifas
        oficiales ni promedios garantizados de TikTok.
      </>
    ),
    step3Title: 'Paso 3: Multiplicadores de Engagement y Escala de Seguidores',
    step3Desc: (
      <>
        Dos multiplicadores ajustan el CPM inicial antes de acotarlo entre <strong>$7.00</strong> y{' '}
        <strong>$80.00</strong> por cada 1.000 vistas:
      </>
    ),
    engAdjTitle: (
      <>
        Ajuste de Engagement (<code>0.90x&ndash;1.20x</code>)
      </>
    ),
    engAdjBody: (
      <>
        Escala linealmente desde <code>0%</code> (<code>0.90x</code>) pasando por el punto neutro <code>5.0%</code> (
        <code>1.00x</code>) hasta un tope de <code>1.20x</code> con <code>15%+</code> de engagement.
      </>
    ),
    engAdjBox1: '0% = 0.90x · 5.0% = 1.00x (Neutro)',
    engAdjBox2: '7.5% = 1.05x · 15%+ = 1.20x (Tope)',
    scaleTitle: (
      <>
        Escala de Seguidores (<code>1.00x&ndash;1.18x</code>)
      </>
    ),
    scaleSub: 'Escala de respaldo social solo al alza (sin penalizar cuentas pequeñas):',
    boundsTitle: (
      <>
        Piso y Techo de CPM (<code>$7.00&ndash;$80.00</code>)
      </>
    ),
    boundsBody: (
      <>
        Cada CPM mínimo, promedio y máximo se multiplica por ambos factores y se limita entre <code>$7.00</code> y{' '}
        <code>$80.00</code>.
      </>
    ),
    boundsBox: 'CPM Ajustado = Base × Eng × Escala (Límite $7–$80)',
    fallbackTitle: 'Estimaciones de Respaldo Cuando Faltan Vistas Recientes',
    fallbackViews: (
      <>
        <strong className="text-slate-900">Vistas Promedio de Respaldo:</strong> Se estiman al <code>8%</code> de
        seguidores desde <code>12.500+</code>, <code>10%</code> entre <code>10.000</code> y <code>12.499</code>, con un
        piso de <code>1.000</code> vistas por debajo.
      </>
    ),
    fallbackEng: (
      <>
        <strong className="text-slate-900">Engagement de Respaldo:</strong> Calculado desde me gusta totales, videos y
        seguidores (<code>1.0%–50.0%</code>), o promedios por tamaño de cuenta si faltan cifras.
      </>
    ),
    exampleBadge: 'Ejemplo Hipotético del Modelo',
    exampleTitle: 'Ejemplo Práctico: Cálculo de Referencia para un Creador',
    exampleTag: 'Perfil de Ejemplo',
    exRegionLabel: 'Región del Perfil',
    exRegionVal: 'EE. UU. (Tier 1)',
    exFollowersLabel: 'Seguidores',
    exFollowersSub: 'Escala = 1.08x',
    exViewsLabel: 'Vistas Promedio',
    exViewsVal: '50.000 / video',
    exViewsSub: '50,0 unidades',
    exEngLabel: 'Engagement',
    exEngSub: 'Factor = 1.08x',
    exStep1: '1. Engagement Normalizado:',
    exStep2: '2. Factor de Engagement:',
    exStep3: '3. Multiplicador Combinado:',
    exStep4Label: '4. Rango CPM Ajustado:',
    exStep4Min: 'Mín',
    exStep4Avg: 'Prom',
    exStep4Max: 'Máx',
    exStep4Tag: '$34.99 prom',
    exStep5Title: '5. Referencia Final (50 × $34.99)',
    exPerVideo: 'por video patrocinado',
    exRange: 'Rango: $1,283.00 – $2,449.50',
    exFooterNote: 'Ejemplo meramente ilustrativo; no evalúa demografía privada ni tasas de conversión.',
    transitionNote:
      'Debido a que modela lo que pagan anunciantes externos por video, cumple un propósito muy distinto a los pagos internos de TikTok.',
  },
  channels: {
    title: 'Patrocinios de Marca vs. TikTok Creator Rewards: ¿Cuál es la diferencia?',
    description:
      'Muchos usuarios buscan pagos directos de la app, pero los acuerdos con marcas y el Programa TikTok Creator Rewards provienen de pagadores diferentes bajo reglas distintas.',
    leftBadge: 'Estimado por esta Calculadora',
    leftTitle: 'Cómo Funcionan los Patrocinios con Marcas',
    leftLead: (
      <>
        Un acuerdo comercial privado en el que una empresa o agencia paga al creador por integrar un producto en un{' '}
        <strong>video patrocinado</strong>.
      </>
    ),
    leftItems: [
      ['Quién Paga', 'Marcas, negocios o agencias directamente mediante factura o transferencia.'],
      ['Cómo se Fija el Precio', 'Negociado por video o paquete según alcance esperado, nicho, producción y licencias.'],
      ['Requisitos', 'Abierto a creadores de cualquier tamaño—incluso por debajo de 10.000 seguidores.'],
    ],
    rightBadge: 'Programa Interno de la App',
    rightTitle: 'Cómo Funciona el Programa TikTok Creator Rewards',
    rightLead:
      'Pagos directos gestionados por TikTok (sucesor del antiguo Creator Fund) dentro del saldo de creador en la aplicación.',
    rightItems: [
      ['Quién Paga', 'TikTok distribuye fondos directamente a creadores inscritos bajo sus términos oficiales.'],
      [
        'Elegibilidad',
        <>
          Requiere <code>10.000+</code> seguidores, <code>100.000+</code> vistas en 30 días, <code>18+</code> años (
          <code>19+</code> en Corea del Sur), buen historial y país elegible.
        </>,
      ],
      [
        'Reglas de Pago',
        <>
          Solo aplica a videos originales de <code>1+ minuto</code> evaluados con <strong>vistas calificadas</strong> y
          RPM dinámico.
        </>,
      ],
      ['Otras Funciones', 'Regalos LIVE y comisiones de TikTok Shop siguen políticas propias independientes.'],
    ],
    compareTitle: 'Comparación Directa: Acuerdos con Marcas vs. Monetización Oficial',
    tableCaption: 'Diferencias clave entre patrocinios comerciales y pagos de TikTok.',
    thFeature: 'Característica',
    thSponsor: 'Patrocinios de Marca (Videos)',
    thRewards: 'TikTok Creator Rewards (Plataforma)',
    whyTitle: 'Por Qué una Estimación de Patrocinio No es un Pago Directo de TikTok',
    whyBody:
      'Las métricas privadas de Creator Rewards viven únicamente dentro de TikTok Studio y ninguna herramienta externa puede verlas. Además, las marcas pagan producción personalizada e integración de producto.',
    whyFootnote: 'TikTok define exclusivamente las reglas, países admitidos y términos de pago de Creator Rewards.',
  },
  factors: {
    title: '¿Qué Factores Afectan las Tarifas de Patrocinio en TikTok?',
    description:
      'Dos cuentas con vistas parecidas pueden cobrar montos muy distintos. Separar las señales públicas medidas por esta calculadora de las cláusulas comerciales te permite cotizar mejor.',
    measuredTitle: 'Medido Automáticamente en la Fórmula',
    measuredBadge: '4 Señales Públicas',
    measuredBody: (
      <>
        El estimador ya pondera <strong>Vistas Promedio</strong>, <strong>Tasa de Engagement</strong>,{' '}
        <strong>Región</strong> y <strong>Escala de Seguidores</strong> antes de los ajustes de negociación.
      </>
    ),
    unmeasuredTitle: 'Factores Reales de Negociación No Medidos por la Calculadora',
    unmeasuredBadge: 'Negociado en Privado',
    adjustTitle: 'Cómo Ajustar Tu Cotización Según los Términos de Campaña',
    adjustBody: (
      <>
        Trata el resultado como <strong>tarifa base para una publicación orgánica patrocinada</strong> y suma conceptos
        separados para Spark Ads, licencias de uso, exclusividad o rodajes complejos.
      </>
    ),
  },
  followersVsViews: {
    title: 'Seguidores vs. Vistas de Video: ¿Qué Importa Más en Patrocinios?',
    description:
      'El feed Para Ti de TikTok distribuye videos por interés y retención, no solo a seguidores. Por eso un canal grande inactivo y uno mediano activo ofrecen alcances muy distintos.',
    creatorATag: 'Creador Hipotético A · Cuenta Grande Inactiva',
    creatorAPrice: '$143.68 / video',
    creatorABody: (
      <>
        Acumuló <strong>500.000 seguidores</strong> en tendencias pasadas, pero hoy promedia{' '}
        <strong>8.000 vistas</strong> con <code>1.20%</code> de engagement (región Tier 3).
      </>
    ),
    creatorBTag: 'Creador Hipotético B · Alto Alcance Activo',
    creatorBPrice: '$2,163.85 / video',
    creatorBBody: (
      <>
        Canal de nicho con <strong>50.000 seguidores</strong> que alcanza <strong>65.000 vistas promedio</strong> por
        publicación y <code>9.40%</code> de engagement (región Tier 1).
      </>
    ),
    labelFollowers: 'Seguidores',
    labelViews: 'Vistas Promedio por Video',
    compareTitle: 'Comparación del Modelo: Muchos Seguidores vs. Vistas Constantes',
    compareCaption: 'Comparación hipotética calculada con la fórmula de KalkulatorTik.',
    thMetric: 'Métrica / Paso',
    thCreatorA: 'Creador A (500K Seguidores)',
    thCreatorB: 'Creador B (50K Seguidores)',
    thWhy: 'Por Qué Importa',
    tier3Note:
      'Nota: Incluso dentro del mismo mercado Tier 3 ($18.00 CPM base prom.), las 65.000 vistas y el 9,40 % del Creador B rinden $1,298.70 por video ($19.98 CPM)—9× más que los $143.68 del Creador A.',
    stillMattersTitle: 'Cuándo Sigue Importando el Número de Seguidores',
    stillMattersList: [
      <>
        <strong>Percepción de Marca y Prueba Social:</strong> Algunos anunciantes filtran inicialmente por hitos de
        seguidores.
      </>,
      <>
        <strong>Familiaridad Comunitaria:</strong> Quienes vuelven desde la pestaña Siguiendo confían más en
        recomendaciones recurrentes.
      </>,
      <>
        <strong>Funciones de la Plataforma:</strong> Los umbrales desbloquean transmisiones LIVE y programas internos.
      </>,
    ],
    rateCardTitle: 'Construye un Media Kit y Tarifario Equilibrado',
    rateCardBody: (
      <>
        Destaca primero tus <strong>vistas promedio recientes</strong>, <strong>engagement</strong> y retención. Los
        seguidores reflejan crecimiento pasado; las vistas reflejan alcance comercial actual.
      </>
    ),
    rateCardPrompt: '¿Listo para probar tu perfil?',
    rateCardBtn: 'Ver Referencia de Tu Perfil \u2191',
  },
  relatedTools: {
    title: 'Explora Más Calculadoras Gratis de TikTok',
    description:
      'Combinar la valoración de patrocinios con cálculos de costos publicitarios y engagement te da una visión completa.',
    tool1Tag: 'Auditoría de Interacción',
    tool1Badge: 'Entrada Manual',
    tool1Title: 'Calculadora de Tasa de Engagement de TikTok',
    tool1Desc: (
      <>
        Calcula la interacción media de me gusta usando <strong>Me gusta totales</strong>,{' '}
        <strong>Videos totales</strong> y <strong>Seguidores</strong> (admite formatos abreviados como{' '}
        <code>277.8K</code> o <code>4.2M</code>) frente a promedios desde <code>1K&ndash;5K</code> hasta{' '}
        <code>1M+</code>.
      </>
    ),
    tool1Formula: '((Me gusta Totales ÷ Seguidores Totales) ÷ Videos Totales) × 100',
    tool1Best: 'Ideal para auditorías de canal, media kits y cuentas privadas con datos manuales.',
    tool1Cta: 'Abrir Calculadora de Engagement \u2192',
    tool2Tag: 'Matemática de Anuncios',
    tool2Badge: '7 Divisas',
    tool2Title: 'Calculadora de CPM de TikTok',
    tool2Desc: (
      <>
        Utilidad de tres modos en <code>USD</code>, <code>EUR</code>, <code>GBP</code>, <code>CAD</code>,{' '}
        <code>AUD</code>, <code>INR</code> y <code>PKR</code> para comparar presupuestos publicitarios frente a tarifas
        de creadores.
      </>
    ),
    tool2Modes: ['Calcular CPM', 'Calcular Inversión', 'Calcular Impresiones'],
    tool2Best: 'Ideal para media buyers, marcas y creadores validando el ROI.',
    tool2Cta: 'Abrir Calculadora de CPM \u2192',
    refreshTag: 'Vista de Refresco Independiente',
    refreshBadge: 'Incluye Refresco de Caché',
    refreshTitle: 'Consulta de Perfil con Refresco Manual de Caché',
    refreshDesc: (
      <>
        ¿Necesitas actualizar datos en vivo saltando el caché de 1 hora? Usa la vista dedicada con el botón manual{' '}
        <strong>Refresh Data</strong>.
      </>
    ),
    refreshCta: 'Abrir Vista con Refresco \u2192',
  },
  faq: {
    title: 'Preguntas Frecuentes sobre Valoración y Dinero en TikTok',
    description:
      'Respuestas claras sobre metodología de patrocinio, privacidad pública, modo respaldo y negociación.',
    ariaTogglePrefix: 'Abrir o cerrar respuesta: ',
    disclaimer:
      'Las respuestas reflejan la metodología vigente y prácticas generales del sector; no constituyen asesoría financiera, legal ni fiscal.',
    viewAllLink: 'Ver FAQ Completo de Monetización \u2192',
  },
  closing: {
    sectionAriaLabel: 'Iniciar cálculo de perfil TikTok o explorar herramientas relacionadas',
    title: '¿Listo para Calcular Tu Valor de Patrocinio en TikTok?',
    description:
      'Ya sea para armar tu tarifario, evaluar una propuesta comercial o comparar CPM de anuncios, ingresa un usuario público arriba o abre otra herramienta.',
    btnPrimary: 'Calcular por Usuario de TikTok \u2191',
    btnCpm: 'Abrir Calculadora CPM',
    btnEng: 'Abrir Calculadora Engagement',
    aboutLine: (
      <>
        KalkulatorTik es una plataforma independiente de analítica para creadores. Conoce más en{' '}
        <Link to="/about" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Sobre KalkulatorTik
        </Link>{' '}
        o consulta las{' '}
        <Link to="/faq" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Preguntas Frecuentes de Monetización
        </Link>
        .
      </>
    ),
    legalNotice: (
      <>
        KalkulatorTik es una herramienta independiente y no está afiliada, respaldada ni conectada oficialmente con TikTok Inc. o ByteDance Ltd.; todas las marcas pertenecen a sus respectivos propietarios. Las cifras son estimaciones informativas—consulta nuestra{' '}
        <Link to="/privacy" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Política de Privacidad
        </Link>{' '}
        y{' '}
        <Link to="/terms" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Términos y Condiciones
        </Link>
        .
      </>
    ),
  },
};

export const ES_HOME_PACK = {
  seo,
  faqSchema,
  metricsGuide,
  cpmTiers,
  followerScaleTiers,
  channelRows,
  factors,
  creatorRows,
  faqItems,
  copy,
};

