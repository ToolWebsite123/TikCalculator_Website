import React from 'react';
import Link from '../../components/LocaleLink';

const seo = {
  title: 'Calcolatore di Denaro TikTok – Stima i Tuoi Guadagni',
  description:
    'Stima i tuoi guadagni su TikTok con il nostro calcolatore gratuito. Scopri le entrate potenziali da visualizzazioni, follower, engagement e sponsorizzazioni.',
  ogLocale: 'it_IT',
};

const metricsGuide = [
  {
    name: 'Follower',
    tag: 'Ampiezza Pubblico',
    description:
      'Numero totale di account TikTok che seguono il creator. Indica la dimensione del pubblico e applica un moltiplicatore di scala secondario.',
  },
  {
    name: 'Mi piace totali',
    tag: 'Mi piace ricevuti',
    description: 'Somma dei Mi piace su tutti i video pubblici presenti sul profilo.',
  },
  {
    name: 'Video totali',
    tag: 'Video caricati',
    description: 'Numero totale di video pubblici pubblicati sull’account.',
  },
  {
    name: 'Seguiti',
    tag: 'Account seguiti',
    description: 'Numero totale di profili seguiti dal creator.',
  },
  {
    name: 'Visualizzazioni Medie St.',
    tag: 'Visualizzazioni per video',
    description:
      'Media delle visualizzazioni dai video pubblici recenti, oppure stimata dai follower quando i dati video recenti non sono disponibili.',
  },
  {
    name: 'Engagement',
    tag: 'Tasso di interazione',
    description:
      'Mi piace, commenti e condivisioni divisi per le visualizzazioni totali del campione recente (o stimati dai totali in modalità di riserva).',
  },
];

const cpmTiers = [
  {
    tier: 'Mercati Tier 1',
    regions: 'US, CA, UK, GB, AU, NZ, DE',
    min: '$22.00',
    avg: '$30.00',
    max: '$42.00',
    featured: true,
  },
  {
    tier: 'Mercati Tier 2',
    regions: 'FR, ES, IT, PT, BR, MX, SG, NL, BE, SE, NO, DK, FI, IE, CH',
    min: '$16.00',
    avg: '$22.00',
    max: '$32.00',
    featured: false,
  },
  {
    tier: 'Tier 3 / Predefinito Globale',
    regions: 'Tutte le altre regioni o quando il profilo non indica il codice paese',
    min: '$12.00',
    avg: '$18.00',
    max: '$26.00',
    featured: false,
  },
];

const followerScaleTiers = [
  { range: 'Fino a 10.000 follower', factor: '1.00x' },
  { range: 'Da 10.001 a 100.000 follower', factor: '1.02x' },
  { range: 'Da 100.001 a 500.000 follower', factor: '1.08x' },
  { range: 'Da 500.001 a 2.000.000 follower', factor: '1.12x' },
  { range: 'Oltre 2.000.000 follower', factor: '1.18x' },
];

const channelRows = [
  {
    feature: 'Fonte di Pagamento',
    sponsorships: 'Brand esterni, inserzionisti o agenzie marketing',
    rewards: 'TikTok (ByteDance) direttamente nel saldo creator in-app',
  },
  {
    feature: 'Metrica di Tariffa / Compenso',
    sponsorships: 'Compenso negoziato con parametro CPM sponsorizzato (costo per 1.000 visualizzazioni)',
    rewards: 'RPM variabile della piattaforma (ricavo per 1.000 visualizzazioni idonee) definito da TikTok',
  },
  {
    feature: 'Regole Durata Video',
    sponsorships: 'Qualsiasi durata concordata nel brief con il brand',
    rewards: 'Deve rispettare la durata minima e le regole di originalità TikTok',
  },
  {
    feature: 'Soglia di Follower',
    sponsorships: 'Nessun minimo obbligatorio di piattaforma; conta l’affinità e la copertura',
    rewards: 'Richiede il raggiungimento dei requisiti ufficiali di follower e visualizzazioni su 30 giorni',
  },
  {
    feature: 'Modellato da KalkulatorTik?',
    sponsorships: 'Sì — Modellato dal nostro Calcolatore di Denaro TikTok principale',
    rewards: 'No — Richiede dati interni privati su visualizzazioni idonee e RPM',
    isStatusRow: true,
  },
];

const factors = [
  {
    num: '01',
    title: 'Demografia Verificata del Pubblico',
    body: 'I codici regione del profilo sono solo indicativi. I brand richiedono di norma screenshot da TikTok Studio con paesi, fasce d’età e genere.',
  },
  {
    num: '02',
    title: 'Categoria di Contenuto o Nicchia',
    body: 'Settori ad alta propensione all’acquisto — finanza personale, software, B2B, skincare, fitness e tech — ottengono compensi superiori all’intrattenimento generico.',
  },
  {
    num: '03',
    title: 'Deliverable e Livello di Produzione',
    body: 'Una citazione di 15 secondi in un vlog quotidiano richiede meno impegno rispetto a un tutorial di 60 secondi con sceneggiatura, luci da studio o riprese dedicate.',
  },
  {
    num: '04',
    title: 'Diritti di Utilizzo e Licenze',
    body: 'La tariffa base copre la pubblicazione organica sul profilo del creator. L’uso su siti web, newsletter o annunci a pagamento richiede una quota di licenza aggiuntiva.',
  },
  {
    num: '05',
    title: 'Spark Ads e Amplificazione a Pagamento',
    body: 'Condividere un codice Spark Ads (whitelisting) consente al brand di investire budget pubblicitario sul tuo profilo, in genere fatturato ogni 30, 60 o 90 giorni.',
  },
  {
    num: '06',
    title: 'Esclusività di Categoria',
    body: 'Impegnarsi a non promuovere concorrenti per un periodo concordato limita altri accordi commerciali e giustifica un sovrapprezzo dedicato.',
  },
  {
    num: '07',
    title: 'Pacchetti Multi-Video',
    body: 'Concordare da tre a cinque video sponsorizzati in un trimestre porta spesso a un moderato sconto unitario in cambio di un budget complessivo certo.',
  },
  {
    num: '08',
    title: 'Stagionalità e Leva Contrattuale',
    body: 'Picchi stagionali, tempi di consegna ristretti, domanda verso il creator e conversioni dimostrate influenzano sensibilmente i compensi finali.',
  },
];

