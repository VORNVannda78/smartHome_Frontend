import { useAppStore } from "../store/appStore";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { DoorOpen, Users, TrendingUp, AlertCircle, ScrollText, TrendingDown } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Paid: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Overdue: "bg-red-100 text-red-700",
  };
  const labelKh: Record<string, string> = {
    Paid: "បានបង់", Pending: "រង់ចាំ", Overdue: "ចំណាំ",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {labelKh[status] ?? status}
    </span>
  );
}

export function Dashboard() {
  const { myRooms, myTenants, myInvoices, myExpenses, myLeases, getRoomById, getTenantById, monthlyRevenue } = useAppStore();

  const rooms = myRooms();
  const tenants = myTenants();
  const invoices = myInvoices();
  const expenses = myExpenses();
  const leases = myLeases();

  const totalRooms = rooms.length;
  const occupied = rooms.filter((r) => r.status === "Occupied").length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupied / totalRooms) * 100) : 0;
  const unpaidInvoices = invoices.filter((i) => i.status !== "Paid").length;
  const totalRevenue = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.total, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const expiringSoon = leases.filter((l) => {
    const days = Math.ceil((new Date(l.endDate).getTime() - Date.now()) / (1000 * 86400));
    return days >= 0 && days <= 45;
  }).length;

  const recentInvoices = [...invoices].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);

  const summaryCards = [
    { label: "បន្ទប់សរុប", value: totalRooms, icon: DoorOpen, color: "bg-blue-50 text-blue-600" },
    { label: "អ្នកជួលសរុប", value: tenants.length, icon: Users, color: "bg-[#e6f2f3] text-[#055b65]" },
    { label: "អត្រាបំពេញ", value: `${occupancyRate}%`, icon: TrendingUp, color: "bg-purple-50 text-purple-600" },
    { label: "វិក្កយបត្រមិនទាន់ទូទាត់", value: unpaidInvoices, icon: AlertCircle, color: "bg-red-50 text-red-600" },
    { label: "ចំណេញសុទ្ធ", value: `$${netProfit}`, icon: TrendingDown, color: "bg-emerald-50 text-emerald-600" },
    { label: "កិច្ចសន្យាផុតជិត", value: expiringSoon, icon: ScrollText, color: expiringSoon > 0 ? "bg-yellow-50 text-yellow-600" : "bg-gray-50 text-gray-400" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${card.color}`}>
              <card.icon style={{ width: 17, height: 17 }} />
            </div>
            <div className="text-xl font-bold text-gray-900">{card.value}</div>
            <div className="text-xs text-gray-500 mt-0.5 leading-snug">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Chart + Room status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">ចំណូលប្រចាំខែ</h2>
            <span className="text-xs bg-[#e6f2f3] text-[#055b65] px-3 py-1 rounded-full font-medium">២០២៤</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGradKh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#055b65" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#055b65" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis key="xaxis" dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis key="yaxis" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip key="tooltip" contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb" }}
                formatter={(v: number) => [`$${v}`, "ចំណូល"]} />
              <Area key="area-rev" type="monotone" dataKey="revenue" stroke="#055b65" strokeWidth={2.5}
                fill="url(#revGradKh)" dot={{ fill: "#055b65", strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">ស្ថានភាពបន្ទប់</h2>
          {[
            { label: "ជួលហើយ", count: rooms.filter(r => r.status === "Occupied").length, color: "bg-green-500" },
            { label: "នៅទំ", count: rooms.filter(r => r.status === "Available").length, color: "bg-blue-400" },
            { label: "កំពុងជួសជុល", count: rooms.filter(r => r.status === "Maintenance").length, color: "bg-orange-400" },
          ].map((s) => (
            <div key={s.label} className="mb-4">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-700 font-medium">{s.label}</span>
                <span className="text-gray-400">{s.count}/{totalRooms || 1}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${s.color}`} style={{ width: `${totalRooms > 0 ? (s.count / totalRooms) * 100 : 0}%` }} />
              </div>
            </div>
          ))}
          <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <div className="font-bold text-green-700">${totalRevenue}</div>
              <div className="text-gray-500">ចំណូល</div>
            </div>
            <div className="bg-red-50 rounded-lg p-2 text-center">
              <div className="font-bold text-red-600">${totalExpenses}</div>
              <div className="text-gray-500">ចំណាយ</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">វិក្កយបត្រថ្មីៗ</h2>
          <span className="text-xs text-gray-400">{invoices.length} សរុប</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">អ្នកជួល / បន្ទប់</th>
                <th className="px-5 py-3 text-left">ខែ</th>
                <th className="px-5 py-3 text-right">ចំនួន</th>
                <th className="px-5 py-3 text-center">ស្ថានភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentInvoices.map((inv) => {
                const tenant = getTenantById(inv.tenantId);
                const room = getRoomById(inv.roomId);
                return (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-gray-900">{tenant?.fullName ?? "—"}</div>
                      <div className="text-xs text-gray-400">បន្ទប់ {room?.roomNumber ?? "—"}</div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{inv.month}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-gray-900">${inv.total}</td>
                    <td className="px-5 py-3.5 text-center"><StatusBadge status={inv.status} /></td>
                  </tr>
                );
              })}
              {recentInvoices.length === 0 && (
                <tr><td colSpan={4} className="py-10 text-center text-gray-400 text-sm">មិនទាន់មានវិក្កយបត្រ</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
