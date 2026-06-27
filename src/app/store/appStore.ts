import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  createElement,
} from "react";
import {
  api,
  norm,
  normList,
  setToken,
  clearToken,
  getToken,
} from "../../services/api";

// ─── Types (unchanged from original) ─────────────────────────────────────────

export type RoomStatus       = "Available" | "Occupied" | "Maintenance";
export type InvoiceStatus    = "Paid" | "Pending" | "Overdue";
export type ExpenseCategory  = "Repair" | "Utilities" | "Tax" | "Cleaning" | "Other";
export type LeaseStatus      = "Active" | "Expiring Soon" | "Expired";

export interface User {
  id: string;
  name: string;
  email: string;
  buildingName: string;
  plan: "free" | "pro" | "business";
  landlordId: string;
}

export interface Room {
  id: string;
  landlordId: string;
  roomNumber: string;
  floor: number;
  monthlyRent: number;
  status: RoomStatus;
}

export interface Tenant {
  id: string;
  landlordId: string;
  fullName: string;
  phone: string;
  roomId: string;
  deposit: number;
  moveInDate: string;
  email: string;
  nationalId: string;
  telegramChatId?: string;
  telegramLinked?: boolean;
}

export interface TelegramMessage {
  id: string;
  landlordId: string;
  tenantId: string;
  invoiceId?: string;
  type: "invoice" | "reminder" | "welcome" | "payment_confirm";
  sentAt: string;
  status: "sent" | "failed" | "pending";
  preview: string;
}

export interface PaymentProof {
  id: string;
  landlordId: string;
  tenantId: string;
  invoiceId: string;
  submittedAt: string;
  status: "pending_review" | "approved" | "rejected";
  note?: string;
}

export interface Invoice {
  id: string;
  landlordId: string;
  tenantId: string;
  roomId: string;
  month: string;
  rent: number;
  waterUsage: number;
  waterCost: number;
  electricUsage: number;
  electricCost: number;
  trash: number;
  total: number;
  status: InvoiceStatus;
  createdAt: string;
  oldWater: number;
  newWater: number;
  oldElectric: number;
  newElectric: number;
}

export interface Expense {
  id: string;
  landlordId: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  roomId?: string;
}

export interface Lease {
  id: string;
  landlordId: string;
  tenantId: string;
  roomId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  depositPaid: number;
  terms: string;
  status: LeaseStatus;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  expenses: number;
}

// ─── App State ────────────────────────────────────────────────────────────────

export interface AppState {
  currentUser: User | null;
  rooms: Room[];
  tenants: Tenant[];
  invoices: Invoice[];
  expenses: Expense[];
  leases: Lease[];
  telegramMessages: TelegramMessage[];
  paymentProofs: PaymentProof[];
  monthlyRevenue: MonthlyRevenue[];
  loading: boolean;
}

const EMPTY_STATE: AppState = {
  currentUser: null,
  rooms: [], tenants: [], invoices: [], expenses: [],
  leases: [], telegramMessages: [], paymentProofs: [],
  monthlyRevenue: [], loading: false,
};

// ─── Context interface ────────────────────────────────────────────────────────

interface AppContextType {
  state: AppState;
  loading: boolean;
  monthlyRevenue: MonthlyRevenue[];
  // Auth — now async
  login:    (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, buildingName: string) => Promise<boolean>;
  logout:   () => void;
  // Rooms
  addRoom:    (room: Omit<Room, "id" | "landlordId">) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (id: string) => void;
  // Tenants
  addTenant:    (tenant: Omit<Tenant, "id" | "landlordId">) => void;
  updateTenant: (tenant: Tenant) => void;
  deleteTenant: (id: string) => void;
  // Invoices
  addInvoice:          (invoice: Omit<Invoice, "id" | "createdAt" | "landlordId">) => void;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  // Expenses
  addExpense:    (expense: Omit<Expense, "id" | "landlordId">) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  // Leases
  addLease:    (lease: Omit<Lease, "id" | "landlordId">) => void;
  updateLease: (lease: Lease) => void;
  deleteLease: (id: string) => void;
  // Helpers
  getRoomById:   (id: string) => Room | undefined;
  getTenantById: (id: string) => Tenant | undefined;
  // Telegram
  linkTenantTelegram:   (tenantId: string, chatId: string) => void;
  unlinkTenantTelegram: (tenantId: string) => void;
  sendTelegramInvoice:  (tenantId: string, invoiceId: string, preview: string) => boolean;
  submitPaymentProof:   (tenantId: string, invoiceId: string, note: string) => void;
  approvePaymentProof:  (proofId: string) => void;
  rejectPaymentProof:   (proofId: string) => void;
  // Scoped data getters
  myRooms:            () => Room[];
  myTenants:          () => Tenant[];
  myInvoices:         () => Invoice[];
  myExpenses:         () => Expense[];
  myLeases:           () => Lease[];
  myTelegramMessages: () => TelegramMessage[];
  myPaymentProofs:    () => PaymentProof[];
}

