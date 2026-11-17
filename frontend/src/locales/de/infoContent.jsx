import React from 'react';
import Link from '../../components/LocaleLink';

const seo = {
  title: 'TikTok Geldrechner – Schätzen Sie Ihre TikTok-Einnahmen',
  description:
    'Schätzen Sie Ihre TikTok-Einnahmen mit unserem kostenlosen TikTok Geldrechner. Berechnen Sie potenzielle Einnahmen aus Aufrufen, Followern und Sponsorings.',
  ogLocale: 'de_DE',
};

const metricsGuide = [
  {
    name: 'Follower',
    tag: 'Publikumsreichweite',
    description:
      'Gesamtzahl der TikTok-Konten, die dem Creator folgen. Zeigt die Publikumsgröße und soziale Relevanz und fließt als sekundärer Skalierungsfaktor ein.',
  },
  {
    name: 'Likes gesamt',
    tag: 'Gesamte Likes',
    description: 'Kumulierte Likes über alle derzeit öffentlichen Videos auf dem Profil.',
  },
  {
    name: 'Videos gesamt',
    tag: 'Hochgeladene Videos',
    description: 'Gesamtzahl der auf dem Konto veröffentlichten öffentlichen Videos.',
  },
  {
    name: 'Folgt',
    tag: 'Gefolgte Konten',
    description: 'Gesamtzahl der Profile, denen der Creator folgt.',
  },
  {
    name: 'Gesch. Ø-Aufrufe',
    tag: 'Aufrufe pro Video',
    description:
      'Durchschnittliche Videoaufrufe aus aktuellen öffentlichen Uploads oder anhand der Follower-Zahl geschätzt, falls keine aktuellen Videodaten vorliegen.',
  },
  {
    name: 'Engagement',
    tag: 'Interaktionsrate',
    description:
      'Summe aus Likes, Kommentaren und geteilten Inhalten geteilt durch die Gesamtaufrufe der analysierten Videos (bzw. aus Likes, Videos und Followern im Fallback-Modus geschätzt).',
  },
];

const cpmTiers = [
  {
    tier: 'Tier-1-Märkte',
    regions: 'US, CA, UK, GB, AU, NZ, DE',
    min: '$22.00',
    avg: '$30.00',
    max: '$42.00',
    featured: true,
  },
  {
    tier: 'Tier-2-Märkte',
    regions: 'FR, ES, IT, PT, BR, MX, SG, NL, BE, SE, NO, DK, FI, IE, CH',
    min: '$16.00',
    avg: '$22.00',
    max: '$32.00',
    featured: false,
  },
  {
    tier: 'Tier 3 / Globaler Standard',
    regions: 'Alle übrigen Regionen oder wenn kein Regionscode im Profil vorliegt',
    min: '$12.00',
    avg: '$18.00',
    max: '$26.00',
    featured: false,
  },
];

const followerScaleTiers = [
  { range: 'Bis 10.000 Follower', factor: '1.00x' },
  { range: '10.001 bis 100.000 Follower', factor: '1.02x' },
  { range: '100.001 bis 500.000 Follower', factor: '1.08x' },
  { range: '500.001 bis 2.000.000 Follower', factor: '1.12x' },
  { range: 'Über 2.000.000 Follower', factor: '1.18x' },
];

const channelRows = [
  {
    feature: 'Zahlungsquelle',
    sponsorships: 'Externe Marken, Werbetreibende oder Marketingagenturen',
    rewards: 'TikTok (ByteDance) direkt über das In-App-Creator-Guthaben',
  },
  {
    feature: 'Preis-/Auszahlungsmetrik',
    sponsorships: 'Verhandeltes Honorar auf Basis des Sponsoring-CPM (Kosten pro 1.000 Aufrufe)',
    rewards: 'Variables Plattform-RPM (Einnahmen pro 1.000 qualifizierte Aufrufe) von TikTok',
  },
  {
    feature: 'Videolängen-Regeln',
    sponsorships: 'Jede im Briefing der Marke vereinbarte Videolänge',
    rewards: 'Muss TikToks Mindestvideolänge und Originalitätsregeln erfüllen',
  },
  {
    feature: 'Follower-Schwelle',
    sponsorships: 'Kein plattformseitiges Minimum; abhängig von Marken-Fit und Reichweite',
    rewards: 'Erfordert das Erreichen der offiziellen Follower- und 30-Tage-Aufruf-Kriterien',
  },
  {
    feature: 'Von KalkulatorTik modelliert?',
    sponsorships: 'Ja — Modelliert durch unseren TikTok Geldrechner auf der Startseite',
    rewards: 'Nein — Erfordert interne In-App-Daten zu qualifizierten Aufrufen und RPM',
    isStatusRow: true,
  },
];

const factors = [
  {
    num: '01',
    title: 'Verifizierte Zielgruppen-Demografie',
    body: 'Öffentliche Regionscodes sind nur ein Näherungswert. Marken fragen meist nach TikTok-Studio-Screenshots zu Ländern, Altersgruppen und Geschlechterverteilung.',
  },
  {
    num: '02',
    title: 'Inhaltskategorie oder Nische',
    body: 'Kauffreudige Themenbereiche wie Finanzen, Software, B2B, Hautpflege, Fitness und Technik erzielen oft höhere Honorare als allgemeine Unterhaltung.',
  },
  {
    num: '03',
    title: 'Leistungsumfang & Produktion',
    body: 'Eine 15-Sekunden-Erwähnung im Alltagsvlog verursacht weniger Aufwand als ein geskriptetes 60-Sekunden-Tutorial mit Studio-Beleuchtung oder Außendreh.',
  },
  {
    num: '04',
    title: 'Nutzungsrechte & Lizenzierung',
    body: 'Basishonorare decken nur den organischen Post auf dem Creator-Profil ab. Weiterverwendung auf Marken-Websites, in E-Mails oder bezahlten Anzeigen rechtfertigt Lizenzgebühren.',
  },
  {
    num: '05',
    title: 'Spark Ads & Bezahlte Verstärkung',
    body: 'Die Freigabe eines Spark-Ads-Codes (Whitelisting) verknüpft bezahltes Werbebudget mit Ihrem Namen und wird meist in 30-, 60- oder 90-Tage-Paketen berechnet.',
  },
  {
    num: '06',
    title: 'Branchenexklusivität',
    body: 'Die Zusage, für einen festgelegten Zeitraum keine Konkurrenzprodukte zu bewerben, schränkt andere Einnahmen ein und rechtfertigt einen Exklusivitätszuschlag.',
  },
  {
    num: '07',
    title: 'Kampagnenpakete mit mehreren Videos',
    body: 'Fest vereinbarte Pakete aus drei bis fünf gesponserten Beiträgen pro Quartal führen oft zu einem moderaten Paketnachlass pro Video bei höherem Gesamthonorar.',
  },
  {
    num: '08',
    title: 'Timing & Verhandlungsposition',
    body: 'Saisonspitzen im Handel, knappe Produktionsfristen, hohe Creator-Nachfrage und nachgewiesene Conversion-Erfolge verschieben Vertragshonorare deutlich.',
  },
];

