import React, { useState } from "react";
import { GameItem, TopupPackage, PaymentChannel } from "../types";
import { GAMES_LIST, heroBannerImg } from "../data/mockData";

interface StorefrontProps {
  packages: TopupPackage[];
  paymentGateways: PaymentChannel[];
  onGoToAdmin: () => void;
}

export const Storefront: React.FC<StorefrontProps> = ({
  packages,
  paymentGateways,
  onGoToAdmin,
}) => {
  const [selectedGame, setSelectedGame] = useState<GameItem>(GAMES_LIST[0]);
  const [playerUid, setPlayerUid] = useState("");
  const [isUidVerified, setIsUidVerified] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TopupPackage | null>(
    packages.find((p) => p.gameId === GAMES_LIST[0].id) || packages[0]
  );
  const [selectedPayment, setSelectedPayment] = useState<PaymentChannel>(
    paymentGateways.find((g) => g.isEnabled) || paymentGateways[0]
  );
  const [playerWhatsapp, setPlayerWhatsapp] = useState("");
  const [orderModalData, setOrderModalData] = useState<any>(null);

  // Filter packages for currently selected game
  const gamePackages = packages.filter((p) => p.gameId === selectedGame.id && p.inStock);

  const handleVerifyUid = () => {
    if (!playerUid.trim()) return;
    setIsUidVerified(true);
  };

  const handleSelectGame = (game: GameItem) => {
    setSelectedGame(game);
    setIsUidVerified(false);
    const firstPack = packages.find((p) => p.gameId === game.id && p.inStock);
    if (firstPack) setSelectedPackage(firstPack);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerUid.trim() || !selectedPackage) return;

    const orderId = "FLX-" + Math.floor(100000 + Math.random() * 900000);
    const calculatedFee = selectedPayment
      ? (selectedPackage.salePrice * selectedPayment.feePercentage) / 100
      : 0;
    const finalTotal = selectedPackage.salePrice + calculatedFee;

    const order = {
      orderId,
      game: selectedGame.name,
      package: selectedPackage.packageLabel,
      amount: selectedPackage.amount + (selectedPackage.bonusAmount || 0),
      currency: selectedGame.currencyName,
      playerUid,
      whatsapp: playerWhatsapp || "+94 77 123 4567",
      paymentMethod: selectedPayment.title,
      subtotal: selectedPackage.salePrice,
      fee: calculatedFee,
      total: finalTotal,
      timestamp: new Date().toLocaleTimeString(),
    };

    setOrderModalData(order);
  };

  return (
    <div className="space-y-12">
      {/* Hero Banner Section */}
      <section className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-[#0e0e0e] shadow-2xl">
        <div className="relative h-64 md:h-80 w-full overflow-hidden">
          <img
            src={heroBannerImg}
            alt="Filax Gaming Topup"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />

          {/* Banner Text Overlays */}
          <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#00ffff] bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded">
                Direct Diamond & UC Top-Up
              </span>
              <span className="text-xs text-yellow-400 font-mono">
                ⚡ 1-3 Min Instant Delivery
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-none">
              FILAX <span className="text-[#ffeb3b]">STORE</span>
            </h1>
            <p className="text-xs md:text-sm text-zinc-300 mt-2 font-medium leading-relaxed">
              Sri Lanka's trusted gaming currency provider. Pay securely with EzCash, Direct Bank Transfer, or PayHere cards with automated UID delivery.
            </p>
          </div>
        </div>

        {/* Feature highlight bar */}
        <div className="bg-[#121212] border-t border-zinc-800/80 px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="text-[#00ffff]">✓</span> Official Server API Top-up
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="text-[#ffeb3b]">★</span> 100% Anti-Ban Guarantee
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="text-[#00ffff]">⚡</span> WhatsApp 24/7 Agent
            </div>
          </div>
          <button
            onClick={onGoToAdmin}
            className="text-xs font-mono text-zinc-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            <span>Staff Portal</span>
            <span>→</span>
          </button>
        </div>
      </section>

      {/* Main Top-up Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Game + UID + Package + Payment */}
        <div className="lg:col-span-2 space-y-8">
          {/* STEP 1: Choose Game */}
          <section className="bg-[#0f0f0f] border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-6 w-6 rounded bg-cyan-500/20 text-[#00ffff] font-mono font-bold text-xs flex items-center justify-center border border-cyan-500/40">
                1
              </span>
              <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                Select Your Game
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {GAMES_LIST.map((game) => {
                const isSelected = selectedGame.id === game.id;
                return (
                  <button
                    key={game.id}
                    onClick={() => handleSelectGame(game)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col items-center sm:items-start text-center sm:text-left ${
                      isSelected
                        ? "bg-zinc-800/90 border-[#00ffff] shadow-[0_0_15px_rgba(0,255,255,0.25)] scale-[1.02]"
                        : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden mb-2 border border-zinc-700 bg-black">
                      <img
                        src={game.iconUrl}
                        alt={game.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs font-bold text-white block truncate w-full">
                      {game.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono block">
                      {game.publisher}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* STEP 2: Player ID / Zone ID */}
          <section className="bg-[#0f0f0f] border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-6 w-6 rounded bg-cyan-500/20 text-[#00ffff] font-mono font-bold text-xs flex items-center justify-center border border-cyan-500/40">
                2
              </span>
              <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                Enter Account Credentials
              </h2>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-mono text-zinc-400">
                {selectedGame.idFormatExample}
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Enter Game ID here..."
                  value={playerUid}
                  onChange={(e) => {
                    setPlayerUid(e.target.value);
                    setIsUidVerified(false);
                  }}
                  className="flex-1 bg-[#0a0a0a] border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 font-mono"
                />
                <button
                  type="button"
                  onClick={handleVerifyUid}
                  className="px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-bold text-cyan-400 border border-cyan-500/30 transition-colors whitespace-nowrap"
                >
                  Verify Nickname
                </button>
              </div>

              {isUidVerified && (
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-lg flex items-center gap-2 text-xs font-mono text-emerald-300">
                  <span className="font-bold">✓ Valid Account:</span>
                  <span>Gamer Tag "ShadowSniper_LK" verified on {selectedGame.name} server</span>
                </div>
              )}
            </div>
          </section>

          {/* STEP 3: Choose Package */}
          <section className="bg-[#0f0f0f] border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded bg-yellow-400/20 text-[#ffeb3b] font-mono font-bold text-xs flex items-center justify-center border border-yellow-400/40">
                  3
                </span>
                <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                  Select {selectedGame.currencyName} Package
                </h2>
              </div>
              <span className="text-xs font-mono text-zinc-500">
                {gamePackages.length} options available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {gamePackages.map((pkg) => {
                const isSelected = selectedPackage?.id === pkg.id;

                return (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 relative group flex flex-col justify-between ${
                      isSelected
                        ? "bg-zinc-800/90 border-[#ffeb3b] shadow-[0_0_15px_rgba(255,235,59,0.2)] scale-[1.01]"
                        : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{pkg.iconType}</span>
                        {pkg.bonusAmount > 0 && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-[#00ffff] border border-cyan-500/30">
                            +{pkg.bonusAmount} BONUS
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-white group-hover:text-yellow-400 transition-colors">
                        {pkg.packageLabel}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500 mt-1">
                        {pkg.deliveryTime}
                      </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-zinc-800/80 flex items-baseline justify-between">
                      <span className="text-sm font-bold font-mono text-[#ffeb3b]">
                        LKR {pkg.salePrice.toLocaleString()}
                      </span>
                      {pkg.originalPrice > pkg.salePrice && (
                        <span className="text-xs text-zinc-500 line-through font-mono">
                          LKR {pkg.originalPrice}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* STEP 4: Choose Payment Method */}
          <section className="bg-[#0f0f0f] border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-6 w-6 rounded bg-cyan-500/20 text-[#00ffff] font-mono font-bold text-xs flex items-center justify-center border border-cyan-500/40">
                4
              </span>
              <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                Select Payment Channel
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {paymentGateways.filter((g) => g.isEnabled).map((gw) => {
                const isSelected = selectedPayment.id === gw.id;

                return (
                  <button
                    key={gw.id}
                    onClick={() => setSelectedPayment(gw)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-zinc-800 border-[#00ffff] shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                        : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-white">
                        {gw.type}
                      </span>
                      {gw.feePercentage === 0 ? (
                        <span className="text-[10px] font-mono text-emerald-400">
                          0% FEE
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-400">
                          +{gw.feePercentage}%
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-bold text-white">
                      {gw.title}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400 mt-2 truncate">
                      {gw.accountNumberOrId}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected payment details banner */}
            {selectedPayment && (
              <div className="mt-4 p-4 rounded-lg bg-[#0a0a0a] border border-zinc-800 text-xs font-mono space-y-1">
                <div className="text-cyan-400 font-bold">
                  {selectedPayment.title} Instructions:
                </div>
                <div className="text-zinc-300">
                  {selectedPayment.instructions}
                </div>
                <div className="text-zinc-500 text-[11px] pt-1">
                  Receiver Account: {selectedPayment.accountNumberOrId} ({selectedPayment.accountHolderOrMode})
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Col: Instant Order Summary & Checkout */}
        <div className="space-y-6">
          <div className="sticky top-20 bg-[#0f0f0f] border border-zinc-800 rounded-xl p-6 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-white uppercase font-mono tracking-wider pb-3 border-b border-zinc-800 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs text-[#00ffff]">Instant Checkout</span>
            </h3>

            {/* Summary Lines */}
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-400">Game:</span>
                <span className="text-white font-bold">{selectedGame.name}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-400">Player ID:</span>
                <span className="text-white font-bold truncate max-w-[150px]">
                  {playerUid || "—"}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-400">Top-up Pack:</span>
                <span className="text-white font-bold">
                  {selectedPackage?.packageLabel || "—"}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-400">Base Price:</span>
                <span className="text-[#ffeb3b]">
                  LKR {selectedPackage ? selectedPackage.salePrice.toLocaleString() : "0"}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-400">Payment Channel:</span>
                <span className="text-cyan-400 font-bold">{selectedPayment.type}</span>
              </div>

              {selectedPayment.feePercentage > 0 && selectedPackage && (
                <div className="flex justify-between py-1 border-b border-zinc-900">
                  <span className="text-zinc-400">Gateway Fee ({selectedPayment.feePercentage}%):</span>
                  <span className="text-zinc-400">
                    LKR {Math.round((selectedPackage.salePrice * selectedPayment.feePercentage) / 100)}
                  </span>
                </div>
              )}

              {/* Total Calculation */}
              <div className="pt-3 flex justify-between items-baseline text-sm">
                <span className="text-zinc-300 font-bold uppercase">Total Payable:</span>
                <span className="text-xl font-extrabold text-[#ffeb3b]">
                  LKR{" "}
                  {selectedPackage
                    ? Math.round(
                        selectedPackage.salePrice * (1 + selectedPayment.feePercentage / 100)
                      ).toLocaleString()
                    : "0"}
                </span>
              </div>
            </div>

            {/* WhatsApp notification field */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-800">
              <label className="block text-xs font-mono text-zinc-400">
                Your WhatsApp Number (for receipt & voucher)
              </label>
              <input
                type="text"
                placeholder="+94 77 XXX XXXX"
                value={playerWhatsapp}
                onChange={(e) => setPlayerWhatsapp(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            {/* Action Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={!playerUid.trim() || !selectedPackage}
              className={`w-full py-3.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg ${
                playerUid.trim() && selectedPackage
                  ? "bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 text-black hover:brightness-110 shadow-[0_0_25px_rgba(0,255,255,0.3)] cursor-pointer"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              }`}
            >
              {playerUid.trim() ? "Confirm & Pay Now" : "Enter Game ID to Continue"}
            </button>

            <div className="text-[11px] font-mono text-center text-zinc-500">
              🔒 256-bit SSL encrypted gaming payment portal
            </div>
          </div>
        </div>
      </div>

      {/* Order Complete Receipt Modal */}
      {orderModalData && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-cyan-400/60 rounded-2xl w-full max-w-md p-6 shadow-[0_0_60px_rgba(0,255,255,0.25)] relative">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <h3 className="text-base font-bold text-white font-mono">
                  Order Successfully Dispatched
                </h3>
              </div>
              <button
                onClick={() => setOrderModalData(null)}
                className="text-zinc-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="my-5 p-4 rounded-xl bg-[#0a0a0a] border border-zinc-800 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                <span className="text-zinc-500">Order Reference:</span>
                <span className="text-yellow-400 font-bold text-sm tracking-wider">
                  {orderModalData.orderId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Game & Package:</span>
                <span className="text-white font-bold">{orderModalData.package}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Target UID:</span>
                <span className="text-cyan-400 font-bold">{orderModalData.playerUid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Payment Gateway:</span>
                <span className="text-white">{orderModalData.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-800">
                <span className="text-zinc-400 font-bold">Total Paid:</span>
                <span className="text-yellow-400 font-bold text-base">
                  LKR {orderModalData.total.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              Receipt sent to WhatsApp: <span className="text-white">{orderModalData.whatsapp}</span>. Our automated delivery daemon is allocating the diamonds to your player ID right now.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setOrderModalData(null)}
                className="flex-1 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-bold transition-colors"
              >
                Done
              </button>
              <a
                href={`https://wa.me/94771234567?text=Hi%20Filax%20Store%2C%20I%20have%20placed%20order%20${orderModalData.orderId}%20for%20UID%20${orderModalData.playerUid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold text-center transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
