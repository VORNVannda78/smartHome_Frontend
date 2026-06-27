import { useState } from "react";
import { useAppStore, Room, RoomStatus } from "../store/appStore";
import { Plus, Pencil, Trash2, X, DoorOpen, CheckCircle, Wrench, FileSpreadsheet, Sparkles, Users } from "lucide-react";

type FormData = Omit<Room, "id" | "landlordId">;
const emptyForm: FormData = { roomNumber: "", floor: 1, monthlyRent: 200, status: "Available" };
const statusOptions: RoomStatus[] = ["Available", "Occupied", "Maintenance"];

const statusKh: Record<RoomStatus, string> = {
  Available:   "ទំ",
  Occupied:    "ជួលហើយ",
  Maintenance: "ជួសជុល",
};

function StatusBadge({ status }: { status: RoomStatus }) {
  const map: Record<RoomStatus, { cls: string; icon: React.ElementType }> = {
    Available:   { cls: "bg-blue-50 text-blue-700",    icon: CheckCircle },
    Occupied:    { cls: "bg-green-50 text-green-700",   icon: DoorOpen },     // green = occupied/revenue
    Maintenance: { cls: "bg-orange-50 text-orange-700", icon: Wrench },
  };
  const { cls, icon: Icon } = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>
      <Icon style={{ width: 11, height: 11 }} />{statusKh[status]}
    </span>
  );
}

function RoomModal({ title, form, onChange, onSubmit, onClose, submitLabel }: {
  title: string; form: FormData;
  onChange: (k: keyof FormData, v: string | number) => void;
  onSubmit: () => void; onClose: () => void; submitLabel: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">លេខបន្ទប់ <span className="text-red-500">*</span></label>
            <input className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca]"
              value={form.roomNumber} onChange={(e) => onChange("roomNumber", e.target.value)} placeholder="ឧ. 101" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">ជាន់</label>
            <input type="number" min={1}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca]"
              value={form.floor} onChange={(e) => onChange("floor", parseInt(e.target.value) || 1)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">ថ្លៃជួល/ខែ ($) <span className="text-red-500">*</span></label>
            <input type="number" min={0}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca]"
              value={form.monthlyRent} onChange={(e) => onChange("monthlyRent", parseFloat(e.target.value) || 0)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">ស្ថានភាព</label>
            <select className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca] bg-white"
              value={form.status} onChange={(e) => onChange("status", e.target.value as RoomStatus)}>
              {statusOptions.map((s) => <option key={s} value={s}>{statusKh[s]}</option>)}
            </select>
          </div>
        </div>
        <div className="px-6 pb-5 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">បោះបង់</button>
          <button onClick={onSubmit} className="px-5 py-2 rounded-xl bg-[#055b65] text-white text-sm font-medium hover:bg-[#044750]">{submitLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ── Auto-generate rooms modal ────────────────────────────────────────────────
function AutoGenModal({ onClose, onGenerate }: { onClose: () => void; onGenerate: (rooms: FormData[]) => void }) {
  const [floors, setFloors] = useState(2);
  const [perFloor, setPerFloor] = useState(5);
  const [rent, setRent] = useState(200);

  const preview: string[] = [];
  for (let f = 1; f <= Math.min(floors, 15); f++)
    for (let r = 1; r <= Math.min(perFloor, 20); r++)
      preview.push(`${f}${String(r).padStart(2, "0")}`);

  const handleGen = () => {
    const rooms: FormData[] = [];
    for (let f = 1; f <= floors; f++)
      for (let r = 1; r <= perFloor; r++)
        rooms.push({ roomNumber: `${f}${String(r).padStart(2, "0")}`, floor: f, monthlyRent: rent, status: "Available" });
    onGenerate(rooms);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#055b65]" /> បង្កើតបន្ទប់ស្វ័យប្រវត្តិ
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "ចំនួនជាន់", val: floors, set: setFloors, min: 1, max: 15 },
              { label: "បន្ទប់/ជាន់",  val: perFloor, set: setPerFloor, min: 1, max: 20 },
              { label: "ថ្លៃ/ខែ ($)",  val: rent, set: setRent, min: 50, max: 9999 },
            ].map((f) => (
              <div key={f.label}>
                <label className="text-xs text-gray-500 block mb-1">{f.label}</label>
                <input type="number" min={f.min} max={f.max}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec5ca] text-center font-bold"
                  value={f.val} onChange={(e) => f.set(parseInt(e.target.value) || f.min)} />
              </div>
            ))}
          </div>
          <div className="bg-[#e6f2f3] rounded-xl p-4 border border-[#cde8eb]">
            <div className="text-xs text-[#055b65] font-medium mb-2">
              លេខបន្ទប់ ({preview.length} ខ្នង):
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {preview.map((n) => (
                <span key={n} className="text-xs bg-white text-[#044750] px-2 py-0.5 rounded-full font-mono border border-[#cde8eb]">{n}</span>
              ))}
            </div>
          </div>
          <button onClick={handleGen}
            className="w-full py-3 bg-[#055b65] text-white rounded-xl font-semibold hover:bg-[#044750] flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" /> បង្កើត {preview.length} បន្ទប់ភ្លាម
          </button>
        </div>
      </div>
    </div>
  );
}

