import { useState } from "react";
import { useAppStore } from "../store/appStore";
import {
  Send, QrCode, CheckCircle, XCircle, LinkIcon, Unlink,
  MessageSquare, FileText, Copy, Eye, RefreshCw, AlertTriangle,
} from "lucide-react";

const BOT_USERNAME = "RoomRentKH_Bot";
const BOT_TOKEN_PLACEHOLDER = "YOUR_BOT_TOKEN_HERE";

// ─── Node.js Backend Code ─────────────────────────────────────────────────────

const BACKEND_CODE = `// ══════════════════════════════════════════════════════════
// RoomRentKH — Telegram Bot Backend (Node.js + Express)
// npm install node-telegram-bot-api express
// ══════════════════════════════════════════════════════════

const TelegramBot = require("node-telegram-bot-api");
const express     = require("express");

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;  // ដាក់ Token ក្នុង .env
const WEBHOOK_URL = process.env.WEBHOOK_URL;         // https://yourdomain.com

const bot = new TelegramBot(BOT_TOKEN);
const app = express();
app.use(express.json());

// ── រៀបចំ Webhook ──────────────────────────────────────────
bot.setWebHook(\`\${WEBHOOK_URL}/bot\${BOT_TOKEN}\`);
app.post(\`/bot\${BOT_TOKEN}\`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// ── Mock Database ──────────────────────────────────────────
const db = {
  // ភ្ជាប់ chat_id ជាមួយ tenant_id
  saveChatId: async (tenantId, chatId) => {
    console.log(\`✅ Linked tenant \${tenantId} → chat_id \${chatId}\`);
    // TODO: UPDATE tenants SET telegram_chat_id=$1 WHERE id=$2
  },
  getTenantById: async (tenantId) => ({
    id: tenantId, fullName: "សុខ ស្រីនាថ",
    roomNumber: "101", monthlyRent: 180,
  }),
};

// ── /start Command with Deep Linking ──────────────────────
// អ្នកជួលចុច: t.me/RoomRentKH_Bot?start=tenant_t1
bot.onText(/\\/start (.+)/, async (msg, match) => {
  const chatId  = msg.chat.id;
  const payload = match[1]; // "tenant_t1"

  if (payload.startsWith("tenant_")) {
    const tenantId = payload.replace("tenant_", "");
    await db.saveChatId(tenantId, chatId);

    const tenant = await db.getTenantById(tenantId);
    await bot.sendMessage(chatId,
      \`🏠 *សូមស្វាគមន៍!*\\n\\n\` +
      \`លោក/លោកស្រី *\${tenant.fullName}* \\n\` +
      \`បន្ទប់ *\${tenant.roomNumber}* ត្រូវបានភ្ជាប់ជាមួយ Bot ដោយជោគជ័យ! ✅\\n\\n\` +
      \`ចាប់ពីពេលនេះ លោក/លោកស្រីនឹងទទួល:\\n\` +
      \`📋 វិក្កយបត្រប្រចាំខែ\\n\` +
      \`⚠️ ការជំរុញប្រចាំខែ\\n\` +
      \`✅ ការបញ្ជាក់ការទូទាត់\`,
      { parse_mode: "Markdown" }
    );
  }
});

// ── sendInvoice(chat_id, invoiceDetails) ──────────────────
// ហៅ Function នេះពី Dashboard ពេលចុចប៊ូតុង "ផ្ញើ Telegram"
async function sendInvoice(chatId, inv) {
  const msg =
    \`📋 *វិក្កយបត្រ ខែ \${inv.month}*\\n\` +
    \`━━━━━━━━━━━━━━━━━━━━━━\\n\` +
    \`🏠 បន្ទប់: *\${inv.roomNumber}*\\n\` +
    \`👤 អ្នកជួល: *\${inv.tenantName}*\\n\` +
    \`━━━━━━━━━━━━━━━━━━━━━━\\n\` +
    \`🏘️ ថ្លៃបន្ទប់:       *$\${inv.rent}*\\n\` +
    \`💧 ទឹក (\${inv.waterUsage}m³):  *$\${inv.waterCost}*\\n\` +
    \`⚡ ភ្លើង (\${inv.elecUsage}kWh): *$\${inv.elecCost}*\\n\` +
    \`🗑️ សំរាម:           *$\${inv.trash}*\\n\` +
    \`━━━━━━━━━━━━━━━━━━━━━━\\n\` +
    \`💰 *សរុប: $\${inv.total}*\\n\\n\` +
    \`📱 *ការទូទាត់តាម KHQR:*\\n\` +
    \`ស្កែន QR ខាងក្រោម ឬប្រើ ABA / ACLEDA / Wing\\n\` +
    \`គណនី: RoomRentKH — 012 345 678\\n\\n\` +
    \`📸 បន្ទាប់ពីបង់រួច សូមផ្ញើ Screenshot មក Bot!\`;

  await bot.sendMessage(chatId, msg, { parse_mode: "Markdown" });

  // ផ្ញើ KHQR Image (ជំនួសដោយ QR ពិត)
  await bot.sendPhoto(chatId,
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png",
    { caption: \`KHQR — $\${inv.total} | \${inv.month}\` }
  );
}

// ── ទទួលរូប Screenshot ពីអ្នកជួល ──────────────────────────
bot.on("photo", async (msg) => {
  const chatId = msg.chat.id;
  // TODO: ស្វែងរក tenant ពី chat_id → ផ្ញើ notification ទៅ Admin Dashboard
  await bot.sendMessage(chatId,
    "✅ យើងបានទទួល Screenshot របស់លោក/លោកស្រីហើយ!\\n" +
    "ម្ចាស់ផ្ទះនឹងពិនិត្យ និងបញ្ជាក់ការទូទាត់ក្នុងពេលឆាប់ៗ។"
  );
  // TODO: notifyAdmin(chatId, msg.photo)
});

// ── Express Webhook Route ──────────────────────────────────
app.listen(3001, () => console.log("🤖 Bot Server running on port 3001"));
module.exports = { sendInvoice };`;

