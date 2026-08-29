import React, { useState, useEffect, useRef, useCallback } from "react";

/* ============================================================
   BANK SOAL — Tes Bakat Skolastik (TBS)
   Soal latihan orisinal, disusun untuk simulasi Tes Bakat Skolastik:
   Verbal (sinonim/antonim/analogi/bacaan)
   Kuantitatif (aritmetika/deret/aljabar/kecukupan data)
   Pemecahan Masalah (silogisme/logika/analisis data)
   ============================================================ */

const CATEGORIES = {
  verbal: {
    key: "verbal",
    label: "Penalaran Verbal",
    officialCount: 23,
    officialMinutes: 30,
    accent: "#8a6d3b",
  },
  kuantitatif: {
    key: "kuantitatif",
    label: "Penalaran Kuantitatif",
    officialCount: 25,
    officialMinutes: 40,
    accent: "#2f5d62",
  },
  masalah: {
    key: "masalah",
    label: "Pemecahan Masalah",
    officialCount: 12,
    officialMinutes: 20,
    accent: "#5b3a5c",
  },
};

const QUESTION_BANK = [
  // ---------------- VERBAL ----------------
  {
    id: "v1",
    cat: "verbal",
    type: "Sinonim",
    prompt: "Pilih kata yang memiliki makna paling dekat dengan kata berikut: KONTEMPORER",
    options: ["Kuno", "Masa kini", "Abadi", "Langka", "Formal"],
    answer: 1,
    explanation:
      "Kontemporer berarti 'pada masa yang sama, masa kini'. Kata yang paling dekat maknanya adalah 'masa kini'.",
  },
  {
    id: "v2",
    cat: "verbal",
    type: "Antonim",
    prompt: "Pilih kata yang berlawanan makna dengan kata berikut: EKSPANSIF",
    options: ["Meluas", "Terbatas", "Agresif", "Terbuka", "Dominan"],
    answer: 1,
    explanation:
      "Ekspansif berarti bersifat memperluas atau mengembangkan. Lawan katanya adalah 'terbatas', yang bermakna dibatasi ruang lingkupnya.",
  },
  {
    id: "v3",
    cat: "verbal",
    type: "Analogi",
    prompt: "DOKTER : STETOSKOP = PELUKIS : ....",
    options: ["Galeri", "Kanvas", "Kuas", "Museum", "Cat"],
    answer: 2,
    explanation:
      "Hubungannya adalah profesi dengan alat utama yang melekat pada tindakannya. Dokter memakai stetoskop untuk memeriksa; pelukis memakai kuas untuk melukis (alat yang digenggam dan digerakkan langsung, sejajar posisinya dengan stetoskop).",
  },
  {
    id: "v4",
    cat: "verbal",
    type: "Analogi",
    prompt: "HEMAT : BOROS = OPTIMIS : ....",
    options: ["Percaya diri", "Pesimis", "Yakin", "Ragu", "Cemas"],
    answer: 1,
    explanation:
      "Pasangan kata pertama merupakan antonim (hemat >< boros). Antonim dari optimis adalah pesimis.",
  },
  {
    id: "v5",
    cat: "verbal",
    type: "Sinonim",
    prompt: "Pilih kata yang bermakna paling dekat dengan: EKUIVALEN",
    options: ["Berbeda", "Setara", "Berlawanan", "Menyusut", "Terpisah"],
    answer: 1,
    explanation: "Ekuivalen berarti sepadan atau bernilai sama, sehingga padanan terdekatnya adalah 'setara'.",
  },
  {
    id: "v6",
    cat: "verbal",
    type: "Bacaan",
    prompt:
      "Bacaan: 'Penelitian terbaru menunjukkan bahwa penurunan populasi lebah tidak hanya disebabkan oleh pestisida, tetapi juga oleh hilangnya habitat alami akibat alih fungsi lahan pertanian monokultur.' Berdasarkan bacaan, penyebab penurunan populasi lebah yang disebutkan adalah...",
    options: [
      "Hanya pestisida",
      "Hanya alih fungsi lahan",
      "Pestisida dan hilangnya habitat akibat monokultur",
      "Perubahan iklim global",
      "Predator alami lebah",
    ],
    answer: 2,
    explanation:
      "Bacaan secara eksplisit menyebutkan dua penyebab: pestisida DAN hilangnya habitat alami akibat lahan monokultur — bukan salah satu saja.",
  },
  {
    id: "v7",
    cat: "verbal",
    type: "Analogi",
    prompt: "PARTITUR : MUSIK = RESEP : ....",
    options: ["Koki", "Restoran", "Masakan", "Dapur", "Bahan"],
    answer: 2,
    explanation:
      "Partitur adalah panduan tertulis untuk menghasilkan musik; resep adalah panduan tertulis untuk menghasilkan masakan. Hubungannya adalah panduan-hasil.",
  },
  {
    id: "v8",
    cat: "verbal",
    type: "Antonim",
    prompt: "Pilih kata yang berlawanan makna dengan: EKSPLISIT",
    options: ["Jelas", "Gamblang", "Implisit", "Terperinci", "Terbuka"],
    answer: 2,
    explanation: "Eksplisit berarti dinyatakan secara tegas dan jelas. Lawan katanya adalah implisit (tersirat).",
  },
  {
    id: "v9",
    cat: "verbal",
    type: "Bacaan",
    prompt:
      "Bacaan: 'Meskipun anggaran riset dasar di banyak negara berkembang meningkat, hasil publikasi ilmiah belum sebanding karena minimnya insentif bagi peneliti muda untuk menetap di institusi domestik.' Simpulan yang paling tepat dari bacaan tersebut adalah...",
    options: [
      "Anggaran riset tidak penting bagi publikasi ilmiah",
      "Kenaikan anggaran tidak otomatis meningkatkan publikasi jika insentif peneliti muda rendah",
      "Semua peneliti muda memilih pindah ke luar negeri",
      "Negara berkembang tidak memiliki anggaran riset",
      "Publikasi ilmiah hanya ditentukan oleh anggaran",
    ],
    answer: 1,
    explanation:
      "Bacaan menyatakan kenaikan anggaran BELUM sebanding dengan publikasi KARENA minimnya insentif — ini persis simpulan pada opsi B, tanpa generalisasi berlebihan seperti opsi lain.",
  },
  {
    id: "v10",
    cat: "verbal",
    type: "Analogi",
    prompt: "KOMPAS : ARAH = TERMOMETER : ....",
    options: ["Cuaca", "Panas", "Suhu", "Udara", "Alat"],
    answer: 2,
    explanation: "Kompas mengukur/menunjukkan arah; termometer mengukur/menunjukkan suhu. Hubungan alat-besaran yang diukur.",
  },
  {
    id: "v11",
    cat: "verbal",
    type: "Sinonim",
    prompt: "Pilih kata yang bermakna paling dekat dengan: SUBSTANSIAL",
    options: ["Sepele", "Mendasar/berarti besar", "Sementara", "Dangkal", "Formal"],
    answer: 1,
    explanation: "Substansial berarti bersifat pokok/berarti dalam jumlah besar, sehingga padanannya 'mendasar/berarti besar'.",
  },
  {
    id: "v12",
    cat: "verbal",
    type: "Antonim",
    prompt: "Pilih kata yang berlawanan makna dengan: SENTRALISASI",
    options: ["Pemusatan", "Konsentrasi", "Desentralisasi", "Konsolidasi", "Integrasi"],
    answer: 2,
    explanation: "Sentralisasi berarti pemusatan (kekuasaan/kegiatan) pada satu titik; lawannya desentralisasi (penyebaran).",
  },

  // ---- Dari e-book "Kumpulan Latihan Soal & Pembahasan" (Try Out Seri 1) ----
  {
    id: "kl1_v1",
    cat: "verbal",
    type: "Analogi",
    prompt: "RANTAI : SEPEDA = KATA SANDI : ...",
    options: ["Rahasia", "Akses", "Komputer", "Data", "Enkripsi"],
    answer: 1,
    explanation:
      "Rantai adalah komponen yang membuat sepeda dapat berfungsi/bergerak. Kata sandi adalah komponen yang membuat sesuatu (akun/sistem) dapat diakses. Hubungan: komponen yang memungkinkan fungsi utama berjalan.",
  },
  {
    id: "kl1_v2",
    cat: "verbal",
    type: "Analogi",
    prompt: "DETAK JANTUNG : KEHIDUPAN = JAM : ...",
    options: ["Waktu", "Alarm", "Angka", "Detik", "Kalender"],
    answer: 0,
    explanation: "Detak jantung adalah penanda adanya kehidupan; jam adalah penanda/penunjuk waktu.",
  },
  {
    id: "kl1_v3",
    cat: "verbal",
    type: "Analogi",
    prompt: "DEMOKRATIS : OTORITER = TRANSPARAN : ...",
    options: ["Tertutup", "Terbuka", "Publik", "Bebas", "Jujur"],
    answer: 0,
    explanation: "Pasangan pertama berhubungan antonim (demokratis ↔ otoriter). Antonim dari transparan adalah tertutup.",
  },
  {
    id: "kl1_v4",
    cat: "verbal",
    type: "Analogi",
    prompt: "OPTIMALKAN : ABAIKAN = HARGAI : ...",
    options: ["Hormati", "Remehkan", "Puji", "Sayangi", "Sanjung"],
    answer: 1,
    explanation: "Pasangan pertama antonim (optimalkan ↔ abaikan). Antonim dari hargai adalah remehkan.",
  },
  {
    id: "kl1_v5",
    cat: "verbal",
    type: "Analogi",
    prompt: "HUKUM : KEADILAN : MASYARAKAT = ETIKA : MORAL : ...",
    options: ["Individu", "Norma", "Agama", "Budaya", "Filsafat"],
    answer: 0,
    explanation:
      "Hukum mengatur keadilan pada ranah masyarakat (kelompok besar); etika mengatur moral pada ranah individu (unit terkecil).",
  },
  {
    id: "kl1_v6",
    cat: "verbal",
    type: "Analogi",
    prompt: "KRISIS : PERUBAHAN : REFORMASI = LUKA : PENYEMBUHAN : ...",
    options: ["Harapan", "Obat", "Kesembuhan", "Kehidupan", "Pelajaran"],
    answer: 2,
    explanation: "Krisis memicu perubahan menuju reformasi (hasil akhir); luka memicu penyembuhan menuju kesembuhan (hasil akhir).",
  },
  {
    id: "kl1_v7",
    cat: "verbal",
    type: "Analogi",
    prompt: "ENERGI : GERAK : MESIN = MOTIVASI : TINDAKAN : ...",
    options: ["Keberhasilan", "Proses", "Kegagalan", "Perjuangan", "Tujuan"],
    answer: 0,
    explanation: "Energi menggerakkan mesin untuk menghasilkan output; motivasi mendorong tindakan untuk menghasilkan keberhasilan.",
  },
  {
    id: "kl1_v8",
    cat: "verbal",
    type: "Analogi",
    prompt: "KONSTITUSI : NEGARA : STABILITAS = NILAI : SEKOLAH : ...",
    options: ["Prestasi", "Karakter", "Budaya", "Tata tertib", "Disiplin"],
    answer: 1,
    explanation: "Konstitusi mengatur negara agar tercipta stabilitas; nilai membentuk sekolah agar terbentuk karakter siswa.",
  },
  {
    id: "kl1_v9",
    cat: "verbal",
    type: "Silogisme",
    prompt:
      "Semua mahasiswa kedokteran wajib mengikuti praktik laboratorium. Beberapa mahasiswa kedokteran adalah mahasiswa berprestasi. Kesimpulan yang benar adalah…",
    options: [
      "Semua mahasiswa berprestasi mengikuti praktik laboratorium",
      "Beberapa mahasiswa berprestasi wajib mengikuti praktik laboratorium",
      "Semua mahasiswa kedokteran adalah mahasiswa berprestasi",
      "Tidak ada mahasiswa berprestasi di luar kedokteran",
      "Mahasiswa berprestasi tidak perlu ikut praktik laboratorium",
    ],
    answer: 1,
    explanation:
      "Beberapa mahasiswa kedokteran berprestasi, dan SEMUA mahasiswa kedokteran wajib praktik lab. Maka beberapa mahasiswa berprestasi (yang termasuk kedokteran) pasti wajib praktik lab.",
  },
  {
    id: "kl1_v10",
    cat: "verbal",
    type: "Silogisme",
    prompt: "Jika siswa rajin belajar maka nilainya baik. Beberapa siswa nilainya tidak baik. Kesimpulan yang paling tepat adalah…",
    options: [
      "Semua siswa rajin belajar",
      "Beberapa siswa tidak rajin belajar",
      "Semua siswa tidak rajin belajar",
      "Tidak ada siswa yang rajin belajar",
      "Beberapa siswa rajin belajar",
    ],
    answer: 1,
    explanation:
      "Kontraposisi: nilai tidak baik → tidak rajin belajar. Karena ada siswa bernilai tidak baik, maka ada (beberapa) siswa yang tidak rajin belajar.",
  },
  {
    id: "kl1_v11",
    cat: "verbal",
    type: "Silogisme",
    prompt:
      "Semua mobil keluaran tahun 2025 memiliki teknologi pintar terintegrasi, kecuali beberapa merek tertentu. Mobil Y keluaran tahun 2025, maka....",
    options: [
      "Mobil Y pasti memiliki teknologi pintar terintegrasi",
      "Mobil Y tidak memiliki teknologi pintar terintegrasi",
      "Mobil Y belum tentu memiliki teknologi pintar terintegrasi",
      "Mobil Y merupakan mobil bekas",
      "Semua mobil keluaran 2025 tidak memiliki teknologi pintar terintegrasi",
    ],
    answer: 2,
    explanation:
      "Karena ada pengecualian (beberapa merek tertentu), kita tidak bisa memastikan Mobil Y termasuk kelompok mana — sehingga Mobil Y belum tentu memiliki teknologi tersebut.",
  },
  {
    id: "kl1_v12",
    cat: "verbal",
    type: "Silogisme",
    prompt:
      "Semua orang yang berenang di kolam renang harus memakai baju renang. Rani tidak memakai baju renang. Kesimpulan yang tepat adalah…",
    options: [
      "Rani boleh berenang karena tidak semua orang harus memakai baju renang",
      "Rani tidak boleh berenang karena tidak semua orang harus memakai baju renang",
      "Rani boleh berenang karena memakai baju renang bukan syarat",
      "Rani tidak boleh berenang karena memakai baju renang adalah syarat wajib",
      "Rani tidak boleh berenang karena hanya beberapa orang yang harus memakai baju renang",
    ],
    answer: 3,
    explanation:
      "Modus tollens: karena baju renang adalah syarat wajib (bukan opsional) untuk berenang, dan Rani tidak memenuhi syarat tersebut, maka Rani tidak boleh berenang.",
  },
  {
    id: "kl1_v13",
    cat: "verbal",
    type: "Silogisme",
    prompt:
      "Jika suatu negara berkomitmen menurunkan emisi karbon, maka negara tersebut akan menerapkan kebijakan energi terbarukan. Negara X tidak menerapkan kebijakan energi terbarukan. Kesimpulan yang tepat adalah…",
    options: [
      "Negara X tidak berkomitmen menurunkan emisi karbon",
      "Negara X telah menurunkan emisi karbon",
      "Negara X akan menerapkan kebijakan energi terbarukan",
      "Negara X tidak peduli pada perubahan iklim",
      "Tidak dapat disimpulkan",
    ],
    answer: 0,
    explanation: "Modus tollens: P→Q, ~Q, maka ~P. Karena negara X tidak menerapkan energi terbarukan (~Q), maka X tidak berkomitmen menurunkan emisi (~P).",
  },
  {
    id: "kl1_v14",
    cat: "verbal",
    type: "Silogisme",
    prompt:
      "Jika Ali rajin belajar DAN konsisten mengikuti simulasi tes bakat skolastik, maka ia akan berhasil dalam seleksi. Ali tidak berhasil dalam seleksi. Simpulan yang tepat adalah…",
    options: [
      "Ali rajin belajar dan konsisten mengikuti simulasi",
      "Ali tidak rajin belajar dan konsisten mengikuti simulasi",
      "Ali tidak rajin belajar atau tidak konsisten mengikuti simulasi",
      "Ali rajin belajar dan tidak konsisten mengikuti simulasi",
      "Ali masih harus berjuang agar pantas menjadi awardee",
    ],
    answer: 2,
    explanation:
      "Modus tollens pada konjungsi: ingkaran dari '(P dan Q)' adalah 'tidak-P atau tidak-Q'. Karena Ali tidak jadi awardee, maka Ali tidak rajin belajar ATAU tidak konsisten simulasi.",
  },
  {
    id: "kl1_v15",
    cat: "verbal",
    type: "Silogisme",
    prompt:
      "Jika ia tidak membalas pesanku maka ia sedang bersama yang lain. Jika ia tidak menghubungi lebih dulu maka ia sudah tidak peduli. Ia tidak membalas pesanku atau ia tidak menghubungi lebih dulu. Simpulan yang tepat adalah….",
    options: [
      "Ia sedang bersama yang lain atau ia sudah tidak peduli",
      "Ia sedang bersama yang lain dan sudah tidak peduli",
      "Ia tidak membalas pesanku karena sudah tidak peduli",
      "Ia tidak menghubungi lebih dulu atau ia sudah bersama yang lain",
      "Ia tidak membalas pesanku atau ia sudah tidak peduli",
    ],
    answer: 0,
    explanation:
      "Karena salah satu dari dua anteseden pasti benar (premis ketiga), maka salah satu dari dua konsekuen yang berpadanan juga pasti benar: bersama yang lain ATAU sudah tidak peduli.",
  },
  {
    id: "kl1_v16",
    cat: "verbal",
    type: "Silogisme",
    prompt:
      "Jika harga kebutuhan pokok naik, maka daya beli masyarakat berkurang. Jika daya beli masyarakat berkurang, maka sektor UMKM terganggu. Saat ini, harga kebutuhan pokok naik. Simpulan yang tepat adalah….",
    options: [
      "Kenaikan harga hanya berdampak pada UMKM skala kecil",
      "Daya beli masyarakat menurun karena harga naik",
      "Tidak semua UMKM terdampak karena ada yang sudah go digital",
      "Kenaikan harga kebutuhan pokok menyebabkan terganggunya sektor UMKM",
      "Sektor UMKM akan berkembang jika masyarakat tetap konsumtif",
    ],
    answer: 3,
    explanation:
      "Silogisme hipotetis (P→Q, Q→R, P benar, maka R benar): harga naik → daya beli turun → sektor UMKM pasti terganggu.",
  },
  {
    id: "kl1_v18",
    cat: "verbal",
    type: "Penempatan/Urutan",
    prompt:
      "Enam mahasiswa (Alif, Bella, Cinta, Dudi, Eka, Fania) presentasi berurutan posisi 1–6 dengan ketentuan: Alif tidak tampil sebelum Dudi. Bella tampil tepat setelah Cinta. Eka bukan pembicara pertama maupun terakhir. Fania tampil sebelum Cinta, tetapi tidak langsung sebelumnya. Urutan yang sesuai adalah…",
    options: [
      "Fania–Cinta–Bella–Eka–Dudi–Alif",
      "Dudi–Fania–Eka–Cinta–Bella–Alif",
      "Cinta–Bella–Dudi–Fania–Eka–Alif",
      "Dudi–Eka–Fania–Cinta–Bella–Alif",
      "Dudi–Cinta–Bella–Fania–Eka–Alif",
    ],
    answer: 1,
    explanation:
      "Cek opsi B: Dudi sebelum Alif ✓. Cinta langsung diikuti Bella ✓. Eka di posisi 3 (bukan pertama/terakhir) ✓. Fania (pos.2) sebelum Cinta (pos.4) dan tidak langsung sebelumnya (ada Eka di antaranya) ✓. Semua opsi lain melanggar minimal satu syarat.",
  },
  {
    id: "kl1_v19",
    cat: "verbal",
    type: "Penempatan/Urutan",
    prompt:
      "Calon legislatif berkampanye di 5 kecamatan A,B,C,D,E dengan ketentuan: (1) Dapat mengunjungi D jika telah ke C dan E; (2) Tidak bisa ke E sebelum ke A; (3) Kecamatan kedua yang dikunjungi adalah B. Dua kecamatan yang dapat dikunjungi setelah kecamatan E adalah…",
    options: ["Kecamatan A dan B", "Kecamatan C dan D", "Kecamatan D dan A", "Kecamatan E dan B", "Kecamatan B dan C"],
    answer: 1,
    explanation:
      "Susunan valid yang memenuhi ketiga syarat menghasilkan kemungkinan: A-B-C-E-D, A-B-E-C-D, atau C-B-A-E-D. Pada susunan tersebut, kecamatan yang muncul setelah E adalah C dan/atau D.",
  },
  {
    id: "kl1_v20",
    cat: "verbal",
    type: "Penempatan/Urutan",
    prompt:
      "Enam ruang kerja (nomor 1–6) untuk 6 staf dengan aturan: Bu Rati berisik ke ruang sebelahnya. Pak Mara & Pak Bono ingin berdekatan. Bu Heni minta ruang nomor 5. Pak Dedi tak suka terganggu suara. Pak Tasman, Pak Mara, dan Pak Dedi perokok. Bu Heni alergi asap rokok. Tiga karyawan perokok seharusnya ditempatkan di ruang nomor…",
    options: ["1, 2, dan 4", "2, 3, dan 6", "1, 2, dan 3", "2, 3, dan 4", "1, 2, dan 6"],
    answer: 2,
    explanation:
      "Heni=5 (alergi asap) → ruang 4 dan 6 (bersebelahan dengan 5) tidak boleh perokok. Maka 3 perokok (Tasman, Mara, Dedi) harus menempati ruang 1, 2, dan 3.",
  },
  {
    id: "kl1_v21",
    cat: "verbal",
    type: "Penempatan/Urutan",
    prompt:
      "(Lanjutan kasus 6 ruang kerja di atas — Bono=4, Mara=3, Heni=5, Rati=6, Dedi=1, Tasman=2 berdasarkan seluruh aturan.) Ruang kerja yang paling jauh dari ruang kerja Pak Bono adalah ruang kerja…",
    options: ["Bu Heni", "Pak Mara", "Pak Tasman", "Bu Rati", "Pak Dedi"],
    answer: 4,
    explanation: "Pak Bono di ruang 4. Ruang terjauh pada deret 1–6 adalah ruang 1, yaitu ruang Pak Dedi.",
  },
  {
    id: "kl1_v22",
    cat: "verbal",
    type: "Penempatan/Urutan",
    prompt:
      "(Lanjutan kasus 6 ruang kerja di atas.) Ruang kerja yang paling cocok untuk Pak Mara adalah ruang nomor…",
    options: ["2", "6", "1", "3", "4"],
    answer: 3,
    explanation: "Agar Mara berdekatan dengan Bono (ruang 4) sekaligus termasuk kelompok perokok di ruang 1–3, posisi yang konsisten adalah ruang 3.",
  },
  {
    id: "kl1_v23",
    cat: "verbal",
    type: "Penempatan/Urutan",
    prompt:
      "Lima anak Suhartini duduk berurutan dari termuda ke tertua. Diketahui: Adi lebih tua dari Cinta tapi lebih muda dari Dina. Beno lebih tua dari Eka tapi lebih muda dari Cinta. Cinta bukan yang termuda, tapi lebih muda dari Dina. Urutan dari termuda ke tertua adalah….",
    options: [
      "Eka – Beno – Cinta – Dina – Adi",
      "Eka – Beno – Cinta – Adi – Dina",
      "Eka – Cinta – Beno – Dina – Adi",
      "Beno – Eka – Cinta – Adi – Dina",
      "Eka – Beno – Adi – Cinta – Dina",
    ],
    answer: 1,
    explanation:
      "Dari pernyataan: Eka < Beno < Cinta (dari info kedua) dan Cinta < Adi < Dina (dari info pertama). Gabungkan: Eka – Beno – Cinta – Adi – Dina.",
  },

  // ---- Soal latihan tambahan (Try Out Seri 2) ----
  {
    id: "kl2_v1",
    cat: "verbal",
    type: "Sinonim",
    prompt: "Sinonim dari kata \"abstrak\" adalah …",
    options: ["Nyata", "Kabur", "Konkret", "Teoretis", "Faktual"],
    answer: 1,
    explanation: "Abstrak berarti tidak berwujud nyata/sulit digambarkan konkret — padanan terdekatnya adalah kabur (tidak jelas).",
  },
  {
    id: "kl2_v2",
    cat: "verbal",
    type: "Antonim",
    prompt: "PROGRESIF >< …",
    options: ["Stabil", "Stagnan", "Aktif", "Pasif", "Konservatif"],
    answer: 3,
    explanation: "Progresif berarti maju/aktif berkembang. Lawan langsungnya adalah pasif (tidak aktif, tidak berkembang).",
  },
  {
    id: "kl2_v3",
    cat: "verbal",
    type: "Analogi",
    prompt: "LEBAH : MADU = ….. : …..",
    options: ["Kuda : Lari", "Belalai : Gajah", "Sapi : Susu", "Burung : Terbang", "Ayam : Telur"],
    answer: 2,
    explanation: "Hewan menghasilkan produk. Lebah menghasilkan madu; sapi menghasilkan susu.",
  },
  {
    id: "kl2_v4",
    cat: "verbal",
    type: "Analogi",
    prompt: "CAIR : ENCER = …… : KENTAL",
    options: ["Pekat", "Kuat", "Hitam", "Deras", "Padat"],
    answer: 0,
    explanation: "Cair bersifat encer; lawan tingkat kekentalan yang sepadan dengan 'kental' adalah pekat.",
  },
  {
    id: "kl2_v5",
    cat: "verbal",
    type: "Analogi",
    prompt: "TAHU : KEDELAI = …… : ……",
    options: ["Cabe : Sambal", "Susu : Yogurt", "Tomat : Saus", "Roti : Terigu", "Tempe : Kedelai"],
    answer: 4,
    explanation: "Tahu dibuat dari bahan dasar kedelai; tempe juga dibuat dari bahan dasar kedelai — pola produk-bahan dasar yang sama.",
  },
  {
    id: "kl2_v6",
    cat: "verbal",
    type: "Analogi",
    prompt: "PERWIRA MENENGAH : KOLONEL = …… : ……",
    options: [
      "Tamtama : Sersan Kepala",
      "Bintara : Prajurit Satu",
      "Sersan Mayor : Bintara",
      "Tamtama Kepala : Kopral Kepala",
      "Bintara : Sersan Mayor",
    ],
    answer: 4,
    explanation: "Kolonel adalah pangkat tertinggi di kelompok Perwira Menengah; Sersan Mayor adalah pangkat tertinggi di kelompok Bintara.",
  },
  {
    id: "kl2_v7",
    cat: "verbal",
    type: "Analogi",
    prompt: "TEHERAN : IRAN = …… : ……",
    options: ["Barcelona : Spanyol", "Mekkah : Saudi Arabia", "Baghdad : Irak", "Indonesia : Jakarta", "Sydney : Australia"],
    answer: 2,
    explanation: "Teheran adalah ibu kota Iran (kota → negara, dengan kota tersebut adalah ibu kota). Baghdad adalah ibu kota Irak.",
  },
  {
    id: "kl2_v8",
    cat: "verbal",
    type: "Analogi",
    prompt: "MELATI : BUNGA : KEBUN = …… : …… : ……",
    options: [
      "Harimau : Buas : Hutan",
      "Ganggang : Hewan : Laut",
      "Pesut : Ikan : Sungai",
      "Jalak : Hutan : Burung",
      "Mawar : Bunga : Taman",
    ],
    answer: 4,
    explanation: "Pola: jenis – kelompok – tempat hidup. Melati (jenis) – Bunga (kelompok) – Kebun (tempat). Mawar – Bunga – Taman mengikuti pola yang sama.",
  },
  {
    id: "kl2_v9",
    cat: "verbal",
    type: "Silogisme",
    prompt:
      "Semua penerima beasiswa mempunyai prestasi istimewa. Beberapa siswa menerima beasiswa. Kesimpulan yang benar adalah …",
    options: [
      "Semua siswa berprestasi istimewa menerima beasiswa",
      "Tidak ada siswa yang tidak berprestasi istimewa tidak menerima beasiswa",
      "Beberapa siswa mempunyai prestasi istimewa",
      "Ada siswa penerima beasiswa yang tidak mempunyai prestasi istimewa",
      "Semua siswa menerima beasiswa",
    ],
    answer: 2,
    explanation: "Beberapa siswa menerima beasiswa, dan semua penerima beasiswa pasti berprestasi istimewa — maka beberapa siswa (penerima beasiswa itu) mempunyai prestasi istimewa.",
  },
  {
    id: "kl2_v10",
    cat: "verbal",
    type: "Silogisme",
    prompt:
      "Teman yang baik adalah yang dapat menerima keadaan kita. Sebagian teman dari Desa C tidak dapat menerima keadaan kita. Kesimpulan yang tepat adalah …",
    options: [
      "Semua teman di Desa C adalah teman yang tidak baik",
      "Semua teman di Desa C adalah teman yang baik",
      "Sebagian teman di Desa C adalah teman yang baik",
      "Sebagian teman yang baik berasal bukan dari Desa C",
      "Sebagian teman di Desa C adalah teman yang tidak baik",
    ],
    answer: 4,
    explanation: "Kontraposisi: tidak menerima keadaan kita → bukan teman baik. Karena sebagian teman Desa C tidak menerima kita, maka sebagian teman Desa C adalah teman yang tidak baik.",
  },
  {
    id: "kl2_v11",
    cat: "verbal",
    type: "Silogisme",
    prompt:
      "Semua pohon di kebun Pak Deni berdaun hijau. Tara membawa tangkai pohon berdaun kuning. Kesimpulan yang tepat adalah …",
    options: [
      "Tara bukan anak Pak Deni",
      "Tara tidak suka pohon hijau",
      "Anak Pak Deni suka pohon kuning",
      "Tangkai pohon yang dibawa Tara bukan dari kebun Pak Deni",
      "Tara tidak suka menanam pohon",
    ],
    answer: 3,
    explanation: "Karena semua pohon di kebun Pak Deni berdaun hijau, sedangkan tangkai Tara berdaun kuning, maka tangkai itu pasti bukan berasal dari kebun Pak Deni.",
  },
  {
    id: "kl2_v12",
    cat: "verbal",
    type: "Silogisme",
    prompt:
      "Di laboratorium semua peneliti memakai jas laboratorium dan sarung tangan. Budi berada di laboratorium, tetapi tidak memakai keduanya. Kesimpulan yang tepat adalah …",
    options: [
      "Budi seorang peneliti yang tidak memakai jas",
      "Budi seorang peneliti yang tidak memakai sarung tangan",
      "Budi bukan seorang peneliti",
      "Budi seorang asisten peneliti",
      "Budi tidak suka bekerja di laboratorium",
    ],
    answer: 2,
    explanation: "Karena semua peneliti pasti memakai jas dan sarung tangan, dan Budi tidak memakai keduanya, maka Budi tidak memenuhi syarat sebagai peneliti.",
  },
  {
    id: "kl2_v13",
    cat: "verbal",
    type: "Silogisme",
    prompt:
      "Semua elang adalah burung. Sebagian elang terbang ke selatan. Kesimpulan yang tepat adalah …",
    options: [
      "Semua burung adalah elang",
      "Semua elang terbang ke selatan",
      "Sebagian burung yang terbang ke selatan adalah elang",
      "Tidak ada burung yang terbang ke selatan",
      "Semua burung yang terbang ke selatan adalah elang",
    ],
    answer: 2,
    explanation: "Karena elang adalah bagian dari burung, dan sebagian elang terbang ke selatan, maka sebagian burung yang terbang ke selatan pasti termasuk elang.",
  },
  {
    id: "kl2_v14",
    cat: "verbal",
    type: "Silogisme",
    prompt:
      "Pengendara motor yang lewat jalan protokol harus memakai helm. Murid yang bersepeda motor tidak punya helm. Kesimpulan yang tepat adalah …",
    options: [
      "Semua murid bersepeda motor harus mengenakan helm",
      "Semua murid bersepeda motor tidak boleh lewat jalan protokol",
      "Semua murid bersepeda motor boleh lewat jalan protokol",
      "Semua murid tidak boleh lewat jalan protokol",
      "Semua murid bersepeda motor boleh lewat jalan protokol",
    ],
    answer: 1,
    explanation: "Karena helm adalah syarat wajib untuk lewat jalan protokol, dan murid tidak punya helm, maka murid tidak boleh lewat jalan protokol.",
  },
  {
    id: "kl2_v15",
    cat: "verbal",
    type: "Silogisme",
    prompt: "Jika seseorang memakai sandal maka ia memakai sarung dan peci. Budi hanya memakai sarung. Kesimpulan yang tepat adalah …",
    options: [
      "Budi menggunakan sepatu",
      "Budi tidak menggunakan sandal",
      "Budi tidak menggunakan peci",
      "Budi menggunakan sandal tetapi tidak memakai peci",
      "Budi menggunakan sandal atau Budi tidak menggunakan peci",
    ],
    answer: 1,
    explanation: "Karena memakai sandal mengharuskan memakai sarung DAN peci, sedangkan Budi tidak memakai peci, maka Budi tidak memenuhi syarat memakai sandal.",
  },
  {
    id: "kl2_v16",
    cat: "verbal",
    type: "Silogisme",
    prompt:
      "Jika peserta memiliki kemampuan penalaran numerik yang baik maka ia akan mendapatkan skor TBS tinggi. Jika peserta mendapatkan skor TBS tinggi maka ia berpeluang besar lolos seleksi. Kesimpulan yang tepat adalah …",
    options: [
      "Jika tidak lolos substansi maka tidak memiliki kemampuan numerik yang baik",
      "Jika lolos substansi maka memiliki kemampuan numerik yang baik",
      "Jika memiliki kemampuan numerik yang baik maka berpeluang lolos substansi",
      "Jika tidak memiliki kemampuan numerik maka pasti gagal seleksi",
      "Jika tidak mendapat skor TBS tinggi maka tidak memiliki kemampuan numerik",
    ],
    answer: 2,
    explanation: "Silogisme hipotetis: numerik baik → skor tinggi → peluang lolos substansi. Maka: numerik baik → berpeluang lolos substansi.",
  },

  // ---- Dari materi "Dunia Pendidikan Official — TBS PDDI 2026, 24 Juli" ----
  {
    id: "dp_v1",
    cat: "verbal",
    type: "Sinonim",
    prompt: "Kata yang paling dekat maknanya dengan \"implisit\" adalah ...",
    options: ["terperinci", "tersirat", "terbuka", "terukur", "terpisah"],
    answer: 1,
    explanation: "Implisit berarti tidak dinyatakan secara langsung, tetapi terkandung/dapat dipahami dari konteks — padanan terdekatnya 'tersirat'.",
  },
  {
    id: "dp_v2",
    cat: "verbal",
    type: "Antonim",
    prompt: "Lawan kata yang paling tepat untuk \"sporadis\" adalah ...",
    options: ["teratur", "tersebar", "sementara", "terbatas", "mendadak"],
    answer: 0,
    explanation: "Sporadis berarti terjadi tidak menentu/terpencar/sesekali. Lawan langsungnya adalah teratur (berlangsung dengan pola tetap).",
  },
  {
    id: "dp_v3",
    cat: "verbal",
    type: "Analogi",
    prompt: "TERMOMETER : SUHU = BAROMETER : ...",
    options: ["angin", "tekanan udara", "hujan", "kelembapan", "ketinggian"],
    answer: 1,
    explanation: "Termometer mengukur suhu; dengan hubungan alat-besaran yang sama, barometer mengukur tekanan udara.",
  },
  {
    id: "dp_v4",
    cat: "verbal",
    type: "Klasifikasi",
    prompt: "Manakah yang berbeda dari kelompok berikut?",
    options: ["tesis", "disertasi", "artikel", "monograf", "seminar"],
    answer: 4,
    explanation: "Tesis, disertasi, artikel, dan monograf adalah bentuk karya tulis ilmiah. Seminar adalah kegiatan/forum, bukan bentuk naskah tertulis — jadi pencilan kelompok.",
  },
  {
    id: "dp_v5",
    cat: "verbal",
    type: "Bacaan",
    prompt:
      "Bacaan: 'Kecerdasan buatan (AI) membantu peneliti mengolah data besar dengan cepat, namun hasil analisisnya tetap perlu diperiksa secara ilmiah karena algoritma dapat membawa bias.' Gagasan utama paragraf tersebut adalah ...",
    options: [
      "AI selalu menghasilkan analisis salah",
      "Peneliti tidak lagi membutuhkan pertimbangan ilmiah",
      "AI bermanfaat, tetapi hasilnya tetap memerlukan pemeriksaan ilmiah",
      "Data besar tidak dapat dianalisis manusia",
      "Algoritma tidak pernah memakai data pelatihan",
    ],
    answer: 2,
    explanation: "Paragraf menyatakan dua hal: AI membantu (manfaat) TAPI hasilnya perlu diperiksa (keterbatasan). Opsi C merangkum keduanya tanpa berlebihan seperti opsi lain.",
  },
  {
    id: "dp_v6",
    cat: "verbal",
    type: "Silogisme",
    prompt:
      "Semua peneliti doktoral menggunakan metode sistematis. Sebagian dosen adalah peneliti doktoral. Kesimpulan yang sah adalah ...",
    options: [
      "semua dosen menggunakan metode sistematis",
      "sebagian dosen menggunakan metode sistematis",
      "tidak ada dosen yang menggunakan metode sistematis",
      "semua pengguna metode sistematis adalah dosen",
    ],
    answer: 1,
    explanation: "Karena hanya 'sebagian' dosen yang peneliti doktoral, kesimpulan juga harus 'sebagian' — tidak boleh diperluas jadi 'semua'.",
  },
  {
    id: "dp_v7",
    cat: "verbal",
    type: "Silogisme",
    prompt:
      "Jika peserta mengikuti simulasi, maka peserta memahami prosedur sistem tes. Seorang peserta tidak memahami prosedur sistem tes. Kesimpulan yang tepat adalah ...",
    options: [
      "peserta tersebut mengikuti simulasi",
      "peserta tersebut tidak mengikuti simulasi",
      "semua peserta tidak mengikuti simulasi",
      "tidak dapat disimpulkan",
    ],
    answer: 1,
    explanation: "Modus tollens: P→Q, ¬Q, maka ¬P. Karena peserta tidak memahami prosedur (¬Q), maka ia tidak mengikuti simulasi (¬P).",
  },
  {
    id: "dp_v8",
    cat: "verbal",
    type: "Negasi",
    prompt: "Negasi dari pernyataan \"Semua peserta lulus seleksi administrasi\" adalah ...",
    options: [
      "semua peserta tidak lulus",
      "tidak ada peserta yang lulus",
      "ada peserta yang tidak lulus seleksi administrasi",
      "sebagian peserta lulus",
      "sebagian peserta mungkin lulus",
    ],
    answer: 2,
    explanation: "Negasi dari kuantor universal 'semua' bukan 'semua tidak', melainkan 'ada (minimal satu) yang tidak'.",
  },
  {
    id: "dp_v9",
    cat: "verbal",
    type: "Silogisme",
    prompt:
      "Jika proposal lengkap, maka proposal dapat dinilai. Proposal Rina dapat dinilai. Kesimpulan yang pasti benar adalah ...",
    options: [
      "proposal Rina pasti lengkap",
      "proposal Rina pasti tidak lengkap",
      "mungkin lengkap, tetapi tidak dapat dipastikan",
      "semua proposal dapat dinilai",
    ],
    answer: 2,
    explanation: "Ini jebakan 'mengafirmasi konsekuen': dari P→Q dan Q benar, tidak bisa otomatis disimpulkan P. Proposal Rina bisa saja dinilai karena alasan lain — kelengkapannya tidak dapat dipastikan.",
  },
  {
    id: "dp_v10",
    cat: "verbal",
    type: "Sinonim",
    prompt: "Sinonim \"kredibel\" adalah ...",
    options: ["terkenal", "dapat dipercaya", "rahasia", "mudah berubah"],
    answer: 1,
    explanation: "Kredibel berarti layak dipercaya — bukan sekadar terkenal (popularitas tidak menjamin keandalan).",
  },
  {
    id: "dp_v11",
    cat: "verbal",
    type: "Antonim",
    prompt: "Antonim \"stagnan\" adalah ...",
    options: ["tetap", "lambat", "berkembang", "tertunda"],
    answer: 2,
    explanation: "Stagnan berarti tidak bergerak/tidak berkembang. Lawan langsungnya adalah berkembang.",
  },
  {
    id: "dp_v12",
    cat: "verbal",
    type: "Negasi",
    prompt: "Negasi \"semua peserta hadir\" adalah ...",
    options: ["semua tidak hadir", "ada peserta tidak hadir", "tidak ada peserta", "sebagian hadir"],
    answer: 1,
    explanation: "Negasi kuantor universal: 'semua peserta hadir' menjadi salah jika ada (minimal satu) peserta yang tidak hadir.",
  },

  // ---- Dari "Kunci Jawaban TBS Pertemuan 1 BPDDI 2026" (rekonstruksi dari pembahasan) ----
  {
    id: "kj1_v22",
    cat: "verbal",
    type: "Silogisme",
    prompt: "Semua peserta kelas intensif mengikuti evaluasi. Andi tidak mengikuti evaluasi. Kesimpulan yang tepat adalah...",
    options: [
      "Andi peserta kelas intensif yang belum evaluasi",
      "Andi bukan peserta kelas intensif",
      "Semua peserta kelas intensif adalah Andi",
      "Evaluasi tidak wajib bagi kelas intensif",
      "Tidak dapat disimpulkan",
    ],
    answer: 1,
    explanation: "Modus tollens: karena semua peserta kelas intensif pasti mengikuti evaluasi, dan Andi tidak mengikuti evaluasi, maka Andi bukan peserta kelas intensif.",
  },
  {
    id: "kj1_v23",
    cat: "verbal",
    type: "Silogisme",
    prompt: "Sebagian dosen adalah peneliti. Semua peneliti membaca artikel ilmiah. Kesimpulan yang tepat adalah...",
    options: [
      "Semua dosen membaca artikel ilmiah",
      "Sebagian dosen membaca artikel ilmiah",
      "Tidak ada dosen yang membaca artikel ilmiah",
      "Semua yang membaca artikel ilmiah adalah dosen",
      "Tidak dapat disimpulkan",
    ],
    answer: 1,
    explanation: "Karena hanya 'sebagian' dosen adalah peneliti, dan semua peneliti membaca artikel ilmiah, maka sebagian dosen (yang peneliti itu) pasti membaca artikel ilmiah.",
  },

  // ---- Dari "Modul TBS Pertemuan 1 BPDDI 2026 — Tes Diagnostik" (soal lengkap, cross-check kunci) ----
  {
    id: "td1_v3",
    cat: "verbal",
    type: "Analogi",
    prompt: "HIPOTESIS : PENGUJIAN memiliki hubungan yang paling sepadan dengan …",
    options: ["dugaan : pembuktian", "data : penyimpanan", "teori : referensi", "buku : pembaca", "dosen : mahasiswa"],
    answer: 0,
    explanation: "Hipotesis adalah dugaan yang perlu diuji (dibuktikan). Pola yang sama: dugaan memerlukan pembuktian.",
  },
  {
    id: "td1_v4",
    cat: "verbal",
    type: "Klasifikasi",
    prompt: "Manakah kata yang tidak termasuk dalam kelompok yang sama?",
    options: ["observasi", "wawancara", "angket", "eksperimen", "hipotesis"],
    answer: 4,
    explanation: "Observasi, wawancara, angket, dan eksperimen adalah TEKNIK pengumpulan data. Hipotesis adalah dugaan awal penelitian, bukan teknik pengumpulan data — jadi pencilan kelompok.",
  },
  {
    id: "td1_v5",
    cat: "verbal",
    type: "Bacaan",
    prompt:
      "Bacaan: 'Transformasi digital di perguruan tinggi tidak cukup dilakukan dengan menyediakan perangkat dan aplikasi. Keberhasilan transformasi juga ditentukan oleh kapasitas dosen, tata kelola data, dukungan pimpinan, serta budaya organisasi yang mendorong eksperimen dan pembelajaran berkelanjutan. Tanpa perubahan pada aspek manusia dan organisasi, teknologi berisiko hanya menjadi pelengkap administratif.' Gagasan utama bacaan tersebut adalah …",
    options: [
      "Perangkat digital merupakan faktor tunggal keberhasilan transformasi",
      "Transformasi digital memerlukan perubahan teknologi, manusia, dan organisasi",
      "Aplikasi sebaiknya hanya digunakan untuk administrasi",
      "Dosen tidak membutuhkan pelatihan digital",
      "Budaya organisasi tidak berhubungan dengan teknologi",
    ],
    answer: 1,
    explanation: "Bacaan menegaskan bahwa transformasi digital butuh LEBIH dari sekadar perangkat — juga perubahan pada manusia dan organisasi. Opsi B merangkum inti ini tanpa berlebihan seperti opsi lain.",
  },
  {
    id: "td1_v6",
    cat: "verbal",
    type: "Bacaan",
    prompt: "(Bacaan yang sama tentang transformasi digital.) Simpulan yang paling didukung oleh bacaan adalah …",
    options: [
      "Pengadaan teknologi selalu meningkatkan mutu perguruan tinggi",
      "Teknologi tidak diperlukan dalam transformasi digital",
      "Keberhasilan transformasi digital bergantung pada integrasi faktor teknis dan nonteknis",
      "Pimpinan perguruan tinggi tidak perlu terlibat",
      "Tata kelola data lebih penting daripada seluruh faktor lain",
    ],
    answer: 2,
    explanation: "Bacaan menyebutkan beberapa faktor (kapasitas dosen, tata kelola data, dukungan pimpinan, budaya organisasi) sebagai penentu keberhasilan BERSAMA teknologi — mendukung simpulan bahwa keberhasilan bergantung pada integrasi faktor teknis dan nonteknis.",
  },
  {
    id: "td1_v7",
    cat: "verbal",
    type: "Negasi",
    prompt: "Pernyataan \"Tidak semua peserta menyelesaikan latihan tepat waktu\" setara dengan …",
    options: [
      "Semua peserta terlambat",
      "Sebagian peserta tidak menyelesaikan latihan tepat waktu",
      "Tidak ada peserta yang tepat waktu",
      "Sebagian peserta pasti tepat waktu",
      "Semua peserta menyelesaikan latihan",
    ],
    answer: 1,
    explanation: "'Tidak semua X' setara dengan 'ada/sebagian X yang tidak' — bukan 'semua tidak' (terlalu kuat) maupun pernyataan lain yang berlebihan.",
  },
  {
    id: "td1_v8",
    cat: "verbal",
    type: "Fakta vs Opini",
    prompt: "Kalimat yang merupakan OPINI adalah …",
    options: [
      "TBS dilaksanakan berbasis komputer",
      "Pengumuman hasil disampaikan melalui akun pendaftar",
      "Latihan setiap hari adalah cara paling efektif bagi semua peserta",
      "TBS merupakan salah satu tahap seleksi",
      "Simulasi TBS dijadwalkan sebelum pelaksanaan tes",
    ],
    answer: 2,
    explanation: "Opsi C mengandung penilaian subjektif ('paling efektif bagi SEMUA peserta') yang tidak bisa diverifikasi secara objektif seperti fakta — ciri khas opini/klaim berlebihan.",
  },
  {
    id: "td1_v21",
    cat: "verbal",
    type: "Sebab-Akibat",
    prompt: "Pernyataan manakah yang paling menunjukkan hubungan SEBAB-AKIBAT?",
    options: [
      "Peserta membawa laptop dan mengenakan kemeja putih",
      "Nilai latihan meningkat setelah peserta mengikuti latihan terstruktur secara konsisten",
      "Peserta A dan B sama-sama hadir tepat waktu",
      "Jumlah peserta bertambah bersamaan dengan turunnya hujan",
      "Kelas berlangsung malam hari dan menggunakan Zoom",
    ],
    answer: 1,
    explanation: "Opsi B menyatakan urutan logis sebab (latihan terstruktur konsisten) diikuti akibat (nilai meningkat). Opsi lain hanya menyatakan kejadian yang bersamaan (korelasi), bukan hubungan sebab-akibat yang jelas.",
  },

  // ---- Dari "Mentoring BPDDI 2026 — Penalaran Verbal dan Pemahaman Bacaan" ----
  {
    id: "mtv_1",
    cat: "verbal",
    type: "Sinonim",
    prompt: "Sinonim kata RELEVAN adalah ...",
    options: ["terpisah", "berkaitan", "berlebihan", "terlambat", "terbatas"],
    answer: 1,
    explanation: "Relevan berarti mempunyai hubungan/kaitan dengan pokok pembahasan. Padanan terdekat: berkaitan.",
  },
  {
    id: "mtv_2",
    cat: "verbal",
    type: "Sinonim",
    prompt: "Sinonim kata KREDIBEL adalah ...",
    options: ["dapat dipercaya", "mudah berubah", "sulit dipahami", "sangat terkenal", "bersifat rahasia"],
    answer: 0,
    explanation: "Kredibel berarti layak dipercaya karena memiliki dasar/integritas/reputasi baik — bukan sekadar terkenal (popularitas ≠ keandalan).",
  },
  {
    id: "mtv_3",
    cat: "verbal",
    type: "Sinonim",
    prompt: "Sinonim kata KONVENSIONAL adalah ...",
    options: ["modern", "tradisional", "individual", "sementara", "menyeluruh"],
    answer: 1,
    explanation: "Konvensional berarti mengikuti kebiasaan/cara yang sudah umum dan lama digunakan — padanan terdekat: tradisional.",
  },
  {
    id: "mtv_4",
    cat: "verbal",
    type: "Antonim",
    prompt: "Antonim kata EKSPLISIT adalah ...",
    options: ["jelas", "langsung", "tersirat", "tegas", "terbuka"],
    answer: 2,
    explanation: "Eksplisit berarti dinyatakan jelas dan langsung. Lawannya adalah tersirat (implisit) — tidak dinyatakan langsung tetapi dipahami dari konteks.",
  },
  {
    id: "mtv_5",
    cat: "verbal",
    type: "Antonim",
    prompt: "Antonim kata STAGNAN adalah ...",
    options: ["diam", "tetap", "berkembang", "lambat", "tertunda"],
    answer: 2,
    explanation: "Stagnan berarti tidak mengalami kemajuan/perkembangan. Lawan paling tepat: berkembang (bukan sekadar 'cepat', karena sesuatu yang lambat masih bisa bergerak maju).",
  },
  {
    id: "mtv_6",
    cat: "verbal",
    type: "Antonim",
    prompt: "Antonim kata INKLUSIF adalah ...",
    options: ["terbuka", "menyeluruh", "eksklusif", "partisipatif", "kolektif"],
    answer: 2,
    explanation: "Inklusif berarti melibatkan/membuka ruang bagi berbagai pihak. Eksklusif berarti terbatas pada kelompok tertentu — lawan yang tepat.",
  },
  {
    id: "mtv_7",
    cat: "verbal",
    type: "Analogi",
    prompt: "TERMOMETER : SUHU = BAROMETER : ...",
    options: ["angin", "tekanan udara", "hujan", "kelembapan", "ketinggian"],
    answer: 1,
    explanation: "Termometer mengukur suhu; barometer mengukur tekanan udara. Pola: alat ukur terhadap besaran yang diukur.",
  },
  {
    id: "mtv_8",
    cat: "verbal",
    type: "Analogi",
    prompt: "EDITOR : NASKAH = KURATOR : ...",
    options: ["museum", "koleksi", "pengunjung", "seniman", "pameran"],
    answer: 1,
    explanation: "Editor menyeleksi/mengelola naskah; kurator menyeleksi/mengelola koleksi. Pola: profesi terhadap objek yang dikelola (bukan tempat kerja).",
  },
  {
    id: "mtv_9",
    cat: "verbal",
    type: "Analogi",
    prompt: "PREMIS : SIMPULAN = DATA : ...",
    options: ["instrumen", "responden", "temuan", "populasi", "variabel"],
    answer: 2,
    explanation: "Simpulan diturunkan dari premis; temuan diperoleh dari pengolahan data. Pola: bahan dasar penalaran terhadap hasil yang dihasilkan.",
  },
  {
    id: "mtv_10",
    cat: "verbal",
    type: "Analogi",
    prompt: "VAKSIN : KEKEBALAN = PENDIDIKAN : ...",
    options: ["sekolah", "kompetensi", "guru", "ijazah", "kurikulum"],
    answer: 1,
    explanation: "Vaksin diberikan untuk membentuk kekebalan; pendidikan dilaksanakan untuk membentuk kompetensi. Pola: upaya terhadap hasil utama.",
  },
  {
    id: "mtv_11",
    cat: "verbal",
    type: "Analogi",
    prompt: "BUKU : PERPUSTAKAAN = ARTEFAK : ...",
    options: ["laboratorium", "museum", "sekolah", "pasar", "studio"],
    answer: 1,
    explanation: "Buku dihimpun/disimpan di perpustakaan; artefak dihimpun/disimpan di museum. Pola: benda terhadap tempat penyimpanan/koleksinya.",
  },
  {
    id: "mtv_12",
    cat: "verbal",
    type: "Analogi",
    prompt: "HAKIM : PUTUSAN = PENELITI : ...",
    options: ["laboratorium", "responden", "temuan", "hipotesis", "instrumen"],
    answer: 2,
    explanation: "Hakim menghasilkan putusan; peneliti menghasilkan temuan. Pola: profesi terhadap hasil utama pekerjaan (responden/instrumen hanya alat bantu, bukan hasil akhir).",
  },
  {
    id: "mtv_13",
    cat: "verbal",
    type: "Klasifikasi",
    prompt: "Manakah yang berbeda dari kelompok berikut?",
    options: ["tesis", "disertasi", "artikel", "monograf", "seminar"],
    answer: 4,
    explanation: "Tesis, disertasi, artikel, dan monograf adalah bentuk karya tulis ilmiah. Seminar adalah kegiatan/forum, bukan jenis karya tulis.",
  },
  {
    id: "mtv_14",
    cat: "verbal",
    type: "Klasifikasi",
    prompt: "Manakah yang berbeda dari kelompok berikut?",
    options: ["meter", "liter", "kilogram", "sekon", "suhu"],
    answer: 4,
    explanation: "Meter, liter, kilogram, dan sekon adalah satuan pengukuran. Suhu adalah BESARAN yang diukur, satuannya Celsius/Kelvin — jadi berbeda kategori.",
  },
  {
    id: "mtv_15",
    cat: "verbal",
    type: "Klasifikasi",
    prompt: "Manakah yang berbeda dari kelompok berikut?",
    options: ["deduksi", "induksi", "analogi", "inferensi", "observasi"],
    answer: 4,
    explanation: "Deduksi, induksi, analogi, dan inferensi adalah proses/bentuk penalaran (berpikir). Observasi adalah kegiatan pengamatan untuk memperoleh data — beda kategori.",
  },
  {
    id: "mtv_16",
    cat: "verbal",
    type: "Bacaan",
    prompt:
      "Bacaan: 'Pembelajaran digital memberikan fleksibilitas karena materi dapat diakses tanpa bergantung pada ruang kelas. Namun, fleksibilitas tidak otomatis menghasilkan pembelajaran yang efektif. Peserta tetap memerlukan perangkat memadai, koneksi stabil, serta kemampuan mengatur waktu dan mempertahankan perhatian. Karena itu, kebijakan pembelajaran digital perlu menggabungkan penyediaan teknologi dengan pendampingan keterampilan belajar mandiri.' Gagasan utama bacaan adalah ...",
    options: [
      "Pembelajaran digital selalu lebih efektif daripada tatap muka",
      "Fleksibilitas pembelajaran digital perlu didukung teknologi dan keterampilan belajar mandiri",
      "Koneksi internet merupakan satu-satunya syarat pembelajaran",
      "Ruang kelas tidak lagi diperlukan dalam pendidikan",
      "Semua peserta mampu mengatur waktu secara mandiri",
    ],
    answer: 1,
    explanation: "Bacaan menegaskan bahwa fleksibilitas digital perlu ditopang sarana teknologi DAN keterampilan belajar mandiri — opsi B mencakup keseluruhan gagasan tanpa berlebihan seperti opsi lain.",
  },
  {
    id: "mtv_17",
    cat: "verbal",
    type: "Inferensi",
    prompt: "(Bacaan pembelajaran digital yang sama.) Inferensi yang paling tepat adalah ...",
    options: [
      "Pembagian perangkat saja belum tentu menjamin efektivitas pembelajaran digital",
      "Peserta yang memiliki perangkat pasti memperoleh nilai tinggi",
      "Pembelajaran digital tidak memerlukan pendampingan",
      "Keterampilan mengatur waktu tidak dapat dilatih",
      "Pembelajaran tatap muka selalu gagal",
    ],
    answer: 0,
    explanation: "Karena teks menyatakan teknologi harus digabung dengan keterampilan belajar mandiri, maka pemberian perangkat saja belum menjamin efektivitas — opsi lain terlalu pasti atau bertentangan dengan teks.",
  },
  {
    id: "mtv_18",
    cat: "verbal",
    type: "Bacaan",
    prompt: "(Bacaan pembelajaran digital yang sama.) Pernyataan yang sesuai dengan bacaan adalah ...",
    options: [
      "Fleksibilitas otomatis menjamin efektivitas",
      "Teknologi tidak berkaitan dengan pembelajaran digital",
      "Efektivitas dipengaruhi sarana dan kemampuan belajar mandiri",
      "Perhatian peserta tidak memengaruhi proses belajar",
      "Kebijakan cukup berfokus pada perangkat",
    ],
    answer: 2,
    explanation: "Bacaan secara langsung menyatakan efektivitas dipengaruhi sarana teknologi DAN kemampuan peserta mengelola belajar — sesuai persis dengan opsi C.",
  },
  {
    id: "mtv_19",
    cat: "verbal",
    type: "Bacaan",
    prompt:
      "Bacaan: 'Kolaborasi lintas disiplin memungkinkan suatu masalah ditinjau dari berbagai sudut pandang. Dalam penelitian kesehatan digital, misalnya, ahli teknologi merancang sistem, tenaga kesehatan menilai aspek klinis, dan ahli sosial memahami penerimaan pengguna. Meski demikian, perbedaan istilah dan metode dapat menimbulkan salah pengertian. Kolaborasi akan lebih efektif apabila tim menyepakati tujuan, pembagian peran, dan kerangka kerja bersama sejak awal.' Gagasan utama bacaan adalah ...",
    options: [
      "Kolaborasi lintas disiplin tidak dapat dilakukan",
      "Ahli teknologi merupakan anggota terpenting dalam penelitian",
      "Kolaborasi lintas disiplin bermanfaat, tetapi memerlukan kesepakatan kerja yang jelas",
      "Perbedaan metode harus dihilangkan sepenuhnya",
      "Penelitian kesehatan digital hanya membutuhkan tenaga kesehatan",
    ],
    answer: 2,
    explanation: "Bacaan membahas manfaat keberagaman keahlian SEKALIGUS risiko salah pengertian dan kebutuhan kesepakatan — opsi C merangkum kedua sisi ini.",
  },
  {
    id: "mtv_20",
    cat: "verbal",
    type: "Kosakata dalam Konteks",
    prompt: "(Bacaan kolaborasi lintas disiplin yang sama.) Istilah \"kerangka kerja bersama\" dalam bacaan paling dekat berarti ...",
    options: [
      "tempat kerja yang sama",
      "pedoman yang disepakati untuk mengarahkan kerja tim",
      "perangkat lunak yang digunakan semua anggota",
      "jadwal kerja tanpa pembagian tugas",
      "aturan yang dibuat setelah penelitian selesai",
    ],
    answer: 1,
    explanation: "Kerangka kerja bersama adalah pedoman/pendekatan/aturan kerja yang disepakati agar anggota tim memahami arah dan cara kerja yang sama — bukan sekadar tempat fisik.",
  },
  {
    id: "mtv_21",
    cat: "verbal",
    type: "Inferensi",
    prompt: "(Bacaan kolaborasi lintas disiplin yang sama.) Inferensi yang tepat adalah ...",
    options: [
      "Keahlian beragam selalu otomatis menghasilkan kolaborasi efektif",
      "Kesalahpahaman dapat berkurang jika istilah dan peran disepakati sejak awal",
      "Tim harus menggunakan satu disiplin ilmu saja",
      "Penerimaan pengguna tidak relevan dalam kesehatan digital",
      "Metode penelitian tidak perlu dibicarakan",
    ],
    answer: 1,
    explanation: "Jika istilah, tujuan, dan peran disepakati sejak awal, potensi salah pengertian berkurang — logis mengikuti pernyataan bacaan tentang pentingnya kesepakatan.",
  },
  {
    id: "mtv_22",
    cat: "verbal",
    type: "Simpulan",
    prompt: "(Bacaan kolaborasi lintas disiplin yang sama.) Simpulan bacaan adalah ...",
    options: [
      "Kolaborasi berhasil apabila satu ahli mengambil seluruh keputusan",
      "Manfaat kolaborasi lintas disiplin dapat dioptimalkan melalui tujuan, peran, dan kerangka kerja yang disepakati",
      "Perbedaan disiplin merupakan hambatan yang tidak dapat diatasi",
      "Kolaborasi hanya cocok untuk penelitian teknologi",
      "Semakin banyak anggota, semakin baik hasil penelitian",
    ],
    answer: 1,
    explanation: "Simpulan menggabungkan manfaat kolaborasi dengan syarat keberhasilannya (tujuan, pembagian peran, kerangka kerja disepakati) — merangkum keseluruhan bacaan tanpa berlebihan.",
  },
  {
    id: "mtv_23",
    cat: "verbal",
    type: "Fakta vs Opini",
    prompt:
      "Bacaan: 'Sebuah kampus memasang panel surya atap pada tiga gedung. Pada tahun pertama, pembelian listrik dari jaringan berkurang 18 persen. Produksi energi menurun pada musim hujan. Tim pengelola sedang mempertimbangkan penyimpanan baterai, tetapi investasi awalnya cukup besar. Keputusan penambahan baterai akan didasarkan pada analisis biaya, pola konsumsi, dan kebutuhan cadangan listrik.' Pernyataan yang merupakan FAKTA berdasarkan bacaan adalah ...",
    options: [
      "Panel surya merupakan pilihan energi terbaik untuk semua kampus",
      "Pembelian listrik dari jaringan berkurang 18 persen pada tahun pertama",
      "Baterai pasti akan dipasang tahun berikutnya",
      "Musim hujan seharusnya tidak memengaruhi produksi energi",
      "Biaya baterai terlalu mahal untuk kampus mana pun",
    ],
    answer: 1,
    explanation: "Angka 18 persen dinyatakan langsung dan dapat diverifikasi — sebuah fakta. Opsi lain memuat penilaian ('terbaik'), kepastian yang tidak dijamin ('pasti'), atau klaim tanpa dasar.",
  },
  {
    id: "mtv_24",
    cat: "verbal",
    type: "Fakta vs Opini",
    prompt: "(Bacaan panel surya yang sama.) Pernyataan yang merupakan OPINI adalah ...",
    options: [
      "Panel dipasang pada tiga gedung",
      "Produksi energi menurun pada musim hujan",
      "Kampus sebaiknya segera membeli baterai tanpa analisis tambahan",
      "Pembelian listrik berkurang pada tahun pertama",
      "Tim mempertimbangkan penyimpanan baterai",
    ],
    answer: 2,
    explanation: "Kata 'sebaiknya' menunjukkan saran/penilaian. Bacaan justru menyatakan keputusan baterai akan didasarkan pada analisis — sehingga anjuran membeli tanpa analisis adalah opini.",
  },
  {
    id: "mtv_25",
    cat: "verbal",
    type: "Inferensi",
    prompt: "(Bacaan panel surya yang sama.) Inferensi yang paling tepat adalah ...",
    options: [
      "Panel surya tidak menghasilkan energi sama sekali pada musim hujan",
      "Penyimpanan baterai mungkin membantu menyediakan cadangan ketika produksi surya menurun",
      "Kampus tidak memerlukan listrik pada malam hari",
      "Analisis biaya tidak relevan terhadap keputusan investasi",
      "Pengurangan pembelian listrik pasti terus sebesar 18 persen setiap tahun",
    ],
    answer: 1,
    explanation: "Karena produksi surya menurun pada kondisi tertentu, baterai secara logis dapat menyediakan cadangan — kata 'mungkin' menjaga inferensi tetap hati-hati sesuai tingkat kepastian data.",
  },
  {
    id: "mtv_26",
    cat: "verbal",
    type: "Simpulan",
    prompt: "(Bacaan panel surya yang sama.) Simpulan bacaan adalah ...",
    options: [
      "Panel surya telah mengurangi pembelian listrik, sedangkan keputusan baterai memerlukan analisis lebih lanjut",
      "Panel surya gagal karena produksi menurun pada musim hujan",
      "Baterai selalu lebih penting daripada panel surya",
      "Kampus akan menghentikan penggunaan energi surya",
      "Investasi energi tidak memerlukan pola konsumsi",
    ],
    answer: 0,
    explanation: "Bacaan menunjukkan hasil positif panel surya, kendala musiman, dan perlunya analisis sebelum investasi baterai — opsi A merangkum semuanya tanpa melebih-lebihkan.",
  },
  {
    id: "mtv_27",
    cat: "verbal",
    type: "Bacaan",
    prompt:
      "Bacaan: 'Survei terhadap 600 mahasiswa menemukan hubungan positif antara frekuensi membaca artikel panjang dan skor penalaran kritis. Namun, penelitian ini bersifat korelasional sehingga tidak dapat memastikan bahwa kebiasaan membaca menjadi penyebab langsung. Faktor lain, seperti minat akademik dan kebiasaan berdiskusi, mungkin turut berpengaruh.' Gagasan utama bacaan adalah ...",
    options: [
      "Membaca artikel panjang pasti menyebabkan skor kritis meningkat",
      "Terdapat hubungan antara kebiasaan membaca dan penalaran kritis, tetapi hubungan sebab-akibat belum dapat dipastikan",
      "Survei tidak berguna untuk penelitian pendidikan",
      "Semua mahasiswa yang suka berdiskusi memperoleh skor tinggi",
      "Minat akademik tidak memengaruhi penalaran",
    ],
    answer: 1,
    explanation: "Inti teks adalah hubungan positif antara membaca dan penalaran, TAPI desain korelasional tidak cukup untuk menyimpulkan sebab-akibat — opsi B menangkap keduanya secara hati-hati.",
  },
  {
    id: "mtv_28",
    cat: "verbal",
    type: "Inferensi",
    prompt: "(Bacaan survei membaca yang sama.) Inferensi yang tepat adalah ...",
    options: [
      "Penelitian lanjutan diperlukan untuk menguji apakah membaca artikel panjang benar-benar menyebabkan peningkatan penalaran",
      "Jumlah 600 responden membuktikan hubungan kausal",
      "Kebiasaan berdiskusi pasti tidak berpengaruh",
      "Mahasiswa yang jarang membaca tidak mampu berpikir kritis",
      "Skor penalaran hanya ditentukan oleh minat akademik",
    ],
    answer: 0,
    explanation: "Karena penelitian korelasional belum membuktikan kausalitas, diperlukan penelitian lanjutan (mis. eksperimen/longitudinal) untuk menguji hubungan sebab-akibat.",
  },
  {
    id: "mtv_29",
    cat: "verbal",
    type: "Bacaan",
    prompt: "(Bacaan survei membaca yang sama.) Pernyataan yang TIDAK DAPAT dibenarkan berdasarkan bacaan adalah ...",
    options: [
      "Terdapat hubungan positif antara dua variabel",
      "Penelitian melibatkan 600 mahasiswa",
      "Kebiasaan membaca merupakan penyebab tunggal peningkatan skor",
      "Faktor lain mungkin ikut berpengaruh",
      "Penelitian bersifat korelasional",
    ],
    answer: 2,
    explanation: "Teks secara tegas menyatakan penyebab langsung belum dapat dipastikan dan ada faktor lain — sehingga klaim 'penyebab tunggal' tidak dapat dibenarkan oleh bacaan.",
  },
  {
    id: "mtv_30",
    cat: "verbal",
    type: "Simpulan",
    prompt: "(Bacaan survei membaca yang sama.) Simpulan yang paling tepat adalah ...",
    options: [
      "Kebiasaan membaca tidak berhubungan dengan penalaran kritis",
      "Hubungan yang ditemukan menarik, tetapi perlu penelitian lebih kuat sebelum menyatakan sebab-akibat",
      "Survei telah membuktikan semua faktor yang memengaruhi penalaran",
      "Membaca panjang harus diwajibkan karena pasti meningkatkan skor",
      "Pengalaman belajar tidak perlu diteliti",
    ],
    answer: 1,
    explanation: "Simpulan paling tepat mempertahankan dua hal: temuan hubungan itu penting, tetapi belum cukup kuat untuk pernyataan kausal — opsi lain terlalu mutlak atau bertentangan dengan teks.",
  },

  {
    id: "td1_k10",
    cat: "kuantitatif",
    type: "Perbandingan",
    prompt: "Perbandingan peserta kelompok A dan B adalah 3 : 5. Jika jumlah seluruh peserta 96 orang, jumlah peserta kelompok A adalah …",
    options: ["32", "36", "40", "56", "60"],
    answer: 1,
    explanation: "Jumlah bagian = 3+5=8. Nilai 1 bagian = 96÷8=12. Kelompok A = 3×12 = 36.",
  },
  {
    id: "td1_k30",
    cat: "kuantitatif",
    type: "Himpunan",
    prompt: "Dalam kelompok 30 peserta, setiap orang memilih tepat satu fokus latihan: verbal, kuantitatif, atau logis. Sebanyak 12 memilih verbal dan 10 memilih kuantitatif. Jumlah peserta yang memilih logis adalah …",
    options: ["6", "7", "8", "9", "10"],
    answer: 2,
    explanation: "Karena setiap peserta hanya memilih 1 fokus (tanpa tumpang tindih), jumlah yang memilih logis = 30 − 12 − 10 = 8.",
  },

  // ---- Dari "Mentoring Beasiswa PDDI 2026 — Penalaran Kuantitatif" (Simulasi 30 soal) ----
  {
    id: "mtk_1",
    cat: "kuantitatif",
    type: "Aritmetika",
    prompt: "Nilai dari 84 ÷ 7 × 3 − 11 adalah ....",
    options: ["15", "21", "25", "31", "36"],
    answer: 2,
    explanation: "84÷7=12, 12×3=36, 36−11=25.",
  },
  {
    id: "mtk_2",
    cat: "kuantitatif",
    type: "Aritmetika",
    prompt: "Hasil dari 5 − 2(3 − 8) adalah ....",
    options: ["−5", "5", "10", "15", "20"],
    answer: 3,
    explanation: "3−8=−5. Maka 5−2(−5)=5+10=15.",
  },
  {
    id: "mtk_3",
    cat: "kuantitatif",
    type: "Pecahan",
    prompt: "Nilai 3/4 + 2/5 adalah ....",
    options: ["17/20", "21/20", "23/20", "7/9", "11/10"],
    answer: 2,
    explanation: "Samakan penyebut jadi 20: 3/4=15/20, 2/5=8/20. Jumlah=23/20.",
  },
  {
    id: "mtk_4",
    cat: "kuantitatif",
    type: "Pecahan",
    prompt: "Hasil 2½ ÷ 5/6 adalah ....",
    options: ["2", "2½", "3", "3½", "4"],
    answer: 2,
    explanation: "2½=5/2. Pembagian dengan 5/6 → 5/2×6/5=3.",
  },
  {
    id: "mtk_5",
    cat: "kuantitatif",
    type: "Desimal",
    prompt: "Nilai 0,48 × 1,25 adalah ....",
    options: ["0,06", "0,6", "1,6", "6", "60"],
    answer: 1,
    explanation: "0,48×1,25=0,48×5/4=0,12×5=0,60.",
  },
  {
    id: "mtk_6",
    cat: "kuantitatif",
    type: "Desimal",
    prompt: "Hasil 9,36 ÷ 0,24 adalah ....",
    options: ["3,9", "39", "41", "390", "3.900"],
    answer: 1,
    explanation: "Geser koma dua tempat: 936÷24=39.",
  },
  {
    id: "mtk_7",
    cat: "kuantitatif",
    type: "Aritmetika",
    prompt: "Sebanyak 32% dari 625 adalah ....",
    options: ["180", "190", "200", "210", "220"],
    answer: 2,
    explanation: "32%×625=0,32×625=200.",
  },
  {
    id: "mtk_8",
    cat: "kuantitatif",
    type: "Soal Cerita",
    prompt: "Harga sebuah barang Rp450.000 didiskon 20%, kemudian dikenai biaya layanan 10% dari harga setelah diskon. Harga akhirnya adalah ....",
    options: ["Rp360.000", "Rp378.000", "Rp396.000", "Rp405.000", "Rp415.000"],
    answer: 2,
    explanation: "Setelah diskon 20%: 450.000×0,8=360.000. Biaya layanan 10%=36.000. Total=396.000.",
  },
  {
    id: "mtk_9",
    cat: "kuantitatif",
    type: "Aritmetika",
    prompt: "Suatu nilai turun dari 250 menjadi 215. Persentase penurunannya adalah ....",
    options: ["12%", "14%", "15%", "16%", "18%"],
    answer: 1,
    explanation: "Penurunan=250−215=35. Persentase=35/250×100%=14%.",
  },
  {
    id: "mtk_10",
    cat: "kuantitatif",
    type: "Perbandingan",
    prompt: "Rasio buku fiksi dan nonfiksi adalah 7:5. Jika jumlah seluruh buku 288, banyak buku nonfiksi adalah ....",
    options: ["100", "110", "120", "128", "168"],
    answer: 2,
    explanation: "Jumlah bagian=7+5=12. Satu bagian=288÷12=24. Nonfiksi=5×24=120.",
  },
  {
    id: "mtk_11",
    cat: "kuantitatif",
    type: "Perbandingan",
    prompt: "Rasio uang Ana:Beni = 4:7. Jika selisih uang mereka Rp150.000, jumlah uang Ana dan Beni adalah ....",
    options: ["Rp450.000", "Rp500.000", "Rp550.000", "Rp600.000", "Rp650.000"],
    answer: 2,
    explanation: "Selisih rasio=7−4=3 bagian. Satu bagian=150.000÷3=50.000. Jumlah=(4+7)×50.000=550.000.",
  },
  {
    id: "mtk_12",
    cat: "kuantitatif",
    type: "Perbandingan",
    prompt: "Lima kilogram buah berharga Rp140.000. Dengan harga satuan sama, harga 8 kilogram buah adalah ....",
    options: ["Rp196.000", "Rp210.000", "Rp216.000", "Rp224.000", "Rp240.000"],
    answer: 3,
    explanation: "Harga/kg=140.000÷5=28.000. Harga 8kg=8×28.000=224.000.",
  },
  {
    id: "mtk_13",
    cat: "kuantitatif",
    type: "Soal Cerita",
    prompt: "Dua belas pekerja menyelesaikan suatu pekerjaan dalam 18 hari. Jika jumlah pekerja menjadi 27 orang dengan kemampuan sama, waktu yang diperlukan adalah ....",
    options: ["6 hari", "8 hari", "9 hari", "10 hari", "12 hari"],
    answer: 1,
    explanation: "Berbalik nilai: 12×18=27×t → t=216/27=8 hari.",
  },
  {
    id: "mtk_14",
    cat: "kuantitatif",
    type: "Statistika",
    prompt: "Rata-rata 9 bilangan adalah 24. Jika satu bilangan bernilai 40 dikeluarkan, rata-rata delapan bilangan tersisa adalah ....",
    options: ["20", "21", "22", "23", "24"],
    answer: 2,
    explanation: "Jumlah 9 bilangan=9×24=216. Setelah 40 dikeluarkan=176. Rata-rata=176÷8=22.",
  },
  {
    id: "mtk_15",
    cat: "kuantitatif",
    type: "Statistika",
    prompt: "Rata-rata nilai 15 peserta adalah 76. Setelah nilai seorang peserta tambahan dimasukkan, rata-rata menjadi 77. Nilai peserta tambahan tersebut adalah ....",
    options: ["82", "88", "90", "92", "96"],
    answer: 3,
    explanation: "Jumlah lama=15×76=1.140. Jumlah baru=16×77=1.232. Nilai tambahan=1.232−1.140=92.",
  },
  {
    id: "mtk_16",
    cat: "kuantitatif",
    type: "Deret Angka",
    prompt: "Pola berikut adalah 3, 8, 15, 24, 35, .... Suku berikutnya adalah ....",
    options: ["44", "46", "48", "50", "52"],
    answer: 2,
    explanation: "Selisih: 5,7,9,11. Selisih berikutnya 13, sehingga 35+13=48.",
  },
  {
    id: "mtk_17",
    cat: "kuantitatif",
    type: "Deret Angka",
    prompt: "Pola berikut adalah 5, 10, 12, 24, 26, 52, .... Suku berikutnya adalah ....",
    options: ["54", "56", "78", "102", "104"],
    answer: 0,
    explanation: "Pola bergantian ×2 lalu +2: 5×2=10,+2=12,×2=24,+2=26,×2=52,berikutnya +2=54.",
  },
  {
    id: "mtk_18",
    cat: "kuantitatif",
    type: "Aljabar",
    prompt: "Jika 4x − 7 = 29, nilai x adalah ....",
    options: ["7", "8", "9", "10", "11"],
    answer: 2,
    explanation: "4x=29+7=36 → x=9.",
  },
  {
    id: "mtk_19",
    cat: "kuantitatif",
    type: "Aljabar",
    prompt: "Jika a = −2 dan b = 3, nilai 2a² + 3b adalah ....",
    options: ["1", "9", "13", "17", "25"],
    answer: 3,
    explanation: "2a²+3b=2(−2)²+3(3)=2×4+9=17.",
  },
  {
    id: "mtk_20",
    cat: "kuantitatif",
    type: "Aljabar",
    prompt: "Jumlah dua bilangan adalah 42. Bilangan pertama 6 lebih besar daripada bilangan kedua. Bilangan yang lebih kecil adalah ....",
    options: ["15", "16", "17", "18", "19"],
    answer: 3,
    explanation: "Misal bilangan kecil=x, besar=x+6. x+(x+6)=42 → 2x=36 → x=18.",
  },
  {
    id: "mtk_21",
    cat: "kuantitatif",
    type: "Soal Cerita",
    prompt: "Sebuah mobil menempuh 210 km dalam 3 jam 30 menit. Kecepatan rata-ratanya adalah ....",
    options: ["55 km/jam", "60 km/jam", "65 km/jam", "70 km/jam", "75 km/jam"],
    answer: 1,
    explanation: "3 jam 30 menit=3,5 jam. Kecepatan=210÷3,5=60 km/jam.",
  },
  {
    id: "mtk_22",
    cat: "kuantitatif",
    type: "Soal Cerita",
    prompt: "Seorang pelari bergerak dengan kecepatan 5 m/s selama 12 menit. Jarak yang ditempuh adalah ....",
    options: ["1,8 km", "2,4 km", "3,0 km", "3,6 km", "4,2 km"],
    answer: 3,
    explanation: "12 menit=720 detik. Jarak=5×720=3.600 meter=3,6 km.",
  },
  {
    id: "mtk_23",
    cat: "kuantitatif",
    type: "Soal Cerita",
    prompt: "Dua kendaraan berangkat saling mendekat dari dua kota berjarak 360 km. Kecepatan masing-masing 70 km/jam dan 50 km/jam. Mereka bertemu setelah ....",
    options: ["2 jam", "2,5 jam", "3 jam", "3,5 jam", "4 jam"],
    answer: 2,
    explanation: "Kecepatan relatif=70+50=120 km/jam. Waktu=360÷120=3 jam.",
  },
  {
    id: "mtk_24",
    cat: "kuantitatif",
    type: "Soal Cerita",
    prompt: "Sebuah kendaraan menempuh 120 km dengan kecepatan 60 km/jam dan 180 km dengan kecepatan 90 km/jam. Kecepatan rata-rata seluruh perjalanan adalah ....",
    options: ["70 km/jam", "72 km/jam", "75 km/jam", "78 km/jam", "80 km/jam"],
    answer: 2,
    explanation: "Waktu 1=120/60=2 jam. Waktu 2=180/90=2 jam. Total jarak=300 km, total waktu=4 jam, rata-rata=75 km/jam.",
  },
  {
    id: "mtk_25",
    cat: "kuantitatif",
    type: "Soal Cerita",
    prompt: "A menyelesaikan pekerjaan dalam 12 hari dan B dalam 18 hari. Jika bekerja bersama, bagian pekerjaan yang selesai dalam 4 hari adalah ....",
    options: ["2/9", "1/3", "4/9", "5/9", "2/3"],
    answer: 3,
    explanation: "Laju bersama=1/12+1/18=3/36+2/36=5/36. Dalam 4 hari selesai=20/36=5/9.",
  },
  {
    id: "mtk_26",
    cat: "kuantitatif",
    type: "Soal Cerita",
    prompt: "A dapat menyelesaikan pekerjaan dalam 8 hari dan B dalam 24 hari. Jika bekerja bersama, pekerjaan selesai dalam ....",
    options: ["4 hari", "5 hari", "6 hari", "7 hari", "8 hari"],
    answer: 2,
    explanation: "Laju bersama=1/8+1/24=3/24+1/24=4/24=1/6. Waktu selesai=6 hari.",
  },
  {
    id: "mtk_27",
    cat: "kuantitatif",
    type: "Soal Cerita",
    prompt: "Tujuh mesin menghasilkan 1.260 unit dalam 6 jam. Banyak unit yang dihasilkan 10 mesin dalam 8 jam adalah ....",
    options: ["1.800", "2.000", "2.200", "2.400", "2.600"],
    answer: 3,
    explanation: "Produktivitas/mesin/jam=1.260÷(7×6)=30 unit. Hasil 10 mesin ×8 jam=10×8×30=2.400.",
  },
  {
    id: "mtk_28",
    cat: "kuantitatif",
    type: "Soal Cerita",
    prompt: "Sebuah bak dapat diisi keran A dalam 6 jam dan keran B dalam 3 jam. Jika keduanya dibuka bersama, bak penuh dalam ....",
    options: ["1 jam", "1,5 jam", "2 jam", "2,5 jam", "3 jam"],
    answer: 2,
    explanation: "Laju bersama=1/6+1/3=1/6+2/6=1/2 bak per jam. Waktu=2 jam.",
  },
  {
    id: "mtk_29",
    cat: "kuantitatif",
    type: "Soal Cerita",
    prompt: "Sebuah kelas memiliki 40 peserta. Sebanyak 55% peserta adalah perempuan. Setelah 5 peserta perempuan keluar, persentase peserta perempuan yang tersisa adalah ....",
    options: ["42,86%", "45,71%", "48,57%", "50%", "55%"],
    answer: 2,
    explanation: "Perempuan awal=55%×40=22. Setelah 5 keluar: perempuan=17, total peserta=35. Persentase=17/35×100%=48,57%.",
  },
  {
    id: "mtk_30",
    cat: "kuantitatif",
    type: "Aritmetika",
    prompt: "Nilai dari (25% × 320) + (3/5 × 150) − 28 adalah ....",
    options: ["122", "132", "142", "152", "162"],
    answer: 2,
    explanation: "25%×320=80. 3/5×150=90. Maka 80+90−28=142.",
  },

  // ---- 7 soal tambahan orisinal untuk melengkapi 250 soal ----
  {
    id: "extra_m1",
    cat: "masalah",
    type: "Analisis Data",
    prompt: "Penjualan sebuah toko selama 4 kuartal (juta rupiah): Q1=120, Q2=150, Q3=135, Q4=180. Berapa rata-rata penjualan per kuartal?",
    options: ["140", "143,75", "146,25", "150", "152,5"],
    answer: 2,
    explanation: "Jumlah = 120+150+135+180 = 585. Rata-rata = 585 ÷ 4 = 146,25.",
  },
  {
    id: "extra_m2",
    cat: "masalah",
    type: "Penempatan/Urutan",
    prompt:
      "Empat teman (P, Q, R, S) memesan minuman berbeda: kopi, teh, jus, susu. Diketahui: (1) P tidak minum kopi maupun teh. (2) Q minum teh. (3) R tidak minum jus maupun susu. (4) S tidak minum jus. Siapa yang minum kopi?",
    options: ["P", "Q", "R", "S", "Tidak dapat ditentukan"],
    answer: 2,
    explanation:
      "Dari (2): Q=teh. Dari (3): R bukan jus/susu/teh(sudah Q) → R=kopi. Dari (4): S bukan jus → S=susu (kopi sudah R). Sisa jus untuk P (sesuai (1), P memang bukan kopi/teh). Jadi yang minum kopi adalah R.",
  },
  {
    id: "extra_m3",
    cat: "masalah",
    type: "Analisis Data",
    prompt: "Dari 240 mahasiswa, 40% mengambil jurusan Sains, 35% jurusan Sosial, dan sisanya jurusan Bahasa. Berapa mahasiswa yang mengambil jurusan Bahasa?",
    options: ["40", "50", "60", "70", "80"],
    answer: 2,
    explanation: "Sains=40%×240=96. Sosial=35%×240=84. Bahasa=240−96−84=60.",
  },
  {
    id: "extra_m4",
    cat: "masalah",
    type: "Pengambilan Keputusan",
    prompt:
      "Sebuah aplikasi belanja online mencatat peningkatan keluhan pelanggan setelah meluncurkan fitur baru, namun jumlah pengguna aktif tetap bertambah. Langkah PALING TEPAT yang sebaiknya dilakukan tim produk pertama kali adalah…",
    options: [
      "Segera menghapus fitur baru",
      "Mengabaikan keluhan karena pengguna tetap bertambah",
      "Menganalisis isi keluhan untuk memahami penyebab spesifiknya",
      "Menaikkan harga untuk mengurangi jumlah pengguna",
      "Meminta maaf kepada pengguna tanpa menyelidiki lebih lanjut",
    ],
    answer: 2,
    explanation: "Sebelum mengambil tindakan besar (menghapus fitur) atau mengabaikan masalah, langkah paling rasional adalah memahami akar penyebab keluhan melalui analisis data terlebih dahulu.",
  },
  {
    id: "extra_m5",
    cat: "masalah",
    type: "Analisis Data",
    prompt:
      "Dari 150 karyawan, 90 orang bisa menggunakan Excel, 70 orang bisa menggunakan Python, dan 40 orang bisa menggunakan keduanya. Berapa karyawan yang TIDAK bisa menggunakan Excel maupun Python?",
    options: ["20", "25", "30", "35", "40"],
    answer: 2,
    explanation: "Yang bisa minimal satu = 90+70−40=120 (prinsip inklusi-eksklusi). Yang tidak bisa keduanya = 150−120=30.",
  },
  {
    id: "extra_m6",
    cat: "masalah",
    type: "Sebab-Akibat",
    prompt:
      "Sebuah studi menemukan bahwa kota dengan jumlah kedai kopi lebih banyak juga memiliki tingkat pendidikan rata-rata lebih tinggi. Kesimpulan yang paling tepat secara metodologis adalah…",
    options: [
      "Kedai kopi menyebabkan tingkat pendidikan naik",
      "Tingkat pendidikan tinggi menyebabkan banyak kedai kopi dibuka",
      "Ada korelasi antara keduanya, namun hubungan sebab-akibat belum tentu terbukti tanpa penelitian lebih lanjut",
      "Kedai kopi dan pendidikan tidak berhubungan sama sekali",
      "Data tersebut pasti keliru",
    ],
    answer: 2,
    explanation: "Prinsip dasar metodologi: korelasi (dua hal muncul bersamaan) tidak otomatis membuktikan kausalitas (satu menyebabkan yang lain). Kedua faktor bisa sama-sama dipengaruhi variabel lain (mis. tingkat urbanisasi).",
  },
  {
    id: "extra_m7",
    cat: "masalah",
    type: "Penjadwalan",
    prompt:
      "Empat rapat (Anggaran, Evaluasi, Rekrutmen, Strategi) dijadwalkan Senin–Kamis, satu rapat per hari. Aturan: Anggaran sebelum Strategi. Evaluasi tepat sehari setelah Rekrutmen. Strategi bukan hari Senin. Anggaran bukan hari Senin. Urutan yang valid adalah…",
    options: [
      "Rekrutmen–Evaluasi–Anggaran–Strategi",
      "Anggaran–Rekrutmen–Evaluasi–Strategi",
      "Strategi–Rekrutmen–Evaluasi–Anggaran",
      "Rekrutmen–Anggaran–Evaluasi–Strategi",
      "Evaluasi–Rekrutmen–Anggaran–Strategi",
    ],
    answer: 0,
    explanation:
      "Uji opsi A: Rekrutmen(Sen)-Evaluasi(Sel)-Anggaran(Rab)-Strategi(Kam). Evaluasi tepat sehari setelah Rekrutmen ✓. Anggaran sebelum Strategi ✓. Strategi bukan Senin ✓. Anggaran bukan Senin ✓. Semua opsi lain melanggar minimal satu aturan (mis. B: Anggaran jatuh di Senin, melanggar).",
  },

  {
    id: "td1_m29",
    cat: "masalah",
    type: "Pengambilan Keputusan",
    prompt:
      "Sebuah kelas ingin meningkatkan rata-rata skor latihan pesertanya. Tindakan yang PALING KUAT mendukung tujuan tersebut adalah …",
    options: [
      "Menambah durasi pembukaan kelas",
      "Memberikan latihan terarah berdasarkan jenis kesalahan peserta",
      "Mengganti nama grup peserta",
      "Menambah jumlah poster promosi",
      "Mengurangi pembahasan soal",
    ],
    answer: 1,
    explanation: "Latihan yang menyasar langsung pola kesalahan spesifik peserta adalah intervensi paling relevan dan berdampak terhadap peningkatan skor, dibanding tindakan administratif/kosmetik pada opsi lain.",
  },

  {
    id: "kj1_k9",
    cat: "kuantitatif",
    type: "Aritmetika",
    prompt: "35% dari 240 = ...",
    options: ["74", "80", "84", "88", "92"],
    answer: 2,
    explanation: "35% × 240 = 0,35×240 = 84.",
  },
  {
    id: "kj1_k10",
    cat: "kuantitatif",
    type: "Aritmetika",
    prompt: "Sebuah kelas berisi 96 siswa. Sebanyak 3/8 dari siswa tersebut mengikuti ekskul basket. Berapa siswa yang mengikuti ekskul basket?",
    options: ["30", "33", "36", "39", "42"],
    answer: 2,
    explanation: "3/8 × 96 = 36.",
  },
  {
    id: "kj1_k12",
    cat: "kuantitatif",
    type: "Soal Cerita",
    prompt: "3 penilai menyelesaikan 90 dokumen dalam 5 jam. Dengan laju kerja sama, berapa dokumen yang bisa diselesaikan oleh 5 penilai dalam 6 jam?",
    options: ["120", "150", "168", "180", "200"],
    answer: 3,
    explanation: "Laju per penilai per jam = 90 ÷ (3×5) = 6 dokumen. Hasil = 5 penilai × 6 jam × 6 dokumen/orang-jam = 180 dokumen.",
  },
  {
    id: "kj1_k15",
    cat: "kuantitatif",
    type: "Aritmetika",
    prompt: "Suatu nilai naik dari 200 menjadi 250. Berapa persen kenaikannya?",
    options: ["15%", "20%", "25%", "30%", "35%"],
    answer: 2,
    explanation: "Kenaikan = 250−200 = 50. Persentase = 50/200×100% = 25%.",
  },
  {
    id: "kj1_k16",
    cat: "kuantitatif",
    type: "Aritmetika",
    prompt: "Seorang siswa harus mengerjakan 120 soal latihan. Jika sudah mengerjakan 3/5 bagian, berapa soal yang tersisa?",
    options: ["36", "40", "44", "48", "52"],
    answer: 3,
    explanation: "Sudah dikerjakan = 3/5×120=72. Sisa = 120−72 = 48.",
  },

  {
    id: "kj1_m28",
    cat: "masalah",
    type: "Penempatan/Urutan",
    prompt:
      "Empat peserta—K, L, M, dan N—duduk berurutan (kursi 1-4). K tidak boleh berdampingan dengan L. M harus duduk tepat di sebelah kiri N. L harus menempati kursi pertama. Susunan yang memenuhi seluruh aturan adalah…",
    options: ["L–M–N–K", "K–M–N–L", "L–K–M–N", "M–L–N–K", "L–N–M–K"],
    answer: 0,
    explanation:
      "L di kursi 1 (syarat). M harus tepat di kiri N → M dan N berurutan. Susunan L-M-N-K memenuhi: M(2) tepat di kiri N(3) ✓, dan K(4) tidak bersebelahan dengan L(1) ✓.",
  },

  // ---- Pemecahan Masalah dari materi PDDI (penjadwalan & interpretasi data) ----
  {
    id: "dp_m1",
    cat: "masalah",
    type: "Penjadwalan",
    prompt:
      "Lima kegiatan A, B, C, D, E dijadwalkan Senin–Jumat (satu kegiatan/hari). Aturan: A sebelum C. B tepat setelah D. E tidak pada Senin atau Jumat. Pasangan hari yang MUNGKIN untuk D dan B adalah...",
    options: ["Senin–Selasa", "Selasa–Kamis", "Rabu–Jumat", "Kamis–Senin", "Jumat–Kamis"],
    answer: 0,
    explanation:
      "Uji: D=Senin, B=Selasa. Sisa hari Rabu-Kamis-Jumat untuk A,C,E. Karena E tidak boleh Jumat, susun E=Rabu, A=Kamis, C=Jumat (A sebelum C ✓). Semua aturan terpenuhi — satu susunan sah sudah cukup untuk soal 'mungkin'.",
  },
  {
    id: "dp_m2",
    cat: "masalah",
    type: "Penjadwalan",
    prompt:
      "(Aturan sama seperti soal penjadwalan A-E sebelumnya.) Jika A pada Senin dan C pada Jumat, pernyataan yang PASTI benar adalah...",
    options: [
      "E pada Selasa",
      "D pada Selasa",
      "B pada Kamis",
      "D dan B menempati dua hari berurutan di antara Selasa–Kamis",
      "E pada Kamis",
    ],
    answer: 3,
    explanation:
      "Sisa hari Selasa-Rabu-Kamis untuk D, B, E. Karena B harus tepat setelah D, pasangan D-B hanya bisa Selasa-Rabu atau Rabu-Kamis — keduanya berurutan di rentang Selasa-Kamis. E dan posisi D/B spesifik tidak selalu sama di kedua kemungkinan, jadi hanya opsi D yang pasti benar di semua skenario.",
  },
  {
    id: "dp_m3",
    cat: "masalah",
    type: "Interpretasi Data",
    prompt:
      "Tabel skor 4 peserta: P(Verbal18,Kuant16,Logis17,Analitis15) · Q(15,19,16,18) · R(17,17,19,16) · S(16,15,18,19). Peserta dengan TOTAL skor tertinggi adalah...",
    options: ["P", "Q", "R", "S", "P dan R"],
    answer: 2,
    explanation: "Total: P=18+16+17+15=66. Q=15+19+16+18=68. R=17+17+19+16=69. S=16+15+18+19=68. Tertinggi: R (69).",
  },
  {
    id: "dp_m4",
    cat: "masalah",
    type: "Interpretasi Data",
    prompt:
      "(Tabel skor yang sama: P(Verbal18,Kuant16,Logis17,Analitis15) · Q(15,19,16,18) · R(17,17,19,16) · S(16,15,18,19).) Peserta dengan skor tertinggi pada bagian Analitis adalah...",
    options: ["P", "Q", "R", "S", "P dan R"],
    answer: 3,
    explanation: "Bandingkan hanya kolom Analitis: P=15, Q=18, R=16, S=19. Tertinggi: S (19).",
  },
  {
    id: "kl2_v17",
    cat: "verbal",
    type: "Penempatan/Urutan",
    prompt:
      "Lima anak (Petra, Ita, Vidi, Gunawan, Caca) mengambil oleh-oleh dari Singapura. Tiga anak mengambil kaus. Gunawan hanya mengambil jaket. Ita mengambil parfum dan cokelat. Selain Gunawan, yang tidak mengambil parfum adalah Vidi dan Petra. Hanya Ita dan Caca yang mengambil parfum. Siapakah yang mengambil parfum dan cokelat?",
    options: ["Ita", "Vidi", "Caca", "Petra", "Gunawan"],
    answer: 0,
    explanation: "Dinyatakan langsung dalam soal: Ita mengambil parfum dan cokelat.",
  },
  {
    id: "kl2_v18",
    cat: "verbal",
    type: "Penempatan/Urutan",
    prompt:
      "(Kasus oleh-oleh yang sama — Petra, Ita, Vidi, Gunawan, Caca.) Siapa di antara mereka yang mengambil jaket?",
    options: ["Ita dan Gunawan", "Caca, Vidi dan Gunawan", "Gunawan saja", "Petra dan Gunawan", "Vidi saja"],
    answer: 3,
    explanation: "Gunawan hanya mengambil jaket. Karena hanya Ita dan Caca yang mengambil parfum, dan tiga anak (Caca, Vidi, Petra) mengambil kaus, sisa oleh-oleh (jaket) untuk Petra dan Gunawan.",
  },
  {
    id: "kl2_v19",
    cat: "verbal",
    type: "Penempatan/Urutan",
    prompt: "(Kasus oleh-oleh yang sama.) Oleh-oleh apa yang diambil oleh Caca?",
    options: ["Jaket dan kaus", "Jaket saja", "Parfum saja", "Cokelat dan parfum", "Kaus dan parfum"],
    answer: 4,
    explanation: "Caca termasuk kelompok yang mengambil kaus (tiga anak) sekaligus kelompok yang mengambil parfum (Ita dan Caca) — sehingga Caca mengambil kaus dan parfum.",
  },
  {
    id: "kl2_v20",
    cat: "verbal",
    type: "Penempatan/Urutan",
    prompt: "(Kasus oleh-oleh yang sama.) Siapa saja yang mengambil parfum?",
    options: ["Vidi dan Petra", "Caca dan Gunawan", "Petra dan Caca", "Ita dan Caca", "Ita saja"],
    answer: 3,
    explanation: "Dinyatakan langsung: hanya Ita dan Caca yang mengambil parfum.",
  },
  {
    id: "kl2_v21",
    cat: "verbal",
    type: "Penempatan/Urutan",
    prompt: "(Kasus oleh-oleh yang sama.) Jika digabungkan, oleh-oleh apa saja yang diambil oleh Petra dan Vidi?",
    options: ["Kaus dan parfum", "Jaket, parfum dan cokelat", "Jaket, kaus, cokelat", "Parfum, jaket, kaus", "Jaket dan parfum"],
    answer: 2,
    explanation: "Petra mengambil jaket dan kaus; Vidi mengambil cokelat dan kaus. Digabung: jaket, kaus, dan cokelat.",
  },
  {
    id: "kl2_v22",
    cat: "verbal",
    type: "Silogisme",
    prompt:
      "Toko-toko swalayan di kota A punya lantai antara dua sampai delapan. Jika suatu toko memiliki lebih dari tiga lantai, toko tersebut memiliki tangga berjalan. Manakah pernyataan berikut yang juga harus benar?",
    options: [
      "Lantai kedua tidak memiliki tangga berjalan",
      "Lantai ketujuh memiliki tangga berjalan",
      "Hanya lantai-lantai di atas lantai ketiga yang memiliki tangga berjalan",
      "Semua lantai dapat dicapai dengan tangga berjalan",
      "Tidak ada kesimpulan yang memenuhi",
    ],
    answer: 1,
    explanation: "Aturan: toko dengan >3 lantai pasti punya tangga berjalan. Karena lantai ketujuh (>3), toko tersebut pasti memiliki tangga berjalan.",
  },
  {
    id: "kl2_v23",
    cat: "verbal",
    type: "Penempatan/Urutan",
    prompt:
      "Piket kelas: Ita, Ayu, Lani (perempuan), Putra, Dani (laki-laki). Aturan: Jumat Ita & Dani ikut Pramuka (tidak bisa piket). Senin & Rabu Ayu harus pulang cepat (tidak piket). Setiap hari minimal 1 laki-laki piket. Senin & Kamis Lani harus ke les Matematika (tidak piket). Ita dan Dani mendapat giliran bekerja sama membersihkan kelas pada hari...",
    options: ["Selasa dan Kamis", "Senin dan Selasa", "Senin dan Kamis", "Rabu dan Jum'at", "Rabu dan Kamis"],
    answer: 0,
    explanation:
      "Ita & Dani tidak bisa piket Jumat (Pramuka). Susunan yang memenuhi semua batasan (Ayu absen Senin/Rabu, Lani absen Senin/Kamis, minimal 1 laki-laki tiap hari) menempatkan Ita dan Dani piket bersama pada Selasa dan Kamis.",
  },

  // ---- Pemecahan Masalah tambahan (Seri 2) ----
  {
    id: "kl2_m1",
    cat: "masalah",
    type: "Analisis Data",
    prompt:
      "Harga barang kebutuhan rumah tangga (indeks): total harga 2013 = Rp41.500 · total harga 2014 = Rp42.500 (empat komoditas). Berdasarkan indeks harga agregatif sederhana, kesimpulan yang tepat adalah…",
    options: [
      "Penjualan barang kebutuhan rumah tangga 2014 naik 2,41% dibanding 2013",
      "Harga barang kebutuhan rumah tangga 2014 naik sekitar 2,41% dibanding 2013",
      "Semua penjualan barang 2014 mengalami penurunan permintaan",
      "Penjualan 2013 naik 2,41% dibanding tahun sebelumnya",
      "Konsumen akan menurunkan jumlah barang yang diminta akibat kenaikan harga",
    ],
    answer: 1,
    explanation: "Indeks = (42.500/41.500)×100 ≈ 102,41 — artinya terjadi kenaikan HARGA (bukan penjualan/permintaan) sebesar sekitar 2,41%.",
  },
  {
    id: "kl2_m2",
    cat: "masalah",
    type: "Interpretasi Data",
    prompt:
      "Limbah medis dan sampah plastik sekali pakai (masker, sarung tangan, APD) meningkat drastis selama pandemi. Sekitar 75% masker sekali pakai berakhir di TPA, sebagian mencemari lingkungan, dan kerugian ke sektor pariwisata & perikanan diperkirakan mencapai puluhan miliar dolar. Kalimat penutup yang paling tepat untuk melengkapi kesimpulan wacana ini adalah pemerintah…",
    options: [
      "seharusnya membuat peraturan tentang pembuangan sampah dan limbah",
      "seharusnya menangani kerusakan lingkungan akibat sampah dan limbah",
      "memberi sanksi kepada masyarakat yang membuang sampah",
      "perlu menyediakan dana penanganan limbah dan sampah medis",
      "selayaknya menanggulangi peningkatan limbah dan sampah",
    ],
    answer: 4,
    explanation: "Kalimat penutup harus merangkum solusi paling menyeluruh terhadap masalah inti yang dibahas (peningkatan limbah & dampaknya), bukan solusi parsial seperti regulasi saja atau sanksi saja.",
  },
  {
    id: "kl2_m3",
    cat: "masalah",
    type: "Analisis Data",
    prompt:
      "Data penjualan buku: Fifty Shades of Grey = 100 juta kopi. Twilight = 150 juta kopi. The Da Vinci Code = 200 juta kopi. Fifty Shades of Grey mengalahkan penjualan serial James Bond. Pernyataan yang BERTENTANGAN dengan data di atas adalah…",
    options: [
      "Penjualan Fifty Shades of Grey belum melampaui Twilight dan The Da Vinci Code",
      "Penjualan Fifty Shades of Grey kalah 50 juta kopi dari The Da Vinci Code",
      "The Da Vinci Code memiliki angka penjualan paling tinggi",
      "Angka 100 juta kopi adalah jumlah penjualan Fifty Shades of Grey",
      "Fifty Shades of Grey mengalahkan penjualan serial James Bond",
    ],
    answer: 1,
    explanation: "Selisih sebenarnya adalah 200−100 = 100 juta kopi, bukan 50 juta — sehingga pernyataan ini bertentangan dengan data.",
  },
  {
    id: "kl2_m4",
    cat: "masalah",
    type: "Analisis Data",
    prompt:
      "Data jumlah ATM per 100.000 penduduk dewasa (2020) di ASEAN: Thailand 111,82 · Malaysia 55,56 · Singapura 54,01 · Indonesia 51,66 · Filipina 29,72 · Laos 27,39 · Kamboja 26,35 · Vietnam 26,26. Pernyataan yang paling tepat berdasarkan data ini adalah…",
    options: [
      "Jumlah rata-rata ATM Indonesia dua kali lipat dari Vietnam",
      "Banyak masyarakat Thailand yang menggunakan ATM selama 2020",
      "Jumlah ATM di Singapura lebih banyak daripada di Indonesia",
      "Jumlah rata-rata ATM Vietnam lebih banyak daripada Brunei Darussalam",
      "Laos, Kamboja, dan Vietnam berurutan menempati peringkat rata-rata ATM dunia",
    ],
    answer: 2,
    explanation: "Singapura (54,01) > Indonesia (51,66), sehingga pernyataan ini didukung data. Opsi A salah (2×26,26=52,52 ≠ 51,66); D tidak ada data Brunei; B & E menyimpulkan hal di luar data yang tersedia.",
  },
  {
    id: "kl2_m5",
    cat: "masalah",
    type: "Analisis Data",
    prompt:
      "Data penduduk Indonesia 2022: 57,9% tinggal di perkotaan, 42,1% di pedesaan. Penduduk laki-laki sedikit lebih banyak dari perempuan. Persentase usia tertinggi 25–34 tahun (14,9%); usia 45–54 tahun ≈12,7%; usia >65 tahun ≈5%. Pernyataan yang paling tepat berdasarkan data ini adalah…",
    options: [
      "Persentase usia 45–54 dua kali lipat dibanding usia >65",
      "Penduduk yang tinggal di kota didominasi usia di bawah 45 tahun",
      "Jumlah penduduk Indonesia naik dari tahun ke tahun",
      "Tingkat kelahiran di Indonesia lebih tinggi dibanding tingkat kematian",
      "Semua penduduk usia produktif tinggal di perkotaan",
    ],
    answer: 3,
    explanation: "Dominasi usia produktif (25-34 tahun tertinggi) dan populasi besar mengindikasikan pertumbuhan positif (kelahiran > kematian). Opsi A salah secara hitungan (2×5=10 ≠ 12,7); C dan B tidak didukung data langsung.",
  },
  {
    id: "kl2_m6",
    cat: "masalah",
    type: "Pengambilan Keputusan",
    prompt:
      "Beberapa pejabat Direktorat Jenderal Pajak diduga tidak membayar pajak dan tidak melaporkan seluruh harta kekayaan. Sejumlah anggota keluarga pejabat juga terpantau memamerkan kekayaan (flexing) di media sosial. Langkah pertama yang paling tepat dilakukan Menteri Keuangan adalah…",
    options: [
      "Memberikan pembinaan agar tidak flexing harta",
      "Melarang pejabat membeli barang-barang mewah",
      "Langsung memecat pejabat yang tidak patuh aturan",
      "Membentuk tim khusus untuk mengawasi pejabat yang diduga bermasalah",
      "Memberikan sanksi denda agar jera",
    ],
    answer: 3,
    explanation: "Masalahnya bersifat sistemik (dugaan pelanggaran & pengawasan lemah), sehingga solusi paling tepat sebagai langkah AWAL adalah membentuk mekanisme pengawasan sistematis, bukan tindakan reaktif parsial seperti pembinaan atau denda semata.",
  },
  {
    id: "kl2_m7",
    cat: "masalah",
    type: "Pengambilan Keputusan",
    prompt:
      "Sebuah toko online mendapat banyak ulasan negatif meski penjualan masih tinggi. Pemilik toko belum tahu pasti penyebab utama keluhan. Langkah awal yang paling tepat dilakukan pemilik toko adalah…",
    options: [
      "Menghentikan penjualan produk yang sering dikeluhkan",
      "Memberikan kompensasi kepada semua pelanggan",
      "Melakukan analisis terhadap ulasan dan keluhan pelanggan",
      "Menurunkan harga semua produk",
      "Menambah jumlah produk yang dijual",
    ],
    answer: 2,
    explanation: "Karena penyebab belum diketahui, langkah paling logis adalah menganalisis dulu akar masalahnya sebelum mengambil tindakan besar (seperti menghentikan penjualan atau menurunkan harga).",
  },
  {
    id: "kl2_m8",
    cat: "masalah",
    type: "Pengambilan Keputusan",
    prompt:
      "Harga minyak goreng naik signifikan. Pemerintah melakukan operasi pasar dengan menjual minyak goreng bersubsidi di berbagai daerah. Tujuan utama pemerintah melakukan operasi pasar tersebut adalah…",
    options: [
      "Mengurangi jumlah produsen minyak goreng",
      "Menjaga kestabilan harga minyak goreng di pasaran",
      "Meningkatkan keuntungan distributor",
      "Mengurangi konsumsi masyarakat",
      "Menambah stok minyak goreng di gudang pemerintah",
    ],
    answer: 1,
    explanation: "Operasi pasar adalah kebijakan standar untuk menjaga stabilitas harga di pasar saat terjadi lonjakan harga, dengan menambah pasokan terjangkau.",
  },
  {
    id: "kl2_m9",
    cat: "masalah",
    type: "Pengambilan Keputusan",
    prompt:
      "Sejumlah platform media sosial tidak mematuhi regulasi perlindungan data pengguna yang ditetapkan pemerintah, menimbulkan kekhawatiran keamanan data dan ancaman pemblokiran. Solusi yang paling tepat adalah…",
    options: [
      "Menghapus semua akun pengguna dari platform tersebut",
      "Membiarkan platform tetap berjalan tanpa perubahan",
      "Meminta pengguna pindah ke platform lain",
      "Mewajibkan platform untuk mengikuti regulasi yang berlaku",
      "Melarang masyarakat menggunakan media sosial",
    ],
    answer: 3,
    explanation: "Solusi paling proporsional dan menyasar akar masalah (pelanggaran regulasi) adalah menegakkan kepatuhan platform terhadap regulasi, bukan tindakan ekstrem seperti melarang penggunaan atau membiarkan tanpa perubahan.",
  },

  // ---------------- KUANTITATIF ----------------
  {
    id: "k1",
    cat: "kuantitatif",
    type: "Aritmetika",
    prompt: "Sebuah barang dijual dengan harga Rp360.000 setelah diberi diskon 20%. Berapa harga barang sebelum diskon?",
    options: ["Rp432.000", "Rp450.000", "Rp400.000", "Rp480.000", "Rp420.000"],
    answer: 1,
    explanation: "Harga setelah diskon = 80% dari harga awal. Harga awal = 360.000 ÷ 0,8 = Rp450.000.",
  },
  {
    id: "k2",
    cat: "kuantitatif",
    type: "Deret Angka",
    prompt: "Lanjutkan deret berikut: 2, 6, 12, 20, 30, ....",
    options: ["36", "40", "42", "44", "48"],
    answer: 2,
    explanation:
      "Selisih antar suku bertambah 2 setiap langkah: +4, +6, +8, +10, +12. Suku ke-6 = 30 + 12 = 42.",
  },
  {
    id: "k3",
    cat: "kuantitatif",
    type: "Aljabar",
    prompt: "Jika 3x − 7 = 2x + 5, maka nilai x adalah ....",
    options: ["8", "10", "12", "14", "16"],
    answer: 2,
    explanation: "3x − 2x = 5 + 7 → x = 12.",
  },
  {
    id: "k4",
    cat: "kuantitatif",
    type: "Kecukupan Data",
    prompt:
      "Berapa umur Andi sekarang? (1) Umur Andi adalah tiga kali umur adiknya. (2) Umur Andi sekarang adalah 21 tahun. Data mana yang cukup untuk menjawab?",
    options: [
      "Hanya (1) saja cukup",
      "Hanya (2) saja cukup",
      "(1) dan (2) bersama-sama cukup, tapi masing-masing tidak cukup sendiri",
      "Masing-masing (1) atau (2) saja sudah cukup",
      "(1) dan (2) bersama-sama tetap tidak cukup",
    ],
    answer: 1,
    explanation:
      "Pernyataan (2) langsung memberi jawaban pasti: 21 tahun. Pernyataan (1) sendiri tidak cukup karena umur adik tidak diketahui, sehingga umur Andi bisa bermacam-macam (mis. 3, 6, 21, dst — tidak tunggal). Karena hanya (2) yang menghasilkan satu nilai pasti, jawabannya 'Hanya (2) saja cukup'.",
  },
  {
    id: "k5",
    cat: "kuantitatif",
    type: "Aritmetika",
    prompt: "Sebuah mobil menempuh 240 km dalam 3 jam. Dengan kecepatan rata-rata yang sama, berapa waktu yang dibutuhkan untuk menempuh 400 km?",
    options: ["4 jam", "4,5 jam", "5 jam", "5,5 jam", "6 jam"],
    answer: 2,
    explanation: "Kecepatan = 240/3 = 80 km/jam. Waktu untuk 400 km = 400/80 = 5 jam.",
  },
  {
    id: "k6",
    cat: "kuantitatif",
    type: "Deret Angka",
    prompt: "Lanjutkan deret berikut: 3, 5, 9, 17, 33, ....",
    options: ["49", "57", "61", "65", "67"],
    answer: 2,
    explanation: "Setiap suku = suku sebelumnya × 2 − 1. Suku ke-6 = 33 × 2 − 1 = 65. (Periksa ulang: 3→5(×2−1), 5→9(×2−1), 9→17(×2−1), 17→33(×2−1), 33→65).",
  },
  {
    id: "k7",
    cat: "kuantitatif",
    type: "Aljabar",
    prompt: "Jika 2 pensil dan 3 buku harganya Rp26.000, sedangkan 4 pensil dan 1 buku harganya Rp22.000, berapa harga 1 buku?",
    options: ["Rp6.000", "Rp7.000", "Rp8.000", "Rp9.000", "Rp10.000"],
    answer: 0,
    explanation:
      "Dari persamaan (ii): b = 22000 − 4p. Substitusi ke (i): 2p + 3(22000 − 4p) = 26000 → 2p + 66000 − 12p = 26000 → −10p = −40000 → p = 4000. Maka b = 22000 − 4(4000) = 6000. Verifikasi: 2(4000)+3(6000) = 8000+18000 = 26000 ✓. Harga 1 buku = Rp6.000.",
  },
  {
    id: "k8",
    cat: "kuantitatif",
    type: "Aritmetika",
    prompt: "Rata-rata nilai 8 siswa adalah 75. Jika seorang siswa baru dengan nilai 93 bergabung, berapa rata-rata baru?",
    options: ["76", "77", "78", "79", "80"],
    answer: 1,
    explanation:
      "Total nilai 8 siswa = 8 × 75 = 600. Total 9 siswa = 600 + 93 = 693. Rata-rata baru = 693 / 9 = 77.",
  },
  {
    id: "k9",
    cat: "kuantitatif",
    type: "Deret Angka",
    prompt: "Lanjutkan deret berikut: 1, 4, 9, 16, 25, ....",
    options: ["30", "32", "34", "36", "38"],
    answer: 3,
    explanation: "Ini adalah deret bilangan kuadrat: 1²,2²,3²,4²,5²,6². Suku ke-6 = 6² = 36.",
  },
  {
    id: "k10",
    cat: "kuantitatif",
    type: "Aritmetika",
    prompt: "Sebuah tangki terisi air 40%. Jika ditambahkan 60 liter air, tangki menjadi penuh (100%). Berapa kapasitas tangki tersebut?",
    options: ["80 liter", "90 liter", "100 liter", "110 liter", "120 liter"],
    answer: 2,
    explanation: "60 liter mewakili 60% kapasitas. Kapasitas penuh = 60 / 0,6 = 100 liter.",
  },
  {
    id: "k11",
    cat: "kuantitatif",
    type: "Kecukupan Data",
    prompt:
      "Apakah bilangan bulat n habis dibagi 6? (1) n habis dibagi 2. (2) n habis dibagi 3. Data mana yang cukup?",
    options: [
      "Hanya (1) saja cukup",
      "Hanya (2) saja cukup",
      "(1) dan (2) bersama-sama cukup, tapi masing-masing tidak cukup sendiri",
      "Masing-masing (1) atau (2) saja sudah cukup",
      "(1) dan (2) bersama-sama tetap tidak cukup",
    ],
    answer: 2,
    explanation:
      "Habis dibagi 6 = habis dibagi 2 DAN 3 sekaligus. (1) saja tidak cukup (misal n=4, habis dibagi 2 tapi bukan 6). (2) saja tidak cukup (misal n=9). Gabungan keduanya baru menjamin habis dibagi 6.",
  },
  {
    id: "k12",
    cat: "kuantitatif",
    type: "Aljabar",
    prompt: "Jika x² − 5x + 6 = 0, maka nilai x yang mungkin adalah ....",
    options: ["1 dan 6", "2 dan 3", "−2 dan −3", "1 dan 5", "3 dan 4"],
    answer: 1,
    explanation: "Faktorkan: (x−2)(x−3)=0 → x=2 atau x=3.",
  },
  {
    id: "k13",
    cat: "kuantitatif",
    type: "Aritmetika",
    prompt: "Sebuah proyek dapat diselesaikan 12 pekerja dalam 15 hari. Jika hanya tersedia 9 pekerja, berapa hari yang dibutuhkan (asumsi laju kerja sama)?",
    options: ["18 hari", "20 hari", "22 hari", "24 hari", "16 hari"],
    answer: 1,
    explanation: "Total 'orang-hari' = 12 × 15 = 180. Dengan 9 pekerja: 180 / 9 = 20 hari.",
  },

  // ---- Set latihan dari e-book "Kumpulan Latihan Soal & Pembahasan" (15 soal) ----
  {
    id: "eb1_1",
    cat: "kuantitatif",
    type: "Deret Angka",
    prompt: "Lengkapi deret berikut: 8, 10, 40, 38, …, …, 158, 160, 60",
    options: ["38, 160", "38, 158", "40, 160", "40, 158", "40, 60"],
    answer: 2,
    explanation:
      "Pola berulang: +2, ×4, −2. 8+2=10; 10×4=40; 40−2=38; 38+2=40 (bilangan pertama yang dicari); 40×4=160 (bilangan kedua yang dicari); 160−2=158; 158+2=160; 160−100=60.",
  },
  {
    id: "eb1_2",
    cat: "kuantitatif",
    type: "Deret Angka",
    prompt: "Lengkapi deret berikut: −3, 3, −6, 18, −72, …",
    options: ["−216", "216", "360", "−360", "316"],
    answer: 2,
    explanation: "Pola perkalian bertingkat: −3×−1=3; 3×−2=−6; −6×−3=18; 18×−4=−72; −72×−5=360.",
  },
  {
    id: "eb1_3",
    cat: "kuantitatif",
    type: "Deret Angka",
    prompt: "Lengkapi deret berikut: 43, 41, 38, 33, 26, …, 2",
    options: ["25", "20", "15", "10", "5"],
    answer: 2,
    explanation:
      "Selisih antar suku adalah bilangan prima berurutan (2,3,5,7,11,13): 43(−2)41(−3)38(−5)33(−7)26(−11)15(−13)2. Bilangan yang hilang adalah 15.",
  },
  {
    id: "eb1_4",
    cat: "kuantitatif",
    type: "Deret Angka",
    prompt: "Lengkapi deret berikut: 13, 16½, 20, 23½, 27, …",
    options: ["28½", "29", "29½", "30", "30½"],
    answer: 4,
    explanation:
      "Deret ini terdiri dari dua seri berselang-seling, masing-masing berpola +7: Seri 1: 13, 20, 27, ... Seri 2: 16½, 23½, .... Suku berikutnya pada seri 2 = 23½ + 7 = 30½.",
  },
  {
    id: "eb1_5",
    cat: "kuantitatif",
    type: "Deret Angka",
    prompt: "Lengkapi deret berikut: 4, 99, 8, 33, 16, …, …, 3⅔",
    options: ["10 dan 32", "11 dan 32", "12 dan 22", "13 dan 20", "14 dan 18"],
    answer: 1,
    explanation:
      "Deret ini gabungan dua seri berselang-seling: Seri 1 (posisi ganjil): 4, 8, 16, 32, ... berpola ×2. Seri 2 (posisi genap): 99, 33, 11, 3⅔, ... berpola ÷3. Dua suku yang hilang adalah 11 (seri 2) dan 32 (seri 1).",
  },
  {
    id: "eb1_6",
    cat: "kuantitatif",
    type: "Aritmetika",
    prompt: "Hitunglah: (19,9 × 7) + (3,1 × 7)",
    options: ["21,7", "117,6", "139,3", "161", "181"],
    answer: 3,
    explanation:
      "Gunakan sifat distributif: (19,9 × 7) + (3,1 × 7) = (19,9 + 3,1) × 7 = 23 × 7 = 161.",
  },
  {
    id: "eb1_7",
    cat: "kuantitatif",
    type: "Aritmetika",
    prompt: "Jumlah dari (0,68 ÷ 3⅖) dan (42% × 13) adalah …",
    options: ["5,26", "5,46", "5,66", "5,68", "5,70"],
    answer: 2,
    explanation:
      "0,68 ÷ 3⅖ = 0,68 ÷ 17/5 = 68/100 × 5/17 = 4/20 = 1/5 = 0,2. 42% × 13 = 0,42 × 13 = 5,46. Jumlah: 0,2 + 5,46 = 5,66.",
  },
  {
    id: "eb1_8",
    cat: "kuantitatif",
    type: "Aljabar",
    prompt: "Jika x < y < 0, maka bilangan yang nilainya pasti positif adalah …",
    options: ["x + y", "x − y", "1/x − 1/y", "1/x + 1/y", "−x/y − y/x"],
    answer: 2,
    explanation:
      "Karena x < y < 0, maka −y < −x, dan nilai mutlak x lebih besar dari y (x 'lebih negatif'). 1/x − 1/y = (y−x)/(xy). Karena y−x > 0 dan xy > 0 (perkalian dua negatif), maka hasilnya positif.",
  },
  {
    id: "eb1_9",
    cat: "kuantitatif",
    type: "Soal Cerita",
    prompt:
      "Alex meminjam uang Rp10.000.000 di sebuah koperasi dengan bunga 9% per tahun. Jika Alex melunasi dengan 10 kali angsuran bulanan sama besar, berapa besar angsuran per bulan?",
    options: ["Rp1.057.000", "Rp1.075.000", "Rp1.570.000", "Rp1.507.000", "Rp1.705.000"],
    answer: 1,
    explanation:
      "Pokok per bulan = 10.000.000 / 10 = Rp1.000.000. Bunga total selama 10 bulan = (10/12) × 9% × 10.000.000 = Rp750.000. Bunga per bulan = 750.000/10 = Rp75.000. Angsuran per bulan = 1.000.000 + 75.000 = Rp1.075.000.",
  },
  {
    id: "eb1_10",
    cat: "kuantitatif",
    type: "Soal Cerita",
    prompt:
      "Tujuh tahun lalu umur Ani sama dengan 6 kali umur Budi. Empat tahun yang akan datang, 2 kali umur Ani sama dengan 5 kali umur Budi ditambah 9 tahun. Umur Budi sekarang adalah…",
    options: ["42", "35", "21", "18", "13"],
    answer: 4,
    explanation:
      "Misal Ani=A, Budi=B. Persamaan 1: A−7=6(B−7) → A−6B=−35. Persamaan 2: 2(A+4)=5(B+4)+9 → 2A−5B=21. Eliminasi: dari pers.1 dikali 2 → 2A−12B=−70; dikurangi pers.2 → −7B=−91 → B=13.",
  },
  {
    id: "eb1_11",
    cat: "kuantitatif",
    type: "Kecukupan Data",
    prompt: "Berapakah nilai x + y? (1) x − y = 3. (2) x² − y² = 9.",
    options: [
      "Pernyataan (1) SAJA cukup, tetapi (2) SAJA tidak cukup",
      "Pernyataan (2) SAJA cukup, tetapi (1) SAJA tidak cukup",
      "Dua pernyataan BERSAMA-SAMA cukup, tetapi SATU pernyataan saja tidak cukup",
      "Salah satu pernyataan SAJA cukup",
      "Kedua pernyataan tidak cukup",
    ],
    answer: 2,
    explanation:
      "x² − y² = (x−y)(x+y). Substitusi (1) ke (2): 3(x+y) = 9 → x+y = 3. Nilai ini hanya bisa diperoleh dengan menggabungkan kedua pernyataan; masing-masing sendiri tidak cukup.",
  },
  {
    id: "eb1_12",
    cat: "kuantitatif",
    type: "Kecukupan Data",
    prompt: "Apakah x² − 8x + 15 = 0? (1) x ≠ 3. (2) x − 5 ≠ 0 (yaitu x ≠ 5).",
    options: [
      "Pernyataan (1) SAJA cukup, tetapi (2) SAJA tidak cukup",
      "Pernyataan (2) SAJA cukup, tetapi (1) SAJA tidak cukup",
      "Dua pernyataan BERSAMA-SAMA cukup, tetapi SATU pernyataan saja tidak cukup",
      "Salah satu pernyataan SAJA cukup",
      "Kedua pernyataan tidak cukup",
    ],
    answer: 2,
    explanation:
      "x²−8x+15=(x−3)(x−5), sehingga persamaan bernilai 0 hanya jika x=3 atau x=5. (1) saja tidak menyingkirkan kemungkinan x=5. (2) saja tidak menyingkirkan kemungkinan x=3. Digabung: x≠3 DAN x≠5 → dipastikan bukan akar → jawaban pasti (TIDAK sama dengan 0).",
  },
  {
    id: "eb1_14",
    cat: "kuantitatif",
    type: "Kecukupan Data",
    prompt:
      "Terdapat 50 siswa di kelas Pak Anto. Semua siswa dengan nilai ≥84 direkomendasikan naik tingkat. Berapa siswa yang direkomendasikan? (1) 34 siswa mendapat nilai antara 62 dan 84. (2) Nilai rata-rata ujian adalah 73.",
    options: [
      "Pernyataan (1) SAJA cukup, tetapi (2) SAJA tidak cukup",
      "Pernyataan (2) SAJA cukup, tetapi (1) SAJA tidak cukup",
      "Dua pernyataan BERSAMA-SAMA cukup, tetapi SATU pernyataan saja tidak cukup",
      "Salah satu pernyataan SAJA cukup",
      "Kedua pernyataan tidak cukup",
    ],
    answer: 4,
    explanation:
      "(1) hanya memberi jumlah siswa pada rentang tertentu, tidak menjelaskan sebaran nilai di atas 84. (2) rata-rata saja tidak memberi informasi jumlah siswa pada nilai tertentu. Digabung pun sebaran nilai individual tetap tidak diketahui — tidak cukup.",
  },
  {
    id: "eb1_15",
    cat: "kuantitatif",
    type: "Kecukupan Data",
    prompt:
      "Tentukan perbandingan jumlah dosen di Universitas Bandung. (1) Jumlah dosen perempuan adalah 250. (2) Jumlah dosen perempuan adalah 1/7 dari jumlah dosen laki-laki.",
    options: [
      "Pernyataan (1) SAJA cukup, tetapi (2) SAJA tidak cukup",
      "Pernyataan (2) SAJA cukup, tetapi (1) SAJA tidak cukup",
      "Dua pernyataan BERSAMA-SAMA cukup, tetapi SATU pernyataan saja tidak cukup",
      "Salah satu pernyataan SAJA cukup",
      "Kedua pernyataan tidak cukup",
    ],
    answer: 1,
    explanation:
      "(1) saja hanya memberi jumlah absolut dosen perempuan, tanpa jumlah dosen laki-laki — tidak bisa menentukan rasio. (2) saja sudah langsung menyatakan rasio P:L = 1:7, yang merupakan jawaban yang diminta (perbandingan), tanpa perlu angka absolut.",
  },

  // ---- Set latihan dari e-book "Latihan Soal & Pembahasan Penalaran Kuantitatif" (25 soal, 2 soal bergambar dilewati) ----
  {
    id: "eb2_1",
    cat: "kuantitatif",
    type: "Deret Angka",
    prompt: "Lengkapi deret berikut: 5, 10, 20, 40, 41, 82, …, …",
    options: ["83 dan 166", "84 dan 164", "82 dan 164", "83 dan 164", "81 dan 162"],
    answer: 0,
    explanation: "Pola berulang ×2, ×2, ×2, +1: 5×2=10, 10×2=20, 20×2=40, 40+1=41, 41×2=82, 82+1=83, 83×2=166.",
  },
  {
    id: "eb2_2",
    cat: "kuantitatif",
    type: "Deret Angka",
    prompt: "Lengkapi deret berikut: 3, 6, 11, 18, 27, …, …",
    options: ["38 dan 51", "36 dan 48", "40 dan 55", "39 dan 54", "42 dan 60"],
    answer: 0,
    explanation:
      "Selisih antar suku adalah bilangan ganjil berurutan: +3, +5, +7, +9, lalu +11, +13. 27+11=38; 38+13=51.",
  },
  {
    id: "eb2_3",
    cat: "kuantitatif",
    type: "Deret Angka",
    prompt: "Lengkapi deret berikut: 4, 9, 19, 39, …, …",
    options: ["59 dan 79", "79 dan 159", "79 dan 169", "69 dan 139", "89 dan 179"],
    answer: 1,
    explanation:
      "Selisih antar suku berlipat dua: 9−4=5; 19−9=10; 39−19=20; selisih berikutnya 40, lalu 80. 39+40=79; 79+80=159.",
  },
  {
    id: "eb2_4",
    cat: "kuantitatif",
    type: "Deret Angka",
    prompt: "Lengkapi deret berikut: 6, 12, 10, 5, 10, 9, 3, …, …",
    options: ["5 dan 10", "6 dan 2", "6 dan 5", "2 dan 4", "9 dan 3"],
    answer: 2,
    explanation:
      "Pola berulang ×2, −2, ÷2: 6×2=12, 12−2=10, 10÷2=5, 5×2=10, 10−1=9, 9÷3=3, 3×2=6, 6−1=5. Hasil: 6 dan 5.",
  },
  {
    id: "eb2_5",
    cat: "kuantitatif",
    type: "Deret Angka",
    prompt: "Lengkapi deret berikut: 8, 16, 14, 7, 14, 12, 4, …, …",
    options: ["7 dan 14", "6 dan 2", "8 dan 6", "4 dan 8", "5 dan 10"],
    answer: 2,
    explanation:
      "Pola berulang ×2, −2, ÷2 (dengan pembagi bervariasi): 8×2=16, 16−2=14, 14÷2=7, 7×2=14, 14−2=12, 12÷3=4, 4×2=8, 8−2=6. Hasil: 8 dan 6.",
  },
  {
    id: "eb2_6",
    cat: "kuantitatif",
    type: "Deret Angka",
    prompt: "Lengkapi deret berikut: 9, 18, 15, 5, 10, 8, 4, …, …",
    options: ["6 dan 2", "4 dan 6", "7 dan 14", "8 dan 5", "5 dan 10"],
    answer: 3,
    explanation:
      "Pola berulang ×2, −3, ÷3 (lalu ×2, −2, ÷2): 9×2=18, 18−3=15, 15÷3=5, 5×2=10, 10−2=8, 8÷2=4, 4×2=8, 8−1=... hasil akhir 8 dan 5.",
  },
  {
    id: "eb2_7",
    cat: "kuantitatif",
    type: "Bilangan Berpangkat & Akar",
    prompt: "Hitunglah nilai dari: 3√20 − √45 + 2√80",
    options: ["9√5", "10√5", "11√5", "12√5", "13√5"],
    answer: 2,
    explanation:
      "Sederhanakan tiap akar: 3√20=3×2√5=6√5. √45=3√5. 2√80=2×4√5=8√5. Jumlahkan: 6√5−3√5+8√5=11√5.",
  },
  {
    id: "eb2_8",
    cat: "kuantitatif",
    type: "Bilangan Berpangkat & Akar",
    prompt: "Nilai dari 16^(1/2) + 8^(2/3) adalah…",
    options: ["6", "8", "10", "12", "14"],
    answer: 1,
    explanation: "16^(1/2)=√16=4. 8^(2/3)=(∛8)²=2²=4. Jumlah: 4+4=8.",
  },
  {
    id: "eb2_9",
    cat: "kuantitatif",
    type: "Aljabar",
    prompt: "Jika 2x + 3y = 13 dan 3x − y = 3, berapakah nilai x + y?",
    options: ["2", "3", "4", "5", "6"],
    answer: 3,
    explanation:
      "Dari 3x−y=3 → y=3x−3. Substitusi: 2x+3(3x−3)=13 → 2x+9x−9=13 → 11x=22 → x=2. Maka y=3(2)−3=3. x+y=2+3=5.",
  },
  {
    id: "eb2_10",
    cat: "kuantitatif",
    type: "Aritmetika",
    prompt: "Jika P adalah 25% dari 24 dan Q adalah 1/2 dari 12, maka…",
    options: ["P < Q", "P = Q", "P > Q", "P = 2Q", "P = 1/2 Q"],
    answer: 1,
    explanation: "P = 25%×24 = 1/4×24 = 6. Q = 1/2×12 = 6. Maka P = Q.",
  },
  {
    id: "eb2_11",
    cat: "kuantitatif",
    type: "Perbandingan",
    prompt:
      "Ali memerlukan 3 kg gula untuk membuat 6 toples kue (artinya 1 toples butuh 0,5 kg gula). Bandingkan: P = jumlah gula (kg) untuk membuat 4 toples kue; Q = 3/2 kg. Hubungan yang benar antara P dan Q adalah…",
    options: ["P > Q", "Q > P", "P = Q", "P ≤ Q", "Informasi tidak cukup"],
    answer: 0,
    explanation: "P = 4 × 0,5 kg = 2 kg. Q = 3/2 kg = 1,5 kg. Karena 2 > 1,5, maka P > Q.",
  },
  {
    id: "eb2_12",
    cat: "kuantitatif",
    type: "Soal Cerita",
    prompt:
      "Proyek A butuh 14 pekerja selesai dalam 10 hari; Proyek B butuh 20 pekerja dalam 7 hari; Proyek C butuh 28 pekerja dalam 5 hari. Jika perusahaan memiliki 35 pekerja untuk mengerjakan ketiganya sekaligus, berapa hari dibutuhkan?",
    options: ["8 hari", "10 hari", "12 hari", "14 hari", "16 hari"],
    answer: 2,
    explanation:
      "Total 'orang-hari' tiap proyek sama besarnya: 14×10=140; 20×7=140; 28×5=140. Total keseluruhan = 140×3=420. Dengan 35 pekerja: 420/35=12 hari.",
  },
  {
    id: "eb2_13",
    cat: "kuantitatif",
    type: "Soal Cerita",
    prompt:
      "Sebuah tangki memiliki 3 keran: keran A mengisi tangki dalam 4 jam, keran B dalam 6 jam, keran C dalam 12 jam. Jika ketiganya dibuka bersamaan, berapa jam untuk mengisi penuh tangki?",
    options: ["1,5 jam", "2 jam", "2,4 jam", "3 jam", "4 jam"],
    answer: 1,
    explanation:
      "Laju gabungan = 1/4 + 1/6 + 1/12 = 3/12 + 2/12 + 1/12 = 6/12 = 1/2 tangki per jam. Waktu = 1 ÷ (1/2) = 2 jam.",
  },
  {
    id: "eb2_14",
    cat: "kuantitatif",
    type: "Soal Cerita",
    prompt:
      "Pengendara A berangkat dengan kecepatan 50 km/jam. Dua jam kemudian, pengendara B berangkat dari kota yang sama, jalur sama, kecepatan 70 km/jam. Setelah 3 jam sejak A berangkat, apakah B sudah menyusul A, dan berapa jaraknya?",
    options: [
      "Belum menyusul, jarak 50 km",
      "Belum menyusul, jarak 80 km",
      "Tepat menyusul, jarak 0 km",
      "Sudah menyusul, jarak 20 km",
      "Sudah menyusul, jarak 30 km",
    ],
    answer: 1,
    explanation:
      "Jarak A setelah 3 jam = 50×3=150 km. B baru berjalan 1 jam (berangkat 2 jam lebih lambat) = 70×1=70 km. Selisih = 150−70=80 km, B belum menyusul.",
  },
  {
    id: "eb2_15",
    cat: "kuantitatif",
    type: "Soal Cerita",
    prompt:
      "Pedagang membeli 150 kg gula seharga Rp8.000/kg. Ia menjual 100 kg seharga Rp9.000/kg, sisanya seharga Rp7.500/kg. Berapa persentase untung/rugi pedagang?",
    options: ["2% untung", "2,25% rugi", "4% untung", "4,25% rugi", "6,25% untung"],
    answer: 4,
    explanation:
      "Modal = 150×8.000=1.200.000. Penjualan = (100×9.000)+(50×7.500) = 900.000+375.000=1.275.000. Untung = 1.275.000−1.200.000=75.000. Persentase = 75.000/1.200.000×100% = 6,25% untung.",
  },
  {
    id: "eb2_16",
    cat: "kuantitatif",
    type: "Soal Cerita",
    prompt:
      "Perusahaan dengan 200 karyawan memberi bonus: 25% dapat Rp4.000.000, 35% dapat Rp2.000.000, sisanya dapat Rp1.000.000. Berapa total bonus yang dibagikan?",
    options: ["Rp360.000.000", "Rp380.000.000", "Rp400.000.000", "Rp420.000.000", "Rp440.000.000"],
    answer: 3,
    explanation:
      "25%×200=50 orang → 50×4jt=200jt. 35%×200=70 orang → 70×2jt=140jt. Sisa 80 orang → 80×1jt=80jt. Total = 200+140+80 = Rp420.000.000.",
  },
  {
    id: "eb2_17",
    cat: "kuantitatif",
    type: "Kecukupan Data",
    prompt: "Apakah x > y? (1) x + y = 10. (2) x − y = 2.",
    options: [
      "Pernyataan (1) SAJA cukup, tetapi (2) SAJA tidak cukup",
      "Pernyataan (2) SAJA cukup, tetapi (1) SAJA tidak cukup",
      "Dua pernyataan BERSAMA-SAMA cukup, tetapi SATU pernyataan saja tidak cukup",
      "Salah satu pernyataan SAJA cukup",
      "Kedua pernyataan tidak cukup",
    ],
    answer: 1,
    explanation:
      "(1) saja tidak cukup — x dan y bisa berbagai kombinasi (mis. 6&4 atau 4&6). (2) saja sudah cukup: x−y=2 berarti x=y+2, yang secara pasti berarti x lebih besar dari y, tanpa perlu tahu nilai persisnya.",
  },
  {
    id: "eb2_19",
    cat: "kuantitatif",
    type: "Kecukupan Data",
    prompt: "Apakah x < 0? (1) x² > 0. (2) x³ < 0.",
    options: [
      "Pernyataan (1) SAJA cukup, tetapi (2) SAJA tidak cukup",
      "Pernyataan (2) SAJA cukup, tetapi (1) SAJA tidak cukup",
      "Dua pernyataan BERSAMA-SAMA cukup, tetapi SATU pernyataan saja tidak cukup",
      "Salah satu pernyataan SAJA cukup",
      "Kedua pernyataan tidak cukup",
    ],
    answer: 1,
    explanation:
      "(1) x²>0 hanya berarti x≠0 — x bisa positif atau negatif, tidak cukup. (2) x³<0 hanya mungkin jika x negatif (pangkat ganjil mempertahankan tanda), sehingga sudah pasti menjawab: ya, x<0.",
  },
  {
    id: "eb2_20",
    cat: "kuantitatif",
    type: "Kecukupan Data",
    prompt: "Berapakah nilai dari x + y? (1) x − y = 3. (2) x² − y² = 9.",
    options: [
      "Pernyataan (1) SAJA cukup, tetapi (2) SAJA tidak cukup",
      "Pernyataan (2) SAJA cukup, tetapi (1) SAJA tidak cukup",
      "Dua pernyataan BERSAMA-SAMA cukup, tetapi SATU pernyataan saja tidak cukup",
      "Salah satu pernyataan SAJA cukup",
      "Kedua pernyataan tidak cukup",
    ],
    answer: 2,
    explanation:
      "x²−y²=(x−y)(x+y). Substitusi (1): 3(x+y)=9 → x+y=3, nilai tunggal dan pasti. Masing-masing pernyataan sendiri tidak cukup, tapi digabung menghasilkan jawaban pasti.",
  },
  {
    id: "eb2_21",
    cat: "kuantitatif",
    type: "Kecukupan Data",
    prompt: "Berapa luas lingkaran dengan pusat O? (1) Diameter lingkaran adalah 14 cm. (2) Jari-jari lingkaran adalah 7 cm.",
    options: [
      "Pernyataan (1) SAJA cukup, tetapi (2) SAJA tidak cukup",
      "Pernyataan (2) SAJA cukup, tetapi (1) SAJA tidak cukup",
      "Dua pernyataan BERSAMA-SAMA cukup, tetapi SATU pernyataan saja tidak cukup",
      "Salah satu pernyataan SAJA cukup",
      "Kedua pernyataan tidak cukup",
    ],
    answer: 3,
    explanation:
      "(1) diameter 14 cm dapat langsung dikonversi ke jari-jari (7 cm) untuk menghitung luas. (2) jari-jari 7 cm juga langsung bisa dipakai. Masing-masing pernyataan SAJA sudah cukup secara independen.",
  },
  {
    id: "eb2_24",
    cat: "kuantitatif",
    type: "Kecukupan Data",
    prompt: "Berapa harga sebuah donat? (1) Harga 3 donat dan 2 roti adalah Rp28.000. (2) Harga sebuah roti adalah Rp5.000.",
    options: [
      "Pernyataan (1) SAJA cukup, tetapi (2) SAJA tidak cukup",
      "Pernyataan (2) SAJA cukup, tetapi (1) SAJA tidak cukup",
      "Dua pernyataan BERSAMA-SAMA cukup, tetapi SATU pernyataan saja tidak cukup",
      "Salah satu pernyataan SAJA cukup",
      "Kedua pernyataan tidak cukup",
    ],
    answer: 2,
    explanation:
      "(1) saja punya dua variabel (donat & roti) — tidak cukup. (2) saja hanya memberi harga roti — tidak cukup. Digabung: 3D + 2(5.000) = 28.000 → 3D = 18.000 → D = Rp6.000, jawaban pasti.",
  },
  {
    id: "eb2_25",
    cat: "kuantitatif",
    type: "Kecukupan Data",
    prompt:
      "Berapa umur Anton? (1) Umur Anton 3 tahun lebih muda dari umur Beni. (2) Umur Candra 2 kali umur Anton; umur Beni 1 tahun lebih tua dari Candra.",
    options: [
      "Pernyataan (1) SAJA cukup, tetapi (2) SAJA tidak cukup",
      "Pernyataan (2) SAJA cukup, tetapi (1) SAJA tidak cukup",
      "Dua pernyataan BERSAMA-SAMA cukup, tetapi SATU pernyataan saja tidak cukup",
      "Salah satu pernyataan SAJA cukup",
      "Kedua pernyataan tidak cukup",
    ],
    answer: 2,
    explanation:
      "Misal Anton=x. Dari (1): Beni=x+3. Dari (2): Candra=2x, dan Beni=Candra+1=2x+1. Karena kedua ekspresi sama-sama merepresentasikan Beni, gabungkan: x+3=2x+1 → x=2. Jadi umur Anton=2 tahun — hanya bisa dipastikan dengan menggabungkan (1) dan (2); masing-masing sendiri tidak cukup.",
  },

  // ---- Soal cerita latihan ----
  {
    id: "aw23_1",
    cat: "kuantitatif",
    type: "Aritmetika",
    prompt: "Hitunglah nilai dari: 2024² − 2023² + 2017² − 2016²",
    options: ["7.080", "8.080", "8.180", "9.080", "8.008"],
    answer: 1,
    explanation:
      "Gunakan a²−b²=(a−b)(a+b). (2024−2023)(2024+2023) + (2017−2016)(2017+2016) = (1)(4047) + (1)(4033) = 4047+4033 = 8.080.",
  },
  {
    id: "aw23_2",
    cat: "kuantitatif",
    type: "Soal Cerita",
    prompt:
      "Seorang pekerja menerima total gaji (gaji pokok + uang lembur) sebesar Rp6.185.000 dalam sebulan (4 minggu). Minggu 1 lembur 4 jam lebih lama dari minggu 3. Minggu 2 lemburnya 1/3 lebih banyak dari minggu 1. Minggu 3 lemburnya 2 jam lebih sedikit dari minggu 4. Minggu 4 menerima uang lembur Rp385.000, dengan tarif lembur Rp55.000/jam. Berapa gaji pokok pekerja tersebut?",
    options: ["Rp4.070.000", "Rp4.370.000", "Rp4.520.000", "Rp4.185.000", "Rp4.600.000"],
    answer: 1,
    explanation:
      "Minggu4 = 385.000/55.000 = 7 jam. Minggu3 = 7−2 = 5 jam. Minggu1 = 5+4 = 9 jam. Minggu2 = 9×4/3 = 12 jam. Total jam = 9+12+5+7 = 33 jam. Total uang lembur = 33×55.000 = Rp1.815.000. Gaji pokok = 6.185.000 − 1.815.000 = Rp4.370.000.",
  },
  {
    id: "aw23_3",
    cat: "kuantitatif",
    type: "Aljabar",
    prompt:
      "Harga 1 liter susu = harga 2 kg beras. Harga 1 kg telur = setengah dari (harga 1 liter susu + harga 1 kg beras). Jika harga (1 liter susu + 1,5 kg beras + 1 kg telur) = Rp35.000, berapa harga (1 liter susu + 2 kg beras)?",
    options: ["Rp24.000", "Rp26.000", "Rp28.000", "Rp30.000", "Rp32.000"],
    answer: 2,
    explanation:
      "Misal beras=B. Susu=2B. Telur=(2B+B)/2=1,5B. Persamaan: 2B+1,5B+1,5B=35.000 → 5B=35.000 → B=7.000. Susu=14.000. Ditanya: Susu+2B = 14.000+14.000 = Rp28.000.",
  },
  {
    id: "aw23_4",
    cat: "kuantitatif",
    type: "Soal Cerita",
    prompt: "Tembok seluas 75 m² dicat oleh 9 orang dan selesai dalam 8 jam. Berapa jam dibutuhkan oleh 5 orang untuk mengecat tembok seluas 50 m² (asumsi laju kerja sama)?",
    options: ["8 jam", "8,8 jam", "9,6 jam", "10,2 jam", "11 jam"],
    answer: 2,
    explanation:
      "Total 'orang-jam' untuk 75m² = 9×8=72. Kebutuhan orang-jam per m² = 72/75. Untuk 50m²: 50×(72/75)=48 orang-jam. Dengan 5 orang: 48/5 = 9,6 jam.",
  },
  {
    id: "aw23_5",
    cat: "kuantitatif",
    type: "Soal Cerita",
    prompt:
      "Pedagang membeli 75 kg mangga seharga Rp9.000.000. Sebanyak 20% mangga busuk dan tidak bisa dijual. Jika pedagang ingin untung 40% dari modal, berapa harga jual per kg mangga yang harus ditetapkan?",
    options: ["Rp180.000", "Rp195.000", "Rp210.000", "Rp225.000", "Rp240.000"],
    answer: 2,
    explanation:
      "Target total penjualan = modal × 1,4 = 9.000.000×1,4 = Rp12.600.000. Mangga yang bisa dijual = 75×80% = 60 kg. Harga jual/kg = 12.600.000/60 = Rp210.000.",
  },

  // ---- Dari materi "Dunia Pendidikan Official — TBS PDDI 2026, 24 Juli" ----
  {
    id: "dp_k1",
    cat: "kuantitatif",
    type: "Aritmetika",
    prompt: "Berapa 35% dari 480?",
    options: ["148", "158", "168", "178", "188"],
    answer: 2,
    explanation: "35% × 480 = 0,35×480 = 168. Cara cepat: 30%×480=144, 5%×480=24, jumlah=168.",
  },
  {
    id: "dp_k2",
    cat: "kuantitatif",
    type: "Perbandingan",
    prompt: "Rasio siswa laki-laki dan perempuan adalah 3:5. Jika jumlah seluruh siswa 64, berapa siswa perempuan?",
    options: ["24", "32", "40", "48", "56"],
    answer: 2,
    explanation: "Jumlah bagian = 3+5=8. Nilai 1 bagian = 64÷8=8. Siswa perempuan = 5×8=40.",
  },
  {
    id: "dp_k3",
    cat: "kuantitatif",
    type: "Statistika",
    prompt: "Rata-rata dari 72, 76, 80, 84, dan 88 adalah ...",
    options: ["78", "79", "80", "81", "82"],
    answer: 2,
    explanation: "Jumlah=72+76+80+84+88=400. Rata-rata=400÷5=80. (Deret simetris terhadap 80: pasangan 72&88 dan 76&84 sama-sama rata-rata 80.)",
  },
  {
    id: "dp_k4",
    cat: "kuantitatif",
    type: "Deret Angka",
    prompt: "Tentukan angka berikutnya: 4, 7, 13, 25, 49, ...",
    options: ["73", "81", "89", "97", "101"],
    answer: 3,
    explanation: "Pola ×2−1: 4×2−1=7; 7×2−1=13; 13×2−1=25; 25×2−1=49; 49×2−1=97.",
  },
  {
    id: "dp_k5",
    cat: "kuantitatif",
    type: "Aljabar",
    prompt: "Jika 2x + 5 = 23, nilai x adalah ...",
    options: ["7", "8", "9", "10", "11"],
    answer: 2,
    explanation: "2x=23−5=18 → x=18÷2=9.",
  },
  {
    id: "dp_k6",
    cat: "kuantitatif",
    type: "Soal Cerita",
    prompt: "Mobil bergerak 72 km/jam selama 2,5 jam. Berapa jarak tempuhnya?",
    options: ["144 km", "160 km", "180 km", "192 km", "200 km"],
    answer: 2,
    explanation: "Jarak = 72×2,5 = 72×2 + 72×0,5 = 144+36 = 180 km.",
  },
  {
    id: "dp_k7",
    cat: "kuantitatif",
    type: "Soal Cerita",
    prompt: "Enam pekerja menghasilkan 480 unit dalam 8 jam. Berapa unit dihasilkan 10 pekerja dalam 6 jam dengan produktivitas sama?",
    options: ["480", "540", "600", "640", "720"],
    answer: 2,
    explanation: "Total jam-orang awal=6×8=48. Produktivitas=480÷48=10 unit/jam-orang. Kondisi baru=10×6=60 jam-orang. Hasil=60×10=600 unit.",
  },
  {
    id: "dp_k8",
    cat: "kuantitatif",
    type: "Aritmetika",
    prompt: "25% dari 360 = ...",
    options: ["80", "85", "90", "95"],
    answer: 2,
    explanation: "25%=1/4. 360÷4=90.",
  },
  {
    id: "dp_k9",
    cat: "kuantitatif",
    type: "Aljabar",
    prompt: "Jika 5x − 9 = 31, x = ...",
    options: ["6", "7", "8", "9"],
    answer: 2,
    explanation: "5x=31+9=40 → x=40÷5=8.",
  },
  {
    id: "dp_k10",
    cat: "kuantitatif",
    type: "Deret Angka",
    prompt: "Lanjutkan pola: 2, 5, 10, 17, 26, ...",
    options: ["35", "36", "37", "38"],
    answer: 2,
    explanation: "Selisih bilangan ganjil berurutan: +3,+5,+7,+9, lalu +11. 26+11=37. (Pola juga = n²+1 untuk n=1..6.)",
  },

  // ---------------- PEMECAHAN MASALAH ----------------
  {
    id: "m1",
    cat: "masalah",
    type: "Silogisme",
    prompt:
      "Premis 1: Semua peneliti yang produktif rajin membaca jurnal. Premis 2: Budi adalah peneliti yang produktif. Simpulan yang paling tepat adalah...",
    options: [
      "Budi rajin membaca jurnal",
      "Semua yang rajin membaca jurnal adalah peneliti produktif",
      "Budi bukan peneliti produktif",
      "Tidak dapat disimpulkan",
      "Budi tidak rajin membaca jurnal",
    ],
    answer: 0,
    explanation: "Modus Ponens sederhana: jika semua A adalah B, dan Budi adalah A, maka Budi pasti B.",
  },
  {
    id: "m2",
    cat: "masalah",
    type: "Logika Penempatan",
    prompt:
      "Lima orang (P, Q, R, S, T) duduk berjajar menghadap ke depan. Diketahui: P duduk di ujung kiri. R tepat di sebelah kanan P. Q duduk di ujung kanan. S tidak bersebelahan dengan R. Urutan dari kiri ke kanan yang tepat adalah...",
    options: ["P, R, S, T, Q", "P, R, T, S, Q", "P, T, R, S, Q", "R, P, T, S, Q", "P, R, T, Q, S"],
    answer: 1,
    explanation:
      "P di posisi 1, R di posisi 2 (syarat 1 & 2). Q di posisi 5 (syarat 3). Tersisa posisi 3 dan 4 untuk S dan T. Karena S tidak boleh bersebelahan dengan R (posisi 2), S tidak boleh di posisi 3 — maka S di posisi 4 dan T di posisi 3. Urutan final: P, R, T, S, Q.",
  },
  {
    id: "m3",
    cat: "masalah",
    type: "Analisis Data",
    prompt:
      "Tabel penjualan (unit) tiga produk selama 3 bulan: Produk A: 120, 150, 180. Produk B: 200, 190, 175. Produk C: 90, 130, 170. Produk manakah yang menunjukkan tren pertumbuhan paling konsisten (naik terus setiap bulan) dengan kenaikan terbesar dari bulan 1 ke bulan 3?",
    options: ["Produk A", "Produk B", "Produk C", "A dan C sama", "Tidak ada yang konsisten naik"],
    answer: 2,
    explanation:
      "A naik terus (120→150→180, +60 total). B justru turun (200→190→175). C naik terus (90→130→170, +80 total) — kenaikan totalnya lebih besar dari A. Jadi C adalah yang paling konsisten naik dengan kenaikan terbesar.",
  },
  {
    id: "m4",
    cat: "masalah",
    type: "Silogisme",
    prompt:
      "Premis 1: Tidak ada mahasiswa kedokteran yang tidak lulus UKMPPD boleh berpraktik. Premis 2: Ani boleh berpraktik. Simpulan yang paling tepat adalah...",
    options: [
      "Ani bukan mahasiswa kedokteran",
      "Ani lulus UKMPPD",
      "Ani tidak lulus UKMPPD",
      "Ani belum tentu lulus UKMPPD",
      "Tidak dapat disimpulkan apa pun",
    ],
    answer: 1,
    explanation:
      "Premis 1 setara dengan: 'Semua yang boleh berpraktik pasti lulus UKMPPD' (kontraposisi). Karena Ani boleh berpraktik, maka Ani pasti lulus UKMPPD.",
  },
  {
    id: "m5",
    cat: "masalah",
    type: "Sebab-Akibat",
    prompt:
      "Dua pernyataan: (1) Tingkat literasi digital di daerah X meningkat 30% dalam 2 tahun. (2) Jumlah pengaduan penipuan daring di daerah X justru meningkat 15% pada periode yang sama. Hubungan yang paling logis antara kedua pernyataan tersebut adalah...",
    options: [
      "Pernyataan (2) adalah akibat langsung dan satu-satunya dari pernyataan (1)",
      "Kedua pernyataan saling meniadakan sehingga salah satu pasti keliru",
      "Peningkatan literasi digital tidak otomatis menurunkan penipuan daring; faktor lain (mis. makin banyak pengguna baru) bisa berperan",
      "Pernyataan (1) pasti salah karena bertentangan dengan (2)",
      "Tidak ada hubungan yang bisa dianalisis dari kedua data ini",
    ],
    answer: 2,
    explanation:
      "Data tidak menunjukkan hubungan kausal langsung berlawanan arah; korelasi bukan kausalitas. Opsi C paling hati-hati secara logis — mengakui kemungkinan faktor lain tanpa membuat klaim berlebihan.",
  },
  {
    id: "m6",
    cat: "masalah",
    type: "Logika Penempatan",
    prompt:
      "Empat kota (K, L, M, N) diurutkan berdasarkan jaraknya dari ibu kota, dari yang terdekat. Diketahui: L lebih jauh dari M tapi lebih dekat dari N. K adalah yang terjauh. Urutan dari terdekat ke terjauh adalah...",
    options: ["M, L, N, K", "L, M, N, K", "M, N, L, K", "N, M, L, K", "M, L, K, N"],
    answer: 0,
    explanation:
      "L lebih jauh dari M → M sebelum L. L lebih dekat dari N → L sebelum N. K terjauh → K di posisi terakhir. Urutan: M, L, N, K.",
  },
  {
    id: "m7",
    cat: "masalah",
    type: "Analisis Data",
    prompt:
      "Sebuah survei menunjukkan 70% responden mendukung kebijakan A, namun hanya 40% dari pendukung tersebut yang bersedia membayar lebih untuk kebijakan tersebut. Berapa persen dari TOTAL responden yang mendukung DAN bersedia membayar lebih?",
    options: ["24%", "28%", "30%", "40%", "70%"],
    answer: 1,
    explanation: "40% dari 70% = 0,4 × 0,7 = 0,28 = 28% dari total responden.",
  },
  {
    id: "m8",
    cat: "masalah",
    type: "Silogisme",
    prompt:
      "Premis 1: Sebagian dosen adalah peneliti aktif. Premis 2: Semua peneliti aktif rutin mempublikasikan artikel. Simpulan yang paling tepat adalah...",
    options: [
      "Semua dosen rutin mempublikasikan artikel",
      "Sebagian dosen rutin mempublikasikan artikel",
      "Tidak ada dosen yang mempublikasikan artikel",
      "Semua yang mempublikasikan artikel adalah dosen",
      "Tidak dapat disimpulkan apa pun",
    ],
    answer: 1,
    explanation:
      "Karena hanya 'sebagian' dosen yang peneliti aktif, simpulan juga harus berupa 'sebagian' — bukan 'semua'. Sebagian dosen (yaitu yang peneliti aktif) pasti rutin mempublikasikan artikel.",
  },
  {
    id: "m9",
    cat: "masalah",
    type: "Sebab-Akibat",
    prompt:
      "Sebuah rumah sakit mencatat penurunan lama rawat inap pasien pascaoperasi dari rata-rata 6 hari menjadi 4 hari setelah menerapkan protokol pemulihan dini (early mobilization). Kesimpulan yang PALING dapat dipertanggungjawabkan dari data ini adalah...",
    options: [
      "Protokol tersebut pasti satu-satunya penyebab penurunan lama rawat",
      "Penurunan lama rawat berasosiasi dengan penerapan protokol; diperlukan kontrol variabel lain untuk memastikan kausalitas",
      "Data ini tidak berguna karena tidak ada hubungan sebab-akibat dalam kesehatan",
      "Semua rumah sakit lain pasti akan mengalami hasil yang sama",
      "Protokol tersebut terbukti aman untuk semua jenis operasi",
    ],
    answer: 1,
    explanation:
      "Ini prinsip dasar penalaran ilmiah: data observasional menunjukkan asosiasi, bukan otomatis kausalitas murni — perlu kontrol variabel perancu sebelum klaim sebab-akibat kuat dibuat.",
  },
  {
    id: "m10",
    cat: "masalah",
    type: "Analisis Data",
    prompt:
      "Dari 200 mahasiswa, 120 mengikuti klub A, 90 mengikuti klub B, dan 40 mengikuti keduanya. Berapa mahasiswa yang TIDAK mengikuti klub A maupun B?",
    options: ["20", "30", "40", "50", "60"],
    answer: 1,
    explanation:
      "Jumlah yang ikut minimal satu klub = 120 + 90 − 40 = 170 (prinsip inklusi-eksklusi). Yang tidak ikut sama sekali = 200 − 170 = 30.",
  },
  {
    id: "m11",
    cat: "masalah",
    type: "Logika Penempatan",
    prompt:
      "Jika hari ini bukan hari Senin dan bukan hari Selasa, dan diketahui besok adalah hari Kamis, maka hari ini adalah...",
    options: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"],
    answer: 2,
    explanation: "Jika besok Kamis, maka hari ini pasti Rabu — dan ini konsisten dengan syarat bukan Senin/Selasa.",
  },
  {
    id: "m12",
    cat: "masalah",
    type: "Silogisme",
    prompt:
      "Premis 1: Jika sebuah kebijakan tidak dievaluasi secara berkala, maka kebijakan itu berisiko tidak relevan. Premis 2: Kebijakan Z dievaluasi secara berkala. Simpulan yang paling tepat adalah...",
    options: [
      "Kebijakan Z pasti relevan",
      "Kebijakan Z tidak berisiko tidak relevan karena alasan ini",
      "Dari premis ini saja, tidak dapat disimpulkan apakah Z relevan atau tidak",
      "Kebijakan Z berisiko tidak relevan",
      "Kebijakan Z sama saja dengan kebijakan yang tidak dievaluasi",
    ],
    answer: 2,
    explanation:
      "Premis 1 hanya menyatakan konsekuensi dari TIDAK dievaluasi. Karena Z DIEVALUASI (menyangkal anteseden), kita tidak bisa otomatis menyimpulkan konsekuensinya (relevan) — ini adalah jebakan logika 'denying the antecedent'.",
  },

  // ---- Dari e-book "Kumpulan Latihan Soal & Pembahasan" (data & tabel, Try Out Seri 1) ----
  {
    id: "kl1_m1",
    cat: "masalah",
    type: "Analisis Data",
    prompt:
      "Tabel jumlah pengangguran terbuka (juta orang): 2022 = 7,8 · 2023 = 7,2 · 2024 = 6,6. Jika tren penurunan berlanjut dengan laju yang sama, berapa perkiraan jumlah pengangguran terbuka pada 2025?",
    options: ["6,0 juta", "6,2 juta", "5,8 juta", "5,6 juta", "5,4 juta"],
    answer: 0,
    explanation: "Penurunan tiap tahun konsisten sebesar 0,6 juta (7,8→7,2→6,6). Maka 2025 = 6,6 − 0,6 = 6,0 juta.",
  },
  {
    id: "kl1_m2",
    cat: "masalah",
    type: "Analisis Data",
    prompt:
      "Volume sampah plastik di Indonesia sekitar 68 juta ton per tahun, dengan hanya 10% yang berhasil didaur ulang. Pemerintah menargetkan pengurangan sampah plastik sebesar 30% pada 2030. Jika target tercapai, berapa juta ton sampah plastik berhasil dikurangi?",
    options: ["6,8 juta ton", "13,6 juta ton", "20,4 juta ton", "30 juta ton", "34 juta ton"],
    answer: 2,
    explanation: "30% × 68 juta ton = 20,4 juta ton.",
  },
  {
    id: "kl1_m3",
    cat: "masalah",
    type: "Analisis Data",
    prompt:
      "Anggaran Belanja Daerah Kota X (miliar rupiah): Pendidikan 800→900 · Kesehatan 600→750 · Infrastruktur 500→550 · Lain-lain 100→100 (2023→2024). Kenaikan persentase terbesar terjadi pada sektor…",
    options: ["Pendidikan", "Kesehatan", "Infrastruktur", "Lain-lain", "Semua sama"],
    answer: 1,
    explanation:
      "Persentase kenaikan: Pendidikan 100/800=12,5%. Kesehatan 150/600=25%. Infrastruktur 50/500=10%. Lain-lain 0%. Terbesar: Kesehatan.",
  },
  {
    id: "kl1_m4",
    cat: "masalah",
    type: "Analisis Data",
    prompt:
      "Harga beras per kg (Rp) Triwulan I 2024: Aceh Besar (Jan 10.000, Feb 15.000, Mar 18.000) · Banda Aceh (15.000, 17.000, 18.000) · Meulaboh (16.000, 18.000, 20.000) · Nagan Raya (12.000, 15.000, 18.000) · Blang Pidie (15.000, 15.000, 15.000). Simpulan yang tepat dari data ini adalah…",
    options: [
      "Harga beras di semua tempat menurun setiap bulan",
      "Harga beras setiap bulannya relatif stabil di semua tempat",
      "Harga beras di Nagan Raya selalu menurun setiap bulan",
      "Secara garis besar harga beras di Nagan Raya sulit ditentukan",
      "Harga beras di Meulaboh selalu tertinggi setiap bulannya",
    ],
    answer: 4,
    explanation:
      "Bandingkan tiap bulan: Meulaboh selalu memiliki harga tertinggi (16.000 di Januari, 18.000 di Februari, 20.000 di Maret) dibanding semua tempat lain pada bulan yang sama.",
  },
  {
    id: "kl1_m5",
    cat: "masalah",
    type: "Analisis Data",
    prompt:
      "Data tingkat pendidikan penduduk suatu desa: SD 10% · SMP 23% · SMA 58% · S1 9%. Pernyataan yang sesuai dengan data tersebut adalah…",
    options: [
      "Tamatan SD merupakan yang paling sedikit",
      "Tamatan SD dan S1 hanya selisih 3%",
      "Persentase lulusan SMP hampir sama dengan lulusan SD",
      "Jumlah tamatan SMA meningkat setiap tahunnya",
      "Lebih dari seperempat penduduk desa merupakan tamatan SMA",
    ],
    answer: 4,
    explanation: "58% jauh lebih dari 25% (seperempat), sehingga pernyataan E benar. Opsi lain salah: S1 (9%) justru paling sedikit, bukan SD; selisih SD-S1 hanya 1% bukan 3%; data ini snapshot satu tahun, tidak menunjukkan tren.",
  },
  {
    id: "kl1_m6",
    cat: "masalah",
    type: "Analisis Data",
    prompt:
      "Data produksi perikanan (ribu ton): Budidaya naik dari 9.676 (2012) menjadi 16.002 (2016) — hampir dua kali lipat dalam 5 tahun. Perikanan Tangkap relatif stagnan: 5.829 (2012) menjadi 6.580 (2016). Simpulan yang paling didukung data adalah…",
    options: [
      "Perikanan tangkap dapat diandalkan untuk pasokan pangan nasional di masa depan",
      "Pemerintah wajib meningkatkan produksi perikanan selain tangkap dan budidaya",
      "Pada 2012–2017 produksi tangkap akan sama dengan budidaya",
      "Perikanan budidaya dapat lebih diandalkan untuk pasokan pangan nasional di masa depan",
      "Perikanan budidaya lebih diandalkan karena diproduksi dengan teknologi canggih",
    ],
    answer: 3,
    explanation:
      "Data menunjukkan budidaya meningkat konsisten dan signifikan (hampir 2×) sementara tangkap stagnan — sehingga budidaya lebih dapat diandalkan ke depan. Opsi E tidak didukung data karena tidak ada informasi soal teknologi.",
  },
  {
    id: "kl1_m7",
    cat: "masalah",
    type: "Analisis Data",
    prompt:
      "Data produksi perikanan keramba per tahun (ribu ton): 2012=178 · 2013=200 · 2014=221 · 2015=194 · 2016=204. Berapa rata-rata produksi perikanan budidaya kategori keramba selama periode tersebut?",
    options: ["300 ton", "199,4 ton", "198,4 ton", "199,5 ton", "198,5 ton"],
    answer: 1,
    explanation: "Jumlah = 178+200+221+194+204 = 997. Rata-rata = 997 / 5 = 199,4.",
  },
];

