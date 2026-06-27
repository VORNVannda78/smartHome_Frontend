import { useState } from "react";
import { useAppStore, Expense, ExpenseCategory } from "../store/appStore";
import { Plus, Trash2, X, TrendingDown, TrendingUp, DollarSign, Wrench, Zap, Leaf, Sparkles, MoreHorizontal } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const CATEGORIES: ExpenseCategory[] = ["Repair", "Utilities", "Tax", "Cleaning", "Other"];

const catConfig: Record<ExpenseCategory, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  Repair:    { icon: Wrench,         color: "text-orange-600", bg: "bg-orange-50",  label: "ជួសជុល" },
  Utilities: { icon: Zap,            color: "text-yellow-600", bg: "bg-yellow-50",  label: "ប្រើប្រាស់" },
  Tax:       { icon: DollarSign,     color: "text-red-600",    bg: "bg-red-50",     label: "ពន្ធ" },
  Cleaning:  { icon: Sparkles,       color: "text-blue-600",   bg: "bg-blue-50",    label: "សម្អាត" },
  Other:     { icon: MoreHorizontal, color: "text-gray-600",   bg: "bg-gray-100",   label: "ផ្សេងៗ" },
};

type FormData = Omit<Expense, "id" | "landlordId">;
const emptyForm: FormData = { date: new Date().toISOString().slice(0, 10), category: "Repair", description: "", amount: 0, roomId: "" };

