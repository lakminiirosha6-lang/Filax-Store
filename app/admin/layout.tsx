import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPermissions } from "@/lib/roles";

export const metadata = {
  title: "Admin Console | Filax Store",
  description: "Secure gaming topup management portal for Filax Store",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // If not logged in, redirect to signin page
  if (!session || !session.user?.email) {
    redirect("/auth/signin?callbackUrl=/admin");
  }

  const permissions = getPermissions(session.user.email);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col md:flex-row font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#121212] border-b md:border-b-0 md:border-r border-zinc-800/80 p-5 flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
          <Link href="/admin" className="flex items-center gap-2 group">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-yellow-400 p-[1px] flex items-center justify-center">
              <span className="w-full h-full bg-[#0a0a0a] rounded-[7px] flex items-center justify-center text-cyan-400 font-bold text-base group-hover:text-yellow-400 transition-colors">
                F
              </span>
            </span>
            <div>
              <span className="font-extrabold tracking-tight text-white block text-base group-hover:text-cyan-400 transition-colors">
                FILAX <span className="text-[#ffeb3b]">STORE</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500">
                ADMIN PANEL
              </span>
            </div>
          </Link>
        </div>

        {/* User Card */}
        <div className="my-5 p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono">Status: Authenticated</span>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
              {permissions.displayRole}
            </span>
          </div>
          <div className="text-xs font-mono text-zinc-200 truncate mt-1" title={session.user.email}>
            {session.user.email}
          </div>
          {permissions.isSuperAdmin && (
            <div className="mt-2 text-[10px] font-mono text-yellow-400/90 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20 flex items-center gap-1">
              <span>★</span> Super Owner Authority Active
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 text-sm font-medium">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-all border border-transparent hover:border-zinc-700/60"
          >
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-all border border-transparent hover:border-zinc-700/60"
          >
            <span>Products</span>
          </Link>

          <Link
            href="/admin/payments"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-all border border-transparent hover:border-zinc-700/60"
          >
            <span>Payments</span>
          </Link>

          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-all border border-transparent hover:border-zinc-700/60"
          >
            <span>Users & Wallets</span>
          </Link>

          <Link
            href="/admin/team"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-all border border-transparent hover:border-zinc-700/60"
          >
            <span>Team & Permissions</span>
          </Link>
        </nav>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-zinc-800/80 space-y-2 text-xs">
          <Link
            href="/"
            className="block text-center py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors font-medium"
          >
            ← View Public Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-zinc-800/80 px-6 flex items-center justify-between bg-[#0e0e0e]/90 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-400">FILAX OS</span>
            <span className="text-zinc-600">/</span>
            <span className="text-sm font-semibold text-zinc-200">Management Console</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-cyan-400 border border-cyan-500/30 bg-cyan-950/30 px-2.5 py-1 rounded">
              Role: {permissions.displayRole}
            </span>
            <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
              {session.user.email}
            </span>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
