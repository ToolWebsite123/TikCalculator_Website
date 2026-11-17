import React from 'react';
import Link from '../../components/LocaleLink';

export const ID_HOME_SEO = {
  title: 'Kalkulator Uang TikTok – Perkirakan Penghasilan TikTok Anda',
  description:
    'Perkirakan penghasilan TikTok Anda dengan Kalkulator Uang TikTok gratis kami. Hitung potensi pendapatan dari tayangan, pengikut, interaksi, dan sponsor.',
  ogLocale: 'id_ID',
};

export const ID_ACCOUNT_METRICS_GUIDE = [
  {
    name: 'Pengikut',
    tag: 'Jangkauan Audiens',
    description:
      'Total akun TikTok yang mengikuti kreator. Menunjukkan ukuran audiens dan bukti sosial yang menerapkan pengali skala sekunder.',
  },
  {
    name: 'Total Suka',
    tag: 'Suka Seumur Hidup',
    description: 'Akumulasi tanda suka dari seluruh video publik yang saat ini tersedia di profil.',
  },
  {
    name: 'Total Video',
    tag: 'Video Diunggah',
    description: 'Jumlah keseluruhan video publik yang telah dipublikasikan pada akun tersebut.',
  },
  {
    name: 'Mengikuti',
    tag: 'Akun Diikuti',
    description: 'Jumlah total profil yang diikuti oleh kreator.',
  },
  {
    name: 'Est. Rata-Rata Tayangan',
    tag: 'Tayangan per Video',
    description:
      'Rata-rata tayangan per video dari unggahan publik terbaru, atau diperkirakan dari jumlah pengikut saat data tayangan video terbaru tidak tersedia.',
  },
  {
    name: 'Engagement',
    tag: 'Tingkat Interaksi',
    description:
      'Gabungan suka, komentar, dan bagikan dibagi total tayangan video dari sampel video terbaru (atau diperkirakan dari total suka, video, dan pengikut dalam mode fallback).',
  },
];

export const ID_CPM_TIERS_DATA = [
  {
    tier: 'Pasar Tier 1',
    regions: 'US, CA, UK, GB, AU, NZ, DE',
    min: '$22.00',
    avg: '$30.00',
    max: '$42.00',
    featured: true,
  },
  {
    tier: 'Pasar Tier 2',
    regions: 'FR, ES, IT, PT, BR, MX, SG, NL, BE, SE, NO, DK, FI, IE, CH',
    min: '$16.00',
    avg: '$22.00',
    max: '$32.00',
    featured: false,
  },
  {
    tier: 'Tier 3 / Default Global',
    regions: 'Wilayah lainnya atau saat tidak ada kode wilayah pada profil',
    min: '$12.00',
    avg: '$18.00',
    max: '$26.00',
    featured: false,
  },
];

export const ID_FOLLOWER_SCALE_TIERS = [
  { range: 'Hingga 10.000 pengikut', factor: '1.00x' },
  { range: '10.001 hingga 100.000 pengikut', factor: '1.02x' },
  { range: '100.001 hingga 500.000 pengikut', factor: '1.08x' },
  { range: '500.001 hingga 2.000.000 pengikut', factor: '1.12x' },
  { range: 'Di atas 2.000.000 pengikut', factor: '1.18x' },
];

export const ID_CHANNEL_COMPARISON_ROWS = [
  {
    feature: 'Sumber Pembayaran',
    sponsorships: 'Merek eksternal, pengiklan, atau agensi pemasaran',
    rewards: 'TikTok (ByteDance) langsung melalui saldo kreator di dalam aplikasi',
  },
  {
    feature: 'Metrik Harga / Pembayaran',
    sponsorships: 'Tarif yang dinegosiasikan dengan patokan CPM Sponsor (Biaya per 1.000 Tayangan)',
    rewards: 'RPM platform variabel (Pendapatan per 1.000 Tayangan Memenuhi Syarat) oleh TikTok',
  },
  {
    feature: 'Aturan Durasi Video',
    sponsorships: 'Durasi video apa pun yang disepakati dalam brief sponsor',
    rewards: 'Harus memenuhi batas durasi video minimum dan aturan orisinalitas TikTok',
  },
  {
    feature: 'Batas Minimum Pengikut',
    sponsorships: 'Tidak ada batas minimum wajib; bergantung pada kecocokan merek dan jangkauan',
    rewards: 'Wajib memenuhi syarat pengikut resmi TikTok dan tayangan 30 hari terakhir',
  },
  {
    feature: 'Dimodelkan oleh KalkulatorTik?',
    sponsorships: 'Ya — Dimodelkan oleh Kalkulator Uang TikTok di halaman utama ini',
    rewards: 'Tidak — Memerlukan data internal qualified views dan RPM pribadi',
    isStatusRow: true,
  },
];

export const ID_REAL_WORLD_FACTORS = [
  {
    num: '01',
    title: 'Demografi Audiens Terverifikasi',
    body: 'Kode wilayah profil hanyalah indikator awal. Merek biasanya meminta tangkapan layar TikTok Studio yang memperlihatkan negara penonton, rentang usia, dan proporsi gender.',
  },
  {
    num: '02',
    title: 'Kategori Konten atau Niche',
    body: 'Niche bernilai komersial tinggi—keuangan pribadi, perangkat lunak, B2B, perawatan kulit, kebugaran, dan teknologi—umumnya mematok tarif lebih tinggi dibanding hiburan umum.',
  },
  {
    num: '03',
    title: 'Deliverables & Cakupan Produksi',
    body: 'Penyebutan 15 detik dalam vlog rutin memerlukan usaha produksi lebih ringan dibanding tutorial 60 detik bernaskah dengan pencahayaan studio atau syuting lokasi khusus.',
  },
  {
    num: '04',
    title: 'Hak Penggunaan & Lisensi',
    body: 'Tarif dasar mencakup unggahan organik di feed kreator. Hak unggah ulang di situs web merek, email, atau kanal iklan berbayar memerlukan biaya lisensi tambahan.',
  },
  {
    num: '05',
    title: 'Spark Ads & Amplifikasi Berbayar',
    body: 'Membagikan kode Spark Ads (whitelisting) menempatkan anggaran iklan di balik handle dan figur Anda—biasanya ditagih bulanan dalam periode 30, 60, atau 90 hari.',
  },
  {
    num: '06',
    title: 'Eksklusivitas Kategori',
    body: 'Menyetujui untuk tidak mempromosikan produk pesaing selama periode tertentu membatasi pendapatan sponsor lain sehingga wajar dikenai tarif eksklusivitas.',
  },
  {
    num: '07',
    title: 'Paket Kampanye Multi-Video',
    body: 'Menyepakati tiga hingga lima video sponsor dalam satu kuartal sering kali menghadirkan diskon paket per video demi nilai kontrak total yang lebih besar.',
  },
  {
    num: '08',
    title: 'Waktu & Daya Tawar Negosiasi',
    body: 'Musim belanja puncak, tenggat produksi ketat, tingginya permintaan kreator, serta riwayat konversi kampanye sebelumnya kerap memengaruhi harga kontrak akhir.',
  },
];

