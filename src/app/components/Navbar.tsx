import { useState } from "react";
import { Search, Phone, Menu, X, ChevronDown, Bell, User } from "lucide-react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const navLinks = [
    { label: "ទំព័រដើម", en: "Home", href: "#" },
    {
      label: "លក់",
      en: "Buy",
      href: "#",
      children: ["ផ្ទះ", "ដីឡូ", "ខុនដូ", "វីឡា", "ការិយាល័យ"],
    },
    {
      label: "ជួល",
      en: "Rent",
      href: "#",
      children: ["ផ្ទះជួល", "ខុនដូជួល", "ការិយាល័យជួល", "ឃ្លាំងជួល"],
    },
    { label: "គម្រោង", en: "Projects", href: "#" },
    { label: "ភ្នាក់ងារ", en: "Agents", href: "#" },
    { label: "ព័ត៌មាន", en: "News", href: "#" },
  ];

  return (
    <header className="w-full">
      {/* Top bar */}
      <div style={{ backgroundColor: "#1a1a2e" }} className="text-white py-2 px-4 text-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Phone size={13} />
              <span>+855 23 123 456</span>
            </span>
            <span className="hidden sm:inline text-white/60">|</span>
            <span className="hidden sm:inline text-white/80">info@ehomekh.com</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-white/80 hover:text-white transition-colors">ខ្មែរ</button>
            <span className="text-white/40">|</span>
            <button className="text-white/80 hover:text-white transition-colors">EN</button>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 shrink-0">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: "#e8400c" }}
            >
              eH
            </div>
            <div className="leading-none">
              <div className="font-bold text-lg" style={{ color: "#e8400c" }}>
                E-Home
              </div>
              <div className="text-[10px] text-gray-400 tracking-widest uppercase">Cambodia</div>
            </div>
          </a>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.en}
                className="relative group"
                onMouseEnter={() => setActiveMenu(link.en)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <a
                  href={link.href}
                  className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-[#e8400c] transition-colors"
                >
                  {link.label}
                  {link.children && <ChevronDown size={13} className="opacity-60" />}
                </a>
                {link.children && activeMenu === link.en && (
                  <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                    {link.children.map((child) => (
                      <a
                        key={child}
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#e8400c] transition-colors"
                      >
                        {child}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="text-gray-500 hover:text-[#e8400c] p-2 transition-colors">
              <Bell size={18} />
            </button>
            <button className="text-gray-500 hover:text-[#e8400c] p-2 transition-colors">
              <User size={18} />
            </button>
            <button
              className="flex items-center gap-1.5 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: "#e8400c" }}
            >
              បង្ហោះអចលនទ្រព្យ
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white pb-4">
            {navLinks.map((link) => (
              <a
                key={link.en}
                href={link.href}
                className="block px-6 py-3 text-sm text-gray-700 hover:text-[#e8400c] hover:bg-orange-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="px-6 pt-3">
              <button
                className="w-full text-white py-2.5 rounded-lg text-sm font-medium"
                style={{ backgroundColor: "#e8400c" }}
              >
                បង្ហោះអចលនទ្រព្យ
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
