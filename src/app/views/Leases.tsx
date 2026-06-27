import { useState, useRef } from "react";
import { useAppStore, Lease, LeaseStatus } from "../store/appStore";
import {
  Plus, Pencil, Trash2, X, FileText, AlertTriangle, CheckCircle,
  Clock, Calendar, Printer, RefreshCw, Paperclip, Upload, Image,
} from "lucide-react";

type FormData = Omit<Lease, "id" | "landlordId" | "status">;
const emptyForm: FormData = {
  tenantId: "", roomId: "", startDate: new Date().toISOString().slice(0, 10),
  endDate: "", monthlyRent: 0, depositPaid: 0, terms: "",
};

function calcStatus(endDate: string): LeaseStatus {
  const days = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 86400));
  if (days < 0) return "Expired";
  if (days <= 45) return "Expiring Soon";
  return "Active";
}

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 86400));
}

// Khmer date formatter
function formatKhmerDate(date?: Date) {
  const d = date ?? new Date();
  const khmerNums = ["០","១","២","៣","៤","៥","៦","៧","៨","៩"];
  const toKh = (n: number) => String(n).split("").map(c => khmerNums[+c]).join("");
  const khMonths = ["","មករា","កុម្ភៈ","មីនា","មេសា","ឧសភា","មិថុនា",
    "កក្កដា","សីហា","កញ្ញា","តុលា","វិច្ឆិកា","ធ្នូ"];
  return `ថ្ងៃទី${toKh(d.getDate())} ខែ${khMonths[d.getMonth()+1]} ឆ្នាំ${toKh(d.getFullYear())}`;
}

const statusConfig: Record<LeaseStatus, { cls: string; icon: React.ElementType; label: string }> = {
  Active:          { cls: "bg-[#e6f2f3] text-[#055b65]", icon: CheckCircle,   label: "Active" },
  "Expiring Soon": { cls: "bg-yellow-50 text-yellow-700", icon: AlertTriangle, label: "Expiring Soon" },
  Expired:         { cls: "bg-red-50 text-red-600",       icon: Clock,         label: "Expired" },
};

const khStyle: React.CSSProperties = { lineHeight: "1.9", wordBreak: "break-word" };

