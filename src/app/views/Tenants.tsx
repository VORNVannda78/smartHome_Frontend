import { useState, useRef } from "react";
import { useAppStore, Tenant } from "../store/appStore";
import {
  Plus, Pencil, Trash2, X, User, Phone, Calendar, CreditCard,
  Home, Mail, IdCard, Send, CheckCircle, Camera, Sparkles,
  Upload, FileSpreadsheet, AlertCircle,
} from "lucide-react";

type FormData = Omit<Tenant, "id" | "landlordId">;

const emptyForm: FormData = {
  fullName: "", phone: "", roomId: "", deposit: 0,
  moveInDate: new Date().toISOString().slice(0, 10),
  email: "", nationalId: "",
};

// ── OCR Simulation Data ─────────────────────────────────────────────────────
const OCR_SAMPLES = [
  { fullName: "ហេង ចន្ថា", nationalId: "KH-0923456", phone: "078 234 567" },
  { fullName: "ស្រីណា ភា", nationalId: "KH-0834512", phone: "096 456 789" },
  { fullName: "ដារ៉ា ប៊ុនថុន", nationalId: "KH-0712345", phone: "012 567 890" },
];

// ── Excel Import Simulation ─────────────────────────────────────────────────
const EXCEL_SAMPLE = [
  { fullName: "ណារ៉ា ចំរើន",   phone: "085 111 222", deposit: 400, nationalId: "KH-0011", email: "nara@gmail.com" },
  { fullName: "ស្រីលក្ខណ៍ ក",  phone: "096 333 444", deposit: 360, nationalId: "KH-0022", email: "srey@gmail.com" },
  { fullName: "វង្ស ពិទូ",      phone: "077 555 666", deposit: 440, nationalId: "KH-0033", email: "vong@gmail.com" },
];

interface RoomOption { id: string; roomNumber: string; status?: string; isCurrent?: boolean; }
interface ModalProps {
  title: string; form: FormData;
  onChange: (k: keyof FormData, v: string | number) => void;
  onSubmit: () => void; onClose: () => void; submitLabel: string;
  availableRooms: RoomOption[];
  isEdit?: boolean;
}

