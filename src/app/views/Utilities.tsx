import { useState, useRef } from "react";
import { useAppStore, Invoice } from "../store/appStore";
import { Zap, Droplets, FileText, Printer, CheckCircle, Clock, AlertCircle, X, QrCode, Send } from "lucide-react";

const WATER_UNIT = 4;
const ELEC_UNIT = 0.8;
const TRASH_FEE = 5;

type InvoiceForm = {
  tenantId: string;
  month: string;
  oldWater: number; newWater: number;
  oldElectric: number; newElectric: number;
};

const emptyForm: InvoiceForm = {
  tenantId: "", month: new Date().toISOString().slice(0, 7),
  oldWater: 0, newWater: 0, oldElectric: 0, newElectric: 0,
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; icon: React.ElementType; label: string }> = {
    Paid:    { cls: "bg-green-50 text-green-700",  icon: CheckCircle, label: "បានបង់" },
    Pending: { cls: "bg-yellow-50 text-yellow-700", icon: Clock,       label: "រង់ចាំ" },
    Overdue: { cls: "bg-red-50 text-red-700",       icon: AlertCircle, label: "ចំណាំ" },
  };
  const { cls, icon: Icon, label } = map[status] ?? { cls: "bg-gray-100 text-gray-600", icon: FileText, label: status };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>
      <Icon style={{ width: 11, height: 11 }} />{label}
    </span>
  );
}

