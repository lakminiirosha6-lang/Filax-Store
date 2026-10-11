import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Storefront } from "./components/Storefront";
import { AdminDashboard } from "./components/AdminDashboard";
import { AdminProducts } from "./components/AdminProducts";
import { AdminPayments } from "./components/AdminPayments";
import { AdminUsers } from "./components/AdminUsers";
import { AdminTeam } from "./components/AdminTeam";
import { GitHubRepoViewer } from "./components/GitHubRepoViewer";
import {
  INITIAL_PACKAGES,
  INITIAL_PAYMENTS,
  INITIAL_USERS_DATA,
  INITIAL_TEAM_MEMBERS,
} from "./data/mockData";
import { TopupPackage, PaymentChannel, GamerUser, TeamMember } from "./types";

function MainAppLayout() {
  const {
    currentUser,
    userEmail,
    userName,
    userPhoto,
    whatsappNumber,
    isSuperAdmin,
    displayRole,
    logout,
    simulateEmail,
  } = useAuth();

  const [currentView, setCurrentView] = useState<
    | "storefront"
    | "admin-dashboard"
    | "admin-products"
    | "admin-payments"
    | "admin-users"
    | "admin-team"
    | "github-repo"
  >("storefront");

  // Core application state
  const [packages, setPackages] = useState<TopupPackage[]>(() => {
    const saved = localStorage.getItem("filax_packages");
    return saved ? JSON.parse(saved) : INITIAL_PACKAGES;
  });

  const [paymentGateways, setPaymentGateways] = useState<PaymentChannel[]>(() => {
    const saved = localStorage.getItem("filax_payments");
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [users, setUsers] = useState<GamerUser[]>(() => {
    const saved = localStorage.getItem("filax_users");
    return saved ? JSON.parse(saved) : INITIAL_USERS_DATA;
  });

  const [team, setTeam] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem("filax_team");
    return saved ? JSON.parse(saved) : INITIAL_TEAM_MEMBERS;
  });

  // Persist modifications to localStorage
  useEffect(() => {
    localStorage.setItem("filax_packages", JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem("filax_payments", JSON.stringify(paymentGateways));
  }, [paymentGateways]);

  useEffect(() => {
    localStorage.setItem("filax_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("filax_team", JSON.stringify(team));
  }, [team]);

  const isAdminView =
    currentView === "admin-dashboard" ||
    currentView === "admin-products" ||
    currentView === "admin-payments" ||
    currentView === "admin-users" ||
    currentView === "admin-team";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Universal Top Navigation Bar */}
      <header className="border-b border-zinc-800/80 bg-[#0c0c0c]/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => setCurrentView("storefront")}
            className="flex items-center gap-2.5 text-left shrink-0 group cursor-pointer"
          >
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-yellow-400 p-[1px] flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.2)]">
              <span className="w-full h-full bg-[#0a0a0a] rounded-[7px] flex items-center justify-center text-cyan-400 font-black text-sm group-hover:text-yellow-400 transition-colors">
                F
              </span>
            </span>
            <span className="font-black tracking-tight text-white text-lg whitespace-nowrap">
              FILAX <span className="text-[#ffeb3b]">STORE</span>
            </span>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-mono font-medium">
            <button
              onClick={() => setCurrentView("storefront")}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === "storefront"
                  ? "bg-zinc-800 text-cyan-400 border border-cyan-500/30 font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Storefront
            </button>

            <button
              onClick={() => setCurrentView("admin-dashboard")}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === "admin-dashboard"
                  ? "bg-zinc-800 text-yellow-400 border border-yellow-400/30 font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Admin HQ
            </button>

            <button
              onClick={() => setCurrentView("admin-products")}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === "admin-products"
                  ? "bg-zinc-800 text-cyan-400 border border-cyan-500/30 font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Products
            </button>

            <button
              onClick={() => setCurrentView("admin-payments")}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === "admin-payments"
                  ? "bg-zinc-800 text-yellow-400 border border-yellow-400/30 font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Payments
            </button>

            <button
              onClick={() => setCurrentView("admin-users")}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === "admin-users"
                  ? "bg-zinc-800 text-cyan-400 border border-cyan-500/30 font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Users & Wallets
            </button>

            <button
              onClick={() => setCurrentView("admin-team")}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === "admin-team"
                  ? "bg-zinc-800 text-yellow-400 border border-yellow-400/30 font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Team & Roles
            </button>

            <button
              onClick={() => setCurrentView("github-repo")}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === "github-repo"
                  ? "bg-cyan-500/20 text-[#00ffff] border border-cyan-500/40 font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Next.js Code
            </button>
          </nav>

          {/* Zone 3: HEADER - User Photo + Name + WhatsApp + Logout Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* User Profile Badge */}
            <div className="flex items-center gap-2 sm:gap-3 p-1 sm:p-1.5 sm:px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono">
              {/* Photo */}
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt={userName}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full border border-cyan-400/60 object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-yellow-400 p-[1px] flex items-center justify-center">
                  <div className="w-full h-full bg-[#0a0a0a] rounded-full flex items-center justify-center text-cyan-400 font-bold text-xs">
                    {userName.charAt(0)}
                  </div>
                </div>
              )}

              {/* Name & Role */}
              <div className="hidden sm:block text-left">
                <div className="text-white font-bold truncate max-w-[140px] flex items-center gap-1.5">
                  <span>{userName}</span>
                  {isSuperAdmin && (
                    <span className="text-yellow-400 text-xs" title="Super Admin Power Active">
                      ★
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-zinc-400 flex items-center gap-1.5">
                  <span className="text-cyan-400 font-bold">Role: {displayRole}</span>
                  {whatsappNumber && (
                    <>
                      <span>·</span>
                      <span className="text-emerald-400">{whatsappNumber}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-red-950/60 hover:text-red-300 hover:border-red-500/40 text-xs font-mono text-zinc-300 border border-zinc-700 transition-colors cursor-pointer flex items-center gap-1.5"
              title="Sign Out of Filax Store"
            >
              <span>Logout</span>
              <span className="text-[10px]">🚪</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Subnav Strip */}
      {isAdminView && (
        <div className="bg-[#111111] border-b border-zinc-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs font-mono overflow-x-auto">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <span className="text-zinc-500">ADMIN SECTIONS:</span>
            <button
              onClick={() => setCurrentView("admin-dashboard")}
              className={`hover:text-white cursor-pointer ${currentView === "admin-dashboard" ? "text-yellow-400 font-bold" : "text-zinc-400"}`}
            >
              Overview
            </button>
            <span className="text-zinc-700">/</span>
            <button
              onClick={() => setCurrentView("admin-products")}
              className={`hover:text-white cursor-pointer ${currentView === "admin-products" ? "text-cyan-400 font-bold" : "text-zinc-400"}`}
            >
              Products
            </button>
            <span className="text-zinc-700">/</span>
            <button
              onClick={() => setCurrentView("admin-payments")}
              className={`hover:text-white cursor-pointer ${currentView === "admin-payments" ? "text-yellow-400 font-bold" : "text-zinc-400"}`}
            >
              Payments
            </button>
            <span className="text-zinc-700">/</span>
            <button
              onClick={() => setCurrentView("admin-users")}
              className={`hover:text-white cursor-pointer ${currentView === "admin-users" ? "text-cyan-400 font-bold" : "text-zinc-400"}`}
            >
              Users (Firestore)
            </button>
            <span className="text-zinc-700">/</span>
            <button
              onClick={() => setCurrentView("admin-team")}
              className={`hover:text-white cursor-pointer ${currentView === "admin-team" ? "text-yellow-400 font-bold" : "text-zinc-400"}`}
            >
              Team (Super Gate)
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 shrink-0 text-zinc-500">
            <span>Logged in: {userEmail}</span>
            <span>·</span>
            <span>WhatsApp: {whatsappNumber || "Verified"}</span>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {currentView === "storefront" && (
          <Storefront
            packages={packages}
            paymentGateways={paymentGateways}
            onGoToAdmin={() => setCurrentView("admin-dashboard")}
          />
        )}

        {currentView === "admin-dashboard" && (
          <AdminDashboard
            currentEmail={userEmail}
            packages={packages}
            paymentGateways={paymentGateways}
            users={users}
            team={team}
            onNavigateTab={(tab) => {
              if (tab === "products") setCurrentView("admin-products");
              if (tab === "payments") setCurrentView("admin-payments");
              if (tab === "users") setCurrentView("admin-users");
              if (tab === "team") setCurrentView("admin-team");
            }}
          />
        )}

        {currentView === "admin-products" && (
          <AdminProducts
            packages={packages}
            onUpdatePackages={setPackages}
          />
        )}

        {currentView === "admin-payments" && (
          <AdminPayments
            gateways={paymentGateways}
            onUpdateGateways={setPaymentGateways}
          />
        )}

        {currentView === "admin-users" && (
          <AdminUsers
            users={users}
            onUpdateUsers={setUsers}
          />
        )}

        {currentView === "admin-team" && (
          <AdminTeam
            currentEmail={userEmail}
            team={team}
            onUpdateTeam={setTeam}
            onSwitchEmail={simulateEmail}
          />
        )}

        {currentView === "github-repo" && <GitHubRepoViewer />}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-zinc-800/80 bg-[#090909] py-8 px-6 text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-300">FILAX STORE</span>
            <span>·</span>
            <span>Protected Mandatory Login & WhatsApp Flow</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <button
              onClick={() => setCurrentView("storefront")}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Store
            </button>
            <button
              onClick={() => setCurrentView("admin-team")}
              className="hover:text-yellow-400 transition-colors cursor-pointer"
            >
              Access Matrix
            </button>
            <button
              onClick={() => setCurrentView("github-repo")}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              GitHub Setup
            </button>
            <span>WhatsApp Support: +94 77 123 4567</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      {/* MANDATORY LOGIN FLOW: All views wrapped in ProtectedRoute */}
      <ProtectedRoute>
        <MainAppLayout />
      </ProtectedRoute>
    </AuthProvider>
  );
}