export const ID_CREATOR_COMPARISON_ROWS = [
  {
    metric: 'Total Pengikut',
    creatorA: '500.000 pengikut',
    creatorB: '50.000 pengikut',
    insight: 'Kreator A memiliki 10× lebih banyak pengikut dibanding Kreator B.',
  },
  {
    metric: 'Faktor Skala Pengikut',
    creatorA: '1.08x (tingkat >100K)',
    creatorB: '1.02x (tingkat >10K)',
    insight: 'Kreator A memperoleh pengali skala pengikut lebih besar.',
  },
  {
    metric: 'Rata-Rata Tayangan Video',
    creatorA: '8.000 tayangan per video',
    creatorB: '65.000 tayangan per video',
    insight: 'Kreator B menghasilkan lebih dari 8× lipat tayangan video per unggahan.',
  },
  {
    metric: 'Tingkat Engagement',
    creatorA: '1,20% tingkat interaksi',
    creatorB: '9,40% tingkat interaksi',
    insight: 'Penonton Kreator B aktif menyukai, berkomentar, dan membagikan video.',
  },
  {
    metric: 'Faktor Engagement',
    creatorA: '0.924x',
    creatorB: '1.088x',
    insight: 'Engagement kuat meningkatkan pengali CPM Kreator B.',
  },
  {
    metric: 'Tingkat Wilayah Profil',
    creatorA: 'Tier 3 / Global ($18.00 CPM dasar rata-rata)',
    creatorB: 'Tier 1 / AS ($30.00 CPM dasar rata-rata)',
    insight: 'Asumsi pasar iklan regional memisahkan CPM dasar lebih jauh.',
  },
  {
    metric: 'CPM Model Disesuaikan',
    creatorA: '$17.96 (Rentang: $11.98 – $25.95)',
    creatorB: '$33.29 (Rentang: $24.41 – $46.61)',
    insight: 'Engagement aktif dan tingkat pasar hampir menggandakan CPM.',
  },
  {
    metric: 'Perkiraan Nilai Sponsor',
    creatorA: '$143.68 per video ($95.84 – $207.60)',
    creatorB: '$2,163.85 per video ($1,586.65 – $3,029.65)',
    insight: 'Tayangan nyata dan engagement mendorong perkiraan lebih tinggi.',
    highlight: true,
  },
];

