import { Home, Facebook, Youtube, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#c8622a] rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span
              className="text-lg text-white"
              style={{ fontFamily: "Noto Serif Khmer, serif", fontWeight: 700 }}
            >
              eHomeKH
            </span>
          </div>
          <p
            className="text-white/60 text-sm leading-relaxed mb-5"
            style={{ fontFamily: "Noto Serif Khmer, serif" }}
          >
            ប្រព័ន្ធគ្រប់គ្រងផ្ទះជួលគ្រប់មុខងារ សម្រាប់ម្ចាស់ផ្ទះសម័យថ្មី
          </p>
          <div className="flex gap-3">
            {[Facebook, Youtube, Send].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#c8622a] transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h4
            className="text-white mb-4 text-sm"
            style={{ fontFamily: "Noto Serif Khmer, serif", fontWeight: 600 }}
          >
            អចលនទ្រព្យ
          </h4>
          {["ផ្ទះជួល", "អាផាតម៉ង់", "វីឡា", "ដីឡូ", "ការិយាល័យ"].map((l) => (
            <a
              key={l}
              href="#"
              className="block text-white/60 hover:text-white text-sm mb-2 transition-colors"
              style={{ fontFamily: "Noto Serif Khmer, serif" }}
            >
              {l}
            </a>
          ))}
        </div>

        <div>
          <h4
            className="text-white mb-4 text-sm"
            style={{ fontFamily: "Noto Serif Khmer, serif", fontWeight: 600 }}
          >
            ក្រុមហ៊ុន
          </h4>
          {["អំពីយើង", "ព័ត៌មានវិស័យ", "ភ្នាក់ងារ", "ទំនាក់ទំនង", "ឯកជនភាព"].map((l) => (
            <a
              key={l}
              href="#"
              className="block text-white/60 hover:text-white text-sm mb-2 transition-colors"
              style={{ fontFamily: "Noto Serif Khmer, serif" }}
            >
              {l}
            </a>
          ))}
        </div>

        {/* Newsletter */}
        <div>
          <h4
            className="text-white mb-4 text-sm"
            style={{ fontFamily: "Noto Serif Khmer, serif", fontWeight: 600 }}
          >
            ទទួលព័ត៌មានថ្មី
          </h4>
          <p
            className="text-white/60 text-sm mb-3"
            style={{ fontFamily: "Noto Serif Khmer, serif" }}
          >
            ចូលរួមដើម្បីទទួលព័ត៌មានអចលនទ្រព្យចុងក្រោយ
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="អ៊ីម៉ែលរបស់អ្នក"
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#c8622a]"
              style={{ fontFamily: "Noto Serif Khmer, serif" }}
            />
            <button className="bg-[#c8622a] px-3 py-2 rounded-lg hover:bg-[#b05520] transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-5 text-white/40 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
            📞 +855 12 345 678<br />
            ✉ info@ehomekh.com<br />
            📍 ភ្នំពេញ, កម្ពុជា
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-white/40 text-xs">
          <span style={{ fontFamily: "Noto Serif Khmer, serif" }}>
            © 2024 eHomeKH. រក្សាសិទ្ធគ្រប់យ៉ាង
          </span>
          <span style={{ fontFamily: "Inter, sans-serif" }}>
            Made with ❤ in Cambodia
          </span>
        </div>
      </div>
    </footer>
  );
}
