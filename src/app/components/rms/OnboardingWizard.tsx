import { useState } from "react";
import { useAppStore } from "../../store/appStore";
import {
  Building2, DoorOpen, Users, CheckCircle,
  ArrowRight, ArrowLeft, Sparkles, Zap,
} from "lucide-react";

interface OnboardingWizardProps {
  onComplete: () => void;
}

const STEPS = [
  { id: 1, title: "ព័ត៌មានអគារ", icon: Building2 },
  { id: 2, title: "បង្កើតបន្ទប់", icon: DoorOpen },
  { id: 3, title: "ចូលប្រើប្រាស់!", icon: Sparkles },
];

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const { state, addRoom } = useAppStore();
  const [step, setStep] = useState(1);

  // Step 2 — auto-generate rooms
  const [floors, setFloors] = useState(2);
  const [roomsPerFloor, setRoomsPerFloor] = useState(5);
  const [baseRent, setBaseRent] = useState(200);
  const [generated, setGenerated] = useState(false);
  const [genCount, setGenCount] = useState(0);

  const previewRooms = () => {
    const rooms: string[] = [];
    for (let f = 1; f <= Math.min(floors, 5); f++) {
      for (let r = 1; r <= Math.min(roomsPerFloor, 10); r++) {
        const num = `${f}${String(r).padStart(2, "0")}`;
        rooms.push(num);
      }
    }
    return rooms;
  };

  const handleGenerateRooms = () => {
    const preview = previewRooms();
    preview.forEach((roomNumber, idx) => {
      const floorNum = Math.floor(idx / roomsPerFloor) + 1;
      addRoom({ roomNumber, floor: floorNum, monthlyRent: baseRent, status: "Available" });
    });
    setGenerated(true);
    setGenCount(preview.length);
  };

  const user = state.currentUser;

  return (
    <div className="fixed inset-0 z-50 bg-[#011318]/80 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#055b65] to-[#0a7a87] px-8 pt-8 pb-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-6 h-6" />
            <span className="font-bold text-lg">RoomRentKH</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">
            សូមស្វាគមន៍, {user?.name}! 👋
          </h1>
          <p className="text-[#a8d4d8] text-sm">
            រៀបចំប្រព័ន្ធរបស់លោក/លោកស្រីក្នុងពេល ២ នាទី
          </p>

          {/* Step indicators */}
          <div className="flex items-center gap-2 mt-6">
            {STEPS.map((s, idx) => (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step > s.id ? "bg-white text-[#055b65]" :
                  step === s.id ? "bg-white/30 text-white ring-2 ring-white" :
                  "bg-white/10 text-white/50"
                }`}>
                  {step > s.id ? <CheckCircle className="w-5 h-5" /> : s.id}
                </div>
                <span className={`text-xs hidden sm:inline ${step >= s.id ? "text-white" : "text-white/40"}`}>{s.title}</span>
                {idx < STEPS.length - 1 && (
                  <div className={`w-8 h-0.5 ${step > s.id ? "bg-white" : "bg-white/20"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6">

          {/* ── Step 1: Building info ── */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-bold text-gray-900 text-lg">ព័ត៌មានអគាររបស់លោក/លោកស្រី</h2>
              <div className="bg-[#e6f2f3] border border-[#cde8eb] rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#055b65] rounded-xl flex items-center justify-center text-white">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{user?.buildingName}</div>
                    <div className="text-sm text-[#055b65]">{user?.email}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div className="bg-white rounded-lg px-3 py-2">
                    <div className="font-semibold text-gray-700">Plan</div>
                    <div className="text-[#055b65] font-bold uppercase">{user?.plan}</div>
                  </div>
                  <div className="bg-white rounded-lg px-3 py-2">
                    <div className="font-semibold text-gray-700">ដែនកំណត់</div>
                    <div className="text-[#055b65] font-bold">{user?.plan === "free" ? "5 បន្ទប់" : user?.plan === "pro" ? "50 បន្ទប់" : "គ្មានដែនកំណត់"}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                <Zap className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-700">
                  <div className="font-semibold mb-0.5">ជំហានបន្ទាប់</div>
                  ប្រព័ន្ធនឹងជួយបង្កើតបន្ទប់ <strong>ដោយស្វ័យប្រវត្តិ</strong> ពីការបញ្ចូលជាន់ និងចំនួនបន្ទប់ប៉ុណ្ណោះ
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Auto-generate rooms ── */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-bold text-gray-900 text-lg">បង្កើតបន្ទប់ស្វ័យប្រវត្តិ</h2>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">ចំនួនជាន់</label>
                  <input type="number" min={1} max={20}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca] text-center font-bold"
                    value={floors} onChange={(e) => { setFloors(parseInt(e.target.value) || 1); setGenerated(false); }} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">បន្ទប់/ជាន់</label>
                  <input type="number" min={1} max={20}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca] text-center font-bold"
                    value={roomsPerFloor} onChange={(e) => { setRoomsPerFloor(parseInt(e.target.value) || 1); setGenerated(false); }} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">ថ្លៃ/ខែ ($)</label>
                  <input type="number" min={50}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca] text-center font-bold"
                    value={baseRent} onChange={(e) => { setBaseRent(parseInt(e.target.value) || 100); setGenerated(false); }} />
                </div>
              </div>

              {/* Room number preview */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="text-xs font-medium text-gray-500 mb-2">មើលជាមុន — លេខបន្ទប់:</div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {previewRooms().map((n) => (
                    <span key={n} className="text-xs bg-[#e6f2f3] text-[#044750] px-2 py-0.5 rounded-full font-mono">
                      {n}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  សរុប <strong className="text-[#055b65]">{previewRooms().length}</strong> បន្ទប់ · លេខ {previewRooms()[0]} ដល់ {previewRooms()[previewRooms().length - 1]}
                </div>
              </div>

              {!generated ? (
                <button
                  onClick={handleGenerateRooms}
                  className="w-full py-3 bg-[#055b65] text-white rounded-xl font-semibold hover:bg-[#044750] transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  បង្កើត {previewRooms().length} បន្ទប់ ភ្លាមៗ
                </button>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                  <div>
                    <div className="font-semibold text-green-800">បានបង្កើត {genCount} បន្ទប់ ✅</div>
                    <div className="text-xs text-green-600">ចូលទៅ "គ្រប់គ្រងបន្ទប់" ដើម្បីពិនិត្យ</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Done ── */}
          {step === 3 && (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-[#e6f2f3] rounded-full flex items-center justify-center mx-auto mb-5">
                <Sparkles className="w-10 h-10 text-[#055b65]" />
              </div>
              <h2 className="font-bold text-gray-900 text-xl mb-2">ប្រព័ន្ធបានរៀបចំហើយ! 🎉</h2>
              <p className="text-gray-500 text-sm mb-6">
                ចូលទៅប្រើប្រាស់ Dashboard, គ្រប់គ្រងអ្នកជួល, ចេញ Invoice + KHQR បានភ្លាមៗ
              </p>
              <div className="grid grid-cols-3 gap-3 mb-6 text-xs">
                {[
                  { icon: DoorOpen, label: "បន្ទប់ត្រូវបានបង្កើត", value: genCount || "—", color: "text-[#055b65]" },
                  { icon: Users,    label: "អ្នកជួល",             value: "0",              color: "text-[#055b65]" },
                  { icon: Zap,      label: "Ready!",              value: "✓",              color: "text-green-600" },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
                    <div className={`font-bold text-lg ${s.color}`}>{s.value}</div>
                    <div className="text-gray-400">{s.label}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={onComplete}
                className="w-full py-3.5 bg-[#055b65] text-white rounded-xl font-bold hover:bg-[#044750] transition-colors flex items-center justify-center gap-2 text-base"
              >
                ចូលប្រើប្រាស់ Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer nav */}
        {step < 3 && (
          <div className="px-8 pb-6 flex items-center justify-between">
            <button
              onClick={() => step > 1 && setStep(step - 1)}
              className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl border transition-colors ${
                step === 1 ? "border-gray-100 text-gray-300 cursor-not-allowed" : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
              disabled={step === 1}
            >
              <ArrowLeft className="w-4 h-4" /> ថយក្រោយ
            </button>
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 text-sm px-6 py-2 bg-[#055b65] text-white rounded-xl hover:bg-[#044750] transition-colors"
            >
              {step === 2 && !generated ? "រំលង" : "បន្ទាប់"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
