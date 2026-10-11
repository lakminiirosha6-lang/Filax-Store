"use client";

import React, { useState } from "react";

export interface GamerUser {
  id: string;
  name: string;
  gmail: string;
  whatsapp: string;
  walletBalance: number;
  totalOrders: number;
  isBanned: boolean;
  gameUid: string;
  registeredAt: string;
  lastActive: string;
}

const INITIAL_USERS: GamerUser[] = [
  {
    id: "usr-1",
    name: "Sahan Jayakody",
    gmail: "sahan.gamer99@gmail.com",
    whatsapp: "+94 77 123 4567",
    walletBalance: 4250,
    totalOrders: 28,
    isBanned: false,
    gameUid: "FF: 893104921",
    registeredAt: "2024-02-14",
    lastActive: "10 mins ago",
  },
  {
    id: "usr-2",
    name: "Tharindu Wickrama",
    gmail: "tharindu.pubg@gmail.com",
    whatsapp: "+94 71 892 3401",
    walletBalance: 1200,
    totalOrders: 14,
    isBanned: false,
    gameUid: "PUBG: 512398412",
    registeredAt: "2024-03-22",
    lastActive: "2 hours ago",
  },
  {
    id: "usr-3",
    name: "Dinuka Fernando",
    gmail: "dinuka.cheatwatch@gmail.com",
    whatsapp: "+94 76 554 9912",
    walletBalance: 0,
    totalOrders: 3,
    isBanned: true,
    gameUid: "MLBB: 90214812",
    registeredAt: "2024-04-05",
    lastActive: "3 days ago",
  },
  {
    id: "usr-4",
    name: "Kavishka Senarath",
    gmail: "kavishka.fire@gmail.com",
    whatsapp: "+94 78 443 1188",
    walletBalance: 8600,
    totalOrders: 65,
    isBanned: false,
    gameUid: "FF: 198273645",
    registeredAt: "2024-01-10",
    lastActive: "Just now",
  },
  {
    id: "usr-5",
    name: "Maleesha Silva",
    gmail: "maleesha.topup@gmail.com",
    whatsapp: "+94 70 332 9900",
    walletBalance: 350,
    totalOrders: 9,
    isBanned: false,
    gameUid: "CODM: 67123984",
    registeredAt: "2024-05-12",
    lastActive: "1 day ago",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<GamerUser[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterState, setFilterState] = useState<"all" | "active" | "banned">("all");
  const [editingWalletUser, setEditingWalletUser] = useState<GamerUser | null>(null);
  const [walletAmount, setWalletAmount] = useState<number>(0);
  const [walletActionType, setWalletActionType] = useState<"add" | "set">("add");
  const [editingWhatsappUser, setEditingWhatsappUser] = useState<GamerUser | null>(null);
  const [newWhatsapp, setNewWhatsapp] = useState("");

  const handleToggleBan = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const updatedState = !u.isBanned;
          return { ...u, isBanned: updatedState };
        }
        return u;
      })
    );
  };

  const openWalletModal = (user: GamerUser) => {
    setEditingWalletUser(user);
    setWalletAmount(500);
    setWalletActionType("add");
  };

  const handleSaveWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWalletUser) return;

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === editingWalletUser.id) {
          const newBal =
            walletActionType === "add"
              ? u.walletBalance + Number(walletAmount)
              : Number(walletAmount);
          return { ...u, walletBalance: Math.max(0, newBal) };
        }
        return u;
      })
    );

    setEditingWalletUser(null);
  };

  const openWhatsappModal = (user: GamerUser) => {
    setEditingWhatsappUser(user);
    setNewWhatsapp(user.whatsapp);
  };

  const handleSaveWhatsapp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWhatsappUser) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingWhatsappUser.id ? { ...u, whatsapp: newWhatsapp.trim() } : u
      )
    );
    setEditingWhatsappUser(null);
  };

  const filteredUsers = users.filter((u) => {
    const matchesFilter =
      filterState === "all"
        ? true
        : filterState === "banned"
        ? u.isBanned
        : !u.isBanned;

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(query) ||
      u.gmail.toLowerCase().includes(query) ||
      u.whatsapp.toLowerCase().includes(query) ||
      u.gameUid.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Player Database</span>
            <span className="text-zinc-600">/</span>
            <span className="text-xs font-mono text-zinc-400">Account Management</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Users, WhatsApp & <span className="text-[#00ffff]">Wallets</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Search verified gamers, adjust player credit balances, edit WhatsApp delivery lines, and enforce bans.
          </p>
        </div>

        {/* Stats strip */}
        <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg text-xs font-mono">
          <div>
            <span className="text-zinc-500 block text-[10px]">TOTAL PLAYERS</span>
            <span className="text-white font-bold">{users.length}</span>
          </div>
          <div className="h-6 w-px bg-zinc-800" />
          <div>
            <span className="text-zinc-500 block text-[10px]">BANNED</span>
            <span className="text-red-400 font-bold">
              {users.filter((u) => u.isBanned).length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {(["all", "active", "banned"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterState(s)}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-lg transition-colors ${
                filterState === s
                  ? "bg-zinc-800 text-cyan-400 border border-cyan-500/40 font-bold"
                  : "bg-zinc-900/60 text-zinc-400 hover:text-white border border-transparent"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative min-w-[280px]">
          <input
            type="text"
            placeholder="Search Gmail, WhatsApp, UID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-zinc-800 bg-[#0d0d0d] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/90 text-xs font-mono uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Gamer Name</th>
                <th className="py-3.5 px-4 font-semibold">Gmail (Google Login)</th>
                <th className="py-3.5 px-4 font-semibold">WhatsApp Number</th>
                <th className="py-3.5 px-4 font-semibold">Wallet Balance</th>
                <th className="py-3.5 px-4 font-semibold">Game UID</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className={`hover:bg-zinc-900/40 transition-colors group ${
                    user.isBanned ? "bg-red-950/10 opacity-75" : ""
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                      {user.name}
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">
                      Orders: {user.totalOrders} · {user.lastActive}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono text-xs text-zinc-300">
                    <span className="text-cyan-400/90 hover:underline cursor-pointer">
                      {user.gmail}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-300">{user.whatsapp}</span>
                      <button
                        onClick={() => openWhatsappModal(user)}
                        className="text-[11px] text-zinc-500 hover:text-white"
                        title="Edit WhatsApp"
                      >
                        ✎
                      </button>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#ffeb3b] tabular-nums">
                        LKR {user.walletBalance.toLocaleString()}
                      </span>
                      <button
                        onClick={() => openWalletModal(user)}
                        className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-cyan-400 hover:bg-zinc-700 transition-colors"
                      >
                        Adjust
                      </button>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-mono text-xs text-zinc-400">
                    {user.gameUid}
                  </td>

                  <td className="py-4 px-4 font-mono text-xs">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs ${
                        user.isBanned
                          ? "bg-red-500/10 text-red-400 border border-red-500/30 font-bold"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {user.isBanned ? "Banned" : "Good Standing"}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleToggleBan(user.id)}
                      className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                        user.isBanned
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                          : "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                      }`}
                    >
                      {user.isBanned ? "Unban Player" : "Ban Player"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Wallet Modal */}
      {editingWalletUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-cyan-500/50 rounded-xl w-full max-w-md p-6 shadow-[0_0_50px_rgba(0,255,255,0.15)]">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white font-mono">
                Edit Wallet Balance
              </h3>
              <button
                onClick={() => setEditingWalletUser(null)}
                className="text-zinc-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400 mt-3 font-mono">
              Adjusting wallet funds for:{" "}
              <span className="text-cyan-400">{editingWalletUser.name}</span> ({editingWalletUser.gmail})
            </p>

            <form onSubmit={handleSaveWallet} className="mt-5 space-y-4">
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Current Balance:</span>
                <span className="text-base font-bold text-[#ffeb3b]">
                  LKR {editingWalletUser.walletBalance.toLocaleString()}
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Adjustment Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWalletActionType("add")}
                    className={`py-2 text-xs font-mono rounded-lg border transition-colors ${
                      walletActionType === "add"
                        ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50 font-bold"
                        : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                    }`}
                  >
                    + Add Top-up Credit
                  </button>
                  <button
                    type="button"
                    onClick={() => setWalletActionType("set")}
                    className={`py-2 text-xs font-mono rounded-lg border transition-colors ${
                      walletActionType === "set"
                        ? "bg-yellow-400/20 text-[#ffeb3b] border-yellow-400/50 font-bold"
                        : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                    }`}
                  >
                    = Set Exact Amount
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Amount in LKR
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  required
                  value={walletAmount}
                  onChange={(e) => setWalletAmount(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono font-bold"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingWalletUser(null)}
                  className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black transition-colors"
                >
                  Apply Balance Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit WhatsApp Modal */}
      {editingWhatsappUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-cyan-500/50 rounded-xl w-full max-w-md p-6 shadow-[0_0_50px_rgba(0,255,255,0.15)]">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white font-mono">
                Update Player WhatsApp
              </h3>
              <button
                onClick={() => setEditingWhatsappUser(null)}
                className="text-zinc-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveWhatsapp} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  WhatsApp Number (with Country Code)
                </label>
                <input
                  type="text"
                  required
                  value={newWhatsapp}
                  onChange={(e) => setNewWhatsapp(e.target.value)}
                  placeholder="+94 7X XXX XXXX"
                  className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingWhatsappUser(null)}
                  className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black transition-colors"
                >
                  Save WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
