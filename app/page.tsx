import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-zinc-800/80 bg-[#0d0d0d]/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-yellow-400 p-[1px] flex items-center justify-center">
              <span className="w-full h-full bg-[#0a0a0a] rounded-[7px] flex items-center justify-center text-cyan-400 font-bold">
                F
              </span>
            </span>
            <span className="font-extrabold tracking-tight text-white text-lg">
              FILAX <span className="text-[#ffeb3b]">STORE</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black transition-colors"
            >
              Admin Dashboard →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto text-center">
        <span className="text-xs font-mono uppercase text-[#00ffff] tracking-widest bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 rounded-full">
          Instant Gaming Top-Up Platform
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mt-6">
          Level Up Your Game With <span className="text-[#ffeb3b]">Filax Store</span>
        </h1>
        <p className="text-base text-zinc-400 max-w-2xl mx-auto mt-4">
          Direct top-ups for Free Fire, PUBG Mobile, Mobile Legends, and Call of Duty with instant delivery via EzCash, Bank Transfer, and PayHere.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/admin"
            className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold font-mono text-sm transition-all"
          >
            Open Admin Console
          </Link>
          <a
            href="https://wa.me/94771234567"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-yellow-400 text-white font-mono text-sm transition-all"
          >
            WhatsApp Support: +94 77 123 4567
          </a>
        </div>
      </section>
    </div>
  );
}