const creatorRows = [
  {
    metric: 'Follower gesamt',
    creatorA: '500.000 Follower',
    creatorB: '50.000 Follower',
    insight: 'Creator A hat 10× mehr Follower als Creator B.',
  },
  {
    metric: 'Follower-Skalierungsfaktor',
    creatorA: '1.08x (>100K-Stufe)',
    creatorB: '1.02x (>10K-Stufe)',
    insight: 'Creator A erhält einen höheren Skalierungsmultiplikator.',
  },
  {
    metric: 'Durchschnittliche Videoaufrufe',
    creatorA: '8.000 Aufrufe pro Video',
    creatorB: '65.000 Aufrufe pro Video',
    insight: 'Creator B erzielt mehr als 8× so viele Videoaufrufe pro Beitrag.',
  },
  {
    metric: 'Engagement-Rate',
    creatorA: '1,20 % Interaktionsrate',
    creatorB: '9,40 % Interaktionsrate',
    insight: 'Zuschauer von Creator B liken, kommentieren und teilen aktiv.',
  },
  {
    metric: 'Engagement-Faktor',
    creatorA: '0.924x',
    creatorB: '1.088x',
    insight: 'Starkes Engagement hebt den CPM-Multiplikator von Creator B an.',
  },
  {
    metric: 'Profil-Regionsstufe',
    creatorA: 'Tier 3 / Global ($18.00 Basis-Ø-CPM)',
    creatorB: 'Tier 1 / US ($30.00 Basis-Ø-CPM)',
    insight: 'Regionale Werbemarkt-Annahmen trennen die Basis-CPMs weiter.',
  },
  {
    metric: 'Angepasster Modell-CPM',
    creatorA: '$17.96 (Spanne: $11.98 – $25.95)',
    creatorB: '$33.29 (Spanne: $24.41 – $46.61)',
    insight: 'Aktive Interaktion und Markt-Tier verdoppeln den CPM nahezu.',
  },
  {
    metric: 'Geschätzter Sponsoring-Wert',
    creatorA: '$143.68 pro Video ($95.84 – $207.60)',
    creatorB: '$2,163.85 pro Video ($1,586.65 – $3,029.65)',
    insight: 'Reale Aufrufe und Interaktion bestimmen die höhere Schätzung.',
    highlight: true,
  },
];

