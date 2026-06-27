const categories = [
  {
    label: "ផ្ទះជួល",
    count: "1,240",
    image: "https://images.unsplash.com/photo-1624204386084-dd8c05e32226?w=400&h=280&fit=crop&auto=format",
  },
  {
    label: "អាផាតម៉ង់",
    count: "860",
    image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=400&h=280&fit=crop&auto=format",
  },
  {
    label: "វីឡា",
    count: "320",
    image: "https://images.unsplash.com/photo-1651376589881-0e5a7eb15ae4?w=400&h=280&fit=crop&auto=format",
  },
  {
    label: "ដីឡូ",
    count: "540",
    image: "https://images.unsplash.com/photo-1637506716119-f52f0eb9b7e6?w=400&h=280&fit=crop&auto=format",
  },
  {
    label: "ការិយាល័យ",
    count: "180",
    image: "https://images.unsplash.com/photo-1516501312919-d0cb0b7b60b8?w=400&h=280&fit=crop&auto=format",
  },
  {
    label: "ឃ្លាំង",
    count: "95",
    image: "https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?w=400&h=280&fit=crop&auto=format",
  },
];

export function CategorySection() {
  return (
    <section className="py-16 bg-[#f0ede8]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <p
            className="text-[#c8622a] text-xs tracking-widest uppercase mb-2"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            ប្រភេទអចលនទ្រព្យ
          </p>
          <h2
            className="text-gray-900"
            style={{
              fontFamily: "Noto Serif Khmer, serif",
              fontWeight: 700,
              fontSize: "1.6rem",
            }}
          >
            ស្វែងរកតាមប្រភេទ
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <a
              key={cat.label}
              href="#"
              className="group relative rounded-xl overflow-hidden aspect-[4/3] block"
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <div
                  className="font-semibold text-sm"
                  style={{ fontFamily: "Noto Serif Khmer, serif" }}
                >
                  {cat.label}
                </div>
                <div
                  className="text-xs text-white/70"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {cat.count} កន្លែង
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
