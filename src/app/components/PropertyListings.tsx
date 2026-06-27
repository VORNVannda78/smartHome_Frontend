import { useState } from "react";
import { MapPin, Bed, Bath, Square, Heart, Eye, Phone } from "lucide-react";

const properties = [
  {
    id: 1,
    title: "ផ្ទះល្វែង ២ ជាន់ ក្នុងអូឡាំពិក",
    type: "ជួល",
    price: "$450",
    period: "/ខែ",
    location: "ស្ទឹងមានជ័យ, ភ្នំពេញ",
    beds: 3,
    baths: 2,
    area: 180,
    image: "https://images.unsplash.com/photo-1624204386084-dd8c05e32226?w=600&h=400&fit=crop&auto=format",
    featured: true,
    views: 342,
  },
  {
    id: 2,
    title: "អាផាតម៉ង់ទំនើប ជាន់ ១០ ក្នុងទួលគោក",
    type: "ជួល",
    price: "$700",
    period: "/ខែ",
    location: "ទួលគោក, ភ្នំពេញ",
    beds: 2,
    baths: 1,
    area: 95,
    image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=600&h=400&fit=crop&auto=format",
    featured: false,
    views: 218,
  },
  {
    id: 3,
    title: "វីឡាជួល មានបន្ទប់ ៤ ក្នុងបឹងកេងកង",
    type: "ជួល",
    price: "$1,200",
    period: "/ខែ",
    location: "បឹងកេងកង, ភ្នំពេញ",
    beds: 4,
    baths: 3,
    area: 320,
    image: "https://images.unsplash.com/photo-1651376589881-0e5a7eb15ae4?w=600&h=400&fit=crop&auto=format",
    featured: true,
    views: 489,
  },
  {
    id: 4,
    title: "ផ្ទះលក់ ក្នុងដំបូងពេជ្រ ស.ស.ស",
    type: "លក់",
    price: "$85,000",
    period: "",
    location: "ដំបូងពេជ្រ, ភ្នំពេញ",
    beds: 3,
    baths: 2,
    area: 200,
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&h=400&fit=crop&auto=format",
    featured: false,
    views: 156,
  },
  {
    id: 5,
    title: "ខុនដូ ១ បន្ទប់ ក្នុង BKK1",
    type: "ជួល",
    price: "$380",
    period: "/ខែ",
    location: "BKK1, ភ្នំពេញ",
    beds: 1,
    baths: 1,
    area: 55,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop&auto=format",
    featured: false,
    views: 274,
  },
  {
    id: 6,
    title: "ផ្ទះល្វែងជួល ប្រព្រឹត្តដោយខ្លួនឯង",
    type: "ជួល",
    price: "$280",
    period: "/ខែ",
    location: "ចំការមន, ភ្នំពេញ",
    beds: 2,
    baths: 1,
    area: 120,
    image: "https://images.unsplash.com/photo-1649083048770-82e8ffd80431?w=600&h=400&fit=crop&auto=format",
    featured: false,
    views: 193,
  },
];

const filters = ["ទាំងអស់", "ជួល", "លក់", "វីឡា", "ខុនដូ"];

export function PropertyListings() {
  const [activeFilter, setActiveFilter] = useState("ទាំងអស់");
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const filtered =
    activeFilter === "ទាំងអស់"
      ? properties
      : properties.filter((p) => p.type === activeFilter);

  return (
    <section className="py-16 bg-[#f8f7f4]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p
              className="text-[#c8622a] text-xs tracking-widest uppercase mb-1"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              អចលនទ្រព្យថ្មី
            </p>
            <h2
              className="text-gray-900"
              style={{
                fontFamily: "Noto Serif Khmer, serif",
                fontWeight: 700,
                fontSize: "1.6rem",
              }}
            >
              អចលនទ្រព្យដែលកំពុងពេញនិយម
            </h2>
          </div>
          <a
            href="#"
            className="text-[#c8622a] text-sm hover:underline shrink-0"
            style={{ fontFamily: "Noto Serif Khmer, serif" }}
          >
            មើលទាំងអស់ →
          </a>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
                activeFilter === f
                  ? "bg-[#c8622a] text-white border-[#c8622a]"
                  : "border-gray-300 text-gray-600 hover:border-[#c8622a] hover:text-[#c8622a]"
              }`}
              style={{ fontFamily: "Noto Serif Khmer, serif" }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden bg-gray-100">
                <img
                  src={prop.image}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-medium ${
                      prop.type === "លក់"
                        ? "bg-blue-600 text-white"
                        : "bg-[#c8622a] text-white"
                    }`}
                    style={{ fontFamily: "Noto Serif Khmer, serif" }}
                  >
                    {prop.type}
                  </span>
                  {prop.featured && (
                    <span
                      className="text-xs px-2 py-0.5 rounded bg-yellow-400 text-yellow-900 font-medium"
                      style={{ fontFamily: "Noto Serif Khmer, serif" }}
                    >
                      ពិសេស
                    </span>
                  )}
                </div>
                {/* Heart */}
                <button
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLiked((prev) => {
                      const next = new Set(prev);
                      next.has(prop.id) ? next.delete(prop.id) : next.add(prop.id);
                      return next;
                    });
                  }}
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      liked.has(prop.id) ? "fill-red-500 text-red-500" : "text-gray-500"
                    }`}
                  />
                </button>
                {/* Views */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                  <Eye className="w-3 h-3" />
                  {prop.views}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3
                    className="text-gray-900 leading-snug line-clamp-2 flex-1"
                    style={{
                      fontFamily: "Noto Serif Khmer, serif",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    {prop.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1 text-gray-500 mb-3">
                  <MapPin className="w-3 h-3 text-[#c8622a] shrink-0" />
                  <span
                    className="text-xs truncate"
                    style={{ fontFamily: "Noto Serif Khmer, serif" }}
                  >
                    {prop.location}
                  </span>
                </div>

                {/* Specs */}
                <div className="flex items-center gap-4 text-gray-500 text-xs mb-4 border-t border-gray-100 pt-3">
                  <span className="flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5" />
                    {prop.beds}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5" />
                    {prop.baths}
                  </span>
                  <span className="flex items-center gap-1">
                    <Square className="w-3.5 h-3.5" />
                    {prop.area}m²
                  </span>
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <span
                      className="text-[#c8622a]"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                      }}
                    >
                      {prop.price}
                    </span>
                    {prop.period && (
                      <span
                        className="text-gray-400 text-xs ml-0.5"
                        style={{ fontFamily: "Noto Serif Khmer, serif" }}
                      >
                        {prop.period}
                      </span>
                    )}
                  </div>
                  <button className="flex items-center gap-1 bg-orange-50 text-[#c8622a] px-3 py-1.5 rounded-lg text-xs hover:bg-orange-100 transition-colors">
                    <Phone className="w-3 h-3" />
                    <span style={{ fontFamily: "Noto Serif Khmer, serif" }}>ទំនាក់ទំនង</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