const faqItems = [
  {
    id: 'faq-1',
    question: '1. Was schätzt ein TikTok Geldrechner genau?',
    schemaAnswer:
      'Ein TikTok Geldrechner wie KalkulatorTik schätzt die potenziellen kommerziellen Markensponsoring-Einnahmen für ein einzelnes gesponsertes Video eines öffentlichen TikTok-Profils. Statt direkte App-Auszahlungen zu berechnen, liefert er einen USD-Richtwert pro Video samt realistischer Preisspanne auf Basis von Reichweite, Engagement und regionalen CPM-Werten.',
    answer: (
      <p>
        Ein TikTok Geldrechner wie <strong>KalkulatorTik</strong> schätzt die{' '}
        <strong>potenziellen kommerziellen Markensponsoring-Einnahmen für ein einzelnes gesponsertes Video</strong>{' '}
        eines öffentlichen TikTok-Profils. Statt allgemeine App-Werbeanteile anzunehmen, liefert das Tool einen
        USD-Richtwert pro Video samt Preisspanne auf Grundlage von öffentlicher Reichweite, Engagement-Rate und
        regionalen CPM-Benchmarks.
      </p>
    ),
  },
  {
    id: 'faq-2',
    question: '2. Entspricht diese Schätzung den Auszahlungen des TikTok Creator Rewards Programms?',
    schemaAnswer:
      'Nein. Markensponsorings und das TikTok Creator Rewards Programm sind völlig getrennte Einkommensquellen. Creator Rewards vergütet berechtigte Creator direkt über TikTok nach qualifizierten Aufrufen auf Originalvideos über 1 Minute Länge (Mindestanforderungen: 10.000 Follower, 100.000 Aufrufe in 30 Tagen, Alter 18+ bzw. 19+ in Südkorea, einwandfreier Kontostand, berechtigtes Land). Unser Startseiten-Rechner schätzt private Markenkooperationen ohne feste Follower-Untergrenze.',
    answer: (
      <p>
        <strong>Nein.</strong> Markensponsorings und das TikTok Creator Rewards Programm sind völlig getrennte
        Einkommensquellen. Creator Rewards zahlt berechtigten Creatorn direkt über TikTok für qualifizierte Aufrufe auf
        Originalvideos ab <code>1+ Minute</code> Länge nach dynamischen RPM-Sätzen und setzt mindestens{' '}
        <code>10.000</code> Follower, <code>100.000</code> Videoaufrufe in den letzten 30 Tagen, Mindestalter{' '}
        <code>18+</code> (<code>19+</code> in Südkorea), einwandfreien Status und ein teilnehmendes Land voraus. Unser
        Rechner schätzt hingegen <strong>private Marken-Sponsorings</strong> ohne feste Follower-Grenze.
      </p>
    ),
  },
  {
    id: 'faq-3',
    question: '3. Wie wird eine TikTok Sponsoring-Schätzung auf KalkulatorTik berechnet?',
    schemaAnswer:
      'Unser Rechner teilt die durchschnittlichen Videoaufrufe eines Profils durch 1.000 und multipliziert den Wert mit dem angepassten CPM (Cost Per Mille). Ausgehend von unseren internen regionalen CPM-Klassen ($12–$42 über Tier 1 bis Tier 3 bei Mittelwerten von $18–$30) wendet das Modell einen Engagement-Faktor (0.90x bis 1.20x) und einen Follower-Faktor (1.00x bis 1.18x) an und begrenzt den endgültigen CPM auf $7.00 bis $80.00.',
    answer: (
      <p>
        Unser Rechner teilt die <strong>durchschnittlichen Videoaufrufe</strong> eines Profils durch <code>1.000</code>{' '}
        und multipliziert diesen Wert mit einem <strong>angepassten CPM (Cost Per Mille)</strong>. Ausgehend von
        internen regionalen CPM-Spannen (<code>$12&ndash;$42</code> über Tier 1&ndash;Tier 3 mit Mittelwerten von{' '}
        <code>$18&ndash;$30</code>) fließen ein Engagement-Multiplikator (<code>0.90x</code> bis <code>1.20x</code>)
        und ein Follower-Zuschlag (<code>1.00x</code> bis <code>1.18x</code>) ein, bevor der Wert zwischen{' '}
        <code>$7.00</code> und <code>$80.00</code> begrenzt wird.
      </p>
    ),
  },
  {
    id: 'faq-4',
    question: '4. Sind Follower oder Videoaufrufe wichtiger für Sponsoring-Preise?',
    schemaAnswer:
      'Durchschnittliche Videoaufrufe sind für die Preisfindung eines einzelnen gesponserten Videos meist wichtiger, weil sie die wahrscheinliche Zuschauerzahl zeigen. Follower liefern zwar sozialen Nachweis und einen kleinen Skalierungsfaktor, doch ein Kanal mit weniger Followern und konstant hohen Aufrufen erzielt meist höhere Schätzungen als ein großer Account mit schwachen aktuellen Aufrufen.',
    answer: (
      <p>
        <strong>Durchschnittliche Videoaufrufe wiegen meist schwerer</strong>, da sie abbilden, wie viele Menschen ein
        gesponsertes Video tatsächlich sehen dürften. Follower bieten sozialen Nachweis und einen moderaten Zuschlag im
        Modell, doch Konten mit kleinerer Follower-Basis und hohen, konstanten Videoaufrufen erreichen oft höhere
        Richtwerte als große Kanäle mit geringer aktueller Reichweite.
      </p>
    ),
  },
  {
    id: 'faq-5',
    question: '5. Kann ich Sponsoring-Einnahmen nur mit einem TikTok-Benutzernamen berechnen?',
    schemaAnswer:
      'Ja. Da KalkulatorTik als TikTok Geldrechner per Benutzernamen arbeitet, genügt das Handle eines beliebigen öffentlichen Kontos (mit oder ohne @-Zeichen). Das Tool ruft öffentliche Profil- und Videowerte automatisch ab.',
    answer: (
      <p>
        <strong>Ja.</strong> Da KalkulatorTik als <strong>TikTok Geldrechner per Benutzernamen</strong> funktioniert,
        benötigen Sie für jedes <strong>öffentliche</strong> Konto nur das Handle (mit oder ohne <code>@</code>-Symbol).
        Öffentliche Profil- und Videodaten werden automatisch ausgelesen.
      </p>
    ),
  },
  {
    id: 'faq-6',
    question: '6. Erfordert der Rechner ein TikTok-Passwort oder eine Kontoanmeldung?',
    schemaAnswer:
      'Niemals. KalkulatorTik fragt nie nach Ihrem TikTok-Passwort, Ihrer E-Mail-Adresse, 2FA-Codes oder Zugängen zu TikTok Studio. Alles basiert ausschließlich auf öffentlichen Profildaten. Details finden Sie in unserer Datenschutzerklärung.',
    answer: (
      <p>
        <strong>Niemals.</strong> KalkulatorTik fragt nicht nach Passwörtern, E-Mail-Adressen, Zwei-Faktor-Codes oder
        TikTok-Studio-Logins. Alles arbeitet auf Basis öffentlicher Profildaten. Lesen Sie auch unsere{' '}
        <Link to="/privacy" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Datenschutzerklärung
        </Link>{' '}
        für weitere Informationen.
      </p>
    ),
  },
  {
    id: 'faq-7',
    question: '7. Ist die Nutzung von KalkulatorTik kostenlos?',
    schemaAnswer:
      'Ja. KalkulatorTik ist online kostenlos ohne Abo, Kreditkarte oder Registrierung nutzbar. Standard-Serverlimits schützen lediglich vor automatisierter Überlastung. Weitere Antworten finden Sie auf unserer vollständigen FAQ-Seite.',
    answer: (
      <p>
        <strong>Ja.</strong> KalkulatorTik ist online kostenlos ohne Abo, Kreditkarte oder Zwangsregistrierung nutzbar.
        Übliche Server-Limits schützen lediglich vor automatisierter Überlastung. Weitere Antworten finden Sie auf
        unserer{' '}
        <Link to="/faq" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          vollständigen FAQ-Seite
        </Link>
        .
      </p>
    ),
  },
  {
    id: 'faq-8',
    question: '8. Können private TikTok-Profile analysiert werden?',
    schemaAnswer:
      'Nein. KalkulatorTik greift nur auf öffentlich sichtbare TikTok-Daten zu. Bei privaten Konten sind Follower- und Videowerte eingeschränkt. Kennen Sie die Summen manuell, nutzen Sie unseren TikTok Engagement-Rechner oder TikTok CPM-Rechner.',
    answer: (
      <p>
        <strong>Nein.</strong> KalkulatorTik liest ausschließlich öffentlich sichtbare Informationen. Bei privaten Konten
        sind Profildaten geschützt. Kennen Sie Ihre Zahlen manuell, nutzen Sie unseren{' '}
        <Link
          to="/tiktok-engagement-calculator"
          className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800"
        >
          TikTok Engagement-Rechner
        </Link>{' '}
        oder{' '}
        <Link
          to="/tiktok-cpm-calculator"
          className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800"
        >
          TikTok CPM-Rechner
        </Link>
        .
      </p>
    ),
  },
  {
    id: 'faq-9',
    question: '9. Warum sind Profildaten bei einer Suche manchmal nicht verfügbar?',
    schemaAnswer:
      'Eine Abfrage kann scheitern, wenn der Benutzername falsch geschrieben wurde, das Handle kürzlich geändert wurde, das Konto privat bzw. gesperrt ist oder TikTok bei hohem Aufkommen vorübergehend Anfragen drosselt.',
    answer: (
      <p>
        Eine Abfrage kann fehlschlagen, wenn ein Tippfehler vorliegt, das Handle kürzlich geändert wurde, das Konto
        privat oder gesperrt ist oder TikTok bei hoher Auslastung vorübergehend Limits setzt. Prüfen Sie die
        Schreibweise und versuchen Sie es nach einigen Sekunden erneut.
      </p>
    ),
  },
  {
    id: 'faq-10',
    question: '10. Was passiert, wenn aktuelle Videoaufrufe bei einem öffentlichen Profil fehlen?',
    schemaAnswer:
      'Sind Hauptdaten (Follower, Likes, Videos) vorhanden, aber aktuelle Videoaufrufe fehlen, wechselt KalkulatorTik automatisch in ein Fallback-Modell: 8 % der Follower ab 12.500 Followern (10 % zwischen 10.000 und 12.499, mindestens 1.000 Aufrufe darunter) sowie berechnetes Engagement aus Gesamtlikes oder Stufen-Standardwerten.',
    answer: (
      <p>
        Laden die öffentlichen Basiswerte (Follower, Gesamtlikes, Videos), aber keine Liste aktueller Videoaufrufe,
        wechselt KalkulatorTik in das <strong>Fallback-Schätzmodell</strong>: Es schätzt durchschnittliche Aufrufe auf{' '}
        <code>8 %</code> der Follower ab <code>12.500+</code> Followern (bzw. <code>10 %</code> zwischen{' '}
        <code>10.000</code> und <code>12.499</code>, mindestens <code>1.000</code> Aufrufe darunter) und berechnet das
        Engagement aus Gesamtlikes, Videos und Followern oder Fallback-Stufenwerten.
      </p>
    ),
  },
  {
    id: 'faq-11',
    question: '11. Ist der geschätzte Sponsoring-Betrag garantiert?',
    schemaAnswer:
      'Nein. Alle Werte von KalkulatorTik sind unverbindliche Orientierungswerte für Bildungs- und Planungszwecke. Tatsächliche Honorare hängen von konkreten Markenpartnern, Nische, Zielgruppe und Vertragsverhandlung ab.',
    answer: (
      <p>
        <strong>Nein.</strong> Sämtliche Zahlen sind unverbindliche Orientierungswerte und keine garantierten
        Einkünfte oder offiziellen Agenturangebote. Reale Honorare richten sich nach Nische, Zielgruppe,
        Leistungsumfang und Verhandlung.
      </p>
    ),
  },
  {
    id: 'faq-12',
    question: '12. Wie können Creator diese Schätzung in Markenverhandlungen nutzen?',
    schemaAnswer:
      'Nutzen Sie den Durchschnittswert als Ausgangspunkt für ein standardmäßiges organisches Sponsoring-Video. Bieten Sie höhere Werte für Extras wie Spark Ads, Nutzungsrechte oder Exklusivität und moderate Paketpreise für Mehrvideo-Kampagnen.',
    answer: (
      <div className="space-y-2">
        <p>
          Betrachten Sie Durchschnittswert und Preisspanne als{' '}
          <strong>Basis für ein organisches gesponsertes Video</strong>:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            Nutzen Sie den <strong>Durchschnittswert</strong>, um eingehende Markenangebote auf Plausibilität zu
            prüfen.
          </li>
          <li>
            Bewegen Sie sich ans <strong>obere Ende der Spanne</strong> oder darüber hinaus, wenn Spark Ads,
            Nutzungslizenzen (30–90 Tage), Branchenexklusivität oder aufwendige Produktion verlangt werden.
          </li>
          <li>
            Gewähren Sie bei verbindlichen 3er- oder 5er-Videopaketen einen moderaten Mengenrabatt zum{' '}
            <strong>unteren Ende der Spanne</strong>.
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
  inLanguage: 'de',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.schemaAnswer },
  })),
};

