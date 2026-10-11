import React, { useState } from "react";
import { TopupPackage } from "../types";

interface AdminProductsProps {
  packages: TopupPackage[];
  onUpdatePackages: (updater: (prev: TopupPackage[]) => TopupPackage[]) => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  packages,
  onUpdatePackages,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<TopupPackage | null>(null);

  // Form states
  const [formGame, setFormGame] = useState("Free Fire MAX");
  const [formCategory, setFormCategory] = useState<TopupPackage["category"]>("Battle Royale");
  const [formPackage, setFormPackage] = useState("");
  const [formAmount, setFormAmount] = useState(520);
  const [formBonus, setFormBonus] = useState(52);
  const [formOriginalPrice, setFormOriginalPrice] = useState(2050);
  const [formSalePrice, setFormSalePrice] = useState(1890);
  const [formInStock, setFormInStock] = useState(true);
  const [formDelivery, setFormDelivery] = useState("Instant (1-3 min)");

  const openNewModal = () => {
    setEditingProduct(null);
    setFormGame("Free Fire MAX");
    setFormCategory("Battle Royale");
    setFormPackage("520 + 52 Bonus Diamonds");
    setFormAmount(520);
    setFormBonus(52);
    setFormOriginalPrice(2050);
    setFormSalePrice(1890);
    setFormInStock(true);
    setFormDelivery("Instant (1-3 min)");
    setIsModalOpen(true);
  };

