import { useState } from "react";
import { useAppStore } from "../store/appStore";
import { Building2, Eye, EyeOff, UserPlus, ArrowLeft, CheckCircle } from "lucide-react";

interface RegisterProps {
  onBack: () => void;
  onLogin: () => void;
}

export function Register({ onBack, onLogin }: RegisterProps) {
  const { register } = useAppStore();
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "", buildingName: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  // ── async: awaits the API call ────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("ពាក្យសម្ងាត់មិនដូចគ្នា");
      return;
    }
    if (form.password.length < 6) {
      setError("ពាក្យសម្ងាត់ត្រូវយ៉ាងហោចណាស់ ៦ តួអក្សរ");
      return;
    }

    setLoading(true);
    const ok = await register(form.name, form.email, form.password, form.buildingName);
    if (!ok) setError("អ៊ីម៉ែលនេះមានគណនីរួចហើយ");
    setLoading(false);
  };

  const perks = [
    "ប្រើប្រាស់ ២ សប្ដាហ៍ Pro ឥតគិតថ្លៃ",
    "ចេញ Invoice + KHQR QR ភ្លាម",
    "ទិន្នន័យរបស់អ្នកប្រើ ជាឯកជន",
    "Support ជាភាសាខ្មែរ ២៤/៧",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f2f3] to-[#d0ecef] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* Left panel */}
        <div className="hidden lg:block">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-[#055b65] rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">
              RoomRent<span className="text-[#055b65]">KH</span>
            </span>
          </div>
          <h2
            className="text-gray-900 mb-4 leading-tight"
            style={{ fontFamily: "Noto Serif Khmer, serif", fontWeight: 700, fontSize: "2rem" }}
          >
            ចាប់ផ្ដើម<br />គ្រប់គ្រងបាន<br />ខ្ពស់ជាងមុន
          </h2>
          <p
            className="text-gray-500 mb-8 text-sm"
            style={{ fontFamily: "Noto Serif Khmer, sans-serif" }}
          >
            ចូលរួមជាមួយម្ចាស់ផ្ទះជួលជាង ៥០០ នាក់ ដែលបានប្រើ RoomRentKH
          </p>
          <ul className="space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                <span style={{ fontFamily: "Noto Serif Khmer, sans-serif" }}>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#055b65] mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> ត្រឡប់
          </button>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h1 className="font-bold text-gray-900 text-xl mb-1">បង្កើតគណនី</h1>
            <p
              className="text-sm text-gray-400 mb-6"
              style={{ fontFamily: "Noto Serif Khmer, sans-serif" }}
            >
              ឥតគិតថ្លៃ · ចុះឈ្មោះក្នុង ១ នាទី
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: "ឈ្មោះពេញ (Full Name)",    key: "name",         placeholder: "ហេង ច័ន្ទដារ៉ា", type: "text"  },
                { label: "ឈ្មោះអគារ / ផ្ទះជួល",    key: "buildingName", placeholder: "អគារ ចំការមន",    type: "text"  },
                { label: "អ៊ីម៉ែល (Email)",          key: "email",        placeholder: "your@email.com",   type: "email" },
              ].map((f) => (
                <div key={f.key}>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                    style={{ fontFamily: "Noto Serif Khmer, sans-serif" }}
                  >
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca]"
                    placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => set(f.key, e.target.value)}
                    required
                  />
                </div>
              ))}

              {/* Password */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                  style={{ fontFamily: "Noto Serif Khmer, sans-serif" }}
                >
                  ពាក្យសម្ងាត់
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca] pr-10"
                    placeholder="យ៉ាងហោចណាស់ ៦ តួ"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                  style={{ fontFamily: "Noto Serif Khmer, sans-serif" }}
                >
                  បញ្ជាក់ពាក្យសម្ងាត់
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca]"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => set("confirmPassword", e.target.value)}
                  required
                />
              </div>

              {error && (
                <div
                  className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100"
                  style={{ fontFamily: "Noto Serif Khmer, sans-serif" }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#055b65] text-white py-3.5 rounded-xl font-semibold hover:bg-[#044750] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span style={{ fontFamily: "Noto Serif Khmer, sans-serif" }}>
                      បង្កើតគណនី ឥតគិតថ្លៃ
                    </span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-sm text-gray-500">
                មានគណនីរួចហើយ?{" "}
                <button
                  onClick={onLogin}
                  className="text-[#055b65] font-semibold hover:underline"
                  style={{ fontFamily: "Noto Serif Khmer, sans-serif" }}
                >
                  ចូលប្រើប្រាស់
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
