import { Building2, CheckCircle, FileText, Users, BarChart2, Shield, Zap, ArrowRight, Star } from "lucide-react";

interface LandingProps {
  onLogin: () => void;
  onRegister: () => void;
}

const features = [
  { icon: FileText, title: "ចេញវិក្កយបត្រស្វ័យប្រវត្តិ", titleEn: "Auto-generate Invoices", desc: "គណនាទឹក អគ្គីសនី និងសំរាម ដោយស្វ័យប្រវត្តិ ចេញ KHQR ភ្លាម" },
  { icon: Users, title: "គ្រប់គ្រងអ្នកជួល", titleEn: "Tenant Management", desc: "ទុកទិន្នន័យអ្នកជួល ប្រវត្តិការទូទាត់ និងព័ត៌មានលម្អិតគ្រប់យ៉ាង" },
  { icon: BarChart2, title: "របាយការណ៍ & ចំណូល", titleEn: "Revenue Reports", desc: "តាមដានចំណូល ចំណាយ និងប្រាក់ចំណេញសុទ្ធប្រចាំខែ" },
  { icon: Shield, title: "ទិន្នន័យមានសុវត្ថិភាព", titleEn: "Secure Multi-Tenancy", desc: "ម្ចាស់ផ្ទះម្នាក់ៗមើលបានតែទិន្នន័យខ្លួនឯង គ្មានការចូលជ្រៀតគ្នា" },
  { icon: Zap, title: "ប្រព័ន្ធលឿន & ងាយប្រើ", titleEn: "Fast & Easy to Use", desc: "ចូលប្រើបានពី Phone, Tablet ឬ Computer គ្រប់ទីកន្លែង" },
  { icon: Building2, title: "គ្រប់គ្រងអគារច្រើន", titleEn: "Multi-Building Support", desc: "អាចចុះឈ្មោះគ្រប់គ្រងអគារ ឬផ្ទះជួលច្រើនគ្រួសារ" },
];

const plans = [
  {
    name: "Free",
    nameKh: "ឥតគិតថ្លៃ",
    price: "$0",
    period: "/ខែ",
    rooms: "រហូតដល់ ៥ បន្ទប់",
    features: ["គ្រប់គ្រងអ្នកជួល", "ចេញវិក្កយបត្រ", "Dashboard", "KHQR QR Code"],
    cta: "ចាប់ផ្ដើមប្រើប្រាស់",
    highlight: false,
  },
  {
    name: "Pro",
    nameKh: "ប្រូ",
    price: "$5",
    period: "/ខែ",
    rooms: "រហូតដល់ ៥០ បន្ទប់",
    features: ["គ្រប់មុខងារ Free", "របាយការណ៍ PDF/Excel", "ត្រួតពិនិត្យកិច្ចសន្យា", "គ្រប់គ្រងចំណាយ", "Priority Support"],
    cta: "ចាប់ផ្ដើម ២ សប្ដាហ៍ ឥតគិតថ្លៃ",
    highlight: true,
  },
  {
    name: "Business",
    nameKh: "អាជីវកម្ម",
    price: "$15",
    period: "/ខែ",
    rooms: "បន្ទប់គ្មានដែនកំណត់",
    features: ["គ្រប់មុខងារ Pro", "Multi-building", "API Access", "Dedicated Support", "Custom Branding"],
    cta: "ទំនាក់ទំនង Sales",
    highlight: false,
  },
];

const testimonials = [
  { name: "ហ៊ុន សុភ័ក្ត្រ", role: "ម្ចាស់អគារ ១២ បន្ទប់ — ភ្នំពេញ", text: "ជំនួសការប្រើ Excel ហើយ! ចំណេញពេលច្រើន ហើយអ្នកជួលក៏ពេញចិត្តព្រោះទទួល Invoice ល្អស្អាត", stars: 5 },
  { name: "ស្រីណា ចន្ទ", role: "ម្ចាស់ផ្ទះជួល ៨ ខ្នង — សៀមរាប", text: "KHQR ក្នុង Invoice ធ្វើឲ្យការទូទាត់លឿនណាស់ ហើយប្រព័ន្ធ Alert ប្រាប់ពេលកុងត្រាផុតដ៏有用", stars: 5 },
];

