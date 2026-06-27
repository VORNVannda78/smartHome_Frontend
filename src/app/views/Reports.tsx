import { useState } from "react";
import { useAppStore } from "../store/appStore";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Download, FileText, TrendingUp, TrendingDown, DollarSign, Users } from "lucide-react";

// Teal monochromatic palette: dark → light
const PIE_COLORS = ["#055b65", "#0a7a87", "#0f9aad", "#5ab8c4", "#8ecdd5", "#bde3e8", "#d9f0f3"];

// Simple CSV export helper
function downloadCSV(rows: string[][], filename: string) {
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export function Reports() {
  const { myInvoices, myExpenses, myTenants, myRooms, getTenantById, getRoomById, monthlyRevenue } = useAppStore();
  const [period, setPeriod] = useState<"month" | "year">("month");

  const invoices = myInvoices();
  const expenses = myExpenses();
  const tenants = myTenants();
  const rooms = myRooms();

  const paidInvoices = invoices.filter((i) => i.status === "Paid");
  const totalRevenue = paidInvoices.reduce((s, i) => s + i.total, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : "0";
  const unpaid = invoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.total, 0);

  // Revenue by room
  const revenueByRoom = rooms.map((room) => {
    const rev = invoices.filter((i) => i.roomId === room.id && i.status === "Paid").reduce((s, i) => s + i.total, 0);
    return { name: `បន្ទប់ ${room.roomNumber}`, value: rev };
  }).filter((r) => r.value > 0);

  // Expense by category
  const expByCat = ["Repair", "Utilities", "Tax", "Cleaning", "Other"].map((cat) => ({
    name: { Repair: "ជួសជុល", Utilities: "ប្រើប្រាស់", Tax: "ពន្ធ", Cleaning: "សម្អាត", Other: "ផ្សេង" }[cat] ?? cat,
    value: expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter((c) => c.value > 0);

  // Export invoices CSV
  const exportInvoicesCSV = () => {
    const headers = ["Invoice ID", "អ្នកជួល", "បន្ទប់", "ខែ", "ថ្លៃបន្ទប់", "ទឹក", "អគ្គីសនី", "សំរាម", "សរុប", "ស្ថានភាព"];
    const rows = invoices.map((inv) => {
      const t = getTenantById(inv.tenantId);
      const r = getRoomById(inv.roomId);
      return [inv.id, t?.fullName ?? "", `បន្ទប់ ${r?.roomNumber ?? ""}`, inv.month,
        inv.rent, inv.waterCost, inv.electricCost.toFixed(2), inv.trash, inv.total.toFixed(2), inv.status];
    });
    downloadCSV([headers, ...rows.map((r) => r.map(String))], "invoices-roomrent.csv");
  };

  // Export expenses CSV
  const exportExpensesCSV = () => {
    const headers = ["ID", "ថ្ងៃ", "ប្រភេទ", "ការពិពណ៌នា", "ចំនួន ($)"];
    const rows = expenses.map((e) => [e.id, e.date, e.category, e.description, e.amount]);
    downloadCSV([headers, ...rows.map((r) => r.map(String))], "expenses-roomrent.csv");
  };

  const summaryKpis = [
    { label: "ចំណូលបានទូទាត់", value: `$${totalRevenue.toFixed(0)}`, icon: TrendingUp, color: "text-green-600 bg-green-50" },
    { label: "ចំណាយសរុប", value: `$${totalExpenses.toFixed(0)}`, icon: TrendingDown, color: "text-red-500 bg-red-50" },
    { label: "ចំណេញសុទ្ធ", value: `$${netProfit.toFixed(0)}`, icon: DollarSign, color: netProfit >= 0 ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50" },
    { label: "មិនទាន់ទូទាត់", value: `$${unpaid.toFixed(0)}`, icon: FileText, color: "text-orange-500 bg-orange-50" },
    { label: "អ្នកជួលសរុប", value: tenants.length, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "អត្រាចំណេញ", value: `${profitMargin}%`, icon: TrendingUp, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-gray-900 text-lg">របាយការណ៍ & វិភាគ</h1>
          <p className="text-sm text-gray-400">ទិន្នន័យអាជីវកម្ម ការបូកសរុប និង Export</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportInvoicesCSV}
            className="flex items-center gap-2 bg-[#055b65] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#044750] transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export វិក្កយបត្រ (CSV)
          </button>
          <button onClick={exportExpensesCSV}
            className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export ចំណាយ (CSV)
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {summaryKpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${kpi.color}`}>
              <kpi.icon style={{ width: 17, height: 17 }} />
            </div>
            <div className="text-xl font-bold text-gray-900">{kpi.value}</div>
            <div className="text-xs text-gray-500 mt-0.5 leading-snug">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Monthly chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">ចំណូល-ចំណាយ ប្រចាំខែ</h2>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {[{ id: "month", label: "ខែ" }, { id: "year", label: "ឆ្នាំ" }].map((p) => (
              <button key={p.id} onClick={() => setPeriod(p.id as "month" | "year")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${period === p.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis key="xaxis" dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis key="yaxis" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip key="tooltip" contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb" }}
              formatter={(v: number, name: string) => [`$${v}`, name === "revenue" ? "ចំណូល" : "ចំណាយ"]} />
            <Legend key="legend" formatter={(v) => v === "revenue" ? "ចំណូល" : "ចំណាយ"} />
            <Bar key="bar-rev" dataKey="revenue" fill="#055b65" radius={[4, 4, 0, 0]} name="revenue" />
            <Bar key="bar-exp" dataKey="expenses" fill="#8ecdd5" radius={[4, 4, 0, 0]} name="expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Revenue by room */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">ចំណូលតាមបន្ទប់</h3>
          {revenueByRoom.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie key="pie-room" data={revenueByRoom} cx="50%" cy="50%" outerRadius={75} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}>
                  {revenueByRoom.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`$${v}`, "ចំណូល"]} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex items-center justify-center text-gray-300 text-sm">មិនទាន់មានទិន្នន័យ</div>
          )}
        </div>

        {/* Expenses by category */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">ចំណាយតាមប្រភេទ</h3>
          {expByCat.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie key="pie-exp" data={expByCat} cx="50%" cy="50%" outerRadius={75} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}>
                  {expByCat.map((_, idx) => (
                    <Cell key={`cell-e-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`$${v}`, "ចំណាយ"]} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex items-center justify-center text-gray-300 text-sm">មិនទាន់មានទិន្នន័យ</div>
          )}
        </div>
      </div>

      {/* Invoice detail table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">វិក្កយបត្រទាំងអស់</h3>
          <button onClick={exportInvoicesCSV}
            className="flex items-center gap-1.5 text-xs text-[#055b65] hover:text-[#044750] font-medium">
            <Download className="w-3.5 h-3.5" /> ទាញ CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3 text-left">អ្នកជួល</th>
                <th className="px-4 py-3 text-left">បន្ទប់</th>
                <th className="px-4 py-3 text-left">ខែ</th>
                <th className="px-4 py-3 text-right">ថ្លៃ</th>
                <th className="px-4 py-3 text-right">ទឹក</th>
                <th className="px-4 py-3 text-right">អគ្គីសនី</th>
                <th className="px-4 py-3 text-right">សរុប</th>
                <th className="px-4 py-3 text-center">ស្ថានភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.slice(0, 10).map((inv) => {
                const t = getTenantById(inv.tenantId);
                const r = getRoomById(inv.roomId);
                const statusMap: Record<string, string> = { Paid: "bg-green-100 text-green-700", Pending: "bg-yellow-100 text-yellow-700", Overdue: "bg-red-100 text-red-600" };
                const labelMap: Record<string, string> = { Paid: "បានបង់", Pending: "រង់ចាំ", Overdue: "ចំណាំ" };
                return (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{t?.fullName ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{r?.roomNumber ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{inv.month}</td>
                    <td className="px-4 py-3 text-right text-gray-700">${inv.rent}</td>
                    <td className="px-4 py-3 text-right text-gray-700">${inv.waterCost}</td>
                    <td className="px-4 py-3 text-right text-gray-700">${inv.electricCost.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">${inv.total}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusMap[inv.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {labelMap[inv.status] ?? inv.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {invoices.length === 0 && (
                <tr><td colSpan={8} className="py-10 text-center text-gray-400 text-sm">មិនទាន់មានទិន្នន័យ</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
