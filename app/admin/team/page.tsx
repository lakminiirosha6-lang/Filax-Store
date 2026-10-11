"use client";

import React, { useState, useEffect } from "react";
import { SUPER_ADMIN_EMAIL, getPermissions } from "@/lib/roles";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "owner" | "moderator";
  displayRole: "Admin" | "Owner" | "Moderator";
  addedAt: string;
  isSuperAdminIdentity?: boolean;
}

const INITIAL_TEAM: TeamMember[] = [
  {
    id: "super-1",
    name: "Lakmini Irosha",
    email: "lakminiirosha6@gmail.com",
    role: "admin",
    displayRole: "Admin", // CRITICAL: Display role is strictly "Admin"
    addedAt: "2024-01-01",
    isSuperAdminIdentity: true,
  },
  {
    id: "admin-2",
    name: "Kasun Perera",
    email: "kasun.admin@filaxstore.com",
    role: "admin",
    displayRole: "Admin",
    addedAt: "2024-04-12",
  },
  {
    id: "owner-1",
    name: "Danushka Silva",
    email: "danushka.owner@filaxstore.com",
    role: "owner",
    displayRole: "Owner",
    addedAt: "2024-03-15",
  },
  {
    id: "mod-1",
    name: "Nuwan Bandara",
    email: "nuwan.support@filaxstore.com",
    role: "moderator",
    displayRole: "Moderator",
    addedAt: "2024-05-20",
  },
];

