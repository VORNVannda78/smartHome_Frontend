import { Star } from "lucide-react";

const testimonials = [
  {
    name: "សុខ ស្រីនាថ",
    role: "អ្នកជួលផ្ទះ",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
    text: "eHomeKH ជួយខ្ញុំរកផ្ទះជួលបានយ៉ាងងាយស្រួល ដោយមិនចំណាយពេលច្រើន។ ការបម្រើការរបស់ពួកគេល្អណាស់!",
    stars: 5,
  },
  {
    name: "ហេង ច័ន្ទដារ៉ា",
    role: "ម្ចាស់ផ្ទះ",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format",
    text: "ខ្ញុំបានបង្ហោះផ្ទះនៅ eHomeKH រួចឃើញមានអ្នកសាកសួរចូលមកច្រើន ការគ្រប់គ្រងប្រព័ន្ធ​ ងាយស្រួលខ្លាំង",
    stars: 5,
  },
  {
    name: "ណាំ ដាវុត",
    role: "អ្នកទិញ​ ផ្ទះ",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format",
    text: "ព័ត៌មានអចលនទ្រព្យទំនើប ច្បាស់លាស់ និងទំនុកចិត្ត ខ្ញុំបានទិញផ្ទះបានដូចអ្វីដែលខ្ញុំចង់បាន",
    stars: 4,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <p
            className="text-[#c8622a] text-xs tracking-widest uppercase mb-2"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            ការវាយតម្លៃ
          </p>
          <h2
            className="text-gray-900"
            style={{
              fontFamily: "Noto Serif Khmer, serif",
              fontWeight: 700,
              fontSize: "1.6rem",
            }}
          >
            អ្នកប្រើប្រាស់ និយាយអំពីយើង
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-[#fdfcfb] border border-gray-100 rounded-xl p-6">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${j < t.stars ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                  />
                ))}
              </div>
              <p
                className="text-gray-600 mb-5 leading-relaxed"
                style={{ fontFamily: "Noto Serif Khmer, serif", fontSize: "0.875rem" }}
              >
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div
                    className="text-gray-900 text-sm"
                    style={{ fontFamily: "Noto Serif Khmer, serif", fontWeight: 600 }}
                  >
                    {t.name}
                  </div>
                  <div
                    className="text-gray-400 text-xs"
                    style={{ fontFamily: "Noto Serif Khmer, serif" }}
                  >
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