export const ID_FAQ_ITEMS = [
  {
    id: 'faq-1',
    question: '1. Apa yang diperkirakan oleh kalkulator uang TikTok?',
    schemaAnswer:
      'Kalkulator uang TikTok seperti KalkulatorTik memperkirakan potensi pendapatan sponsor merek komersial untuk satu video bersponsor pada profil TikTok publik. Alih-alih berfungsi sebagai kalkulator bagi hasil iklan bawaan aplikasi, alat ini memberikan patokan dolar AS per video beserta rentang estimasi terendah hingga tertinggi yang mungkin ditawarkan pengiklan atau agensi berdasarkan jangkauan publik, tingkat engagement, dan patokan CPM regional.',
    answer: (
      <p>
        Kalkulator uang TikTok seperti <strong>KalkulatorTik</strong> memperkirakan{' '}
        <strong>potensi pendapatan sponsor merek komersial untuk satu video bersponsor</strong> pada profil TikTok
        publik. Alih-alih berfungsi sebagai kalkulator pendapatan umum untuk bagi hasil iklan dalam aplikasi, alat ini
        memberikan patokan utama dalam Dolar AS per video serta rentang estimasi rendah-ke-tinggi yang mencerminkan
        nilai kerja sama dari pengiklan atau agensi berdasarkan jangkauan publik, tingkat engagement, dan patokan CPM
        regional.
      </p>
    ),
  },
  {
    id: 'faq-2',
    question: '2. Apakah perkiraan ini sama dengan pembayaran TikTok Creator Rewards?',
    schemaAnswer:
      'Tidak. Sponsor merek dan Program TikTok Creator Rewards adalah dua sumber pendapatan yang sepenuhnya berbeda. Creator Rewards membayar kreator yang memenuhi syarat langsung dari TikTok berdasarkan qualified views pada video orisinal berdurasi 1+ menit dengan tarif RPM dinamis TikTok, serta mensyaratkan minimal 10.000 pengikut, 100.000 tayangan video dalam 30 hari terakhir, usia 18+ (atau 19+ di Korea Selatan), reputasi akun baik, dan berlokasi di wilayah yang memenuhi syarat. Kalkulator beranda kami memperkirakan tarif sponsor merek swasta yang dinegosiasikan langsung dengan pengiklan tanpa syarat minimum pengikut tetap.',
    answer: (
      <p>
        <strong>Tidak.</strong> Sponsor merek dan Program TikTok Creator Rewards adalah dua sumber pendapatan yang
        sepenuhnya berbeda. Creator Rewards membayar kreator langsung dari TikTok berdasarkan qualified views pada video
        orisinal <code>1+ menit</code> dengan tarif RPM dinamis TikTok, serta mensyaratkan minimal <code>10.000</code>{' '}
        pengikut, <code>100.000</code> tayangan video dalam 30 hari terakhir, usia <code>18+</code> (atau{' '}
        <code>19+</code> di Korea Selatan), status akun baik, dan berada di wilayah yang didukung. Kalkulator beranda
        kami memperkirakan <strong>tarif sponsor merek swasta</strong> yang dinegosiasikan langsung dengan pengiklan
        tanpa batas minimum pengikut yang kaku.
      </p>
    ),
  },
  {
    id: 'faq-3',
    question: '3. Bagaimana perkiraan sponsor TikTok dihitung di KalkulatorTik?',
    schemaAnswer:
      'Kalkulator kami membagi Rata-Rata Tayangan Video profil dengan 1.000 lalu mengalikannya dengan CPM Disesuaikan (Cost Per Mille). Dimulai dari rentang CPM regional internal kami ($12–$42 pada rentang rendah-ke-tinggi Tier 1–Tier 3, dengan baseline tengah $18–$30), model menerapkan pengali engagement (0.90x hingga 1.20x) dan peningkatan skala pengikut (1.00x hingga 1.18x), lalu membatasi CPM akhir antara $7.00 dan $80.00.',
    answer: (
      <p>
        Kalkulator kami membagi <strong>Rata-Rata Tayangan Video</strong> profil dengan <code>1.000</code> lalu
        mengalikannya dengan <strong>CPM Disesuaikan (Cost Per Mille)</strong>. Dimulai dari rentang CPM regional
        internal kami (<code>$12&ndash;$42</code> pada rentang rendah-ke-tinggi Tier 1&ndash;Tier 3, dengan baseline
        tengah <code>$18&ndash;$30</code>), model menerapkan pengali engagement (<code>0.90x</code> hingga{' '}
        <code>1.20x</code>) dan peningkatan skala pengikut (<code>1.00x</code> hingga <code>1.18x</code>), lalu
        membatasi CPM akhir antara <code>$7.00</code> dan <code>$80.00</code>.
      </p>
    ),
  },
  {
    id: 'faq-4',
    question: '4. Mana yang lebih penting untuk tarif sponsor: pengikut atau tayangan video?',
    schemaAnswer:
      'Rata-rata tayangan video biasanya lebih berpengaruh untuk penetapan harga sponsor satu video karena tayangan menunjukkan seberapa banyak orang yang kemungkinan menonton unggahan bersponsor. Jumlah pengikut tetap memberi bukti sosial yang berguna dan menambah sedikit pengali skala dalam model kami, tetapi akun dengan lebih sedikit pengikut namun tayangan tinggi yang konsisten umumnya meraih patokan sponsor lebih tinggi dibanding akun besar dengan tayangan terbaru yang rendah.',
    answer: (
      <p>
        <strong>Rata-rata tayangan video biasanya lebih berpengaruh</strong> untuk harga sponsor satu video karena
        tayangan menggambarkan jumlah penonton nyata yang kemungkinan menyaksikan video bersponsor. Jumlah pengikut tetap
        memberi bukti sosial dan sedikit penyesuaian skala pada model kami, tetapi akun dengan pengikut lebih sedikit
        namun tayangan konsisten tinggi umumnya memperoleh patokan sponsor lebih besar dibanding akun besar dengan
        tayangan terbaru rendah.
      </p>
    ),
  },
  {
    id: 'faq-5',
    question: '5. Bisakah menghitung perkiraan penghasilan sponsor hanya dengan username TikTok?',
    schemaAnswer:
      'Ya. Karena KalkulatorTik berfungsi sebagai kalkulator uang TikTok berdasarkan username, Anda hanya membutuhkan handle kreator (dengan atau tanpa simbol @) untuk akun Publik mana pun. Alat ini otomatis mengambil statistik profil publik serta metrik video terbaru yang dibutuhkan untuk menghitung perkiraan pendapatan sponsor per video.',
    answer: (
      <p>
        <strong>Ya.</strong> Karena KalkulatorTik berfungsi sebagai{' '}
        <strong>kalkulator uang TikTok berdasarkan username</strong>, Anda cukup memasukkan handle kreator (dengan atau
        tanpa simbol <code>@</code>) untuk akun <strong>Publik</strong> mana saja. Alat ini otomatis mengambil statistik
        profil publik dan metrik video terbaru yang diperlukan untuk menghitung perkiraan pendapatan sponsor per video.
      </p>
    ),
  },
  {
    id: 'faq-6',
    question: '6. Apakah kalkulator meminta kata sandi atau login akun TikTok?',
    schemaAnswer:
      'Tidak pernah. KalkulatorTik tidak pernah meminta kata sandi TikTok, alamat email, kode autentikasi dua faktor, maupun akses login TikTok Studio Anda. Semuanya berjalan berdasarkan data profil publik. Demi keamanan akun Anda, jangan pernah membagikan kata sandi TikTok ke situs kalkulator pihak ketiga mana pun, dan baca Kebijakan Privasi kami untuk detail pengelolaan data.',
    answer: (
      <p>
        <strong>Tidak pernah.</strong> KalkulatorTik tidak meminta kata sandi TikTok, alamat email, kode autentikasi dua
        faktor, atau akses login TikTok Studio Anda. Semuanya berjalan di atas data profil publik. Demi keamanan akun
        Anda, jangan pernah membagikan kata sandi TikTok ke situs kalkulator pihak ketiga mana pun, dan pelajari{' '}
        <Link
          to="/privacy"
          className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800"
        >
          Kebijakan Privasi
        </Link>{' '}
        kami untuk detail pengelolaan data.
      </p>
    ),
  },
  {
    id: 'faq-7',
    question: '7. Apakah KalkulatorTik gratis digunakan?',
    schemaAnswer:
      'Ya. KalkulatorTik gratis digunakan secara online tanpa biaya langganan, kartu kredit, atau keharusan mendaftar akun. Pembatasan laju server standar diterapkan untuk mencegah penyalahgunaan otomatis dan menjaga layanan tetap responsif bagi semua pengunjung. Untuk pertanyaan tambahan seputar kebijakan platform, kunjungi halaman FAQ lengkap kami.',
    answer: (
      <p>
        <strong>Ya.</strong> KalkulatorTik gratis diakses secara online tanpa biaya berlangganan, kartu kredit, atau
        kewajiban pendaftaran akun. Batasan permintaan server standar berlaku untuk mencegah penyalahgunaan otomatis dan
        menjaga layanan tetap cepat bagi seluruh pengunjung. Untuk pertanyaan tambahan mengenai aturan platform, kunjungi{' '}
        <Link
          to="/faq"
          className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800"
        >
          halaman FAQ lengkap
        </Link>{' '}
        kami.
      </p>
    ),
  },
  {
    id: 'faq-8',
    question: '8. Bisakah profil TikTok privat dianalisis?',
    schemaAnswer:
      'Tidak. KalkulatorTik hanya mengakses informasi yang terlihat secara publik di TikTok. Jika suatu akun disetel ke Privat, metrik pengikut dan videonya dibatasi sehingga kalkulator tidak dapat mengambil data atau menghasilkan estimasi berbasis profil. Jika Anda mengetahui total angka akun privat secara manual, Anda tetap bisa mengujinya melalui Kalkulator Engagement TikTok atau Kalkulator CPM TikTok kami.',
    answer: (
      <p>
        <strong>Tidak.</strong> KalkulatorTik hanya mengakses informasi yang tersedia secara publik di TikTok. Jika akun
        bersifat Privat, statistik pengikut serta videonya dibatasi sehingga kalkulator tidak dapat mengambil data atau
        menghasilkan estimasi profil. Bila Anda mengetahui angka total akun secara manual, Anda tetap bisa menghitungnya
        lewat{' '}
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
    question: '9. Mengapa data profil kadang tidak tersedia saat saya mencari username?',
    schemaAnswer:
      'Pencarian dapat gagal jika username salah ketik, kreator baru saja mengganti handle, akun bersifat privat atau ditangguhkan, atau server TikTok membatasi permintaan otomatis sementara pada jam trafik tinggi. Periksa kembali ejaan handle, pastikan profil bersifat publik, lalu tunggu beberapa detik sebelum mencoba lagi jika terjadi gangguan jaringan sementara.',
    answer: (
      <p>
        Pencarian bisa gagal bila nama pengguna salah ketik, kreator baru saja mengganti handle, akun disetel privat
        atau ditangguhkan, maupun saat server TikTok membatasi permintaan otomatis sementara ketika trafik padat.
        Periksa ulang ejaan handle, pastikan profil bersifat publik, dan tunggu beberapa detik sebelum mencoba lagi
        jika terjadi gangguan jaringan sementara.
      </p>
    ),
  },
  {
    id: 'faq-10',
    question: '10. Apa yang terjadi jika tayangan video terbaru tidak tersedia pada profil publik?',
    schemaAnswer:
      'Jika statistik publik utama profil (pengikut, total suka, dan jumlah video) termuat tetapi daftar tayangan video terbaru tidak dapat diambil, KalkulatorTik otomatis beralih ke model estimasi fallback. Alat memperkirakan rata-rata tayangan sebesar 8% dari pengikut untuk akun dengan 12.500+ pengikut (atau 10% antara 10.000 hingga 12.499 pengikut, dengan batas bawah minimum 1.000 tayangan di bawah 10.000 pengikut) dan memperkirakan engagement dari total suka, jumlah video, serta pengikut (atau nilai default tingkat pengikut bila jumlah tidak tersedia) agar Anda tetap memperoleh patokan awal.',
    answer: (
      <p>
        Jika statistik publik utama profil (pengikut, total suka, dan jumlah video) termuat tetapi daftar tayangan
        video terbaru tidak dapat diambil, KalkulatorTik otomatis beralih ke{' '}
        <strong>model estimasi fallback</strong>. Alat ini memperkirakan rata-rata tayangan sebesar <code>8%</code> dari
        pengikut untuk akun dengan <code>12.500+</code> pengikut (atau <code>10%</code> antara <code>10.000</code>{' '}
        hingga <code>12.499</code> pengikut, dengan batas bawah minimal <code>1.000</code> tayangan di bawah{' '}
        <code>10.000</code>) dan memperkirakan engagement dari total suka, jumlah video, dan pengikut (atau default
        berdasarkan tingkat pengikut jika angka tidak tersedia) agar Anda tetap mendapatkan patokan dasar.
      </p>
    ),
  },
  {
    id: 'faq-11',
    question: '11. Apakah nilai perkiraan sponsor ini dijamin pasti didapat?',
    schemaAnswer:
      'Tidak. Semua angka yang dihasilkan oleh KalkulatorTik merupakan patokan edukatif yang tidak mengikat, bukan pendapatan terjamin atau penawaran agensi resmi. Tarif sponsor sebenarnya bergantung pada kesediaan merek bermitra, niche konten spesifik, demografi audiens, kompleksitas deliverables, dan hasil negosiasi kontrak Anda.',
    answer: (
      <p>
        <strong>Tidak.</strong> Seluruh angka yang ditampilkan KalkulatorTik adalah patokan edukatif yang tidak mengikat,
        bukan pendapatan terjamin atau penawaran resmi agensi. Nilai kontrak sponsor sesungguhnya bergantung pada minat
        merek untuk bermitra, kategori konten Anda, demografi penonton, kerumitan produksi, dan bagaimana Anda
        menegosiasikan syarat perjanjian.
      </p>
    ),
  },
  {
    id: 'faq-12',
    question: '12. Bagaimana kreator dapat menggunakan perkiraan ini saat bernegosiasi dengan merek?',
    schemaAnswer:
      'Perlakukan perkiraan utama dan rentang rendah-ke-tinggi sebagai patokan awal untuk satu video sponsor organik standar: Gunakan perkiraan rata-rata untuk memeriksa penawaran sponsor yang masuk agar jangkauan Anda tidak dihargai terlalu rendah. Ajukan tarif ke arah atau di atas batas atas rentang saat merek meminta nilai ekstra—seperti izin amplifikasi berbayar Spark Ads, hak penggunaan konten 30 hingga 90 hari, eksklusivitas kategori, atau produksi video kompleks. Tawarkan sedikit potongan harga per video ke arah batas bawah saat merek berkomitmen pada paket multi-video (misalnya bundel kampanye 3 atau 5 video).',
    answer: (
      <div className="space-y-2">
        <p>
          Perlakukan perkiraan utama serta rentang rendah-ke-tinggi sebagai{' '}
          <strong>patokan awal untuk satu video sponsor organik standar</strong>:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            Gunakan <strong>perkiraan rata-rata</strong> untuk menilai penawaran kerja sama yang masuk agar jangkauan Anda
            tidak dihargai terlalu rendah.
          </li>
          <li>
            Ajukan harga mendekati atau di atas <strong>batas atas rentang</strong> bila merek meminta tambahan nilai—seperti
            izin promosi berbayar Spark Ads, hak penggunaan konten 30 hingga 90 hari, eksklusivitas kategori, atau
            produksi video yang kompleks.
          </li>
          <li>
            Tawarkan penyesuaian harga per video ke arah <strong>batas bawah rentang</strong> apabila merek menyepakati
            paket kampanye beberapa video sekaligus (misalnya bundel 3 atau 5 video).
          </li>
        </ul>
      </div>
    ),
  },
];

export const ID_HOME_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://www.kalkulatortik.com/#faq',
  inLanguage: 'id',
  mainEntity: ID_FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.schemaAnswer,
    },
  })),
};

