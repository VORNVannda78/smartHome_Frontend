import { useState, useRef } from "react";
import { Save, Building2, DollarSign, Bell, Shield, Droplets, Zap, Trash2, Camera, QrCode, Lock, Eye, EyeOff, Upload, CheckCircle } from "lucide-react";
import { useAppStore } from "../store/appStore";
import { api } from "../../services/api";

const khStyle: React.CSSProperties = { lineHeight: "1.8" };

export function Settings() {
  const { state } = useAppStore();
  const [saved, setSaved] = useState(false);
  const [savedSection, setSavedSection] = useState<string | null>(null);

  // Profile
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [khqrUrl, setKhqrUrl] = useState<string | null>(null);
  const avatarRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const khqrRef = useRef<HTMLInputElement>(null);

  // Building config
  const [config, setConfig] = useState({
    buildingName: state.currentUser?.buildingName ?? "RoomRent KH",
    address: "ភ្នំពេញ, កម្ពុជា",
    phone: "+855 12 345 678",
    email: state.currentUser?.email ?? "admin@roomrentkh.com",
    waterRate: 4,
    electricRate: 0.8,
    trashFee: 5,
    bankName: "ABA Bank",
    accountNumber: "000 123 456",
    notifyOverdue: true,
    notifyPayment: true,
  });

  // Password
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const set = (k: string, v: string | number | boolean) => setConfig((c) => ({ ...c, [k]: v }));

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setter(url);
  };

  // Save building name to backend
  const quickSave = (section: string) => {
    if (section === "profile" || section === "building") {
      api
        .put("/auth/settings", { buildingName: config.buildingName })
        .catch((e) => console.error("quickSave:", e));
    }
    setSavedSection(section);
    setTimeout(() => setSavedSection(null), 2000);
  };

  // Save all — persists buildingName
  const handleSaveAll = () => {
    api
      .put("/auth/settings", { buildingName: config.buildingName })
      .catch((e) => console.error("handleSaveAll:", e));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Change password via real API
  const handlePasswordChange = async () => {
    setPwError("");
    if (!pwForm.current) { setPwError("សូមបញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្ន"); return; }
    if (pwForm.next.length < 6) { setPwError("ពាក្យសម្ងាត់ថ្មីត្រូវយ៉ាងហោចណាស់ ៦ តួ"); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError("ពាក្យសម្ងាត់ថ្មីមិនដូចគ្នា"); return; }
    setPwLoading(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: pwForm.current,
        newPassword: pwForm.next,
      });
      setPwSaved(true);
      setPwForm({ current: "", next: "", confirm: "" });
      setTimeout(() => setPwSaved(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "ប្ដូរពាក្យសម្ងាត់មិនបាន";
      setPwError(msg);
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="font-bold text-gray-900 text-lg">ការកំណត់</h1>
        <p className="text-sm text-gray-400" style={khStyle}>ប្រព័ន្ធ · Profile · ការទូទាត់ · សុវត្ថិភាព</p>
      </div>

      {/* ── Profile & Branding ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <Camera className="w-4 h-4 text-[#055b65]" /> Profile & Branding
        </h2>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Admin Avatar */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-20 h-20 rounded-2xl bg-[#e6f2f3] border-2 border-[#9dd0d5] flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-opacity relative group"
              onClick={() => avatarRef.current?.click()}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-black text-[#055b65]">
                  {state.currentUser?.name?.charAt(0) ?? "A"}
                </span>
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-xs text-gray-400">Admin Avatar</span>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => handleImageUpload(e, setAvatarUrl)} />
          </div>

          {/* Building Logo */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-20 h-20 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#055b65] transition-colors relative group"
              onClick={() => logoRef.current?.click()}
            >
              {logoUrl ? (
                <img src={logoUrl} alt="logo" className="w-full h-full object-contain p-1" />
              ) : (
                <Building2 className="w-8 h-8 text-gray-300" />
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-xs text-gray-400">Logo អគារ</span>
            <input ref={logoRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => handleImageUpload(e, setLogoUrl)} />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-1 text-sm pt-1">
            <div className="font-semibold text-gray-900">{state.currentUser?.name}</div>
            <div className="text-gray-500">{state.currentUser?.email}</div>
            <div className="text-[#055b65] font-medium text-xs bg-[#e6f2f3] px-2 py-0.5 rounded-full w-fit uppercase">
              {state.currentUser?.plan} Plan
            </div>
            <p className="text-xs text-gray-400 mt-2" style={khStyle}>
              Logo អគារ នឹងលេចឡើងនៅលើវិក្កយបត្រដែលផ្ញើឲ្យអ្នកជួល
            </p>
          </div>
        </div>
      </div>

      {/* ── Building Info ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#055b65]" /> ព័ត៌មានអគារ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "ឈ្មោះអគារ", key: "buildingName" },
            { label: "អាសយដ្ឋាន", key: "address" },
            { label: "លេខទូរស័ព្ទ", key: "phone" },
            { label: "អ៊ីម៉ែល", key: "email" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
              <input
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca]"
                value={config[f.key as keyof typeof config] as string}
                onChange={(e) => set(f.key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── KHQR Payment Setup ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <QrCode className="w-4 h-4 text-[#055b65]" /> KHQR & ការទូទាត់
        </h2>
        <p className="text-xs text-gray-400" style={khStyle}>
          KHQR និងព័ត៌មានគណនីនឹងត្រូវបិទភ្ជាប់ស្វ័យប្រវត្តិលើ Invoice ដែលផ្ញើឲ្យអ្នកជួល
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
          {/* KHQR upload */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Upload រូប KHQR</label>
            <div
              className="border-2 border-dashed border-gray-200 rounded-2xl p-5 text-center cursor-pointer hover:border-[#055b65] transition-colors group"
              onClick={() => khqrRef.current?.click()}
            >
              {khqrUrl ? (
                <img src={khqrUrl} alt="KHQR" className="w-32 h-32 object-contain mx-auto" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-[#055b65]">
                  <QrCode className="w-10 h-10" />
                  <div className="text-xs">ចុចដើម្បី Upload KHQR</div>
                  <div className="text-[11px] text-gray-300">PNG, JPG (ABA, ACLEDA...)</div>
                </div>
              )}
            </div>
            <input ref={khqrRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => handleImageUpload(e, setKhqrUrl)} />
          </div>

          {/* Bank details */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">ឈ្មោះធនាគារ</label>
              <select className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca] bg-white"
                value={config.bankName} onChange={(e) => set("bankName", e.target.value)}>
                {["ABA Bank", "ACLEDA Bank", "Wing Bank", "Canadia Bank", "Maybank", "Other"].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">លេខគណនី (Account No.)</label>
              <input className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca]"
                value={config.accountNumber} onChange={(e) => set("accountNumber", e.target.value)}
                placeholder="000 123 456" />
            </div>
            <div className="bg-[#e6f2f3] rounded-xl p-3 text-xs text-[#055b65]" style={khStyle}>
              ✓ ព័ត៌មានទាំងនេះ នឹងបង្ហាញជា: <br />
              <strong>គណនី: {config.bankName} — {config.accountNumber}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── Utility Rates ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#055b65]" /> ថ្លៃប្រើប្រាស់
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <Droplets className="w-3.5 h-3.5 text-blue-500" /> ថ្លៃទឹក ($/m³)
            </label>
            <input type="number" step="0.1" min={0}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca]"
              value={config.waterRate} onChange={(e) => set("waterRate", parseFloat(e.target.value) || 0)} />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-500" /> ថ្លៃអគ្គីសនី ($/kWh)
            </label>
            <input type="number" step="0.01" min={0}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca]"
              value={config.electricRate} onChange={(e) => set("electricRate", parseFloat(e.target.value) || 0)} />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <Trash2 className="w-3.5 h-3.5 text-orange-500" /> ប្រមូលសំរាម ($)
            </label>
            <input type="number" step="0.5" min={0}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca]"
              value={config.trashFee} onChange={(e) => set("trashFee", parseFloat(e.target.value) || 0)} />
          </div>
        </div>
      </div>

      {/* ── Notifications ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#055b65]" /> ការជូនដំណឹង
        </h2>
        {[
          { key: "notifyOverdue", label: "ជូនដំណឹងពេលវិក្កយបត្រចំណាំ" },
          { key: "notifyPayment", label: "ជូនដំណឹងពេលទទួលការទូទាត់" },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700" style={khStyle}>{item.label}</span>
            <button
              onClick={() => set(item.key, !config[item.key as keyof typeof config])}
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ml-4 ${config[item.key as keyof typeof config] ? "bg-[#055b65]" : "bg-gray-200"}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${config[item.key as keyof typeof config] ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        ))}
      </div>

      {/* ── Change Password ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#055b65]" /> ប្ដូរពាក្យសម្ងាត់
        </h2>
        <div className="space-y-3 max-w-sm">
          {[
            { label: "ពាក្យសម្ងាត់បច្ចុប្បន្ន", key: "current" },
            { label: "ពាក្យសម្ងាត់ថ្មី", key: "next" },
            { label: "បញ្ជាក់ពាក្យសម្ងាត់ថ្មី", key: "confirm" },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-sm font-medium text-gray-700 block mb-1.5" style={khStyle}>{f.label}</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca] pr-10"
                  value={pwForm[f.key as keyof typeof pwForm]}
                  onChange={(e) => setPwForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  placeholder="••••••••"
                />
                {f.key === "current" && (
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          ))}
          {pwError && (
            <div className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2" style={khStyle}>{pwError}</div>
          )}
          {pwSaved && (
            <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">
              <CheckCircle className="w-3.5 h-3.5" />
              <span style={khStyle}>ពាក្យសម្ងាត់ត្រូវបានប្ដូរជោគជ័យ!</span>
            </div>
          )}
          <button onClick={handlePasswordChange} disabled={pwLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#055b65] text-white text-sm font-medium hover:bg-[#044750] transition-colors disabled:opacity-60">
            {pwLoading
              ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : <Lock className="w-4 h-4" />}
            ប្ដូរពាក្យសម្ងាត់
          </button>
        </div>
      </div>

      {/* ── Admin permissions ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-[#055b65]" /> សិទ្ធិអ្នកគ្រប់គ្រង
        </h2>
        <div className="bg-[#e6f2f3] border border-[#cde8eb] rounded-xl p-4">
          <div className="text-sm font-semibold text-[#033b42] mb-2">🔐 សិទ្ធិ Admin ពេញលេញ</div>
          <ul className="text-xs text-[#044750] space-y-1 list-disc list-inside" style={khStyle}>
            <li>កែបន្ទប់ & អ្នកជួល — គ្រប់ Field</li>
            <li>ចេញ & គ្រប់គ្រង Invoice + KHQR</li>
            <li>ផ្ញើ Invoice តាម Telegram</li>
            <li>Export ទិន្នន័យជា CSV</li>
            <li>Print កិច្ចសន្យា PDF</li>
            <li>Upload Logo, KHQR, Attachments</li>
          </ul>
        </div>
      </div>

      {/* Save all */}
      <button
        onClick={handleSaveAll}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium transition-all shadow-sm ${saved ? "bg-[#044750]" : "bg-[#055b65] hover:bg-[#044750]"}`}
      >
        <Save className="w-4 h-4" />
        {saved ? "បានរក្សាទុក! ✓" : "រក្សាទុកការផ្លាស់ប្ដូរ"}
      </button>
    </div>
  );
}