export function Rooms() {
  const { myRooms, addRoom, updateRoom, deleteRoom } = useAppStore();
  const [showModal, setShowModal] = useState<"add" | "edit" | "autogen" | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ទាំងអស់");

  const rooms = myRooms();
  const filtered = filterStatus === "ទាំងអស់" ? rooms : rooms.filter((r) => statusKh[r.status] === filterStatus);

  const handleChange = (k: keyof FormData, v: string | number) => setForm((f) => ({ ...f, [k]: v }));
  const openAdd = () => { setForm(emptyForm); setShowModal("add"); };
  const openEdit = (room: Room) => {
    setForm({ roomNumber: room.roomNumber, floor: room.floor, monthlyRent: room.monthlyRent, status: room.status });
    setEditId(room.id); setShowModal("edit");
  };
  const handleAdd = () => { if (!form.roomNumber) return; addRoom(form); setShowModal(null); };
  const handleEdit = () => {
    if (!editId) return;
    updateRoom({ id: editId, landlordId: rooms.find((r) => r.id === editId)?.landlordId ?? "", ...form });
    setShowModal(null); setEditId(null);
  };
  const handleAutoGen = (genRooms: FormData[]) => genRooms.forEach((r) => addRoom(r));

  const filterLabels = ["ទាំងអស់", "ទំ", "ជួលហើយ", "ជួសជុល"];

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-gray-900 text-lg">គ្រប់គ្រងបន្ទប់</h1>
          <p className="text-sm text-gray-400">
            {rooms.length} ខ្នង · ជួល {rooms.filter(r => r.status === "Occupied").length} · ទំ {rooms.filter(r => r.status === "Available").length}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setShowModal("autogen")}
            className="flex items-center gap-2 border border-[#9dd0d5] text-[#055b65] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#e6f2f3] transition-colors">
            <Sparkles className="w-4 h-4" /> Auto-Generate
          </button>
          <button onClick={openAdd}
            className="flex items-center gap-2 bg-[#055b65] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#044750] transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> បន្ថែមបន្ទប់
          </button>
        </div>
      </div>

      {/* Stats cards — enhanced */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "ជួលហើយ", labelSub: "Occupied",
            count: rooms.filter(r => r.status === "Occupied").length,
            total: rooms.length,
            icon: Users,
            bg: "bg-green-50", border: "border-green-200",
            iconBg: "bg-green-100", iconColor: "text-green-700",
            textColor: "text-green-800", subColor: "text-green-600",
            barColor: "bg-green-500",
          },
          {
            label: "ទំនេរ", labelSub: "Available",
            count: rooms.filter(r => r.status === "Available").length,
            total: rooms.length,
            icon: DoorOpen,
            bg: "bg-blue-50", border: "border-blue-200",
            iconBg: "bg-blue-100", iconColor: "text-blue-700",
            textColor: "text-blue-800", subColor: "text-blue-600",
            barColor: "bg-blue-400",
          },
          {
            label: "ជួសជុល", labelSub: "Maintenance",
            count: rooms.filter(r => r.status === "Maintenance").length,
            total: rooms.length,
            icon: Wrench,
            bg: "bg-orange-50", border: "border-orange-200",
            iconBg: "bg-orange-100", iconColor: "text-orange-700",
            textColor: "text-orange-800", subColor: "text-orange-600",
            barColor: "bg-orange-400",
          },
        ].map((s) => {
          const pct = s.total > 0 ? Math.round((s.count / s.total) * 100) : 0;
          return (
            <div key={s.label}
              className={`${s.bg} border ${s.border} rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 ${s.iconBg} rounded-xl flex items-center justify-center shadow-sm`}>
                  <s.icon className={`w-6 h-6 ${s.iconColor}`} />
                </div>
                <span className={`text-xs font-medium ${s.subColor} bg-white/60 px-2 py-0.5 rounded-full`}>
                  {pct}%
                </span>
              </div>
              <div className={`text-3xl font-black ${s.textColor} mb-0.5`}>{s.count}</div>
              <div className={`text-sm font-semibold ${s.textColor}`}>{s.label}</div>
              <div className="text-xs text-gray-400 mb-3">{s.labelSub} · {s.count}/{s.total} ខ្នង</div>
              <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                <div className={`h-full ${s.barColor} rounded-full transition-all`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 flex-wrap">
        {filterLabels.map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filterStatus === s ? "bg-[#055b65] text-white border-[#055b65]" : "border-gray-200 text-gray-600 hover:border-[#5bb8bf] hover:text-[#055b65]"
            }`}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">លេខបន្ទប់</th>
                <th className="px-5 py-3 text-left">ជាន់</th>
                <th className="px-5 py-3 text-right">ថ្លៃជួល</th>
                <th className="px-5 py-3 text-center">ស្ថានភាព</th>
                <th className="px-5 py-3 text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#e6f2f3] rounded-lg flex items-center justify-center">
                        <DoorOpen className="w-4 h-4 text-[#4da6ae]" />
                      </div>
                      {room.roomNumber}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500">ជាន់ {room.floor}</td>
                  <td className="px-5 py-4 text-right font-bold text-gray-900">
                    ${room.monthlyRent}<span className="text-xs text-gray-400 font-normal">/ខែ</span>
                  </td>
                  <td className="px-5 py-4 text-center"><StatusBadge status={room.status} /></td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(room)} className="p-2 rounded-lg hover:bg-[#e6f2f3] text-gray-400 hover:text-[#055b65] transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setConfirmDelete(room.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <DoorOpen className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">មិនមានបន្ទប់ — ចុច "Auto-Generate" ដើម្បីបង្កើតលឿន</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal === "add"     && <RoomModal title="បន្ថែមបន្ទប់ថ្មី" form={form} onChange={handleChange} onSubmit={handleAdd}  onClose={() => setShowModal(null)} submitLabel="បន្ថែម" />}
      {showModal === "edit"    && <RoomModal title="កែប្រែបន្ទប់"     form={form} onChange={handleChange} onSubmit={handleEdit} onClose={() => setShowModal(null)} submitLabel="រក្សាទុក" />}
      {showModal === "autogen" && <AutoGenModal onClose={() => setShowModal(null)} onGenerate={handleAutoGen} />}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">លុបបន្ទប់?</h3>
            <p className="text-sm text-gray-500 mb-5">សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-600">បោះបង់</button>
              <button onClick={() => { deleteRoom(confirmDelete); setConfirmDelete(null); }} className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-medium">លុប</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