export const ID_INFO_COPY = {
  intro: {
    title: 'Apa Itu Kalkulator Uang TikTok?',
    description:
      'Kalkulator Uang TikTok adalah alat valuasi kreator yang memperkirakan potensi biaya sponsor video untuk profil TikTok publik—sekaligus membantu merek menilai kewajaran tarif kerja sama.',
    p1: (
      <>
        Alih-alih menebak berapa banyak uang yang dapat dihasilkan suatu akun dari kolaborasi merek,{' '}
        <strong className="font-semibold text-slate-900">kalkulator uang TikTok</strong> ini melihat indikator profil
        yang terbuka untuk publik—termasuk{' '}
        <strong className="font-semibold text-slate-900">rata-rata tayangan video</strong>,{' '}
        <strong className="font-semibold text-slate-900">tingkat engagement audiens</strong>,{' '}
        <strong className="font-semibold text-slate-900">wilayah profil</strong>, dan{' '}
        <strong className="font-semibold text-slate-900">skala pengikut</strong>—untuk memperkirakan tarif sponsor
        tunggal dalam Dolar AS (USD) beserta rentang negosiasi rendah-ke-tinggi.
      </>
    ),
    p2: 'Baik Anda seorang kreator yang sedang menyusun rate card untuk sponsor mendatang maupun pemasar yang membandingkan kreator sebelum meluncurkan kampanye, KalkulatorTik menghadirkan patokan awal transparan dari username TikTok publik mana pun tanpa login atau kata sandi.',
  },
  howToUse: {
    title: 'Cara Menggunakan Kalkulator Uang TikTok',
    description:
      'Hitung perkiraan pendapatan sponsor TikTok berdasarkan nama pengguna dalam tiga langkah cepat—tanpa login atau pembuatan akun.',
    actionLabel: 'Buka Kalkulator di Atas \u2191',
    steps: [
      {
        badge: 'LANGKAH 01',
        title: 'Masukkan Username & Hitung',
        body: (
          <>
            Masukkan username TikTok publik apa saja (seperti <code>khaby.lame</code> atau <code>@mrbeast</code>) pada
            kolom kalkulator di atas&mdash;simbol <code>@</code> di awal dihapus otomatis&mdash;lalu klik{' '}
            <strong>Hitung Nilai Sponsor</strong> untuk menghitung rentang penghasilan per video seketika.
          </>
        ),
      },
      {
        badge: 'LANGKAH 02',
        title: 'Tinjau Profil & Sumber Data',
        body: (
          <>
            Periksa spanduk status di atas hasil untuk melihat apakah metrik berasal dari{' '}
            <strong>sampel video terbaru langsung</strong> atau <strong>mode fallback profil</strong>, lalu periksa{' '}
            <strong>Nilai &amp; Rentang Perkiraan</strong>, <strong>Patokan CPM</strong>, dan 6 kartu statistik.
          </>
        ),
      },
      {
        badge: 'LANGKAH 03',
        title: 'Terapkan pada Syarat Kerja Sama',
        body: (
          <>
            <strong>Kreator:</strong> Gunakan perkiraan rata-rata sebagai patokan dasar satu video organik sebelum
            menambah biaya Spark Ads, lisensi penggunaan, atau eksklusivitas. <strong>Merek:</strong> Cocokkan tarif
            penawaran dengan perkiraan jangkauan dan kualitas engagement.
          </>
        ),
      },
    ],
    troubleshootingTitle: 'Pemecahan Masalah & Refresh Cache Manual',
    troubleshootingP1: (
      <>
        <strong className="text-slate-900">Pencarian Publik &amp; Pembatasan Sementara:</strong> Hanya akun publik
        yang dapat dianalisis. Jika pembatasan dari sisi TikTok menyebabkan jeda sesaat, tunggu beberapa detik sebelum
        mencoba pencarian ulang.
      </>
    ),
    troubleshootingP2: (
      <>
        <strong className="text-slate-900">Cache 1 Jam &amp; Pembaruan Langsung:</strong> Hasil disimpan hingga 1 jam
        demi kecepatan. Jika statistik unggahan Anda baru saja naik tajam, gunakan tombol Refresh Data pada{' '}
        <Link to="/calculator" className="font-semibold text-teal-700 underline underline-offset-2">
          Tampilan Refresh Cache Terpisah
        </Link>{' '}
        untuk melewati cache.
      </>
    ),
    footerNote: 'Di bawah ini, setiap kartu valuasi dan metrik profil publik pada Langkah 02 dijelaskan secara detail.',
  },
  results: {
    title: 'Performa Profil & Perkiraan Nilai Sponsor',
    description:
      'Setiap pencarian username TikTok mengubah sinyal profil publik menjadi perkiraan pendapatan sponsor dan rincian tarif untuk satu video bersponsor.',
    primaryEyebrow: 'Output Valuasi Utama',
    usdBadge: 'Patokan USD',
    primaryTitle: 'Perkiraan Nilai Sponsor per Video',
    primaryLead: (
      <>
        Angka dolar utama menunjukkan{' '}
        <strong className="font-semibold text-slate-900">
          perkiraan tarif dasar untuk satu video bersponsor (USD)
        </strong>
        . Karena nilai kesepakatan nyata mengikuti deliverables, dua angka referensi melengkapi patokan tersebut:
      </>
    ),
    rangeTitle: 'Rentang Perkiraan Sponsor',
    rangeBody:
      'Penyebutan singkat atau bundel multi-video kerap berada di sisi bawah rentang, sedangkan niche komersial kompetitif atau tambahan deliverables mengarah ke sisi atas.',
    cpmTitle: 'Patokan CPM Model',
    cpmBody:
      'Asumsi tarif kotor pengiklan per 1.000 tayangan video setelah disesuaikan dengan tingkat wilayah profil, tingkat engagement, dan skala pengikut.',
    cacheNote: 'Angka mencerminkan data profil publik yang diambil saat pencarian (atau di-cache hingga 1 jam).',
    profileOverviewTitle: 'Ringkasan Profil Publik',
    profileOverviewBadge: 'Sinyal Identitas',
    profileOverviewBody: (
      <>
        Menampilkan detail profil publik yang tersedia&mdash;nama tampilan, <code>@handle</code>, lencana terverifikasi
        TikTok (bila ada), bio publik, kode wilayah (bila terbuka), ID TikTok, serta tanggal pembuatan akun.
      </>
    ),
    metricsTitle: 'Ringkasan Akun & Patokan Aktivitas',
    metricsBadge: '6 Indikator Publik',
    howToReadTitle: 'Cara Membaca Hasil Kalkulator Anda',
    howToReadBody: (
      <>
        Baik digunakan sebagai kalkulator penghasilan TikTok untuk memeriksa penawaran masuk maupun menyusun rate card
        dasar, perlakukan hasil estimasi sebagai titik awal negosiasi praktis&mdash;bukan tarif baku atau penghasilan
        pasti. <strong className="text-slate-900">Kreator</strong> dapat menetapkan penawaran per video sebelum
        menambah biaya hak penggunaan atau eksklusivitas. <strong className="text-slate-900">Merek dan pemasar</strong>{' '}
        dapat memeriksa kesesuaian harga kreator terhadap jangkauan serta interaksi publiknya. Simak rincian rumus di
        bawah untuk memahami cara angka dihitung.
      </>
    ),
    limitationsBadge: 'Keterbatasan Perkiraan',
    limitationsBody:
      'Hasil ini bergantung sepenuhnya pada indikator profil publik. Alat ini tidak membaca analitik pribadi TikTok Studio, kelompok usia atau pendapatan penonton, tingkat penyelesaian tontonan, maupun pola interaksi tidak wajar. Jika tayangan video terbaru tidak dapat diambil, model estimasi fallback profil otomatis digunakan.',
  },
  calculation: {
    title: 'Cara Kalkulator Uang TikTok Memperkirakan Nilai Sponsor',
    description:
      'Alih-alih mengandalkan skor tertutup, KalkulatorTik memakai model media bertahap yang transparan untuk memperkirakan pendapatan kreator—sekaligus acuan anggaran pengiklan—untuk satu video bersponsor.',
    eqBadge: 'Persamaan Valuasi Inti',
    eqTitle: 'Rumus Inti Valuasi Sponsor',
    eqBody:
      'Berbasis metrik iklan digital Cost Per Mille (CPM)—biaya per 1.000 tayangan video. Menghitung CPM Disesuaikan minimum, rata-rata, dan maksimum menghasilkan angka patokan sekaligus rentang negosiasi.',
    eqPart1: 'Rata-Rata Tayangan Video \u00F7 1.000',
    eqPart2: 'CPM Disesuaikan',
    eqPart3: 'Perkiraan Tarif Video',
    step1Title: 'Langkah 1: Menghitung Rata-Rata Tayangan Video dan Tingkat Engagement',
    step1Desc:
      'Saat username publik dicari, kalkulator memeriksa hingga 30 video publik terbaru yang melaporkan jumlah pemutaran:',
    avgViewsTitle: 'Rata-Rata Tayangan Video',
    avgViewsDesc: 'Menghitung rata-rata aritmetika sederhana dari video publik terbaru (dengan tayangan > 0):',
    avgViewsFormula: 'Rata-Rata Tayangan = Jumlah Tayangan Terbaru \u00F7 Video Dianalisis',
    engTitle: 'Tingkat Engagement',
    engDesc: 'Mengukur total interaksi publik terhadap total tayangan pada sampel video tersebut:',
    engFormula: 'Engagement (%) = ((Suka + Komentar + Bagikan) \u00F7 Tayangan) \u00D7 100',
    step2Title: 'Langkah 2: Memilih Tingkat CPM Dasar (Asumsi Model)',
    step2Desc:
      'Karena permintaan pengiklan berbeda antarnegara, KalkulatorTik menetapkan rentang CPM dasar awal (USD) dari kode wilayah profil (atau otomatis memakai Tier 3 bila data wilayah tidak tersedia):',
    tableCaption: 'Asumsi CPM dasar internal KalkulatorTik (USD per 1.000 tayangan).',
    thTier: 'Tingkat Pasar',
    thCountries: 'Contoh Wilayah / Negara',
    thMin: 'CPM Min',
    thAvg: 'CPM Rata-Rata',
    thMax: 'CPM Maks',
    step2Note: (
      <>
        <strong>Catatan Metodologi:</strong> Tingkat CPM ini adalah asumsi patokan internal KalkulatorTik&mdash;bukan
        tarif resmi TikTok atau rata-rata industri yang dijamin. Kode wilayah profil tidak menjamin lokasi setiap
        penonton.
      </>
    ),
    step3Title: 'Langkah 3: Menerapkan Pengali Engagement dan Skala Pengikut',
    step3Desc: (
      <>
        Dua pengali performa menyesuaikan CPM awal sebelum membatasi hasil akhir di antara <strong>$7.00</strong>{' '}
        hingga <strong>$80.00</strong> per 1.000 tayangan (USD):
      </>
    ),
    engAdjTitle: (
      <>
        Penyesuaian Engagement (<code>0.90x&ndash;1.20x</code>)
      </>
    ),
    engAdjBody: (
      <>
        Diskalakan secara linear dari engagement <code>0%</code> (<code>0.90x</code>) melewati titik netral{' '}
        <code>5.0%</code> (<code>1.00x</code>) dan <code>7.5%</code> (<code>1.05x</code>), hingga batas maksimal{' '}
        <code>1.20x</code> pada engagement <code>15%+</code>.
      </>
    ),
    engAdjBox1: '0% = 0.90x · 5.0% = 1.00x (Netral)',
    engAdjBox2: '7.5% = 1.05x · 15%+ = 1.20x (Batas)',
    scaleTitle: (
      <>
        Skala Pengikut (<code>1.00x&ndash;1.18x</code>)
      </>
    ),
    scaleSub: 'Skala bukti sosial bernilai tambah (kreator kecil tidak pernah dikenai penalti):',
    boundsTitle: (
      <>
        Batas Bawah &amp; Atas CPM (<code>$7.00&ndash;$80.00</code>)
      </>
    ),
    boundsBody: (
      <>
        Masing-masing CPM Rendah, Dasar, dan Tinggi dikalikan kedua faktor lalu dibatasi antara minimal{' '}
        <code>$7.00</code> dan maksimal <code>$80.00</code>.
      </>
    ),
    boundsBox: 'CPM Disesuaikan = Dasar × Eng × Skala (Batas $7–$80)',
    fallbackTitle: 'Perkiraan Fallback Saat Tayangan Video Terbaru Tidak Tersedia',
    fallbackViews: (
      <>
        <strong className="text-slate-900">Rata-Rata Tayangan Fallback:</strong> Diperkirakan sebesar <code>8%</code> dari
        pengikut untuk akun dengan <code>12.500+</code> pengikut, <code>10%</code> antara <code>10.000</code> hingga{' '}
        <code>12.499</code> pengikut, dan batas minimum <code>1.000</code> tayangan di bawah <code>10.000</code>{' '}
        pengikut.
      </>
    ),
    fallbackEng: (
      <>
        <strong className="text-slate-900">Tingkat Engagement Fallback:</strong> Dihitung dari total suka dibagi total
        video dan pengikut (dibatasi antara <code>1.0%</code> dan <code>50.0%</code>), atau memakai nilai default per
        tingkat pengikut (<code>8.0%</code> hingga 100K, <code>5.0%</code> di atas 100K, <code>3.0%</code> di atas 1M,
        dan <code>2.0%</code> di atas 10M) apabila jumlah tidak tersedia.
      </>
    ),
    exampleBadge: 'Contoh Model Hipotetis',
    exampleTitle: 'Contoh Perhitungan: Menghitung Patokan Sponsor Kreator',
    exampleTag: 'Jejak Profil Sampel',
    exRegionLabel: 'Wilayah Profil',
    exRegionVal: 'AS (Tier 1)',
    exFollowersLabel: 'Pengikut',
    exFollowersSub: 'Skala = 1.08x',
    exViewsLabel: 'Rata-Rata Tayangan',
    exViewsVal: '50.000 / video',
    exViewsSub: '50,0 unit tayangan',
    exEngLabel: 'Tingkat Engagement',
    exEngSub: 'Faktor = 1.08x',
    exStep1: '1. Engagement Ternormalisasi:',
    exStep2: '2. Faktor Engagement:',
    exStep3: '3. Pengali Gabungan:',
    exStep4Label: '4. Rentang CPM Disesuaikan:',
    exStep4Min: 'Min',
    exStep4Avg: 'Rata-rata',
    exStep4Max: 'Maks',
    exStep4Tag: '$34.99 rata-rata',
    exStep5Title: '5. Patokan Akhir (50 × $34.99)',
    exPerVideo: 'per video bersponsor',
    exRange: 'Rentang: $1,283.00 – $2,449.50',
    exFooterNote:
      'Hanya contoh ilustratif; tidak membaca demografi audiens pribadi maupun tingkat konversi.',
    transitionNote:
      'Karena patokan ini memodelkan apa yang dibayarkan pengiklan eksternal per video, fungsinya berbeda secara mendasar dari monetisasi langsung dalam aplikasi TikTok.',
  },
  channels: {
    title: 'Sponsor Merek vs. TikTok Creator Rewards: Apa Bedanya?',
    description:
      'Banyak kreator membuka kalkulator penghasilan TikTok dengan mengharapkan pembayaran langsung dari platform, padahal kerja sama sponsor merek dan program resmi TikTok Creator Rewards berasal dari pembayar yang berbeda dan tunduk pada aturan terpisah.',
    leftBadge: 'Diperkirakan oleh Kalkulator Ini',
    leftTitle: 'Cara Kerja Sponsor Merek dan Video Bersponsor',
    leftLead: (
      <>
        Kesepakatan komersial privat ketika perusahaan atau agensi pemasaran eksternal membayar kreator untuk
        menampilkan atau mengulas produk dalam sebuah <strong>video bersponsor</strong>.
      </>
    ),
    leftItems: [
      ['Pihak Pembayar', 'Merek eksternal, bisnis, atau agensi secara langsung lewat faktur atau transfer.'],
      [
        'Penetapan Tarif',
        'Dinegosiasikan per video atau paket kampanye berdasar estimasi jangkauan, kecocokan niche, produksi, dan hak lisensi.',
      ],
      [
        'Kelayakan',
        'Terbuka untuk kreator berbagai skala—termasuk nano-kreator di bawah 10.000 pengikut—yang audiensnya relevan dengan sponsor.',
      ],
    ],
    rightBadge: 'Program Platform Dalam Aplikasi',
    rightTitle: 'Cara Kerja Program TikTok Creator Rewards',
    rightLead:
      'Pembayaran langsung platform yang dikelola TikTok (menggantikan Creator Fund terdahulu) melalui saldo kreator di dalam aplikasi.',
    rightItems: [
      ['Pihak Pembayar', 'TikTok menyalurkan dana langsung ke kreator terdaftar sesuai syarat pembayaran resmi platform.'],
      [
        'Syarat Kelayakan',
        <>
          Membutuhkan <code>10.000+</code> pengikut, <code>100.000+</code> tayangan video dalam 30 hari terakhir, usia{' '}
          <code>18+</code> (<code>19+</code> di Korea Selatan), reputasi akun baik, dan berada di wilayah yang memenuhi
          syarat.
        </>,
      ],
      [
        'Aturan Pembayaran',
        <>
          Hanya berlaku untuk video orisinal memenuhi syarat berdurasi <code>1+ menit</code> menggunakan{' '}
          <strong>qualified views</strong> internal TikTok dan skor RPM dinamis, bukan CPM merek tetap.
        </>,
      ],
      [
        'Fitur Lainnya',
        'LIVE Gifts saat siaran langsung dan komisi afiliasi TikTok Shop masing-masing mengikuti kebijakan platform tersendiri.',
      ],
    ],
    compareTitle: 'Perbandingan Langsung: Kerja Sama Merek vs. Monetisasi Platform',
    tableCaption: 'Perbedaan utama antara kesepakatan sponsor merek komersial dan pembayaran resmi TikTok.',
    thFeature: 'Aspek',
    thSponsor: 'Sponsor Merek (Video Bersponsor)',
    thRewards: 'TikTok Creator Rewards (Monetisasi Platform)',
    whyTitle: 'Mengapa Perkiraan Sponsor Bukan Pembayaran Langsung TikTok',
    whyBody:
      'Metrik pribadi Creator Rewards—porsi qualified views dan RPM per video—hanya tersedia di dasbor TikTok Studio kreator sehingga tidak dapat diperiksa oleh alat eksternal mana pun. Kerja sama merek juga membayar produksi konten khusus serta penempatan produk, bukan sekadar bagi hasil iklan pasif. Setelah memahami perbedaan sponsor komersial ini, pelajari faktor penentu tinggi-rendahnya tarif negosiasi.',
    whyFootnote: 'Aturan Creator Rewards, daftar negara eligible, dan ketentuan pembayaran ditetapkan sepenuhnya oleh TikTok dan dapat berubah sewaktu-waktu.',
  },
  factors: {
    title: 'Apa Saja yang Memengaruhi Tarif Sponsor TikTok?',
    description:
      'Dua akun dengan jumlah tayangan serupa dapat memperoleh tarif sponsor yang jauh berbeda. Memisahkan sinyal publik yang diukur oleh kalkulator uang TikTok ini dari ketentuan komersial privat membantu Anda menetapkan harga kerja sama secara realistis.',
    measuredTitle: 'Diukur Otomatis dalam Rumus Kalkulator',
    measuredBadge: '4 Sinyal Publik',
    measuredBody: (
      <>
        Estimator di atas sudah memperhitungkan <strong>Rata-Rata Tayangan Video</strong>,{' '}
        <strong>Tingkat Engagement</strong>, <strong>Indikator Wilayah</strong>, dan <strong>Skala Pengikut</strong>{' '}
        sebelum penyesuaian negosiasi diterapkan.
      </>
    ),
    unmeasuredTitle: 'Faktor Negosiasi Nyata yang Tidak Diukur oleh Kalkulator',
    unmeasuredBadge: 'Dinegosiasikan Privat',
    adjustTitle: 'Cara Menyesuaikan Penawaran Berdasarkan Ketentuan Kampanye',
    adjustBody: (
      <>
        Gunakan hasil kalkulator sebagai <strong>tarif dasar untuk satu unggahan sponsor organik</strong>, lalu tambahkan
        pos biaya terpisah untuk amplifikasi Spark Ads, durasi lisensi konten, eksklusivitas, atau produksi kompleks.
        Alasan mengapa rata-rata tayangan menempati prioritas utama—bahkan di atas jumlah pengikut—terlihat jelas saat
        membandingkan dua profil kreator berikut secara langsung.
      </>
    ),
  },
  followersVsViews: {
    title: 'Pengikut vs. Tayangan Video: Mana yang Lebih Penting untuk Sponsor TikTok?',
    description:
      'Berbeda dari feed pengikut kronologis, feed For You (FYP) TikTok mendistribusikan setiap unggahan berdasarkan minat penonton, waktu tonton, dan engagement. Akibatnya, kanal besar yang pasif dan kanal menengah yang aktif memberikan jangkauan sponsor yang jauh berbeda.',
    creatorATag: 'Kreator Hipotetis A · Akun Besar Pasif',
    creatorAPrice: '$143.68 / video',
    creatorABody: (
      <>
        Mengumpulkan <strong>500.000 pengikut</strong> dari tren viral lama, namun video terbarunya rata-rata meraih{' '}
        <strong>8.000 tayangan</strong> dengan tingkat engagement <code>1.20%</code> (wilayah Tier 3).
      </>
    ),
    creatorBTag: 'Kreator Hipotetis B · Jangkauan Aktif Tinggi',
    creatorBPrice: '$2,163.85 / video',
    creatorBBody: (
      <>
        Kanal niche terfokus dengan <strong>50.000 pengikut</strong> yang secara rutin menghasilkan{' '}
        <strong>65.000 tayangan rata-rata</strong> per unggahan dan engagement <code>9.40%</code> (wilayah Tier 1).
      </>
    ),
    labelFollowers: 'Pengikut',
    labelViews: 'Rata-Rata Tayangan per Video',
    compareTitle: 'Perbandingan Model: Pengikut Tinggi vs. Tayangan Video Konsisten',
    compareCaption: 'Perbandingan hipotetis yang dihitung dengan rumus valuasi KalkulatorTik.',
    thMetric: 'Metrik / Langkah Model',
    thCreatorA: 'Kreator A (500K Pengikut)',
    thCreatorB: 'Kreator B (50K Pengikut)',
    thWhy: 'Mengapa Penting',
    tier3Note:
      'Catatan: Bahkan di dalam pasar Tier 3 yang sama ($18.00 CPM dasar rata-rata), 65.000 tayangan rata-rata dan engagement 9,40% milik Kreator B menghasilkan $1,298.70 per video ($19.98 CPM Disesuaikan)—9× lebih tinggi daripada $143.68 milik Kreator A. Kreator A dan Kreator B merupakan ilustrasi rumus hipotetis.',
    stillMattersTitle: 'Kapan Jumlah Pengikut Tetap Penting',
    stillMattersList: [
      <>
        <strong>Persepsi Merek &amp; Bukti Sosial:</strong> Sebagian pengiklan menyaring kreator lewat ambang pengikut
        sebagai patokan cepat kredibilitas akun.
      </>,
      <>
        <strong>Kedekatan Komunitas:</strong> Penonton berulang dari tab Mengikuti cenderung lebih memercayai
        rekomendasi produk dibanding trafik viral sesaat.
      </>,
      <>
        <strong>Kelayakan Fitur Platform:</strong> Ambang pengikut membuka fitur bawaan TikTok seperti siaran LIVE dan
        pendaftaran program monetisasi.
      </>,
    ],
    rateCardTitle: 'Menyusun Rate Card Kreator yang Seimbang',
    rateCardBody: (
      <>
        Tonjolkan <strong>rata-rata tayangan unggahan terbaru</strong>, <strong>tingkat engagement</strong>, dan contoh
        video retensi tinggi di bagian depan media kit Anda. Pengikut mencerminkan pertumbuhan masa lalu; tayangan
        video terbaru mencerminkan jangkauan komersial saat ini.
      </>
    ),
    rateCardPrompt: 'Siap menguji handle Anda sendiri?',
    rateCardBtn: 'Periksa Patokan Profil Anda \u2191',
  },
  relatedTools: {
    title: 'Jelajahi Kalkulator TikTok Gratis Lainnya',
    description:
      'Penetapan harga sponsor bekerja paling optimal jika dipadukan dengan pemodelan biaya kampanye dan audit interaksi manual. Beralihlah secara langsung di antara utilitas pendamping berikut.',
    tool1Tag: 'Audit Interaksi Pengikut',
    tool1Badge: 'Input Manual',
    tool1Title: 'Kalkulator Tingkat Engagement TikTok',
    tool1Desc: (
      <>
        Menghitung rata-rata interaksi suka per video dari <strong>Total Suka</strong>, <strong>Total Video</strong>,
        dan <strong>Total Pengikut</strong> (menerima angka penuh maupun singkatan seperti <code>277.8K</code> atau{' '}
        <code>4.2M</code>) serta membandingkannya dengan patokan skala pengikut dari <code>1K&ndash;5K</code> hingga{' '}
        <code>1M+</code>.
      </>
    ),
    tool1Formula: '((Total Suka ÷ Total Pengikut) ÷ Total Video) × 100',
    tool1Best: 'Cocok bagi kreator yang mengaudit kesehatan akun, pembaruan media kit, dan pengecekan akun privat.',
    tool1Cta: 'Buka Kalkulator Engagement TikTok \u2192',
    tool2Tag: 'Matematika Iklan & Kampanye',
    tool2Badge: '7 Mata Uang',
    tool2Title: 'Kalkulator CPM TikTok',
    tool2Desc: (
      <>
        Alat perencanaan kampanye tiga mode dalam <code>USD</code>, <code>EUR</code>, <code>GBP</code>, <code>CAD</code>,{' '}
        <code>AUD</code>, <code>INR</code>, dan <code>PKR</code>. Ideal untuk membandingkan penawaran kreator secara
        langsung dengan tayangan iklan TikTok berbayar.
      </>
    ),
    tool2Modes: ['Hitung CPM', 'Hitung Anggaran Iklan', 'Hitung Impresi'],
    tool2Best: 'Cocok bagi media buyer, manajer pemasaran, dan kreator yang memvalidasi ROI sponsor.',
    tool2Cta: 'Buka Kalkulator CPM TikTok \u2192',
    refreshTag: 'Tampilan Refresh Terpisah',
    refreshBadge: 'Termasuk Refresh Cache',
    refreshTitle: 'Pencarian Profil Refresh Cache Manual',
    refreshDesc: (
      <>
        Perlu menarik ulang data langsung melewati cache server 1 jam saat memeriksa handle kreator yang baru diperbarui?
        Gunakan halaman refresh khusus dengan kontrol manual <strong>Refresh Data</strong>.
      </>
    ),
    refreshCta: 'Buka Tampilan Refresh Cache \u2192',
  },
  faq: {
    title: 'FAQ Kalkulator Uang TikTok & Valuasi Sponsor',
    description:
      'Jawaban langsung mencakup metodologi sponsor, privasi data publik, penanganan fallback, dan negosiasi rate card.',
    ariaTogglePrefix: 'Buka atau tutup jawaban: ',
    disclaimer:
      'Jawaban mencerminkan metodologi terkini serta praktik umum pemasaran influencer, dan bukan merupakan nasihat keuangan, hukum, maupun pajak.',
    viewAllLink: 'Lihat FAQ Monetisasi Lengkap \u2192',
  },
  closing: {
    sectionAriaLabel: 'Mulai penghitungan profil TikTok atau jelajahi alat terkait',
    title: 'Siap Mengukur Nilai Sponsor TikTok Anda?',
    description:
      'Baik menghitung estimasi pendapatan kreator untuk rate card, mengevaluasi tawaran sponsor masuk, maupun membandingkan CPM kampanye, masukkan username TikTok publik di atas atau buka kalkulator khusus lainnya.',
    btnPrimary: 'Hitung dengan Username TikTok \u2191',
    btnCpm: 'Buka Kalkulator CPM',
    btnEng: 'Buka Kalkulator Engagement',
    aboutLine: (
      <>
        KalkulatorTik adalah platform analitik kreator independen. Pelajari lebih lanjut di halaman{' '}
        <Link to="/about" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Tentang KalkulatorTik
        </Link>{' '}
        atau baca jawaban lengkap kebijakan platform di{' '}
        <Link to="/faq" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          FAQ Monetisasi TikTok
        </Link>
        .
      </>
    ),
    legalNotice: (
      <>
        KalkulatorTik tidak berafiliasi dengan, tidak didukung oleh, dan tidak terhubung secara resmi dengan TikTok Inc. atau ByteDance Ltd.; seluruh merek dagang tetap menjadi milik pemegangnya masing-masing. Semua angka bersifat estimasi informasional—baca{' '}
        <Link to="/privacy" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Kebijakan Privasi
        </Link>{' '}
        dan{' '}
        <Link to="/terms" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Syarat & Ketentuan
        </Link>
        .
      </>
    ),
  },
};

export const ID_HOME_PACK = {
  seo: ID_HOME_SEO,
  faqSchema: ID_HOME_FAQ_SCHEMA,
  metricsGuide: ID_ACCOUNT_METRICS_GUIDE,
  cpmTiers: ID_CPM_TIERS_DATA,
  followerScaleTiers: ID_FOLLOWER_SCALE_TIERS,
  channelRows: ID_CHANNEL_COMPARISON_ROWS,
  factors: ID_REAL_WORLD_FACTORS,
  creatorRows: ID_CREATOR_COMPARISON_ROWS,
  faqItems: ID_FAQ_ITEMS,
  copy: ID_INFO_COPY,
};