const AppContext = createContext<AppContextType | null>(null);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeUser(raw: Record<string, unknown>): User {
  const id = String(raw.id ?? raw._id ?? "");
  return {
    id,
    landlordId:   id,           // landlordId == user's own _id on the backend
    name:         String(raw.name         ?? ""),
    email:        String(raw.email        ?? ""),
    buildingName: String(raw.buildingName ?? ""),
    plan:         (raw.plan as User["plan"]) ?? "free",
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(EMPTY_STATE);

  // ── Fetch all collections for the current user ─────────────────────────────
  const fetchAll = async () => {
    try {
      const [
        rooms, tenants, invoices, expenses, leases,
        msgs, proofs, monthlyRev,
      ] = await Promise.all([
        api.get<unknown[]>("/rooms"),
        api.get<unknown[]>("/tenants"),
        api.get<unknown[]>("/invoices"),
        api.get<unknown[]>("/expenses"),
        api.get<unknown[]>("/leases"),
        api.get<unknown[]>("/telegram/messages"),
        api.get<unknown[]>("/telegram/payment-proofs"),
        api.get<MonthlyRevenue[]>("/reports/monthly-revenue"),
      ]);

      setState((s) => ({
        ...s,
        rooms:            normList<Room>(rooms),
        tenants:          normList<Tenant>(tenants),
        invoices:         normList<Invoice>(invoices),
        expenses:         normList<Expense>(expenses),
        leases:           normList<Lease>(leases),
        telegramMessages: normList<TelegramMessage>(msgs),
        paymentProofs:    normList<PaymentProof>(proofs),
        monthlyRevenue:   Array.isArray(monthlyRev) ? monthlyRev : [],
        loading: false,
      }));
    } catch (err) {
      console.error("fetchAll error:", err);
      setState((s) => ({ ...s, loading: false }));
    }
  };

  // ── Restore session from localStorage token on mount ──────────────────────
  useEffect(() => {
    if (!getToken()) return;
    setState((s) => ({ ...s, loading: true }));
    api
      .get<Record<string, unknown>>("/auth/me")
      .then((rawUser) => {
        setState((s) => ({ ...s, currentUser: normalizeUser(rawUser) }));
        return fetchAll();
      })
      .catch(() => {
        clearToken();
        setState((s) => ({ ...s, loading: false }));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Auth ─────────────────────────────────────────────────────────────────

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post<{ token: string; user: Record<string, unknown> }>(
        "/auth/login",
        { email, password }
      );
      setToken(res.token);
      setState((s) => ({ ...s, currentUser: normalizeUser(res.user), loading: true }));
      await fetchAll();
      return true;
    } catch {
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    buildingName: string
  ): Promise<boolean> => {
    try {
      const res = await api.post<{ token: string; user: Record<string, unknown> }>(
        "/auth/register",
        { name, email, password, buildingName }
      );
      setToken(res.token);
      setState((s) => ({ ...s, currentUser: normalizeUser(res.user), loading: false }));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    clearToken();
    setState(EMPTY_STATE);
  };

  // ─── Rooms ────────────────────────────────────────────────────────────────
  // All mutations: call API → update local state with the returned document.
  // Fire-and-forget (returns void) so no caller needs to change.

  const addRoom = (data: Omit<Room, "id" | "landlordId">) => {
    api
      .post<unknown>("/rooms", data)
      .then((r) =>
        setState((s) => ({
          ...s,
          rooms: [...s.rooms, norm<Room>(r as Record<string, unknown>)],
        }))
      )
      .catch((e) => console.error("addRoom:", e));
  };

  const updateRoom = (room: Room) => {
    api
      .put<unknown>(`/rooms/${room.id}`, room)
      .then((r) =>
        setState((s) => ({
          ...s,
          rooms: s.rooms.map((x) =>
            x.id === room.id ? norm<Room>(r as Record<string, unknown>) : x
          ),
        }))
      )
      .catch((e) => console.error("updateRoom:", e));
  };

  const deleteRoom = (id: string) => {
    api
      .del<unknown>(`/rooms/${id}`)
      .then(() =>
        setState((s) => ({ ...s, rooms: s.rooms.filter((r) => r.id !== id) }))
      )
      .catch((e) => console.error("deleteRoom:", e));
  };

  // ─── Tenants ─────────────────────────────────────────────────────────────

  const addTenant = (data: Omit<Tenant, "id" | "landlordId">) => {
    api
      .post<unknown>("/tenants", data)
      .then((t) =>
        setState((s) => ({
          ...s,
          tenants: [...s.tenants, norm<Tenant>(t as Record<string, unknown>)],
        }))
      )
      .catch((e) => console.error("addTenant:", e));
  };

  const updateTenant = (tenant: Tenant) => {
    api
      .put<unknown>(`/tenants/${tenant.id}`, tenant)
      .then((t) =>
        setState((s) => ({
          ...s,
          tenants: s.tenants.map((x) =>
            x.id === tenant.id ? norm<Tenant>(t as Record<string, unknown>) : x
          ),
        }))
      )
      .catch((e) => console.error("updateTenant:", e));
  };

  const deleteTenant = (id: string) => {
    api
      .del<unknown>(`/tenants/${id}`)
      .then(() =>
        setState((s) => ({
          ...s,
          tenants: s.tenants.filter((t) => t.id !== id),
        }))
      )
      .catch((e) => console.error("deleteTenant:", e));
  };

  // ─── Invoices ─────────────────────────────────────────────────────────────

  const addInvoice = (invoice: Omit<Invoice, "id" | "createdAt" | "landlordId">) => {
    api
      .post<unknown>("/invoices", invoice)
      .then((i) =>
        setState((s) => ({
          ...s,
          invoices: [...s.invoices, norm<Invoice>(i as Record<string, unknown>)],
        }))
      )
      .catch((e) => console.error("addInvoice:", e));
  };

  const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    api
      .patch<unknown>(`/invoices/${id}/status`, { status })
      .then((i) =>
        setState((s) => ({
          ...s,
          invoices: s.invoices.map((x) =>
            x.id === id ? norm<Invoice>(i as Record<string, unknown>) : x
          ),
        }))
      )
      .catch((e) => console.error("updateInvoiceStatus:", e));
  };

  // ─── Expenses ─────────────────────────────────────────────────────────────

  const addExpense = (data: Omit<Expense, "id" | "landlordId">) => {
    api
      .post<unknown>("/expenses", data)
      .then((e) =>
        setState((s) => ({
          ...s,
          expenses: [...s.expenses, norm<Expense>(e as Record<string, unknown>)],
        }))
      )
      .catch((e) => console.error("addExpense:", e));
  };

  const updateExpense = (expense: Expense) => {
    api
      .put<unknown>(`/expenses/${expense.id}`, expense)
      .then((e) =>
        setState((s) => ({
          ...s,
          expenses: s.expenses.map((x) =>
            x.id === expense.id ? norm<Expense>(e as Record<string, unknown>) : x
          ),
        }))
      )
      .catch((err) => console.error("updateExpense:", err));
  };

  const deleteExpense = (id: string) => {
    api
      .del<unknown>(`/expenses/${id}`)
      .then(() =>
        setState((s) => ({
          ...s,
          expenses: s.expenses.filter((e) => e.id !== id),
        }))
      )
      .catch((e) => console.error("deleteExpense:", e));
  };

  // ─── Leases ───────────────────────────────────────────────────────────────

  const addLease = (data: Omit<Lease, "id" | "landlordId">) => {
    api
      .post<unknown>("/leases", data)
      .then((l) =>
        setState((s) => ({
          ...s,
          leases: [...s.leases, norm<Lease>(l as Record<string, unknown>)],
        }))
      )
      .catch((e) => console.error("addLease:", e));
  };

  const updateLease = (lease: Lease) => {
    api
      .put<unknown>(`/leases/${lease.id}`, lease)
      .then((l) =>
        setState((s) => ({
          ...s,
          leases: s.leases.map((x) =>
            x.id === lease.id ? norm<Lease>(l as Record<string, unknown>) : x
          ),
        }))
      )
      .catch((e) => console.error("updateLease:", e));
  };

  const deleteLease = (id: string) => {
    api
      .del<unknown>(`/leases/${id}`)
      .then(() =>
        setState((s) => ({
          ...s,
          leases: s.leases.filter((l) => l.id !== id),
        }))
      )
      .catch((e) => console.error("deleteLease:", e));
  };

  // ─── Telegram ─────────────────────────────────────────────────────────────

  const linkTenantTelegram = (tenantId: string, chatId: string) => {
    api
      .patch<unknown>(`/tenants/${tenantId}/telegram/link`, { chatId })
      .then((t) => {
        const updated = norm<Tenant>(t as Record<string, unknown>);
        setState((s) => ({
          ...s,
          tenants: s.tenants.map((x) => (x.id === tenantId ? updated : x)),
        }));
        // Refresh messages — backend creates a welcome message on link
        api
          .get<unknown[]>("/telegram/messages")
          .then((msgs) =>
            setState((s) => ({
              ...s,
              telegramMessages: normList<TelegramMessage>(msgs),
            }))
          );
      })
      .catch((e) => console.error("linkTenantTelegram:", e));
  };

  const unlinkTenantTelegram = (tenantId: string) => {
    api
      .patch<unknown>(`/tenants/${tenantId}/telegram/unlink`)
      .then((t) => {
        const updated = norm<Tenant>(t as Record<string, unknown>);
        setState((s) => ({
          ...s,
          tenants: s.tenants.map((x) => (x.id === tenantId ? updated : x)),
        }));
      })
      .catch((e) => console.error("unlinkTenantTelegram:", e));
  };

  // Returns synchronously (boolean) so callers don't need to change;
  // the actual API call is fire-and-forget that updates state when done.
  const sendTelegramInvoice = (
    tenantId: string,
    invoiceId: string,
    preview: string
  ): boolean => {
    const tenant = state.tenants.find((t) => t.id === tenantId);
    if (!tenant?.telegramLinked) return false;

    api
      .post<unknown>("/telegram/send-invoice", { tenantId, invoiceId, preview })
      .then((msg) => {
        const newMsg = norm<TelegramMessage>(msg as Record<string, unknown>);
        setState((s) => ({
          ...s,
          telegramMessages: [...s.telegramMessages, newMsg],
        }));
      })
      .catch((e) => console.error("sendTelegramInvoice:", e));

    return true;
  };

  const submitPaymentProof = (tenantId: string, invoiceId: string, note: string) => {
    api
      .post<unknown>("/telegram/payment-proof", { tenantId, invoiceId, note })
      .then((p) => {
        const proof = norm<PaymentProof>(p as Record<string, unknown>);
        setState((s) => ({
          ...s,
          paymentProofs: [...s.paymentProofs, proof],
        }));
      })
      .catch((e) => console.error("submitPaymentProof:", e));
  };

  const approvePaymentProof = (proofId: string) => {
    api
      .patch<unknown>(`/telegram/payment-proof/${proofId}/approve`)
      .then((p) => {
        const updated = norm<PaymentProof>(p as Record<string, unknown>);
        setState((s) => ({
          ...s,
          paymentProofs: s.paymentProofs.map((x) =>
            x.id === proofId ? updated : x
          ),
        }));
      })
      .catch((e) => console.error("approvePaymentProof:", e));
  };

  const rejectPaymentProof = (proofId: string) => {
    api
      .patch<unknown>(`/telegram/payment-proof/${proofId}/reject`)
      .then((p) => {
        const updated = norm<PaymentProof>(p as Record<string, unknown>);
        setState((s) => ({
          ...s,
          paymentProofs: s.paymentProofs.map((x) =>
            x.id === proofId ? updated : x
          ),
        }));
      })
      .catch((e) => console.error("rejectPaymentProof:", e));
  };

  // ─── Lookup helpers ───────────────────────────────────────────────────────
  const getRoomById   = (id: string) => state.rooms.find((r) => r.id === id);
  const getTenantById = (id: string) => state.tenants.find((t) => t.id === id);

  // ─── Scoped getters ───────────────────────────────────────────────────────
  // The API already scopes all data to the authenticated user,
  // so these just return the cached arrays.
  const myRooms            = () => state.rooms;
  const myTenants          = () => state.tenants;
  const myInvoices         = () => state.invoices;
  const myExpenses         = () => state.expenses;
  const myLeases           = () => state.leases;
  const myTelegramMessages = () => state.telegramMessages;
  const myPaymentProofs    = () => state.paymentProofs;

  return createElement(AppContext.Provider, {
    value: {
      state,
      loading:        state.loading,
      monthlyRevenue: state.monthlyRevenue,
      login, register, logout,
      addRoom, updateRoom, deleteRoom,
      addTenant, updateTenant, deleteTenant,
      addInvoice, updateInvoiceStatus,
      addExpense, updateExpense, deleteExpense,
      addLease, updateLease, deleteLease,
      linkTenantTelegram, unlinkTenantTelegram, sendTelegramInvoice,
      submitPaymentProof, approvePaymentProof, rejectPaymentProof,
      getRoomById, getTenantById,
      myRooms, myTenants, myInvoices, myExpenses, myLeases,
      myTelegramMessages, myPaymentProofs,
    },
    children,
  });
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore must be used within AppProvider");
  return ctx;
}