// ── Lease Form Modal ────────────────────────────────────────────────────────
function LeaseModal({ title, form, onChange, onSubmit, onClose, submitLabel }: {
  title: string; form: FormData;
  onChange: (k: keyof FormData, v: string | number) => void;
  onSubmit: () => void; onClose: () => void; submitLabel: string;
}) {
  const { myTenants, myRooms } = useAppStore();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">អ្នកជួល</label>
            <select className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca] bg-white"
              value={form.tenantId} onChange={(e) => onChange("tenantId", e.target.value)}>
              <option value="">— ជ្រើស —</option>
              {myTenants().map((t) => <option key={t.id} value={t.id}>{t.fullName}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">បន្ទប់</label>
            <select className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca] bg-white"
              value={form.roomId} onChange={(e) => onChange("roomId", e.target.value)}>
              <option value="">— ជ្រើស —</option>
              {myRooms().map((r) => <option key={r.id} value={r.id}>បន្ទប់ {r.roomNumber}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">ថ្ងៃចាប់ផ្ដើម</label>
            <input type="date" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca]"
              value={form.startDate} onChange={(e) => onChange("startDate", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">ថ្ងៃផុតកំណត់</label>
            <input type="date" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca]"
              value={form.endDate} onChange={(e) => onChange("endDate", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">ថ្លៃបន្ទប់/ខែ ($)</label>
            <input type="number" min={0} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca]"
              value={form.monthlyRent} onChange={(e) => onChange("monthlyRent", parseFloat(e.target.value) || 0)} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">ប្រាក់ Deposit ($)</label>
            <input type="number" min={0} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca]"
              value={form.depositPaid} onChange={(e) => onChange("depositPaid", parseFloat(e.target.value) || 0)} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-700 block mb-1.5">លក្ខន្តិកៈ / Terms</label>
            <textarea rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca] resize-none"
              style={khStyle} placeholder="លក្ខខណ្ឌនៃការជួល..."
              value={form.terms} onChange={(e) => onChange("terms", e.target.value)} />
          </div>
        </div>
        <div className="px-6 pb-5 flex gap-3 justify-end border-t border-gray-100 pt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">បោះបង់</button>
          <button onClick={onSubmit} className="px-5 py-2 rounded-xl bg-[#055b65] text-white text-sm font-medium hover:bg-[#044750]">{submitLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ── Renew Modal ─────────────────────────────────────────────────────────────
function RenewModal({ lease, onRenew, onClose }: {
  lease: Lease; onRenew: (newEnd: string) => void; onClose: () => void;
}) {
  const defaultEnd = new Date();
  defaultEnd.setFullYear(defaultEnd.getFullYear() + 1);
  const [newEnd, setNewEnd] = useState(defaultEnd.toISOString().slice(0, 10));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-[#055b65]" /> បន្តកិច្ចសន្យា
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-[#e6f2f3] rounded-xl p-3 text-sm text-[#055b65]" style={khStyle}>
            ថ្ងៃផុតកំណត់ចាស់: <strong>{lease.endDate}</strong>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">ថ្ងៃផុតកំណត់ថ្មី</label>
            <input type="date" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca]"
              value={newEnd} onChange={(e) => setNewEnd(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">បោះបង់</button>
            <button onClick={() => { onRenew(newEnd); onClose(); }}
              className="flex-1 py-2.5 rounded-xl bg-[#055b65] text-white text-sm font-medium hover:bg-[#044750] flex items-center justify-center gap-2">
              <RefreshCw className="w-3.5 h-3.5" /> បន្ត
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Print Lease Document ─────────────────────────────────────────────────────
function LeaseDocument({ lease, photoUrl, onClose }: {
  lease: Lease; photoUrl?: string; onClose: () => void;
}) {
  const { getTenantById, getRoomById } = useAppStore();
  const tenant = getTenantById(lease.tenantId);
  const room = getRoomById(lease.roomId);
  const printRef = useRef<HTMLDivElement>(null);
  const today = formatKhmerDate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-auto">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 print:hidden">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#055b65]" /> មើលជាមុន · Print
          </h2>
          <div className="flex gap-2">
            <button onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#055b65] text-white rounded-xl text-sm hover:bg-[#044750]">
              <Printer className="w-4 h-4" /> Print / PDF
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><X className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Document body */}
        <div ref={printRef} className="p-8 space-y-5">

          {/* ── Header with photo ── */}
          <div className="flex items-start justify-between border-b-2 border-[#055b65] pb-5">
            <div>
              <div className="text-xl font-black text-[#055b65] tracking-wide mb-0.5">RoomRentKH</div>
              <div className="text-lg font-bold text-gray-900 mb-0.5" style={khStyle}>កិច្ចសន្យាជួលផ្ទះ</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest">Room Lease Agreement</div>
            </div>
            {/* 4×6 photo — top-right like an official letter */}
            <div className="shrink-0">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="tenant photo"
                  className="w-20 h-24 object-cover border-2 border-gray-300 rounded"
                  style={{ aspectRatio: "4/6" }}
                />
              ) : (
                <div className="w-20 h-24 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center gap-1">
                  <Image className="w-6 h-6 text-gray-300" />
                  <span className="text-[9px] text-gray-300 text-center">រូបថត<br/>4×6</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Parties ── */}
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <div className="text-xs font-bold text-[#055b65] uppercase tracking-wider mb-2">ភាគី ក — ម្ចាស់ផ្ទះ</div>
              <div className="font-semibold text-gray-900" style={khStyle}>RoomRentKH Administration</div>
              <div className="text-gray-500 text-xs">ភ្នំពេញ, កម្ពុជា</div>
            </div>
            <div>
              <div className="text-xs font-bold text-[#055b65] uppercase tracking-wider mb-2">ភាគី ខ — អ្នកជួល</div>
              <div className="font-semibold text-gray-900" style={khStyle}>{tenant?.fullName}</div>
              <div className="text-gray-500 text-xs">{tenant?.phone} · {tenant?.nationalId}</div>
              <div className="text-gray-400 text-xs">{tenant?.email}</div>
            </div>
          </div>

          {/* ── Terms table ── */}
          <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
            <tbody>
              {[
                ["បន្ទប់", `លេខ ${room?.roomNumber} — ជាន់ ${room?.floor}`],
                ["ថ្លៃជួល", `$${lease.monthlyRent} / ខែ`],
                ["ប្រាក់ Deposit", `$${lease.depositPaid}`],
                ["ថ្ងៃចូលជួល", lease.startDate],
                ["ថ្ងៃផុតកំណត់", lease.endDate],
              ].map(([k, v]) => (
                <tr key={k} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-2.5 bg-gray-50 font-medium text-gray-600 w-40" style={khStyle}>{k}</td>
                  <td className="px-4 py-2.5 text-gray-900 font-semibold" style={khStyle}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── Terms text ── */}
          {lease.terms && (
            <div>
              <div className="text-xs font-bold text-[#055b65] uppercase tracking-wider mb-2">
                លក្ខខណ្ឌ (Terms & Conditions)
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700" style={khStyle}>{lease.terms}</div>
            </div>
          )}

          {/* ── Signatures + Khmer date ── */}
          <div className="pt-5 border-t border-gray-200 space-y-4">
            {/* Khmer date — auto-filled, right-aligned */}
            <div className="text-right text-sm text-gray-700" style={khStyle}>
              ធ្វើនៅរាជធានីភ្នំពេញ, {today}
            </div>

            {/* Two-column signature blocks */}
            <div className="grid grid-cols-2 gap-8 pt-2">
              {/* Landlord */}
              <div className="text-center">
                <div className="text-xs font-bold text-[#055b65] uppercase tracking-wider mb-4">
                  ភាគី ក (ម្ចាស់ផ្ទះ)
                </div>
                {/* Thumbprint circle */}
                <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-[9px] text-gray-300 text-center leading-tight">ស្នាម<br/>មេដៃ</span>
                </div>
                <div className="h-10 border-b border-gray-300 mb-2 mx-4" />
                <div className="text-xs text-gray-500" style={khStyle}>ហត្ថលេខា & ឈ្មោះ</div>
                <div className="text-xs text-gray-400 mt-0.5">ថ្ងៃ____/____/________</div>
              </div>

              {/* Tenant */}
              <div className="text-center">
                <div className="text-xs font-bold text-[#055b65] uppercase tracking-wider mb-4">
                  ភាគី ខ (អ្នកជួល)
                </div>
                {/* Thumbprint circle */}
                <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-[9px] text-gray-300 text-center leading-tight">ស្នាម<br/>មេដៃ</span>
                </div>
                <div className="h-10 border-b border-gray-300 mb-2 mx-4" />
                <div className="text-xs text-gray-500" style={khStyle}>ហត្ថលេខា & ឈ្មោះ</div>
                <div className="text-xs text-gray-400 mt-0.5">ថ្ងៃ____/____/________</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Leases View ──────────────────────────────────────────────────────
export function Leases() {
  const { myLeases, addLease, updateLease, deleteLease, getTenantById, getRoomById } = useAppStore();
  const [showModal, setShowModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [renewLease, setRenewLease] = useState<Lease | null>(null);
  const [printLease, setPrintLease] = useState<Lease | null>(null);

  // Per-lease: array of { name, url, isPhoto }
  const [attachments, setAttachments] = useState<Record<string, { name: string; url: string; isPhoto: boolean }[]>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const [attachTarget, setAttachTarget] = useState<string | null>(null);
  const [attachType, setAttachType] = useState<"photo" | "doc">("doc");

  const leases = myLeases().map((l) => ({ ...l, status: calcStatus(l.endDate) as LeaseStatus }));
  const expiringSoon = leases.filter((l) => l.status === "Expiring Soon");
  const expired = leases.filter((l) => l.status === "Expired");
  const filtered = filter === "All" ? leases : leases.filter((l) => l.status === filter);

  const handleChange = (k: keyof FormData, v: string | number) => setForm((f) => ({ ...f, [k]: v }));
  const openAdd = () => { setForm(emptyForm); setShowModal("add"); };
  const openEdit = (lease: Lease) => {
    setForm({ tenantId: lease.tenantId, roomId: lease.roomId, startDate: lease.startDate,
      endDate: lease.endDate, monthlyRent: lease.monthlyRent, depositPaid: lease.depositPaid, terms: lease.terms });
    setEditId(lease.id); setShowModal("edit");
  };
  const handleAdd = () => {
    if (!form.tenantId || !form.endDate) return;
    addLease({ ...form, status: calcStatus(form.endDate) });
    setShowModal(null);
  };
  const handleEdit = () => {
    if (!editId) return;
    updateLease({ id: editId, landlordId: "", ...form, status: calcStatus(form.endDate) });
    setShowModal(null); setEditId(null);
  };
  const handleRenew = (leaseId: string, newEndDate: string) => {
    const lease = leases.find((l) => l.id === leaseId);
    if (!lease) return;
    updateLease({ ...lease, endDate: newEndDate, status: calcStatus(newEndDate) });
  };

  const triggerAttach = (leaseId: string, type: "photo" | "doc") => {
    setAttachTarget(leaseId);
    setAttachType(type);
    (type === "photo" ? photoRef : fileRef).current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isPhoto: boolean) => {
    if (!attachTarget || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setAttachments((prev) => ({
      ...prev,
      [attachTarget]: [...(prev[attachTarget] ?? []), { name: file.name, url, isPhoto }],
    }));
    setAttachTarget(null);
    e.target.value = "";
  };

  // Get 4×6 portrait photo for a lease
  const getPhoto = (leaseId: string) =>
    (attachments[leaseId] ?? []).find((a) => a.isPhoto)?.url;

  return (
    <div className="p-6 space-y-6">
      {/* Hidden inputs */}
      <input ref={photoRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => handleFileChange(e, true)} />
      <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden"
        onChange={(e) => handleFileChange(e, false)} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-gray-900 text-lg">កិច្ចសន្យាជួល</h1>
          <p className="text-sm text-gray-400">តាមដានថ្ងៃផុតកំណត់ · បន្ត · Print PDF</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-[#055b65] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#044750] shadow-sm">
          <Plus className="w-4 h-4" /> បន្ថែមកិច្ចសន្យា
        </button>
      </div>

      {/* Alerts */}
      {expiringSoon.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <div style={khStyle}>
            <div className="font-semibold text-yellow-800 text-sm">⚠️ កិច្ចសន្យា {expiringSoon.length} ផុតក្នុងពេលឆាប់ៗ!</div>
            <div className="text-xs text-yellow-700 mt-0.5">
              {expiringSoon.map((l) => getTenantById(l.tenantId)?.fullName).join(", ")} — ត្រូវការបន្ត
            </div>
          </div>
        </div>
      )}
      {expired.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div style={khStyle}>
            <div className="font-semibold text-red-700 text-sm">កិច្ចសន្យា {expired.length} ផុតកំណត់ហើយ</div>
            <div className="text-xs text-red-600 mt-0.5">{expired.map((l) => getTenantById(l.tenantId)?.fullName).join(", ")}</div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {["All", "Active", "Expiring Soon", "Expired"].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filter === s ? "bg-[#055b65] text-white border-[#055b65]" : "border-gray-200 text-gray-600 hover:border-[#9dd0d5] hover:text-[#055b65]"
            }`}>
            {s}
          </button>
        ))}
      </div>

      {/* Lease cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((lease) => {
          const tenant = getTenantById(lease.tenantId);
          const room = getRoomById(lease.roomId);
          const sc = statusConfig[lease.status];
          const days = daysUntil(lease.endDate);
          const leaseAttach = attachments[lease.id] ?? [];
          const photo = getPhoto(lease.id);
          const docs = leaseAttach.filter((a) => !a.isPhoto);

          return (
            <div key={lease.id} className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow p-5 ${
              lease.status === "Expiring Soon" ? "border-yellow-200" :
              lease.status === "Expired" ? "border-red-100" : "border-gray-100"
            }`}>
              {/* Header — with 4×6 thumbnail */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Photo thumbnail next to name */}
                  {photo ? (
                    <img src={photo} alt="tenant" className="w-12 h-16 object-cover rounded-lg border border-gray-200 shrink-0" style={{ aspectRatio: "4/6" }} />
                  ) : (
                    <div className="w-12 h-16 bg-[#e6f2f3] rounded-lg border border-[#cde8eb] flex items-center justify-center shrink-0 text-[#055b65] font-bold text-lg">
                      {tenant?.fullName?.charAt(0) ?? "?"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 text-sm truncate" style={khStyle}>
                      {tenant?.fullName ?? "—"}
                    </div>
                    <div className="text-xs text-gray-400">បន្ទប់ {room?.roomNumber ?? "—"} · {tenant?.phone}</div>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ml-2 ${sc.cls}`}>
                  <sc.icon style={{ width: 11, height: 11 }} />{sc.label}
                </span>
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500 mb-3" style={khStyle}>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />ចាប់: {lease.startDate}
                </div>
                <div className={`flex items-center gap-1.5 font-medium ${
                  lease.status === "Expired" ? "text-red-500" :
                  lease.status === "Expiring Soon" ? "text-yellow-600" : "text-gray-500"
                }`}>
                  <Calendar className="w-3 h-3" />ផុត: {lease.endDate}
                </div>
                <div>ថ្លៃ: <span className="font-semibold text-gray-700">${lease.monthlyRent}/ខែ</span></div>
                <div>Deposit: <span className="font-semibold text-gray-700">${lease.depositPaid}</span></div>
              </div>

              {/* Countdown */}
              {days <= 45 && (
                <div className={`text-xs font-medium px-3 py-1.5 rounded-lg mb-3 ${days < 0 ? "bg-red-50 text-red-600" : "bg-yellow-50 text-yellow-700"}`} style={khStyle}>
                  {days < 0 ? `ផុតកំណត់ ${Math.abs(days)} ថ្ងៃ` : `ផុតក្នុង ${days} ថ្ងៃ — ត្រូវបន្ត!`}
                </div>
              )}

              {/* Terms */}
              {lease.terms && (
                <p className="text-xs text-gray-400 mb-3 line-clamp-2" style={khStyle}>{lease.terms}</p>
              )}

              {/* Document attachments (non-photo) */}
              {docs.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {docs.map((d, i) => (
                    <a key={i} href={d.url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full hover:bg-gray-200">
                      <Paperclip className="w-3 h-3" />{d.name}
                    </a>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-1.5 pt-2 border-t border-gray-100 flex-wrap">
                <button onClick={() => setRenewLease(lease)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#e6f2f3] text-[#055b65] hover:bg-[#cde8eb] transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" /> បន្ត
                </button>
                <button onClick={() => setPrintLease(lease)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                {/* Upload 4×6 photo */}
                <button onClick={() => triggerAttach(lease.id, "photo")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    photo ? "bg-[#e6f2f3] text-[#055b65] hover:bg-[#cde8eb]" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                  <Image className="w-3.5 h-3.5" /> {photo ? "ប្ដូររូប" : "រូបថត 4×6"}
                </button>
                {/* Attach doc */}
                <button onClick={() => triggerAttach(lease.id, "doc")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  <Paperclip className="w-3.5 h-3.5" /> ភ្ជាប់ {docs.length > 0 && `(${docs.length})`}
                </button>
                {/* Edit/Delete */}
                <button onClick={() => openEdit(lease)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-blue-600 hover:bg-blue-50 transition-colors ml-auto">
                  <Pencil className="w-3.5 h-3.5" /> កែ
                </button>
                <button onClick={() => setConfirmDelete(lease.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> លុប
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="lg:col-span-2 py-16 text-center text-gray-300">
            <FileText className="w-12 h-12 mx-auto mb-3" />
            <p className="text-sm">មិនទាន់មានកិច្ចសន្យា</p>
          </div>
        )}
      </div>

      {showModal === "add" && <LeaseModal title="បន្ថែមកិច្ចសន្យា" form={form} onChange={handleChange} onSubmit={handleAdd} onClose={() => setShowModal(null)} submitLabel="បន្ថែម" />}
      {showModal === "edit" && <LeaseModal title="កែកិច្ចសន្យា" form={form} onChange={handleChange} onSubmit={handleEdit} onClose={() => setShowModal(null)} submitLabel="រក្សាទុក" />}
      {renewLease && <RenewModal lease={renewLease} onRenew={(d) => handleRenew(renewLease.id, d)} onClose={() => setRenewLease(null)} />}
      {printLease && <LeaseDocument lease={printLease} photoUrl={getPhoto(printLease.id)} onClose={() => setPrintLease(null)} />}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">លុបកិច្ចសន្យា?</h3>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-600">បោះបង់</button>
              <button onClick={() => { deleteLease(confirmDelete); setConfirmDelete(null); }} className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-medium">លុប</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
