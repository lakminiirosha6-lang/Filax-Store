/**
 * Filax Store - Role-Based Access Control (RBAC)
 * 
 * SPECIAL REQUIREMENT:
 * Super Admin email is "lakminiirosha6@gmail.com".
 * His display role MUST be "Admin" in all UI labels and tables,
 * but he holds the exclusive SUPER POWER to add/promote Owners and Admins.
 * No other Admin can add or promote an Owner.
 */

export const SUPER_ADMIN_EMAIL = "lakminiirosha6@gmail.com";

export type Role = "admin" | "owner" | "moderator" | "customer";

export interface RolePermissions {
  displayRole: "Admin" | "Owner" | "Moderator" | "Customer";
  isSuperAdmin: boolean;
  canAddOwner: boolean;
  canAddAdmin: boolean;
  canManageTeam: boolean;
  canManageProducts: boolean;
  canManagePayments: boolean;
  canManageUsers: boolean;
  canEditWallets: boolean;
  canBanUsers: boolean;
}

/**
 * Returns exact permission matrix according to email and assigned role.
 * lakminiirosha6@gmail.com always gets displayRole: "Admin" with canAddOwner: true
 */
export function getPermissions(email?: string | null, role: Role = "customer"): RolePermissions {
  const normalizedEmail = (email || "").trim().toLowerCase();
  const isSuperAdmin = normalizedEmail === SUPER_ADMIN_EMAIL.toLowerCase();

  // Super Admin override: displayRole is strictly "Admin", but has super powers
  if (isSuperAdmin) {
    return {
      displayRole: "Admin",
      isSuperAdmin: true,
      canAddOwner: true,
      canAddAdmin: true,
      canManageTeam: true,
      canManageProducts: true,
      canManagePayments: true,
      canManageUsers: true,
      canEditWallets: true,
      canBanUsers: true,
    };
  }

  // Standard Admin: Can manage store, but CANNOT add or promote Owners!
  if (role === "admin") {
    return {
      displayRole: "Admin",
      isSuperAdmin: false,
      canAddOwner: false, // RESTRICTED: Only lakminiirosha6@gmail.com can add Owners
      canAddAdmin: false,
      canManageTeam: true,
      canManageProducts: true,
      canManagePayments: true,
      canManageUsers: true,
      canEditWallets: true,
      canBanUsers: true,
    };
  }

  // Owner: High-level store owner (cannot add owners or mutate super admin permissions)
  if (role === "owner") {
    return {
      displayRole: "Owner",
      isSuperAdmin: false,
      canAddOwner: false,
      canAddAdmin: false,
      canManageTeam: false,
      canManageProducts: true,
      canManagePayments: true,
      canManageUsers: true,
      canEditWallets: true,
      canBanUsers: true,
    };
  }

  // Moderator
  if (role === "moderator") {
    return {
      displayRole: "Moderator",
      isSuperAdmin: false,
      canAddOwner: false,
      canAddAdmin: false,
      canManageTeam: false,
      canManageProducts: false,
      canManagePayments: false,
      canManageUsers: true,
      canEditWallets: false,
      canBanUsers: true,
    };
  }

  // Customer / Default
  return {
    displayRole: "Customer",
    isSuperAdmin: false,
    canAddOwner: false,
    canAddAdmin: false,
    canManageTeam: false,
    canManageProducts: false,
    canManagePayments: false,
    canManageUsers: false,
    canEditWallets: false,
    canBanUsers: false,
  };
}

export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}