export default function TeamManagementPage() {
  // In Next.js client, this can come from useSession()
  // We provide live session switching so the user can test lakminiirosha6@gmail.com vs another admin!
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("lakminiirosha6@gmail.com");
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [isAddOwnerModalOpen, setIsAddOwnerModalOpen] = useState(false);
  const [newOwnerName, setNewOwnerName] = useState("");
  const [newOwnerEmail, setNewOwnerEmail] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const permissions = getPermissions(currentUserEmail);
  const isSuperAdminUser = currentUserEmail.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

  const handleOpenAddOwner = () => {
    if (!isSuperAdminUser) {
      setActionError("Access Denied: Only Super Admin (lakminiirosha6@gmail.com) is authorized to add or assign Owners.");
      return;
    }
    setActionError(null);
    setIsAddOwnerModalOpen(true);
  };

  const handleCreateOwner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdminUser) {
      setActionError("Access Denied: Unauthorized attempt to create an Owner.");
      setIsAddOwnerModalOpen(false);
      return;
    }

    if (!newOwnerEmail || !newOwnerName) return;

    const newMember: TeamMember = {
      id: "owner-" + Date.now(),
      name: newOwnerName,
      email: newOwnerEmail.trim(),
      role: "owner",
      displayRole: "Owner",
      addedAt: new Date().toISOString().split("T")[0],
    };

    setTeam((prev) => [...prev, newMember]);
    setNewOwnerName("");
    setNewOwnerEmail("");
    setIsAddOwnerModalOpen(false);
    setSuccessMessage(`Successfully granted Owner permissions to ${newOwnerEmail}`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Security & Roles</span>
            <span className="text-zinc-600">/</span>
            <span className="text-xs font-mono text-zinc-400">Team Matrix</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Team & <span className="text-[#00ffff]">Access Control</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Role definitions, operator access controls, and protected Owner creation privileges.
          </p>
        </div>

        {/* Active Operator Status */}
        <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-lg flex items-center gap-3">
          <div className="text-xs">
            <span className="text-zinc-500 font-mono block">Logged-In Operator:</span>
            <span className="font-mono text-xs text-white truncate max-w-[220px] block font-bold">
              {currentUserEmail}
            </span>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded font-mono font-bold ${
            isSuperAdminUser
              ? "bg-yellow-400/20 text-[#ffeb3b] border border-yellow-400/40"
              : "bg-cyan-500/20 text-[#00ffff] border border-cyan-500/40"
          }`}>
            Role: {permissions.displayRole}
          </span>
        </div>
      </div>

      {/* Action Banner / Alerts */}
      {actionError && (
        <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/40 text-red-200 text-sm font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-bold">⛔</span>
            <span>{actionError}</span>
          </div>
          <button
            onClick={() => setActionError(null)}
            className="text-xs text-red-400 hover:text-white ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-sm font-mono flex items-center gap-2">
          <span className="text-emerald-400 font-bold">✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-xs font-mono text-zinc-400">
          Showing <span className="text-white font-bold">{team.length}</span> verified store operators
        </div>

        {/* CRITICAL SPECIAL REQUIREMENT:
            Only lakminiirosha6@gmail.com sees "Add New Owner".
            If another user is logged in, hide or show "Access Denied" if attempted! */}
        <div className="flex items-center gap-3">
          {isSuperAdminUser ? (
            <button
              onClick={handleOpenAddOwner}
              className="px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider rounded-lg bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 text-black hover:brightness-110 transition-all shadow-[0_0_20px_rgba(255,235,59,0.3)] flex items-center gap-2"
            >
              <span>★</span>
              <span>Add New Owner</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-500">
                Owner Provisioning Restricted
              </span>
              <button
                onClick={handleOpenAddOwner}
                className="px-3 py-1.5 text-xs font-mono rounded bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-zinc-800/80 transition-colors border border-zinc-700/60"
                title="Attempt action to test security gate"
              >
                Add Owner (Test Gate)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Team Members Table */}
      <div className="rounded-xl border border-zinc-800 bg-[#0d0d0d] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/90 text-xs font-mono uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Operator</th>
                <th className="py-3.5 px-4 font-semibold">Email</th>
                <th className="py-3.5 px-4 font-semibold">Display Role</th>
                <th className="py-3.5 px-4 font-semibold">Super Power</th>
                <th className="py-3.5 px-4 font-semibold">Added Date</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {team.map((member) => {
                const isSuperEmail = member.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

                return (
                  <tr
                    key={member.id}
                    className="hover:bg-zinc-900/40 transition-colors group"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                          isSuperEmail
                            ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                            : member.role === "admin"
                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                            : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                        }`}>
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                            {member.name}
                          </div>
                          {isSuperEmail && (
                            <span className="text-[10px] font-mono text-yellow-400/80">
                              System Architect
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-xs text-zinc-300">
                      {member.email}
                    </td>

                    <td className="py-4 px-4 font-mono text-xs">
                      {/* CRITICAL: lakminiirosha6@gmail.com displays "Admin" as requested */}
                      <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold border ${
                        member.displayRole === "Admin"
                          ? "bg-cyan-500/10 text-[#00ffff] border-cyan-500/30"
                          : member.displayRole === "Owner"
                          ? "bg-yellow-400/10 text-[#ffeb3b] border-yellow-400/30"
                          : "bg-zinc-800 text-zinc-400 border-zinc-700"
                      }`}>
                        {member.displayRole}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono text-xs">
                      {isSuperEmail ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                          <span>★</span> Can Add Owner & Admin
                        </span>
                      ) : (
                        <span className="text-zinc-500 text-xs">
                          Standard Privileges
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 font-mono text-xs text-zinc-400">
                      {member.addedAt}
                    </td>

                    <td className="py-4 px-4 text-right">
                      {isSuperEmail ? (
                        <span className="text-[11px] font-mono text-zinc-500 italic">
                          Protected System Root
                        </span>
                      ) : (
                        <button
                          disabled={!isSuperAdminUser}
                          onClick={() => {
                            if (!isSuperAdminUser) {
                              setActionError("Access Denied: Only Super Admin can modify operators.");
                              return;
                            }
                            setTeam((prev) => prev.filter((m) => m.id !== member.id));
                          }}
                          className={`text-xs font-mono px-2 py-1 rounded transition-colors ${
                            isSuperAdminUser
                              ? "text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-500/20"
                              : "text-zinc-600 cursor-not-allowed"
                          }`}
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Super Admin to Add Owner */}
      {isAddOwnerModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-yellow-400/50 rounded-xl w-full max-w-md p-6 shadow-[0_0_50px_rgba(255,235,59,0.15)] relative">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-base">★</span>
                <h3 className="text-base font-bold text-white font-mono">
                  Provision New Owner
                </h3>
              </div>
              <button
                onClick={() => setIsAddOwnerModalOpen(false)}
                className="text-zinc-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
              Super Admin Authorization verified for <span className="text-yellow-400 font-mono">lakminiirosha6@gmail.com</span>. Assigning an Owner gives high-level store ownership.
            </p>

            <form onSubmit={handleCreateOwner} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ruwan Jayasinghe"
                  value={newOwnerName}
                  onChange={(e) => setNewOwnerName(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Google Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="owner.email@gmail.com"
                  value={newOwnerEmail}
                  onChange={(e) => setNewOwnerEmail(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Assigned Privilege Level
                </label>
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-between">
                  <span className="text-xs font-bold text-[#ffeb3b] font-mono">
                    Owner
                  </span>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    Full Store Oversight
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddOwnerModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black transition-colors"
                >
                  Confirm & Grant Owner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
