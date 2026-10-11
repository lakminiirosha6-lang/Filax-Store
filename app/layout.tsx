import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Filax Store | Official Gaming Top-Up Store",
  description: "Instant gaming top-up for Free Fire Diamonds, PUBG UC, Mobile Legends, and COD Points. Fast delivery via EzCash, Bank Transfer, and PayHere.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0a] text-zinc-100 antialiased selection:bg-cyan-500/20 selection:text-cyan-300">
        {children}
      </body>
    </html>
  );
}
