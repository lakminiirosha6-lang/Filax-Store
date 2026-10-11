import React, { useState } from "react";
import { PaymentChannel } from "../types";

interface AdminPaymentsProps {
  gateways: PaymentChannel[];
  onUpdateGateways: (updater: (prev: PaymentChannel[]) => PaymentChannel[]) => void;
}

export const AdminPayments: React.FC<AdminPaymentsProps> = ({
  gateways,
  onUpdateGateways,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGateway, setEditingGateway] = useState<PaymentChannel | null>(null);

  // Form states
  const [formType, setFormType] = useState<PaymentChannel["type"]>("EzCash");
  const [formTitle, setFormTitle] = useState("");
  const [formAccountOrId, setFormAccountOrId] = useState("");
  const [formHolderOrMode, setFormHolderOrMode] = useState("");
  const [formInstructions, setFormInstructions] = useState("");
  const [formFee, setFormFee] = useState(0);
  const [formEnabled, setFormEnabled] = useState(true);

  const openNewModal = () => {
    setEditingGateway(null);
    setFormType("EzCash");
    setFormTitle("EzCash Mobile Wallet");
    setFormAccountOrId("077-1849201");
    setFormHolderOrMode("Filax Store Merchant Line");
    setFormInstructions("Dial #111# or use Genie App. Enter Order ID in reference.");
    setFormFee(0);
    setFormEnabled(true);
    setIsModalOpen(true);
  };

  const openEditModal = (gw: PaymentChannel) => {
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
      onUpdateGateways((prev) => prev.filter((g) => g.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formAccountOrId) return;

    if (editingGateway) {
      onUpdateGateways((prev) =>
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
      const newGw: PaymentChannel = {
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
      onUpdateGateways((prev) => [...prev, newGw]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              Transaction Routing
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-xs font-mono text-zinc-400">Merchant Gateways</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Payments & <span className="text-[#ffeb3b]">Gateways CRUD</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Configure EzCash, Direct Bank accounts, and PayHere checkout credentials for automated customer top-ups.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2.5 text-xs font-bold font-mono uppercase tracking-wider rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,235,59,0.25)] self-start md:self-auto cursor-pointer"
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
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col justify-between relative group hover:border-zinc-700 transition-all shadow-md"
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
                    onUpdateGateways((prev) =>
                      prev.map((item) =>
                        item.id === gw.id ? { ...item, isEnabled: !item.isEnabled } : item
                      )
                    );
                  }}
                  className={`text-xs font-mono px-2 py-0.5 rounded transition-colors cursor-pointer ${
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
                <div className="bg-[#0a0a0a] p-3 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase">
                    {gw.type === "EzCash"
                      ? "EzCash Merchant Mobile"
                      : gw.type === "Bank"
                      ? "Account Number"
                      : "PayHere Merchant ID"}
                  </span>
                  <span className="text-white font-bold text-sm tracking-wide">
                    {gw.accountNumberOrId}
                  </span>
                </div>

                <div className="text-zinc-400 text-[11px] leading-tight">
                  <span className="text-zinc-500">Details: </span>
                  {gw.accountHolderOrMode}
                </div>

                <div className="text-zinc-400 text-[11px] pt-1 border-t border-zinc-800/60 line-clamp-2">
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
                  className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(gw.id)}
                  className="px-2.5 py-1 rounded text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
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
                      const t = e.target.value as PaymentChannel["type"];
                      setFormType(t);
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
                    Display Title
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
                  {formType === "EzCash"
                    ? "EzCash Merchant Number"
                    : formType === "Bank"
                    ? "Bank Account Number"
                    : "PayHere Merchant ID"}
                </label>
                <input
                  type="text"
                  required
                  value={formAccountOrId}
                  onChange={(e) => setFormAccountOrId(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Account Name / Mode
                </label>
                <input
                  type="text"
                  required
                  value={formHolderOrMode}
                  onChange={(e) => setFormHolderOrMode(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Checkout Instructions
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
                  className="px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black transition-colors cursor-pointer"
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
};
