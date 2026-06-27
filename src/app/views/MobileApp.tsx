import { Smartphone, Bell, QrCode, BarChart2, DoorOpen, Users, Shield, Wifi, Star, Download, Apple, CheckCircle } from "lucide-react";

const features = [
  { icon: Bell,      title: "Push Notification",    desc: "ទទួល Alert ភ្លាម ពេលអ្នកជួលបង់ KHQR ជោគជ័យ" },
  { icon: QrCode,    title: "KHQR Scanner",          desc: "ស្កែន QR ដើម្បីបញ្ជាក់ការទូទាត់ប្រចាំថ្ងៃ" },
  { icon: BarChart2, title: "Live Dashboard",        desc: "ចំណូល-ចំណាយ, Occupancy Rate ក្នុង Real-time" },
  { icon: DoorOpen,  title: "Room Status Control",   desc: "ប្ដូរស្ថានភាពបន្ទប់ ទំ/ជួល/ជួសជុល ពី Phone" },
  { icon: Users,     title: "Tenant Notifications",  desc: "ផ្ញើ Invoice Reminder ទៅ Telegram ក្នុង 1 tap" },
  { icon: Shield,    title: "Secure Offline Mode",   desc: "ប្រើបានដោយគ្មាន Internet ហើយ Sync ពេលតភ្ជាប់" },
];

const screenshots = [
  { title: "Dashboard", color: "bg-[#055b65]", icon: BarChart2 },
  { title: "Invoice", color: "bg-violet-600", icon: QrCode },
  { title: "Tenants", color: "bg-blue-600", icon: Users },
];

const roadmap = [
  { q: "Q3 2024", item: "Beta Testing — iOS & Android", done: false },
  { q: "Q4 2024", item: "App Store & Google Play Launch", done: false },
  { q: "Q1 2025", item: "Offline Mode + OCR Scan", done: false },
  { q: "Q2 2025", item: "KHQR Auto-Verify via ABA API", done: false },
];

