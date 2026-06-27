import { useState } from "react";
import { Search, MapPin, Home, Building2, TreePine } from "lucide-react";

const heroImage =
  "https://images.unsplash.com/photo-1651376589881-0e5a7eb15ae4?w=1600&h=900&fit=crop&auto=format";

const categories = [
  { label: "ជួល", labelEn: "Rent", icon: Home },
  { label: "លក់", labelEn: "Buy", icon: Building2 },
  { label: "ដីឡូ", labelEn: "Land", icon: TreePine },
];

const locations = [
  "ភ្នំពេញ",
  "សៀមរាប",
  "ព្រះសីហនុ",
  "កំពត",
  "បាត់ដំបង",
  "ក្រចេះ",
];

const priceRanges = [
  "គ្រប់តម្លៃ",
  "< $200/ខែ",
  "$200 - $500/ខែ",
  "$500 - $1000/ខែ",
  "> $1000/ខែ",
];

export function HeroSection() {
  const [activeCategory, setActiveCategory] = useState("Rent");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("គ្រប់តម្លៃ");
  const [keyword, setKeyword] = useState("");

  return (
    <section className="relative min-h-[580px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury home in Cambodia"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-24 text-center">
        {/* Headline */}
        <p
          className="text-orange-300 text-sm tracking-widest uppercase mb-3"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          ប្រព័ន្ធគ្រប់គ្រងអចលនទ្រព្យលេខ១ នៅកម្ពុជា
        </p>
        <h1
          className="text-white mb-4"
          style={{
            fontFamily: "Noto Serif Khmer, serif",
            fontWeight: 700,
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            lineHeight: 1.3,
          }}
        >
          រកអចលនទ្រព្យដ៏ល្អបំផុត
          <br />
          <span className="text-[#f0a060]">សម្រាប់ជីវិតរបស់អ្នក</span>
        </h1>
        <p
          className="text-white/80 mb-8 max-w-xl mx-auto"
          style={{ fontFamily: "Noto Serif Khmer, serif", fontSize: "0.95rem" }}
        >
          ប្រព័ន្ធគ្រប់គ្រងផ្ទះជួលគ្រប់មុខងារ សម្រាប់ម្ចាស់ផ្ទះសម័យថ្មី
        </p>

        {/* Search card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-3xl mx-auto">
          {/* Category tabs */}
          <div className="flex border-b border-gray-100">
            {categories.map((cat) => (
              <button
                key={cat.labelEn}
                onClick={() => setActiveCategory(cat.labelEn)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm transition-all ${
                  activeCategory === cat.labelEn
                    ? "bg-[#c8622a] text-white"
                    : "text-gray-600 hover:bg-orange-50"
                }`}
                style={{ fontFamily: "Noto Serif Khmer, serif" }}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search inputs */}
          <div className="p-4 flex flex-col sm:flex-row gap-3">
            {/* Keyword */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="ស្វែងរក..."
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-50"
                style={{ fontFamily: "Noto Serif Khmer, serif" }}
              />
            </div>

            {/* Location */}
            <div className="relative sm:w-44">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-50 appearance-none"
                style={{ fontFamily: "Noto Serif Khmer, serif" }}
              >
                <option value="">ទីតាំង</option>
                {locations.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="relative sm:w-44">
              <select
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-50 appearance-none"
                style={{ fontFamily: "Noto Serif Khmer, serif" }}
              >
                {priceRanges.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="bg-[#c8622a] text-white px-6 py-2.5 rounded-lg text-sm hover:bg-[#b05520] transition-colors flex items-center gap-2 whitespace-nowrap"
              style={{ fontFamily: "Noto Serif Khmer, serif" }}
            >
              <Search className="w-4 h-4" />
              ស្វែងរក
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 flex justify-center gap-8 text-white">
          {[
            { n: "5,000+", label: "អចលនទ្រព្យ" },
            { n: "1,200+", label: "ម្ចាស់ផ្ទះ" },
            { n: "8,500+", label: "អតិថិជន" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="text-2xl text-orange-300"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
              >
                {s.n}
              </div>
              <div
                className="text-xs text-white/70 mt-0.5"
                style={{ fontFamily: "Noto Serif Khmer, serif" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
