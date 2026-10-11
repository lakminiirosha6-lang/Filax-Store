import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export const WhatsAppModal: React.FC = () => {
  const { userEmail, userName, userPhoto, saveWhatsappNumber, logout } = useAuth();
  const [inputNumber, setInputNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const res = await saveWhatsappNumber(inputNumber);
    if (!res.success) {
      setErrorMsg(res.error || "අංකය වැරදියි!");
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    /* Modal Backdrop - NOT Closable (No close button, backdrop click does nothing) */
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#111111] border border-cyan-400/60 rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-[0_0_60px_rgba(0,255,255,0.2)] relative">
        {/* Top Header Badge */}
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 p-[1px] flex items-center justify-center">
            <div className="w-full h-full bg-[#0a0a0a] rounded-[11px] flex items-center justify-center text-xl">
              💬
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-sans">
              WhatsApp අංකය සනාථ කරන්න
            </h3>
            <span className="text-[11px] font-mono text-zinc-400">
              One-Time Verification Required
            </span>
          </div>
        </div>

        {/* User Card */}
        <div className="my-4 p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center gap-3">
          {userPhoto ? (
            <img
              src={userPhoto}
              alt={userName}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full border border-cyan-400/40"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center text-sm font-mono">
              {userName.charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate">{userName}</div>
            <div className="text-[11px] font-mono text-zinc-400 truncate">{userEmail}</div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Verified
          </span>
        </div>

        {/* Instruction Text */}
        <div className="text-xs text-zinc-300 space-y-1 mb-4 leading-relaxed font-sans">
          <p className="font-semibold text-yellow-400">
            WhatsApp Number එක ඇතුලත් කරන්න - ඇණවුම් තොරතුරු එවීමට
          </p>
          <p className="text-zinc-400 text-[11px]">
            ඔබ මිලදී ගන්නා Diamonds / UC කේත සහ Payment Receipts කෙලින්ම ඔබගේ WhatsApp ගිණුමට ලබාදීමට මෙම අංකය භාවිතා වේ.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              WhatsApp අංකය (Format: 07XXXXXXXX)
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="0771234567"
                value={inputNumber}
                onChange={(e) => {
                  setInputNumber(e.target.value);
                  setErrorMsg(null);
                }}
                className="w-full bg-[#0a0a0a] border border-zinc-700 focus:border-cyan-400 rounded-xl px-4 py-3 text-base text-white placeholder-zinc-600 focus:outline-none font-mono tracking-wider font-bold"
              />
              <span className="absolute right-3 top-3 text-xs font-mono text-zinc-500">
                {inputNumber.length}/10
              </span>
            </div>

            {errorMsg && (
              <p className="mt-2 text-xs font-mono text-red-400 bg-red-950/40 p-2 rounded border border-red-500/30">
                ⛔ {errorMsg}
              </p>
            )}
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
            <span>ස්වයංක්‍රීය wa.me link එක:</span>
            <span className="text-cyan-400 font-bold">
              {inputNumber.startsWith("07") && inputNumber.length === 10
                ? `https://wa.me/94${inputNumber.substring(1)}`
                : "wa.me/947XXXXXXXX"}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || inputNumber.length !== 10}
            className={`w-full py-3.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer ${
              inputNumber.length === 10
                ? "bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-black hover:brightness-110 shadow-[0_0_25px_rgba(0,255,255,0.3)]"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "තහවුරු කරමින් පවතී..." : "තහවුරු කර Store එකට පිවිසෙන්න →"}
          </button>
        </form>

        {/* Safe Logout Escape Hatch if wrong Google account was used */}
        <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-500">
          <span>වෙනත් Account එකකින් Login වීමට:</span>
          <button
            type="button"
            onClick={logout}
            className="text-red-400 hover:underline cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
