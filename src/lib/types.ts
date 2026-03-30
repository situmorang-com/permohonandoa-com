export type PrayerCategory =
  | "kesehatan"
  | "keluarga"
  | "pekerjaan"
  | "keuangan"
  | "hubungan"
  | "pendidikan"
  | "pelayanan"
  | "ucapan-syukur"
  | "lainnya";

export const CATEGORIES: { value: PrayerCategory; label: string; emoji: string; color: string }[] = [
  { value: "kesehatan", label: "Kesehatan", emoji: "🏥", color: "bg-rose-100 text-rose-700" },
  { value: "keluarga", label: "Keluarga", emoji: "👨‍👩‍👧‍👦", color: "bg-blue-100 text-blue-700" },
  { value: "pekerjaan", label: "Pekerjaan", emoji: "💼", color: "bg-amber-100 text-amber-700" },
  { value: "keuangan", label: "Keuangan", emoji: "💰", color: "bg-emerald-100 text-emerald-700" },
  { value: "hubungan", label: "Hubungan", emoji: "❤️", color: "bg-pink-100 text-pink-700" },
  { value: "pendidikan", label: "Pendidikan", emoji: "📚", color: "bg-violet-100 text-violet-700" },
  { value: "pelayanan", label: "Pelayanan", emoji: "⛪", color: "bg-indigo-100 text-indigo-700" },
  { value: "ucapan-syukur", label: "Ucapan Syukur", emoji: "🙌", color: "bg-yellow-100 text-yellow-700" },
  { value: "lainnya", label: "Lainnya", emoji: "🙏", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
];

export const SCRIPTURE_SUGGESTIONS = [
  { verse: "Filipi 4:6", text: "Janganlah hendaknya kamu kuatir tentang apapun juga, tetapi nyatakanlah dalam segala hal keinginanmu kepada Allah dalam doa dan permohonan dengan ucapan syukur." },
  { verse: "Mazmur 34:18", text: "TUHAN itu dekat kepada orang-orang yang patah hati, dan Ia menyelamatkan orang-orang yang remuk jiwanya." },
  { verse: "Yesaya 41:10", text: "Janganlah takut, sebab Aku menyertai engkau, janganlah cemas, sebab Aku ini Allahmu." },
  { verse: "Matius 7:7", text: "Mintalah, maka akan diberikan kepadamu; carilah, maka kamu akan mendapat; ketoklah, maka pintu akan dibukakan bagimu." },
  { verse: "Yeremia 29:11", text: "Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu, demikianlah firman TUHAN, yaitu rancangan damai sejahtera dan bukan rancangan kecelakaan, untuk memberikan kepadamu hari depan yang penuh harapan." },
  { verse: "Roma 8:28", text: "Kita tahu sekarang, bahwa Allah turut bekerja dalam segala sesuatu untuk mendatangkan kebaikan bagi mereka yang mengasihi Dia." },
  { verse: "Mazmur 46:2", text: "Allah itu bagi kita tempat perlindungan dan kekuatan, sebagai penolong dalam kesesakan sangat terbukti." },
  { verse: "1 Petrus 5:7", text: "Serahkanlah segala kekuatiranmu kepada-Nya, sebab Ia yang memelihara kamu." },
];