export function MobileApp() {
  return (
    <div className="p-6 space-y-8 max-w-5xl">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#055b65] via-[#044750] to-[#0a7a87] rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-white/5 rounded-full translate-y-16" />
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1.5 text-xs font-medium mb-4">
              <Smartphone className="w-3.5 h-3.5" /> កំពុងអភិវឌ្ឍ — Coming Soon
            </div>
            <h1 className="mb-4 leading-tight" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 700 }}>
              RoomRentKH
              <br />
              <span className="text-[#a8d4d8]">Mobile App</span>
            </h1>
            <p className="text-[#cde8eb] mb-6 text-sm leading-relaxed">
              គ្រប់គ្រងផ្ទះជួលពី iOS & Android — ទទួល Notification ពេលបង់ប្រាក់, ចេញ Invoice, ស្កែន KHQR ភ្លាម
            </p>
            <div className="flex gap-3 flex-wrap">
              <button className="flex items-center gap-2 bg-white text-[#044750] px-5 py-3 rounded-xl font-semibold hover:bg-[#e6f2f3] transition-colors text-sm">
                <Apple className="w-4 h-4" /> App Store
              </button>
              <button className="flex items-center gap-2 bg-white/15 text-white px-5 py-3 rounded-xl font-semibold hover:bg-white/25 transition-colors text-sm border border-white/20">
                <Download className="w-4 h-4" /> Google Play
              </button>
            </div>
            <p className="text-[#8ec9ce] text-xs mt-3">ចុះឈ្មោះ Waitlist — ទទួល Early Access ឥតគិតថ្លៃ ៣ ខែ</p>
          </div>

          {/* Fake phone mockups */}
          <div className="flex justify-center gap-3">
            {screenshots.map((s, i) => (
              <div
                key={s.title}
                className={`rounded-3xl shadow-2xl flex flex-col overflow-hidden border-4 border-white/20 ${
                  i === 1 ? "w-32 h-64" : "w-28 h-52 mt-6"
                }`}
                style={{ transform: i === 0 ? "rotate(-6deg)" : i === 2 ? "rotate(6deg)" : "none" }}
              >
                <div className={`${s.color} flex-1 flex flex-col items-center justify-center gap-2 p-4`}>
                  <div className="w-8 h-1 bg-white/30 rounded-full mx-auto mb-2" />
                  <s.icon className="w-8 h-8 text-white/80" />
                  <div className="text-white/70 text-[10px] font-medium">{s.title}</div>
                  <div className="space-y-1.5 w-full mt-2">
                    {[40, 70, 55, 85].map((w, j) => (
                      <div key={j} className="h-1.5 bg-white/20 rounded-full" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                </div>
                <div className="h-10 bg-gray-900 flex items-center justify-center">
                  <div className="w-10 h-1 bg-white/20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="font-bold text-gray-900 text-xl mb-2">មុខងារ Mobile App</h2>
        <p className="text-sm text-gray-400 mb-6">គ្រប់អ្វីដែល Desktop ធ្វើបាន — ក្នុង Pocket របស់អ្នក</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#9dd0d5] hover:shadow-md transition-all group">
              <div className="w-11 h-11 bg-[#e6f2f3] group-hover:bg-[#055b65] rounded-xl flex items-center justify-center mb-4 transition-colors">
                <f.icon className="w-5 h-5 text-[#055b65] group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-4">បច្ចេកវិទ្យាដែលប្រើ</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: "React Native", color: "bg-blue-50 text-blue-700", note: "iOS + Android" },
            { name: "Expo",         color: "bg-[#e6f2f3] text-[#044750]", note: "Fast Build" },
            { name: "TypeScript",   color: "bg-violet-50 text-violet-700", note: "Type-safe" },
            { name: "Zustand",      color: "bg-orange-50 text-orange-700", note: "State Mgmt" },
            { name: "ABA PayWay",   color: "bg-green-50 text-green-700",  note: "KHQR API" },
            { name: "FCM / APNs",   color: "bg-red-50 text-red-700",     note: "Push Notify" },
            { name: "SQLite",       color: "bg-gray-100 text-gray-700",   note: "Offline DB" },
            { name: "Express API",  color: "bg-yellow-50 text-yellow-700", note: "Backend" },
          ].map((t) => (
            <div key={t.name} className={`rounded-xl px-4 py-3 ${t.color}`}>
              <div className="font-bold text-sm">{t.name}</div>
              <div className="text-xs opacity-70">{t.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-5">Roadmap</h2>
        <div className="space-y-4">
          {roadmap.map((r, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${r.done ? "bg-green-50" : "bg-[#e6f2f3]"}`}>
                {r.done
                  ? <CheckCircle className="w-5 h-5 text-green-600" />
                  : <div className="w-3 h-3 rounded-full bg-[#8ec9ce]" />
                }
              </div>
              <div className="flex-1 pt-1.5">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold text-[#055b65] bg-[#e6f2f3] px-2 py-0.5 rounded-full">{r.q}</span>
                  {r.done && <span className="text-xs text-green-600 font-medium">✓ Done</span>}
                </div>
                <div className="text-sm text-gray-700 font-medium">{r.item}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Waitlist CTA */}
      <div className="bg-[#e6f2f3] border border-[#cde8eb] rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="w-14 h-14 bg-[#055b65] rounded-2xl flex items-center justify-center shrink-0">
          <Star className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-bold text-[#022830] text-lg mb-1">ចុះឈ្មោះ Early Access</h3>
          <p className="text-sm text-[#055b65]">ទទួលបាន Early Access ១ ខែ Pro Plan ឥតគិតថ្លៃ</p>
        </div>
        <div className="flex gap-2 shrink-0 w-full sm:w-auto">
          <input type="email" placeholder="your@email.com"
            className="flex-1 sm:w-48 px-4 py-2.5 rounded-xl border border-[#9dd0d5] text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca] bg-white" />
          <button className="px-5 py-2.5 bg-[#055b65] text-white rounded-xl text-sm font-medium hover:bg-[#044750] whitespace-nowrap">
            ចុះឈ្មោះ
          </button>
        </div>
      </div>
    </div>
  );
}
