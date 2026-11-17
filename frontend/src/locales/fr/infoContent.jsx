import React from 'react';
import Link from '../../components/LocaleLink';

const seo = {
  title: "Calculateur d'Argent TikTok – Estimez vos Revenus",
  description:
    "Estimez vos revenus TikTok grâce à notre calculateur gratuit. Découvrez vos gains potentiels selon vos vues, abonnés, taux d'engagement et partenariats.",
  ogLocale: 'fr_FR',
};

const metricsGuide = [
  {
    name: 'Abonnés',
    tag: "Portée d'Audience",
    description:
      'Nombre total de comptes suivant le créateur sur TikTok. Reflète la taille du public et applique un multiplicateur d’échelle secondaire.',
  },
  {
    name: "J'aime totaux",
    tag: 'Cumul des mentions',
    description: "Total cumulé des mentions J'aime sur l'ensemble des vidéos publiques visibles.",
  },
  {
    name: 'Vidéos totales',
    tag: 'Vidéos publiées',
    description: 'Nombre total de vidéos publiques publiées sur le compte.',
  },
  {
    name: 'Abonnements',
    tag: 'Comptes suivis',
    description: 'Nombre total de profils suivis par le créateur.',
  },
  {
    name: 'Vues Moy. Est.',
    tag: 'Vues par vidéo',
    description:
      'Moyenne de vues par vidéo issue des publications récentes, ou estimée à partir des abonnés lorsque les vues récentes manquent.',
  },
  {
    name: 'Engagement',
    tag: "Taux d'interaction",
    description:
      "Somme des mentions J'aime, commentaires et partages divisée par le total des vues de l'échantillon récent (ou estimée en mode de secours).",
  },
];

const cpmTiers = [
  {
    tier: 'Marchés Tier 1',
    regions: 'US, CA, UK, GB, AU, NZ, DE',
    min: '$22.00',
    avg: '$30.00',
    max: '$42.00',
    featured: true,
  },
  {
    tier: 'Marchés Tier 2',
    regions: 'FR, ES, IT, PT, BR, MX, SG, NL, BE, SE, NO, DK, FI, IE, CH',
    min: '$16.00',
    avg: '$22.00',
    max: '$32.00',
    featured: false,
  },
  {
    tier: 'Tier 3 / Défaut Global',
    regions: 'Autres régions ou lorsque le profil ne fournit aucun code région',
    min: '$12.00',
    avg: '$18.00',
    max: '$26.00',
    featured: false,
  },
];

const followerScaleTiers = [
  { range: "Jusqu'à 10 000 abonnés", factor: '1.00x' },
  { range: '10 001 à 100 000 abonnés', factor: '1.02x' },
  { range: '100 001 à 500 000 abonnés', factor: '1.08x' },
  { range: '500 001 à 2 000 000 abonnés', factor: '1.12x' },
  { range: 'Plus de 2 000 000 abonnés', factor: '1.18x' },
];

const channelRows = [
  {
    feature: 'Source de Paiement',
    sponsorships: 'Marques externes, annonceurs ou agences marketing',
    rewards: "TikTok (ByteDance) directement vers le solde créateur dans l'application",
  },
  {
    feature: 'Indicateur de Tarif',
    sponsorships: 'Tarif négocié indexé sur le CPM de sponsoring (coût pour 1 000 vues)',
    rewards: 'RPM variable de la plateforme (revenu pour 1 000 vues admissibles) fixé par TikTok',
  },
  {
    feature: 'Durée des Vidéos',
    sponsorships: 'Toute durée convenue dans le brief de campagne',
    rewards: "Doit respecter la durée minimale et les règles d'originalité TikTok",
  },
  {
    feature: "Seuil d'Abonnés",
    sponsorships: 'Aucun seuil plateforme obligatoire ; dépend de la pertinence et de la portée',
    rewards: "Exige les critères officiels d'abonnés et de vues sur 30 jours",
  },
  {
    feature: 'Modélisé par KalkulatorTik ?',
    sponsorships: "Oui — Modélisé par notre Calculateur d'Argent TikTok principal",
    rewards: 'Non — Nécessite des données internes privées (vues qualifiées et RPM)',
    isStatusRow: true,
  },
];

const factors = [
  {
    num: '01',
    title: "Démographie Vérifiée de l'Audience",
    body: "Les codes pays publics restent indicatifs. Les marques demandent généralement des captures TikTok Studio montrant pays, tranches d'âge et répartition par sexe.",
  },
  {
    num: '02',
    title: 'Thématique ou Niche de Contenu',
    body: 'Les niches à forte intention commerciale — finances personnelles, logiciels, B2B, soins, fitness et tech — affichent souvent des tarifs supérieurs au divertissement général.',
  },
  {
    num: '03',
    title: 'Livrables & Production',
    body: 'Une mention de 15 secondes dans un vlog demande moins de production qu’un tutoriel scénarisé de 60 secondes avec éclairage studio ou tournage extérieur.',
  },
  {
    num: '04',
    title: "Droits d'Usage & Licence",
    body: 'Le tarif de base couvre uniquement la publication organique sur le profil du créateur. La réutilisation sur sites web, e-mails ou publicités payantes justifie des droits dédiés.',
  },
  {
    num: '05',
    title: 'Spark Ads & Amplification Payante',
    body: "Le partage d'un code Spark Ads (whitelisting) engage votre image derrière du budget publicitaire et se facture souvent par périodes de 30, 60 ou 90 jours.",
  },
  {
    num: '06',
    title: 'Exclusivité Sectorielle',
    body: "S'engager à ne promouvoir aucun produit concurrent pendant une période donnée réduit d'autres revenus potentiels et justifie une prime d'exclusivité.",
  },
  {
    num: '07',
    title: 'Forfaits Multi-Vidéos',
    body: "Garantir trois à cinq vidéos sponsorisées sur un trimestre s'accompagne souvent d'une légère remise unitaire en échange d'un budget total sécurisé.",
  },
  {
    num: '08',
    title: 'Saisonnalité & Levier de Négociation',
    body: 'Les pics commerciaux, délais serrés, forte demande créateur et performances historiques modifient régulièrement les contrats signés.',
  },
];