function TenantModal({ title, form, onChange, onSubmit, onClose, submitLabel, availableRooms, isEdit }: ModalProps) {
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrDone, setOcrDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const simulateOCR = () => {
    setOcrLoading(true);
    setOcrDone(false);
    setTimeout(() => {
      const sample = OCR_SAMPLES[Math.floor(Math.random() * OCR_SAMPLES.length)];
      onChange("fullName", sample.fullName);
      onChange("nationalId", sample.nationalId);
      onChange("phone", sample.phone);
      setOcrLoading(false);
      setOcrDone(true);
    }, 1800);
  };

  const fields: { key: keyof FormData; label: string; type?: string; icon: React.ElementType; placeholder?: string }[] = [
    { key: "fullName",   label: "ឈ្មោះពេញ",      icon: User,     placeholder: "ហេង ចន្ថា" },
    { key: "email",      label: "អ៊ីម៉ែល",         icon: Mail,     type: "email", placeholder: "tenant@email.com" },
    { key: "phone",      label: "ទូរស័ព្ទ",         icon: Phone,    placeholder: "012 345 678" },
    { key: "nationalId", label: "អត្តសញ្ញាណប័ណ្ណ", icon: IdCard,   placeholder: "KH-001234" },
    { key: "deposit",    label: "ប្រាក់ Deposit ($)", icon: CreditCard, type: "number", placeholder: "400" },
    { key: "moveInDate", label: "ថ្ងៃចូលជួល",      icon: Calendar, type: "date" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900">{title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Admin — អាចកែបាន​គ្រប់ Field</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
        </div>

        {/* OCR scan bar */}
        <div className="mx-6 mt-4 mb-1">
          <div className="bg-[#e6f2f3] border border-[#cde8eb] rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#cde8eb] rounded-xl flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5 text-[#055b65]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[#033b42]">ស្កេន អត្តសញ្ញាណប័ណ្ណ (AI OCR)</div>
              <div className="text-xs text-[#4da6ae]">ថតរូប → ប្រព័ន្ធ AI ទាញ ឈ្មោះ / ID ស្វ័យប្រវត្តិ</div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={simulateOCR} />
            <button
              onClick={() => { if (!ocrLoading) { fileRef.current?.click(); simulateOCR(); } }}
              disabled={ocrLoading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                ocrDone ? "bg-green-500 text-white" :
                ocrLoading ? "bg-[#5bb8bf] text-white" : "bg-[#055b65] text-white hover:bg-[#044750]"
              }`}
            >
              {ocrLoading ? (
                <><Sparkles className="w-3.5 h-3.5 animate-pulse" /> កំពុងអាន...</>
              ) : ocrDone ? (
                <><CheckCircle className="w-3.5 h-3.5" /> បានទាញ!</>
              ) : (
                <><Camera className="w-3.5 h-3.5" /> ស្កេន</>
              )}
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.key} className={f.key === "fullName" ? "sm:col-span-2" : ""}>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                <f.icon style={{ width: 14, height: 14 }} className="text-gray-400" />
                {f.label}
              </label>
              <input
                type={f.type ?? "text"}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca]"
                value={form[f.key] as string}
                placeholder={f.placeholder}
                onChange={(e) => onChange(f.key, f.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)}
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <Home style={{ width: 14, height: 14 }} className="text-gray-400" />
              បន្ទប់ (Assigned Room)
              {!isEdit && (
                <span className="ml-auto text-xs text-[#055b65] bg-[#e6f2f3] px-2 py-0.5 rounded-full">
                  ✓ បង្ហាញតែបន្ទប់ទំ
                </span>
              )}
            </label>
            <select
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca] bg-white"
              value={form.roomId} onChange={(e) => onChange("roomId", e.target.value)}>
              <option value="">— ជ្រើសបន្ទប់ —</option>
              {availableRooms.map((r) => (
                <option
                  key={r.id}
                  value={r.id}
                  disabled={isEdit && r.status === "Occupied" && !r.isCurrent}
                >
                  {r.isCurrent ? `✓ បន្ទប់ ${r.roomNumber} (បច្ចុប្បន្ន)` :
                   r.status === "Occupied" ? `🔒 បន្ទប់ ${r.roomNumber} — ជួលហើយ` :
                   r.status === "Maintenance" ? `🔧 បន្ទប់ ${r.roomNumber} — ជួសជុល` :
                   `✓ បន្ទប់ ${r.roomNumber} — ទំ`}
                </option>
              ))}
            </select>
            {availableRooms.length === 0 && !isEdit && (
              <p className="text-xs text-orange-600 mt-1.5 flex items-center gap-1">
                <span>⚠️</span> គ្មានបន្ទប់ទំ — ត្រូវប្ដូរស្ថានភាពបន្ទប់ជាមុន
              </p>
            )}
          </div>
        </div>
        <div className="px-6 pb-5 flex gap-3 justify-end border-t border-gray-100 pt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">បោះបង់</button>
          <button onClick={onSubmit} className="px-5 py-2 rounded-xl bg-[#055b65] text-white text-sm font-medium hover:bg-[#044750] transition-colors">
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Excel Import Modal ─────────────────────────────────────────────────────
function ExcelImportModal({ onClose, onImport }: { onClose: () => void; onImport: (rows: typeof EXCEL_SAMPLE) => void }) {
  const [step, setStep] = useState<"upload" | "preview" | "done">("upload");
  const [loading, setLoading] = useState(false);

  const handleFileSimulate = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("preview"); }, 1200);
  };

  const handleImport = () => {
    setLoading(true);
    setTimeout(() => { onImport(EXCEL_SAMPLE); setStep("done"); setLoading(false); }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-green-600" /> Import ពី Excel / CSV
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6">
          {step === "upload" && (
            <div className="space-y-4">
              {/* Template download */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
                <div className="font-semibold mb-1">Format ដែលត្រូវការ (CSV/Excel)</div>
                <code className="text-xs bg-white rounded px-2 py-1 block font-mono text-gray-700">
                  fullName, phone, email, nationalId, deposit, moveInDate
                </code>
              </div>
              <div
                onClick={handleFileSimulate}
                className="border-2 border-dashed border-[#9dd0d5] rounded-2xl p-10 text-center cursor-pointer hover:bg-[#e6f2f3] transition-colors"
              >
                {loading ? (
                  <div className="flex flex-col items-center gap-2 text-[#055b65]">
                    <Upload className="w-10 h-10 animate-bounce" />
                    <div className="font-medium">កំពុងអាន File...</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <FileSpreadsheet className="w-10 h-10 text-green-500" />
                    <div className="font-medium text-gray-700">ចុចដើម្បីជ្រើស File</div>
                    <div className="text-xs">.xlsx, .csv (Max 10MB)</div>
                    <div className="text-xs text-[#4da6ae] mt-1">📌 Simulation — ប្រើ Sample Data</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === "preview" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                <CheckCircle className="w-4 h-4" /> អានបានហើយ — {EXCEL_SAMPLE.length} rows
              </div>
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      {["ឈ្មោះ", "ទូរស័ព្ទ", "Deposit", "ID"].map((h) => (
                        <th key={h} className="px-3 py-2 text-left text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {EXCEL_SAMPLE.map((row, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 font-medium text-gray-800">{row.fullName}</td>
                        <td className="px-3 py-2 text-gray-500">{row.phone}</td>
                        <td className="px-3 py-2 text-gray-500">${row.deposit}</td>
                        <td className="px-3 py-2 text-gray-400">{row.nationalId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-start gap-2 text-xs text-yellow-600 bg-yellow-50 rounded-lg p-3 border border-yellow-100">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> បន្ទប់ — ត្រូវចូលទៅ Tenants Table ដើម្បីកំណត់បន្ទប់ក្រោយ Import
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep("upload")} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">ត្រឡប់</button>
                <button onClick={handleImport} disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-[#055b65] text-white text-sm font-medium hover:bg-[#044750] disabled:opacity-60">
                  {loading ? "កំពុង Import..." : `Import ${EXCEL_SAMPLE.length} អ្នកជួល`}
                </button>
              </div>
            </div>
          )}

          {step === "done" && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Import ជោគជ័យ! ✅</h3>
              <p className="text-sm text-gray-500 mb-5">បានបន្ថែម {EXCEL_SAMPLE.length} អ្នកជួលទៅ​ប្រព័ន្ធ</p>
              <button onClick={onClose} className="px-8 py-2.5 rounded-xl bg-[#055b65] text-white text-sm font-medium hover:bg-[#044750]">
                បិទ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Tenants View ─────────────────────────────────────────────────────
export function Tenants() {
  const { myTenants, myRooms, addTenant, updateTenant, deleteTenant, getRoomById } = useAppStore();
  const [showModal, setShowModal] = useState<"add" | "edit" | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // For ADD: only show Available rooms; for EDIT: show all (including currently assigned)
  const availableRooms = myRooms()
    .filter((r) => r.status === "Available")
    .map((r) => ({ id: r.id, roomNumber: r.roomNumber, status: r.status }));

  const allRoomsForEdit = (currentRoomId: string) =>
    myRooms().map((r) => ({ id: r.id, roomNumber: r.roomNumber, status: r.status, isCurrent: r.id === currentRoomId }));

  const filtered = myTenants().filter(
    (t) => t.fullName.toLowerCase().includes(search.toLowerCase()) ||
      t.phone.includes(search) ||
      (getRoomById(t.roomId)?.roomNumber ?? "").includes(search)
  );

  const handleChange = (k: keyof FormData, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const openAdd = () => { setForm(emptyForm); setShowModal("add"); };
  const [editingRoomId, setEditingRoomId] = useState<string>("");

  const openEdit = (tenant: Tenant) => {
    setForm({ fullName: tenant.fullName, phone: tenant.phone, roomId: tenant.roomId,
      deposit: tenant.deposit, moveInDate: tenant.moveInDate, email: tenant.email, nationalId: tenant.nationalId });
    setEditingRoomId(tenant.roomId);
    setEditId(tenant.id); setShowModal("edit");
  };

  const handleSubmitAdd = () => {
    if (!form.fullName || !form.roomId) return;
    addTenant(form); setShowModal(null);
  };
  const handleSubmitEdit = () => {
    if (!editId || !form.fullName) return;
    const existing = myTenants().find((t) => t.id === editId);
    updateTenant({ id: editId, landlordId: existing?.landlordId ?? "", telegramChatId: existing?.telegramChatId, telegramLinked: existing?.telegramLinked, ...form });
    setShowModal(null); setEditId(null);
  };

  const handleExcelImport = (rows: typeof EXCEL_SAMPLE) => {
    rows.forEach((row) => addTenant({ ...emptyForm, ...row }));
  };

  const linkedCount = myTenants().filter((t) => t.telegramLinked).length;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-gray-900 text-lg">គ្រប់គ្រងអ្នកជួល</h1>
          <p className="text-sm text-gray-400">
            {myTenants().length} នាក់ · Telegram ភ្ជាប់ {linkedCount}/{myTenants().length}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setShowImport(true)}
            className="flex items-center gap-2 border border-[#9dd0d5] text-[#055b65] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#e6f2f3] transition-colors">
            <FileSpreadsheet className="w-4 h-4" /> Import Excel
          </button>
          <button onClick={openAdd}
            className="flex items-center gap-2 bg-[#055b65] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#044750] transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> បន្ថែមអ្នកជួល
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 max-w-sm shadow-sm">
        <User className="w-4 h-4 text-gray-400" />
        <input
          className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
          placeholder="ស្វែងរកឈ្មោះ, ទូរស័ព្ទ, បន្ទប់..."
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">អ្នកជួល</th>
                <th className="px-5 py-3 text-left">ទូរស័ព្ទ</th>
                <th className="px-5 py-3 text-left">បន្ទប់</th>
                <th className="px-5 py-3 text-right">Deposit</th>
                <th className="px-5 py-3 text-left">ថ្ងៃចូល</th>
                <th className="px-5 py-3 text-center">Telegram</th>
                <th className="px-5 py-3 text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((tenant) => {
                const room = getRoomById(tenant.roomId);
                return (
                  <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#cde8eb] rounded-full flex items-center justify-center text-[#044750] font-bold text-sm shrink-0">
                          {tenant.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{tenant.fullName}</div>
                          <div className="text-xs text-gray-400">{tenant.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{tenant.phone}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#e6f2f3] text-[#044750] rounded-full text-xs font-medium">
                        <Home style={{ width: 11, height: 11 }} />
                        {room ? `បន្ទប់ ${room.roomNumber}` : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-gray-900">${tenant.deposit}</td>
                    <td className="px-5 py-4 text-gray-500">{tenant.moveInDate}</td>
                    <td className="px-5 py-4 text-center">
                      {tenant.telegramLinked ? (
                        <span className="inline-flex items-center gap-1 text-xs bg-[#2AABEE]/10 text-[#2AABEE] px-2.5 py-1 rounded-full font-medium">
                          <CheckCircle className="w-3 h-3" /> ភ្ជាប់
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-400 px-2.5 py-1 rounded-full">
                          <Send className="w-3 h-3" /> មិនទាន់
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(tenant)}
                          className="p-2 rounded-lg hover:bg-[#e6f2f3] text-gray-400 hover:text-[#055b65] transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setConfirmDelete(tenant.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-12 text-center text-gray-400 text-sm">មិនមានអ្នកជួល</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal === "add" && (
        <TenantModal
          title="បន្ថែមអ្នកជួលថ្មី"
          form={form} onChange={handleChange} onSubmit={handleSubmitAdd}
          onClose={() => setShowModal(null)} submitLabel="បន្ថែម"
          availableRooms={availableRooms}
          isEdit={false}
        />
      )}
      {showModal === "edit" && (
        <TenantModal
          title="កែប្រែអ្នកជួល (Admin)"
          form={form} onChange={handleChange} onSubmit={handleSubmitEdit}
          onClose={() => setShowModal(null)} submitLabel="រក្សាទុក"
          availableRooms={allRoomsForEdit(editingRoomId)}
          isEdit={true}
        />
      )}
      {showImport && <ExcelImportModal onClose={() => setShowImport(false)} onImport={handleExcelImport} />}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">លុបអ្នកជួល?</h3>
            <p className="text-sm text-gray-500 mb-5">ទិន្នន័យនឹងត្រូវបានលុបចោល</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-600">បោះបង់</button>
              <button onClick={() => { deleteTenant(confirmDelete); setConfirmDelete(null); }} className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-medium">លុប</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