export function Landing({ onLogin, onRegister }: LandingProps) {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Kantumruy Pro', sans-serif" }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#055b65] rounded-xl flex items-center justify-center shadow-sm">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">RoomRent<span className="text-[#055b65]">KH</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-[#055b65] transition-colors">មុខងារ</a>
            <a href="#pricing" className="hover:text-[#055b65] transition-colors">តម្លៃ</a>
            <a href="#testimonials" className="hover:text-[#055b65] transition-colors">មតិអ្នកប្រើ</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              className="text-sm text-gray-700 hover:text-[#055b65] font-medium transition-colors px-3 py-2"
            >
              ចូល
            </button>
            <button
              onClick={onRegister}
              className="bg-[#055b65] text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-[#044750] transition-colors shadow-sm"
            >
              ចាប់ផ្ដើម ឥតគិតថ្លៃ
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-[#e6f2f3] via-white to-[#d0ecef]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#cde8eb] text-[#044750] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5" />
            ប្រព័ន្ធគ្រប់គ្រងផ្ទះជួល #1 នៅកម្ពុជា
          </div>
          <h1
            className="text-gray-900 mb-6 leading-tight"
            style={{ fontFamily: "'Kantumruy Pro', sans-serif", fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            គ្រប់គ្រងផ្ទះជួល
            <br />
            <span className="text-[#055b65]">ឆ្លាត និង ងាយស្រួល</span>
          </h1>
          <p
            className="text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Kantumruy Pro', sans-serif", fontSize: "1rem" }}
          >
            ចេញវិក្កយបត្រ KHQR, គ្រប់គ្រងអ្នកជួល, តាមដានចំណូល-ចំណាយ — ទាំងអស់ ក្នុងកន្លែងតែមួយ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRegister}
              className="flex items-center justify-center gap-2 bg-[#055b65] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#044750] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base"
            >
              ចាប់ផ្ដើមប្រើប្រាស់ — ឥតគិតថ្លៃ
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onLogin}
              className="flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:border-[#7ec5ca] hover:text-[#044750] transition-all text-base"
            >
              មើល Demo
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            💳  មិនទាមទារ Credit Card · Free forever រហូតដល់ ៥ បន្ទប់
          </p>
        </div>

        {/* Stats row */}
        <div className="max-w-3xl mx-auto mt-16 grid grid-cols-3 gap-6">
          {[
            { n: "500+", label: "ម្ចាស់ផ្ទះ", sub: "Landlords" },
            { n: "8,000+", label: "បន្ទប់ t.ន", sub: "Rooms Managed" },
            { n: "$1.2M+", label: "ប្រមូលបាន", sub: "Revenue Tracked" },
          ].map((s) => (
            <div key={s.sub} className="text-center">
              <div className="font-bold text-[#055b65]" style={{ fontSize: "1.8rem" }}>{s.n}</div>
              <div className="text-sm text-gray-700 font-medium" style={{ fontFamily: "'Kantumruy Pro', sans-serif" }}>{s.label}</div>
              <div className="text-xs text-gray-400">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#055b65] text-xs font-bold tracking-widest uppercase mb-2">មុខងារ</p>
            <h2 className="text-gray-900 mb-3" style={{ fontFamily: "'Kantumruy Pro', sans-serif", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}>
              អ្វីដែល RoomRentKH ផ្ដល់ជូន
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto text-sm" style={{ fontFamily: "'Kantumruy Pro', sans-serif" }}>
              គ្រប់មុខងារដែលម្ចាស់ផ្ទះចំនួញ ត្រូវការក្នុងការគ្រប់គ្រងការជួរ
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i} className="group p-6 rounded-2xl border border-gray-100 hover:border-[#9dd0d5] hover:shadow-lg transition-all bg-white">
                <div className="w-11 h-11 bg-[#e6f2f3] group-hover:bg-[#055b65] rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <f.icon className="w-5 h-5 text-[#055b65] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm" style={{ fontFamily: "'Kantumruy Pro', sans-serif" }}>{f.title}</h3>
                <p className="text-[11px] text-[#055b65] font-medium mb-2">{f.titleEn}</p>
                <p className="text-gray-500 text-xs leading-relaxed" style={{ fontFamily: "'Kantumruy Pro', sans-serif" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#055b65] text-xs font-bold tracking-widest uppercase mb-2">តម្លៃ</p>
            <h2 className="text-gray-900 mb-3" style={{ fontFamily: "'Kantumruy Pro', sans-serif", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}>
              ជ្រើសកញ្ចប់ ស្រប​​​ ជាមួយតម្រូវការ
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-7 border-2 ${
                  plan.highlight
                    ? "border-[#4da6ae] bg-[#055b65] text-white shadow-xl shadow-[#9dd0d5]"
                    : "border-gray-200 bg-white"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow">ពេញនិយមបំផុត</span>
                  </div>
                )}
                <div className="mb-4">
                  <div className={`text-xs font-bold tracking-widest uppercase mb-1 ${plan.highlight ? "text-[#a8d4d8]" : "text-[#055b65]"}`}>{plan.name}</div>
                  <div className={`text-sm mb-2 ${plan.highlight ? "text-[#cde8eb]" : "text-gray-400"}`} style={{ fontFamily: "'Kantumruy Pro', sans-serif" }}>{plan.nameKh}</div>
                  <div className="flex items-end gap-1">
                    <span className={`font-bold ${plan.highlight ? "text-white" : "text-gray-900"}`} style={{ fontSize: "2.5rem" }}>{plan.price}</span>
                    <span className={`text-sm mb-2 ${plan.highlight ? "text-[#a8d4d8]" : "text-gray-400"}`} style={{ fontFamily: "'Kantumruy Pro', sans-serif" }}>{plan.period}</span>
                  </div>
                  <div className={`text-xs font-medium ${plan.highlight ? "text-[#cde8eb]" : "text-gray-500"}`} style={{ fontFamily: "'Kantumruy Pro', sans-serif" }}>{plan.rooms}</div>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-xs">
                      <CheckCircle className={`w-4 h-4 shrink-0 ${plan.highlight ? "text-[#a8d4d8]" : "text-[#4da6ae]"}`} />
                      <span className={plan.highlight ? "text-[#e6f2f3]" : "text-gray-600"} style={{ fontFamily: "'Kantumruy Pro', sans-serif" }}>{feat}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={onRegister}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.highlight
                      ? "bg-white text-[#044750] hover:bg-[#e6f2f3]"
                      : "bg-[#055b65] text-white hover:bg-[#044750]"
                  }`}
                  style={{ fontFamily: "'Kantumruy Pro', sans-serif" }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#055b65] text-xs font-bold tracking-widest uppercase mb-2">មតិ</p>
            <h2 className="text-gray-900" style={{ fontFamily: "'Kantumruy Pro', sans-serif", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
              ម្ចាស់ផ្ទះដែលប្រើប្រាស់ ចែករំលែក
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5" style={{ fontFamily: "'Kantumruy Pro', sans-serif" }}>"{t.text}"</p>
                <div>
                  <div className="font-bold text-gray-900 text-sm" style={{ fontFamily: "'Kantumruy Pro', sans-serif" }}>{t.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: "'Kantumruy Pro', sans-serif" }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#055b65] to-[#0a7a87]">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="mb-4" style={{ fontFamily: "'Kantumruy Pro', sans-serif", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}>
            ចាប់ផ្ដើមគ្រប់គ្រង<br />ផ្ទះជួលរបស់អ្នកថ្ងៃនេះ
          </h2>
          <p className="text-[#cde8eb] mb-8 text-sm" style={{ fontFamily: "'Kantumruy Pro', sans-serif" }}>ឥតគិតថ្លៃ · ចុះឈ្មោះក្នុង ១ នាទី · ចេញ Invoice ភ្លាម</p>
          <button
            onClick={onRegister}
            className="bg-white text-[#044750] font-bold px-10 py-4 rounded-2xl hover:bg-[#e6f2f3] transition-all shadow-xl text-base"
            style={{ fontFamily: "'Kantumruy Pro', sans-serif" }}
          >
            ចាប់ផ្ដើមប្រើប្រាស់ ឥឡូវ →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-6 text-center text-xs">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 bg-[#055b65] rounded-lg flex items-center justify-center">
            <Building2 className="w-3 h-3 text-white" />
          </div>
          <span className="text-white font-bold">RoomRentKH</span>
        </div>
        <p style={{ fontFamily: "'Kantumruy Pro', sans-serif" }}>© 2024 RoomRentKH · ប្រព័ន្ធគ្រប់គ្រងផ្ទះជួលនៅកម្ពុជា</p>
      </footer>
    </div>
  );
}