const creatorRows = [
  {
    metric: 'Follower Totali',
    creatorA: '500.000 follower',
    creatorB: '50.000 follower',
    insight: 'Il Creator A ha 10× più follower rispetto al Creator B.',
  },
  {
    metric: 'Fattore Scala Follower',
    creatorA: '1.08x (fascia >100K)',
    creatorB: '1.02x (fascia >10K)',
    insight: 'Il Creator A ottiene un moltiplicatore di scala superiore.',
  },
  {
    metric: 'Visualizzazioni Medie per Video',
    creatorA: '8.000 visualizzazioni',
    creatorB: '65.000 visualizzazioni',
    insight: 'Il Creator B raggiunge oltre 8× più visualizzazioni per post.',
  },
  {
    metric: 'Tasso di Engagement',
    creatorA: '1,20% interazioni',
    creatorB: '9,40% interazioni',
    insight: 'Il pubblico del Creator B mette Mi piace, commenta e condivide attivamente.',
  },
  {
    metric: 'Fattore Engagement',
    creatorA: '0.924x',
    creatorB: '1.088x',
    insight: 'Un engagement elevato aumenta il moltiplicatore CPM del Creator B.',
  },
  {
    metric: 'Fascia Regionale Profilo',
    creatorA: 'Tier 3 / Globale ($18.00 CPM base medio)',
    creatorB: 'Tier 1 / US ($30.00 CPM base medio)',
    insight: 'Le ipotesi regionali differenziano ulteriormente il CPM base.',
  },
  {
    metric: 'CPM Aggiustato dal Modello',
    creatorA: '$17.96 (Fascia: $11.98 – $25.95)',
    creatorB: '$33.29 (Fascia: $24.41 – $46.61)',
    insight: 'Interazione attiva e mercato di fascia alta quasi raddoppiano il CPM.',
  },
  {
    metric: 'Valore Sponsorizzazione Stimato',
    creatorA: '$143.68 per video ($95.84 – $207.60)',
    creatorB: '$2,163.85 per video ($1,586.65 – $3,029.65)',
    insight: 'Visualizzazioni reali ed engagement determinano la stima superiore.',
    highlight: true,
  },
];