function InvoicePreview({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const { getRoomById, getTenantById, updateInvoiceStatus, sendTelegramInvoice } = useAppStore();
  const tenant = getTenantById(invoice.tenantId);
  const room = getRoomById(invoice.roomId);
  const printRef = useRef<HTMLDivElement>(null);

  const [tgState, setTgState] = useState<"idle" | "sending" | "sent" | "no_link">("idle");

  const handleTelegram = () => {
    if (!tenant?.telegramLinked) { setTgState("no_link"); setTimeout(() => setTgState("idle"), 3000); return; }
    setTgState("sending");
    setTimeout(() => {
      const preview = `📋 វិក្កយបត្រ ${invoice.month} | ថ្លៃបន្ទប់: $${invoice.rent} | ទឹក: $${invoice.waterCost} | ភ្លើង: $${invoice.electricCost} | សរុប: $${invoice.total}`;
      sendTelegramInvoice(invoice.tenantId, invoice.id, preview);
      setTgState("sent");
      setTimeout(() => setTgState("idle"), 4000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600" /> វិក្កយបត្រ
          </h2>
          <div className="flex gap-2">
            {/* Telegram button */}
            <button
              onClick={handleTelegram}
              disabled={tgState === "sending"}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                tgState === "sent" ? "bg-blue-700 text-white" :
                tgState === "no_link" ? "bg-gray-400 text-white cursor-not-allowed" :
                tgState === "sending" ? "bg-[#2AABEE]/70 text-white" :
                "bg-[#2AABEE] text-white hover:bg-[#1d96d9]"
              }`}
              title={!tenant?.telegramLinked ? "អ្នកជួលមិនទាន់ភ្ជាប់ Telegram" : ""}
            >
              <Send className={`w-3.5 h-3.5 ${tgState === "sending" ? "animate-pulse" : ""}`} />
              {tgState === "sending" ? "កំពុងផ្ញើ..." : tgState === "sent" ? "បានផ្ញើ! ✓" : tgState === "no_link" ? "មិនទាន់ភ្ជាប់" : "Telegram"}
            </button>
            <button onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#055b65] text-white rounded-lg text-sm hover:bg-[#044750]">
              <Printer className="w-3.5 h-3.5" /> បោះពុម្ព
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
          </div>
        </div>

        <div ref={printRef} className="p-6 space-y-5">
          {tgState === "sent" && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700 flex items-center gap-2">
              <Send className="w-4 h-4 shrink-0" />
              <span>វិក្កយបត្រត្រូវបានផ្ញើទៅ Telegram <strong>{tenant?.fullName}</strong> ជោគជ័យ! 📨</span>
            </div>
          )}
          {tgState === "no_link" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm text-yellow-700 flex items-center gap-2">
              <Send className="w-4 h-4 shrink-0" />
              <span><strong>{tenant?.fullName}</strong> មិនទាន់ភ្ជាប់ Telegram — ទៅ <strong>Telegram Bot</strong> ដើម្បីផ្ញើ Link</span>
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-green-700 text-lg">RoomRent KH</span>
              </div>
              <p className="text-xs text-gray-400">ប្រព័ន្ធគ្រប់គ្រងផ្ទះជួល</p>
              <p className="text-xs text-gray-400">ភ្នំពេញ, កម្ពុជា</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900 text-lg">វិក្កយបត្រ</div>
              <div className="text-xs text-gray-500 mt-1">#{invoice.id.toUpperCase()}</div>
              <div className="text-xs text-gray-500">ខែ: {invoice.month}</div>
              <div className="text-xs text-gray-500">ចេញថ្ងៃ: {invoice.createdAt}</div>
            </div>
          </div>

          {/* Tenant */}
          <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-gray-400 mb-0.5">អ្នកជួល</div>
              <div className="font-semibold text-gray-900">{tenant?.fullName}</div>
              <div className="text-gray-500">{tenant?.phone}</div>
              <div className="text-gray-400 text-xs">{tenant?.email}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-0.5">ព័ត៌មានបន្ទប់</div>
              <div className="font-semibold text-gray-900">បន្ទប់ {room?.roomNumber}, ជាន់ {room?.floor}</div>
              <div className="text-gray-400 text-xs">ចូលជួល: {tenant?.moveInDate}</div>
            </div>
          </div>

          {/* Meters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-blue-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3 text-blue-600">
                <Droplets className="w-4 h-4" />
                <span className="text-sm font-semibold">ទឹក</span>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between"><span>ចាស់:</span><span>{invoice.oldWater} m³</span></div>
                <div className="flex justify-between"><span>ថ្មី:</span><span>{invoice.newWater} m³</span></div>
                <div className="flex justify-between font-semibold text-blue-700 border-t border-blue-100 pt-1 mt-1">
                  <span>{invoice.waterUsage} m³ × ${WATER_UNIT}</span>
                  <span>${invoice.waterCost}</span>
                </div>
              </div>
            </div>
            <div className="border border-yellow-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3 text-yellow-600">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-semibold">អគ្គីសនី</span>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between"><span>ចាស់:</span><span>{invoice.oldElectric} kWh</span></div>
                <div className="flex justify-between"><span>ថ្មី:</span><span>{invoice.newElectric} kWh</span></div>
                <div className="flex justify-between font-semibold text-yellow-700 border-t border-yellow-100 pt-1 mt-1">
                  <span>{invoice.electricUsage} kWh × ${ELEC_UNIT}</span>
                  <span>${invoice.electricCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Line items */}
          <table className="w-full text-sm border border-gray-100 rounded-xl overflow-hidden">
            <thead className="bg-gray-50">
              <tr className="text-xs text-gray-500 uppercase">
                <th className="px-4 py-2.5 text-left">ការពិពណ៌នា</th>
                <th className="px-4 py-2.5 text-right">ចំនួន</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr><td className="px-4 py-2.5 text-gray-700">ថ្លៃបន្ទប់</td><td className="px-4 py-2.5 text-right font-medium">${invoice.rent}</td></tr>
              <tr><td className="px-4 py-2.5 text-gray-700">ទឹក ({invoice.waterUsage} m³)</td><td className="px-4 py-2.5 text-right font-medium">${invoice.waterCost}</td></tr>
              <tr><td className="px-4 py-2.5 text-gray-700">អគ្គីសនី ({invoice.electricUsage} kWh)</td><td className="px-4 py-2.5 text-right font-medium">${invoice.electricCost.toFixed(2)}</td></tr>
              <tr><td className="px-4 py-2.5 text-gray-700">ប្រមូលសំរាម</td><td className="px-4 py-2.5 text-right font-medium">${invoice.trash}</td></tr>
              <tr className="bg-green-50">
                <td className="px-4 py-3 font-bold text-green-800">សរុប</td>
                <td className="px-4 py-3 text-right font-bold text-green-800 text-base">${invoice.total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          {/* KHQR */}
          <div className="border-2 border-dashed border-green-300 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-5 bg-green-50/50">
            <div className="w-28 h-28 bg-white border-2 border-green-200 rounded-xl flex flex-col items-center justify-center gap-1.5 shrink-0">
              <QrCode className="w-12 h-12 text-green-600" />
              <span className="text-[10px] font-bold text-green-700 tracking-wider">KHQR</span>
            </div>
            <div className="text-center sm:text-left">
              <div className="font-bold text-green-800 mb-1">ការទូទាត់តាម KHQR</div>
              <p className="text-xs text-green-700 leading-relaxed">
                ស្កែន QR Code ដោយ ABA, ACLEDA, Wing, Pi Pay ឬ App ដែលត្រូវគ្នា
              </p>
              <div className="mt-2 text-xs text-green-600 font-medium">
                ចំនួនទូទាត់: <span className="text-green-800 font-bold text-sm">${invoice.total.toFixed(2)}</span>
              </div>
              <div className="text-[10px] text-green-500 mt-0.5">គណនី: RoomRent KH — 012 345 678</div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">ស្ថានភាព:</span>
              <StatusBadge status={invoice.status} />
            </div>
            <div className="flex gap-2">
              {invoice.status !== "Paid" && (
                <button onClick={() => updateInvoiceStatus(invoice.id, "Paid")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#055b65] text-white rounded-lg text-xs font-medium hover:bg-[#044750]">
                  <CheckCircle className="w-3.5 h-3.5" /> កត់ "បានបង់"
                </button>
              )}
              {invoice.status !== "Overdue" && invoice.status !== "Paid" && (
                <button onClick={() => updateInvoiceStatus(invoice.id, "Overdue")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100">
                  <AlertCircle className="w-3.5 h-3.5" /> ចំណាំ
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Utilities() {
  const { myTenants, myInvoices, addInvoice, getTenantById, getRoomById } = useAppStore();
  const [form, setForm] = useState<InvoiceForm>(emptyForm);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [activeTab, setActiveTab] = useState<"create" | "list">("create");

  const selectedTenant = getTenantById(form.tenantId);
  const selectedRoom = selectedTenant ? getRoomById(selectedTenant.roomId) : null;

  const waterUsage = Math.max(0, form.newWater - form.oldWater);
  const waterCost = waterUsage * WATER_UNIT;
  const electricUsage = Math.max(0, form.newElectric - form.oldElectric);
  const electricCost = parseFloat((electricUsage * ELEC_UNIT).toFixed(2));
  const rent = selectedRoom?.monthlyRent ?? 0;
  const total = rent + waterCost + electricCost + TRASH_FEE;

  const handleGenerate = () => {
    if (!selectedTenant || !selectedRoom) return;
    addInvoice({
      tenantId: selectedTenant.id, roomId: selectedRoom.id, month: form.month,
      rent, waterUsage, waterCost, electricUsage, electricCost,
      trash: TRASH_FEE, total, status: "Pending",
      oldWater: form.oldWater, newWater: form.newWater,
      oldElectric: form.oldElectric, newElectric: form.newElectric,
    });
    setActiveTab("list");
    setForm(emptyForm);
  };

  const sortedInvoices = [...myInvoices()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="font-bold text-gray-900 text-lg">វិក្កយបត្រ & ការប្រើប្រាស់</h1>
        <p className="text-sm text-gray-400">ចេញ Invoice ប្រចាំខែ + KHQR ទូទាត់</p>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[{ id: "create", label: "ចេញវិក្កយបត្រ" }, { id: "list", label: "ប្រវត្តិ" }].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as "create" | "list")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "create" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-800">អានម៉ែត្រ</h2>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">ជ្រើសអ្នកជួល</label>
              <select className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca] bg-white"
                value={form.tenantId} onChange={(e) => setForm((f) => ({ ...f, tenantId: e.target.value }))}>
                <option value="">— ជ្រើសអ្នកជួល —</option>
                {myTenants().map((t) => {
                  const r = getRoomById(t.roomId);
                  return <option key={t.id} value={t.id}>{t.fullName} (បន្ទប់ {r?.roomNumber})</option>;
                })}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">ខែ</label>
              <input type="month" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca]"
                value={form.month} onChange={(e) => setForm((f) => ({ ...f, month: e.target.value }))} />
            </div>

            {/* Water */}
            <div className="bg-blue-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
                <Droplets className="w-4 h-4" /> ម៉ែត្រទឹក
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[{ label: "ចាស់ (m³)", key: "oldWater" }, { label: "ថ្មី (m³)", key: "newWater" }].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs text-blue-600 mb-1 block">{f.label}</label>
                    <input type="number" min={0}
                      className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                      value={form[f.key as keyof InvoiceForm] as number}
                      onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: parseFloat(e.target.value) || 0 }))} />
                  </div>
                ))}
              </div>
              <div className="text-xs text-blue-600">ប្រើ: {waterUsage} m³ × ${WATER_UNIT} = <strong>${waterCost}</strong></div>
            </div>

            {/* Electricity */}
            <div className="bg-yellow-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-yellow-700 font-semibold text-sm">
                <Zap className="w-4 h-4" /> ម៉ែត្រអគ្គីសនី
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[{ label: "ចាស់ (kWh)", key: "oldElectric" }, { label: "ថ្មី (kWh)", key: "newElectric" }].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs text-yellow-600 mb-1 block">{f.label}</label>
                    <input type="number" min={0}
                      className="w-full px-3 py-2 rounded-lg border border-yellow-200 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 bg-white"
                      value={form[f.key as keyof InvoiceForm] as number}
                      onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: parseFloat(e.target.value) || 0 }))} />
                  </div>
                ))}
              </div>
              <div className="text-xs text-yellow-600">ប្រើ: {electricUsage} kWh × ${ELEC_UNIT} = <strong>${electricCost}</strong></div>
            </div>

            <button onClick={handleGenerate} disabled={!selectedTenant}
              className="w-full py-3 bg-[#055b65] text-white rounded-xl font-medium hover:bg-[#044750] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" /> ចេញវិក្កយបត្រ
            </button>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-4">មើលជាមុន</h2>
            {selectedTenant && selectedRoom ? (
              <div className="space-y-3">
                {[
                  ["អ្នកជួល", selectedTenant.fullName],
                  ["បន្ទប់", `បន្ទប់ ${selectedRoom.roomNumber}`],
                  ["ថ្លៃបន្ទប់", `$${rent}`],
                  [`ទឹក (${waterUsage} m³)`, `$${waterCost}`],
                  [`អគ្គីសនី (${electricUsage} kWh)`, `$${electricCost}`],
                  ["ប្រមូលសំរាម", `$${TRASH_FEE}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm py-2 border-b border-gray-100">
                    <span className="text-gray-500">{k}</span>
                    <span className="font-medium">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between text-base py-3 bg-green-50 rounded-xl px-3">
                  <span className="font-bold text-green-800">សរុប</span>
                  <span className="font-bold text-green-800 text-xl">${total.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 mt-2">
                  <div className="w-14 h-14 bg-white border border-gray-200 rounded-lg flex items-center justify-center shrink-0">
                    <QrCode className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-700">KHQR</div>
                    <div className="text-[11px] text-gray-500">QR នឹងចេញក្នុង Invoice</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-gray-300">
                <FileText className="w-12 h-12 mb-3" />
                <p className="text-sm">ជ្រើសអ្នកជួលដើម្បីមើល</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "list" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-3 text-left">អ្នកជួល</th>
                  <th className="px-5 py-3 text-left">បន្ទប់</th>
                  <th className="px-5 py-3 text-left">ខែ</th>
                  <th className="px-5 py-3 text-right">សរុប</th>
                  <th className="px-5 py-3 text-center">ស្ថានភាព</th>
                  <th className="px-5 py-3 text-center">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sortedInvoices.map((inv) => {
                  const tenant = getTenantById(inv.tenantId);
                  const room = getRoomById(inv.roomId);
                  return (
                    <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-gray-900">{tenant?.fullName ?? "—"}</td>
                      <td className="px-5 py-3.5 text-gray-500">បន្ទប់ {room?.roomNumber ?? "—"}</td>
                      <td className="px-5 py-3.5 text-gray-500">{inv.month}</td>
                      <td className="px-5 py-3.5 text-right font-bold text-gray-900">${inv.total}</td>
                      <td className="px-5 py-3.5 text-center"><StatusBadge status={inv.status} /></td>
                      <td className="px-5 py-3.5 text-center">
                        <button onClick={() => setPreviewInvoice(inv)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e6f2f3] text-[#044750] rounded-lg text-xs font-medium hover:bg-[#cde8eb] mx-auto">
                          <FileText className="w-3.5 h-3.5" /> មើល
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {previewInvoice && <InvoicePreview invoice={previewInvoice} onClose={() => setPreviewInvoice(null)} />}
    </div>
  );
}
