import React from "react";
import { getPermissions } from "../../lib/roles";
import { TopupPackage, PaymentChannel, GamerUser, TeamMember } from "../types";

interface AdminDashboardProps {
  currentEmail: string;
  packages: TopupPackage[];
  paymentGateways: PaymentChannel[];
  users: GamerUser[];
  team: TeamMember[];
  onNavigateTab: (tab: "products" | "payments" | "users" | "team") => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentEmail,
  packages,
  paymentGateways,
  users,
  team,
  onNavigateTab,
}) => {
  const permissions = getPermissions(currentEmail);
  const activeGatewaysCount = paymentGateways.filter((g) => g.isEnabled).length;
  const inStockPackagesCount = packages.filter((p) => p.inStock).length;
  const activePlayersCount = users.filter((u) => !u.isBanned).length;

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-zinc-900 via-[#141414] to-zinc-900 border border-zinc-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono uppercase text-[#00ffff] tracking-widest bg-cyan-950/50 border border-cyan-500/30 px-2.5 py-0.5 rounded">
                Filax Admin Console
              </span>
              <span className="text-xs font-mono text-zinc-500">· System Online</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
              Operations <span className="text-[#00ffff]">HQ</span>
            </h1>
            <p className="text-xs md:text-sm text-zinc-400 mt-2 max-w-xl leading-relaxed">
              Real-time monitoring of gaming diamond orders, merchant gateway balances, player wallets, and staff access permissions.
            </p>
          </div>

          {/* User & Role Details Box */}
          <div className="bg-[#0a0a0a]/90 backdrop-blur border border-zinc-800 rounded-xl p-5 min-w-[300px]">
            <div className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider mb-1">
              Active Session
            </div>
            <div className="text-sm font-bold text-white font-mono truncate" title={currentEmail}>
              {currentEmail}
            </div>
            <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-mono">Display Role:</span>
              <span className="text-xs px-2.5 py-0.5 rounded font-mono font-bold bg-cyan-500/15 text-[#00ffff] border border-cyan-500/30">
                {permissions.displayRole}
              </span>
            </div>
            {permissions.isSuperAdmin && (
              <div className="mt-2.5 text-[11px] font-mono text-[#ffeb3b] bg-yellow-400/10 px-2.5 py-1 rounded border border-yellow-400/25 flex items-center justify-center gap-1.5 font-semibold">
                <span>★</span> Super Admin: Can Add New Owners
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4 Core Module Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Products Card */}
        <div
          onClick={() => onNavigateTab("products")}
          className="group p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-cyan-400/50 hover:bg-zinc-900/90 transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-zinc-400">Inventory</span>
              <span className="h-9 w-9 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-mono font-bold text-sm group-hover:scale-105 transition-transform">
                💎
              </span>
            </div>
            <h2 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
              Products
            </h2>
            <div className="text-2xl font-black text-[#ffeb3b] font-mono mt-2 tabular-nums">
              {packages.length}{" "}
              <span className="text-xs text-zinc-400 font-normal font-sans">
                ({inStockPackagesCount} in stock)
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Free Fire, PUBG, MLBB diamond packs & pricing formulas.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-cyan-400">
            <span>Manage Catalog</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>

        {/* Payments Card */}
        <div
          onClick={() => onNavigateTab("payments")}
          className="group p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-yellow-400/50 hover:bg-zinc-900/90 transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-zinc-400">Gateways</span>
              <span className="h-9 w-9 rounded-lg bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center font-mono font-bold text-sm group-hover:scale-105 transition-transform">
                💳
              </span>
            </div>
            <h2 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
              Payments
            </h2>
            <div className="text-2xl font-black text-white font-mono mt-2 tabular-nums">
              {activeGatewaysCount}{" "}
              <span className="text-xs text-zinc-400 font-normal font-sans">
                Active Channels
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              EzCash merchant line, Bank accounts & PayHere integration.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-yellow-400">
            <span>Configure Channels</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>

        {/* Users Card */}
        <div
          onClick={() => onNavigateTab("users")}
          className="group p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-cyan-400/50 hover:bg-zinc-900/90 transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-zinc-400">Gamers</span>
              <span className="h-9 w-9 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-mono font-bold text-sm group-hover:scale-105 transition-transform">
                👥
              </span>
            </div>
            <h2 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
              Users & Wallets
            </h2>
            <div className="text-2xl font-black text-[#00ffff] font-mono mt-2 tabular-nums">
              {users.length}{" "}
              <span className="text-xs text-zinc-400 font-normal font-sans">
                ({activePlayersCount} verified)
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Player Gmails, WhatsApp delivery lines & wallet credits.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-cyan-400">
            <span>Inspect Players</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>

        {/* Team Card */}
        <div
          onClick={() => onNavigateTab("team")}
          className="group p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-yellow-400/50 hover:bg-zinc-900/90 transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-zinc-400">Authority</span>
              <span className="h-9 w-9 rounded-lg bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center font-mono font-bold text-sm group-hover:scale-105 transition-transform">
                ★
              </span>
            </div>
            <h2 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
              Team & Roles
            </h2>
            <div className="text-2xl font-black text-[#ffeb3b] font-mono mt-2 tabular-nums">
              {team.length}{" "}
              <span className="text-xs text-zinc-400 font-normal font-sans">
                Operators
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Super Admin gate for Owner creation & staff permissions.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-yellow-400">
            <span>Audit Permissions</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>

      {/* Security Invariants & Overview Strip */}
      <div className="rounded-xl border border-zinc-800 bg-[#0d0d0d] p-6 space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 pb-2 border-b border-zinc-800 flex items-center justify-between">
          <span>Security Invariants & Cloud Connections</span>
          <span className="text-cyan-400">Status: Enforced</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
            <span className="text-zinc-500 block mb-1">SUPER ADMIN EMAIL</span>
            <span className="text-yellow-400 font-bold">lakminiirosha6@gmail.com</span>
            <span className="text-[11px] text-zinc-400 block mt-1">Display Role: "Admin"</span>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
            <span className="text-zinc-500 block mb-1">OWNER PROVISIONING RULE</span>
            <span className="text-cyan-400 font-bold">SUPER POWER GATED</span>
            <span className="text-[11px] text-zinc-400 block mt-1">No other admin can add owners</span>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
            <span className="text-zinc-500 block mb-1">FIRESTORE & NEXTAUTH</span>
            <span className="text-emerald-400 font-bold">READY FOR VERCEL</span>
            <span className="text-[11px] text-zinc-400 block mt-1">Full-stack App Router codebase</span>
          </div>
        </div>
      </div>
    </div>
  );
};