const faqItems = [
  {
    id: 'faq-1',
    question: '1. Che cosa stima un calcolatore di denaro TikTok?',
    schemaAnswer:
      'Un calcolatore di denaro TikTok come KalkulatorTik stima i potenziali ricavi commerciali da sponsorizzazione con brand per un singolo video sponsorizzato su un profilo pubblico, fornendo un riferimento principale in USD e una forbice stimata in base a visualizzazioni, engagement e CPM regionale.',
    answer: (
      <p>
        Un calcolatore di denaro TikTok come <strong>KalkulatorTik</strong> stima i{' '}
        <strong>potenziali ricavi commerciali da sponsorizzazione per un singolo video dedicato</strong> su un profilo
        TikTok pubblico. Anziché calcolare quote pubblicitarie interne, mostra una stima principale in dollari USD e
        un intervallo basato su copertura, engagement e CPM regionale.
      </p>
    ),
  },
  {
    id: 'faq-2',
    question: '2. Questa stima coincide con i pagamenti di TikTok Creator Rewards?',
    schemaAnswer:
      'No. Le sponsorizzazioni con i brand e il Programma TikTok Creator Rewards sono fonti distinte. Creator Rewards paga direttamente TikTok sui video originali oltre 1 minuto con visualizzazioni idonee (minimo 10.000 follower, 100.000 visualizzazioni in 30 giorni, 18+ anni o 19+ in Corea del Sud, account regolare e paese idoneo). La nostra home stima compensi privati con aziende.',
    answer: (
      <p>
        <strong>No.</strong> Le sponsorizzazioni con brand e il Programma TikTok Creator Rewards sono entrate diverse.
        Creator Rewards remunera direttamente da TikTok sui video originali da <code>1+ minuto</code> (richiede almeno{' '}
        <code>10.000</code> follower, <code>100.000</code> visualizzazioni negli ultimi 30 giorni, <code>18+</code> anni o{' '}
        <code>19+</code> in Corea del Sud, stato regolare e paese idoneo). Questo strumento stima{' '}
        <strong>accordi privati con i brand</strong> senza limiti minimi di follower.
      </p>
    ),
  },
  {
    id: 'faq-3',
    question: '3. Come viene calcolata una stima di sponsorizzazione su KalkulatorTik?',
    schemaAnswer:
      'Dividiamo le visualizzazioni medie per video per 1.000 e moltiplichiamo per un CPM corretto. Partendo dalle fasce regionali interne ($12–$42 tra Tier 1 e Tier 3, medie $18–$30), il modello applica un moltiplicatore di engagement (0.90x–1.20x) e di scala follower (1.00x–1.18x), limitando il CPM tra $7.00 e $80.00.',
    answer: (
      <p>
        Il calcolatore divide le <strong>Visualizzazioni Medie per Video</strong> per <code>1.000</code> e moltiplica
        per un <strong>CPM Corretto</strong>. Dalle fasce regionali interne (<code>$12&ndash;$42</code> con medie{' '}
        <code>$18&ndash;$30</code>), applica un moltiplicatore di engagement (<code>0.90x</code> a <code>1.20x</code>) e
        uno per i follower (<code>1.00x</code> a <code>1.18x</code>), contenendo il risultato tra <code>$7.00</code> e{' '}
        <code>$80.00</code>.
      </p>
    ),
  },
  {
    id: 'faq-4',
    question: '4. Contano di più i follower o le visualizzazioni per le tariffe?',
    schemaAnswer:
      'Le visualizzazioni medie per video pesano generalmente di più perché mostrano quante persone guarderanno probabilmente il video sponsorizzato. Un profilo più piccolo ma con visualizzazioni regolari supera spesso un account grande poco attivo.',
    answer: (
      <p>
        <strong>Le visualizzazioni medie per video contano di più</strong> nella definizione di una singola
        collaborazione, perché indicano la reale esposizione prevista. I follower aggiungono credibilità e un piccolo
        coefficiente di scala, ma le visualizzazioni costanti restano determinanti.
      </p>
    ),
  },
  {
    id: 'faq-5',
    question: '5. Posso stimare i guadagni da sponsorizzazione usando solo il nome utente?',
    schemaAnswer:
      'Sì. Inserendo il nome utente (con o senza @) di qualsiasi profilo pubblico TikTok, KalkulatorTik raccoglie i dati pubblici visibili e calcola il valore stimato per video.',
    answer: (
      <p>
        <strong>Sì.</strong> Inserendo l’handle (con o senza <code>@</code>) di qualsiasi account{' '}
        <strong>Pubblico</strong>, KalkulatorTik recupera automaticamente le statistiche visibili necessarie per la
        stima per video.
      </p>
    ),
  },
  {
    id: 'faq-6',
    question: '6. Il calcolatore richiede la password o l’accesso a TikTok?',
    schemaAnswer:
      'Mai. KalkulatorTik non richiede password, e-mail, codici 2FA o accesso privato a TikTok Studio. Tutto funziona su dati pubblici. Leggi la nostra Informativa sulla Privacy.',
    answer: (
      <p>
        <strong>Mai.</strong> KalkulatorTik non chiede password, indirizzi e-mail, codici a due fattori né accessi a
        TikTok Studio. Opera solo su dati pubblici. Leggi la nostra{' '}
        <Link to="/privacy" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Informativa sulla Privacy
        </Link>{' '}
        per i dettagli.
      </p>
    ),
  },
  {
    id: 'faq-7',
    question: '7. KalkulatorTik è gratuito?',
    schemaAnswer:
      'Sì. KalkulatorTik è gratuito online, senza abbonamenti né carte di credito. Limiti standard proteggono il server dal traffico automatizzato. Vedi altre risposte nella pagina FAQ completa.',
    answer: (
      <p>
        <strong>Sì.</strong> KalkulatorTik è gratuito online senza abbonamenti né registrazione obbligatoria. Limiti
        tecnici standard garantiscono stabilità per tutti. Visita la nostra{' '}
        <Link to="/faq" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          pagina FAQ completa
        </Link>
        .
      </p>
    ),
  },
  {
    id: 'faq-8',
    question: '8. È possibile analizzare profili TikTok privati?',
    schemaAnswer:
      'No. Solo i dati pubblicamente visibili possono essere consultati. Se conosci i numeri di un profilo privato manualmente, utilizza il nostro Calcolatore di Engagement TikTok o Calcolatore CPM TikTok.',
    answer: (
      <p>
        <strong>No.</strong> Accediamo esclusivamente a metriche pubbliche. Se disponi manualmente dei numeri di un
        account privato, usa il nostro{' '}
        <Link
          to="/tiktok-engagement-calculator"
          className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800"
        >
          Calcolatore di Engagement TikTok
        </Link>{' '}
        o{' '}
        <Link
          to="/tiktok-cpm-calculator"
          className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800"
        >
          Calcolatore CPM TikTok
        </Link>
        .
      </p>
    ),
  },
  {
    id: 'faq-9',
    question: '9. Perché i dati di un profilo possono risultare non disponibili?',
    schemaAnswer:
      'Una ricerca può fallire per errore di battitura, cambio recente di handle, account privato o sospeso, oppure limiti temporanei di TikTok durante picchi di traffico.',
    answer: (
      <p>
        Può accadere per un nome errato, cambio recente di handle, profilo privato o sospeso o limiti temporanei di
        TikTok in momenti di traffico intenso. Ricontrolla lo username e riprova dopo qualche secondo.
      </p>
    ),
  },
  {
    id: 'faq-10',
    question: '10. Cosa succede se le visualizzazioni dei video recenti non sono disponibili?',
    schemaAnswer:
      'Se caricano i totali principali ma mancano i video recenti, KalkulatorTik attiva il modello di riserva: 8% dei follower da 12.500+ (10% tra 10.000 e 12.499, minimo 1.000 visualizzazioni sotto) e engagement dai Mi piace totali o valori per fascia.',
    answer: (
      <p>
        Se i dati generali caricano senza elenco video recente, KalkulatorTik applica il{' '}
        <strong>modello di stima di riserva</strong>: stima le visualizzazioni all’<code>8%</code> dei follower da{' '}
        <code>12.500+</code> (<code>10%</code> tra <code>10.000</code> e <code>12.499</code>, minimo <code>1.000</code>{' '}
        sotto) e ricava l’engagement dai Mi piace totali o dalle medie di fascia.
      </p>
    ),
  },
  {
    id: 'faq-11',
    question: '11. L’importo stimato per la sponsorizzazione è garantito?',
    schemaAnswer:
      'No. I valori di KalkulatorTik sono riferimenti informativi non vincolanti. I compensi effettivi dipendono dai brand partner, dalla nicchia, dal pubblico e dalla trattativa.',
    answer: (
      <p>
        <strong>No.</strong> Tutte le cifre sono parametri informativi indicativi, non guadagni garantiti né offerte
        ufficiali. Il compenso reale dipende dagli accordi con il brand, dal settore e dalla negoziazione.
      </p>
    ),
  },
  {
    id: 'faq-12',
    question: '12. Come possono i creator usare questa stima nelle trattative con i brand?',
    schemaAnswer:
      'Usa la media come base per un post organico sponsorizzato, punta alla fascia alta quando il brand richiede Spark Ads, diritti di licenza o esclusività, e proponi sconti moderati su pacchetti multi-video.',
    answer: (
      <div className="space-y-2">
        <p>
          Usa media e fascia stimata come <strong>punto di partenza per un video sponsorizzato organico</strong>:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            Confronta le offerte ricevute rispetto alla <strong>stima media</strong> per evitare di sottovalutarti.
          </li>
          <li>
            Salire verso il <strong>limite superiore</strong> (o oltre) in caso di Spark Ads, diritti d’uso a 30–90
            giorni, esclusività o produzioni complesse.
          </li>
          <li>
            Valuta uno sconto moderato verso il <strong>limite inferiore</strong> su pacchetti da 3 o 5 video.
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
  inLanguage: 'it',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.schemaAnswer },
  })),
};

