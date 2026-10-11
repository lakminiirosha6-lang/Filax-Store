"use client";

import React, { useState } from "react";

export interface PaymentGateway {
  id: string;
  type: "EzCash" | "Bank" | "PayHere";
  title: string;
  accountNumberOrId: string;
  accountHolderOrMode: string;
  instructions: string;
  feePercentage: number;
  isEnabled: boolean;
  accentColor: string;
  lastUpdated: string;
}

const INITIAL_GATEWAYS: PaymentGateway[] = [
  {
    id: "gw-ezcash",
    type: "EzCash",
    title: "EzCash Mobile Wallet",
    accountNumberOrId: "077-1849201",
    accountHolderOrMode: "Filax Store Merchant (Dialog / Hutch)",
    instructions: "Dial #111# or use the Genie/EzCash app. Transfer exact amount and enter Order ID in the reference field.",
    feePercentage: 0,
    isEnabled: true,
    accentColor: "#ffeb3b",
    lastUpdated: "2024-05-18",
  },
  {
    id: "gw-bank",
    type: "Bank",
    title: "Direct Bank Transfer (BOC / Commercial)",
    accountNumberOrId: "8901234501",
    accountHolderOrMode: "Commercial Bank - Colombo Fort Branch (Filax Topup Pvt Ltd)",
    instructions: "Perform online banking transfer or CDM cash deposit. Upload receipt slip or send WhatsApp screenshot for instant diamond dispatch.",
    feePercentage: 0,
    isEnabled: true,
    accentColor: "#00ffff",
    lastUpdated: "2024-06-01",
  },
  {
    id: "gw-payhere",
    type: "PayHere",
    title: "PayHere Online Gateway (Visa / Master / Frimi)",
    accountNumberOrId: "1224890",
    accountHolderOrMode: "Sandbox / Live Mode Enabled",
    instructions: "Automated instant IPN payment verification. Supports all Sri Lankan and International Visa, Mastercard, Genie, and Frimi wallets.",
    feePercentage: 2.5,
    isEnabled: true,
    accentColor: "#38bdf8",
    lastUpdated: "2024-06-05",
  },
];