const creatorRows = [
  {
    metric: 'Abonnés Totaux',
    creatorA: '500 000 abonnés',
    creatorB: '50 000 abonnés',
    insight: 'Le Créateur A compte 10× plus d’abonnés que le Créateur B.',
  },
  {
    metric: "Facteur d'Échelle Abonnés",
    creatorA: '1.08x (palier >100K)',
    creatorB: '1.02x (palier >10K)',
    insight: "Le Créateur A obtient un multiplicateur d'échelle plus élevé.",
  },
  {
    metric: 'Vues Moyennes par Vidéo',
    creatorA: '8 000 vues par vidéo',
    creatorB: '65 000 vues par vidéo',
    insight: 'Le Créateur B génère plus de 8× plus de vues par publication.',
  },
  {
    metric: "Taux d'Engagement",
    creatorA: "1,20 % d'interaction",
    creatorB: "9,40 % d'interaction",
    insight: 'Le public du Créateur B aime, commente et partage activement.',
  },
  {
    metric: "Facteur d'Engagement",
    creatorA: '0.924x',
    creatorB: '1.088x',
    insight: "Un engagement fort augmente le multiplicateur CPM du Créateur B.",
  },
  {
    metric: 'Niveau Régional du Profil',
    creatorA: 'Tier 3 / Global ($18.00 CPM moyen de base)',
    creatorB: 'Tier 1 / US ($30.00 CPM moyen de base)',
    insight: 'Les hypothèses régionales distinguent davantage le CPM initial.',
  },
  {
    metric: 'CPM Ajusté du Modèle',
    creatorA: '$17.96 (Fourchette : $11.98 – $25.95)',
    creatorB: '$33.29 (Fourchette : $24.41 – $46.61)',
    insight: "L'engagement actif et le marché doublent presque le CPM.",
  },
  {
    metric: 'Valeur Sponsoring Estimée',
    creatorA: '$143.68 par vidéo ($95.84 – $207.60)',
    creatorB: '$2,163.85 par vidéo ($1,586.65 – $3,029.65)',
    insight: "Les vues réelles et l'engagement expliquent cette estimation supérieure.",
    highlight: true,
  },
];