function ExpenseModal({ form, onChange, onSubmit, onClose }: {
  form: FormData;
  onChange: (k: keyof FormData, v: string | number) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  const { myRooms } = useAppStore();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">បន្ថែមចំណាយ</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">ថ្ងៃខែ (Date)</label>
            <input type="date" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca]"
              value={form.date} onChange={(e) => onChange("date", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">ប្រភេទ (Category)</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const c = catConfig[cat];
                const active = form.category === cat;
                return (
                  <button key={cat} onClick={() => onChange("category", cat)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 text-xs transition-all ${active ? "border-[#4da6ae] bg-[#e6f2f3]" : "border-gray-100 hover:border-gray-200"}`}>
                    <c.icon className={`w-4 h-4 ${active ? "text-[#055b65]" : c.color}`} />
                    <span className={active ? "text-[#044750] font-medium" : "text-gray-600"} style={{ fontFamily: "Noto Serif Khmer, sans-serif" }}>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">ការពិពណ៌នា</label>
            <input className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca]"
              placeholder="ជួសជុលបន្ទប់ទឹក..." value={form.description}
              onChange={(e) => onChange("description", e.target.value)} style={{ fontFamily: "Noto Serif Khmer, sans-serif" }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">ចំនួនទឹកប្រាក់ ($)</label>
              <input type="number" min={0} step="0.5"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca]"
                value={form.amount} onChange={(e) => onChange("amount", parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">បន្ទប់ (ស្រេចចិត្ត)</label>
              <select className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca] bg-white"
                value={form.roomId ?? ""} onChange={(e) => onChange("roomId", e.target.value)}>
                <option value="">— ទូទៅ —</option>
                {myRooms().map((r) => <option key={r.id} value={r.id}>Room {r.roomNumber}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="px-6 pb-5 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">បោះបង់</button>
          <button onClick={onSubmit} className="px-5 py-2 rounded-xl bg-[#055b65] text-white text-sm font-medium hover:bg-[#044750]">
            <span style={{ fontFamily: "Noto Serif Khmer, sans-serif" }}>រក្សាទុក</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function Expenses() {
  const { myExpenses, myInvoices, addExpense, deleteExpense, getRoomById, monthlyRevenue } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);

  const expenses = myExpenses();
  const invoices = myInvoices();

  const totalRevenue = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.total, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  const handleChange = (k: keyof FormData, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.description || form.amount <= 0) return;
    addExpense({ ...form, roomId: form.roomId || undefined });
    setShowModal(false);
    setForm(emptyForm);
  };

  // Expense breakdown by category
  const byCategory = CATEGORIES.map((cat) => ({
    cat,
    total: expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter((c) => c.total > 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-gray-900 text-lg">Expense Tracking</h1>
          <p className="text-sm text-gray-400" style={{ fontFamily: "Noto Serif Khmer, sans-serif" }}>
            គ្រប់គ្រងចំណាយ & ប្រាក់ចំណេញ
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#055b65] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#044750] transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> បន្ថែមចំណាយ
        </button>
      </div>

      {/* P&L Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "ចំណូលសរុប", labelEn: "Total Revenue", value: `$${totalRevenue.toFixed(0)}`, icon: TrendingUp, color: "bg-green-50 text-green-600", trend: "+" },
          { label: "ចំណាយសរុប", labelEn: "Total Expenses", value: `$${totalExpenses.toFixed(0)}`, icon: TrendingDown, color: "bg-red-50 text-red-600", trend: "-" },
          { label: "ប្រាក់ចំណេញ", labelEn: "Net Profit", value: `$${netProfit.toFixed(0)}`, icon: DollarSign, color: netProfit >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600", trend: netProfit >= 0 ? "↑" : "↓" },
          { label: "អត្រាចំណេញ", labelEn: "Profit Margin", value: `${profitMargin}%`, icon: Leaf, color: "bg-purple-50 text-purple-600", trend: "" },
        ].map((card) => (
          <div key={card.labelEn} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
              <card.icon style={{ width: 18, height: 18 }} />
            </div>
            <div className="text-xl font-bold text-gray-900">{card.value}</div>
            <div className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: "Noto Serif Khmer, sans-serif" }}>{card.label}</div>
            <div className="text-[11px] text-gray-400">{card.labelEn}</div>
          </div>
        ))}
      </div>

      {/* Revenue vs Expense chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-900 mb-1">Revenue vs Expenses</h2>
        <p className="text-xs text-gray-400 mb-4" style={{ fontFamily: "Noto Serif Khmer, sans-serif" }}>ចំណូល និង ចំណាយ ប្រចាំខែ</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis key="xaxis" dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis key="yaxis" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip key="tooltip" contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb" }}
              formatter={(v: number, name: string) => [`$${v}`, name === "revenue" ? "Revenue" : "Expenses"]} />
            <Legend key="legend" />
            <Bar key="bar-rev" dataKey="revenue" fill="#055b65" radius={[4, 4, 0, 0]} name="Revenue" />
            <Bar key="bar-exp" dataKey="expenses" fill="#8ecdd5" radius={[4, 4, 0, 0]} name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category breakdown + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Category pills */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">ប្រភេទចំណាយ</h3>
          {byCategory.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">គ្មានចំណាយ</p>
          ) : (
            <div className="space-y-3">
              {byCategory.map(({ cat, total }) => {
                const c = catConfig[cat];
                const pct = Math.round((total / totalExpenses) * 100);
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${c.bg}`}>
                          <c.icon className={`w-3.5 h-3.5 ${c.color}`} />
                        </div>
                        <span className="text-gray-700" style={{ fontFamily: "Noto Serif Khmer, sans-serif" }}>{c.label}</span>
                      </div>
                      <span className="font-semibold text-gray-900">${total}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full">
                      <div className="h-full bg-[#0a7a87] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Expense list */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">បញ្ជីចំណាយ</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {expenses.length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-sm">មិនទាន់មានការកត់ត្រាចំណាយ</div>
            ) : (
              expenses.sort((a, b) => b.date.localeCompare(a.date)).map((exp) => {
                const c = catConfig[exp.category];
                const room = exp.roomId ? getRoomById(exp.roomId) : null;
                return (
                  <div key={exp.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${c.bg}`}>
                      <c.icon className={`w-4 h-4 ${c.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate" style={{ fontFamily: "Noto Serif Khmer, sans-serif" }}>{exp.description}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {exp.date} {room ? `· Room ${room.roomNumber}` : ""}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-red-600 shrink-0">${exp.amount}</div>
                    <button onClick={() => deleteExpense(exp.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <ExpenseModal form={form} onChange={handleChange} onSubmit={handleSubmit} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
