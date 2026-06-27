import { useState } from "react";
import { AppProvider, useAppStore } from "./store/appStore";
import { Sidebar, NavPage } from "./components/rms/Sidebar";
import { TopNav } from "./components/rms/TopNav";
import { OnboardingWizard } from "./components/rms/OnboardingWizard";
import { Landing } from "./views/Landing";
import { Login } from "./views/Login";
import { Register } from "./views/Register";
import { Dashboard } from "./views/Dashboard";
import { Rooms } from "./views/Rooms";
import { Tenants } from "./views/Tenants";
import { Utilities } from "./views/Utilities";
import { Expenses } from "./views/Expenses";
import { Leases } from "./views/Leases";
import { Reports } from "./views/Reports";
import { TelegramBot } from "./views/TelegramBot";
import { MobileApp } from "./views/MobileApp";
import { Settings } from "./views/Settings";

type AuthPage = "landing" | "login" | "register";

function AppShell() {
  const { state } = useAppStore();
  const [authPage, setAuthPage] = useState<AuthPage>("landing");
  const [activePage, setActivePage] = useState<NavPage>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Show onboarding wizard for freshly registered users (no rooms yet)
  const [onboardingDone, setOnboardingDone] = useState(false);

  // Show full-screen spinner while restoring session from localStorage token
  if (state.loading && !state.currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e6f2f3] to-[#d0ecef] flex flex-col items-center justify-center gap-4">
        <span className="w-10 h-10 border-4 border-[#055b65]/30 border-t-[#055b65] rounded-full animate-spin" />
        <p className="text-sm text-[#055b65] font-medium" style={{ fontFamily: "Noto Serif Khmer, sans-serif" }}>
          កំពុងភ្ជាប់...
        </p>
      </div>
    );
  }

  if (!state.currentUser) {
    if (authPage === "login")    return <Login    onBack={() => setAuthPage("landing")} onRegister={() => setAuthPage("register")} />;
    if (authPage === "register") return <Register onBack={() => setAuthPage("landing")} onLogin={() => setAuthPage("login")} />;
    return <Landing onLogin={() => setAuthPage("login")} onRegister={() => setAuthPage("register")} />;
  }

  // Show wizard for new users who have no rooms yet
  const myRoomCount = state.rooms.length;
  const showWizard = myRoomCount === 0 && !onboardingDone && !state.loading;

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":  return <Dashboard />;
      case "rooms":      return <Rooms />;
      case "tenants":    return <Tenants />;
      case "utilities":  return <Utilities />;
      case "expenses":   return <Expenses />;
      case "leases":     return <Leases />;
      case "reports":    return <Reports />;
      case "telegram":   return <TelegramBot />;
      case "mobile":     return <MobileApp />;
      case "settings":   return <Settings />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex">
      {showWizard && <OnboardingWizard onComplete={() => setOnboardingDone(true)} />}

      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        buildingName={state.currentUser.buildingName}
        plan={state.currentUser.plan}
      />
      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">
        <TopNav activePage={activePage} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto">{renderPage()}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