  const openEditModal = (p: TopupPackage) => {
    setEditingProduct(p);
    setFormGame(p.gameTitle);
    setFormCategory(p.category);
    setFormPackage(p.packageLabel);
    setFormAmount(p.amount);
    setFormBonus(p.bonusAmount);
    setFormOriginalPrice(p.originalPrice);
    setFormSalePrice(p.salePrice);
    setFormInStock(p.inStock);
    setFormDelivery(p.deliveryTime);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this top-up package from catalog?")) {
      onUpdatePackages((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPackage) return;

    if (editingProduct) {
      onUpdatePackages((prev) =>
        prev.map((item) =>
          item.id === editingProduct.id
            ? {
                ...item,
                gameTitle: formGame,
                category: formCategory,
                packageLabel: formPackage,
                amount: Number(formAmount),
                bonusAmount: Number(formBonus),
                originalPrice: Number(formOriginalPrice),
                salePrice: Number(formSalePrice),
                inStock: formInStock,
                deliveryTime: formDelivery,
              }
            : item
        )
      );
    } else {
      const newPack: TopupPackage = {
        id: "pack-" + Date.now(),
        gameId: formGame.toLowerCase().includes("fire")
          ? "free-fire"
          : formGame.toLowerCase().includes("pubg")
          ? "pubg-mobile"
          : formGame.toLowerCase().includes("legends")
          ? "mlbb"
          : "codm",
        gameTitle: formGame,
        category: formCategory,
        packageLabel: formPackage,
        amount: Number(formAmount),
        bonusAmount: Number(formBonus),
        originalPrice: Number(formOriginalPrice),
        salePrice: Number(formSalePrice),
        currency: "LKR",
        inStock: formInStock,
        deliveryTime: formDelivery,
        iconType: formGame.toLowerCase().includes("pubg")
          ? "🪙"
          : formGame.toLowerCase().includes("legends")
          ? "🔮"
          : "💎",
      };
      onUpdatePackages((prev) => [newPack, ...prev]);
    }

    setIsModalOpen(false);
  };

  const filtered = packages.filter((p) => {
    const matchesCat = categoryFilter === "All" || p.category === categoryFilter;
    const matchesSearch =
      p.gameTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.packageLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              Catalog Management
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-xs font-mono text-zinc-400">Products</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Products & <span className="text-[#00ffff]">Price Editor</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Maintain top-up package denominations, pricing formulas, discount percentages, and categories.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2.5 text-xs font-bold font-mono uppercase tracking-wider rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,255,0.25)] self-start md:self-auto cursor-pointer"
        >
          <span>+</span>
          <span>Add New Package</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["All", "Battle Royale", "MOBA", "FPS / Tactical"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                categoryFilter === cat
                  ? "bg-zinc-800 text-cyan-400 border border-cyan-500/40 font-bold"
                  : "bg-zinc-900/60 text-zinc-400 hover:text-white border border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <input
            type="text"
            placeholder="Search game or pack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-800 bg-[#0d0d0d] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/90 text-xs font-mono uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Game Title</th>
                <th className="py-3.5 px-4 font-semibold">Package Label</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Price (LKR)</th>
                <th className="py-3.5 px-4 font-semibold">Stock</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filtered.map((p) => {
                const discount = Math.round(((p.originalPrice - p.salePrice) / p.originalPrice) * 100);

                return (
                  <tr key={p.id} className="hover:bg-zinc-900/40 transition-colors group">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{p.iconType}</span>
                        <div>
                          <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                            {p.gameTitle}
                          </div>
                          <span className="text-[11px] font-mono text-zinc-500">
                            {p.deliveryTime}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-xs text-zinc-200">
                      {p.packageLabel}
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-xs font-mono text-zinc-400">
                        {p.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-[#ffeb3b] tabular-nums">
                          {p.currency} {p.salePrice.toLocaleString()}
                        </span>
                        {p.originalPrice > p.salePrice && (
                          <span className="text-xs text-zinc-500 line-through tabular-nums">
                            {p.originalPrice}
                          </span>
                        )}
                        {discount > 0 && (
                          <span className="text-[10px] text-cyan-400 font-mono">
                            -{discount}%
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-xs">
                      <button
                        onClick={() => {
                          onUpdatePackages((prev) =>
                            prev.map((item) =>
                              item.id === p.id ? { ...item, inStock: !item.inStock } : item
                            )
                          );
                        }}
                        className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                          p.inStock
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-red-500/10 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {p.inStock ? "Active / In Stock" : "Disabled"}
                      </button>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="px-2.5 py-1 text-xs font-mono rounded bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        >
                          Edit Price
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="px-2.5 py-1 text-xs font-mono rounded text-red-400 hover:bg-red-950/40 border border-red-500/20 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-cyan-500/50 rounded-xl w-full max-w-lg p-6 shadow-[0_0_50px_rgba(0,255,255,0.15)]">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white font-mono">
                {editingProduct ? "Edit Top-Up Package" : "Create Top-Up Package"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Game Title
                  </label>
                  <select
                    value={formGame}
                    onChange={(e) => setFormGame(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Free Fire MAX">Free Fire MAX</option>
                    <option value="PUBG Mobile">PUBG Mobile</option>
                    <option value="Mobile Legends: Bang Bang">Mobile Legends: Bang Bang</option>
                    <option value="Call of Duty: Mobile">Call of Duty: Mobile</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Battle Royale">Battle Royale</option>
                    <option value="MOBA">MOBA</option>
                    <option value="FPS / Tactical">FPS / Tactical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Package Label
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 520 + 52 Bonus Diamonds"
                  value={formPackage}
                  onChange={(e) => setFormPackage(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Standard Retail (LKR)
                  </label>
                  <input
                    type="number"
                    required
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#ffeb3b] mb-1">
                    Filax Sale Price (LKR)
                  </label>
                  <input
                    type="number"
                    required
                    value={formSalePrice}
                    onChange={(e) => setFormSalePrice(Number(e.target.value))}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-[#ffeb3b] focus:outline-none focus:border-yellow-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="stockCheck"
                  checked={formInStock}
                  onChange={(e) => setFormInStock(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-cyan-400 focus:ring-0"
                />
                <label htmlFor="stockCheck" className="text-xs font-mono text-zinc-300">
                  Enable active instant top-up for this package
                </label>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black transition-colors cursor-pointer"
                >
                  {editingProduct ? "Save Changes" : "Create Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