const faqItems = [
  {
    id: 'faq-1',
    question: "1. Qu'est-ce qu'un calculateur d'argent TikTok estime ?",
    schemaAnswer:
      "Un calculateur d'argent TikTok comme KalkulatorTik estime la rémunération commerciale potentielle d'un sponsoring de marque pour une vidéo sponsorisée sur un profil public TikTok, exprimée en dollars USD selon portée, engagement et CPM régional.",
    answer: (
      <p>
        Un calculateur d’argent TikTok comme <strong>KalkulatorTik</strong> estime les{' '}
        <strong>revenus commerciaux potentiels d’un sponsoring de marque pour une vidéo dédiée</strong> sur un profil
        TikTok public. Plutôt que de simuler un partage publicitaire interne, il indique une estimation principale en
        dollars USD et une fourchette basée sur la portée, l’engagement et le CPM régional.
      </p>
    ),
  },
  {
    id: 'faq-2',
    question: '2. Cette estimation correspond-elle aux paiements TikTok Creator Rewards ?',
    schemaAnswer:
      "Non. Les partenariats de marque et le programme TikTok Creator Rewards sont deux sources distinctes. Creator Rewards rémunère directement sur les vidéos originales de plus d'une minute selon un RPM dynamique (10 000 abonnés, 100 000 vues en 30 jours, 18+ ans ou 19+ en Corée du Sud, compte conforme et pays éligible). Notre outil estime les tarifs de sponsoring privés.",
    answer: (
      <p>
        <strong>Non.</strong> Les sponsorings de marque et le programme TikTok Creator Rewards sont totalement distincts.
        Creator Rewards rémunère directement les créateurs éligibles pour leurs vues qualifiées sur des vidéos
        originales de <code>1+ minute</code> (minimum <code>10 000</code> abonnés, <code>100 000</code> vues sur 30
        jours, <code>18+</code> ans ou <code>19+</code> en Corée du Sud, compte conforme et région éligible). Cet outil
        estime les <strong>tarifs privés avec les marques</strong> sans seuil d’abonnés fixe.
      </p>
    ),
  },
  {
    id: 'faq-3',
    question: "3. Comment l'estimation de sponsoring est-elle calculée sur KalkulatorTik ?",
    schemaAnswer:
      "Le calculateur divise la moyenne des vues par vidéo par 1 000 puis multiplie par un CPM ajusté. À partir des tranches régionales internes ($12–$42 pour Tier 1–Tier 3, bases médianes $18–$30), il applique un facteur d'engagement (0.90x à 1.20x) et un facteur d'abonnés (1.00x à 1.18x), encadrés entre $7.00 et $80.00.",
    answer: (
      <p>
        Nous divisons les <strong>Vues Moyennes par Vidéo</strong> par <code>1 000</code> puis multiplions par un{' '}
        <strong>CPM Ajusté (Coût pour Mille)</strong>. À partir des tranches régionales internes (<code>$12&ndash;$42</code>{' '}
        avec bases médianes <code>$18&ndash;$30</code>), le modèle applique un facteur d’engagement (<code>0.90x</code> à{' '}
        <code>1.20x</code>) et un facteur d’abonnés (<code>1.00x</code> à <code>1.18x</code>), bornés entre{' '}
        <code>$7.00</code> et <code>$80.00</code>.
      </p>
    ),
  },
  {
    id: 'faq-4',
    question: '4. Les abonnés ou les vues comptent-ils davantage pour les tarifs ?',
    schemaAnswer:
      'Les vues moyennes par vidéo comptent généralement davantage pour tarifer une vidéo sponsorisée, car elles reflètent le nombre probable de spectateurs. Un compte plus modeste aux vues régulières dépasse souvent un grand compte peu visionné.',
    answer: (
      <p>
        <strong>Les vues moyennes par vidéo comptent généralement davantage</strong> pour évaluer un partenariat, car
        elles indiquent combien de personnes verront réellement le contenu. Les abonnés apportent une preuve sociale et
        un léger bonus d’échelle, mais des vues régulières pèsent plus lourd.
      </p>
    ),
  },
  {
    id: 'faq-5',
    question: "5. Puis-je estimer les gains sponsorisés avec uniquement un nom d'utilisateur ?",
    schemaAnswer:
      "Oui. Comme KalkulatorTik fonctionne par nom d'utilisateur, il suffit du @handle de n'importe quel compte public pour récupérer les métriques visibles et calculer l'estimation.",
    answer: (
      <p>
        <strong>Oui.</strong> Il suffit d’entrer le nom d’utilisateur (avec ou sans <code>@</code>) de tout profil{' '}
        <strong>Public</strong> pour charger ses statistiques publiques et calculer la référence par vidéo.
      </p>
    ),
  },
  {
    id: 'faq-6',
    question: '6. Le calculateur demande-t-il un mot de passe ou une connexion TikTok ?',
    schemaAnswer:
      "Jamais. KalkulatorTik ne demande ni mot de passe, ni e-mail, ni code 2FA, ni accès TikTok Studio. Tout s'appuie sur les données publiques. Consultez notre Politique de Confidentialité.",
    answer: (
      <p>
        <strong>Jamais.</strong> KalkulatorTik ne demande aucun mot de passe, e-mail, code d’authentification ou accès
        privé. Tout repose sur des données publiques. Consultez notre{' '}
        <Link to="/privacy" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Politique de Confidentialité
        </Link>{' '}
        pour plus d’informations.
      </p>
    ),
  },
  {
    id: 'faq-7',
    question: '7. KalkulatorTik est-il gratuit ?',
    schemaAnswer:
      'Oui. KalkulatorTik est gratuit en ligne sans abonnement ni carte bancaire. Des limites standard protègent le serveur. Retrouvez plus de réponses sur notre page FAQ complète.',
    answer: (
      <p>
        <strong>Oui.</strong> KalkulatorTik est entièrement gratuit en ligne sans abonnement ni inscription. Des limites
        standard de requêtes garantissent la stabilité. Consultez aussi notre{' '}
        <Link to="/faq" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          page FAQ complète
        </Link>
        .
      </p>
    ),
  },
  {
    id: 'faq-8',
    question: '8. Peut-on analyser des profils TikTok privés ?',
    schemaAnswer:
      "Non. Seules les données publiques sont accessibles. Si vous connaissez les totaux d'un compte privé manuellement, utilisez notre Calculateur d'Engagement TikTok ou Calculateur CPM TikTok.",
    answer: (
      <p>
        <strong>Non.</strong> Seules les données publiques sont accessibles. Si vous connaissez vos chiffres manuellement,
        testez notre{' '}
        <Link
          to="/tiktok-engagement-calculator"
          className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800"
        >
          Calculateur d&apos;Engagement TikTok
        </Link>{' '}
        ou{' '}
        <Link
          to="/tiktok-cpm-calculator"
          className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800"
        >
          Calculateur CPM TikTok
        </Link>
        .
      </p>
    ),
  },
  {
    id: 'faq-9',
    question: "9. Pourquoi les données d'un profil sont-elles parfois indisponibles ?",
    schemaAnswer:
      "Une recherche peut échouer si l'identifiant comporte une faute, vient de changer, si le compte est privé/suspendu ou si TikTok limite temporairement les requêtes lors des pics de trafic.",
    answer: (
      <p>
        Une recherche peut échouer en cas de faute de frappe, de changement récent d’identifiant, de compte privé ou
        suspendu, ou de limitation temporaire de TikTok. Vérifiez l’orthographe et réessayez après quelques secondes.
      </p>
    ),
  },
  {
    id: 'faq-10',
    question: '10. Que se passe-t-il lorsque les vues vidéo récentes ne sont pas disponibles ?',
    schemaAnswer:
      "Si les totaux principaux chargent mais pas les vidéos récentes, KalkulatorTik bascule en mode de secours : 8 % des abonnés dès 12 500+, 10 % entre 10 000 et 12 499, minimum 1 000 vues en dessous, et engagement estimé depuis les j'aime totaux.",
    answer: (
      <p>
        Si les compteurs principaux chargent sans liste de vidéos récentes, KalkulatorTik active le{' '}
        <strong>modèle d’estimation de secours</strong> : il estime les vues à <code>8%</code> des abonnés à partir de{' '}
        <code>12 500+</code> (<code>10%</code> entre <code>10 000</code> et <code>12 499</code>, minimum{' '}
        <code>1 000</code> en dessous) et déduit l’engagement des mentions J’aime et vidéos disponibles.
      </p>
    ),
  },
  {
    id: 'faq-11',
    question: '11. Le montant de sponsoring estimé est-il garanti ?',
    schemaAnswer:
      'Non. Toutes les estimations sont purement indicatives et non contractuelles. Les tarifs réels dépendent des accords de marque, de la niche, de la cible et des conditions négociées.',
    answer: (
      <p>
        <strong>Non.</strong> Tous les chiffres sont des repères éducatifs non contractuels et non des revenus garantis.
        Les montants réels dépendent des marques, de votre thématique, de l’audience et de vos négociations.
      </p>
    ),
  },
  {
    id: 'faq-12',
    question: '12. Comment les créateurs peuvent-ils utiliser cette estimation en négociation ?',
    schemaAnswer:
      "Considérez la moyenne comme base pour un post sponsorisé organique, visez le haut de fourchette pour Spark Ads, droits d'usage ou exclusivité, et proposez une remise modérée pour des campagnes multi-vidéos.",
    answer: (
      <div className="space-y-2">
        <p>
          Considérez la moyenne et la fourchette comme une{' '}
          <strong>base pour une vidéo sponsorisée organique standard</strong> :
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            Utilisez la <strong>moyenne estimée</strong> pour vérifier la cohérence des offres reçues.
          </li>
          <li>
            Visez le <strong>haut de la fourchette</strong> (ou au-delà) si la marque ajoute Spark Ads, droits d’usage
            de 30 à 90 jours, exclusivité ou tournage complexe.
          </li>
          <li>
            Accordez une remise modérée vers le <strong>bas de la fourchette</strong> pour un engagement multi-vidéos (3
            ou 5 vidéos).
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
  inLanguage: 'fr',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.schemaAnswer },
  })),
};