export default function AdminPaymentsPage() {
  const [gateways, setGateways] = useState<PaymentGateway[]>(INITIAL_GATEWAYS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGateway, setEditingGateway] = useState<PaymentGateway | null>(null);

  // Form states
  const [formType, setFormType] = useState<PaymentGateway["type"]>("EzCash");
  const [formTitle, setFormTitle] = useState("");
  const [formAccountOrId, setFormAccountOrId] = useState("");
  const [formHolderOrMode, setFormHolderOrMode] = useState("");
  const [formInstructions, setFormInstructions] = useState("");
  const [formFee, setFormFee] = useState(0);
  const [formEnabled, setFormEnabled] = useState(true);

  const openNewModal = () => {
    setEditingGateway(null);
    setFormType("EzCash");
    setFormTitle("New EzCash Merchant");
    setFormAccountOrId("");
    setFormHolderOrMode("");
    setFormInstructions("Transfer with Order ID reference.");
    setFormFee(0);
    setFormEnabled(true);
    setIsModalOpen(true);
  };

  const openEditModal = (gw: PaymentGateway) => {
    setEditingGateway(gw);
    setFormType(gw.type);
    setFormTitle(gw.title);
    setFormAccountOrId(gw.accountNumberOrId);
    setFormHolderOrMode(gw.accountHolderOrMode);
    setFormInstructions(gw.instructions);
    setFormFee(gw.feePercentage);
    setFormEnabled(gw.isEnabled);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this payment channel configuration?")) {
      setGateways((prev) => prev.filter((g) => g.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formAccountOrId) return;

    if (editingGateway) {
      setGateways((prev) =>
        prev.map((g) =>
          g.id === editingGateway.id
            ? {
                ...g,
                type: formType,
                title: formTitle,
                accountNumberOrId: formAccountOrId,
                accountHolderOrMode: formHolderOrMode,
                instructions: formInstructions,
                feePercentage: Number(formFee),
                isEnabled: formEnabled,
                lastUpdated: new Date().toISOString().split("T")[0],
              }
            : g
        )
      );
    } else {
      const newGw: PaymentGateway = {
        id: "gw-" + Date.now(),
        type: formType,
        title: formTitle,
        accountNumberOrId: formAccountOrId,
        accountHolderOrMode: formHolderOrMode,
        instructions: formInstructions,
        feePercentage: Number(formFee),
        isEnabled: formEnabled,
        accentColor: formType === "EzCash" ? "#ffeb3b" : formType === "Bank" ? "#00ffff" : "#38bdf8",
        lastUpdated: new Date().toISOString().split("T")[0],
      };
      setGateways((prev) => [...prev, newGw]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Checkout Engines</span>
            <span className="text-zinc-600">/</span>
            <span className="text-xs font-mono text-zinc-400">Payment Gateways</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Payments & <span className="text-[#ffeb3b]">Merchant Routing</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Configure EzCash, Direct Bank accounts, and PayHere automated merchant integrations.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2.5 text-xs font-bold font-mono uppercase tracking-wider rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,235,59,0.25)] self-start md:self-auto"
        >
          <span>+</span>
          <span>Add Payment Gateway</span>
        </button>
      </div>

      {/* Gateway Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gateways.map((gw) => (
          <div
            key={gw.id}
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col justify-between relative group hover:border-zinc-700 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span
                  className="px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider border"
                  style={{
                    backgroundColor: `${gw.accentColor}15`,
                    color: gw.accentColor,
                    borderColor: `${gw.accentColor}40`,
                  }}
                >
                  {gw.type}
                </span>

                <button
                  onClick={() => {
                    setGateways((prev) =>
                      prev.map((item) =>
                        item.id === gw.id ? { ...item, isEnabled: !item.isEnabled } : item
                      )
                    );
                  }}
                  className={`text-xs font-mono px-2 py-0.5 rounded transition-colors ${
                    gw.isEnabled
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                  }`}
                >
                  {gw.isEnabled ? "Active" : "Disabled"}
                </button>
              </div>

              <h2 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                {gw.title}
              </h2>

              <div className="mt-4 space-y-2 text-xs font-mono">
                <div className="bg-[#0a0a0a] p-2.5 rounded border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase">
                    {gw.type === "EzCash" ? "Merchant Mobile No" : gw.type === "Bank" ? "Account Number" : "Merchant ID"}
                  </span>
                  <span className="text-white font-bold text-sm tracking-wide">
                    {gw.accountNumberOrId}
                  </span>
                </div>

                <div className="text-zinc-400 text-[11px] leading-tight">
                  <span className="text-zinc-500">Details: </span>
                  {gw.accountHolderOrMode}
                </div>

                <div className="text-zinc-500 text-[11px] line-clamp-2 pt-1 border-t border-zinc-800/60">
                  {gw.instructions}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">
                Fee: <span className="text-white font-bold">{gw.feePercentage}%</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(gw)}
                  className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(gw.id)}
                  className="px-2 py-1 rounded text-red-400 hover:bg-red-950/40 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-yellow-400/50 rounded-xl w-full max-w-lg p-6 shadow-[0_0_50px_rgba(255,235,59,0.15)]">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white font-mono">
                {editingGateway ? "Edit Gateway Details" : "Add Payment Gateway"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Gateway Engine
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => {
                      const t = e.target.value as PaymentGateway["type"];
                      setFormType(t);
                      if (!editingGateway) {
                        setFormTitle(t === "EzCash" ? "EzCash Mobile Wallet" : t === "Bank" ? "Bank Transfer" : "PayHere Gateway");
                      }
                    }}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400"
                  >
                    <option value="EzCash">EzCash (Dialog/Hutch)</option>
                    <option value="Bank">Direct Bank Transfer</option>
                    <option value="PayHere">PayHere Payment Gateway</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Gateway Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  {formType === "EzCash" ? "EzCash Merchant Number" : formType === "Bank" ? "Bank Account Number" : "PayHere Merchant ID"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={formType === "EzCash" ? "077XXXXXXX" : formType === "Bank" ? "Acc: 8901234501" : "1200000"}
                  value={formAccountOrId}
                  onChange={(e) => setFormAccountOrId(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  {formType === "EzCash" ? "Account Name / Operator" : formType === "Bank" ? "Bank Name & Branch" : "Mode / Environment"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={formType === "Bank" ? "Commercial Bank - Colombo Branch" : "Filax Store"}
                  value={formHolderOrMode}
                  onChange={(e) => setFormHolderOrMode(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Player Checkout Instructions
                </label>
                <textarea
                  rows={3}
                  value={formInstructions}
                  onChange={(e) => setFormInstructions(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Gateway Processing Fee (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formFee}
                    onChange={(e) => setFormFee(Number(e.target.value))}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 font-mono"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formEnabled}
                      onChange={(e) => setFormEnabled(e.target.checked)}
                      className="rounded border-zinc-700 bg-zinc-900 text-yellow-400 focus:ring-0"
                    />
                    <span className="text-xs font-mono text-zinc-200">
                      Channel Active
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black transition-colors"
                >
                  {editingGateway ? "Update Channel" : "Deploy Gateway"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