const copy = {
  intro: {
    title: 'Was ist ein TikTok Geldrechner?',
    description:
      'Ein TikTok Geldrechner ist ein Bewertungstool für Creator, das schätzt, was ein öffentliches TikTok-Profil für ein gesponsertes Video verlangen kann—und Marken faire Richtwerte bietet.',
    p1: (
      <>
        Statt Einnahmen aus Markenkooperationen zu raten, wertet dieser{' '}
        <strong className="font-semibold text-slate-900">TikTok Geldrechner</strong> öffentlich sichtbare
        Profilsignale aus—darunter <strong className="font-semibold text-slate-900">durchschnittliche Videoaufrufe</strong>,{' '}
        <strong className="font-semibold text-slate-900">Engagement-Rate</strong>,{' '}
        <strong className="font-semibold text-slate-900">Profilregion</strong> und{' '}
        <strong className="font-semibold text-slate-900">Follower-Größe</strong>—und ermittelt daraus einen
        Einzelvideo-Richtwert in USD samt Verhandlungsspanne.
      </>
    ),
    p2: 'Ob Sie als Creator eine Preisliste (Rate Card) vorbereiten oder als Marke Kampagnenpartner vergleichen: KalkulatorTik liefert transparente Richtwerte über jeden öffentlichen TikTok-Benutzernamen ohne Anmeldung oder Passwort.',
  },
  howToUse: {
    title: 'So nutzen Sie den TikTok Geldrechner',
    description:
      'Berechnen Sie geschätzte TikTok-Sponsoring-Einnahmen per Benutzernamen in drei kurzen Schritten—ohne Login.',
    actionLabel: 'Rechner oben öffnen \u2191',
    steps: [
      {
        badge: 'SCHRITT 01',
        title: 'Benutzernamen eingeben & berechnen',
        body: (
          <>
            Geben Sie oben ein öffentliches TikTok-Handle ein (etwa <code>khaby.lame</code> oder <code>@mrbeast</code>)
            &mdash;vorangestellte <code>@</code>-Zeichen werden automatisch entfernt&mdash;und klicken Sie auf{' '}
            <strong>Sponsoring-Wert berechnen</strong>.
          </>
        ),
      },
      {
        badge: 'SCHRITT 02',
        title: 'Profil & Datenquelle prüfen',
        body: (
          <>
            Prüfen Sie über das Statusbanner, ob eine <strong>aktuelle Videostichprobe</strong> oder der{' '}
            <strong>Profil-Fallback-Modus</strong> genutzt wurde, und sehen Sie <strong>Richtwert &amp; Spanne</strong>{' '}
            sowie <strong>CPM-Benchmark</strong> ein.
          </>
        ),
      },
      {
        badge: 'SCHRITT 03',
        title: 'Auf Vertragsbedingungen anwenden',
        body: (
          <>
            <strong>Creator:</strong> Nutzen Sie den Mittelwert als Basis vor Zuschlägen für Spark Ads oder Lizenzen.{' '}
            <strong>Marken:</strong> Vergleichen Sie Angebote mit Reichweite und Interaktionsqualität.
          </>
        ),
      },
    ],
    troubleshootingTitle: 'Fehlerbehebung & Manuelle Cache-Aktualisierung',
    troubleshootingP1: (
      <>
        <strong className="text-slate-900">Öffentliche Abfragen &amp; Drosselung:</strong> Nur öffentliche Profile sind
        auslesbar. Bei kurzen TikTok-Limits warten Sie bitte wenige Sekunden.
      </>
    ),
    troubleshootingP2: (
      <>
        <strong className="text-slate-900">1-Stunden-Cache &amp; Frischabruf:</strong> Ergebnisse werden für bis zu 1
        Stunde zwischengespeichert. Nutzen Sie bei ganz neuen Zahlen <strong>Refresh Data</strong> in der{' '}
        <Link to="/calculator" className="font-semibold text-teal-700 underline underline-offset-2">
          eigenständigen Aktualisierungsansicht
        </Link>
        .
      </>
    ),
    footerNote: 'Nachfolgend werden alle Bewertungskarten und sechs Profilkennzahlen im Detail erklärt.',
  },
  results: {
    title: 'Profilleistung & Geschätzter Sponsoring-Wert',
    description:
      'Jede Benutzernamen-Abfrage übersetzt öffentliche Profilsignale in eine Sponsoring- und Tarifübersicht pro Video.',
    primaryEyebrow: 'Primäres Bewertungsergebnis',
    usdBadge: 'USD-Richtwert',
    primaryTitle: 'Geschätzter Sponsoring-Wert pro Video',
    primaryLead: (
      <>
        Der Hauptbetrag zeigt den{' '}
        <strong className="font-semibold text-slate-900">geschätzten Basispreis für ein gesponsertes Video</strong>. Zwei
        Referenzwerte rahmen das Angebot ein:
      </>
    ),
    rangeTitle: 'Geschätzte Sponsoring-Spanne',
    rangeBody:
      'Kurze Erwähnungen oder Mehrfach-Pakete liegen meist am unteren Ende; gefragte Nischen oder Zusatzleistungen bewegen sich Richtung oberes Ende.',
    cpmTitle: 'Modell-CPM-Richtwert',
    cpmBody:
      'Angenommener Brutto-Werbepreis je 1.000 Videoaufrufe nach Anpassung an Regions-Tier, Engagement-Rate und Follower-Skala.',
    cacheNote: 'Werte basieren auf öffentlichen Profildaten zum Abrufzeitpunkt (oder bis zu 1 Stunde Cache).',
    profileOverviewTitle: 'Öffentliche Profilübersicht',
    profileOverviewBadge: 'Identitätssignale',
    profileOverviewBody: (
      <>
        Zeigt verfügbare öffentliche Angaben&mdash;Anzeigename, <code>@handle</code>, Verifizierungs-Abzeichen, Bio,
        Regionscode (sofern sichtbar), TikTok-ID und Beitrittsdatum.
      </>
    ),
    metricsTitle: 'Kontoübersicht & Aktivitäts-Benchmarks',
    metricsBadge: '6 Öffentliche Kennzahlen',
    howToReadTitle: 'So interpretieren Sie Ihre Ergebnisse',
    howToReadBody: (
      <>
        Ob als Richtwert für Ihre Preisliste oder zur Prüfung eingehender Anfragen: Betrachten Sie die Zahl als
        Verhandlungsbasis, nicht als Festpreis oder garantiertes Einkommen. <strong className="text-slate-900">Creator</strong>{' '}
        ergänzen gegebenenfalls Lizenz- und Exklusivitätsgebühren; <strong className="text-slate-900">Marken</strong>{' '}
        prüfen Preis-Leistungs-Verhältnisse anhand realer Aufrufe.
      </>
    ),
    limitationsBadge: 'Grenzen der Schätzung',
    limitationsBody:
      'Dieses Ergebnis basiert rein auf öffentlichen Profilsignalen und sieht keine privaten TikTok-Studio-Analysen, Altersstrukturen oder Watch-Time-Raten ein. Fehlen Videodaten, greift automatisch das Fallback-Modell.',
  },
  calculation: {
    title: 'Wie der TikTok Geldrechner den Sponsoring-Wert berechnet',
    description:
      'Statt einer undurchsichtigen Zahl nutzt KalkulatorTik ein transparentes Stufenmodell zur Schätzung möglicher Creator-Preise.',
    eqBadge: 'Kern-Bewertungsgleichung',
    eqTitle: 'Die grundlegende Sponsoring-Formel',
    eqBody:
      'Basiert auf dem Tausend-Kontakt-Preis (CPM) pro 1.000 Videoaufrufe. Aus Minimal-, Durchschnitts- und Maximal-CPM ergeben sich Richtwert und Spanne.',
    eqPart1: 'Ø-Videoaufrufe \u00F7 1.000',
    eqPart2: 'Angepasster CPM',
    eqPart3: 'Geschätzter Videopreis',
    step1Title: 'Schritt 1: Durchschnittliche Aufrufe & Engagement-Rate berechnen',
    step1Desc: 'Bei einer Profilabfrage prüft der Rechner bis zu 30 aktuelle öffentliche Videos mit Aufrufzahlen:',
    avgViewsTitle: 'Durchschnittliche Videoaufrufe',
    avgViewsDesc: 'Berechnet den arithmetischen Mittelwert über aktuelle öffentliche Videos (> 0 Aufrufe):',
    avgViewsFormula: 'Ø-Aufrufe = Summe aktueller Aufrufe \u00F7 Analysierte Videos',
    engTitle: 'Engagement-Rate',
    engDesc: 'Misst öffentliche Interaktionen im Verhältnis zu den Aufrufen dieser Stichprobe:',
    engFormula: 'Engagement (%) = ((Likes + Kommentare + Shares) \u00F7 Aufrufe) \u00D7 100',
    step2Title: 'Schritt 2: Basis-CPM-Stufe wählen (Modellannahmen)',
    step2Desc:
      'Je nach ausgewiesenem Regionscode ordnet KalkulatorTik ein USD-Basis-CPM-Fenster zu (Standard: Tier 3 ohne Regionsangabe):',
    tableCaption: 'Interne KalkulatorTik Basis-CPM-Annahmen (USD pro 1.000 Aufrufe).',
    thTier: 'Marktstufe',
    thCountries: 'Profil-Regionscodes',
    thMin: 'Basis Min',
    thAvg: 'Basis Ø',
    thMax: 'Basis Max',
    step2Note: (
      <>
        <strong>Methodenhinweis:</strong> Diese CPM-Klassen sind interne Benchmark-Annahmen&mdash;keine offiziellen
        TikTok-Sätze. Regionscodes garantieren nicht den Wohnort aller Zuschauer.
      </>
    ),
    step3Title: 'Schritt 3: Engagement- und Follower-Multiplikatoren anwenden',
    step3Desc: (
      <>
        Zwei Leistungsfaktoren passen den Ausgangs-CPM an, bevor er zwischen <strong>$7.00</strong> und{' '}
        <strong>$80.00</strong> je 1.000 Aufrufe gedeckelt wird:
      </>
    ),
    engAdjTitle: (
      <>
        Engagement-Anpassung (<code>0.90x&ndash;1.20x</code>)
      </>
    ),
    engAdjBody: (
      <>
        Steigt linear von <code>0%</code> Engagement (<code>0.90x</code>) über den Neutralpunkt <code>5.0%</code> (
        <code>1.00x</code>) bis maximal <code>1.20x</code> ab <code>15%+</code> Engagement.
      </>
    ),
    engAdjBox1: '0% = 0.90x · 5.0% = 1.00x (Neutral)',
    engAdjBox2: '7.5% = 1.05x · 15%+ = 1.20x (Max)',
    scaleTitle: (
      <>
        Follower-Skala (<code>1.00x&ndash;1.18x</code>)
      </>
    ),
    scaleSub: 'Reine Aufwertungs-Skala (kleinere Creator werden nie abgewertet):',
    boundsTitle: (
      <>
        CPM-Unter- &amp; Obergrenze (<code>$7.00&ndash;$80.00</code>)
      </>
    ),
    boundsBody: (
      <>
        Niedriger, mittlerer und hoher CPM werden mit beiden Faktoren multipliziert und auf <code>$7.00</code> bis{' '}
        <code>$80.00</code> begrenzt.
      </>
    ),
    boundsBox: 'Angepasster CPM = Basis × Eng × Skala (Grenzen $7–$80)',
    fallbackTitle: 'Fallback-Schätzung bei fehlenden Videoaufrufen',
    fallbackViews: (
      <>
        <strong className="text-slate-900">Fallback Ø-Aufrufe:</strong> Geschätzt mit <code>8%</code> der Follower ab{' '}
        <code>12.500+</code> Followern, <code>10%</code> zwischen <code>10.000</code> und <code>12.499</code> und
        mindestens <code>1.000</code> Aufrufen darunter.
      </>
    ),
    fallbackEng: (
      <>
        <strong className="text-slate-900">Fallback Engagement-Rate:</strong> Berechnet aus Likes, Videos und Followern
        (<code>1.0%–50.0%</code>) oder Follower-Stufenwerten (<code>8.0%</code> bis 100K, <code>5.0%</code> über 100K,{' '}
        <code>3.0%</code> über 1M, <code>2.0%</code> über 10M).
      </>
    ),
    exampleBadge: 'Hypothetisches Modellbeispiel',
    exampleTitle: 'Rechenbeispiel: Sponsoring-Richtwert eines Creators ermitteln',
    exampleTag: 'Musterprofil',
    exRegionLabel: 'Profilregion',
    exRegionVal: 'US (Tier 1)',
    exFollowersLabel: 'Follower',
    exFollowersSub: 'Skala = 1.08x',
    exViewsLabel: 'Ø-Aufrufe',
    exViewsVal: '50.000 / Video',
    exViewsSub: '50,0 Einheiten',
    exEngLabel: 'Engagement-Rate',
    exEngSub: 'Faktor = 1.08x',
    exStep1: '1. Normalisiertes Engagement:',
    exStep2: '2. Engagement-Faktor:',
    exStep3: '3. Gesamtmultiplikator:',
    exStep4Label: '4. Angepasste CPM-Spanne:',
    exStep4Min: 'Min',
    exStep4Avg: 'Ø',
    exStep4Max: 'Max',
    exStep4Tag: '$34.99 Ø',
    exStep5Title: '5. Endergebnis (50 × $34.99)',
    exPerVideo: 'pro gesponsertem Video',
    exRange: 'Spanne: $1,283.00 – $2,449.50',
    exFooterNote: 'Nur Modellbeispiel; prüft keine privaten Zielgruppen- oder Conversion-Daten.',
    transitionNote:
      'Da dieser Richtwert externe Werbebudgets pro Video abbildet, erfüllt er einen völlig anderen Zweck als direkte In-App-Vergütungen durch TikTok.',
  },
  channels: {
    title: 'Markensponsorings vs. TikTok Creator Rewards: Wo liegt der Unterschied?',
    description:
      'Viele Creator erwarten direkte Plattformauszahlungen, doch kommerzielle Markenkooperationen und TikToks Creator Rewards Programm haben völlig unterschiedliche Geldgeber und Regeln.',
    leftBadge: 'Durch diesen Rechner geschätzt',
    leftTitle: 'Wie Markensponsorings & gesponserte Videos funktionieren',
    leftLead: (
      <>
        Eine direkte Geschäftsvereinbarung, bei der ein externes Unternehmen oder eine Agentur einen Creator für die
        Einbindung eines Produkts in einem <strong>gesponserten Video</strong> bezahlt.
      </>
    ),
    leftItems: [
      ['Wer zahlt', 'Externe Marken, Unternehmen oder Agenturen direkt per Rechnung oder Überweisung.'],
      [
        'Preisgestaltung',
        'Individuell pro Video oder Kampagne nach Reichweite, Nische, Aufwand und Lizenzen verhandelt.',
      ],
      [
        'Teilnahme',
        'Offen für Creator jeder Größe—auch Nano-Creator unter 10.000 Followern mit passender Zielgruppe.',
      ],
    ],
    rightBadge: 'In-App-Plattformprogramm',
    rightTitle: 'Wie das TikTok Creator Rewards Programm funktioniert',
    rightLead:
      'Direkte Auszahlungen durch TikTok (Nachfolger des ehemaligen Creator Fund) über das Creator-Guthaben in der App.',
    rightItems: [
      ['Wer zahlt', 'TikTok schüttet Beträge direkt nach offiziellen Programmbedingungen aus.'],
      [
        'Voraussetzungen',
        <>
          Erfordert <code>10.000+</code> Follower, <code>100.000+</code> Aufrufe in 30 Tagen, Alter <code>18+</code> (
          <code>19+</code> in Südkorea), einwandfreies Konto und teilnehmende Region.
        </>,
      ],
      [
        'Auszahlungsregeln',
        <>
          Gilt nur für qualifizierte Originalvideos ab <code>1+ Minute</code> auf Basis interner{' '}
          <strong>qualifizierter Aufrufe</strong> und dynamischem RPM.
        </>,
      ],
      [
        'Weitere Kanäle',
        'LIVE-Geschenke und TikTok-Shop-Provisionen unterliegen jeweils eigenen Plattformregeln.',
      ],
    ],
    compareTitle: 'Direktvergleich: Markenkooperationen vs. Plattform-Monetarisierung',
    tableCaption: 'Wesentliche Unterschiede zwischen Markensponsorings und offiziellen TikTok-Auszahlungen.',
    thFeature: 'Merkmal',
    thSponsor: 'Markensponsorings (Gesponserte Videos)',
    thRewards: 'TikTok Creator Rewards (Plattform)',
    whyTitle: 'Warum eine Sponsoring-Schätzung keine TikTok-Auszahlung ist',
    whyBody:
      'Private Creator-Rewards-Werte wie qualifizierter Aufrufsanteil und RPM stehen nur im eigenen TikTok Studio und sind für externe Rechner unsichtbar. Markendeals vergüten zudem maßgeschneiderte Kreativarbeit statt passiver Ad-Shares.',
    whyFootnote:
      'Regeln, berechtigte Länder und Zahlungsbedingungen von Creator Rewards legt allein TikTok fest.',
  },
  factors: {
    title: 'Was beeinflusst TikTok Sponsoring-Honorare?',
    description:
      'Zwei Kanäle mit ähnlichen Aufrufen können sehr unterschiedliche Preise erzielen. Die Trennung zwischen öffentlichen Rechnersignalen und verhandelten Zusatzklauseln hilft bei realistischen Angeboten.',
    measuredTitle: 'Automatisch in der Rechnerformel berücksichtigt',
    measuredBadge: '4 Öffentliche Signale',
    measuredBody: (
      <>
        Die Schätzung gewichtet bereits <strong>durchschnittliche Videoaufrufe</strong>,{' '}
        <strong>Engagement-Rate</strong>, <strong>Regions-Indikator</strong> und <strong>Follower-Größe</strong>,
        bevor Vertragsdetails greifen.
      </>
    ),
    unmeasuredTitle: 'Reale Verhandlungsfaktoren außerhalb des Rechners',
    unmeasuredBadge: 'Privat verhandelt',
    adjustTitle: 'Wie Sie Angebote nach Kampagnenbedingungen anpassen',
    adjustBody: (
      <>
        Betrachten Sie den Rechnerwert als <strong>Ausgangspunkt für ein organisches Sponsoring-Video</strong> und
        rechnen Sie Extras wie Spark Ads, Nutzungsrechte, Exklusivität oder aufwendige Drehs separat hinzu.
      </>
    ),
  },
  followersVsViews: {
    title: 'Follower vs. Videoaufrufe: Was zählt bei TikTok-Sponsorings mehr?',
    description:
      'Anders als chronologische Feeds verteilt TikToks For-You-Feed Inhalte nach Interesse und Watch-Time. Darum liefern ein inaktiver Großkanal und ein aktiver mittelgroßer Kanal ganz unterschiedliche Reichweiten.',
    creatorATag: 'Modell-Creator A · Inaktives Großprofil',
    creatorAPrice: '$143.68 / Video',
    creatorABody: (
      <>
        Erzielte früher <strong>500.000 Follower</strong>, doch aktuelle Videos erreichen im Schnitt{' '}
        <strong>8.000 Aufrufe</strong> bei <code>1.20%</code> Engagement (Tier-3-Region).
      </>
    ),
    creatorBTag: 'Modell-Creator B · Hohe aktive Reichweite',
    creatorBPrice: '$2,163.85 / Video',
    creatorBBody: (
      <>
        Ein fokussierter Nischenkanal mit <strong>50.000 Followern</strong>, <strong>65.000 Ø-Aufrufen</strong> pro
        Post und <code>9.40%</code> Engagement (Tier-1-Region).
      </>
    ),
    labelFollowers: 'Follower',
    labelViews: 'Ø-Aufrufe pro Video',
    compareTitle: 'Modellvergleich: Viele Follower vs. Konstante Videoaufrufe',
    compareCaption: 'Hypothetischer Vergleich nach der KalkulatorTik-Bewertungsformel.',
    thMetric: 'Kennzahl / Schritt',
    thCreatorA: 'Creator A (500K Follower)',
    thCreatorB: 'Creator B (50K Follower)',
    thWhy: 'Warum es zählt',
    tier3Note:
      'Hinweis: Selbst im selben Tier-3-Markt ($18.00 Basis-Ø-CPM) erzielt Creator B mit 65.000 Aufrufen und 9,40 % Engagement $1,298.70 pro Video ($19.98 CPM)—9× mehr als Creator A ($143.68).',
    stillMattersTitle: 'Wann die Follower-Zahl dennoch wichtig bleibt',
    stillMattersList: [
      <>
        <strong>Markenwahrnehmung &amp; Vertrauen:</strong> Einige Werbekunden filtern zunächst grob nach
        Follower-Schwellen.
      </>,
      <>
        <strong>Vertrautes Stammpublikum:</strong> Wiederkehrende Follower aus dem Folge-ich-Feed vertrauen
        Produkttipps oft stärker.
      </>,
      <>
        <strong>Plattform-Funktionen:</strong> Bestimmte Follower-Zahlen schalten LIVE-Streams und offizielle Programme
        frei.
      </>,
    ],
    rateCardTitle: 'Eine ausgewogene Creator Rate Card aufbauen',
    rateCardBody: (
      <>
        Stellen Sie in Ihrem Media-Kit <strong>aktuelle Ø-Videoaufrufe</strong>,{' '}
        <strong>Engagement-Rate</strong> und starke Haltedauer-Beispiele voran. Follower spiegeln vergangenes
        Wachstum; Aufrufe zeigen heutige Reichweite.
      </>
    ),
    rateCardPrompt: 'Eigenen Kanal testen?',
    rateCardBtn: 'Profil-Richtwert prüfen \u2191',
  },
  relatedTools: {
    title: 'Weitere kostenlose TikTok-Rechner entdecken',
    description:
      'Sponsoring-Kalkulation funktioniert am besten zusammen mit Anzeigen-CPM-Planung und Interaktionsanalysen.',
    tool1Tag: 'Interaktions-Audit',
    tool1Badge: 'Manuelle Eingabe',
    tool1Title: 'TikTok Engagement-Rechner',
    tool1Desc: (
      <>
        Berechnet die durchschnittliche Like-Interaktion aus <strong>Gesamtlikes</strong>,{' '}
        <strong>Gesamtvideos</strong> und <strong>Followern</strong> (inklusive Kurzformen wie <code>277.8K</code>{' '}
        oder <code>4.2M</code>) im Vergleich zu Benchmarks von <code>1K&ndash;5K</code> bis <code>1M+</code>.
      </>
    ),
    tool1Formula: '((Likes gesamt ÷ Follower gesamt) ÷ Videos gesamt) × 100',
    tool1Best: 'Ideal für Media-Kit-Updates, Kanal-Checks und manuelle Analysen privater Konten.',
    tool1Cta: 'TikTok Engagement-Rechner öffnen \u2192',
    tool2Tag: 'Werbekosten & Kampagnenmathematik',
    tool2Badge: '7 Währungen',
    tool2Title: 'TikTok CPM-Rechner',
    tool2Desc: (
      <>
        Drei-Modi-Planer für <code>USD</code>, <code>EUR</code>, <code>GBP</code>, <code>CAD</code>, <code>AUD</code>,{' '}
        <code>INR</code> und <code>PKR</code> zum direkten Vergleich zwischen Creator-Angeboten und bezahlter
        TikTok-Reichweite.
      </>
    ),
    tool2Modes: ['CPM berechnen', 'Werbebudget berechnen', 'Impressionen berechnen'],
    tool2Best: 'Ideal für Media Buyer, Marketingteams und Creator zur ROI-Prüfung.',
    tool2Cta: 'TikTok CPM-Rechner öffnen \u2192',
    refreshTag: 'Separate Aktualisierungsansicht',
    refreshBadge: 'Inkl. Cache-Refresh',
    refreshTitle: 'Manuelle Profilabfrage mit Cache-Refresh',
    refreshDesc: (
      <>
        Möchten Sie aktuelle Profilzahlen sofort am 1-Stunden-Cache vorbei neu abrufen? Nutzen Sie unsere Refresh-Ansicht
        mit manuellem <strong>Refresh Data</strong>.
      </>
    ),
    refreshCta: 'Cache-Refresh-Ansicht öffnen \u2192',
  },
  faq: {
    title: 'TikTok Geldrechner & Sponsoring-Bewertung FAQs',
    description:
      'Klare Antworten zur Sponsoring-Methodik, öffentlichen Datenschutz-Regeln, Fallback-Logik und Preisverhandlung.',
    ariaTogglePrefix: 'Antwort umschalten für: ',
    disclaimer:
      'Antworten spiegeln aktuelle Methodik und gängige Influencer-Marketing-Praxis wider und ersetzen keine Finanz-, Rechts- oder Steuerberatung.',
    viewAllLink: 'Alle Monetarisierungs-FAQs ansehen \u2192',
  },
  closing: {
    sectionAriaLabel: 'TikTok-Profilberechnung starten oder weitere Tools entdecken',
    title: 'Bereit, Ihren TikTok Sponsoring-Wert zu berechnen?',
    description:
      'Ob für Ihre eigene Rate Card, zur Angebotsprüfung oder zum CPM-Vergleich: Geben Sie oben einen öffentlichen TikTok-Benutzernamen ein oder öffnen Sie ein Spezial-Tool.',
    btnPrimary: 'Nach TikTok-Benutzernamen berechnen \u2191',
    btnCpm: 'CPM-Rechner öffnen',
    btnEng: 'Engagement-Rechner öffnen',
    aboutLine: (
      <>
        KalkulatorTik ist eine unabhängige Creator-Analyseplattform. Mehr erfahren Sie auf{' '}
        <Link to="/about" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Über KalkulatorTik
        </Link>{' '}
        oder in unseren{' '}
        <Link to="/faq" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          TikTok Monetarisierungs-FAQs
        </Link>
        .
      </>
    ),
    legalNotice: (
      <>
        KalkulatorTik ist ein unabhängiges Tool und steht in keiner Verbindung zu TikTok Inc. oder ByteDance Ltd. und wird von diesen weder unterstützt noch autorisiert; alle Marken gehören ihren jeweiligen Inhabern. Alle Werte sind unverbindliche Richtwerte—lesen Sie unsere{' '}
        <Link to="/privacy" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Datenschutzerklärung
        </Link>{' '}
        und{' '}
        <Link to="/terms" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Nutzungsbedingungen
        </Link>
        .
      </>
    ),
  },
};

export const DE_HOME_PACK = {
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

