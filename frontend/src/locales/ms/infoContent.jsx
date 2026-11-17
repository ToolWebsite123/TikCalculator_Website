import React from 'react';
import Link from '../../components/LocaleLink';

const seo = {
  title: 'Kalkulator Wang TikTok – Anggarkan Pendapatan TikTok Anda',
  description:
    'Anggarkan pendapatan TikTok anda dengan Kalkulator Wang TikTok percuma kami. Terokai potensi pendapatan daripada tontonan, pengikut, interaksi, dan tajaan.',
  ogLocale: 'ms_MY',
};

const metricsGuide = [
  {
    name: 'Pengikut',
    tag: 'Capaian Khalayak',
    description:
      'Jumlah akaun TikTok yang mengikuti pencipta. Menunjukkan saiz khalayak dan bukti sosial serta menyumbang pengganda skala sekunder.',
  },
  {
    name: 'Jumlah Suka',
    tag: 'Suka Sepanjang Masa',
    description: 'Jumlah suka terkumpul merentas semua video awam yang dipaparkan pada profil.',
  },
  {
    name: 'Jumlah Video',
    tag: 'Video Dimuat Naik',
    description: 'Bilangan keseluruhan video awam yang diterbitkan pada akaun tersebut.',
  },
  {
    name: 'Mengikuti',
    tag: 'Akaun Diikuti',
    description: 'Jumlah profil yang diikuti oleh pencipta.',
  },
  {
    name: 'Angg. Purata Tontonan',
    tag: 'Tontonan per Video',
    description:
      'Purata tontonan setiap video daripada muat naik awam terkini, atau dianggarkan daripada pengikut jika data video terkini tiada.',
  },
  {
    name: 'Engagement',
    tag: 'Kadar Interaksi',
    description:
      'Gabungan suka, komen dan perkongsian dibahagikan dengan jumlah tontonan sampel video terkini (atau dianggarkan dalam mod sandaran).',
  },
];

const cpmTiers = [
  {
    tier: 'Pasaran Tier 1',
    regions: 'US, CA, UK, GB, AU, NZ, DE',
    min: '$22.00',
    avg: '$30.00',
    max: '$42.00',
    featured: true,
  },
  {
    tier: 'Pasaran Tier 2',
    regions: 'FR, ES, IT, PT, BR, MX, SG, NL, BE, SE, NO, DK, FI, IE, CH',
    min: '$16.00',
    avg: '$22.00',
    max: '$32.00',
    featured: false,
  },
  {
    tier: 'Tier 3 / Lalai Global',
    regions: 'Semua wilayah lain atau apabila tiada kod wilayah pada profil',
    min: '$12.00',
    avg: '$18.00',
    max: '$26.00',
    featured: false,
  },
];

const followerScaleTiers = [
  { range: 'Sehingga 10,000 pengikut', factor: '1.00x' },
  { range: '10,001 hingga 100,000 pengikut', factor: '1.02x' },
  { range: '100,001 hingga 500,000 pengikut', factor: '1.08x' },
  { range: '500,001 hingga 2,000,000 pengikut', factor: '1.12x' },
  { range: 'Melebihi 2,000,000 pengikut', factor: '1.18x' },
];

const channelRows = [
  {
    feature: 'Sumber Bayaran',
    sponsorships: 'Jenama luar, pengiklan atau agensi pemasaran',
    rewards: 'TikTok (ByteDance) secara terus ke baki pencipta dalam aplikasi',
  },
  {
    feature: 'Metrik Harga / Bayaran',
    sponsorships: 'Kadar rundingan berpandukan CPM Tajaan (Kos per 1,000 Tontonan)',
    rewards: 'RPM platform berubah-ubah (Hasil per 1,000 Tontonan Layak) oleh TikTok',
  },
  {
    feature: 'Peraturan Tempoh Video',
    sponsorships: 'Sebarang tempoh yang dipersetujui dalam ringkasan kempen jenama',
    rewards: 'Mesti memenuhi had tempoh minimum dan peraturan keaslian TikTok',
  },
  {
    feature: 'Had Pengikut',
    sponsorships: 'Tiada minimum wajib platform; bergantung pada kesesuaian jenama dan capaian',
    rewards: 'Perlu memenuhi syarat pengikut rasmi TikTok dan tontonan 30 hari',
  },
  {
    feature: 'Dimodelkan oleh KalkulatorTik?',
    sponsorships: 'Ya — Dimodelkan oleh Kalkulator Wang TikTok halaman utama ini',
    rewards: 'Tidak — Memerlukan data dalaman tontonan layak dan RPM peribadi',
    isStatusRow: true,
  },
];

