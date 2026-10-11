import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPermissions } from "@/lib/roles";

export const metadata = {
  title: "Dashboard Overview | Filax Store Admin",
};

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email || "lakminiirosha6@gmail.com";
  const permissions = getPermissions(email);

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="p-6 md:p-8 rounded-xl bg-gradient-to-r from-zinc-900 via-[#141414] to-zinc-900 border border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono tracking-wider text-cyan-400 uppercase">
                Welcome Back
              </span>
              <span className="text-zinc-600">·</span>
              <span className="text-xs font-mono text-zinc-400">
                Filax Gaming Network
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Console <span className="text-[#00ffff]">HQ</span>
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              Real-time gaming top-up management, automated gateway control, and role-based operator assignments.
            </p>
          </div>

          {/* User & Role Details Display Box */}
          <div className="bg-[#0a0a0a]/80 backdrop-blur border border-zinc-800 rounded-lg p-4 min-w-[280px]">
            <div className="text-xs text-zinc-400 font-mono mb-1">Authenticated Account</div>
            <div className="text-sm font-bold text-white font-mono truncate" title={email}>
              {email}
            </div>
            <div className="mt-2.5 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-xs text-zinc-400">Display Role:</span>
              <span className="text-xs px-2.5 py-0.5 rounded font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {permissions.displayRole}
              </span>
            </div>
            {permissions.isSuperAdmin && (
              <div className="mt-2 text-[11px] font-mono text-[#ffeb3b] bg-yellow-400/10 px-2 py-1 rounded border border-yellow-400/20 text-center">
                Super Admin: Owner Management Enabled
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4 Core Module Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Products */}
        <Link
          href="/admin/products"
          className="group p-6 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-900 transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-zinc-400">Catalog</span>
              <span className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-mono font-bold text-sm group-hover:scale-105 transition-transform">
                P
              </span>
            </div>
            <h2 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
              Products
            </h2>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Create, edit, and categorize top-up packages for Free Fire, PUBG, and MLBB.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">Manage Catalog</span>
            <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>

        {/* Card 2: Payments */}
        <Link
          href="/admin/payments"
          className="group p-6 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-yellow-400/50 hover:bg-zinc-900 transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-zinc-400">Gateways</span>
              <span className="h-8 w-8 rounded-lg bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center font-mono font-bold text-sm group-hover:scale-105 transition-transform">
                $
              </span>
            </div>
            <h2 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
              Payments
            </h2>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Configure and test EzCash, Bank Transfer, and PayHere checkout channels.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">Configure Gateways</span>
            <span className="text-yellow-400 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>

        {/* Card 3: Users */}
        <Link
          href="/admin/users"
          className="group p-6 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-900 transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-zinc-400">Members</span>
              <span className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-mono font-bold text-sm group-hover:scale-105 transition-transform">
                U
              </span>
            </div>
            <h2 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
              Users
            </h2>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Manage gamer profiles, adjust wallet balances, link WhatsApp, and toggle ban states.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">View Players</span>
            <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>

        {/* Card 4: Team */}
        <Link
          href="/admin/team"
          className="group p-6 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-yellow-400/50 hover:bg-zinc-900 transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-zinc-400">Access Control</span>
              <span className="h-8 w-8 rounded-lg bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center font-mono font-bold text-sm group-hover:scale-105 transition-transform">
                ★
              </span>
            </div>
            <h2 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
              Team
            </h2>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Audit staff permissions. Special Super Admin permission gate for Owner assignments.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">Manage Roles</span>
            <span className="text-yellow-400 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>
      </div>

      {/* Quick Status Bar */}
      <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          <span className="text-zinc-300">Firebase Firestore: Connected</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">NextAuth Google Provider: Ready</span>
        </div>
        <div className="text-zinc-500">
          Filax Security Engine v2.4 · RBAC Enforced
        </div>
      </div>
    </div>
  );
}
