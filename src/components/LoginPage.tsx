import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export const LoginPage: React.FC = () => {
  const { signInWithGoogle, authError, simulateEmail, isConfigured } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await signInWithGoogle();
    } catch {
      // Gracefully handled inside AuthContext
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Gaming Brand Card */}
        <div className="bg-[#121212] border border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-[0_0_80px_rgba(0,0,0,0.8)] relative overflow-hidden text-center">
          {/* Neon Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-yellow-400 to-cyan-400" />

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-yellow-400 p-[2px] shadow-[0_0_30px_rgba(0,255,255,0.3)]">
              <div className="w-full h-full bg-[#0a0a0a] rounded-[14px] flex items-center justify-center text-cyan-400 font-black text-2xl">
                F
              </div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
            FILAX <span className="text-[#ffeb3b]">STORE</span>
          </h1>
          <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase mt-1">
            Official Gaming Top-Up Platform
          </p>

          <p className="text-xs text-zinc-400 mt-4 leading-relaxed font-sans">
            Free Fire Diamonds, PUBG UC, සහ Mobile Legends Top-Up සිදුකිරීමට ඔබගේ Google ගිණුමෙන් Login වන්න.
          </p>

          {/* Info / Notice message if Firebase API key is pending */}
          {authError && (
            <div className="mt-4 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs font-mono text-left space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-400">
                <span>⚠️</span>
                <span>Firebase Authentication සටහන:</span>
              </div>
              <p className="text-[11px] leading-relaxed">{authError}</p>
            </div>
          )}

          {!isConfigured && !authError && (
            <div className="mt-4 p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono text-left flex items-center gap-2">
              <span>💡</span>
              <span>Render හි VITE_FIREBASE_API_KEY සකසන තුරු Demo Mode මගින් පරීක්ෂා කළ හැක.</span>
            </div>
          )}

          {/* The Single Primary Button: Google එකෙන් Login වෙන්න */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-[0_0_30px_rgba(255,255,255,0.2)] cursor-pointer group"
            >
              {/* Google G SVG */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoggingIn ? "සම්බන්ධ වෙමින් පවතී..." : "Google එකෙන් Login වෙන්න"}</span>
            </button>

            {/* Direct Super Admin Instant Login Button */}
            <button
              type="button"
              onClick={() => simulateEmail("lakminiirosha6@gmail.com")}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-yellow-400 hover:text-yellow-300 font-mono text-xs font-bold border border-zinc-800 hover:border-yellow-400/40 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>★</span>
              <span>Super Admin ලෙස පිවිසෙන්න (lakminiirosha6@gmail.com)</span>
            </button>

            {/* Feature points */}
            <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-zinc-400">
              <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800">
                <span className="text-[#00ffff] block font-bold">100% SECURE</span>
                <span>Firebase Auth</span>
              </div>
              <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800">
                <span className="text-[#ffeb3b] block font-bold">INSTANT</span>
                <span>UID Top-Up</span>
              </div>
              <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800">
                <span className="text-[#00ffff] block font-bold">WHATSAPP</span>
                <span>Receipts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-4 text-center text-zinc-600 text-[11px] font-mono">
          🔒 Encrypted SSL Gateway · Powered by Google Firebase
        </div>
      </div>
    </div>
  );
};