// ─── Tab components ──────────────────────────────────────────────────────────

function TenantConnectionTab() {
  const { myTenants, myRooms, linkTenantTelegram, unlinkTenantTelegram, getRoomById } = useAppStore();
  const [copied, setCopied] = useState<string | null>(null);
  const [simulating, setSimulating] = useState<string | null>(null);

  const tenants = myTenants();

  const deepLink = (tenantId: string) =>
    `https://t.me/${BOT_USERNAME}?start=tenant_${tenantId}`;

  const copyLink = (tenantId: string) => {
    navigator.clipboard.writeText(deepLink(tenantId));
    setCopied(tenantId);
    setTimeout(() => setCopied(null), 2000);
  };

  // Simulate tenant clicking the deep link and bot receiving /start
  const simulateLink = (tenantId: string) => {
    setSimulating(tenantId);
    setTimeout(() => {
      linkTenantTelegram(tenantId, `tg_sim_${Date.now()}`);
      setSimulating(null);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
        <div className="font-semibold mb-1 flex items-center gap-2">
          <LinkIcon className="w-4 h-4" /> របៀបភ្ជាប់ Telegram ជាមួយអ្នកជួល
        </div>
        <ol className="list-decimal list-inside space-y-1 text-xs leading-relaxed">
          <li>ចម្លង Deep Link ខាងក្រោម ហើយផ្ញើទៅអ្នកជួល (ឬឲ្យស្កែន QR)</li>
          <li>អ្នកជួលចុច Link → Telegram បើក → ចុចប៊ូតុង <strong>Start</strong></li>
          <li>Bot ទទួល chat_id → ចង Flash ជាមួយ Account → ភ្ជាប់ជោគជ័យ ✅</li>
        </ol>
      </div>

      <div className="space-y-3">
        {tenants.map((tenant) => {
          const room = getRoomById(tenant.roomId);
          const linked = tenant.telegramLinked;
          return (
            <div key={tenant.id} className={`bg-white rounded-2xl border p-5 ${linked ? "border-green-200" : "border-gray-100"}`}>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                    {tenant.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{tenant.fullName}</div>
                    <div className="text-xs text-gray-400">បន្ទប់ {room?.roomNumber} · {tenant.phone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {linked ? (
                    <>
                      <span className="flex items-center gap-1.5 text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full font-medium">
                        <CheckCircle className="w-3.5 h-3.5" /> ភ្ជាប់ Telegram រួចហើយ
                      </span>
                      <button
                        onClick={() => unlinkTenantTelegram(tenant.id)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50"
                      >
                        <Unlink className="w-3 h-3" /> ផ្ដាច់
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => copyLink(tenant.id)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
                      >
                        <Copy className="w-3 h-3" />
                        {copied === tenant.id ? "បានចម្លង!" : "ចម្លង Link"}
                      </button>
                      <button
                        onClick={() => simulateLink(tenant.id)}
                        disabled={simulating === tenant.id}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-[#2AABEE] text-white hover:bg-[#1d96d9] disabled:opacity-60"
                      >
                        {simulating === tenant.id
                          ? <><RefreshCw className="w-3 h-3 animate-spin" /> រង់ចាំ...</>
                          : <><Send className="w-3 h-3" /> ធ្វើតេស្ត Link</>
                        }
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Deep link + QR */}
              {!linked && (
                <div className="mt-4 flex items-start gap-4">
                  <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-xl flex flex-col items-center justify-center shrink-0">
                    <QrCode className="w-10 h-10 text-gray-400" />
                    <span className="text-[9px] text-gray-400 mt-1">QR Code</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-1">Deep Link:</div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-blue-600 font-mono break-all border border-gray-200">
                      {deepLink(tenant.id)}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1.5">
                      ផ្ញើ Link នេះទៅ Telegram របស់អ្នកជួល ឬបង្ហាញ QR ឲ្យស្កែន
                    </div>
                  </div>
                </div>
              )}

              {linked && tenant.telegramChatId && (
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                  <MessageSquare className="w-3.5 h-3.5" />
                  chat_id: <code className="bg-gray-50 px-2 py-0.5 rounded">{tenant.telegramChatId}</code>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SendHistoryTab() {
  const { myTelegramMessages, getTenantById } = useAppStore();
  const messages = myTelegramMessages().sort((a, b) => b.sentAt.localeCompare(a.sentAt));

  const typeConfig: Record<string, { label: string; color: string }> = {
    invoice:         { label: "វិក្កយបត្រ",    color: "bg-blue-50 text-blue-700" },
    welcome:         { label: "ស្វាគមន៍",       color: "bg-green-50 text-green-700" },
    reminder:        { label: "ការជំរុញ",       color: "bg-yellow-50 text-yellow-700" },
    payment_confirm: { label: "បញ្ជាក់ទូទាត់", color: "bg-purple-50 text-purple-700" },
  };

  return (
    <div className="space-y-3">
      {messages.length === 0 && (
        <div className="py-12 text-center text-gray-300">
          <MessageSquare className="w-10 h-10 mx-auto mb-2" />
          <p className="text-sm">មិនទាន់មានការផ្ញើ</p>
        </div>
      )}
      {messages.map((msg) => {
        const tenant = getTenantById(msg.tenantId);
        const tc = typeConfig[msg.type] ?? { label: msg.type, color: "bg-gray-100 text-gray-600" };
        return (
          <div key={msg.id} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 bg-[#2AABEE]/10 rounded-xl flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4 text-[#2AABEE]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-medium text-sm text-gray-900">{tenant?.fullName ?? "—"}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tc.color}`}>{tc.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${msg.status === "sent" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                      {msg.status === "sent" ? "✓ Sent" : "✗ Failed"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-2">{msg.preview}</div>
                  <div className="text-[11px] text-gray-400 mt-1">{msg.sentAt}</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PaymentProofsTab() {
  const { myPaymentProofs, getTenantById, getRoomById, myTenants, myInvoices, updateInvoiceStatus, approvePaymentProof, rejectPaymentProof, sendTelegramInvoice } = useAppStore();
  const proofs = myPaymentProofs().sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  // Simulate a tenant submitting a proof (for demo)
  const [simulating, setSimulating] = useState(false);
  const { submitPaymentProof, myInvoices: getInv } = useAppStore();

  const simulateSubmission = () => {
    const inv = getInv().find((i) => i.status === "Pending");
    if (!inv) return;
    setSimulating(true);
    setTimeout(() => {
      submitPaymentProof(inv.tenantId, inv.id, "Screenshot ABA — ធ្វើ Simulation");
      setSimulating(false);
    }, 1200);
  };

  const handleApprove = (proof: ReturnType<typeof myPaymentProofs>[0]) => {
    approvePaymentProof(proof.id);
    updateInvoiceStatus(proof.invoiceId, "Paid");
    // Confirm via Telegram
    const tenant = getTenantById(proof.tenantId);
    if (tenant?.telegramLinked) {
      sendTelegramInvoice(proof.tenantId, proof.invoiceId,
        `✅ ការទូទាត់ Invoice #${proof.invoiceId} ត្រូវបានបញ្ជាក់ — អរគុណ!`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          អ្នកជួលផ្ញើ Screenshot ការទូទាត់ → Bot ទទួល → Admin Approve នៅទីនេះ
        </p>
        <button
          onClick={simulateSubmission}
          disabled={simulating}
          className="flex items-center gap-1.5 text-xs px-3 py-2 bg-[#2AABEE] text-white rounded-lg hover:bg-[#1d96d9] disabled:opacity-60"
        >
          {simulating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
          Simulate ការផ្ញើ
        </button>
      </div>

      {proofs.length === 0 && (
        <div className="py-12 text-center text-gray-300">
          <FileText className="w-10 h-10 mx-auto mb-2" />
          <p className="text-sm">មិនទាន់មាន Screenshot ណាមួយ</p>
        </div>
      )}

      {proofs.map((proof) => {
        const tenant = getTenantById(proof.tenantId);
        const inv = myInvoices().find((i) => i.id === proof.invoiceId);
        const room = inv ? getRoomById(inv.roomId) : null;
        return (
          <div key={proof.id} className={`bg-white rounded-xl border p-5 ${
            proof.status === "pending_review" ? "border-yellow-200" :
            proof.status === "approved" ? "border-green-200" : "border-red-100"
          }`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-7 h-7 text-gray-400" />
                  <span className="text-[9px] text-gray-400 absolute mt-8">Screenshot</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{tenant?.fullName}</div>
                  <div className="text-xs text-gray-400">
                    Invoice #{proof.invoiceId} · បន្ទប់ {room?.roomNumber} · ${inv?.total}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{proof.submittedAt}</div>
                  {proof.note && <div className="text-xs text-gray-500 mt-1 italic">"{proof.note}"</div>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {proof.status === "pending_review" && (
                  <>
                    <button
                      onClick={() => handleApprove(proof)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve & Mark Paid
                    </button>
                    <button
                      onClick={() => rejectPaymentProof(proof.id)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </>
                )}
                {proof.status === "approved" && (
                  <span className="flex items-center gap-1.5 text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full">
                    <CheckCircle className="w-3.5 h-3.5" /> Approved
                  </span>
                )}
                {proof.status === "rejected" && (
                  <span className="flex items-center gap-1.5 text-xs bg-red-50 text-red-500 px-3 py-1.5 rounded-full">
                    <XCircle className="w-3.5 h-3.5" /> Rejected
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BackendCodeTab() {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(BACKEND_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-800">Node.js + Express Backend Code</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Copy code នេះ ហើយដំណើរការជា Separate Service ជាមួយ Telegram Webhook
          </p>
        </div>
        <button onClick={handleCopy}
          className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm hover:bg-gray-700 shrink-0">
          <Copy className="w-3.5 h-3.5" />
          {copied ? "Copied!" : "Copy Code"}
        </button>
      </div>

      {/* Setup steps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { step: "01", title: "បង្កើត Bot", desc: "ទៅ @BotFather ក្នុង Telegram → /newbot → Copy Token" },
          { step: "02", title: "Deploy Backend", desc: "npm install → node index.js → ដាក់ Webhook URL" },
          { step: "03", title: "ភ្ជាប់ Tenant", desc: "ចម្លង Deep Link ខាងលើ → ផ្ញើឲ្យអ្នកជួល → ចុច Start" },
        ].map((s) => (
          <div key={s.step} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="text-2xl font-black text-green-600 mb-2">{s.step}</div>
            <div className="font-semibold text-gray-800 text-sm mb-1">{s.title}</div>
            <div className="text-xs text-gray-500 leading-relaxed">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* ENV setup */}
      <div className="bg-gray-900 rounded-xl p-4">
        <div className="text-xs text-gray-400 mb-2 font-mono"># .env file</div>
        <pre className="text-green-400 text-xs font-mono leading-relaxed overflow-x-auto">
{`TELEGRAM_BOT_TOKEN=${BOT_TOKEN_PLACEHOLDER}
WEBHOOK_URL=https://yourdomain.com
DATABASE_URL=postgresql://user:pass@localhost/roomrentkh`}
        </pre>
      </div>

      {/* Main code */}
      <div className="bg-gray-900 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-700">
          <span className="text-xs text-gray-400 font-mono">telegram-bot/index.js</span>
          <span className="text-xs text-green-400">Node.js</span>
        </div>
        <pre className="p-4 text-xs font-mono text-gray-300 overflow-x-auto leading-relaxed max-h-[480px] overflow-y-auto">
          {BACKEND_CODE}
        </pre>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
        <div className="text-xs text-yellow-700">
          <div className="font-semibold mb-1">ចំណាំ សម្រាប់ Production</div>
          <ul className="list-disc list-inside space-y-0.5">
            <li>ជំនួស Mock Database ដោយ PostgreSQL/MySQL ពិត</li>
            <li>ផ្ទៀងផ្ទាត់ HMAC Signature ពី Telegram Webhook</li>
            <li>ប្រើ Rate Limiting ដើម្បីការពារ Spam</li>
            <li>ដាក់ BOT_TOKEN ក្នុង Environment Variable ជានិច្ច</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Main View ───────────────────────────────────────────────────────────────

const TABS = [
  { id: "connect",  label: "ភ្ជាប់ Tenant",       icon: LinkIcon },
  { id: "history",  label: "ប្រវត្តិផ្ញើ",          icon: MessageSquare },
  { id: "proofs",   label: "Screenshot ទូទាត់",    icon: FileText },
  { id: "backend",  label: "Backend Code",         icon: Eye },
];

export function TelegramBot() {
  const [activeTab, setActiveTab] = useState("connect");
  const { myTenants, myPaymentProofs } = useAppStore();

  const linkedCount = myTenants().filter((t) => t.telegramLinked).length;
  const pendingProofs = myPaymentProofs().filter((p) => p.status === "pending_review").length;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <span className="text-[#2AABEE]">✈</span> Telegram Bot Integration
          </h1>
          <p className="text-sm text-gray-400">ផ្ញើវិក្កយបត្រ · ទទួលការទូទាត់ · ភ្ជាប់ Tenant</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-center">
            <div className="text-lg font-bold text-green-700">{linkedCount}</div>
            <div className="text-xs text-green-600">ភ្ជាប់ហើយ</div>
          </div>
          <div className="bg-[#2AABEE]/10 border border-[#2AABEE]/20 rounded-xl px-4 py-2 text-center">
            <div className="text-lg font-bold text-[#2AABEE]">{myTenants().length}</div>
            <div className="text-xs text-[#2AABEE]">អ្នកជួលសរុប</div>
          </div>
          {pendingProofs > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 text-center">
              <div className="text-lg font-bold text-yellow-700">{pendingProofs}</div>
              <div className="text-xs text-yellow-600">រង់ Approve</div>
            </div>
          )}
        </div>
      </div>

      {/* Bot info */}
      <div className="bg-gradient-to-r from-[#2AABEE]/10 to-blue-50 border border-[#2AABEE]/20 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-14 h-14 bg-[#2AABEE] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg">
          <Send className="w-7 h-7" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-gray-900 text-base">@{BOT_USERNAME}</div>
          <div className="text-sm text-gray-500">t.me/{BOT_USERNAME}</div>
          <div className="text-xs text-gray-400 mt-0.5">
            Token: <code className="bg-white/70 px-1.5 py-0.5 rounded font-mono">{BOT_TOKEN_PLACEHOLDER}</code>
          </div>
        </div>
        <a href={`https://t.me/${BOT_USERNAME}`} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 bg-[#2AABEE] text-white rounded-xl text-sm hover:bg-[#1d96d9] transition-colors">
          <Send className="w-3.5 h-3.5" /> បើក Bot
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl flex-wrap">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
              activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            <tab.icon style={{ width: 14, height: 14 }} />
            {tab.label}
            {tab.id === "proofs" && pendingProofs > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {pendingProofs}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "connect" && <TenantConnectionTab />}
      {activeTab === "history" && <SendHistoryTab />}
      {activeTab === "proofs"  && <PaymentProofsTab />}
      {activeTab === "backend" && <BackendCodeTab />}
    </div>
  );
}