const factors = [
  {
    num: '01',
    title: 'Demografi Khalayak Disahkan',
    body: 'Kod wilayah profil hanyalah anggaran kasar. Jenama biasanya meminta tangkapan skrin TikTok Studio yang memaparkan negara penonton, kumpulan umur dan jantina.',
  },
  {
    num: '02',
    title: 'Kategori Kandungan atau Niche',
    body: 'Kategori bernilai komersial tinggi — kewangan peribadi, perisian, B2B, penjagaan kulit, kecergasan dan teknologi — lazimnya menerima bayaran lebih tinggi.',
  },
  {
    num: '03',
    title: 'Hasil Kerja & Skop Pengeluaran',
    body: 'Sebutan ringkas 15 saat dalam vlog harian memerlukan usaha lebih kecil berbanding tutorial berskrip 60 saat dengan pencahayaan studio atau lokasi khas.',
  },
  {
    num: '04',
    title: 'Hak Penggunaan & Pelesenan',
    body: 'Kadar asas merangkumi siaran organik pada profil pencipta. Penyiaran semula di laman web jenama, e-mel atau iklan berbayar memerlukan yuran lesen tambahan.',
  },
  {
    num: '05',
    title: 'Spark Ads & Pengiklanan Berbayar',
    body: 'Perkongsian kod Spark Ads (whitelisting) meletakkan bajet iklan pada akaun anda—biasanya dibilkan mengikut tempoh 30, 60 atau 90 hari.',
  },
  {
    num: '06',
    title: 'Eksklusiviti Kategori',
    body: 'Persetujuan untuk tidak mempromosikan produk pesaing bagi tempoh tertentu mengehadkan pendapatan tajaan lain dan wajar dikenakan bayaran tambahan.',
  },
  {
    num: '07',
    title: 'Pakej Kempen Berbilang Video',
    body: 'Menempah tiga hingga lima siaran tajaan dalam satu suku tahun lazimnya menawarkan diskaun pakej bagi setiap video sebagai pertukaran jumlah kontrak lebih besar.',
  },
  {
    num: '08',
    title: 'Masa & Kedudukan Rundingan',
    body: 'Musim puncak jualan, tarikh akhir singkat, permintaan tinggi terhadap pencipta dan rekod jualan lalu boleh mengubah kadar kontrak akhir.',
  },
];

const creatorRows = [
  {
    metric: 'Jumlah Pengikut',
    creatorA: '500,000 pengikut',
    creatorB: '50,000 pengikut',
    insight: 'Pencipta A mempunyai 10× lebih ramai pengikut berbanding Pencipta B.',
  },
  {
    metric: 'Faktor Skala Pengikut',
    creatorA: '1.08x (tahap >100K)',
    creatorB: '1.02x (tahap >10K)',
    insight: 'Pencipta A menerima pengganda skala pengikut yang lebih tinggi.',
  },
  {
    metric: 'Purata Tontonan Video',
    creatorA: '8,000 tontonan per video',
    creatorB: '65,000 tontonan per video',
    insight: 'Pencipta B menjana lebih daripada 8× ganda tontonan setiap siaran.',
  },
  {
    metric: 'Kadar Engagement',
    creatorA: '1.20% kadar interaksi',
    creatorB: '9.40% kadar interaksi',
    insight: 'Penonton Pencipta B aktif menyukai, mengulas dan berkongsi.',
  },
  {
    metric: 'Faktor Engagement',
    creatorA: '0.924x',
    creatorB: '1.088x',
    insight: 'Interaksi kukuh menaikkan pengganda CPM Pencipta B.',
  },
  {
    metric: 'Peringkat Wilayah Profil',
    creatorA: 'Tier 3 / Global ($18.00 CPM asas purata)',
    creatorB: 'Tier 1 / AS ($30.00 CPM asas purata)',
    insight: 'Andaian pasaran pengiklanan serantau membezakan CPM asas.',
  },
  {
    metric: 'CPM Model Terlaras',
    creatorA: '$17.96 (Julat: $11.98 – $25.95)',
    creatorB: '$33.29 (Julat: $24.41 – $46.61)',
    insight: 'Interaksi aktif dan pasaran serantau hampir menggandakan CPM.',
  },
  {
    metric: 'Anggaran Nilai Tajaan',
    creatorA: '$143.68 per video ($95.84 – $207.60)',
    creatorB: '$2,163.85 per video ($1,586.65 – $3,029.65)',
    insight: 'Tontonan sebenar dan engagement memacu anggaran lebih tinggi.',
    highlight: true,
  },
];