const copy = {
  intro: {
    title: "Qu'est-ce qu'un Calculateur d'Argent TikTok ?",
    description:
      "Un Calculateur d'Argent TikTok est un outil d'estimation qui évalue combien un profil public peut facturer pour une vidéo sponsorisée—et aide les marques à calibrer des tarifs équitables.",
    p1: (
      <>
        Au lieu de deviner ce qu’un compte peut facturer lors d’une collaboration, ce{' '}
        <strong className="font-semibold text-slate-900">calculateur d’argent TikTok</strong> analyse les signaux
        publics accessibles&mdash;dont les <strong className="font-semibold text-slate-900">vues moyennes par vidéo</strong>,
        le <strong className="font-semibold text-slate-900">taux d’engagement</strong>, la{' '}
        <strong className="font-semibold text-slate-900">région du profil</strong> et la{' '}
        <strong className="font-semibold text-slate-900">taille d’abonnés</strong>&mdash;pour estimer un tarif par
        vidéo en USD avec une fourchette de négociation.
      </>
    ),
    p2: "Que vous prépariez votre grille tarifaire de créateur ou que vous compariez des profils avant une campagne, KalkulatorTik fournit une référence claire depuis n'importe quel identifiant public sans connexion.",
  },
  howToUse: {
    title: "Comment Utiliser le Calculateur d'Argent TikTok",
    description:
      "Estimez la valeur d'une vidéo sponsorisée par nom d'utilisateur en trois étapes simples, sans inscription.",
    actionLabel: 'Ouvrir le Calculateur ci-dessus \u2191',
    steps: [
      {
        badge: 'ÉTAPE 01',
        title: "Entrer le Nom d'Utilisateur & Calculer",
        body: (
          <>
            Saisissez tout identifiant public TikTok ci-dessus (ex. <code>khaby.lame</code> ou <code>@mrbeast</code>)
            &mdash;le <code>@</code> est retiré automatiquement&mdash;puis cliquez sur{' '}
            <strong>Calculer la Valeur Sponsorisée</strong>.
          </>
        ),
      },
      {
        badge: 'ÉTAPE 02',
        title: 'Vérifier le Profil & la Source',
        body: (
          <>
            Contrôlez sur le bandeau si les chiffres viennent de <strong>vidéos récentes en direct</strong> ou du{' '}
            <strong>mode de secours</strong>, puis consultez la valeur, le CPM et les 6 indicateurs.
          </>
        ),
      },
      {
        badge: 'ÉTAPE 03',
        title: 'Adapter aux Termes du Contrat',
        body: (
          <>
            <strong>Créateurs :</strong> Utilisez l’estimation comme base organique avant d’ajouter Spark Ads ou droits
            d’usage. <strong>Marques :</strong> Comparez les devis avec la portée attendue.
          </>
        ),
      },
    ],
    troubleshootingTitle: 'Dépannage & Actualisation Manuelle du Cache',
    troubleshootingP1: (
      <>
        <strong className="text-slate-900">Profils Publics &amp; Limites Temporaires :</strong> Seuls les profils
        publics sont analysables. En cas de pause réseau TikTok, patientez quelques secondes.
      </>
    ),
    troubleshootingP2: (
      <>
        <strong className="text-slate-900">Cache 1 Heure &amp; Nouvelles Données :</strong> Les résultats restent en
        cache jusqu’à 1 heure. Pour forcer une mise à jour immédiate, utilisez <strong>Refresh Data</strong> via la{' '}
        <Link to="/calculator" className="font-semibold text-teal-700 underline underline-offset-2">
          Vue d&apos;Actualisation Dédiée
        </Link>
        .
      </>
    ),
    footerNote: 'Ci-dessous, chaque carte de valorisation et les six métriques publiques sont expliquées en détail.',
  },
  results: {
    title: 'Performance du Profil & Valeur Sponsoring Estimée',
    description:
      'Chaque recherche transforme les signaux publics en une estimation tarifaire complète pour une vidéo sponsorisée.',
    primaryEyebrow: 'Résultat Principal de Valorisation',
    usdBadge: 'Référence USD',
    primaryTitle: 'Valeur Sponsoring Estimée par Vidéo',
    primaryLead: (
      <>
        Le montant affiché représente le{' '}
        <strong className="font-semibold text-slate-900">tarif de base estimé pour une vidéo sponsorisée</strong>,
        complété par deux indicateurs :
      </>
    ),
    rangeTitle: 'Fourchette de Sponsoring Estimée',
    rangeBody:
      'Les mentions rapides ou packs multi-vidéos se situent souvent vers le bas ; les niches spécialisées ou livrables étendus tendent vers le haut.',
    cpmTitle: 'Référence CPM du Modèle',
    cpmBody:
      'Tarif publicitaire brut supposé pour 1 000 vues après ajustement selon région, engagement et taille d’abonnés.',
    cacheNote: 'Les valeurs reflètent les données publiques lors de la requête (ou en cache jusqu’à 1 heure).',
    profileOverviewTitle: 'Aperçu du Profil Public',
    profileOverviewBadge: "Signaux d'Identité",
    profileOverviewBody: (
      <>
        Affiche les éléments publics disponibles&mdash;nom d’affichage, <code>@handle</code>, badge vérifié, bio, code
        région (si exposé), identifiant TikTok et date de création.
      </>
    ),
    metricsTitle: "Aperçu du Compte & Indicateurs d'Activité",
    metricsBadge: '6 Indicateurs Publics',
    howToReadTitle: 'Comment Lire Vos Résultats',
    howToReadBody: (
      <>
        Servez-vous de cette estimation comme repère de négociation pratique, jamais comme prix fixe ni revenu garanti.{' '}
        <strong className="text-slate-900">Créateurs</strong> y ajoutent droits et exclusivité ;{' '}
        <strong className="text-slate-900">marques</strong> valident l’adéquation entre devis et portée réelle.
      </>
    ),
    limitationsBadge: "Limites de l'Estimation",
    limitationsBody:
      'Ce résultat exploite uniquement les signaux publics. Il ne consulte ni les statistiques privées TikTok Studio, ni l’âge du public, ni le taux de rétention. Un modèle de secours s’applique si les vidéos récentes manquent.',
  },
  calculation: {
    title: "Comment le Calculateur d'Argent TikTok Estime la Valeur",
    description:
      'Plutôt qu’un score opaque, KalkulatorTik applique une formule transparente étape par étape pour modéliser un tarif vidéo réaliste.',
    eqBadge: 'Équation Centrale de Valorisation',
    eqTitle: 'Formule Fondamentale de Sponsoring',
    eqBody:
      'Fondée sur le Coût pour Mille (CPM) par 1 000 vues. Le calcul des CPM ajustés min, moyen et max génère la référence et sa fourchette.',
    eqPart1: 'Vues Moyennes \u00F7 1 000',
    eqPart2: 'CPM Ajusté',
    eqPart3: 'Tarif Vidéo Estimé',
    step1Title: "Étape 1 : Calculer les Vues Moyennes et le Taux d'Engagement",
    step1Desc: 'Lors d’une recherche publique, l’outil examine jusqu’à 30 vidéos récentes publiant des vues :',
    avgViewsTitle: 'Vues Moyennes par Vidéo',
    avgViewsDesc: 'Calcule la moyenne arithmétique simple sur les vidéos récentes (> 0 vue) :',
    avgViewsFormula: 'Vues Moy. = Somme des Vues Récentes \u00F7 Vidéos Analysées',
    engTitle: "Taux d'Engagement",
    engDesc: 'Mesure les interactions publiques totales par rapport aux vues échantillonnées :',
    engFormula: 'Engagement (%) = ((J’aime + Commentaires + Partages) \u00F7 Vues) \u00D7 100',
    step2Title: 'Étape 2 : Choix du Palier CPM de Base (Hypothèses)',
    step2Desc:
      'Selon le code région visible sur le profil, KalkulatorTik assigne une tranche USD initiale (Tier 3 par défaut si absente) :',
    tableCaption: 'Hypothèses internes de CPM de base KalkulatorTik (USD pour 1 000 vues).',
    thTier: 'Niveau de Marché',
    thCountries: 'Codes Région du Profil',
    thMin: 'Base Min',
    thAvg: 'Base Moy',
    thMax: 'Base Max',
    step2Note: (
      <>
        <strong>Note Méthodologique :</strong> Ces tranches représentent des repères internes&mdash;non des tarifs
        officiels TikTok ni des moyennes contractuelles garanties.
      </>
    ),
    step3Title: "Étape 3 : Multiplicateurs d'Engagement et d'Échelle Abonnés",
    step3Desc: (
      <>
        Deux multiplicateurs ajustent le CPM initial avant un plafonnement strict entre <strong>$7.00</strong> et{' '}
        <strong>$80.00</strong> pour 1 000 vues :
      </>
    ),
    engAdjTitle: (
      <>
        Ajustement Engagement (<code>0.90x&ndash;1.20x</code>)
      </>
    ),
    engAdjBody: (
      <>
        Progresse linéairement de <code>0%</code> (<code>0.90x</code>) via <code>5.0%</code> neutre (<code>1.00x</code>
        ) jusqu’à <code>1.20x</code> pour <code>15%+</code> d’engagement.
      </>
    ),
    engAdjBox1: '0% = 0.90x · 5.0% = 1.00x (Neutre)',
    engAdjBox2: '7.5% = 1.05x · 15%+ = 1.20x (Plafond)',
    scaleTitle: (
      <>
        Échelle Abonnés (<code>1.00x&ndash;1.18x</code>)
      </>
    ),
    scaleSub: 'Bonus positif uniquement (les petits créateurs ne sont jamais pénalisés) :',
    boundsTitle: (
      <>
        Plancher &amp; Plafond CPM (<code>$7.00&ndash;$80.00</code>)
      </>
    ),
    boundsBody: (
      <>
        Chaque CPM (bas, moyen, haut) est multiplié par les deux facteurs puis borné entre <code>$7.00</code> et{' '}
        <code>$80.00</code>.
      </>
    ),
    boundsBox: 'CPM Ajusté = Base × Eng × Échelle (Borné $7–$80)',
    fallbackTitle: 'Estimations de Secours Sans Vues Vidéo Récentes',
    fallbackViews: (
      <>
        <strong className="text-slate-900">Vues Moyennes de Secours :</strong> <code>8%</code> des abonnés dès{' '}
        <code>12 500+</code>, <code>10%</code> entre <code>10 000</code> et <code>12 499</code>, et plancher de{' '}
        <code>1 000</code> vues en dessous.
      </>
    ),
    fallbackEng: (
      <>
        <strong className="text-slate-900">Engagement de Secours :</strong> Calculé à partir des J’aime totaux, vidéos
        et abonnés (<code>1.0%–50.0%</code>), ou valeurs paliers si ces compteurs manquent.
      </>
    ),
    exampleBadge: 'Exemple Hypothétique',
    exampleTitle: "Exemple Chiffré : Calcul d'une Référence Sponsoring",
    exampleTag: 'Profil Exemple',
    exRegionLabel: 'Région',
    exRegionVal: 'US (Tier 1)',
    exFollowersLabel: 'Abonnés',
    exFollowersSub: 'Échelle = 1.08x',
    exViewsLabel: 'Vues Moyennes',
    exViewsVal: '50 000 / vidéo',
    exViewsSub: '50,0 unités',
    exEngLabel: 'Engagement',
    exEngSub: 'Facteur = 1.08x',
    exStep1: '1. Engagement Normalisé :',
    exStep2: "2. Facteur d'Engagement :",
    exStep3: '3. Multiplicateur Combiné :',
    exStep4Label: '4. Fourchette CPM Ajusté :',
    exStep4Min: 'Min',
    exStep4Avg: 'Moy',
    exStep4Max: 'Max',
    exStep4Tag: '$34.99 moy',
    exStep5Title: '5. Référence Finale (50 × $34.99)',
    exPerVideo: 'par vidéo sponsorisée',
    exRange: 'Fourchette : $1,283.00 – $2,449.50',
    exFooterNote: 'Exemple illustratif ; ne consulte ni démographie privée ni conversions.',
    transitionNote:
      "Comme cet outil modélise la rémunération versée par des marques externes, son rôle diffère des paiements internes de TikTok.",
  },
  channels: {
    title: 'Sponsorings de Marque vs. TikTok Creator Rewards : Quelle Différence ?',
    description:
      'Les contrats commerciaux avec des marques et le programme officiel Creator Rewards impliquent des payeurs distincts et obéissent à des règles propres.',
    leftBadge: 'Estimé par ce Calculateur',
    leftTitle: 'Fonctionnement des Sponsorings de Marque',
    leftLead: (
      <>
        Un accord commercial privé dans lequel une entreprise ou agence rémunère un créateur pour présenter un produit
        dans une <strong>vidéo sponsorisée</strong>.
      </>
    ),
    leftItems: [
      ['Payeur', 'Marques, entreprises ou agences directement par facture ou virement.'],
      ['Fixation du Prix', 'Négocié par vidéo ou campagne selon portée attendue, niche, production et droits.'],
      ['Éligibilité', 'Ouvert à toute taille de compte—y compris les nano-créateurs sous 10 000 abonnés.'],
    ],
    rightBadge: 'Programme Intégré TikTok',
    rightTitle: 'Fonctionnement de TikTok Creator Rewards',
    rightLead:
      'Paiements directs gérés par TikTok (remplaçant l’ancien Creator Fund) via le solde créateur de l’application.',
    rightItems: [
      ['Payeur', 'TikTok verse directement les fonds aux créateurs éligibles selon ses conditions.'],
      [
        'Critères',
        <>
          Exige <code>10 000+</code> abonnés, <code>100 000+</code> vues sur 30 jours, <code>18+</code> ans (
          <code>19+</code> en Corée du Sud), compte conforme et pays pris en charge.
        </>,
      ],
      [
        'Règles de Calcul',
        <>
          S’applique uniquement aux vidéos originales de <code>1+ minute</code> avec <strong>vues qualifiées</strong> et
          RPM dynamique.
        </>,
      ],
      ['Autres Revenus', 'Cadeaux LIVE et commissions TikTok Shop suivent des politiques distinctes.'],
    ],
    compareTitle: 'Comparatif Direct : Partenariats de Marque vs. Programme Plateforme',
    tableCaption: 'Principales différences entre sponsorings privés et versements TikTok.',
    thFeature: 'Critère',
    thSponsor: 'Sponsorings de Marque',
    thRewards: 'TikTok Creator Rewards',
    whyTitle: "Pourquoi l'Estimation Sponsoring N'est Pas un Versement TikTok",
    whyBody:
      "Les métriques privées Creator Rewards restent exclusivement dans TikTok Studio. De plus, les marques financent une production sur mesure plutôt qu'un revenu publicitaire passif.",
    whyFootnote:
      'Les critères, pays éligibles et modalités Creator Rewards sont fixés uniquement par TikTok.',
  },
  factors: {
    title: 'Quels Facteurs Influencent les Tarifs Sponsoring TikTok ?',
    description:
      'Deux comptes aux vues proches peuvent négocier des montants très différents selon la cible commerciale et les droits cédés.',
    measuredTitle: 'Mesuré Automatiquement dans la Formule',
    measuredBadge: '4 Signaux Publics',
    measuredBody: (
      <>
        L’estimateur pondère déjà les <strong>Vues Moyennes</strong>, le <strong>Taux d’Engagement</strong>, le{' '}
        <strong>Code Région</strong> et la <strong>Taille d’Abonnés</strong> avant négociation.
      </>
    ),
    unmeasuredTitle: 'Facteurs Réels Non Mesurés par le Calculateur',
    unmeasuredBadge: 'Négociés en Privé',
    adjustTitle: 'Comment Ajuster Votre Devis selon le Brief',
    adjustBody: (
      <>
        Considérez le chiffre comme une <strong>base pour un post organique</strong>, puis facturez séparément Spark Ads,
        droits d’usage, exclusivité ou tournages lourds.
      </>
    ),
  },
  followersVsViews: {
    title: 'Abonnés vs. Vues Vidéo : Qu’est-ce qui Compte le Plus en Sponsoring ?',
    description:
      'L’algorithme Pour Toi diffuse chaque vidéo selon l’intérêt et la rétention. Un grand compte endormi et un compte moyen actif offrent donc des audiences très différentes.',
    creatorATag: 'Créateur A · Grand Compte Peu Actif',
    creatorAPrice: '$143.68 / vidéo',
    creatorABody: (
      <>
        A réuni <strong>500 000 abonnés</strong> jadis, mais n’atteint plus que <strong>8 000 vues</strong> en moyenne
        avec <code>1.20%</code> d’engagement (Tier 3).
      </>
    ),
    creatorBTag: 'Créateur B · Forte Portée Active',
    creatorBPrice: '$2,163.85 / vidéo',
    creatorBBody: (
      <>
        Chaîne de niche avec <strong>50 000 abonnés</strong> réalisant <strong>65 000 vues moyennes</strong> et{' '}
        <code>9.40%</code> d’engagement (Tier 1).
      </>
    ),
    labelFollowers: 'Abonnés',
    labelViews: 'Vues Moyennes par Vidéo',
    compareTitle: 'Comparaison : Abonnés Élevés vs. Vues Régulières',
    compareCaption: 'Comparaison hypothétique calculée selon la formule KalkulatorTik.',
    thMetric: 'Indicateur / Étape',
    thCreatorA: 'Créateur A (500K Abonnés)',
    thCreatorB: 'Créateur B (50K Abonnés)',
    thWhy: 'Impact',
    tier3Note:
      'Note : Même dans un marché Tier 3 identique ($18.00 CPM de base), les 65 000 vues et 9,40 % du Créateur B génèrent $1,298.70 par vidéo—9× plus que le Créateur A.',
    stillMattersTitle: 'Quand le Nombre d’Abonnés Garde un Intérêt',
    stillMattersList: [
      <>
        <strong>Image de Marque :</strong> Certains annonceurs filtrent encore par paliers d’abonnés.
      </>,
      <>
        <strong>Fidélité Communautaire :</strong> Les abonnés réguliers accordent souvent davantage de confiance.
      </>,
      <>
        <strong>Accès aux Fonctions :</strong> Certains seuils débloquent les lives et programmes officiels.
      </>,
    ],
    rateCardTitle: 'Construire un Tarif Créateur Équilibré',
    rateCardBody: (
      <>
        Mettez en avant vos <strong>vues moyennes récentes</strong>, votre <strong>taux d’engagement</strong> et vos
        meilleures rétentions. Les vues reflètent la portée commerciale actuelle.
      </>
    ),
    rateCardPrompt: 'Prêt à tester votre compte ?',
    rateCardBtn: 'Tester Votre Profil \u2191',
  },
  relatedTools: {
    title: 'Découvrir Plus de Calculateurs TikTok Gratuits',
    description:
      'Complétez votre estimation sponsoring avec nos outils dédiés au coût publicitaire CPM et à l’audit d’engagement.',
    tool1Tag: "Audit d'Interaction",
    tool1Badge: 'Saisie Manuelle',
    tool1Title: "Calculateur d'Engagement TikTok",
    tool1Desc: (
      <>
        Calcule le taux moyen de mentions J’aime par vidéo à partir des <strong>J’aime totaux</strong>,{' '}
        <strong>Vidéos</strong> et <strong>Abonnés</strong> (formats <code>277.8K</code> ou <code>4.2M</code>{' '}
        acceptés) face aux repères de <code>1K&ndash;5K</code> à <code>1M+</code>.
      </>
    ),
    tool1Formula: '((J’aime Totaux ÷ Abonnés Totaux) ÷ Vidéos Totales) × 100',
    tool1Best: 'Idéal pour bilans de chaîne, kits média et comptes privés.',
    tool1Cta: "Ouvrir le Calculateur d'Engagement \u2192",
    tool2Tag: 'Budget & Publicité',
    tool2Badge: '7 Devises',
    tool2Title: 'Calculateur CPM TikTok',
    tool2Desc: (
      <>
        Trois modes en <code>USD</code>, <code>EUR</code>, <code>GBP</code>, <code>CAD</code>, <code>AUD</code>,{' '}
        <code>INR</code> et <code>PKR</code> pour comparer les devis créateurs aux campagnes publicitaires TikTok.
      </>
    ),
    tool2Modes: ['Calculer le CPM', 'Calculer le Budget', 'Calculer les Impressions'],
    tool2Best: 'Idéal pour media buyers, agences et créateurs mesurant le ROI.',
    tool2Cta: 'Ouvrir le Calculateur CPM \u2192',
    refreshTag: "Vue d'Actualisation Séparée",
    refreshBadge: 'Rafraîchissement Cache',
    refreshTitle: 'Recherche de Profil avec Rafraîchissement Manuel',
    refreshDesc: (
      <>
        Besoin d’actualiser un profil sans attendre la fin du cache d’une heure ? Utilisez la vue dédiée avec contrôle{' '}
        <strong>Refresh Data</strong>.
      </>
    ),
    refreshCta: 'Ouvrir la Vue Cache-Refresh \u2192',
  },
  faq: {
    title: 'FAQ Calculateur TikTok & Valorisation Sponsoring',
    description:
      'Réponses claires sur la méthode de calcul, la confidentialité publique, le mode de secours et la négociation.',
    ariaTogglePrefix: 'Afficher ou masquer la réponse : ',
    disclaimer:
      'Ces réponses reflètent notre méthodologie actuelle et ne constituent pas un conseil financier, juridique ou fiscal.',
    viewAllLink: 'Voir Toute la FAQ Monétisation \u2192',
  },
  closing: {
    sectionAriaLabel: 'Lancer une estimation de profil TikTok ou explorer les outils associés',
    title: 'Prêt à Évaluer Votre Valeur Sponsoring TikTok ?',
    description:
      'Pour préparer un tarif créateur, vérifier une offre de marque ou comparer un CPM, saisissez un compte public ci-dessus ou ouvrez un outil spécialisé.',
    btnPrimary: 'Calculer par Pseudo TikTok \u2191',
    btnCpm: 'Ouvrir Calculateur CPM',
    btnEng: 'Ouvrir Calculateur Engagement',
    aboutLine: (
      <>
        KalkulatorTik est une plateforme indépendante d’analyse créateur. En savoir plus sur{' '}
        <Link to="/about" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          À propos de KalkulatorTik
        </Link>{' '}
        ou consulter la{' '}
        <Link to="/faq" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          FAQ Monétisation TikTok
        </Link>
        .
      </>
    ),
    legalNotice: (
      <>
        KalkulatorTik est un outil indépendant qui n’est ni affilié, ni approuvé, ni officiellement lié à TikTok Inc. ou ByteDance Ltd. ; toutes les marques appartiennent à leurs propriétaires respectifs. Les montants sont des estimations informatives—consultez notre{' '}
        <Link to="/privacy" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Politique de confidentialité
        </Link>{' '}
        et nos{' '}
        <Link to="/terms" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Conditions d’utilisation
        </Link>
        .
      </>
    ),
  },
};

export const FR_HOME_PACK = {
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
