import { Menu, Bell, Search, ChevronDown, LogOut } from "lucide-react";
import { NavPage } from "./Sidebar";
import { useAppStore } from "../../store/appStore";
import { useState } from "react";

const pageTitles: Record<NavPage, string> = {
  dashboard:  "ផ្ទាំងគ្រប់គ្រង",
  rooms:      "គ្រប់គ្រងបន្ទប់",
  tenants:    "គ្រប់គ្រងអ្នកជួល",
  utilities:  "វិក្កយបត្រ & ការប្រើប្រាស់",
  expenses:   "ចំណូល & ចំណាយ",
  leases:     "កិច្ចសន្យាជួល",
  reports:    "របាយការណ៍",
  telegram:   "Telegram Bot",
  mobile:     "Mobile App",
  settings:   "ការកំណត់",
};

interface TopNavProps {
  activePage: NavPage;
  onMenuClick: () => void;
}

export function TopNav({ activePage, onMenuClick }: TopNavProps) {
  const { state, logout, myLeases } = useAppStore();
  const [profileOpen, setProfileOpen] = useState(false);

  const urgentLeases = myLeases().filter((l) => {
    const days = Math.ceil((new Date(l.endDate).getTime() - Date.now()) / (1000 * 86400));
    return days >= 0 && days <= 45;
  }).length;

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 gap-4 sticky top-0 z-20 shadow-sm">
      <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600" onClick={onMenuClick}>
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1">
        <h1 className="font-bold text-gray-900 text-base leading-tight">{pageTitles[activePage]}</h1>
      </div>

      <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-48">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none flex-1" placeholder="ស្វែងរក..." />
      </div>

      <button className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500">
        <Bell className="w-5 h-5" />
        {urgentLeases > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {urgentLeases}
          </span>
        )}
      </button>

      <div className="relative">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <div className="w-8 h-8 bg-[#cde8eb] rounded-full flex items-center justify-center text-[#044750] font-bold text-sm">
            {state.currentUser?.name?.charAt(0) ?? "A"}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-semibold text-gray-800 leading-none truncate max-w-[100px]">
              {state.currentUser?.name}
            </div>
            <div className="text-[11px] text-[#4da6ae] mt-0.5 uppercase">{state.currentUser?.plan}</div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>

        {profileOpen && (
          <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
            <div className="px-4 py-2.5 border-b border-gray-100">
              <div className="text-sm font-semibold text-gray-800">{state.currentUser?.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">{state.currentUser?.email}</div>
              <div className="text-xs text-[#055b65] font-medium mt-0.5">{state.currentUser?.buildingName}</div>
            </div>
            <button
              onClick={() => { setProfileOpen(false); logout(); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>ចាកចេញ</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
