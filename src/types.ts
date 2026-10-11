export type Role = "admin" | "owner" | "moderator" | "customer";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  displayRole: "Admin" | "Owner" | "Moderator" | "Customer";
  addedAt: string;
  isSuperAdminIdentity?: boolean;
}

export interface GameItem {
  id: string;
  name: string;
  publisher: string;
  category: "Battle Royale" | "MOBA" | "FPS / Tactical" | "PC / Steam" | "Console";
  iconUrl: string;
  bannerUrl: string;
  idFormatExample: string;
  currencyName: string;
}

export interface TopupPackage {
  id: string;
  gameId: string;
  gameTitle: string;
  category: "Battle Royale" | "MOBA" | "FPS / Tactical" | "PC / Steam" | "Console";
  packageLabel: string;
  amount: number;
  bonusAmount: number;
  originalPrice: number;
  salePrice: number;
  currency: string;
  inStock: boolean;
  deliveryTime: string;
  iconType: string;
}

export interface PaymentChannel {
  id: string;
  type: "EzCash" | "Bank" | "PayHere";
  title: string;
  accountNumberOrId: string;
  accountHolderOrMode: string;
  instructions: string;
  feePercentage: number;
  isEnabled: boolean;
  accentColor: string;
  lastUpdated: string;
}

export interface GamerUser {
  id: string;
  name: string;
  gmail: string;
  whatsapp: string;
  walletBalance: number;
  totalOrders: number;
  isBanned: boolean;
  gameUid: string;
  registeredAt: string;
  lastActive: string;
}
