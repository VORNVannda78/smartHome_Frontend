export function CTABanner() {
  return (
    <section
      className="py-16 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #c8622a 100%)" }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-8 left-8 w-64 h-64 rounded-full border-2 border-white" />
        <div className="absolute bottom-0 right-16 w-80 h-80 rounded-full border border-white" />
      </div>
      <div className="relative max-w-4xl mx-auto px-6 text-center text-white">
        <p
          className="text-orange-200 text-xs tracking-widest uppercase mb-3"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          ម្ចាស់ផ្ទះ
        </p>
        <h2
          className="mb-4"
          style={{
            fontFamily: "Noto Serif Khmer, serif",
            fontWeight: 700,
            fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
          }}
        >
          បង្ហោះអចលនទ្រព្យរបស់អ្នក
          <br />
          ឥឡូវនេះឥតគិតថ្លៃ!
        </h2>
        <p
          className="text-white/70 mb-8 max-w-lg mx-auto"
          style={{ fontFamily: "Noto Serif Khmer, serif", fontSize: "0.9rem" }}
        >
          ចូលរួមជាមួយម្ចាស់ផ្ទះជាង ១,២០០ នាក់ ដែលទទួលបានភ្ញៀវជួលបានលឿន
          តាមរយៈប្រព័ន្ធ eHomeKH
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#"
            className="bg-white text-[#c8622a] px-8 py-3 rounded-lg hover:bg-orange-50 transition-colors"
            style={{ fontFamily: "Noto Serif Khmer, serif", fontWeight: 600 }}
          >
            បង្ហោះឥឡូវ
          </a>
          <a
            href="#"
            className="border border-white/50 text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
            style={{ fontFamily: "Noto Serif Khmer, serif" }}
          >
            ស្វែងយល់បន្ថែម
          </a>
        </div>
      </div>
    </section>
  );
}