const CATEGORY_ORDER = ["verbal", "kuantitatif", "masalah"];

const MATERI_SECTIONS = [
  {
    title: "1. Aritmetika Dasar",
    items: [
      { t: "Urutan operasi", f: "Kurung → Pangkat/Akar → × ÷ (kiri ke kanan) → + − (kiri ke kanan)" },
      { t: "Perkalian tanda", f: "(+)×(+)=+ · (−)×(−)=+ · (+)×(−)=− · (−)×(+)=−" },
      { t: "Desimal ↔ Pecahan", f: "0,25=1/4 · 0,5=1/2 · 0,75=3/4 · 0,125=1/8 · 0,2=1/5" },
      { t: "Rasio 2 bagian dari total", f: "Bagian A = (rasio A / total rasio) × total nilai" },
      { t: "Senilai (proporsi)", f: "a/b = c/d  →  a×d = b×c" },
      { t: "Berbalik nilai", f: "n₁ × w₁ = n₂ × w₂  (mis. pekerja × hari = tetap)" },
      { t: "Skala", f: "Skala = jarak di peta / jarak sebenarnya, ditulis 1 : n" },
      { t: "FPB & KPK", f: "FPB = pangkat terkecil faktor sama · KPK = pangkat terbesar semua faktor" },
      { t: "Pangkat", f: "aᵐ×aⁿ=aᵐ⁺ⁿ · aᵐ÷aⁿ=aᵐ⁻ⁿ · (aᵐ)ⁿ=aᵐⁿ · a⁻ⁿ=1/aⁿ · a⁰=1" },
      { t: "Persentase perubahan", f: "% = (nilai baru − nilai awal) / nilai awal × 100%" },
    ],
  },
  {
    title: "2. Aljabar",
    items: [
      { t: "Persamaan linear", f: "ax+b=c → pindah ruas, tanda berubah" },
      { t: "SPLDV — Eliminasi/Substitusi", f: "Samakan koefisien salah satu variabel, lalu jumlah/kurangkan" },
      { t: "(a+b)²", f: "= a² + 2ab + b²" },
      { t: "(a−b)²", f: "= a² − 2ab + b²" },
      { t: "a² − b²", f: "= (a−b)(a+b)" },
      { t: "a³ + b³", f: "= (a+b)(a² − ab + b²)" },
      { t: "a³ − b³", f: "= (a−b)(a² + ab + b²)" },
    ],
  },
  {
    title: "3. Deret & Pola Bilangan",
    items: [
      { t: "Suku ke-n aritmetika", f: "Un = a + (n−1)b" },
      { t: "Jumlah n suku aritmetika", f: "Sn = n/2 × (2a + (n−1)b)  atau  n/2 × (a + Un)" },
      { t: "Suku ke-n geometri", f: "Un = a × rⁿ⁻¹" },
      { t: "Jumlah n suku geometri", f: "Sn = a(rⁿ−1)/(r−1)  jika r>1 ; a(1−rⁿ)/(1−r) jika r<1" },
      { t: "7 pola deret yang sering keluar", f: "Selisih tetap · Rasio tetap · Selisih bertingkat · Kuadrat · Ganjil/genap · Operasi campuran (×k+m) · Selang-seling (2 pola)" },
    ],
  },
  {
    title: "4. Soal Cerita & Logika Numerik",
    items: [
      { t: "Kecepatan", f: "v = jarak / waktu" },
      { t: "Kecepatan relatif", f: "Berlawanan arah → dijumlah · Searah → dikurangi" },
      { t: "Kerja bersama", f: "Waktu total = 1 / (1/a + 1/b)" },
      { t: "Peluang", f: "P(A) = n(A) / n(S)" },
      { t: "Perbandingan bertingkat", f: "Samakan nilai variabel yang muncul di kedua rasio, lalu gabungkan" },
    ],
  },
  {
    title: "5. Statistika Dasar",
    items: [
      { t: "Mean", f: "Jumlah data / banyak data" },
      { t: "Median", f: "Data ganjil: posisi (n+1)/2 · Data genap: rata-rata dua nilai tengah" },
      { t: "Modus", f: "Nilai dengan frekuensi terbanyak" },
      { t: "Range", f: "Nilai maksimum − nilai minimum" },
      { t: "Tips cepat", f: "Jika semua data +k, maka mean juga +k" },
    ],
  },
  {
    title: "6. Kecukupan Data (Data Sufficiency)",
    items: [
      { t: "Prinsip inti", f: "Fokus pada CUKUP/TIDAK, bukan menghitung nilai akhirnya" },
      { t: "Jika 1 pernyataan menghasilkan >1 kemungkinan jawaban", f: "→ tidak cukup" },
      { t: "Jika 1 pernyataan menghasilkan tepat 1 jawaban pasti", f: "→ cukup" },
      { t: "5 pola pilihan jawaban baku", f: "(1) saja cukup · (2) saja cukup · gabungan cukup · masing-masing cukup sendiri · gabungan pun tidak cukup" },
      { t: "Langkah sistematis", f: "Analisis pertanyaan → uji (1) sendiri → uji (2) sendiri → uji gabungan" },
    ],
  },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function TBSBankSoal() {
  const [screen, setScreen] = useState("home"); // home | quiz | result
  const [selectedCat, setSelectedCat] = useState("all");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);

  const startQuiz = useCallback((catKey) => {
    let pool;
    let minutes;
    if (catKey === "all") {
      // Simulasi Gabungan: tarik proporsional sesuai struktur resmi TBS
      // (23 Verbal : 25 Kuantitatif : 12 Pemecahan Masalah = 60 soal),
      // bukan mengacak seluruh 250 soal bank tanpa proporsi.
      const verbalPool = shuffle(QUESTION_BANK.filter((q) => q.cat === "verbal")).slice(
        0,
        CATEGORIES.verbal.officialCount
      );
      const kuantitatifPool = shuffle(
        QUESTION_BANK.filter((q) => q.cat === "kuantitatif")
      ).slice(0, CATEGORIES.kuantitatif.officialCount);
      const masalahPool = shuffle(QUESTION_BANK.filter((q) => q.cat === "masalah")).slice(
        0,
        CATEGORIES.masalah.officialCount
      );
      pool = shuffle([...verbalPool, ...kuantitatifPool, ...masalahPool]);
      minutes = 90;
    } else {
      pool = shuffle(QUESTION_BANK.filter((q) => q.cat === catKey));
      minutes = CATEGORIES[catKey].officialMinutes;
    }
    setQuestions(pool);
    setSelectedCat(catKey);
    setCurrent(0);
    setAnswers({});
    setFlagged({});
    // Timer memakai alokasi waktu RESMI (bukan heuristik generik):
    // Simulasi Gabungan (60 soal) = 90 menit; per kategori = officialMinutes masing-masing.
    // Jika bank tersedia < jumlah resmi (soal habis), timer proporsional terhadap jumlah yang ada.
    const officialTotalMinutes = catKey === "all" ? 90 : CATEGORIES[catKey].officialMinutes;
    const officialTotalCount = catKey === "all" ? 60 : CATEGORIES[catKey].officialCount;
    const secondsPerQuestion = (officialTotalMinutes * 60) / officialTotalCount;
    const practiceSeconds = Math.round(pool.length * secondsPerQuestion);
    setSecondsLeft(practiceSeconds);
    setTimerActive(true);
    setScreen("quiz");
  }, []);

  useEffect(() => {
    if (!timerActive) return;
    if (secondsLeft <= 0) {
      setTimerActive(false);
      setScreen("result");
      return;
    }
    timerRef.current = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [secondsLeft, timerActive]);

  const selectAnswer = (qId, optIdx) => {
    setAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const toggleFlag = (qId) => {
    setFlagged((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const finishQuiz = () => {
    setTimerActive(false);
    setScreen("result");
  };

  const q = questions[current];

  // ---- scoring ----
  const correctCount = questions.reduce(
    (acc, qq) => acc + (answers[qq.id] === qq.answer ? 1 : 0),
    0
  );
  const answeredCount = Object.keys(answers).length;
  const totalQ = questions.length;
  const percentScore = totalQ ? Math.round((correctCount / totalQ) * 100) : 0;
  const practicePoints = correctCount * 5;

  const perCategory = CATEGORY_ORDER.map((ck) => {
    const catQs = questions.filter((qq) => qq.cat === ck);
    const catCorrect = catQs.reduce(
      (acc, qq) => acc + (answers[qq.id] === qq.answer ? 1 : 0),
      0
    );
    return { key: ck, total: catQs.length, correct: catCorrect };
  }).filter((c) => c.total > 0);

  return (
    <div style={styles.page}>
      <style>{fontImports}</style>
      {screen === "home" && (
        <HomeScreen onStart={startQuiz} onOpenMateri={() => setScreen("materi")} />
      )}
      {screen === "materi" && <MateriScreen onBack={() => setScreen("home")} />}
      {screen === "quiz" && q && (
        <QuizScreen
          q={q}
          index={current}
          total={questions.length}
          answers={answers}
          flagged={flagged}
          secondsLeft={secondsLeft}
          onSelect={selectAnswer}
          onToggleFlag={toggleFlag}
          onNav={(i) => setCurrent(i)}
          onNext={() => setCurrent((c) => Math.min(c + 1, questions.length - 1))}
          onPrev={() => setCurrent((c) => Math.max(c - 1, 0))}
          onFinish={finishQuiz}
          allQuestions={questions}
        />
      )}
      {screen === "result" && (
        <ResultScreen
          questions={questions}
          answers={answers}
          correctCount={correctCount}
          answeredCount={answeredCount}
          totalQ={totalQ}
          percentScore={percentScore}
          practicePoints={practicePoints}
          perCategory={perCategory}
          onRestart={() => setScreen("home")}
        />
      )}
    </div>
  );
}

/* ============================== MATERI ============================== */

function MateriScreen({ onBack }) {
  return (
    <div style={styles.materiWrap}>
      <button style={styles.backLink} onClick={onBack}>
        ← Kembali ke Menu
      </button>
      <div style={styles.materiHeader}>
        <div style={styles.kicker}>REFERENSI CEPAT</div>
        <h1 style={{ ...styles.title, fontSize: "clamp(24px, 4vw, 32px)" }}>
          Materi Ringkas Subtes Kuantitatif
        </h1>
        <p style={styles.subtitle}>
          Rumus dan konsep inti — baca sebelum latihan, atau gunakan sebagai lembar
          contekan cepat sebelum simulasi.
        </p>
      </div>
      <div style={styles.materiSections}>
        {MATERI_SECTIONS.map((sec) => (
          <div key={sec.title} style={styles.materiCard}>
            <div style={styles.materiCardTitle}>{sec.title}</div>
            <div style={styles.materiItemList}>
              {sec.items.map((it, i) => (
                <div key={i} style={styles.materiItem}>
                  <div style={styles.materiItemLabel}>{it.t}</div>
                  <div style={styles.materiItemFormula}>{it.f}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================== HOME ============================== */

function HomeScreen({ onStart, onOpenMateri }) {
  return (
    <div style={styles.homeWrap}>
      <div style={styles.homeHeader}>
        <div style={styles.kicker}>SIMULASI TES BAKAT SKOLASTIK</div>
        <h1 style={styles.title}>Bank Soal Tes Bakat Skolastik</h1>
        <p style={styles.subtitle}>
          Latihan terstruktur mengikuti format resmi: Penalaran Verbal, Penalaran
          Kuantitatif, dan Pemecahan Masalah — lengkap dengan pembahasan setiap soal.
        </p>
        <button style={styles.materiLinkBtn} onClick={onOpenMateri}>
          📘 Buka Materi Ringkas (rumus & konsep inti)
        </button>
      </div>

      <div style={styles.cardGrid}>
        {CATEGORY_ORDER.map((ck) => {
          const c = CATEGORIES[ck];
          const available = QUESTION_BANK.filter((q) => q.cat === ck).length;
          return (
            <div key={ck} style={{ ...styles.card, borderTopColor: c.accent }}>
              <div style={{ ...styles.cardTag, background: c.accent }}>{c.label}</div>
              <div style={styles.cardMeta}>
                Format resmi: {c.officialCount} soal · {c.officialMinutes} menit
              </div>
              <div style={styles.cardAvailable}>{available} soal latihan tersedia</div>
              <button style={{ ...styles.startBtn, background: c.accent }} onClick={() => onStart(ck)}>
                Mulai Latihan →
              </button>
            </div>
          );
        })}
      </div>

      <div style={styles.fullCard}>
        <div>
          <div style={styles.fullCardTitle}>Simulasi Gabungan (Format Resmi)</div>
          <div style={styles.fullCardDesc}>
            60 soal dengan proporsi persis seperti tes asli — 23 Penalaran Verbal, 25
            Penalaran Kuantitatif, 12 Pemecahan Masalah — diacak dari {QUESTION_BANK.length}{" "}
            soal bank, mendekati pengalaman tes sesungguhnya.
          </div>
        </div>
        <button style={styles.startBtnDark} onClick={() => onStart("all")}>
          Mulai Simulasi Penuh →
        </button>
      </div>

      <div style={styles.footNote}>
        Skema skor mengikuti ketentuan resmi: 1 jawaban benar = 5 poin, salah/kosong = 0
        poin. Soal pada bank ini disusun ulang secara orisinal mengikuti format dan
        tingkat kesulitan TBS resmi — bukan salinan dari bank soal pihak lain.
      </div>
    </div>
  );
}

/* ============================== QUIZ ============================== */

function QuizScreen({
  q,
  index,
  total,
  answers,
  flagged,
  secondsLeft,
  onSelect,
  onToggleFlag,
  onNav,
  onNext,
  onPrev,
  onFinish,
  allQuestions,
}) {
  const c = CATEGORIES[q.cat];
  const answered = answers[q.id] !== undefined;
  const timeWarning = secondsLeft < 60;
  const [showPanel, setShowPanel] = useState(true);

  return (
    <div style={styles.quizWrap}>
      <div style={styles.quizTopBar}>
        <div style={{ ...styles.quizCatPill, background: c.accent }}>{c.label}</div>
        <div style={{ ...styles.timer, color: timeWarning ? "#b3261e" : "#2b2b2b" }}>
          ⏱ {formatTime(secondsLeft)}
        </div>
      </div>

      <div style={styles.progressBarTrack}>
        <div
          style={{
            ...styles.progressBarFill,
            width: `${((index + 1) / total) * 100}%`,
            background: c.accent,
          }}
        />
      </div>

      <div style={styles.quizBody}>
        <div style={styles.qMetaRow}>
          <span style={styles.qNumber}>
            Soal {index + 1} / {total}
          </span>
          <span style={styles.qType}>{q.type}</span>
          <button style={styles.flagBtn} onClick={() => onToggleFlag(q.id)}>
            {flagged[q.id] ? "★ Ditandai" : "☆ Tandai"}
          </button>
        </div>

        <div style={styles.qPrompt}>{q.prompt}</div>

        <div style={styles.optionsList}>
          {q.options.map((opt, i) => {
            const isSelected = answers[q.id] === i;
            return (
              <button
                key={i}
                onClick={() => onSelect(q.id, i)}
                style={{
                  ...styles.optionBtn,
                  borderColor: isSelected ? c.accent : "#ddd6c8",
                  background: isSelected ? `${c.accent}14` : "#fff",
                }}
              >
                <span
                  style={{
                    ...styles.optionLetter,
                    background: isSelected ? c.accent : "#f1ede2",
                    color: isSelected ? "#fff" : "#6b6353",
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span style={styles.optionText}>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={styles.numberPanelWrap}>
        <button style={styles.numberPanelToggle} onClick={() => setShowPanel((s) => !s)}>
          {showPanel ? "▾ Sembunyikan Panel Soal" : "▸ Tampilkan Panel Soal"}
        </button>
        {showPanel && (
          <div style={styles.numberPanelGrid}>
            {allQuestions.map((qq, i) => {
              const isCurrent = i === index;
              const isAnswered = answers[qq.id] !== undefined;
              const isFlagged = flagged[qq.id];
              return (
                <button
                  key={qq.id}
                  onClick={() => onNav(i)}
                  style={{
                    ...styles.numberPanelBtn,
                    background: isCurrent ? "#2b2b2b" : isAnswered ? `${c.accent}` : "#fff",
                    color: isCurrent || isAnswered ? "#fff" : "#5c5648",
                    borderColor: isCurrent ? "#2b2b2b" : isAnswered ? c.accent : "#ddd6c8",
                    boxShadow: isFlagged ? "0 0 0 2px #e8b34a inset" : "none",
                  }}
                  title={`Soal ${i + 1}${isFlagged ? " (ditandai)" : ""}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div style={styles.quizFooter}>
        <button style={styles.navBtn} onClick={onPrev} disabled={index === 0}>
          ← Sebelumnya
        </button>
        {index === total - 1 ? (
          <button style={styles.finishBtn} onClick={onFinish}>
            Selesai & Lihat Hasil
          </button>
        ) : (
          <button style={{ ...styles.navBtnPrimary, background: c.accent }} onClick={onNext}>
            Berikutnya →
          </button>
        )}
      </div>
      <button style={styles.earlyFinish} onClick={onFinish}>
        Akhiri lebih awal
      </button>
    </div>
  );
}

/* ============================== RESULT ============================== */

function ResultScreen({
  questions,
  answers,
  correctCount,
  answeredCount,
  totalQ,
  percentScore,
  practicePoints,
  perCategory,
  onRestart,
}) {
  const [showReview, setShowReview] = useState(false);

  return (
    <div style={styles.resultWrap}>
      <div style={styles.resultHeader}>
        <div style={styles.kicker}>HASIL SIMULASI</div>
        <div style={styles.scoreCircleWrap}>
          <div style={styles.scoreCircle}>
            <div style={styles.scoreBig}>{percentScore}%</div>
            <div style={styles.scoreSmall}>
              {correctCount} / {totalQ} benar
            </div>
          </div>
        </div>
        <div style={styles.pointsNote}>
          Skor latihan: <strong>{practicePoints}</strong> poin (5 poin/soal benar)
        </div>
        {answeredCount < totalQ && (
          <div style={styles.unansweredNote}>
            {totalQ - answeredCount} soal tidak dijawab (dihitung salah/0 poin).
          </div>
        )}
      </div>

      <div style={styles.catBreakdown}>
        {perCategory.map((c) => {
          const cat = CATEGORIES[c.key];
          const pct = c.total ? Math.round((c.correct / c.total) * 100) : 0;
          return (
            <div key={c.key} style={styles.catRow}>
              <div style={styles.catRowLabel}>{cat.label}</div>
              <div style={styles.catRowBarTrack}>
                <div
                  style={{
                    ...styles.catRowBarFill,
                    width: `${pct}%`,
                    background: cat.accent,
                  }}
                />
              </div>
              <div style={styles.catRowScore}>
                {c.correct}/{c.total}
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.resultActions}>
        <button style={styles.reviewToggle} onClick={() => setShowReview((s) => !s)}>
          {showReview ? "Sembunyikan Pembahasan" : "Lihat Pembahasan Lengkap"}
        </button>
        <button style={styles.restartBtn} onClick={onRestart}>
          ← Kembali ke Menu
        </button>
      </div>

      {showReview && (
        <div style={styles.reviewList}>
          {questions.map((q, i) => {
            const userAns = answers[q.id];
            const isCorrect = userAns === q.answer;
            const cat = CATEGORIES[q.cat];
            return (
              <div key={q.id} style={styles.reviewItem}>
                <div style={styles.reviewItemHeader}>
                  <span style={{ ...styles.reviewCatTag, background: cat.accent }}>
                    {cat.label}
                  </span>
                  <span
                    style={{
                      ...styles.reviewStatus,
                      color: isCorrect ? "#2f6b2f" : userAns === undefined ? "#8a6d3b" : "#b3261e",
                    }}
                  >
                    {isCorrect ? "✓ Benar" : userAns === undefined ? "○ Tidak dijawab" : "✗ Salah"}
                  </span>
                </div>
                <div style={styles.reviewPrompt}>
                  {i + 1}. {q.prompt}
                </div>
                <div style={styles.reviewOptions}>
                  {q.options.map((opt, oi) => {
                    let tag = "";
                    if (oi === q.answer) tag = "correct";
                    else if (oi === userAns) tag = "wrong";
                    return (
                      <div
                        key={oi}
                        style={{
                          ...styles.reviewOption,
                          background:
                            tag === "correct" ? "#eaf4ea" : tag === "wrong" ? "#faeaea" : "transparent",
                          fontWeight: oi === q.answer ? 600 : 400,
                        }}
                      >
                        {String.fromCharCode(65 + oi)}. {opt}
                        {tag === "correct" ? "  ✓" : tag === "wrong" ? "  ✗" : ""}
                      </div>
                    );
                  })}
                </div>
                <div style={styles.reviewExplanation}>
                  <strong>Pembahasan:</strong> {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================== STYLES ============================== */

const fontImports = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
`;

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f4ec",
    fontFamily: "'Inter', sans-serif",
    color: "#2b2b2b",
    padding: "24px 16px 60px",
    boxSizing: "border-box",
  },
  kicker: {
    fontSize: 11,
    letterSpacing: "0.14em",
    fontWeight: 700,
    color: "#8a6d3b",
    marginBottom: 8,
  },
  homeWrap: { maxWidth: 900, margin: "0 auto" },
  homeHeader: { textAlign: "center", marginBottom: 36, marginTop: 12 },
  title: {
    fontFamily: "'Source Serif 4', serif",
    fontSize: "clamp(28px, 5vw, 42px)",
    fontWeight: 700,
    margin: "4px 0 12px",
    color: "#1f1f1f",
  },
  subtitle: {
    fontSize: 15,
    color: "#5c5648",
    maxWidth: 560,
    margin: "0 auto",
    lineHeight: 1.6,
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
    marginBottom: 20,
  },
  card: {
    background: "#fff",
    borderRadius: 10,
    borderTop: "4px solid",
    padding: "20px 18px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  cardTag: {
    display: "inline-block",
    color: "#fff",
    fontSize: 12,
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: 20,
    width: "fit-content",
  },
  cardMeta: { fontSize: 13, color: "#7a7364" },
  cardAvailable: { fontSize: 13, color: "#2b2b2b", fontWeight: 600, marginBottom: 6 },
  startBtn: {
    border: "none",
    color: "#fff",
    fontWeight: 600,
    fontSize: 13,
    padding: "10px 14px",
    borderRadius: 7,
    cursor: "pointer",
    marginTop: "auto",
  },
  fullCard: {
    background: "#1f1f1f",
    borderRadius: 10,
    padding: "22px 22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 28,
  },
  fullCardTitle: { color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 4 },
  fullCardDesc: { color: "#c9c2ae", fontSize: 13, maxWidth: 420 },
  startBtnDark: {
    background: "#e8b34a",
    border: "none",
    color: "#1f1f1f",
    fontWeight: 700,
    fontSize: 13,
    padding: "12px 18px",
    borderRadius: 7,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  footNote: {
    fontSize: 12,
    color: "#8a8474",
    textAlign: "center",
    lineHeight: 1.6,
    maxWidth: 640,
    margin: "0 auto",
  },

  materiLinkBtn: {
    display: "inline-block",
    marginTop: 16,
    border: "1px solid #ddd6c8",
    background: "#fff",
    color: "#2b2b2b",
    fontWeight: 600,
    fontSize: 13,
    padding: "9px 16px",
    borderRadius: 20,
    cursor: "pointer",
  },
  materiWrap: { maxWidth: 780, margin: "0 auto" },
  backLink: {
    background: "none",
    border: "none",
    color: "#7a7364",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: 16,
    padding: 0,
  },
  materiHeader: { textAlign: "center", marginBottom: 28 },
  materiSections: { display: "flex", flexDirection: "column", gap: 16, paddingBottom: 30 },
  materiCard: {
    background: "#fff",
    borderRadius: 10,
    padding: "18px 20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  materiCardTitle: {
    fontFamily: "'Source Serif 4', serif",
    fontSize: 17,
    fontWeight: 700,
    color: "#1f1f1f",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: "1px solid #f1ede2",
  },
  materiItemList: { display: "flex", flexDirection: "column", gap: 8 },
  materiItem: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    padding: "6px 0",
  },
  materiItemLabel: { fontSize: 13, fontWeight: 600, color: "#3d3a30" },
  materiItemFormula: {
    fontSize: 13,
    color: "#5c5648",
    fontFamily: "'Source Serif 4', serif",
    lineHeight: 1.5,
  },

  quizWrap: { maxWidth: 720, margin: "0 auto" },
  quizTopBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  quizCatPill: {
    color: "#fff",
    fontSize: 12,
    fontWeight: 600,
    padding: "5px 12px",
    borderRadius: 20,
  },
  timer: { fontSize: 15, fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  progressBarTrack: {
    height: 4,
    background: "#e8e3d5",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 24,
  },
  progressBarFill: { height: "100%", transition: "width 0.3s" },
  quizBody: {
    background: "#fff",
    borderRadius: 12,
    padding: "24px 22px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  qMetaRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    flexWrap: "wrap",
    gap: 8,
  },
  qNumber: { fontSize: 13, fontWeight: 700, color: "#2b2b2b" },
  qType: {
    fontSize: 11,
    fontWeight: 600,
    color: "#7a7364",
    background: "#f1ede2",
    padding: "3px 9px",
    borderRadius: 20,
  },
  flagBtn: {
    marginLeft: "auto",
    border: "1px solid #ddd6c8",
    background: "#fff",
    borderRadius: 7,
    fontSize: 12,
    padding: "5px 10px",
    cursor: "pointer",
    color: "#5c5648",
  },
  qPrompt: {
    fontFamily: "'Source Serif 4', serif",
    fontSize: 17,
    lineHeight: 1.55,
    color: "#1f1f1f",
    marginBottom: 20,
  },
  optionsList: { display: "flex", flexDirection: "column", gap: 10 },
  optionBtn: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    textAlign: "left",
    border: "1.5px solid",
    borderRadius: 9,
    padding: "12px 14px",
    cursor: "pointer",
    fontSize: 14.5,
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.5,
  },
  optionLetter: {
    flexShrink: 0,
    width: 24,
    height: 24,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
  },
  optionText: { paddingTop: 2 },
  numberPanelWrap: { margin: "18px 0" },
  numberPanelToggle: {
    display: "block",
    margin: "0 auto 10px",
    background: "none",
    border: "1px solid #ddd6c8",
    borderRadius: 7,
    color: "#5c5648",
    fontSize: 12,
    fontWeight: 600,
    padding: "6px 14px",
    cursor: "pointer",
  },
  numberPanelGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(38px, 1fr))",
    gap: 6,
    background: "#fff",
    borderRadius: 10,
    padding: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  numberPanelBtn: {
    border: "1.5px solid",
    borderRadius: 6,
    padding: "8px 0",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
    fontVariantNumeric: "tabular-nums",
  },
  quizFooter: { display: "flex", justifyContent: "space-between", gap: 10 },
  navBtn: {
    border: "1px solid #ddd6c8",
    background: "#fff",
    color: "#2b2b2b",
    fontWeight: 600,
    fontSize: 13,
    padding: "10px 18px",
    borderRadius: 7,
    cursor: "pointer",
  },
  navBtnPrimary: {
    border: "none",
    color: "#fff",
    fontWeight: 600,
    fontSize: 13,
    padding: "10px 20px",
    borderRadius: 7,
    cursor: "pointer",
  },
  finishBtn: {
    border: "none",
    background: "#1f1f1f",
    color: "#fff",
    fontWeight: 700,
    fontSize: 13,
    padding: "10px 20px",
    borderRadius: 7,
    cursor: "pointer",
  },
  earlyFinish: {
    display: "block",
    margin: "16px auto 0",
    background: "none",
    border: "none",
    color: "#a09a89",
    fontSize: 12,
    textDecoration: "underline",
    cursor: "pointer",
  },

  resultWrap: { maxWidth: 720, margin: "0 auto" },
  resultHeader: { textAlign: "center", marginBottom: 28, marginTop: 12 },
  scoreCircleWrap: { display: "flex", justifyContent: "center", margin: "14px 0" },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: "50%",
    background: "#fff",
    border: "6px solid #e8b34a",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  scoreBig: {
    fontFamily: "'Source Serif 4', serif",
    fontSize: 36,
    fontWeight: 700,
    color: "#1f1f1f",
    lineHeight: 1,
  },
  scoreSmall: { fontSize: 12, color: "#7a7364", marginTop: 6 },
  pointsNote: { fontSize: 14, color: "#3d3a30", marginTop: 4 },
  unansweredNote: { fontSize: 12.5, color: "#b3261e", marginTop: 6 },

  catBreakdown: {
    background: "#fff",
    borderRadius: 10,
    padding: "18px 20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  catRow: { display: "flex", alignItems: "center", gap: 12 },
  catRowLabel: { fontSize: 13, fontWeight: 600, width: 160, flexShrink: 0 },
  catRowBarTrack: {
    flex: 1,
    height: 8,
    background: "#f1ede2",
    borderRadius: 4,
    overflow: "hidden",
  },
  catRowBarFill: { height: "100%", borderRadius: 4 },
  catRowScore: { fontSize: 13, fontWeight: 700, width: 44, textAlign: "right" },

  resultActions: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  reviewToggle: {
    border: "none",
    background: "#1f1f1f",
    color: "#fff",
    fontWeight: 600,
    fontSize: 13,
    padding: "11px 20px",
    borderRadius: 7,
    cursor: "pointer",
  },
  restartBtn: {
    border: "1px solid #ddd6c8",
    background: "#fff",
    color: "#2b2b2b",
    fontWeight: 600,
    fontSize: 13,
    padding: "11px 20px",
    borderRadius: 7,
    cursor: "pointer",
  },
  reviewList: { display: "flex", flexDirection: "column", gap: 14, paddingBottom: 20 },
  reviewItem: {
    background: "#fff",
    borderRadius: 10,
    padding: "16px 18px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  reviewItemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  reviewCatTag: {
    color: "#fff",
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 9px",
    borderRadius: 20,
  },
  reviewStatus: { fontSize: 12.5, fontWeight: 700 },
  reviewPrompt: {
    fontFamily: "'Source Serif 4', serif",
    fontSize: 15,
    lineHeight: 1.55,
    marginBottom: 10,
    color: "#1f1f1f",
  },
  reviewOptions: { display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 },
  reviewOption: { fontSize: 13.5, padding: "4px 8px", borderRadius: 5 },
  reviewExplanation: {
    fontSize: 13.5,
    lineHeight: 1.6,
    color: "#4a4636",
    background: "#f7f4ec",
    padding: "10px 12px",
    borderRadius: 7,
  },
};