const faqItems = [
  {
    id: 'faq-1',
    question: '1. Apakah yang dianggarkan oleh kalkulator wang TikTok?',
    schemaAnswer:
      'Kalkulator wang TikTok seperti KalkulatorTik menganggarkan potensi pendapatan tajaan jenama komersial untuk satu video bertajaan pada profil TikTok awam, dalam mata wang USD berdasarkan capaian, kadar engagement dan penanda aras CPM serantau.',
    answer: (
      <p>
        Kalkulator wang TikTok seperti <strong>KalkulatorTik</strong> menganggarkan{' '}
        <strong>potensi pendapatan tajaan jenama komersial untuk satu video bertajaan</strong> pada profil awam. Selain
        daripada mengandaikan bayaran iklan aplikasi, ia menyediakan penanda aras utama dalam USD per video serta julat
        rendah-ke-tinggi berdasarkan capaian awam, kadar engagement dan CPM serantau.
      </p>
    ),
  },
  {
    id: 'faq-2',
    question: '2. Adakah anggaran ini sama dengan bayaran TikTok Creator Rewards?',
    schemaAnswer:
      'Tidak. Tajaan jenama dan Program TikTok Creator Rewards ialah sumber pendapatan yang berasingan. Creator Rewards membayar terus oleh TikTok bagi tontonan layak pada video asli 1+ minit (memerlukan 10,000 pengikut, 100,000 tontonan dalam 30 hari, umur 18+ atau 19+ di Korea Selatan, akaun baik dan wilayah layak). Kalkulator kami menganggarkan kadar tajaan jenama swasta.',
    answer: (
      <p>
        <strong>Tidak.</strong> Tajaan jenama dan Program TikTok Creator Rewards ialah aliran pendapatan berbeza. Creator
        Rewards membayar pencipta terus daripada TikTok bagi video asli <code>1+ minit</code> dan memerlukan sekurang-kurangnya{' '}
        <code>10,000</code> pengikut, <code>100,000</code> tontonan dalam 30 hari lalu, umur <code>18+</code> (atau{' '}
        <code>19+</code> di Korea Selatan), reputasi akaun baik dan negara layak. Kalkulator ini menganggarkan{' '}
        <strong>yuran tajaan jenama swasta</strong> tanpa had minimum pengikut tetap.
      </p>
    ),
  },
  {
    id: 'faq-3',
    question: '3. Bagaimanakah anggaran tajaan TikTok dikira di KalkulatorTik?',
    schemaAnswer:
      'Kalkulator kami membahagikan Purata Tontonan Video profil dengan 1,000 dan mendarabkannya dengan CPM Terlaras. Bermula daripada julat CPM serantau dalaman ($12–$42 bagi Tier 1–Tier 3 dengan asas pertengahan $18–$30), ia menggunakan pengganda engagement (0.90x–1.20x) dan skala pengikut (1.00x–1.18x), dihadkan antara $7.00 dan $80.00.',
    answer: (
      <p>
        Kalkulator kami membahagikan <strong>Purata Tontonan Video</strong> profil dengan <code>1,000</code> dan
        mendarabkannya dengan <strong>CPM Terlaras (Kos per Seribu)</strong>. Bermula daripada julat CPM serantau
        dalaman (<code>$12&ndash;$42</code> bagi Tier 1&ndash;Tier 3, asas pertengahan <code>$18&ndash;$30</code>),
        model ini menggunakan pengganda engagement (<code>0.90x</code> hingga <code>1.20x</code>) dan skala pengikut
        (<code>1.00x</code> hingga <code>1.18x</code>) dengan had antara <code>$7.00</code> hingga <code>$80.00</code>.
      </p>
    ),
  },
  {
    id: 'faq-4',
    question: '4. Adakah pengikut atau tontonan video lebih penting untuk kadar tajaan?',
    schemaAnswer:
      'Purata tontonan video lazimnya lebih penting untuk menetapkan harga satu video bertajaan kerana tontonan menunjukkan jumlah penonton sebenar yang dijangka. Akaun lebih kecil dengan tontonan konsisten tinggi biasanya mengatasi akaun besar yang rendah tontonan terkininya.',
    answer: (
      <p>
        <strong>Purata tontonan video lazimnya lebih utama</strong> untuk kadar satu video bertajaan kerana ia
        menggambarkan jumlah orang yang berpotensi menonton kandungan tersebut. Bilangan pengikut kekal memberi bukti
        sosial, namun tontonan konsisten lebih menentukan.
      </p>
    ),
  },
  {
    id: 'faq-5',
    question: '5. Bolehkah mengira anggaran tajaan hanya menggunakan nama pengguna TikTok?',
    schemaAnswer:
      'Ya. Sebagai kalkulator wang TikTok mengikut nama pengguna, anda hanya perlukan @handle bagi mana-mana akaun awam untuk menarik metrik awam dan mengira anggaran per video.',
    answer: (
      <p>
        <strong>Ya.</strong> Anda hanya perlukan handle (dengan atau tanpa simbol <code>@</code>) bagi sebarang profil{' '}
        <strong>Awam</strong>. Alat ini menarik statistik awam dan metrik video terkini secara automatik.
      </p>
    ),
  },
  {
    id: 'faq-6',
    question: '6. Adakah kalkulator memerlukan kata laluan atau log masuk akaun TikTok?',
    schemaAnswer:
      'Tidak pernah. KalkulatorTik tidak pernah meminta kata laluan, e-mel, kod 2FA atau akses TikTok Studio. Semuanya menggunakan data profil awam. Semak Dasar Privasi kami untuk butiran penuh.',
    answer: (
      <p>
        <strong>Tidak pernah.</strong> KalkulatorTik tidak meminta kata laluan, e-mel, kod pengesahan dua faktor atau
        log masuk TikTok Studio anda. Semak{' '}
        <Link to="/privacy" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Dasar Privasi
        </Link>{' '}
        kami untuk maklumat lanjut.
      </p>
    ),
  },
  {
    id: 'faq-7',
    question: '7. Adakah KalkulatorTik percuma untuk digunakan?',
    schemaAnswer:
      'Ya. KalkulatorTik percuma sepenuhnya dalam talian tanpa langganan atau pendaftaran. Had permintaan pelayan standard dikenakan demi kestabilan. Lihat soalan tambahan di halaman FAQ penuh kami.',
    answer: (
      <p>
        <strong>Ya.</strong> KalkulatorTik percuma digunakan dalam talian tanpa yuran langganan atau kad kredit. Had
        pelayan standard digunakan bagi mencegah penyalahgunaan. Kunjungi{' '}
        <Link to="/faq" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          halaman FAQ penuh
        </Link>{' '}
        kami.
      </p>
    ),
  },
  {
    id: 'faq-8',
    question: '8. Bolehkah profil TikTok peribadi (private) dianalisis?',
    schemaAnswer:
      'Tidak. Hanya maklumat awam boleh diakses. Jika anda mengetahui jumlah angka akaun peribadi secara manual, gunakan Kalkulator Engagement TikTok atau Kalkulator CPM TikTok kami.',
    answer: (
      <p>
        <strong>Tidak.</strong> Hanya data yang kelihatan secara awam boleh diambil. Jika anda tahu angka akaun secara
        manual, uji melalui{' '}
        <Link
          to="/tiktok-engagement-calculator"
          className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800"
        >
          Kalkulator Engagement TikTok
        </Link>{' '}
        atau{' '}
        <Link
          to="/tiktok-cpm-calculator"
          className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800"
        >
          Kalkulator CPM TikTok
        </Link>
        .
      </p>
    ),
  },
  {
    id: 'faq-9',
    question: '9. Mengapakah data profil kadang-kadang tiada apabila saya mencari username?',
    schemaAnswer:
      'Carian boleh gagal sekiranya nama pengguna tersilap eja, ditukar baharu, akaun ditetapkan peribadi atau digantung, atau pelayan TikTok mengehadkan permintaan buat sementara waktu.',
    answer: (
      <p>
        Carian mungkin gagal jika nama pengguna tersilap eja, baru ditukar, akaun ditetapkan sebagai peribadi atau
        digantung, atau pelayan TikTok mengenakan had trafik sementara. Semak ejaan dan cuba lagi selepas beberapa saat.
      </p>
    ),
  },
  {
    id: 'faq-10',
    question: '10. Apa berlaku jika tontonan video terkini tiada bagi profil awam?',
    schemaAnswer:
      'Jika statistik utama profil dimuatkan tetapi senarai tontonan video terkini tiada, KalkulatorTik beralih ke model anggaran sandaran: 8% pengikut bagi 12,500+ (10% antara 10,000 hingga 12,499, minimum 1,000 tontonan di bawahnya) serta anggaran engagement daripada jumlah suka atau nilai lalai tahap pengikut.',
    answer: (
      <p>
        Apabila statistik utama awam dimuatkan tanpa senarai tontonan video terkini, KalkulatorTik bertukar kepada{' '}
        <strong>model anggaran sandaran</strong>: ia menganggarkan tontonan pada <code>8%</code> pengikut untuk{' '}
        <code>12,500+</code> (atau <code>10%</code> antara <code>10,000</code> hingga <code>12,499</code>, minimum{' '}
        <code>1,000</code> tontonan di bawahnya) dan mengira engagement daripada jumlah suka, video serta pengikut.
      </p>
    ),
  },
  {
    id: 'faq-11',
    question: '11. Adakah jumlah anggaran tajaan ini dijamin?',
    schemaAnswer:
      'Tidak. Semua angka di KalkulatorTik ialah penanda aras pendidikan yang tidak mengikat. Bayaran sebenar bergantung pada persetujuan jenama, niche, khalayak dan rundingan kontrak.',
    answer: (
      <p>
        <strong>Tidak.</strong> Semua angka hanyalah penanda aras pendidikan yang tidak mengikat dan bukannya pendapatan
        terjamin atau tawaran rasmi agensi. Nilai sebenar bergantung pada minat jenama, kategori kandungan dan rundingan.
      </p>
    ),
  },
  {
    id: 'faq-12',
    question: '12. Bagaimanakah pencipta boleh menggunakan anggaran ini ketika berunding dengan jenama?',
    schemaAnswer:
      'Jadikan anggaran purata sebagai kadar asas satu video organik bertajaan, minta lebih ke arah had atas untuk Spark Ads, hak penggunaan atau eksklusiviti, dan tawarkan diskaun munasabah untuk pakej berbilang video.',
    answer: (
      <div className="space-y-2">
        <p>
          Anggap nilai purata dan julat sebagai <strong>kadar asas untuk satu video bertajaan organik biasa</strong>:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            Gunakan <strong>anggaran purata</strong> untuk menyemak tawaran jenama agar hasil kerja tidak dijual terlalu
            rendah.
          </li>
          <li>
            Minta menghampiri atau melebihi <strong>had atas</strong> apabila melibatkan Spark Ads, hak pelesenan 30–90
            hari, eksklusiviti atau produksi kompleks.
          </li>
          <li>
            Berikan diskaun sederhana ke arah <strong>had bawah</strong> bagi tempahan pakej 3 atau 5 video.
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
  inLanguage: 'ms',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.schemaAnswer },
  })),
};

