import React, { useState, useEffect } from "react";
import { GamerUser } from "../types";
import { db, collection, getDocs } from "../firebase";

interface AdminUsersProps {
  users: GamerUser[];
  onUpdateUsers: (updater: (prev: GamerUser[]) => GamerUser[]) => void;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({
  users,
  onUpdateUsers,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterState, setFilterState] = useState<"all" | "active" | "banned">("all");
  const [editingWalletUser, setEditingWalletUser] = useState<GamerUser | null>(null);
  const [walletAmount, setWalletAmount] = useState<number>(500);
  const [walletActionType, setWalletActionType] = useState<"add" | "set">("add");
  const [editingWhatsappUser, setEditingWhatsappUser] = useState<GamerUser | null>(null);
  const [newWhatsapp, setNewWhatsapp] = useState("");
  const [firestoreUsersLoaded, setFirestoreUsersLoaded] = useState(false);

  // Sync users from Firestore users collection
  useEffect(() => {
    async function fetchFirestoreUsers() {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        if (!querySnapshot.empty) {
          const fetched: GamerUser[] = [];
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            fetched.push({
              id: docSnap.id,
              name: data.displayName || "Gamer",
              gmail: data.email || "",
              whatsapp: data.whatsappNumber || "0771234567",
              walletBalance: data.walletBalance || 0,
              totalOrders: data.totalOrders || 1,
              isBanned: data.isBanned || false,
              gameUid: data.gameUid || "UID: " + docSnap.id.substring(0, 8),
              registeredAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString().split("T")[0] : "2024-05-10",
              lastActive: data.lastLogin?.toDate ? data.lastLogin.toDate().toLocaleString() : "Recently",
            });
          });

          // Merge without duplicates
          onUpdateUsers((prev) => {
            const existingEmails = new Set(prev.map((u) => u.gmail.toLowerCase()));
            const newUsers = fetched.filter((u) => !existingEmails.has(u.gmail.toLowerCase()));
            return [...newUsers, ...prev];
          });
        }
      } catch (err) {
        console.warn("Could not fetch users directly from Firestore:", err);
      } finally {
        setFirestoreUsersLoaded(true);
      }
    }