const copy = {
  intro: {
    title: "Cos'è un Calcolatore di Denaro TikTok?",
    description:
      'Un Calcolatore di Denaro TikTok è uno strumento di valutazione per creator che stima quanto può richiedere un profilo pubblico per un video sponsorizzato—e aiuta i brand a confrontare tariffe eque.',
    p1: (
      <>
        Invece di stimare a occhio i guadagni da collaborazioni commerciali, questo{' '}
        <strong className="font-semibold text-slate-900">calcolatore di denaro TikTok</strong> analizza i segnali
        pubblici visibili&mdash;tra cui <strong className="font-semibold text-slate-900">visualizzazioni medie</strong>,{' '}
        <strong className="font-semibold text-slate-900">tasso di engagement</strong>,{' '}
        <strong className="font-semibold text-slate-900">regione del profilo</strong> e{' '}
        <strong className="font-semibold text-slate-900">dimensione follower</strong>&mdash;per calcolare un compenso
        indicativo in USD e la relativa fascia di trattativa.
      </>
    ),
    p2: 'Che tu sia un creator che prepara il proprio listino prezzi o un brand che valuta più profili prima di una campagna, KalkulatorTik offre una stima trasparente da qualsiasi nome utente pubblico senza login.',
  },
  howToUse: {
    title: 'Come Usare il Calcolatore di Denaro TikTok',
    description:
      'Calcola la stima delle sponsorizzazioni TikTok tramite nome utente in tre passaggi veloci, senza registrazione.',
    actionLabel: 'Vai al Calcolatore Sopra \u2191',
    steps: [
      {
        badge: 'PASSO 01',
        title: 'Inserisci Username e Calcola',
        body: (
          <>
            Inserisci qualsiasi profilo TikTok pubblico sopra (es. <code>khaby.lame</code> o <code>@mrbeast</code>)
            &mdash;il simbolo <code>@</code> iniziale viene rimosso automaticamente&mdash;e clicca su{' '}
            <strong>Calcola Valore Sponsorizzazione</strong>.
          </>
        ),
      },
      {
        badge: 'PASSO 02',
        title: 'Verifica Profilo e Fonte Dati',
        body: (
          <>
            Controlla nel banner superiore se i dati provengono da <strong>video recenti dal vivo</strong> o{' '}
            <strong>modalità di riserva</strong>, poi esamina valore stimato, CPM e le 6 statistiche.
          </>
        ),
      },
      {
        badge: 'PASSO 03',
        title: 'Applica ai Termini dell’Accordo',
        body: (
          <>
            <strong>Creator:</strong> Usa la stima media come base organica prima di aggiungere Spark Ads o diritti d’uso.{' '}
            <strong>Brand:</strong> Verifica che i preventivi siano in linea con copertura e interazioni.
          </>
        ),
      },
    ],
    troubleshootingTitle: 'Risoluzione Problemi & Aggiornamento Cache Manuale',
    troubleshootingP1: (
      <>
        <strong className="text-slate-900">Ricerche Pubbliche e Limiti Temporanei:</strong> Solo gli account pubblici
        possono essere analizzati. Se TikTok rallenta le richieste, attendi qualche secondo e riprova.
      </>
    ),
    troubleshootingP2: (
      <>
        <strong className="text-slate-900">Cache di 1 Ora e Dati Freschi:</strong> I risultati restano in cache fino a 1
        ora. Se le statistiche sono appena cresciute, usa <strong>Refresh Data</strong> nella{' '}
        <Link to="/calculator" className="font-semibold text-teal-700 underline underline-offset-2">
          Vista Dedicata di Aggiornamento
        </Link>
        .
      </>
    ),
    footerNote: 'Qui sotto trovi la spiegazione dettagliata di ogni scheda di valutazione e delle 6 metriche.',
  },
  results: {
    title: 'Prestazioni del Profilo e Valore Sponsorizzazione Stimato',
    description:
      'Ogni ricerca trasforma i segnali pubblici del profilo in una scomposizione trasparente della tariffa per singolo video sponsorizzato.',
    primaryEyebrow: 'Risultato Principale di Valutazione',
    usdBadge: 'Parametro USD',
    primaryTitle: 'Valore Stimato Sponsorizzazione per Video',
    primaryLead: (
      <>
        La cifra principale rappresenta la{' '}
        <strong className="font-semibold text-slate-900">tariffa base stimata per un video sponsorizzato</strong>,
        affiancata da due metriche di riferimento:
      </>
    ),
    rangeTitle: 'Intervallo Stimato Sponsorizzazione',
    rangeBody:
      'Menzioni rapide o pacchetti multi-video si collocano spesso nella parte bassa; nicchie competitive o extra richiesti salgono verso l’alto.',
    cpmTitle: 'CPM di Riferimento del Modello',
    cpmBody:
      'Costo lordo stimato per 1.000 visualizzazioni dopo la regolazione su fascia regionale, engagement e scala follower.',
    cacheNote: 'I valori riflettono i dati pubblici al momento della ricerca (o in cache fino a 1 ora).',
    profileOverviewTitle: 'Panoramica Profilo Pubblico',
    profileOverviewBadge: "Segnali d'Identità",
    profileOverviewBody: (
      <>
        Mostra i dettagli pubblici disponibili&mdash;nome visualizzato, <code>@handle</code>, badge verificato, bio
        pubblica, codice regione (se presente), ID TikTok e data di creazione account.
      </>
    ),
    metricsTitle: 'Panoramica Account & Metriche di Attività',
    metricsBadge: '6 Indicatori Pubblici',
    howToReadTitle: 'Come Leggere i Risultati del Calcolatore',
    howToReadBody: (
      <>
        Considera questa cifra come base pratica per negoziare, mai come tariffa fissa o guadagno garantito.{' '}
        <strong className="text-slate-900">I creator</strong> possono aggiungere diritti di utilizzo o esclusività;{' '}
        <strong className="text-slate-900">i brand</strong> possono confrontare i preventivi ricevuti con la reale
        portata del canale.
      </>
    ),
    limitationsBadge: 'Limiti della Stima',
    limitationsBody:
      'Questo output si basa unicamente su indicatori pubblici e non legge statistiche private di TikTok Studio, fasce d’età o tempi di completamento. Quando mancano i video recenti interviene il modello di riserva.',
  },
  calculation: {
    title: 'Come il Calcolatore Stima il Valore Sponsorizzazione',
    description:
      'Anziché un punteggio opaco, KalkulatorTik applica un modello trasparente passo dopo passo per stimare il valore medio per video sponsorizzato.',
    eqBadge: 'Equazione Centrale di Valutazione',
    eqTitle: 'La Formula Base della Sponsorizzazione',
    eqBody:
      'Basata sul Costo per Mille (CPM) ogni 1.000 visualizzazioni. Calcolando CPM minimo, medio e massimo si ottengono sia il valore centrale che l’intervallo.',
    eqPart1: 'Visualizzazioni Medie \u00F7 1.000',
    eqPart2: 'CPM Corretto',
    eqPart3: 'Tariffa Video Stimata',
    step1Title: 'Passo 1: Calcolo Visualizzazioni Medie e Tasso di Engagement',
    step1Desc: 'Quando cerchi un profilo pubblico, il calcolatore esamina fino a 30 video recenti con dati di riproduzione:',
    avgViewsTitle: 'Visualizzazioni Medie per Video',
    avgViewsDesc: 'Calcola la media aritmetica semplice dei video pubblici recenti (> 0 visualizzazioni):',
    avgViewsFormula: 'Media Visualizzazioni = Somma Visualizzazioni Recenti \u00F7 Video Analizzati',
    engTitle: 'Tasso di Engagement',
    engDesc: 'Misura le interazioni pubbliche totali rispetto alle visualizzazioni del campione:',
    engFormula: 'Engagement (%) = ((Mi piace + Commenti + Condivisioni) \u00F7 Visualizzazioni) \u00D7 100',
    step2Title: 'Passo 2: Selezione della Fascia CPM Base (Ipotesi Modello)',
    step2Desc:
      'In base al codice regione rilevato sul profilo, KalkulatorTik assegna un intervallo base USD (Tier 3 se mancante):',
    tableCaption: 'Ipotesi interne CPM base KalkulatorTik (USD per 1.000 visualizzazioni).',
    thTier: 'Fascia Mercato',
    thCountries: 'Codici Regione Profilo',
    thMin: 'Base Min',
    thAvg: 'Base Media',
    thMax: 'Base Max',
    step2Note: (
      <>
        <strong>Nota Metodologica:</strong> Queste fasce CPM sono ipotesi interne comparative e non tariffe ufficiali
        TikTok né garanzie di mercato.
      </>
    ),
    step3Title: 'Passo 3: Moltiplicatori di Engagement e Scala Follower',
    step3Desc: (
      <>
        Due fattori regolano il CPM iniziale prima del limite compreso tra <strong>$7.00</strong> e{' '}
        <strong>$80.00</strong> per 1.000 visualizzazioni:
      </>
    ),
    engAdjTitle: (
      <>
        Regolazione Engagement (<code>0.90x&ndash;1.20x</code>)
      </>
    ),
    engAdjBody: (
      <>
        Varia linearmente da <code>0%</code> (<code>0.90x</code>) passando per il punto neutro <code>5.0%</code> (
        <code>1.00x</code>) fino a <code>1.20x</code> per engagement <code>15%+</code>.
      </>
    ),
    engAdjBox1: '0% = 0.90x · 5.0% = 1.00x (Neutro)',
    engAdjBox2: '7.5% = 1.05x · 15%+ = 1.20x (Limite)',
    scaleTitle: (
      <>
        Scala Follower (<code>1.00x&ndash;1.18x</code>)
      </>
    ),
    scaleSub: 'Scala solo migliorativa (i piccoli creator non vengono mai penalizzati):',
    boundsTitle: (
      <>
        Minimo e Massimo CPM (<code>$7.00&ndash;$80.00</code>)
      </>
    ),
    boundsBody: (
      <>
        I valori CPM min, medio e max vengono moltiplicati per entrambi i fattori e compresi tra <code>$7.00</code> e{' '}
        <code>$80.00</code>.
      </>
    ),
    boundsBox: 'CPM Corretto = Base × Eng × Scala (Limiti $7–$80)',
    fallbackTitle: 'Stime di Riserva Quando Mancano Visualizzazioni Recenti',
    fallbackViews: (
      <>
        <strong className="text-slate-900">Visualizzazioni Medie di Riserva:</strong> Stimate all’<code>8%</code> dei
        follower da <code>12.500+</code>, <code>10%</code> tra <code>10.000</code> e <code>12.499</code>, con base minima
        di <code>1.000</code> visualizzazioni sotto i <code>10.000</code>.
      </>
    ),
    fallbackEng: (
      <>
        <strong className="text-slate-900">Engagement di Riserva:</strong> Ricavato da Mi piace totali, video e
        follower (<code>1.0%–50.0%</code>) oppure valori predefiniti per fascia.
      </>
    ),
    exampleBadge: 'Esempio Ipotetico',
    exampleTitle: 'Esempio Pratico: Calcolo del Valore per un Creator',
    exampleTag: 'Profilo Esempio',
    exRegionLabel: 'Regione Profilo',
    exRegionVal: 'US (Tier 1)',
    exFollowersLabel: 'Follower',
    exFollowersSub: 'Scala = 1.08x',
    exViewsLabel: 'Media Visualizzazioni',
    exViewsVal: '50.000 / video',
    exViewsSub: '50,0 unità',
    exEngLabel: 'Engagement',
    exEngSub: 'Fattore = 1.08x',
    exStep1: '1. Engagement Normalizzato:',
    exStep2: '2. Fattore Engagement:',
    exStep3: '3. Moltiplicatore Combinato:',
    exStep4Label: '4. Fascia CPM Corretto:',
    exStep4Min: 'Min',
    exStep4Avg: 'Media',
    exStep4Max: 'Max',
    exStep4Tag: '$34.99 media',
    exStep5Title: '5. Risultato Finale (50 × $34.99)',
    exPerVideo: 'per video sponsorizzato',
    exRange: 'Fascia: $1,283.00 – $2,449.50',
    exFooterNote: 'Solo esempio illustrativo; non valuta dati demografici privati né conversioni.',
    transitionNote:
      'Poiché questo parametro modella quanto pagano gli inserzionisti esterni per video, ha uno scopo diverso rispetto ai compensi diretti TikTok.',
  },
  channels: {
    title: 'Sponsorizzazioni Brand vs. TikTok Creator Rewards: Qual è la Differenza?',
    description:
      'Gli accordi commerciali con le aziende e il programma ufficiale Creator Rewards pagano da fonti completamente diverse secondo regole proprie.',
    leftBadge: 'Stimato da questo Calcolatore',
    leftTitle: 'Come Funzionano le Sponsorizzazioni con Brand',
    leftLead: (
      <>
        Un accordo privato in cui un’azienda o agenzia paga un creator per integrare un prodotto in un{' '}
        <strong>video sponsorizzato</strong>.
      </>
    ),
    leftItems: [
      ['Chi Paga', 'Brand esterni, aziende o agenzie direttamente tramite fattura o bonifico.'],
      ['Tariffazione', 'Negoziata per video o pacchetto in base a copertura attesa, nicchia, produzione e diritti.'],
      ['Idoneità', 'Aperta a creator di qualsiasi dimensione—inclusi nano-creator sotto 10.000 follower.'],
    ],
    rightBadge: 'Programma Ufficiale In-App',
    rightTitle: 'Come Funziona TikTok Creator Rewards',
    rightLead:
      'Pagamenti diretti erogati da TikTok (successore del Creator Fund) nel saldo creator all’interno dell’app.',
    rightItems: [
      ['Chi Paga', 'TikTok distribuisce i fondi direttamente agli iscritti secondo i termini ufficiali.'],
      [
        'Requisiti',
        <>
          Richiede <code>10.000+</code> follower, <code>100.000+</code> visualizzazioni in 30 giorni, <code>18+</code>{' '}
          anni (<code>19+</code> in Corea del Sud), buon profilo e paese idoneo.
        </>,
      ],
      [
        'Regole Compenso',
        <>
          Valido solo su video originali di <code>1+ minuto</code> valutati con <strong>visualizzazioni idonee</strong> e
          RPM dinamico.
        </>,
      ],
      ['Altre Funzioni', 'Regali LIVE e affiliazione TikTok Shop seguono regolamenti separati.'],
    ],
    compareTitle: 'Confronto Diretto: Collaborazioni Brand vs. Monetizzazione Piattaforma',
    tableCaption: 'Differenze principali tra sponsorizzazioni private e programmi TikTok.',
    thFeature: 'Caratteristica',
    thSponsor: 'Sponsorizzazioni Brand',
    thRewards: 'TikTok Creator Rewards',
    whyTitle: 'Perché la Stima Sponsoring Non è un Pagamento Diretto TikTok',
    whyBody:
      'I dati privati di Creator Rewards restano chiusi in TikTok Studio e non sono accessibili esternamente; inoltre i brand pagano produzione creativa dedicata e visibilità commerciale.',
    whyFootnote: 'Regole, paesi ammessi e condizioni Creator Rewards spettano esclusivamente a TikTok.',
  },
  factors: {
    title: 'Cosa Influenza le Tariffe di Sponsorizzazione su TikTok?',
    description:
      'Due profili con visualizzazioni simili possono ottenere compensi diversi in base al settore e ai diritti richiesti.',
    measuredTitle: 'Misurato Automaticamente nella Formula',
    measuredBadge: '4 Segnali Pubblici',
    measuredBody: (
      <>
        Il modello calcola già <strong>Visualizzazioni Medie</strong>, <strong>Tasso di Engagement</strong>,{' '}
        <strong>Regione</strong> e <strong>Scala Follower</strong> prima degli accordi extra.
      </>
    ),
    unmeasuredTitle: 'Fattori Reali di Trattativa Non Misurati dal Calcolatore',
    unmeasuredBadge: 'Negoziati Privatamente',
    adjustTitle: 'Come Adeguare il Preventivo ai Termini della Campagna',
    adjustBody: (
      <>
        Considera l’output come <strong>base per un singolo video organico</strong>, aggiungendo voci separate per Spark
        Ads, licenze d’uso, esclusività o produzioni complesse.
      </>
    ),
  },
  followersVsViews: {
    title: 'Follower vs. Visualizzazioni: Cosa Conta di Più nelle Sponsorizzazioni?',
    description:
      'Il feed Per Te di TikTok distribuisce i contenuti per interesse e completamento. Un grande account poco attivo e uno medio molto seguito generano coperture opposte.',
    creatorATag: 'Creator Ipotetico A · Grande Profilo Inattivo',
    creatorAPrice: '$143.68 / video',
    creatorABody: (
      <>
        Ha raccolto <strong>500.000 follower</strong> in passato, ma oggi ottiene una media di{' '}
        <strong>8.000 visualizzazioni</strong> con <code>1.20%</code> di engagement (Tier 3).
      </>
    ),
    creatorBTag: 'Creator Ipotetico B · Alta Copertura Attiva',
    creatorBPrice: '$2,163.85 / video',
    creatorBBody: (
      <>
        Canale di nicchia da <strong>50.000 follower</strong> che genera <strong>65.000 visualizzazioni medie</strong>{' '}
        e <code>9.40%</code> di engagement (Tier 1).
      </>
    ),
    labelFollowers: 'Follower',
    labelViews: 'Visualizzazioni Medie per Video',
    compareTitle: 'Confronto Modello: Tanti Follower vs. Visualizzazioni Costanti',
    compareCaption: 'Confronto ipotetico calcolato con la formula KalkulatorTik.',
    thMetric: 'Metrica / Passaggio',
    thCreatorA: 'Creator A (500K Follower)',
    thCreatorB: 'Creator B (50K Follower)',
    thWhy: 'Perché Conta',
    tier3Note:
      'Nota: Anche nello stesso mercato Tier 3 ($18.00 CPM base medio), le 65.000 visualizzazioni e il 9,40% del Creator B generano $1,298.70 a video—9× rispetto al Creator A.',
    stillMattersTitle: 'Quando il Numero di Follower Conta Ancora',
    stillMattersList: [
      <>
        <strong>Percezione e Social Proof:</strong> Alcuni inserzionisti applicano filtri minimi sui follower.
      </>,
      <>
        <strong>Pubblico Fedele:</strong> Gli spettatori abituali della scheda Seguiti si fidano maggiormente dei
        consigli.
      </>,
      <>
        <strong>Accesso a Funzioni:</strong> Alcune soglie sbloccano dirette LIVE e strumenti creator.
      </>,
    ],
    rateCardTitle: 'Creare un Listino Prezzi (Rate Card) Equilibrato',
    rateCardBody: (
      <>
        Metti in evidenza <strong>visualizzazioni medie recenti</strong>, <strong>engagement</strong> ed esempi di alta
        ritenzione nel tuo media kit. I follower raccontano il passato; le visualizzazioni indicano la portata attuale.
      </>
    ),
    rateCardPrompt: 'Vuoi testare il tuo profilo?',
    rateCardBtn: 'Verifica il Tuo Profilo \u2191',
  },
  relatedTools: {
    title: 'Esplora Altri Calcolatori TikTok Gratuiti',
    description:
      'Affianca la stima delle sponsorizzazioni al calcolo del CPM pubblicitario e alla verifica manuale dell’engagement.',
    tool1Tag: 'Verifica Interazione',
    tool1Badge: 'Inserimento Manuale',
    tool1Title: 'Calcolatore di Engagement TikTok',
    tool1Desc: (
      <>
        Calcola la percentuale media di Mi piace da <strong>Mi piace totali</strong>, <strong>Video totali</strong> e{' '}
        <strong>Follower</strong> (accetta anche sigle come <code>277.8K</code> o <code>4.2M</code>) confrontandola
        con fasce da <code>1K&ndash;5K</code> a <code>1M+</code>.
      </>
    ),
    tool1Formula: '((Mi piace Totali ÷ Follower Totali) ÷ Video Totali) × 100',
    tool1Best: 'Ottimo per analisi del profilo, aggiornamenti media kit e account privati.',
    tool1Cta: 'Apri Calcolatore Engagement \u2192',
    tool2Tag: 'Analisi Budget & Annunci',
    tool2Badge: '7 Valute',
    tool2Title: 'Calcolatore CPM TikTok',
    tool2Desc: (
      <>
        Strumento a tre modalità in <code>USD</code>, <code>EUR</code>, <code>GBP</code>, <code>CAD</code>,{' '}
        <code>AUD</code>, <code>INR</code> e <code>PKR</code> per confrontare i compensi creator con i costi
        pubblicitari.
      </>
    ),
    tool2Modes: ['Calcola CPM', 'Calcola Budget', 'Calcola Impression'],
    tool2Best: 'Ideale per media buyer, agenzie e creator per valutare il ROI.',
    tool2Cta: 'Apri Calcolatore CPM \u2192',
    refreshTag: 'Vista Aggiornamento Dedicata',
    refreshBadge: 'Include Refresh Cache',
    refreshTitle: 'Ricerca Profilo con Aggiornamento Manuale Cache',
    refreshDesc: (
      <>
        Vuoi aggiornare i dati bypassando la cache server di 1 ora? Usa la pagina dedicata con pulsante manuale{' '}
        <strong>Refresh Data</strong>.
      </>
    ),
    refreshCta: 'Apri Vista Cache-Refresh \u2192',
  },
  faq: {
    title: 'FAQ Calcolatore TikTok e Valutazione Sponsorizzazioni',
    description:
      'Risposte dirette su metodologia, privacy dei dati pubblici, modalità di riserva e trattativa tariffe.',
    ariaTogglePrefix: 'Mostra o nascondi risposta: ',
    disclaimer:
      'Le risposte riflettono la metodologia attuale e le pratiche del settore; non costituiscono consulenza finanziaria, legale o fiscale.',
    viewAllLink: 'Vedi Tutte le FAQ Monetizzazione \u2192',
  },
  closing: {
    sectionAriaLabel: 'Avvia il calcolo del profilo TikTok o esplora gli strumenti correlati',
    title: 'Pronto a Stimare il Tuo Valore su TikTok?',
    description:
      'Per preparare un preventivo, valutare una proposta aziendale o confrontare CPM pubblicitari, inserisci un nome utente pubblico sopra o apri uno strumento dedicato.',
    btnPrimary: 'Calcola per Username TikTok \u2191',
    btnCpm: 'Apri Calcolatore CPM',
    btnEng: 'Apri Calcolatore Engagement',
    aboutLine: (
      <>
        KalkulatorTik è una piattaforma indipendente di analisi creator. Scopri di più su{' '}
        <Link to="/about" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Chi siamo – KalkulatorTik
        </Link>{' '}
        oppure consulta le{' '}
        <Link to="/faq" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          FAQ sulla Monetizzazione TikTok
        </Link>
        .
      </>
    ),
    legalNotice: (
      <>
        KalkulatorTik è uno strumento indipendente non affiliato, approvato o ufficialmente collegato a TikTok Inc. o ByteDance Ltd.; tutti i marchi appartengono ai rispettivi proprietari. I valori sono stime informative—consulta la{' '}
        <Link to="/privacy" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Privacy Policy
        </Link>{' '}
        e i{' '}
        <Link to="/terms" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Termini e Condizioni
        </Link>
        .
      </>
    ),
  },
};

export const IT_HOME_PACK = {
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