const copy = {
  intro: {
    title: 'Apakah Itu Kalkulator Wang TikTok?',
    description:
      'Kalkulator Wang TikTok ialah alat penilaian pencipta yang menganggarkan kadar bayaran video bertajaan bagi profil TikTok awam—serta membantu jenama menilai tawaran yang adil.',
    p1: (
      <>
        Daripada meneka hasil pendapatan kolaborasi jenama, <strong className="font-semibold text-slate-900">kalkulator wang TikTok</strong> ini menilai penunjuk profil awam—termasuk{' '}
        <strong className="font-semibold text-slate-900">purata tontonan video</strong>,{' '}
        <strong className="font-semibold text-slate-900">kadar engagement khalayak</strong>,{' '}
        <strong className="font-semibold text-slate-900">wilayah profil</strong>, dan{' '}
        <strong className="font-semibold text-slate-900">skala pengikut</strong>—untuk menganggarkan kadar tajaan
        satu video dalam USD berserta julat rundingan.
      </>
    ),
    p2: 'Sama ada anda pencipta yang menyediakan kad kadar atau pemasar yang menilai bakal rakan kongsi, KalkulatorTik memberi penanda aras telus daripada mana-mana nama pengguna awam tanpa log masuk atau kata laluan.',
  },
  howToUse: {
    title: 'Cara Menggunakan Kalkulator Wang TikTok',
    description:
      'Kira anggaran pendapatan tajaan TikTok mengikut nama pengguna dalam tiga langkah pantas tanpa log masuk.',
    actionLabel: 'Buka Kalkulator Di Atas \u2191',
    steps: [
      {
        badge: 'LANGKAH 01',
        title: 'Masukkan Nama Pengguna & Kira',
        body: (
          <>
            Masukkan nama pengguna awam di atas (cth. <code>khaby.lame</code> atau <code>@mrbeast</code>)&mdash;simbol{' '}
            <code>@</code> dibuang secara automatik&mdash;dan tekan <strong>Kira Nilai Tajaan</strong>.
          </>
        ),
      },
      {
        badge: 'LANGKAH 02',
        title: 'Semak Profil & Sumber Data',
        body: (
          <>
            Lihat sepanduk status untuk mengetahui sama ada angka diambil daripada{' '}
            <strong>sampel video terkini langsung</strong> atau <strong>mod sandaran profil</strong>, lalu semak nilai,
            CPM dan 6 kad statistik.
          </>
        ),
      },
      {
        badge: 'LANGKAH 03',
        title: 'Gunakan pada Syarat Tawaran',
        body: (
          <>
            <strong>Pencipta:</strong> Jadikan purata sebagai asas siaran organik sebelum menambah Spark Ads atau lesen.{' '}
            <strong>Jenama:</strong> Bandingkan kadar dengan capaian dan kualiti interaksi.
          </>
        ),
      },
    ],
    troubleshootingTitle: 'Penyelesaian Masalah & Muat Semula Cache Manual',
    troubleshootingP1: (
      <>
        <strong className="text-slate-900">Carian Awam &amp; Had Sementara:</strong> Hanya akaun awam dapat dianalisis.
        Jika had trafik TikTok berlaku seketika, tunggu beberapa saat sebelum mencuba lagi.
      </>
    ),
    troubleshootingP2: (
      <>
        <strong className="text-slate-900">Cache 1 Jam &amp; Tarikan Baharu:</strong> Keputusan disimpan hingga 1 jam
        untuk kelajuan. Untuk menarik data terkini segera, guna <strong>Refresh Data</strong> di{' '}
        <Link to="/calculator" className="font-semibold text-teal-700 underline underline-offset-2">
          Paparan Muat Semula Cache Berasingan
        </Link>
        .
      </>
    ),
    footerNote: 'Di bawah ini, setiap kad penilaian dan enam metrik profil awam diterangkan secara terperinci.',
  },
  results: {
    title: 'Prestasi Profil & Anggaran Nilai Tajaan',
    description:
      'Setiap carian menukar isyarat profil awam kepada pecahan anggaran kadar tajaan untuk satu video bertajaan.',
    primaryEyebrow: 'Output Penilaian Utama',
    usdBadge: 'Penanda Aras USD',
    primaryTitle: 'Anggaran Nilai Tajaan Setiap Video',
    primaryLead: (
      <>
        Angka dolar utama menunjukkan{' '}
        <strong className="font-semibold text-slate-900">kadar asas anggaran bagi satu video bertajaan</strong>,
        dilengkapi dua angka rujukan tambahan:
      </>
    ),
    rangeTitle: 'Julat Anggaran Tajaan',
    rangeBody:
      'Sebutan ringkas atau pakej berbilang video sering berada di bahagian bawah; niche kompetitif atau tugasan tambahan menuju bahagian atas.',
    cpmTitle: 'Penanda Aras CPM Model',
    cpmBody:
      'Anggaran kadar kasar pengiklan bagi setiap 1,000 tontonan selepas pelarasan wilayah, engagement dan skala pengikut.',
    cacheNote: 'Nilai mencerminkan data awam semasa carian (atau cache sehingga 1 jam).',
    profileOverviewTitle: 'Gambaran Profil Awam',
    profileOverviewBadge: 'Isyarat Identiti',
    profileOverviewBody: (
      <>
        Memaparkan butiran awam yang tersedia&mdash;nama paparan, <code>@handle</code>, lencana disahkan TikTok, bio
        awam, kod wilayah (jika terdedah), ID TikTok dan tarikh akaun dicipta.
      </>
    ),
    metricsTitle: 'Gambaran Akaun & Penanda Aras Aktiviti',
    metricsBadge: '6 Penunjuk Awam',
    howToReadTitle: 'Cara Membaca Keputusan Kalkulator Anda',
    howToReadBody: (
      <>
        Anggap keputusan ini sebagai titik permulaan rundingan yang praktikal&mdash;bukan harga tetap atau pendapatan
        terjamin. <strong className="text-slate-900">Pencipta</strong> boleh menambah caj hak penggunaan atau
        eksklusiviti; <strong className="text-slate-900">jenama</strong> dapat menyemak keselarasan harga dengan capaian
        dan interaksi sebenar.
      </>
    ),
    limitationsBadge: 'Had Anggaran',
    limitationsBody:
      'Keputusan ini bergantung sepenuhnya pada data profil awam dan tidak memeriksa analitik peribadi TikTok Studio, umur penonton atau kadar tontonan penuh. Jika tontonan terkini tiada, model sandaran akan digunakan.',
  },
  calculation: {
    title: 'Bagaimana Kalkulator Wang TikTok Menganggarkan Nilai Tajaan',
    description:
      'KalkulatorTik menggunakan model pengiraan langkah demi langkah yang telus untuk menganggar kadar video bertajaan.',
    eqBadge: 'Persamaan Penilaian Teras',
    eqTitle: 'Rumus Teras Penilaian Tajaan',
    eqBody:
      'Berasaskan Kos per Seribu (CPM) bagi setiap 1,000 tontonan video. Pengiraan CPM terlaras min, purata dan maks menghasilkan kedua-dua penanda aras serta julatnya.',
    eqPart1: 'Purata Tontonan Video \u00F7 1,000',
    eqPart2: 'CPM Terlaras',
    eqPart3: 'Anggaran Kadar Video',
    step1Title: 'Langkah 1: Mengira Purata Tontonan Video dan Kadar Engagement',
    step1Desc:
      'Apabila nama pengguna awam dicari, alat ini memeriksa sehingga 30 video awam terkini yang melaporkan tontonan:',
    avgViewsTitle: 'Purata Tontonan Video',
    avgViewsDesc: 'Mengira purata aritmetik ringkas daripada video awam terkini (> 0 tontonan):',
    avgViewsFormula: 'Purata Tontonan = Jumlah Tontonan Terkini \u00F7 Video Dianalisis',
    engTitle: 'Kadar Engagement',
    engDesc: 'Mengukur jumlah interaksi awam berbanding jumlah tontonan sampel tersebut:',
    engFormula: 'Engagement (%) = ((Suka + Komen + Kongsi) \u00F7 Tontonan) \u00D7 100',
    step2Title: 'Langkah 2: Memilih Peringkat CPM Asas (Andaian Model)',
    step2Desc:
      'Berdasarkan kod wilayah profil, KalkulatorTik memilih julat CPM asas USD awal (lalai kepada Tier 3 jika tiada wilayah):',
    tableCaption: 'Andaian CPM asas dalaman KalkulatorTik (USD setiap 1,000 tontonan).',
    thTier: 'Peringkat Pasaran',
    thCountries: 'Kod Wilayah Profil',
    thMin: 'Asas Min',
    thAvg: 'Asas Purata',
    thMax: 'Asas Maks',
    step2Note: (
      <>
        <strong>Nota Metodologi:</strong> Peringkat CPM ini ialah andaian penanda aras dalaman&mdash;bukan kadar
        rasmi TikTok atau jaminan purata pasaran.
      </>
    ),
    step3Title: 'Langkah 3: Menggunakan Pengganda Engagement dan Skala Pengikut',
    step3Desc: (
      <>
        Dua pengganda melaras CPM awal sebelum dihadkan antara <strong>$7.00</strong> hingga <strong>$80.00</strong>{' '}
        setiap 1,000 tontonan:
      </>
    ),
    engAdjTitle: (
      <>
        Pelarasan Engagement (<code>0.90x&ndash;1.20x</code>)
      </>
    ),
    engAdjBody: (
      <>
        Melaras secara linear daripada <code>0%</code> (<code>0.90x</code>) melalui titik neutral <code>5.0%</code> (
        <code>1.00x</code>) sehingga had <code>1.20x</code> bagi <code>15%+</code> engagement.
      </>
    ),
    engAdjBox1: '0% = 0.90x · 5.0% = 1.00x (Neutral)',
    engAdjBox2: '7.5% = 1.05x · 15%+ = 1.20x (Had)',
    scaleTitle: (
      <>
        Skala Pengikut (<code>1.00x&ndash;1.18x</code>)
      </>
    ),
    scaleSub: 'Skala bukti sosial menaik sahaja (pencipta kecil tidak pernah didenda):',
    boundsTitle: (
      <>
        Had Bawah &amp; Atas CPM (<code>$7.00&ndash;$80.00</code>)
      </>
    ),
    boundsBody: (
      <>
        Setiap nilai CPM Rendah, Purata dan Tinggi didarabkan dan dihadkan antara <code>$7.00</code> hingga{' '}
        <code>$80.00</code>.
      </>
    ),
    boundsBox: 'CPM Terlaras = Asas × Eng × Skala (Had $7–$80)',
    fallbackTitle: 'Anggaran Sandaran Apabila Tontonan Video Terkini Tiada',
    fallbackViews: (
      <>
        <strong className="text-slate-900">Purata Tontonan Sandaran:</strong> Dianggarkan pada <code>8%</code> pengikut
        bagi <code>12,500+</code> pengikut, <code>10%</code> antara <code>10,000</code> hingga <code>12,499</code>, dan
        paras minimum <code>1,000</code> tontonan di bawahnya.
      </>
    ),
    fallbackEng: (
      <>
        <strong className="text-slate-900">Kadar Engagement Sandaran:</strong> Diperoleh daripada jumlah suka dibahagi
        video dan pengikut (<code>1.0%–50.0%</code>), atau nilai lalai mengikut tahap pengikut.
      </>
    ),
    exampleBadge: 'Contoh Model Hipotetis',
    exampleTitle: 'Contoh Kerja: Mengira Penanda Aras Tajaan Pencipta',
    exampleTag: 'Profil Sampel',
    exRegionLabel: 'Wilayah Profil',
    exRegionVal: 'AS (Tier 1)',
    exFollowersLabel: 'Pengikut',
    exFollowersSub: 'Skala = 1.08x',
    exViewsLabel: 'Purata Tontonan',
    exViewsVal: '50,000 / video',
    exViewsSub: '50.0 unit tontonan',
    exEngLabel: 'Kadar Engagement',
    exEngSub: 'Faktor = 1.08x',
    exStep1: '1. Engagement Ternormal:',
    exStep2: '2. Faktor Engagement:',
    exStep3: '3. Pengganda Gabungan:',
    exStep4Label: '4. Julat CPM Terlaras:',
    exStep4Min: 'Min',
    exStep4Avg: 'Purata',
    exStep4Max: 'Maks',
    exStep4Tag: '$34.99 purata',
    exStep5Title: '5. Penanda Aras Akhir (50 × $34.99)',
    exPerVideo: 'setiap video bertajaan',
    exRange: 'Julat: $1,283.00 – $2,449.50',
    exFooterNote: 'Contoh ilustrasi sahaja; tidak menyemak demografi peribadi atau kadar penukaran.',
    transitionNote:
      'Oleh sebab model ini menganggar bayaran pengiklan luar per video, peranannya berbeza daripada ganjaran langsung dalam aplikasi TikTok.',
  },
  channels: {
    title: 'Tajaan Jenama vs. TikTok Creator Rewards: Apakah Perbezaannya?',
    description:
      'Perjanjian komersial jenama dan Program Rasmi TikTok Creator Rewards datang daripada pembayar berlainan dengan syarat tersendiri.',
    leftBadge: 'Dianggarkan oleh Kalkulator Ini',
    leftTitle: 'Cara Tajaan Jenama dan Video Bertajaan Berfungsi',
    leftLead: (
      <>
        Perjanjian komersial peribadi apabila syarikat atau agensi membayar pencipta untuk memaparkan produk dalam{' '}
        <strong>video bertajaan</strong>.
      </>
    ),
    leftItems: [
      ['Pembayar', 'Jenama luar, syarikat atau agensi terus melalui invois atau pindahan wang.'],
      ['Penetapan Harga', 'Dirunding setiap video atau pakej berdasarkan capaian, niche, produksi dan lesen.'],
      ['Kelayakan', 'Terbuka kepada mana-mana pencipta—termasuk pencipta nano bawah 10,000 pengikut.'],
    ],
    rightBadge: 'Program Dalam Aplikasi',
    rightTitle: 'Cara Program TikTok Creator Rewards Berfungsi',
    rightLead: 'Bayaran terus yang diurus oleh TikTok (menggantikan Creator Fund) melalui baki dalam aplikasi.',
    rightItems: [
      ['Pembayar', 'TikTok mengagihkan bayaran terus mengikut terma rasmi platform.'],
      [
        'Kelayakan',
        <>
          Memerlukan <code>10,000+</code> pengikut, <code>100,000+</code> tontonan 30 hari, umur <code>18+</code> (
          <code>19+</code> di Korea Selatan), akaun baik dan wilayah layak.
        </>,
      ],
      [
        'Peraturan Bayaran',
        <>
          Terpakai hanya untuk video asli <code>1+ minit</code> dengan <strong>tontonan layak</strong> dan RPM dinamik.
        </>,
      ],
      ['Ciri Lain', 'Hadiah LIVE dan komisen TikTok Shop mengikuti dasar berasingan.'],
    ],
    compareTitle: 'Perbandingan Sebelah-Menyebelah: Tajaan Jenama vs. Monetisasi Platform',
    tableCaption: 'Perbezaan utama antara tajaan jenama komersial dan bayaran rasmi TikTok.',
    thFeature: 'Ciri',
    thSponsor: 'Tajaan Jenama (Video Bertajaan)',
    thRewards: 'TikTok Creator Rewards (Platform)',
    whyTitle: 'Mengapa Anggaran Tajaan Bukan Bayaran Terus TikTok',
    whyBody:
      'Metrik Creator Rewards tersimpan secara tertutup dalam TikTok Studio. Tambahan pula, tajaan jenama membayar kos produksi tersuai dan promosi produk.',
    whyFootnote: 'Peraturan, negara layak dan syarat Creator Rewards ditetapkan sepenuhnya oleh TikTok.',
  },
  factors: {
    title: 'Apakah yang Mempengaruhi Kadar Tajaan TikTok?',
    description:
      'Dua akaun dengan tontonan hampir sama boleh mengenakan bayaran berbeza mengikut niche dan syarat penggunaan.',
    measuredTitle: 'Diukur Automatik dalam Rumus Kalkulator',
    measuredBadge: '4 Isyarat Awam',
    measuredBody: (
      <>
        Penganggar sudah menggabungkan <strong>Purata Tontonan Video</strong>, <strong>Kadar Engagement</strong>,{' '}
        <strong>Wilayah</strong> dan <strong>Skala Pengikut</strong> sebelum pelarasan rundingan.
      </>
    ),
    unmeasuredTitle: 'Faktor Rundingan Dunia Sebenar Tidak Diukur Kalkulator',
    unmeasuredBadge: 'Dirunding Secara Peribadi',
    adjustTitle: 'Cara Menyelaras Sebut Harga Mengikut Syarat Kempen',
    adjustBody: (
      <>
        Jadikan keputusan kalkulator sebagai <strong>kadar asas satu siaran tajaan organik</strong>, kemudian tambah
        item caj berasingan untuk Spark Ads, tempoh lesen, eksklusiviti atau rakaman khas.
      </>
    ),
  },
  followersVsViews: {
    title: 'Pengikut vs. Tontonan Video: Mana Lebih Penting untuk Tajaan TikTok?',
    description:
      'Suapan For You TikTok menyebarkan kandungan mengikut minat penonton dan tontonan penuh. Akaun besar yang pasif berbeza jauh capaiannya daripada akaun sederhana yang aktif.',
    creatorATag: 'Pencipta Hipotetis A · Akaun Besar Kurang Aktif',
    creatorAPrice: '$143.68 / video',
    creatorABody: (
      <>
        Mempunyai <strong>500,000 pengikut</strong> daripada trend lama, tetapi video terkini purata{' '}
        <strong>8,000 tontonan</strong> dengan <code>1.20%</code> engagement (Tier 3).
      </>
    ),
    creatorBTag: 'Pencipta Hipotetis B · Capaian Aktif Tinggi',
    creatorBPrice: '$2,163.85 / video',
    creatorBBody: (
      <>
        Saluran niche dengan <strong>50,000 pengikut</strong> yang meraih <strong>65,000 purata tontonan</strong> dan{' '}
        <code>9.40%</code> engagement (Tier 1).
      </>
    ),
    labelFollowers: 'Pengikut',
    labelViews: 'Purata Tontonan per Video',
    compareTitle: 'Perbandingan Model: Pengikut Ramai vs. Tontonan Konsisten',
    compareCaption: 'Perbandingan hipotetis menggunakan rumus penilaian KalkulatorTik.',
    thMetric: 'Metrik / Langkah',
    thCreatorA: 'Pencipta A (500K Pengikut)',
    thCreatorB: 'Pencipta B (50K Pengikut)',
    thWhy: 'Mengapa Penting',
    tier3Note:
      'Nota: Malah dalam pasaran Tier 3 sama ($18.00 CPM asas), 65,000 tontonan dan 9.40% engagement Pencipta B menghasilkan $1,298.70 per video—9× lebih tinggi daripada Pencipta A.',
    stillMattersTitle: 'Bilakah Jumlah Pengikut Masih Penting',
    stillMattersList: [
      <>
        <strong>Persepsi Jenama &amp; Bukti Sosial:</strong> Sesetengah pengiklan menapis mengikut penanda aras
        pengikut.
      </>,
      <>
        <strong>Keakraban Komuniti:</strong> Penonton setia daripada tab Mengikuti lebih mempercayai syor produk.
      </>,
      <>
        <strong>Kelayakan Ciri Platform:</strong> Had pengikut membuka siaran LIVE dan program rasmi.
      </>,
    ],
    rateCardTitle: 'Membina Kad Kadar Pencipta yang Seimbang',
    rateCardBody: (
      <>
        Utamakan <strong>purata tontonan terkini</strong>, <strong>kadar engagement</strong> dan contoh retensi tinggi
        dalam kit media anda. Tontonan terkini menggambarkan capaian komersial semasa.
      </>
    ),
    rateCardPrompt: 'Sedia menyemak akaun anda sendiri?',
    rateCardBtn: 'Semak Penanda Aras Profil \u2191',
  },
  relatedTools: {
    title: 'Terokai Lagi Kalkulator TikTok Percuma',
    description:
      'Gandingkan penilaian tajaan dengan pengiraan kos iklan CPM serta audit interaksi manual melalui alat khusus kami.',
    tool1Tag: 'Audit Interaksi Pengikut',
    tool1Badge: 'Input Manual',
    tool1Title: 'Kalkulator Kadar Engagement TikTok',
    tool1Desc: (
      <>
        Mengira purata interaksi suka per video daripada <strong>Jumlah Suka</strong>, <strong>Jumlah Video</strong>{' '}
        dan <strong>Pengikut</strong> (menerima format ringkas seperti <code>277.8K</code> atau <code>4.2M</code>)
        berbanding julat dari <code>1K&ndash;5K</code> hingga <code>1M+</code>.
      </>
    ),
    tool1Formula: '((Jumlah Suka ÷ Jumlah Pengikut) ÷ Jumlah Video) × 100',
    tool1Best: 'Sesuai untuk semakan kesihatan saluran, kit media dan akaun peribadi.',
    tool1Cta: 'Buka Kalkulator Engagement \u2192',
    tool2Tag: 'Matematik Iklan & Kempen',
    tool2Badge: '7 Mata Wang',
    tool2Title: 'Kalkulator CPM TikTok',
    tool2Desc: (
      <>
        Alat perancangan tiga mod merentas <code>USD</code>, <code>EUR</code>, <code>GBP</code>, <code>CAD</code>,{' '}
        <code>AUD</code>, <code>INR</code> dan <code>PKR</code> untuk membandingkan sebut harga pencipta dengan iklan
        berbayar.
      </>
    ),
    tool2Modes: ['Kira CPM', 'Kira Perbelanjaan', 'Kira Impresi'],
    tool2Best: 'Sesuai untuk media buyer, pengurus pemasaran dan pencipta.',
    tool2Cta: 'Buka Kalkulator CPM \u2192',
    refreshTag: 'Paparan Muat Semula Berasingan',
    refreshBadge: 'Termasuk Refresh Cache',
    refreshTitle: 'Carian Profil Muat Semula Cache Manual',
    refreshDesc: (
      <>
        Perlu memintas cache pelayan 1 jam untuk menarik data baharu? Gunakan halaman muat semula khusus dengan kawalan{' '}
        <strong>Refresh Data</strong>.
      </>
    ),
    refreshCta: 'Buka Paparan Cache-Refresh \u2192',
  },
  faq: {
    title: 'Soalan Lazim Kalkulator Wang & Penilaian Tajaan TikTok',
    description:
      'Jawapan terus mengenai metodologi tajaan, privasi data awam, pengendalian sandaran dan rundingan harga.',
    ariaTogglePrefix: 'Buka atau tutup jawapan: ',
    disclaimer:
      'Jawapan mencerminkan metodologi semasa serta amalan pemasaran influencer dan bukan nasihat kewangan, undang-undang atau cukai.',
    viewAllLink: 'Lihat FAQ Monetisasi Penuh \u2192',
  },
  closing: {
    sectionAriaLabel: 'Mulakan pengiraan profil TikTok atau terokai kalkulator berkaitan',
    title: 'Sedia Mengukur Nilai Tajaan TikTok Anda?',
    description:
      'Sama ada merangka kad kadar, menyemak tawaran masuk atau membandingkan CPM kempen, masukkan nama pengguna awam di atas atau buka kalkulator khusus.',
    btnPrimary: 'Kira mengikut Username TikTok \u2191',
    btnCpm: 'Buka Kalkulator CPM',
    btnEng: 'Buka Kalkulator Engagement',
    aboutLine: (
      <>
        KalkulatorTik ialah platform analitik pencipta bebas. Ketahui lebih lanjut di{' '}
        <Link to="/about" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Tentang KalkulatorTik
        </Link>{' '}
        atau rujuk{' '}
        <Link to="/faq" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          FAQ Monetisasi TikTok
        </Link>
        .
      </>
    ),
    legalNotice: (
      <>
        KalkulatorTik ialah alat bebas yang tidak bergabung dengan, tidak disahkan oleh, dan tidak mempunyai kaitan rasmi dengan TikTok Inc. atau ByteDance Ltd.; semua tanda dagangan kekal milik pemilik masing-masing. Anggaran adalah untuk rujukan maklumat—semak{' '}
        <Link to="/privacy" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Dasar Privasi
        </Link>{' '}
        dan{' '}
        <Link to="/terms" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Terma & Syarat
        </Link>
        .
      </>
    ),
  },
};

export const MS_HOME_PACK = {
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
