import { Shield, Search, Clock, Star, BarChart2, HeartHandshake } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "ស្វែងរកងាយស្រួល",
    desc: "ស្វែងរកអចលនទ្រព្យបានលឿន និងងាយស្រួលតាមច្បាប់ Filter ជាច្រើន",
  },
  {
    icon: Shield,
    title: "មានសុវត្ថិភាព",
    desc: "អចលនទ្រព្យទាំងអស់ត្រូវបានផ្ទៀងផ្ទាត់ ដើម្បីធានាសុវត្ថិភាពដល់អ្នកប្រើប្រាស់",
  },
  {
    icon: Clock,
    title: "ទំនាក់ទំនងបានគ្រប់ពេល",
    desc: "ក្រុមការងាររបស់យើងខ្ញុំបម្រើអ្នក ២៤/៧ ដើម្បីដោះស្រាយបញ្ហាដល់អ្នក",
  },
  {
    icon: BarChart2,
    title: "ព័ត៌មានទីផ្សារ",
    desc: "ទទួលបានព័ត៌មានថ្លៃទីផ្សារ និងទ្រន្ទ្រៃអចលនទ្រព្យចុងក្រោយបំផុត",
  },
  {
    icon: Star,
    title: "ការវាយតម្លៃពី​ អ្នកប្រើ",
    desc: "អានការវាយតម្លៃពិតប្រាកដពីអ្នកជួល ដើម្បីជ្រើសរើសអចលនទ្រព្យដ៏ល្អ",
  },
  {
    icon: HeartHandshake,
    title: "ជំនួយការ​ ផ្ទះ",
    desc: "ភ្នាក់ងាររបស់យើងខ្ញុំធ្វើការ ១ ទល់ ១ ជាមួយអ្នក ដើម្បីរកផ្ទះដ៏ល្អ",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p
            className="text-[#c8622a] text-xs tracking-widest uppercase mb-2"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            ហេតុអ្វីបានជាជ្រើសយើង
          </p>
          <h2
            className="text-gray-900 mb-3"
            style={{
              fontFamily: "Noto Serif Khmer, serif",
              fontWeight: 700,
              fontSize: "1.6rem",
            }}
          >
            ការផ្ដល់ជូនពិសេស របស់ eHomeKH
          </h2>
          <p
            className="text-gray-500 max-w-xl mx-auto"
            style={{ fontFamily: "Noto Serif Khmer, serif", fontSize: "0.9rem" }}
          >
            យើងខ្ញុំផ្ដល់ការគ្រប់គ្រងអចលនទ្រព្យទំនើប ជំនួយជ្រើសរើស និងការផ្ដល់ព័ត៌មានទីផ្សារ
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="group p-6 rounded-xl border border-gray-100 hover:border-[#c8622a]/30 hover:shadow-md transition-all bg-[#fdfcfb]"
            >
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#c8622a] transition-colors">
                <f.icon className="w-5 h-5 text-[#c8622a] group-hover:text-white transition-colors" />
              </div>
              <h3
                className="text-gray-900 mb-2"
                style={{
                  fontFamily: "Noto Serif Khmer, serif",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                }}
              >
                {f.title}
              </h3>
              <p
                className="text-gray-500"
                style={{ fontFamily: "Noto Serif Khmer, serif", fontSize: "0.85rem", lineHeight: 1.8 }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
