import { useState } from "react";
import { useAppStore } from "../store/appStore";
import { Building2, Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";

interface LoginProps {
  onBack: () => void;
  onRegister: () => void;
}

export function Login({ onBack, onRegister }: LoginProps) {
  const { login } = useAppStore();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  // ── async: awaits the API call ────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login(email, password);
    if (!ok) setError("អ៊ីម៉ែល ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវ");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#edf7f7] via-[#e3f3f4] to-[#cfecee] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#055b65] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> ត្រឡប់ទំព័រដើម
        </button>

        <div className="bg-white rounded-3xl shadow-[0_28px_70px_rgba(5,91,101,0.18)] p-8 sm:p-10 border border-white/80">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#055b65] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-bold text-gray-900 text-xl mb-1">ចូលប្រើប្រាស់</h1>
            <p className="text-sm text-gray-400" style={{ fontFamily: "Noto Serif Khmer, sans-serif" }}>
              RoomRentKH — ប្រព័ន្ធគ្រប់គ្រងផ្ទះជួល
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                អ៊ីម៉ែល (Email)
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50/70 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#055b65]/20 focus:border-[#055b65]"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                ពាក្យសម្ងាត់ (Password)
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50/70 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#055b65]/20 focus:border-[#055b65] pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
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
              className="w-full bg-[#055b65] text-white py-3.5 rounded-xl font-semibold hover:bg-[#044750] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span style={{ fontFamily: "Noto Serif Khmer, sans-serif" }}>
                    ចូលប្រើប្រាស់
                  </span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              មិនទាន់មានគណនី?{" "}
              <button
                onClick={onRegister}
                className="text-[#055b65] font-semibold hover:underline"
                style={{ fontFamily: "Noto Serif Khmer, sans-serif" }}
              >
                ចុះឈ្មោះដោយឥតគិតថ្លៃ
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
