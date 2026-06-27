import {
  LayoutDashboard, DoorOpen, Users, FileText, Settings,
  ChevronRight, X, Building2, TrendingDown, ScrollText,
  BarChart3, Send, Smartphone,
} from "lucide-react";

export type NavPage =
  | "dashboard" | "rooms" | "tenants" | "utilities"
  | "expenses" | "leases" | "reports" | "telegram" | "mobile" | "settings";

const navGroups = [
  {
    label: "ម៉ឺនុយចម្បង",
    items: [
      { page: "dashboard" as NavPage, label: "ផ្ទាំងគ្រប់គ្រង",        icon: LayoutDashboard },
      { page: "rooms"     as NavPage, label: "គ្រប់គ្រងបន្ទប់",         icon: DoorOpen },
      { page: "tenants"   as NavPage, label: "អ្នកជួល",                 icon: Users },
      { page: "utilities" as NavPage, label: "វិក្កយបត្រ & ប្រើប្រាស់", icon: FileText },
    ],
  },
  {
    label: "ហិរញ្ញវត្ថុ",
    items: [
      { page: "expenses" as NavPage, label: "ចំណូល & ចំណាយ",  icon: TrendingDown },
      { page: "leases"   as NavPage, label: "កិច្ចសន្យា",        icon: ScrollText },
      { page: "reports"  as NavPage, label: "របាយការណ៍",        icon: BarChart3 },
    ],
  },
  {
    label: "ឧបករណ៍",
    items: [
      { page: "telegram" as NavPage, label: "Telegram Bot",    icon: Send },
      { page: "mobile"   as NavPage, label: "Mobile App",      icon: Smartphone },
      { page: "settings" as NavPage, label: "ការកំណត់",         icon: Settings },
    ],
  },
];

interface SidebarProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  mobileOpen: boolean;
  onClose: () => void;
  buildingName?: string;
  plan?: string;
}

export function Sidebar({ activePage, onNavigate, mobileOpen, onClose, buildingName, plan }: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-40 flex flex-col shadow-lg transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>

        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#055b65] rounded-xl flex items-center justify-center shadow-sm">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm leading-none">RoomRentKH</div>
              <div className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[110px]">
                {buildingName ?? "ប្រព័ន្ធគ្រប់គ្រង"}
              </div>
            </div>
          </div>
          <button className="lg:hidden p-1 text-gray-400 hover:text-gray-600" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-4">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-1">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = activePage === item.page;
                  return (
                    <li key={item.page}>
                      <button
                        onClick={() => { onNavigate(item.page); onClose(); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                          ${active
                            ? "bg-[#e6f2f3] text-[#044750]"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                      >
                        <item.icon
                          style={{ width: 17, height: 17 }}
                          className={`flex-shrink-0 ${active ? "text-[#055b65]" : "text-gray-400 group-hover:text-gray-600"}`}
                        />
                        <span className="flex-1 text-left">{item.label}</span>
                        {active && <ChevronRight className="w-3.5 h-3.5 text-[#6ab8bf]" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Plan badge */}
        <div className="px-3 pb-4">
          <div className="bg-gradient-to-r from-[#055b65] to-[#0a7a87] rounded-xl p-3 text-white">
            <div className="flex items-center justify-between mb-0.5">
              <div className="text-xs font-semibold">Plan: {(plan ?? "free").toUpperCase()}</div>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Active</span>
            </div>
            <div className="text-[11px] opacity-80">សិទ្ធិ Admin ពេញលេញ</div>
          </div>
        </div>
      </aside>
    </>
  );
}
