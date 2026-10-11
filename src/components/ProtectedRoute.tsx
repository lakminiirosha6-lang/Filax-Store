import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { LoginPage } from "./LoginPage";
import { WhatsAppModal } from "./WhatsAppModal";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, userEmail, hasWhatsappNumber, loading } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex items-center justify-center font-mono">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-xs text-cyan-400 tracking-wider uppercase">
            Verifying Session & Security Clearance...
          </div>
        </div>
      </div>
    );
  }

  // 1. If user NOT logged in -> Show /login page
  if (!currentUser && !userEmail) {
    return <LoginPage />;
  }

  // 2. If user logged in BUT no whatsappNumber in Firestore users/{uid} -> Show WhatsApp Number Collection Popup
  if (!hasWhatsappNumber) {
    return (
      <>
        {/* Render background store behind blur or modal directly */}
        <div className="filter blur-md pointer-events-none select-none">
          {children}
        </div>
        <WhatsAppModal />
      </>
    );
  }

  // 3. If user logged in AND has whatsappNumber -> Allow access to full website
  return <>{children}</>;
};