    if (!firestoreUsersLoaded) {
      fetchFirestoreUsers();
    }
  }, [firestoreUsersLoaded, onUpdateUsers]);

  const handleToggleBan = (id: string) => {
    onUpdateUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isBanned: !u.isBanned } : u))
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

    onUpdateUsers((prev) =>
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

    onUpdateUsers((prev) =>
      prev.map((u) =>
        u.id === editingWhatsappUser.id ? { ...u, whatsapp: newWhatsapp.trim() } : u
      )
    );
    setEditingWhatsappUser(null);
  };

  // Export to CSV Function
  const exportToCSV = () => {
    const headers = ["Photo/Avatar", "Name", "Gmail", "WhatsApp Number", "WhatsApp wa.me Link", "Wallet Balance (LKR)", "Status", "Joined Date", "Last Login"];
    
    const rows = filtered.map((u) => {
      const cleanWa = u.whatsapp.replace(/[\s-]/g, "");
      const waLink = cleanWa.startsWith("07") ? `https://wa.me/94${cleanWa.substring(1)}` : `https://wa.me/${cleanWa}`;
      return [
        `"${u.name.charAt(0)}"`,
        `"${u.name}"`,
        `"${u.gmail}"`,
        `"${u.whatsapp}"`,
        `"${waLink}"`,
        `"${u.walletBalance}"`,
        `"${u.isBanned ? "Banned" : "Active"}"`,
        `"${u.registeredAt}"`,
        `"${u.lastActive}"`,
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `filax_store_users_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = users.filter((u) => {
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
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              Firestore Player Directory
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-xs font-mono text-zinc-400">users/{'{uid}'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Users, WhatsApp & <span className="text-[#00ffff]">Directory</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Live registered gamers, clickable Gmail mailto links, clickable WhatsApp chat links, and CSV export.
          </p>
        </div>

        {/* Action button & Total Users count */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer"
            title="Download entire user database as CSV file"
          >
            <span>📥</span>
            <span>Export to CSV</span>
          </button>

          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-xs font-mono">
            <div>
              <span className="text-zinc-500 block text-[10px]">TOTAL USERS</span>
              <span className="text-white font-bold text-sm">{users.length}</span>
            </div>
            <div className="h-6 w-px bg-zinc-800" />
            <div>
              <span className="text-zinc-500 block text-[10px]">BANNED</span>
              <span className="text-red-400 font-bold text-sm">
                {users.filter((u) => u.isBanned).length}
              </span>
            </div>
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
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
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
            placeholder="Search Name, Gmail, WhatsApp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>
      </div>

      {/* Table: Photo | Name | Gmail (clickable mailto:) | WhatsApp Number (clickable wa.me) | Joined Date | Last Login */}
      <div className="rounded-xl border border-zinc-800 bg-[#0d0d0d] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/90 text-xs font-mono uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Photo</th>
                <th className="py-3.5 px-4 font-semibold">Name</th>
                <th className="py-3.5 px-4 font-semibold">Gmail (Click to Mail)</th>
                <th className="py-3.5 px-4 font-semibold">WhatsApp (Click to Chat)</th>
                <th className="py-3.5 px-4 font-semibold">Joined Date</th>
                <th className="py-3.5 px-4 font-semibold">Last Login</th>
                <th className="py-3.5 px-4 font-semibold">Wallet</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filtered.map((user) => {
                // Compute clean wa.me link
                const rawNum = user.whatsapp.replace(/[\s-]/g, "");
                const waLink = rawNum.startsWith("07")
                  ? `https://wa.me/94${rawNum.substring(1)}`
                  : `https://wa.me/${rawNum}`;

                return (
                  <tr
                    key={user.id}
                    className={`hover:bg-zinc-900/40 transition-colors group ${
                      user.isBanned ? "bg-red-950/15 opacity-80" : ""
                    }`}
                  >
                    {/* 1. Photo */}
                    <td className="py-4 px-4">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400/20 to-yellow-400/20 border border-cyan-400/30 flex items-center justify-center font-mono font-bold text-xs text-cyan-300">
                        {user.name.charAt(0)}
                      </div>
                    </td>

                    {/* 2. Name */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                        {user.name}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">
                        Orders: {user.totalOrders}
                      </span>
                    </td>

                    {/* 3. Gmail (clickable mailto:) */}
                    <td className="py-4 px-4 font-mono text-xs">
                      <a
                        href={`mailto:${user.gmail}?subject=Filax%20Store%20Top-up%20Support`}
                        className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1.5"
                        title="Click to open email client"
                      >
                        <span>✉️</span>
                        <span>{user.gmail}</span>
                      </a>
                    </td>

                    {/* 4. WhatsApp Number (clickable https://wa.me/94...) */}
                    <td className="py-4 px-4 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-colors flex items-center gap-1.5 font-bold"
                          title="Click to start WhatsApp chat"
                        >
                          <span>💬</span>
                          <span>{user.whatsapp}</span>
                        </a>
                        <button
                          onClick={() => openWhatsappModal(user)}
                          className="text-[11px] text-zinc-500 hover:text-white cursor-pointer"
                          title="Edit WhatsApp number"
                        >
                          ✎
                        </button>
                      </div>
                    </td>

                    {/* 5. Joined Date */}
                    <td className="py-4 px-4 font-mono text-xs text-zinc-400">
                      {user.registeredAt}
                    </td>

                    {/* 6. Last Login */}
                    <td className="py-4 px-4 font-mono text-xs text-zinc-400">
                      {user.lastActive}
                    </td>

                    {/* Wallet */}
                    <td className="py-4 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#ffeb3b] tabular-nums">
                          LKR {user.walletBalance.toLocaleString()}
                        </span>
                        <button
                          onClick={() => openWalletModal(user)}
                          className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-cyan-400 hover:bg-zinc-700 transition-colors cursor-pointer"
                        >
                          ±
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right font-mono text-xs">
                      <button
                        onClick={() => handleToggleBan(user.id)}
                        className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                          user.isBanned
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                            : "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                        }`}
                      >
                        {user.isBanned ? "Unban" : "Ban"}
                      </button>
                    </td>
                  </tr>
                );
              })}
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
                className="text-zinc-400 hover:text-white font-mono text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400 mt-3 font-mono">
              Adjusting credits for:{" "}
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
                    className={`py-2 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
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
                    className={`py-2 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
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
                  className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black transition-colors cursor-pointer"
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
                className="text-zinc-400 hover:text-white font-mono text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveWhatsapp} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  WhatsApp Number (Format: 07XXXXXXXX)
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={newWhatsapp}
                  onChange={(e) => setNewWhatsapp(e.target.value)}
                  placeholder="077XXXXXXX"
                  className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingWhatsappUser(null)}
                  className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black transition-colors cursor-pointer"
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
};
