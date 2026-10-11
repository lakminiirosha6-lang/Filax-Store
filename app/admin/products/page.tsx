"use client";

import React, { useState } from "react";

export interface ProductItem {
  id: string;
  gameTitle: string;
  category: "Battle Royale" | "MOBA" | "FPS / Tactical" | "PC / Steam" | "Console";
  packageLabel: string;
  originalPrice: number;
  salePrice: number;
  currency: string;
  inStock: boolean;
  imageIcon: string;
  deliveryTime: string;
}

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: "ff-100",
    gameTitle: "Free Fire",
    category: "Battle Royale",
    packageLabel: "100 + 10 Bonus Diamonds",
    originalPrice: 450,
    salePrice: 380,
    currency: "LKR",
    inStock: true,
    imageIcon: "💎",
    deliveryTime: "Instant (1-3 min)",
  },
  {
    id: "ff-310",
    gameTitle: "Free Fire",
    category: "Battle Royale",
    packageLabel: "310 + 31 Bonus Diamonds",
    originalPrice: 1300,
    salePrice: 1150,
    currency: "LKR",
    inStock: true,
    imageIcon: "💎",
    deliveryTime: "Instant (1-3 min)",
  },
  {
    id: "ff-520",
    gameTitle: "Free Fire",
    category: "Battle Royale",
    packageLabel: "520 + 52 Bonus Diamonds",
    originalPrice: 2100,
    salePrice: 1890,
    currency: "LKR",
    inStock: true,
    imageIcon: "💎",
    deliveryTime: "Instant (1-3 min)",
  },
  {
    id: "pubg-60",
    gameTitle: "PUBG Mobile",
    category: "Battle Royale",
    packageLabel: "60 Unknown Cash (UC)",
    originalPrice: 420,
    salePrice: 360,
    currency: "LKR",
    inStock: true,
    imageIcon: "🪙",
    deliveryTime: "Instant (2-5 min)",
  },
  {
    id: "pubg-325",
    gameTitle: "PUBG Mobile",
    category: "Battle Royale",
    packageLabel: "325 Unknown Cash (UC)",
    originalPrice: 2200,
    salePrice: 1950,
    currency: "LKR",
    inStock: true,
    imageIcon: "🪙",
    deliveryTime: "Instant (2-5 min)",
  },
  {
    id: "mlbb-86",
    gameTitle: "Mobile Legends: Bang Bang",
    category: "MOBA",
    packageLabel: "86 Diamonds (Fast Top-Up)",
    originalPrice: 550,
    salePrice: 480,
    currency: "LKR",
    inStock: true,
    imageIcon: "🔮",
    deliveryTime: "Instant (1-2 min)",
  },
  {
    id: "mlbb-weekly",
    gameTitle: "Mobile Legends: Bang Bang",
    category: "MOBA",
    packageLabel: "Weekly Diamond Pass",
    originalPrice: 850,
    salePrice: 720,
    currency: "LKR",
    inStock: true,
    imageIcon: "🎫",
    deliveryTime: "Instant (1-2 min)",
  },
  {
    id: "codm-80",
    gameTitle: "Call of Duty: Mobile",
    category: "FPS / Tactical",
    packageLabel: "80 COD Points (CP)",
    originalPrice: 500,
    salePrice: 450,
    currency: "LKR",
    inStock: true,
    imageIcon: "🎖️",
    deliveryTime: "Instant (3-5 min)",
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Form states
  const [formGame, setFormGame] = useState("Free Fire");
  const [formCategory, setFormCategory] = useState<ProductItem["category"]>("Battle Royale");
  const [formPackage, setFormPackage] = useState("");
  const [formOriginalPrice, setFormOriginalPrice] = useState(1000);
  const [formSalePrice, setFormSalePrice] = useState(850);
  const [formCurrency, setFormCurrency] = useState("LKR");
  const [formInStock, setFormInStock] = useState(true);
  const [formDelivery, setFormDelivery] = useState("Instant (1-3 min)");

  const openNewModal = () => {
    setEditingProduct(null);
    setFormGame("Free Fire");
    setFormCategory("Battle Royale");
    setFormPackage("");
    setFormOriginalPrice(1000);
    setFormSalePrice(850);
    setFormCurrency("LKR");
    setFormInStock(true);
    setFormDelivery("Instant (1-3 min)");
    setIsModalOpen(true);
  };

  const openEditModal = (product: ProductItem) => {
    setEditingProduct(product);
    setFormGame(product.gameTitle);
    setFormCategory(product.category);
    setFormPackage(product.packageLabel);
    setFormOriginalPrice(product.originalPrice);
    setFormSalePrice(product.salePrice);
    setFormCurrency(product.currency);
    setFormInStock(product.inStock);
    setFormDelivery(product.deliveryTime);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this top-up package?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPackage) return;

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                gameTitle: formGame,
                category: formCategory,
                packageLabel: formPackage,
                originalPrice: Number(formOriginalPrice),
                salePrice: Number(formSalePrice),
                currency: formCurrency,
                inStock: formInStock,
                deliveryTime: formDelivery,
              }
            : p
        )
      );
    } else {
      const newProd: ProductItem = {
        id: "prod-" + Date.now(),
        gameTitle: formGame,
        category: formCategory,
        packageLabel: formPackage,
        originalPrice: Number(formOriginalPrice),
        salePrice: Number(formSalePrice),
        currency: formCurrency,
        inStock: formInStock,
        imageIcon: formGame.includes("PUBG") ? "🪙" : formGame.includes("Legends") ? "🔮" : "💎",
        deliveryTime: formDelivery,
      };
      setProducts((prev) => [newProd, ...prev]);
    }

    setIsModalOpen(false);
  };

  const filteredProducts = products.filter((p) => {
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
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Catalog Engine</span>
            <span className="text-zinc-600">/</span>
            <span className="text-xs font-mono text-zinc-400">Top-Up Packages</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Product & <span className="text-[#00ffff]">Price Editor</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Maintain diamond & UC package denominations, pricing formulas, and game catalog categories.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2.5 text-xs font-bold font-mono uppercase tracking-wider rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,255,0.25)] self-start md:self-auto"
        >
          <span>+</span>
          <span>Add New Package</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["All", "Battle Royale", "MOBA", "FPS / Tactical", "PC / Steam"].map((cat) => (
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

        {/* Search */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search game or package..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-xl border border-zinc-800 bg-[#0d0d0d] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/90 text-xs font-mono uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Game Title</th>
                <th className="py-3.5 px-4 font-semibold">Package</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Price (LKR)</th>
                <th className="py-3.5 px-4 font-semibold">Stock</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filteredProducts.map((p) => {
                const discountPercent = Math.round(((p.originalPrice - p.salePrice) / p.originalPrice) * 100);

                return (
                  <tr key={p.id} className="hover:bg-zinc-900/40 transition-colors group">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{p.imageIcon}</span>
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
                        {discountPercent > 0 && (
                          <span className="text-[10px] text-cyan-400 font-mono">
                            -{discountPercent}%
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-xs">
                      <button
                        onClick={() => {
                          setProducts((prev) =>
                            prev.map((item) =>
                              item.id === p.id ? { ...item, inStock: !item.inStock } : item
                            )
                          );
                        }}
                        className={`px-2 py-0.5 rounded text-xs transition-colors ${
                          p.inStock
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-red-500/10 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {p.inStock ? "Active / In Stock" : "Sold Out"}
                      </button>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="px-2.5 py-1 text-xs font-mono rounded bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                        >
                          Edit Price
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="px-2.5 py-1 text-xs font-mono rounded text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-500/20 transition-colors"
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

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-cyan-500/50 rounded-xl w-full max-w-lg p-6 shadow-[0_0_50px_rgba(0,255,255,0.15)]">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white font-mono">
                {editingProduct ? "Edit Top-Up Package" : "Create New Top-Up Package"}
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
                    <option value="Free Fire">Free Fire</option>
                    <option value="PUBG Mobile">PUBG Mobile</option>
                    <option value="Mobile Legends: Bang Bang">Mobile Legends: Bang Bang</option>
                    <option value="Call of Duty: Mobile">Call of Duty: Mobile</option>
                    <option value="Steam Wallet Card">Steam Wallet Card</option>
                    <option value="PlayStation Network">PlayStation Network</option>
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
                    <option value="PC / Steam">PC / Steam</option>
                    <option value="Console">Console</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Package Name & Amount
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Standard Retail Price (LKR)
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

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Estimated Delivery Window
                </label>
                <input
                  type="text"
                  value={formDelivery}
                  onChange={(e) => setFormDelivery(e.target.value)}
                  placeholder="Instant (1-3 min)"
                  className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={formInStock}
                  onChange={(e) => setFormInStock(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-cyan-400 focus:ring-0"
                />
                <label htmlFor="inStockCheck" className="text-xs font-mono text-zinc-300">
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
                  className="px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black transition-colors"
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
}
